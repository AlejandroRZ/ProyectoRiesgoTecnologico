from flask import Blueprint, request, jsonify
from alchemyClasses.Participante import Participante
from alchemyClasses import db
from model.model_participante import get_participante_by_id, get_participante_by_email
from model.model_administrador import get_admin_by_email
from model.model_superadmin import get_superadmin_by_email
from model.model_stand import get_stand_by_id
from hashlib import sha256
from CryptoUtils.CryptoUtils import cipher 
from flask import Flask

participante = Blueprint('participante', __name__, url_prefix='/participante')


@participante.route("/editarPerfil", methods=["PUT"])
def edit_profile():
    if request.method == 'PUT':
        datos_json = request.get_json()        
        noCuenta = datos_json["noCuenta"]
        nombre = datos_json["nombre"]
        apellido = datos_json["apellido"]
        email = datos_json["correo"]        
        contrasena = datos_json["contrasena"]       
       
        try:
            # Obtén el participante que deseas editar según el ID proporcionado
            participantes = get_participante_by_id(noCuenta)
            participanteEdit = participantes[0]
            
            if email != participanteEdit.correo:
                adminList = get_admin_by_email(email)
                superAdminList = get_superadmin_by_email(email)
                participantesList = get_participante_by_email(email)            
            
                if adminList or superAdminList or participantesList:
                    return jsonify({'error': 'Error, correo asociado a otra cuenta.'})
           
           
            if participanteEdit:
                # Actualiza los campos según lo que recibiste en la solicitud                
                if nombre:
                    participanteEdit.nombre = nombre                
                if apellido:
                    participanteEdit.apellido = apellido 
                if email:
                    participanteEdit.correo = email                              
                if contrasena:
                    participanteEdit.psswd = sha256(cipher(contrasena)).hexdigest()
                                    
                            

                db.session.commit()
                return jsonify({'message': 'Perfil actualizado exitosamente'})
            else:
                return jsonify({'error': 'Participante no encontrado'}), 404
        except Exception as e:
            db.session.rollback()  # Revertir cambios en caso de error
            print(f"Error: {str(e)}")
            return jsonify({'error': 'Error al actualizar el perfil'}), 500

    return jsonify({'message': 'Método no permitido'}), 405



@participante.route("/eliminarPerfil", methods=["DELETE"])
def eliminar_perfil():
    if request.method == 'DELETE':
        datos_json = request.get_json()

        noCuenta = datos_json.get("noCuenta") 
        print(f'{noCuenta}')
        contrasena = datos_json.get("contrasenaEliminar")

        if contrasena is None:
            return jsonify({'error': 'No. de ceunta o contraseña no proporcionados'}), 400

        try:            
            participantes = get_participante_by_id(noCuenta)
            print(f'{noCuenta}')
            participanteElim = participantes[0]
            if participanteElim:
                # Verificar que la contraseña proporcionada coincida
                if participanteElim.psswd == sha256(cipher(contrasena)).hexdigest():
                    db.session.delete(participanteElim)
                    db.session.commit()
                    return jsonify({'message': 'Perfil eliminado exitosamente'})
                else:
                    return jsonify({'error': 'Contraseña incorrecta'}), 401
            else:
                return jsonify({'error': 'Participante no encontrado'}), 404
        except Exception as e:
            db.session.rollback()
            print(f"Error: {str(e)}")
            return jsonify({'error': 'Error al eliminar el perfil'}), 500

    return jsonify({'message': 'Método no permitido'}), 405