from flask import Blueprint, session, g, request
import json

from model.model_administrador import get_all_admins
from model.model_participante import get_all_participantes
from model.model_superadmin import get_all_superadmins
from model.model_torneo import get_all_torneos

json_controller = Blueprint('json', __name__, url_prefix='/json')

@json_controller.route('/administradores')
def get_administradores():
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

@json_controller.route('/participantes')
def get_participantes():
    participantes = get_all_participantes()
    response = []
    for participante in participantes:
        response.append({
            'noCuenta':participante.noCuenta,
            'nombre':participante.nombre,
            'apellido':participante.apellido,
            'correo':participante.correo            
        })
    return json.dumps(response)
    
@json_controller.route('/torneos')
def get_torneos():
    try:
        torneos = get_all_torneos()
        response = []
        for torneo in torneos:
            response.append({
                'id': torneo.id,
                'nombre': torneo.nombre,
                'fechahora': torneo.fechahora.strftime("%Y-%m-%d %H:%M:%S"),  # Formatear la fecha y hora
                "noCuentaAdmin": torneo.noCuentaAdmin
            })
        return json.dumps(response)
  
# @json_controller.route('/movie_json')
# def get_movie():
#     nombre = request.json.get("nombre", None)
#     if nombre is None:
#         return {'error':'Nombre is required'}
#     movie = get_movie_by_name(nombre)
#     if movie is []:
#         return {'error':'Movie not found'}
#     return json.dumps({
#         'genero':movie[0].genero
#     })

# @json_controller.route('/rents_by_session')
# def get_rents_by_user():
#     if session.get('user', None) is None:
#         return json.dumps({
#             'error': 'Cookie de sesion vacia'
#         })
#     email = session.get('email')
#     rentas = rents_by_email(email)
#     response = []
#     for renta in rentas:
#         response.append({
#             'idUsuario': get_user_by_id(renta.idUsuario)[0].nombre,
#             'idPelicula': get_movie_by_id(renta.idPelicula)[0].nombre
#         })
#     return json.dumps(response)
