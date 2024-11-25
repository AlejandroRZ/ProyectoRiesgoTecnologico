from alchemyClasses.Superadmin import Superadmin

# Función para obtener todos los superadministradores registrados en la base de datos.
def get_all_superadmins():
    return Superadmin.query.all()

# Función para obtener todos los superadministradores registrados en la base de datos.
def get_superadmin_by_id(noCuentaSupAdm):
    return Superadmin.query.filter(Superadmin.noCuentaSupAdm == noCuentaSupAdm).all()

# Función para obtener superadministradores por su nombre.
def get_superadmin_by_name(name):
    return Superadmin.query.filter(Superadmin.nombre == name).all()

# Función para obtener superadministradores por su correo electrónico.
def get_superadmin_by_email(email):
    return Superadmin.query.filter(Superadmin.correo == email).all()