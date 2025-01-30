from flask import Blueprint, request, jsonify
from utils import gerar_relatorio
from models import Mercadoria, Entrada, Saida, Usuario
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from config import db

app = Blueprint("routes", __name__)

@app.route("/registro", methods=["POST"])
def registrar_usuario():
    data = request.json
    if Usuario.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email já registrado"}), 400

    novo_usuario = Usuario(nome=data["nome"], email=data["email"])
    novo_usuario.set_senha(data["senha"])
    db.session.add(novo_usuario)
    db.session.commit()
    return jsonify({"message": "Usuário registrado com sucesso!"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    usuario = Usuario.query.filter_by(email=data["email"]).first()

    if usuario and usuario.verificar_senha(data["senha"]):
        token = create_access_token(identity=usuario.id)
        return jsonify({"token": token}), 200

    return jsonify({"error": "Credenciais inválidas"}), 401

@app.route("/perfil", methods=["GET"])
@jwt_required()
def perfil():
    usuario_id = get_jwt_identity()
    usuario = Usuario.query.get(usuario_id)
    return jsonify({"id": usuario.id, "nome": usuario.nome, "email": usuario.email}), 200

@app.route("/mercadorias", methods=["POST"])
def adicionar_mercadoria():
    data = request.json
    nova_mercadoria = Mercadoria(
        nome=data["nome"],
        numero_registro=data["numero_registro"],
        fabricante=data["fabricante"],
        tipo=data["tipo"],
        descricao=data["descricao"]
    )
    db.session.add(nova_mercadoria)
    db.session.commit()
    return jsonify({"message": "Mercadoria cadastrada com sucesso!"}), 201

@app.route("/entradas", methods=["POST"])
def adicionar_entrada():
    data = request.json
    nova_entrada = Entrada(
        mercadoria_id=data["mercadoria_id"],
        quantidade=data["quantidade"],
        data_hora=data["data_hora"],
        local=data["local"]
    )
    db.session.add(nova_entrada)
    db.session.commit()
    return jsonify({"message": "Entrada registrada!"}), 201

@app.route("/saidas", methods=["POST"])
def adicionar_saida():
    data = request.json
    nova_saida = Saida(
        mercadoria_id=data["mercadoria_id"],
        quantidade=data["quantidade"],
        data_hora=data["data_hora"],
        local=data["local"]
    )
    db.session.add(nova_saida)
    db.session.commit()
    return jsonify({"message": "Saída registrada!"}), 201

@app.route("/relatorio", methods=["GET"])
def relatorio():
    return gerar_relatorio()

@app.route("/mercadorias", methods=["GET"])
def listar_mercadorias():
    mercadorias = Mercadoria.query.all()

    mercadorias_json = [{
        "id": m.id,
        "nome": m.nome,
        "numero_registro": m.numero_registro,
        "fabricante": m.fabricante,
        "tipo": m.tipo
    } for m in mercadorias]

    return jsonify({"mercadorias": mercadorias_json})

@app.route("/movimentacao", methods=["GET"])
def movimentacao():
    # Obtendo todos os meses do ano
    meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

    entradas_mensais = {mes: 0 for mes in meses}
    saidas_mensais = {mes: 0 for mes in meses}

    entradas = Entrada.query.all()
    for entrada in entradas:
        mes = entrada.data_hora.strftime("%b")  # Pega o mês abreviado
        entradas_mensais[mes] += entrada.quantidade

    saidas = Saida.query.all()
    for saida in saidas:
        mes = saida.data_hora.strftime("%b")  # Pega o mês abreviado
        saidas_mensais[mes] += saida.quantidade

    return jsonify({
        "labels": meses,
        "entradas": list(entradas_mensais.values()),
        "saidas": list(saidas_mensais.values())
    })
