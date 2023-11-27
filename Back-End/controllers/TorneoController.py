from flask import Blueprint, request, jsonify
from alchemyClasses.Torneo import Torneo
from alchemyClasses import db

from model.model_torneo import get_all_torneos, get_torneo_by_id, get_current_datetime
from datetime import datetime

torneo = Blueprint('torneo', __name__, url_prefix='/torneo')

@torneo.route("/readtorneos", methods=["GET"])
def read_torneos():
    torneos = get_all_torneos()
    torneos_list = []
    for torneo in torneos:
        torneo_data = {
            "id": torneo.idTorneo,
            "nombre": torneo.nombre,
            "fechahora": torneo.fechaHora.strftime("%Y-%m-%d %H:%M:%S"),
            "idAdministrador": torneo.idAdministrador,
        }
        torneos_list.append(torneo_data)
    return jsonify(torneos_list)


@torneo.route("/inserttorneo", methods=["POST"])
def insert_torneo():
    if request.method == "POST":
        datos_json = request.get_json()
        nombre = datos_json["nombre"]
        fecha_hora_str = datos_json["fechaHora"]
        # Ajustamos el formato según la presencia o ausencia de fracciones de segundo
        fecha_hora_formato = "%Y-%m-%dT%H:%M:%S"

        # Tratamos de analizar la fecha y hora
        try:
            fecha_hora = datetime.strptime(fecha_hora_str, fecha_hora_formato)
        except ValueError:
            return jsonify({"error": "Formato de fecha y hora inválido"}), 400

        idAdministrador = datos_json.get("idAdministrador")

        nuevo_torneo = Torneo(nombre, fecha_hora, idAdministrador)

        try:
            db.session.add(nuevo_torneo)
            db.session.commit()
            return jsonify({"message": "Torneo insertado correctamente"}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

@torneo.route("/updatetorneo", methods=["PUT"])
def update_torneo():
    if request.method == "PUT":
        datos_json = request.get_json()
        id = datos_json["id"]
        nombre = datos_json["nombre"]
        fecha_hora_str = datos_json["fechahora"]

        idAdministrador = datos_json["idAdministrador"]
        torneo = get_torneo_by_id(id)

        #Cambiar la fecha a un objeto datetime
        fecha_hora = datetime.strptime(fecha_hora_str, "%Y-%m-%dT%H:%M:%S")


        torneo.nombre = nombre
        torneo.fechaHora = fecha_hora
        torneo.idAdministrador = idAdministrador

        try:
            db.session.commit()
            return jsonify({"message": "Torneo editado correctamente"}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

@torneo.route("/deletetorneo", methods=["DELETE"])
def delete_torneo():
    if request.method == "DELETE":
        datos_json = request.get_json()
        id_torneo = datos_json.get("idTorneo")  
        torneo = get_torneo_by_id(id_torneo)

        if not torneo:
            return jsonify({"error": f"No se encontró un torneo con ID {id_torneo}"}), 404

        try:
            db.session.delete(torneo)
            db.session.commit()
            return jsonify({"message": "Torneo eliminado correctamente"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500


    
    
    
