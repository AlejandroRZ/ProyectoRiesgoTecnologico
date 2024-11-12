from alchemyClasses import db
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey


class Stand(db.Model):
    
    __tablename__ = 'stand'
    noStand = Column(Integer, primary_key=True)
    nombre = Column(String(100))
    ubicacion = Column(String(100))    
    fechaHora = Column(DateTime())  
    noCuentaAdmin = Column(Integer, ForeignKey('administrador.noCuentaAdmin'))
    estado = Column(Boolean)

    def __init__(self,nombre,ubicacion,fechaHora, estado, noCuentaAdmin):
        self.nombre = nombre
        self.ubicacion = ubicacion
        self.fechaHora = fechaHora
        self.noCuentaAdmin = noCuentaAdmin
        self.estado = estado

    def __str__(self):
        return f'noStand: {self.noStand},nombre: {self.nombre},ubicacion: {self.ubicacion},fechaHora: {self.fechaHora}, noCuentaAdmin: {self.noCuentaAdmin}, estado: {self.estado}'