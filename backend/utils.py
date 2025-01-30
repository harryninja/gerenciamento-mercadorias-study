import pdfkit
from flask import send_file
from io import BytesIO
from models import Entrada, Saida

def gerar_relatorio():
    entradas = Entrada.query.all()
    saidas = Saida.query.all()

    html = "<h1>Relatório Mensal de Movimentação</h1><br>"
    html += "<h2>Entradas</h2><ul>"
    for e in entradas:
        html += f"<li>Mercadoria {e.mercadoria_id} - {e.quantidade} unidades - {e.data_hora}</li>"
    html += "</ul><h2>Saídas</h2><ul>"
    for s in saidas:
        html += f"<li>Mercadoria {s.mercadoria_id} - {s.quantidade} unidades - {s.data_hora}</li>"
    html += "</ul>"

    pdf = pdfkit.from_string(html, False)
    response = BytesIO(pdf)
    return send_file(response, mimetype="application/pdf", as_attachment=True, download_name="relatorio.pdf")
