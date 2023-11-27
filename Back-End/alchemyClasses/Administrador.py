from alchemyClasses import db
from sqlalchemy import Column, Integer, String, LargeBinary
from hashlib import sha256
from CryptoUtils.CryptoUtils import cipher

class Administrador(db.Model):

    __tablename__ = 'administrador'
    idAdministrador = Column(Integer, primary_key=True)
    nombre = Column(String(50))
    apellido = Column(String(50))
    correo = Column(String(100), unique=True)
    psswd = Column(String(64))
    fotoDePerfil = Column(LargeBinary)
    idSuperadmin = Column(Integer)

    def __init__(self, nombre, apellido, correo, psswd, idSuperadmin):
        self.nombre = nombre
        self.apellido = apellido
        self.correo = correo
        self.psswd = sha256(cipher(psswd)).hexdigest()
        self.idSuperadmin = idSuperadmin

    def __str__(self):
        return f'idAdministrador: {self.idAdministrador}, nombre: {self.nombre}, apellido: {self.apellido}'