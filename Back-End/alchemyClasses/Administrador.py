from alchemyClasses import db
from sqlalchemy import Column, Integer, String, LargeBinary
from hashlib import sha256
from CryptoUtils.CryptoUtils import cipher

"""
Clase que representa a la tabla 'administrador' en la base de datos.
Cada instancia de esta clase corresponde a un registro de un administrador.
"""
class Administrador(db.Model):

    __tablename__ = 'administrador'
    noCuentaAdmin = Column(Integer, primary_key=True)
    nombre = Column(String(50))
    apellido = Column(String(50))
    correo = Column(String(100), unique=True)
    psswd = Column(String(64))  
    noCuentaSupAdm = Column(Integer)

    """
    Constructor de la clase Administrador.
    
    Inicializa una instancia con los datos proporcionados.
    La contraseña se encripta usando una función de hash SHA-256 antes de almacenarla.
    
    Parámetros:
    - noCuentaAdmin: Número de cuenta único del administrador.
    - nombre: Nombre del administrador.
    - apellido: Apellido del administrador.
    - correo: Correo electrónico único del administrador.
    - psswd: Contraseña del administrador, se almacena como un hash.
    - noCuentaSupAdm: Número de cuenta del administrador superior (opcional).
    """
    def __init__(self, noCuentaAdmin, nombre, apellido, correo, psswd, noCuentaSupAdm):
        self.noCuentaAdmin = noCuentaAdmin
        self.nombre = nombre
        self.apellido = apellido
        self.correo = correo
        self.psswd = sha256(cipher(psswd)).hexdigest()
        self.noCuentaSupAdm = noCuentaSupAdm

    def __str__(self):
        return f'noCuentaAdmin: {self.noCuentaAdmin}, nombre: {self.nombre}, apellido: {self.apellido}'