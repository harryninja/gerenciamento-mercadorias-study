from app import app
from config import db
from models import Usuario

with app.app_context():
    db.create_all()

    if not Usuario.query.filter_by(email="admin@mstarsupply.com").first():
        admin = Usuario(nome="Admin", email="admin@mstarsupply.com")
        admin.set_senha("admin123")
        db.session.add(admin)
        db.session.commit()
        print("Usuário admin criado!")
