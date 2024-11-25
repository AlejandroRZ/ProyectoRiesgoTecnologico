from base64 import b64encode
from Crypto.Util.Padding import pad, unpad
from Crypto.Cipher import AES
from hashlib import sha256

plainkey='RGV2ZWxvcGVyQ29kZTIhQA=='
iv = b'8\xc0-\x93\x0f\nR^\x973\x1a\xeb]\xeb\xae\x89'

# Función para cifrar los datos. Usa AES en modo CBC con la clave y el IV proporcionados.
def cipher(data):
    data_hex = data.encode('utf-8')
    key = b64encode(plainkey.encode('utf-8'))
    aes = AES.new(key, AES.MODE_CBC, iv)
    return aes.encrypt(pad(data_hex, 16))

# Función para descifrar los datos utilizando el mismo algoritmo AES
def decipher(data):
    key = b64encode(plainkey.encode('utf-8'))
    aes = AES.new(key, AES.MODE_CBC, iv)
    return unpad(aes.decrypt(data), 16)

# Función para validar una contraseña comparando su hash
def validate(passwd, hash):
    ct = cipher(passwd)
    m = sha256()
    m.update(ct)
    m = m.hexdigest()
    return m == hash

# Bloque principal que cifra una contraseña y verifica su validez
if __name__ == '__main__':
    passwd = 'Hello different world'
    ct = cipher(passwd)
    m = sha256(ct).hexdigest()
    print(validate(passwd, m))