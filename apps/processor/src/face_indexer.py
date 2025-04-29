import face_recognition
import numpy as np
from qdrant_client import QdrantClient
from qdrant_client.http.models import PointStruct, VectorParams, Distance
import os
import uuid

QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")

client = QdrantClient(host=QDRANT_HOST)
COLLECTION_NAME = "face-gallery"

# Create collection if not exists
client.recreate_collection(
    collection_name=COLLECTION_NAME,
    vectors_config=VectorParams(size=128, distance=Distance.COSINE)
)

def index_faces(local_path, image_path, image_id=''):
    image = face_recognition.load_image_file(local_path)
    face_locations = face_recognition.face_locations(image)

    if not face_locations:
        print("No faces found in:", local_path)
        return

    encodings = face_recognition.face_encodings(image, face_locations)
    points = []

    for idx, encoding in enumerate(encodings):
        point = PointStruct(
            id=str(uuid.uuid4()),
            vector=encoding.tolist(),
            payload={
                "image_id": image_id,    
                "image_path": image_path,
                "face_index": idx
            }
        )
        points.append(point)

    client.upsert(collection_name=COLLECTION_NAME, points=points)
    print(f"Indexed {len(points)} faces from {image_path} with image_id {image_id}")



def search_faces(image_path, top_k=5):
    image = face_recognition.load_image_file(image_path)
    face_locations = face_recognition.face_locations(image)

    if not face_locations:
        print("No faces found in:", image_path)
        return {"error": "No faces detected in the uploaded image."}

    encodings = face_recognition.face_encodings(image, face_locations)

    if not encodings:
        print("No encodings generated for faces:", image_path)
        return {"error": "No valid face encodings found in the uploaded image."}

    query_vector = encodings[0].tolist()

    search_result = client.search(
        collection_name=COLLECTION_NAME,
        query_vector=query_vector,
        limit=top_k,
        with_payload=True
    )

    faces = []
    for hit in search_result:
        faces.append({
            "score": hit.score,
            "image_id": hit.payload.get("image_id"),
            "image_path": hit.payload.get("image_path"),
            "face_index": hit.payload.get("face_index")
        })

    return {"matches": faces}
