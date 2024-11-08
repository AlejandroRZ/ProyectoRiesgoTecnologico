CREATE DATABASE proyecto;
USE proyecto;

CREATE USER 'lizardcompany'@'localhost' IDENTIFIED BY 'lizardlord';
GRANT ALL PRIVILEGES ON *.* TO 'lizardcompany'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

CREATE TABLE participante(
  noCuenta INT NOT NULL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50),
  correo VARCHAR(100) NOT NULL UNIQUE,
  psswd CHAR(64) NOT NULL  
);

CREATE TABLE superadmin(
  idSuperadmin INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50),
  correo VARCHAR(100) NOT NULL UNIQUE,
  psswd CHAR(64) NOT NULL,
  fotoDePerfil BLOB
);

CREATE TABLE administrador(
  idAdministrador INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50),
  correo VARCHAR(100) NOT NULL UNIQUE,
  psswd CHAR(64) NOT NULL,
  fotoDePerfil BLOB,
  idSuperadmin INT NOT NULL,
  FOREIGN KEY (idSuperadmin) REFERENCES superadmin(idSuperadmin) ON DELETE CASCADE
);

CREATE TABLE torneo(
  idTorneo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  fechaHora DATETIME NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  idAdministrador INT NOT NULL,
  FOREIGN KEY (idAdministrador) REFERENCES administrador(idAdministrador) ON DELETE CASCADE
);


/* REGISTROS EN PARTICIPANTES */
INSERT INTO proyecto.participante(noCuenta,nombre,apellido,correo,psswd) VALUES (711289943, 'Rodrigo', 'Robles', 'rodri@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');
INSERT INTO proyecto.participante(noCuenta,nombre,apellido,correo,psswd) VALUES (711354678,'Andrea', 'Martinez', 'andy@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');
INSERT INTO proyecto.participante(noCuenta,nombre,apellido,correo,psswd) VALUES (711999231, 'Emiliano','García','emi_19@gmail.com','40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');
INSERT INTO proyecto.participante(noCuenta,nombre,apellido,correo,psswd) VALUES (711987321, 'Mariana','Hernández','mar@gmail.com','40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');
INSERT INTO proyecto.participante(noCuenta,nombre,apellido,correo,psswd) VALUES (711223366, 'Avril','Rojas','avril18@gmail.com','40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');
INSERT INTO proyecto.participante(noCuenta,nombre,apellido,correo,psswd) VALUES (711890012, 'Esteban','Contreras','esteb@gmail.com','40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');
INSERT INTO proyecto.participante(noCuenta,nombre,apellido,correo,psswd) VALUES (711353535, 'Jorge','Peréz','jorge177@gmail.com','40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');
INSERT INTO proyecto.participante(noCuenta,nombre,apellido,correo,psswd) VALUES (711494847, 'Nadia','Ortega','nadia10@gmail.com','40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');

/*REGISTROS DE SUPER ADMINISTRADORES*/
INSERT INTO proyecto.superadmin(nombre,apellido,correo,psswd) VALUES ('Pedro','Trejo','pepe@gmail.com','40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');
INSERT INTO proyecto.superadmin(nombre,apellido,correo,psswd) VALUES ('Jazmín','Jiménez','jaz33@gmail.com','40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');
INSERT INTO proyecto.superadmin(nombre,apellido,correo,psswd) VALUES ('Miguel','Torres','miguel66@gmail.com','40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');
INSERT INTO proyecto.superadmin(nombre, apellido, correo, psswd) VALUES ('Juan', 'López', 'juanito@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');
INSERT INTO proyecto.superadmin(nombre, apellido, correo, psswd) VALUES ('Sofía', 'González', 'sofi95@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');
INSERT INTO proyecto.superadmin(nombre, apellido, correo, psswd) VALUES ('Diego', 'Hernández', 'dieguito22@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');
INSERT INTO proyecto.superadmin(nombre, apellido, correo, psswd) VALUES ('Valentina', 'Martínez', 'vale.mtz@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');
INSERT INTO proyecto.superadmin(nombre, apellido, correo, psswd) VALUES ('Carlos', 'Ramírez', 'carlitos12@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');

/*REGISTRO EN ADMINISTRADORES*/
INSERT INTO proyecto.administrador(nombre,apellido,correo,psswd,idSuperadmin) VALUES ('Marcos','Torres','marco144@gmail.com','40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556', 2);
INSERT INTO proyecto.administrador(nombre, apellido, correo, psswd, idSuperadmin) VALUES ('Eduardo', 'Gómez', 'edu_gomez@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556', 1);
INSERT INTO proyecto.administrador(nombre, apellido, correo, psswd, idSuperadmin) VALUES ('Luisa', 'Martínez', 'luisa_mtz@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556', 8);
INSERT INTO proyecto.administrador(nombre, apellido, correo, psswd, idSuperadmin) VALUES ('Fernando', 'Hernández', 'fer123@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556', 3);
INSERT INTO proyecto.administrador(nombre, apellido, correo, psswd, idSuperadmin) VALUES ('Carolina', 'García', 'caro_garcia@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556', 4);
INSERT INTO proyecto.administrador(nombre, apellido, correo, psswd, idSuperadmin) VALUES ('Javier', 'Pérez', 'javi_perez@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556', 3);
INSERT INTO proyecto.administrador(nombre, apellido, correo, psswd, idSuperadmin) VALUES ('Ana', 'López', 'ana_lop@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556', 5);
INSERT INTO proyecto.administrador(nombre, apellido, correo, psswd, idSuperadmin) VALUES ('Roberto', 'Sánchez', 'robert_san@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556', 7);


/*REGISTROS EN TORNEOS*/
INSERT INTO proyecto.torneo(fechaHora,nombre,idAdministrador) VALUES('2023-11-29 15:30:51', 'Battle Royale Blast', 2);
INSERT INTO proyecto.torneo(fechaHora,nombre,idAdministrador) VALUES('2023-11-02 10:12:49', 'Pixel Wars Showdown', 3);
INSERT INTO proyecto.torneo(fechaHora,nombre,idAdministrador) VALUES('2023-11-14 18:10:33','Virtual Victory League',6);
INSERT INTO proyecto.torneo(fechaHora,nombre,idAdministrador) VALUES('2023-10-19 20:00:04','GameMaster Gauntlet',8);
INSERT INTO proyecto.torneo(fechaHora,nombre,idAdministrador) VALUES('2023-11-22 09:37:07','Arcade Clash Challenge',1);
INSERT INTO proyecto.torneo(fechaHora,nombre,idAdministrador) VALUES('2023-10-18 12:05:21','Console Conquest Cup',5);
INSERT INTO proyecto.torneo(fechaHora,nombre,idAdministrador) VALUES('2023-11-28 14:25:13','eSports Arena Royale',5);
INSERT INTO proyecto.torneo(fechaHora,nombre,idAdministrador) VALUES('2023-11-28 14:25:13','Quest for Glory Invitational',7);

