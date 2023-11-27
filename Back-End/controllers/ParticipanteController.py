from flask import Blueprint, request, jsonify
from alchemyClasses.Participante import Participante
from alchemyClasses import db
from model.model_participante import get_participante_by_id
from hashlib import sha256
from CryptoUtils.CryptoUtils import cipher 
from flask import Flask

participante = Blueprint('participante', __name__, url_prefix='/participante')


@participante.route("/editarPerfil", methods=["PUT"])
def edit_profile():
    if request.method == 'PUT':
        datos_json = request.get_json()        
        id = datos_json["idParticipante"]
        nombre = datos_json["nombre"]
        apellido = datos_json["apellido"]
        email = datos_json["correo"]
        gamerTag = datos_json["gamertag"]
        contrasena = datos_json["contrasena"]
        foto = datos_json["foto"]  
       
        try:
            # Obtén el participante que deseas editar según el ID proporcionado
            participantes = get_participante_by_id(id)
            participanteEdit = participantes[0]

            if participanteEdit:
                # Actualiza los campos según lo que recibiste en la solicitud                
                if nombre:
                    participanteEdit.nombre = nombre                
                if apellido:
                    participanteEdit.apellido = apellido 
                if email:
                    participanteEdit.correo = email
                if gamerTag:
                    participanteEdit.gamerTag = gamerTag               
                if contrasena:
                    participanteEdit.psswd = sha256(cipher(contrasena)).hexdigest()                
                if foto is not None:
                    participanteEdit.fotoDePerfil = foto
                

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

        id = datos_json.get("idParticipante")
        contrasena = datos_json.get("contrasenaEliminar")

        if id is None or contrasena is None:
            return jsonify({'error': 'ID de participante o contraseña no proporcionados'}), 400

        try:
            participantes = get_participante_by_id(id)
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