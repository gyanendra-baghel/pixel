from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance
import os

QDRANT_HOST = os.getenv("QDRANT_HOST", "qdrant")
COLLECTION_NAME = "faces"

client = QdrantClient(host=QDRANT_HOST, port=6333)

def init_collection():
    client.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=512, distance=Distance.COSINE),
    )

def insert_face_embedding(vector: list, image_id: str):
    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[PointStruct(id=image_id, vector=vector, payload={"image_id": image_id})],
    )

def search_similar_faces(vector: list, k=5):
    return client.search(collection_name=COLLECTION_NAME, query_vector=vector, limit=k)
