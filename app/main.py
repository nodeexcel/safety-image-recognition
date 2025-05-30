import os, base64
from fastapi import FastAPI, Depends, UploadFile, Form, File, HTTPException
from fastapi.responses import JSONResponse
from app.utils import process_image, read_file

app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


ALLOWED_IMAGE_TYPES = {"image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"}

@app.post("/upload/")
def upload_image_and_text(
    image: UploadFile = File(...),
    prompt: str = Form(...)
):
    # Check MIME type
    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Only image files are allowed (png, jpg, jpeg, webp, gif).")

    # Read image (optional: process/save it)
    file_path = os.path.join(UPLOAD_DIR, image.filename)
    image_bytes = image.file.read()
    with open(file_path, "wb") as f:
        f.write(image_bytes)
    id = read_file(file_path)
    process_image(id, prompt)
    

    return JSONResponse(content={
        "filename": image.filename,
        "content_type": image.content_type,
        "text": prompt,
        # "image_size_bytes": image_bytes
    })

