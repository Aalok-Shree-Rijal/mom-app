from flask import Flask, request, send_file
from flask_cors import CORS
import edge_tts
import asyncio
import io
import os

app = Flask(__name__)
CORS(app)

@app.route('/speak', methods=['POST'])
def speak():
    data = request.get_json()
    text = data.get('text', '')
    
    async def generate():
        communicate = edge_tts.Communicate(text, voice="ne-NP-SagarNeural")
        audio_data = b""
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_data += chunk["data"]
        return audio_data
    
    audio_bytes = asyncio.run(generate())
    return send_file(
        io.BytesIO(audio_bytes),
        mimetype='audio/mpeg',
        as_attachment=False
    )

if __name__ == '__main__':
    app.run(port=5050)