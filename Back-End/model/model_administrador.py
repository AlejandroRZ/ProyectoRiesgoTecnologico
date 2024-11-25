from alchemyClasses.Administrador import Administrador

# Función para obtener todos los administradores de la base de datos.
def get_all_admins():
    return Administrador.query.all()

# Función para obtener todos los administradores de la base de datos.
def get_admin_by_id(noCuentaAdmin):
    return Administrador.query.filter(Administrador.noCuentaAdmin == noCuentaAdmin).first()

# Función para obtener administradores con un nombre específico.
def get_admin_by_name(nombre):
    return Administrador.query.filter(Administrador.nombre == nombre).all()

# Función para obtener administradores que tengan un apellido específico.
def get_admin_by_apellido(apellido):
    return Administrador.query.filter(Administrador.apellido == apellido).all()

# Función para obtener administradores con un correo electrónico específico.
def get_admin_by_email(email):
    return Administrador.query.filter(Administrador.correo == email).all()
