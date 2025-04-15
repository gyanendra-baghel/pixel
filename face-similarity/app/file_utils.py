import uuid
import os

IMAGE_FOLDER = "images"

os.makedirs(IMAGE_FOLDER, exist_ok=True)

def save_image_locally(image_bytes: bytes) -> str:
    image_id = str(uuid.uuid4())
    image_path = os.path.join(IMAGE_FOLDER, f"{image_id}.jpg")
    with open(image_path, "wb") as f:
        f.write(image_bytes)
    return image_id

def load_image(image_id: str) -> bytes:
    image_path = os.path.join(IMAGE_FOLDER, f"{image_id}.jpg")
    with open(image_path, "rb") as f:
        return f.read()
