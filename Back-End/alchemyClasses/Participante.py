from alchemyClasses import db
from sqlalchemy import Column, Integer, String, LargeBinary
from hashlib import sha256
from CryptoUtils.CryptoUtils import cipher

class Participante(db.Model):

    __tablename__ = 'participante'
    noCuenta = Column(Integer, primary_key=True)
    nombre = Column(String(50))
    apellido = Column(String(50))
    correo = Column(String(100), unique=True)
    psswd = Column(String(64))
   

    def __init__(self, nombre, apellido, correo, psswd):
        self.nombre=nombre
        self.apellido=apellido
        self.correo=correo
        self.psswd=sha256(cipher(psswd)).hexdigest()        

    def __str__(self):
        return f'noCuenta: {self.idParticipante}, nombre: {self.nombre}, apellido: {self.apellido}'