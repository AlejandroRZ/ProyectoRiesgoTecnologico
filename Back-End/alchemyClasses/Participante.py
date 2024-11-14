from alchemyClasses import db
from sqlalchemy import Column, Integer, String, LargeBinary, ForeignKey
from hashlib import sha256
from CryptoUtils.CryptoUtils import cipher

class Participante(db.Model):

    __tablename__ = 'participante'
    noCuenta = Column(Integer, primary_key=True)
    nombre = Column(String(50))
    apellido = Column(String(50))
    correo = Column(String(100), unique=True)
    psswd = Column(String(64))
    noStand = Column(Integer, ForeignKey('stand.noStand'))
   

    def __init__(self, noCuenta, nombre, apellido, correo, psswd, noStand):
        self.noCuenta=noCuenta
        self.nombre=nombre
        self.apellido=apellido
        self.correo=correo
        self.psswd=sha256(cipher(psswd)).hexdigest()
        self.noStand = noStand        

    def __str__(self):
        return f'noCuenta: {self.noCuenta}, nombre: {self.nombre}, apellido: {self.apellido}, noStand: {self.noStand}'