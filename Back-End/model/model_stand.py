from alchemyClasses.Stand import Stand
from datetime import datetime

# Función para obtener todos los stands registrados en la base de datos.
def get_all_stands():
    return Stand.query.all()

# Función para obtener un stand específico utilizando su identificador único (noStand).
def get_stand_by_id(noStand):
    return Stand.query.filter(Stand.noStand == noStand).first()

# Función para obtener un stand por su nombre.
def get_stand_by_name(name):
    return Stand.query.filter(Stand.nombre == name).first()

# Función para obtener un stand por su ubicación.
def get_stand_by_ubication(ubicacion):
    return Stand.query.filter(Stand.ubicacion == ubicacion).first()

# Función para obtener todos los stands asignados a un administrador responsable.
def get_stand_by_responsible(responsible):
    return Stand.query.filter(Stand.noCuentaAdmin == responsible).all()

# Función para obtener la fecha y hora actual en formato estructurado.                              
def get_current_datetime():   
    current_datetime = datetime.now()    
    formatted_date = current_datetime.strftime("%Y-%m-%d")
    formatted_time = current_datetime.strftime("%H:%M:%S")
    
    return {"date": formatted_date, "time": formatted_time}

