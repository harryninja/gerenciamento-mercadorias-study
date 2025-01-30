from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import db, Config
from routes import app as routes_app

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
db.init_app(app)
jwt = JWTManager(app)

app.register_blueprint(routes_app)

if __name__ == "__main__":
    app.run(debug=True)
