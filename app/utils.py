from openai import OpenAI

client = OpenAI(api_key="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")

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