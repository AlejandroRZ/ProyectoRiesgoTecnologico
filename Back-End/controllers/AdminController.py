from flask import Blueprint, request, jsonify
from alchemyClasses.Administrador import Administrador
from alchemyClasses import db
from model.model_administrador import get_all_admins, get_admin_by_id, get_admin_by_email
from model.model_participante import get_participante_by_email, get_participante_by_id
from model.model_superadmin import get_superadmin_by_email, get_superadmin_by_id
from model.model_stand import get_stand_by_responsible
from hashlib import sha256
from CryptoUtils.CryptoUtils import cipher
admin = Blueprint('admin', __name__, url_prefix='/admin')

@admin.route("/readadmin", methods=["GET"])
def read_admin():
    admins = get_all_admins()
    admins_list = []
    for admin in admins:
        standsAsoc = get_stand_by_responsible(admin.noCuentaAdmin)
        noStands = [stand.noStand for stand in standsAsoc]
        print(noStands)
        admin_data = {
            "noCuentaAdmin": admin.noCuentaAdmin,
            "nombre": admin.nombre,
            "apellido": admin.apellido,
            "email": admin.correo,
            "stands": noStands
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
        try:
            adminList = get_admin_by_email(email)
            superAdminList = get_superadmin_by_email(email)
            participantesList = get_participante_by_email(email)            
            if adminList or superAdminList or participantesList:
                return jsonify({'error': 'Error, correo asociado a otra cuenta.'})
            
            adminList = get_admin_by_id(noCuentaAdmin)
            superAdminList = get_superadmin_by_id(noCuentaAdmin)
            participantesList = get_participante_by_id(noCuentaAdmin)            
            if adminList or superAdminList or participantesList:
                return jsonify({'error': 'Error, número de cuenta asociado a otro usuario.'})
            
            
            nuevo_admin = Administrador(noCuentaAdmin, nombre, apellido, email, psswd, noCuentaSupAdm)
        
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
        try:
            admin = get_admin_by_id(noCuentaAdmin)           
            if email != admin.correo:
                adminList = get_admin_by_email(email)
                superAdminList = get_superadmin_by_email(email)
                participantesList = get_participante_by_email(email)            
            
                if adminList or superAdminList or participantesList:
                    return jsonify({'error': 'Error, correo asociado a otra cuenta.'})
        
        
            admin.nombre = nombre
            admin.apellido = apellido
            admin.correo = email
            if psswd != "Contra":
                admin.psswd = sha256(cipher(psswd)).hexdigest()
        
            
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
            return jsonify({"error": f"No se encontró un administrador con no. de cuenta {noCuentaAdmin}"}), 404

        try:
            db.session.delete(admin)
            db.session.commit()
            return jsonify({"message": "Administrador eliminado correctamente"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    
    
    