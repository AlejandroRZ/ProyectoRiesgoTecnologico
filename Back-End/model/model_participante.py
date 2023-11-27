from alchemyClasses.Participante import Participante

def get_all_participantes():
    return Participante.query.all()

def get_participante_by_id(id):
    return Participante.query.filter(Participante.idParticipante == id).all()

def get_participante_by_name(nombre):
    return Participante.query.filter(Participante.nombre == nombre).all()

def get_participante_by_email(email):
    return Participante.query.filter(Participante.correo == email).all()