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
  noCuentaSupAdm INT NOT NULL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50),
  correo VARCHAR(100) NOT NULL UNIQUE,
  psswd CHAR(64) NOT NULL 
);

CREATE TABLE administrador(
  noCuentaAdmin INT NOT NULL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50),
  correo VARCHAR(100) NOT NULL UNIQUE,
  psswd CHAR(64) NOT NULL,  
  noCuentaSupAdm INT NOT NULL,
  FOREIGN KEY (noCuentaSupAdm) REFERENCES superadmin(noCuentaSupAdm) ON DELETE CASCADE
);

CREATE TABLE stand(
  noStand INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  fechaHora DATETIME NOT NULL,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  ubicacion VARCHAR(100) NOT NULL UNIQUE,
  noCuentaAdmin INT NOT NULL,
  estado BOOLEAN NOT NULL, 
  FOREIGN KEY (noCuentaAdmin) REFERENCES administrador(noCuentaAdmin) ON DELETE CASCADE
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
INSERT INTO proyecto.superadmin(noCuentaSupAdm,nombre,apellido,correo,psswd) VALUES (778899101,'Pedro','Trejo','pepe@gmail.com','40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');
INSERT INTO proyecto.superadmin(noCuentaSupAdm,nombre,apellido,correo,psswd) VALUES (779988101,'Jazmín','Jiménez','jaz33@gmail.com','40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');
INSERT INTO proyecto.superadmin(noCuentaSupAdm,nombre,apellido,correo,psswd) VALUES (773344555,'Miguel','Torres','miguel66@gmail.com','40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');
INSERT INTO proyecto.superadmin(noCuentaSupAdm,nombre,apellido,correo,psswd) VALUES (771166313,'Juan', 'López', 'juanito@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');
INSERT INTO proyecto.superadmin(noCuentaSupAdm,nombre,apellido,correo,psswd) VALUES (779090909,'Sofía', 'González', 'sofi95@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');
INSERT INTO proyecto.superadmin(noCuentaSupAdm,nombre,apellido,correo,psswd) VALUES (776464641,'Diego', 'Hernández', 'dieguito22@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');
INSERT INTO proyecto.superadmin(noCuentaSupAdm,nombre,apellido,correo,psswd) VALUES (774545451,'Valentina', 'Martínez', 'vale.mtz@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');
INSERT INTO proyecto.superadmin(noCuentaSupAdm,nombre,apellido,correo,psswd) VALUES (776886689,'Carlos', 'Ramírez', 'carlitos12@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556');

/*REGISTRO EN ADMINISTRADORES*/
INSERT INTO proyecto.administrador(noCuentaAdmin,nombre,apellido,correo,psswd,noCuentaSupAdm) VALUES (781110001,'Marcos','Torres','marco144@gmail.com','40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556', 778899101);
INSERT INTO proyecto.administrador(noCuentaAdmin,nombre,apellido,correo,psswd,noCuentaSupAdm) VALUES (782221112,'Eduardo', 'Gómez', 'edu_gomez@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556', 778899101);
INSERT INTO proyecto.administrador(noCuentaAdmin,nombre,apellido,correo,psswd,noCuentaSupAdm) VALUES (786665556,'Luisa', 'Martínez', 'luisa_mtz@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556', 771166313);
INSERT INTO proyecto.administrador(noCuentaAdmin,nombre,apellido,correo,psswd,noCuentaSupAdm) VALUES (783334443,'Fernando', 'Hernández', 'fer123@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556', 771166313);
INSERT INTO proyecto.administrador(noCuentaAdmin,nombre,apellido,correo,psswd,noCuentaSupAdm) VALUES (781112221,'Carolina', 'García', 'caro_garcia@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556', 776886689);
INSERT INTO proyecto.administrador(noCuentaAdmin,nombre,apellido,correo,psswd,noCuentaSupAdm) VALUES (787878787,'Javier', 'Pérez', 'javi_perez@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556', 776886689);
INSERT INTO proyecto.administrador(noCuentaAdmin,nombre,apellido,correo,psswd,noCuentaSupAdm) VALUES (780101333,'Ana', 'López', 'ana_lop@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556', 776886689);
INSERT INTO proyecto.administrador(noCuentaAdmin,nombre,apellido,correo,psswd,noCuentaSupAdm) VALUES (789797973,'Roberto', 'Sánchez', 'robert_san@gmail.com', '40d95c2997e76228a22658d815983710602d263b04e70ba24c6387cb37140556', 776464641);


/*REGISTROS DE PUESTOS*/
INSERT INTO proyecto.stand(fechaHora,nombre,ubicacion,noCuentaAdmin,estado) VALUES('2023-11-29 15:30:51', 'Tacos Hermanos','Cuadrante 1 - Plaza Prometeo',781110001,FALSE);
INSERT INTO proyecto.stand(fechaHora,nombre,ubicacion,noCuentaAdmin,estado) VALUES('2023-11-02 10:12:49', 'Papitas picantes','Cuadrante 2 - Plaza Prometeo',781110001,FALSE);
INSERT INTO proyecto.stand(fechaHora,nombre,ubicacion,noCuentaAdmin,estado) VALUES('2023-11-14 18:10:33','Tortas perronas','Cuadrante 3 - Plaza Prometeo',789797973,FALSE);
INSERT INTO proyecto.stand(fechaHora,nombre,ubicacion,noCuentaAdmin,estado) VALUES('2023-10-19 20:00:04','Jugos Maggy','Cuadrante 4 - Plaza Prometeo',789797973,FALSE);
INSERT INTO proyecto.stand(fechaHora,nombre,ubicacion,noCuentaAdmin,estado) VALUES('2023-11-22 09:37:07','Aguas del chavo','Cuadrante 5 - Plaza Prometeo',789797973,FALSE);
INSERT INTO proyecto.stand(fechaHora,nombre,ubicacion,noCuentaAdmin,estado) VALUES('2023-10-18 12:05:21','La Michoacana','Cuadrante 6 - Plaza Prometeo',786665556,FALSE);
INSERT INTO proyecto.stand(fechaHora,nombre,ubicacion,noCuentaAdmin,estado) VALUES('2023-11-28 14:25:13','Ternuritienda','Cuadrante 7 - Plaza Prometeo',782221112,FALSE);
INSERT INTO proyecto.stand(fechaHora,nombre,ubicacion,noCuentaAdmin,estado) VALUES('2023-11-28 14:25:13','La pape','Cuadrante 8 - Plaza Prometeo',780101333,FALSE);

