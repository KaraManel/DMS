from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # Allow frontend to access backend


# Load data from JSON file
def load_data():
    with open("data.json", "r") as file:
        return json.load(file)


@app.route("/api/users", methods=["GET"])
def get_users():
    data = load_data()
    return jsonify(data["users"])


@app.route("/api/folders", methods=["GET"])
def get_folders():
    data = load_data()
    return jsonify(data["folders"])


if __name__ == "__main__":
    app.run(debug=True, port=5000)
