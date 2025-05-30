import os
from openai import OpenAI
from dotend import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OpenAI_Key"))

def process_image(id, prompt):
    response = client.responses.create(
        model="gpt-4.1-mini",
        input=[{
            "role": "user",
            "content": [
                {"type": "input_text", "text": prompt},
                {
                    "type": "input_image",
                    "file_id": str(id),
                },
            ]}])

    print(response.output_text)
    
def read_file(file_path):
    with open(file_path, "rb") as f:
        result = client.files.create(
        file= f,
        purpose="vision",
    )
    return result.id