from alchemyClasses import db
from sqlalchemy import Column, Integer, String, LargeBinary
from hashlib import sha256
from CryptoUtils.CryptoUtils import cipher

class Superadmin(db.Model):

    __tablename__ = 'superadmin'
    idSuperadmin = Column(Integer, primary_key=True)
    nombre = Column(String(50))
    apellido = Column(String(50))
    correo = Column(String(100), unique=True)
    psswd = Column(String(64))
    fotoDePerfil = Column(LargeBinary)

    def __init__(self, nombre, apellido, correo, psswd):
        self.nombre = nombre
        self.apellido = apellido
        self.correo = correo
        self.psswd = sha256(cipher(psswd)).hexdigest()

    def __str__(self):
        return f'idSuperAdmin: {self.idSuperadmin}, nombre: {self.nombre}, apellido: {self.apellido}'