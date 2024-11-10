from alchemyClasses.Administrador import Administrador

def get_all_admins():
    return Administrador.query.all()

def get_admin_by_id(noCuentaAdmin):
    return Administrador.query.filter(Administrador.noCuentaAdmin == noCuentaAdmin).first()

def get_admin_by_name(nombre):
    return Administrador.query.filter(Administrador.nombre == nombre).all()

def get_admin_by_apellido(apellido):
    return Administrador.query.filter(Administrador.apellido == apellido).all()

def get_admin_by_email(email):
    return Administrador.query.filter(Administrador.correo == email).all()
