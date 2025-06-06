from kafka import KafkaConsumer
import json
import os
import requests
import threading
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
import uvicorn

from src.face_indexer import index_faces, search_faces
from src.captioning import generate_caption

KAFKA_BROKER = os.getenv("KAFKA_BROKER", "kafka:9092")
STORAGE_SERVICE_URL = os.getenv("STORAGE_SERVICE_URL", "http://uploader:8000")

# === FASTAPI App ===
app = FastAPI()

@app.get("/api/face/health")
def health():
    return JSONResponse(content={"health": "good"})

@app.post("/api/face/search")
async def search_face(file: UploadFile = File(...), gallery_id: str = Form(None)):
    local_path = f"/tmp/{file.filename}"
    
    with open(local_path, "wb") as f:
        content = await file.read()
        f.write(content)

    try:
        # Search in face database
        results = search_faces(local_path, gallery_id=gallery_id)
        return JSONResponse(content={"results": results})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

    finally:
        if os.path.exists(local_path):
            os.remove(local_path)

# === KAFKA CONSUMER ===
def consume_images():
    consumer = KafkaConsumer(
        "new-gallery-img",
        bootstrap_servers=KAFKA_BROKER,
        value_deserializer=lambda m: json.loads(m.decode("utf-8")),
        auto_offset_reset="earliest",
        enable_auto_commit=True,
        group_id="face-processor"
    )

    print("Processor started. Listening to new-gallery-img topic...")

    for message in consumer:
        data = message.value
        image_path = data["image_path"]
        image_id = data["image_id"]
        gallery_id = data["gallery_id"]

        print(f"Processing image: {image_path}")

        if not image_path:
            print("Image Path not Provided")
            continue
        elif not gallery_id:
            print("Gallery Id not provided")
            continue

        image_url = f"{STORAGE_SERVICE_URL}/{image_path}"
        local_path = f"/tmp/{os.path.basename(image_path)}"

        try:
            # Download the image
            response = requests.get(image_url)
            response.raise_for_status()

            # Save locally
            with open(local_path, 'wb') as f:
                f.write(response.content)

            index_faces(local_path, image_path, image_id, gallery_id)
            caption = generate_caption(local_path, image_id)
            print("Caption:", caption)

        except Exception as e:
            print(f"Error processing {image_path}: {e}")

        finally:
            if os.path.exists(local_path):
                os.remove(local_path)

# === MAIN STARTUP ===
if __name__ == "__main__":
    # Start Kafka Consumer in a thread
    print("Running Consumer Thread...")

    threading.Thread(target=consume_images, daemon=True).start()

    # Start API server (FastAPI)
    print("Starting Server")
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8010)))
    print("Server started")
