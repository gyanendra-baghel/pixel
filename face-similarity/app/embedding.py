from insightface.app import FaceAnalysis
import numpy as np
import cv2

app = FaceAnalysis(name="buffalo_l", providers=["CPUExecutionProvider"])
app.prepare(ctx_id=0, det_size=(640, 640))

def extract_embedding(image_bytes: bytes) -> np.ndarray:
    img = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
    faces = app.get(img)
    if not faces:
        raise ValueError("No face detected")
    return faces[0].embedding
