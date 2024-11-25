from alchemyClasses import db
from sqlalchemy import Column, Integer, String, LargeBinary, ForeignKey
from hashlib import sha256
from CryptoUtils.CryptoUtils import cipher

"""
Clase que representa a la tabla 'participante' en la base de datos.
Cada instancia de esta clase corresponde a un registro de un participante.
"""
class Participante(db.Model):

    __tablename__ = 'participante'
    noCuenta = Column(Integer, primary_key=True)
    nombre = Column(String(50))
    apellido = Column(String(50))
    correo = Column(String(100), unique=True)
    psswd = Column(String(64))
    noStand = Column(Integer, ForeignKey('stand.noStand'))
   
    """
    Constructor de la clase Participante.
    
    Inicializa una instancia con los datos proporcionados.
    La contraseña se encripta usando una función de hash SHA-256 antes de almacenarla.
    
    Parámetros:
    - noCuenta: Número de cuenta único del participante.
    - nombre: Nombre del participante.
    - apellido: Apellido del participante.
    - correo: Correo electrónico único del participante.
    - psswd: Contraseña del participante, se almacena como un hash.
    - noStand: Número del stand asignado al participante (clave foránea).
    """
    def __init__(self, noCuenta, nombre, apellido, correo, psswd, noStand):
        self.noCuenta=noCuenta
        self.nombre=nombre
        self.apellido=apellido
        self.correo=correo
        self.psswd=sha256(cipher(psswd)).hexdigest()
        self.noStand = noStand        

    def __str__(self):
        return f'noCuenta: {self.noCuenta}, nombre: {self.nombre}, apellido: {self.apellido}, noStand: {self.noStand}'