from alchemyClasses import db
from sqlalchemy import Column, Integer, String, LargeBinary
from hashlib import sha256
from CryptoUtils.CryptoUtils import cipher

class Administrador(db.Model):

    __tablename__ = 'administrador'
    noCuentaAdmin = Column(Integer, primary_key=True)
    nombre = Column(String(50))
    apellido = Column(String(50))
    correo = Column(String(100), unique=True)
    psswd = Column(String(64))  
    noCuentaSupAdm = Column(Integer)

    def __init__(self, noCuentaAdmin, nombre, apellido, correo, psswd, noCuentaSupAdm):
        self.noCuentaAdmin = noCuentaAdmin
        self.nombre = nombre
        self.apellido = apellido
        self.correo = correo
        self.psswd = sha256(cipher(psswd)).hexdigest()
        self.noCuentaSupAdm = noCuentaSupAdm

    def __str__(self):
        return f'noCuentaAdmin: {self.noCuentaAdmin}, nombre: {self.nombre}, apellido: {self.apellido}'