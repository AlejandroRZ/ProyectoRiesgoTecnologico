Reto de remoción de una marca de agua.

Curso de proceso digital de imágenes - semestre 2025-1

Profesores:
Manuel Cristóbal López Michelone
Yessica Martínez Reyes
César Hernández Solís

Alumno:
Javier Alejandro Rivera Zavala - 311288876

Para este script sólo utilicé como extra, la biblioteca PIL ó Pillow de python. Para instarla basta con ejecutar pip install pillow y, una vez cuenten con ella, podrán correr este script con el comando python Reto.py desde su terminal.

Desarrolle algunas funciones que me permitieron ir procesando de a poco las imágenes. Aunque todo el proceso sigue siendo bastante rudimentario, trate de usar todo lo que hemos visto en la clase para obtener un buen resultado.
El procedimiento va más o menos como sigue:

1- Se extraen los pixeles rojos de la imagen a procesar, para ello se recorren todos los pixeles y se toman sólo aquellos donde el valor del campo R es mayor que los otros 2. Los pixeles dónde eso no sucede se pintan de blanco en la imagen de salida.

2- Se refina la extracción por primera vez, para ello se hace búsqueda en profundidad para detectar zonas conexas y se eliminan las que sean demasiado pequeñas. También se eliminan aquellos pixeles que tienden hacia una tonalidad gris dentro de un umbral conveniente.

3- Con la marca de agua extraída y refinada, se barre la misma en la imagen original, es decir, se procesan los pixeles que pertenecen a la misma, reemplazando el color de aquellos que tengan vecinos no rojos, con el color promedio de sus vecinos. Se hace esto unas 2 o 3 veces para mejorar el resultado.

4- Se repite el proceso de extracción de la marca para quedarnos con una zona de trabajo más pequeña.

5- Sobre esta nueva marca, trataremos de "demezclar" los colores, para ello obtenemos el color rojo promedio de la marca y con él tratamos de reajustar los colores a sus originales.

6- Barreremos de nueva cuenta la zona de la marca de agua para ajustar los colores de los pixeles de la zona, también incrementaremos el brillo de la misma en caso de que hayan quedado muy oscuros.

7- Finalmente aplicaremos ajustes a los colores según sea necesario, además, una técnica efectiva para no perder la forma de las figuras en la imagen, consiste en usar convolución sobre la marca de agua para resaltar los bordes y luego mezclar esa marca con la misma zona de la imagen procesada.

Nota:
Como en tareas anteriores, es importante recordar que en la versión más reciente de Python (3.12.5) puede haber problemas al extraer los colores r, g y b, pues extrae además el canal alfa, de ser necesario basta con añadir una variable para capturar la salida del canal alfa (aunque luego no se use) en las líneas donde se extraen dichos valores de un pixel. A mi no me ha dado problemas en linux, pero en Windows 11 sí, por ello la advertencia.
