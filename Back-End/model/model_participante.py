from alchemyClasses.Participante import Participante

# Función para obtener todos los participantes registrados en la base de datos.
def get_all_participantes():
    return Participante.query.all()

# Función para obtener todos los participantes registrados en la base de datos.
def get_participante_by_id(noCuenta):
    return Participante.query.filter(Participante.noCuenta == noCuenta).all()

# Función para obtener participantes con un nombre específico.
def get_participante_by_name(nombre):
    return Participante.query.filter(Participante.nombre == nombre).all()

# Función para obtener participantes por correo electrónico.
def get_participante_by_email(email):
    return Participante.query.filter(Participante.correo == email).all()

