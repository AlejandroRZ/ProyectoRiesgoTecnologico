from alchemyClasses.Stand import Stand
from datetime import datetime

def get_all_stands():
    return Stand.query.all()

def get_stand_by_id(noStand):
    return Stand.query.filter(Stand.noStand == noStand).first()

def get_stand_by_name(name):
    return Stand.query.filter(Stand.nombre == name).first()

def get_current_datetime():
    # Obtiene la fecha y hora actuales
    current_datetime = datetime.now()
    # Formatea la fecha y hora como strings
    formatted_date = current_datetime.strftime("%Y-%m-%d")
    formatted_time = current_datetime.strftime("%H:%M:%S")
    # Devuelve ambas en un diccionario o como desees
    return {"date": formatted_date, "time": formatted_time}

