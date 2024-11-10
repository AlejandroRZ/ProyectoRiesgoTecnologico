from alchemyClasses import db
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey


class Torneo(db.Model):
    
    __tablename__ = 'torneo'
    idTorneo = Column(Integer, primary_key=True)
    nombre = Column(String(100))
    
    fechaHora = Column(DateTime())    

    noCuentaAdmin = Column(Integer, ForeignKey('administrador.noCuentaAdmin'))

    def __init__(self,nombre,fechaHora, noCuentaAdmin):
        self.nombre = nombre
        self.fechaHora = fechaHora

        self.noCuentaAdmin = noCuentaAdmin

    def __str__(self):
        return f'idTorneo: {self.idTorneo},nombre: {self.nombre}, fechaHora: {self.fechaHora}, noCuentaAdmin: {self.noCuentaAdmin}'