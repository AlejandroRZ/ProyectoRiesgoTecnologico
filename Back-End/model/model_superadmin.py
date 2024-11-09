from alchemyClasses.Superadmin import Superadmin

def get_all_superadmins():
    return Superadmin.query.all()

def get_superadmin_by_id(noCuentaSupAdm):
    return Superadmin.query.filter(Superadmin.noCuentaSupAdm == noCuentaSupAdm).all()

def get_superadmin_by_name(name):
    return Superadmin.query.filter(Superadmin.nombre == name).all()

def get_superadmin_by_email(email):
    return Superadmin.query.filter(Superadmin.correo == email).all()