from flask import Blueprint, request, jsonify
from alchemyClasses.Administrador import Administrador
from alchemyClasses import db
from model.model_administrador import get_all_admins, get_admin_by_id, get_admin_by_email
from model.model_participante import get_participante_by_email, get_participante_by_id, get_all_participantes
from model.model_superadmin import get_superadmin_by_email, get_superadmin_by_id
from model.model_stand import get_stand_by_responsible, get_stand_by_id
from hashlib import sha256
from CryptoUtils.CryptoUtils import cipher
admin = Blueprint('admin', __name__, url_prefix='/admin')

"""
Obtiene una lista de todos los administradores y los stands que tienen asociados.
Para cada administrador, se recupera su número de cuenta, nombre, apellido, email
y los números de los stands asociados.
"""
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

"""
Permite agregar un nuevo administrador al sistema. Realiza las siguientes validaciones:
- Verifica que el correo no esté asociado a otra cuenta.
- Verifica que el número de cuenta no esté asociado a otro usuario.
Si todas las validaciones pasan, se inserta el nuevo administrador en la base de datos.
"""
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
        

"""
Permite actualizar la información de un administrador. Realiza las siguientes validaciones:
- Verifica si el correo no está asociado a otra cuenta.
- Si la contraseña no es la predeterminada, la encripta antes de actualizarla.
Si todo es válido, actualiza la base de datos.
"""        
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
   
"""
Permite eliminar un administrador de la base de datos, identificándolo por su número de cuenta.
Si el administrador no existe, devuelve un error 404.
"""
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

"""
Obtiene una lista de todos los participantes, incluyendo su número de cuenta, nombre, apellido, correo
y el número de stand asignado.
"""
@admin.route("/readparticipante", methods=["GET"])
def read_participante():

    participantes = get_all_participantes()
    participantes_list = []

    for participante in participantes:        
        participante_data = {
            "noCuenta": participante.noCuenta,
            "nombre": participante.nombre,
            "apellido": participante.apellido,
            "email": participante.correo,
            "noStand": participante.noStand
        }
        participantes_list.append(participante_data)

    return jsonify(participantes_list)

"""
Permite asignar un stand a un participante, dado el número de cuenta del participante y el número de stand.
Verifica que el stand exista antes de realizar la asignación.
"""
@admin.route("/asignarStand", methods=["PUT"])
def asign_stand():

    if request.method == 'PUT':
        datos_json = request.get_json()        
        noCuenta = datos_json["noCuenta"]        
        noStand = datos_json["noStand"]         
       
        try:
            # Obtén el participante que deseas editar según el ID proporcionado
            participantes = get_participante_by_id(noCuenta)
            participanteAsign = participantes[0]  

            if participanteAsign:
                if noStand:
                    if get_stand_by_id(noStand):
                        participanteAsign.noStand = noStand
                    else:
                       return jsonify({'error': 'No existe tal stand'})   
                db.session.commit()
                return jsonify({'message': 'Stand asignado exitosamente'})
            else:
                return jsonify({'error': 'Participante no encontrado'}), 404
            
        except Exception as e:
            db.session.rollback()  
            print(f"Error: {str(e)}")
            return jsonify({'error': 'Error al asignar stand'}), 500

    return jsonify({'message': 'Método no permitido'}), 405

"""
Permite eliminar a un participante del sistema identificándolo por su número de cuenta.
Si el participante no existe, devuelve un error 404.
"""    
@admin.route("/eliminarParticipante", methods=["DELETE"])
def eliminar_participante():

    if request.method == 'DELETE':
        datos_json = request.get_json()
        noCuenta = datos_json.get("noCuenta")  

        try:            
            participantes = get_participante_by_id(noCuenta)            
            participanteElim = participantes[0]
            if participanteElim:               
                db.session.delete(participanteElim)
                db.session.commit()
                return jsonify({'message': 'Participante eliminado exitosamente'})             
            else:
                return jsonify({'error': 'Participante no encontrado'}), 404
            
        except Exception as e:
            db.session.rollback()
            print(f"Error: {str(e)}")
            return jsonify({'error': 'Error al eliminar al participante'}), 500

    return jsonify({'message': 'Método no permitido'}), 405
       
    
    