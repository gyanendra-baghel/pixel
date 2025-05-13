from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import torch
import os
import requests

# Optional external API to store the caption
CAPTION_API = os.getenv("CAPTION_API")

def load_model():
    print("🚀 Starting to load the model and processor...")
    
    # Load processor and model
    processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base", use_fast=True)
    model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
    
    print("✅ Model and processor loaded successfully!")
    return processor, model

# Load the model and processor once
processor, model = load_model()

def generate_caption(local_path, image_id):
    # Load and preprocess image
    image = Image.open(local_path).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")

    # Generate caption
    with torch.no_grad():
        output = model.generate(**inputs)

    caption = processor.decode(output[0], skip_special_tokens=True)

    # Optional: Send caption to external API
    if CAPTION_API:
        try:
            response = requests.post(
                CAPTION_API,
                json={"image_id": image_id, "caption": caption},
                timeout=10
            )
            response.raise_for_status()
        except requests.RequestException as e:
            print(f"Failed to send caption to {CAPTION_API}: {e}")
    else:
        print(f"Caption API not configured. Caption: {caption}")

    return caption
