from alchemyClasses import db
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey

"""
Clase que representa a la tabla 'stand' en la base de datos.
Cada instancia de esta clase corresponde a un registro de un stand.
"""
class Stand(db.Model):
    
    __tablename__ = 'stand'
    noStand = Column(Integer, primary_key=True)
    nombre = Column(String(100))
    ubicacion = Column(String(100))    
    fechaHora = Column(DateTime())  
    noCuentaAdmin = Column(Integer, ForeignKey('administrador.noCuentaAdmin'))
    estado = Column(Boolean)

    """
    Constructor de la clase Stand.
    
    Inicializa una instancia con los datos proporcionados.
    
    Parámetros:
    - nombre: Nombre descriptivo del stand.
    - ubicacion: Ubicación física del stand.
    - fechaHora: Fecha y hora relacionadas con el stand.
    - estado: Estado del stand (activo/inactivo).
    - noCuentaAdmin: Número de cuenta del administrador responsable del stand (clave foránea).
    """
    def __init__(self,nombre,ubicacion,fechaHora, estado, noCuentaAdmin):
        self.nombre = nombre
        self.ubicacion = ubicacion
        self.fechaHora = fechaHora
        self.noCuentaAdmin = noCuentaAdmin
        self.estado = estado

    def __str__(self):
        return f'noStand: {self.noStand},nombre: {self.nombre},ubicacion: {self.ubicacion},fechaHora: {self.fechaHora}, noCuentaAdmin: {self.noCuentaAdmin}, estado: {self.estado}'