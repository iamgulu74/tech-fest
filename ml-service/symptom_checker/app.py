from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

app = Flask(__name__)
CORS(app)

# Change working directory to the script's location so relative paths work
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Import chat after chdir so data_rnn.pth and intents.json are found
from chat import get_response

@app.post("/predict")
def predict():
    try:
        data = request.get_json()
        if not data or "message" not in data:
            return jsonify({"error": "No message provided"}), 400

        text = data["message"]
        response = get_response(text)
        return jsonify({"answer": response})
    except Exception as e:
        return jsonify({"error": str(e), "answer": ["error", "I encountered an issue. Please try rephrasing your symptoms."]}), 500

@app.get("/health")
def health():
    return jsonify({"status": "ok", "service": "Symptom Checker ML Bot"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print(f"[ML Bot] Symptom Checker running on port {port}")
    app.run(debug=False, port=port)
