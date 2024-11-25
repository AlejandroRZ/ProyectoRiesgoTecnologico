from flask import Blueprint, session, g, request,jsonify
import json
from model.model_administrador import get_all_admins
from model.model_participante import get_all_participantes
from model.model_stand import get_all_stands

json_controller = Blueprint('json', __name__, url_prefix='/json')

"""
Obtiene la lista de todos los administradores. Para cada administrador,
se extraen los campos: número de cuenta, nombre, apellido y correo.
Si ocurre algún error, se captura y se devuelve un mensaje de error.
"""
@json_controller.route('/administradores')
def get_administradores():

    try:    
        admins = get_all_admins()
        response = []
        for admin in admins:
            response.append({
                'noCuentaAdmin':admin.noCuentaAdmin,
                'nombre':admin.nombre,
                'apellido':admin.apellido,
                'correo':admin.correo
            })
        return json.dumps(response)
    
    except Exception as e:        
        return jsonify({"error": str(e)}), 500

"""
Obtiene la lista de todos los participantes. Para cada participante,
se extraen los campos: número de cuenta, nombre, apellido, correo y número de stand.
Si ocurre algún error, se captura y se devuelve un mensaje de error.
"""    
@json_controller.route('/participantes')
def get_participantes():

    try:    
        participantes = get_all_participantes()
        response = []
        for participante in participantes:
            response.append({
                'noCuenta':participante.noCuenta,
                'nombre':participante.nombre,
                'apellido':participante.apellido,
                'correo':participante.correo,
                'noStand': participante.noStand            
            })
        return json.dumps(response)
    
    except Exception as e:        
        return jsonify({"error": str(e)}), 500

"""
Obtiene la lista de todos los stands. Para cada stand, se extraen los campos:
número de stand, nombre, fecha y hora de creación, número de cuenta del administrador
y el estado del stand. Si ocurre algún error, se captura y se devuelve un mensaje de error.
"""    
@json_controller.route('/stands')
def get_stand():

    try:
        stands = get_all_stands()
        response = []
        for stand in stands:
            response.append({
                'noStand': stand.noStand,
                'nombre': stand.nombre,
                'fechahora': stand.fechahora.strftime("%Y-%m-%d %H:%M:%S"),  # Formatear la fecha y hora
                "noCuentaAdmin": stand.noCuentaAdmin,
                "estado": stand.estado
            })
        return json.dumps(response)
    
    except Exception as e:        
        return jsonify({"error": str(e)}), 500

