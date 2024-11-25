from flask import Blueprint, request, jsonify
from alchemyClasses.Stand import Stand
from alchemyClasses import db
from model.model_stand import get_all_stands, get_stand_by_id, get_stand_by_ubication, get_stand_by_name, get_current_datetime
from datetime import datetime
from datetime import datetime, timedelta, timezone

stand = Blueprint('stand', __name__, url_prefix='/stand')

"""
Esta ruta obtiene todos los stands registrados y devuelve una lista de ellos.
Cada stand incluye su número de stand, nombre, ubicación, fecha y hora, número de cuenta del administrador y estado.
La fecha y hora se devuelve en formato de cadena.
"""
@stand.route("/readstands", methods=["GET"])
def read_stands():

    stands = get_all_stands()
    stands_list = []

    for stand in stands:
        stand_data = {
            "noStand": stand.noStand,
            "nombre": stand.nombre,
            "ubicacion": stand.ubicacion, 
            "fechahora": stand.fechaHora.strftime("%Y-%m-%d %H:%M:%S"),
            "noCuentaAdmin": stand.noCuentaAdmin,
            "estado": stand.estado,
        }
        stands_list.append(stand_data)

    return jsonify(stands_list)

"""
Esta ruta permite insertar un nuevo stand en la base de datos.
Se reciben los datos necesarios (nombre, ubicación, fecha y hora, estado y número de cuenta del administrador) en formato JSON.
Si el nombre o la ubicación están ocupados, se devuelve un error.
"""
@stand.route("/insertstand", methods=["POST"])
def insert_stand():

    if request.method == "POST":
        
        try:
            datos_json = request.get_json()
            nombre = datos_json["nombre"]
            ubicacion = datos_json["ubicacion"]
            fecha_hora_str = datos_json["fechaHora"]

            fecha_hora_utc = datetime.strptime(fecha_hora_str, "%Y-%m-%dT%H:%M:%S")
            # Ajustamos el formato según la presencia o ausencia de fracciones de segundo
            fecha_hora_formato = "%Y-%m-%dT%H:%M:%S"

            # Tratamos de analizar la fecha y hora
            try:
                fecha_hora = datetime.strptime(fecha_hora_str, fecha_hora_formato)

            except ValueError:
                return jsonify({"error": "Formato de fecha y hora inválido"}), 400

            estado = datos_json["estado"]
            noCuentaAdmin = datos_json.get("noCuentaAdmin") 
            standNombreOcupado = get_stand_by_name(nombre)
            standUbicacionOcupada = get_stand_by_ubication(ubicacion)   

            if standUbicacionOcupada:
                return jsonify({'error': 'Error, ubicación ocupada por otro stand.'})       
            
            if standNombreOcupado:
               return jsonify({'error': 'Error, nombre ocupado por otro stand.'})   
            
            nuevo_stand = Stand(nombre, ubicacion, fecha_hora_utc, estado, noCuentaAdmin)

            db.session.add(nuevo_stand)
            db.session.commit()
            return jsonify({"message": "Stand insertado correctamente"}), 201
        
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

"""
Esta ruta permite actualizar los datos de un stand existente.
Se recibe el número de stand y los nuevos datos (nombre, ubicación, fecha y hora, estado, número de cuenta del administrador) en formato JSON.
Si el nombre o la ubicación están ocupados, se devuelve un error.
"""
@stand.route("/updatestand", methods=["PUT"])
def update_stand():

    if request.method == "PUT":

        try:
            datos_json = request.get_json()
            noStand = datos_json["noStand"]
            nombre = datos_json["nombre"]
            ubicacion = datos_json["ubicacion"]
            fecha_hora_str = datos_json["fechahora"]        
            noCuentaAdmin = int(datos_json["noCuentaAdmin"])
            estado = datos_json["estado"]
            stand = get_stand_by_id(noStand)

            fecha_hora = datetime.strptime(fecha_hora_str, "%Y-%m-%dT%H:%M:%S")
            standNombreOcupado = get_stand_by_name(nombre)
            standUbicacionOcupada = get_stand_by_ubication(ubicacion) 

            if standUbicacionOcupada and standUbicacionOcupada.noStand != noStand:
                return jsonify({'error': 'Error, ubicación ocupada por otro stand.'})       
            
            if standNombreOcupado and standNombreOcupado.noStand != noStand:
               return jsonify({'error': 'Error, nombre ocupado por otro stand.'})

            stand.nombre = nombre
            stand.ubicacion = ubicacion
            stand.fechaHora = fecha_hora
            stand.noCuentaAdmin = noCuentaAdmin
            stand.estado = estado        
            db.session.commit()

            return jsonify({"message": "Stand editado correctamente"}), 201
        
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

"""
Esta ruta permite eliminar un stand de la base de datos. 
Se recibe el número de stand en formato JSON y se elimina el stand correspondiente.
Si el stand no existe, se devuelve un error.
"""
@stand.route("/deletestand", methods=["DELETE"])
def delete_stand():

    if request.method == "DELETE":
        datos_json = request.get_json()
        noStand = datos_json.get("noStand")  
        stand = get_stand_by_id(noStand)

        if not stand:
            return jsonify({"error": f"No se encontró un stand con no. {noStand}"}), 404

        try:
            db.session.delete(stand)
            db.session.commit()
            return jsonify({"message": "Stand eliminado correctamente"}), 200
        
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500


    
    
    
