from alchemyClasses import db
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey


class Torneo(db.Model):
    
    __tablename__ = 'torneo'
    idTorneo = Column(Integer, primary_key=True)
    nombre = Column(String(100))
    fechaHora = Column(DateTime())

    idAdministrador = Column(Integer, ForeignKey('administrador.idAdministrador'))

    def __init__(self,nombre,fechaHora, idAdministrador):
        self.nombre = nombre
        self.fechaHora = fechaHora

        self.idAdministrador = idAdministrador

    def __str__(self):
        return f'idTorneo: {self.idTorneo},nombre: {self.nombre}, fechaHora: {self.fechaHora}, idAdministrador: {self.idAdministrador}'