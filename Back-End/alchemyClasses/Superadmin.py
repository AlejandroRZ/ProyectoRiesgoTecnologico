from alchemyClasses import db
from sqlalchemy import Column, Integer, String, LargeBinary
from hashlib import sha256
from CryptoUtils.CryptoUtils import cipher

"""
Clase que representa a la tabla 'superadmin' en la base de datos.
Cada instancia de esta clase corresponde a un registro de un superadministrador.
"""
class Superadmin(db.Model):
    
    __tablename__ = 'superadmin'
    noCuentaSupAdm = Column(Integer, primary_key=True)
    nombre = Column(String(50))
    apellido = Column(String(50))
    correo = Column(String(100), unique=True)
    psswd = Column(String(64))
    
    """
    Constructor de la clase Superadmin.
    
    Inicializa una instancia con los datos proporcionados.
    La contraseña se encripta usando una función de hash SHA-256 antes de almacenarla.
    
    Parámetros:
    - noCuentaSupAdm: Número único del superadministrador.
    - nombre: Nombre del superadministrador.
    - apellido: Apellido del superadministrador.
    - correo: Correo electrónico único del superadministrador.
    - psswd: Contraseña del superadministrador, se almacena como un hash.
    """
    def __init__(self, noCuentaSupAdm, nombre, apellido, correo, psswd):
        self.noCuentaSupAdm = noCuentaSupAdm
        self.nombre = nombre
        self.apellido = apellido
        self.correo = correo
        self.psswd = sha256(cipher(psswd)).hexdigest()

    def __str__(self):
        return f'noCuentaSupAdm: {self.noCuentaSupAdm}, nombre: {self.nombre}, apellido: {self.apellido}'