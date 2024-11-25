import json
import os
from alchemyClasses import db
from alchemyClasses.Participante import Participante
from alchemyClasses.Administrador import Administrador
from alchemyClasses.Stand import Stand
from CryptoUtils.CryptoUtils import validate
from flask import (
    Flask,
    render_template,
    request,
    flash,
    session,
    g,
    redirect,
    url_for,
    jsonify,
)

from flask_cors import CORS
from controllers.AdminController import admin
from controllers.StandController import stand
from controllers.ParticipanteController import participante
from model.model_administrador import get_admin_by_email, get_all_admins, get_admin_by_id
from model.model_superadmin import get_superadmin_by_email, get_superadmin_by_id
from model.model_participante import get_participante_by_email, get_participante_by_id 
from model.model_stand import get_all_stands, get_stand_by_id,get_current_datetime

"""
Función para buscar un usuario por su correo electrónico.
Busca en las tablas de Participante, Administrador y Superadministrador.
Retorna el usuario encontrado junto con el tipo de usuario.
"""
def get_user_by_email(email):
    participante_query = get_participante_by_email(email)
    administrador_query = get_admin_by_email(email)
    superadministrador_query = get_superadmin_by_email(email)

    if participante_query:
        return participante_query, "participante"
    elif administrador_query:
        return administrador_query, "administrador"
    elif superadministrador_query:
        return superadministrador_query, "superadmin"
    else:
        return None, "none"

# Configuración de la aplicación Flask
app = Flask(__name__)

# Configuración de la conexión con la base de datos utilizando SQLAlchemy
app.config[
    "SQLALCHEMY_DATABASE_URI"
] = "mysql+pymysql://lizardcompany:lizardlord@localhost:3306/proyecto"
app.config.from_mapping(
    SECRET_KEY="dev",
)

#Agregamos controladores
app.register_blueprint(admin)
app.register_blueprint(stand)
app.register_blueprint(participante)

# Inicialización de la base de datos y habilitación de CORS.
db.init_app(app)
CORS(app)

# Ruta principal que redirige a la página de login
@app.route("/", methods=["GET", "POST"])
def main():
    return redirect(url_for("login"))

# Ruta para el registro de nuevos participantes.
@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == 'POST':
        noCuenta = request.json['noCuenta']
        nombre = request.json['nombre']
        apellido = request.json['apellido']
        correo = request.json['correo']
        psswd = request.json['password']
        noStand = request.json['noStand']  

        try:
            adminList = get_admin_by_email(correo)
            superAdminList = get_superadmin_by_email(correo)
            participantesList = get_participante_by_email(correo) 

            if adminList or superAdminList or participantesList:
                return jsonify({'error': 'Error, correo asociado a otra cuenta.'})
            
            adminList = get_admin_by_id(noCuenta)
            superAdminList = get_superadmin_by_id(noCuenta)
            participantesList = get_participante_by_id(noCuenta) 

            if adminList or superAdminList or participantesList:
                return jsonify({'error': 'Error, número de cuenta asociado a otro usuario.'})
            
            participante = Participante(noCuenta, nombre, apellido, correo, psswd, noStand)            
            db.session.add(participante)
            db.session.commit()
            participantesList = get_participante_by_email(correo)
            participante1 = participantesList[0]

        except Exception as e:
            db.session.rollback()  # Revertir cambios en caso de error
            print(f"Error: {str(e)}")
            return jsonify({'error': 'Error en el servidor'}) 
              
    return jsonify({'message':'Registro exitoso', 'id': participante1.noCuenta})

# Ruta para el inicio de sesión.
@app.route("/login", methods=["GET", "POST"])
def login():

    if session.get("user", None) is not None and request.method == "GET":
        return redirect(url_for("index"))
    
    if request.method == "POST":
        datos_json = request.get_json()

        try:
            email = datos_json["email"]
            password = datos_json["password"]
            user_query, tipo_usuario = get_user_by_email(email)
            if not (user_query):
                flash("Ese correo no existe.")
                return jsonify({"error": "Ese correo no existe"})
                # return render_template('login.html')
            user = user_query[0]
            if not validate(password, user.psswd):
                flash("Contraseña incorrecta")
                return jsonify({"error": "Contraseña incorrecta"})
                # return render_template('login.html')
            session.clear()
            session["nombre"] = user.nombre
            session["apellido"] = user.apellido
            session["email"] = user.correo
            session["tipo_usuario"] = tipo_usuario 
            session.modified = True

            if (tipo_usuario == "superadmin"):
                id_usuario = user.noCuentaSupAdm
                print(f"{id_usuario}")
            elif (tipo_usuario == "administrador"):
                id_usuario = user.noCuentaAdmin
            else:
                id_usuario = user.noCuenta
            user_json = {
                    "error": "Ninguno",
                    "noCuenta": id_usuario,
                    "nombre": user.nombre,
                    "apellido": user.apellido,
                    "email": user.correo,
                    "tipo_usuario": tipo_usuario,                    
            }                        
                
            return jsonify(user_json)
            # return render_template('index.html')
        except KeyError:
            flash("No fue enviado con éxito el correo y/o la contraseña")
            return render_template('login.html')
    return render_template('login.html')

# Ruta para el índice. Verifica si el usuario ha iniciado sesión.
@app.route("/index", methods=["GET", "POST"])
def index():
    if session.get("user", None) is None:
        flash("Por favor primero inicie sesión.")

# Ruta para cerrar sesión.
@app.route("/logout", methods=["GET", "POST"])
def logout():
    session.clear()
    g.user = None
    return redirect(url_for("login"))

# Configuración para iniciar la aplicación Flask.
if __name__ == "__main__":
    app.run()
