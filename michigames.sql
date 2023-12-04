CREATE DATABASE proyecto;
USE proyecto;

CREATE USER 'michigames'@'localhost' IDENTIFIED BY 'michigames123';
GRANT ALL PRIVILEGES ON *.* TO 'michigames'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

CREATE TABLE participante(
  idParticipante INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50),
  correo VARCHAR(100) NOT NULL UNIQUE,
  psswd CHAR(64) NOT NULL,
  gamerTag VARCHAR(50) NOT NULL UNIQUE,
  fotoDePerfil BLOB
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

CREATE TABLE es_amigo_de(
  idParticipante_1 INT NOT NULL,
  idParticipante_2 INT NOT NULL,
  PRIMARY KEY (idParticipante_1, idParticipante_2),
  FOREIGN KEY (idParticipante_1) REFERENCES participante(idParticipante) ON DELETE CASCADE,
  FOREIGN KEY (idParticipante_2) REFERENCES participante(idParticipante) ON DELETE CASCADE
);

CREATE TABLE torneo(
  idTorneo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  fechaHora DATETIME NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  idAdministrador INT NOT NULL,
  FOREIGN KEY (idAdministrador) REFERENCES administrador(idAdministrador) ON DELETE CASCADE
);

CREATE TABLE participa_en(
  idParticipante INT NOT NULL,
  idTorneo INT NOT NULL,
  PRIMARY KEY (idParticipante, idTorneo),
  FOREIGN KEY (idParticipante) REFERENCES participante(idParticipante) ON DELETE CASCADE,
  FOREIGN KEY (idTorneo) REFERENCES torneo(idTorneo) ON DELETE CASCADE
);

/* REGISTROS EN PARTICIPANTES */
INSERT INTO proyecto.participante(nombre,apellido,correo,psswd,gamerTag) VALUES ('Rodrigo', 'Robles', 'rodri@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556', 'RodrigoRobles');
INSERT INTO proyecto.participante(nombre,apellido,correo,psswd,gamerTag) VALUES ('Andrea', 'Martinez', 'andy@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556', 'AndreaMartinez');
INSERT INTO proyecto.participante(nombre,apellido,correo,psswd,gamerTag) VALUES ('Emiliano','García','emi_19@gmail.com','40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556','EmilianoGarcía');
INSERT INTO proyecto.participante(nombre,apellido,correo,psswd,gamerTag) VALUES ('Mariana','Hernández','mar@gmail.com','40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556','MarianaHernández');
INSERT INTO proyecto.participante(nombre,apellido,correo,psswd,gamerTag) VALUES ('Avril','Rojas','avril18@gmail.com','40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556', 'AvrilRojas');
INSERT INTO proyecto.participante(nombre,apellido,correo,psswd,gamerTag) VALUES ('Esteban','Contreras','esteb@gmail.com','40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556','EstebanContreras');
INSERT INTO proyecto.participante(nombre,apellido,correo,psswd,gamerTag) VALUES ('Jorge','Peréz','jorge177@gmail.com','40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556','JorgePeréz');
INSERT INTO proyecto.participante(nombre,apellido,correo,psswd,gamerTag) VALUES ('Nadia','Ortega','nadia10@gmail.com','40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556','NadiaOrtega');

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

/*REGISTROS EN LISTA DE AMIGOS (es_amigo_de)*/
INSERT INTO proyecto.es_amigo_de(idParticipante_1,idParticipante_2) VALUES (1,8);
INSERT INTO proyecto.es_amigo_de(idParticipante_1,idParticipante_2) VALUES (2,8);
INSERT INTO proyecto.es_amigo_de(idParticipante_1,idParticipante_2) VALUES (1,3);
INSERT INTO proyecto.es_amigo_de(idParticipante_1,idParticipante_2) VALUES (4,1);
INSERT INTO proyecto.es_amigo_de(idParticipante_1,idParticipante_2) VALUES (3,8);
INSERT INTO proyecto.es_amigo_de(idParticipante_1,idParticipante_2) VALUES (5,2);
INSERT INTO proyecto.es_amigo_de(idParticipante_1,idParticipante_2) VALUES (6,2);
INSERT INTO proyecto.es_amigo_de(idParticipante_1,idParticipante_2) VALUES (7,5);

/*REGISTROS EN TORNEOS*/
INSERT INTO proyecto.torneo(fechaHora,nombre,idAdministrador) VALUES('2023-11-29 15:30:51', 'Battle Royale Blast', 2);
INSERT INTO proyecto.torneo(fechaHora,nombre,idAdministrador) VALUES('2023-11-02 10:12:49', 'Pixel Wars Showdown', 3);
INSERT INTO proyecto.torneo(fechaHora,nombre,idAdministrador) VALUES('2023-11-14 18:10:33','Virtual Victory League',6);
INSERT INTO proyecto.torneo(fechaHora,nombre,idAdministrador) VALUES('2023-10-19 20:00:04','GameMaster Gauntlet',8);
INSERT INTO proyecto.torneo(fechaHora,nombre,idAdministrador) VALUES('2023-11-22 09:37:07','Arcade Clash Challenge',1);
INSERT INTO proyecto.torneo(fechaHora,nombre,idAdministrador) VALUES('2023-10-18 12:05:21','Console Conquest Cup',5);
INSERT INTO proyecto.torneo(fechaHora,nombre,idAdministrador) VALUES('2023-11-28 14:25:13','eSports Arena Royale',5);
INSERT INTO proyecto.torneo(fechaHora,nombre,idAdministrador) VALUES('2023-11-28 14:25:13','Quest for Glory Invitational',7);

/*REGISTROS EN PARTICIPA_EN*/
INSERT INTO proyecto.participa_en(idParticipante,idTorneo) VALUES (1,8);
INSERT INTO proyecto.participa_en(idParticipante,idTorneo) VALUES (1,5);
INSERT INTO proyecto.participa_en(idParticipante,idTorneo) VALUES (2,4);
INSERT INTO proyecto.participa_en(idParticipante,idTorneo) VALUES (3,2);
INSERT INTO proyecto.participa_en(idParticipante,idTorneo) VALUES (4,1);
INSERT INTO proyecto.participa_en(idParticipante,idTorneo) VALUES (4,2);
INSERT INTO proyecto.participa_en(idParticipante,idTorneo) VALUES (8,5);
INSERT INTO proyecto.participa_en(idParticipante,idTorneo) VALUES (7,6);
