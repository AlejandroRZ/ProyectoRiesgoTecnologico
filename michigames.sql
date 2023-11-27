CREATE DATABASE proyecto;
USE proyecto;
CREATE USER 'michigames'@'localhost' IDENTIFIED BY 'michigames123';
GRANT ALL PRIVILEGES ON *.* TO 'michigames'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

CREATE TABLE participante
(
  idParticipante INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50),
  correo VARCHAR(100) NOT NULL UNIQUE,
  psswd CHAR(64) NOT NULL,
  gamerTag VARCHAR(50) NOT NULL UNIQUE,
  fotoDePerfil BLOB
);

CREATE TABLE superadmin
(
  idSuperadmin INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50),
  correo VARCHAR(100) NOT NULL UNIQUE,
  psswd CHAR(64) NOT NULL,
  fotoDePerfil BLOB
);

CREATE TABLE administrador
(
  idAdministrador INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50),
  correo VARCHAR(100) NOT NULL UNIQUE,
  psswd CHAR(64) NOT NULL,
  fotoDePerfil BLOB,
  idSuperadmin INT NOT NULL,
  FOREIGN KEY (idSuperadmin) REFERENCES superadmin(idSuperadmin)
);

CREATE TABLE es_amigo_de
(
  idParticipante_1 INT NOT NULL,
  idParticipante_2 INT NOT NULL,
  PRIMARY KEY (idParticipante_1, idParticipante_2),
  FOREIGN KEY (idParticipante_1) REFERENCES participante(idParticipante),
  FOREIGN KEY (idParticipante_2) REFERENCES participante(idParticipante)
);

CREATE TABLE torneo
(
  idTorneo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  fechaHora DATETIME NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  idAdministrador INT NOT NULL,
  FOREIGN KEY (idAdministrador) REFERENCES administrador(idAdministrador)
);

CREATE TABLE participa_en
(
  idParticipante INT NOT NULL,
  idTorneo INT NOT NULL,
  PRIMARY KEY (idParticipante, idTorneo),
  FOREIGN KEY (idParticipante) REFERENCES participante(idParticipante),
  FOREIGN KEY (idTorneo) REFERENCES torneo(idTorneo)
);
