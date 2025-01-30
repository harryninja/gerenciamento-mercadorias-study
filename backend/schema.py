from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from models import Mercadoria, Entrada, Saida

class MercadoriaSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Mercadoria
        load_instance = True

class EntradaSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Entrada
        load_instance = True

class SaidaSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Saida
        load_instance = True
