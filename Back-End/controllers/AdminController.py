from flask import Blueprint, request, jsonify
from alchemyClasses.Administrador import Administrador
from alchemyClasses import db
from model.model_administrador import get_all_admins, get_admin_by_id, get_admin_by_email
from hashlib import sha256
from CryptoUtils.CryptoUtils import cipher
admin = Blueprint('admin', __name__, url_prefix='/admin')

@admin.route("/readadmin", methods=["GET"])
def read_admin():
    admins = get_all_admins()
    admins_list = []
    for admin in admins:
        admin_data = {
            "noCuentaAdmin": admin.noCuentaAdmin,
            "nombre": admin.nombre,
            "apellido": admin.apellido,
            "email": admin.correo,
        }
        admins_list.append(admin_data)
    return jsonify(admins_list)


@admin.route("/insertadmin", methods=["POST"])
def insert_admin():
    if request.method == "POST":
        datos_json = request.get_json()
        noCuentaAdmin = datos_json["noCuentaAdmin"]
        nombre = datos_json["nombre"]
        apellido = datos_json["apellido"]
        email = datos_json["email"]
        psswd = datos_json["psswd"]
        noCuentaSupAdm = int(datos_json["noCuentaSupAdm"])
        nuevo_admin = Administrador(noCuentaAdmin, nombre, apellido, email, psswd, noCuentaSupAdm)
        try:
            db.session.add(nuevo_admin)
            db.session.commit()
            return jsonify({"message": "Administrador insertado correctamente"}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500
        
@admin.route("/updateadmin", methods=["PUT"])
def update_admin():
    if request.method == "PUT":
        datos_json = request.get_json()       
        noCuentaAdmin = datos_json["noCuentaAdmin"]
        nombre = datos_json["nombre"]
        apellido = datos_json["apellido"]
        email = datos_json["email"]
        psswd = datos_json["psswd"]
        admin = get_admin_by_id(noCuentaAdmin)
    
        admin.nombre = nombre
        admin.apellido = apellido
        admin.correo = email
        if psswd != "Contra":
            admin.psswd = sha256(cipher(psswd)).hexdigest()
    
        try:
            db.session.commit()
            return jsonify({"message": "Administrador editado correctamente"}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500
   

@admin.route("/deleteadmin", methods=["DELETE"])
def delete_admin():
    if request.method == "DELETE":
        datos_json = request.get_json()
        noCuentaAdmin = datos_json.get("noCuentaAdmin")  
        admin = get_admin_by_id(noCuentaAdmin)

        if not admin:
            return jsonify({"error": f"No se encontró un administrador con ID {noCuentaAdmin}"}), 404

        try:
            db.session.delete(admin)
            db.session.commit()
            return jsonify({"message": "Administrador eliminado correctamente"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    
    
    