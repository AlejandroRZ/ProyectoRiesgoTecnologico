from alchemyClasses.Torneo import Torneo
from datetime import datetime

def get_all_torneos():
    return Torneo.query.all()

def get_torneo_by_id(id):
    return Torneo.query.filter(Torneo.idTorneo == id).first()

def get_torneo_by_name(name):
    return Torneo.query.filter(Torneo.nombre == name).first()

def get_current_datetime():
    # Obtiene la fecha y hora actuales
    current_datetime = datetime.now()
    # Formatea la fecha y hora como strings
    formatted_date = current_datetime.strftime("%Y-%m-%d")
    formatted_time = current_datetime.strftime("%H:%M:%S")
    # Devuelve ambas en un diccionario o como desees
    return {"date": formatted_date, "time": formatted_time}

