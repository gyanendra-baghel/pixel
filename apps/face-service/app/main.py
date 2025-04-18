from fastapi import FastAPI, UploadFile, File
from app import embedding, qdrant_utils, postgres_utils, file_utils, config

app = FastAPI()

@app.on_event("startup")
def init():
    qdrant_utils.init_collection()
    # Ensure images directory exists
    import os
    os.makedirs("images", exist_ok=True)

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image_id = file_utils.save_image_locally(image_bytes)
    vector = embedding.extract_embedding(image_bytes).tolist()
    qdrant_utils.insert_face_embedding(vector, image_id)
    postgres_utils.save_metadata(image_id)
    return {"message": "Uploaded", "image_id": image_id}

@app.post("/search")
async def search(file: UploadFile = File(...)):
    image_bytes = await file.read()
    query_vector = embedding.extract_embedding(image_bytes).tolist()
    results = qdrant_utils.search_similar_faces(query_vector)
    return {
        "similar_faces": [r.payload for r in results]
    }
