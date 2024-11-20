from PIL import Image
#San Martín Macías Juan Daniel

# Identifica áreas donde predomina el color rojo y transforma las demás áreas en blanco.
def detectar_areas_rojas(img_base):
    w, h = img_base.size
    resultado = Image.new("RGB", (w, h))
    px_in = img_base.load()
    px_out = resultado.load()

    for x in range(w):
        for y in range(h):
            r, g, b = px_in[x, y]
            px_out[x, y] = (r, g, b) if r > g and r > b else (255, 255, 255)

    return resultado


# Encuentra regiones conectadas de píxeles no blancos.
def buscar_regiones(img):
    w, h = img.size
    visitados = [[False] * h for _ in range(w)]
    regiones = []

    def explorar(x, y):
        stack = [(x, y)]
        region = []
        while stack:
            cx, cy = stack.pop()
            if not visitados[cx][cy]:
                visitados[cx][cy] = True
                r, g, b = img.getpixel((cx, cy))
                if (r, g, b) != (255, 255, 255):
                    region.append((cx, cy))
                    for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                        nx, ny = cx + dx, cy + dy
                        if 0 <= nx < w and 0 <= ny < h and not visitados[nx][ny]:
                            stack.append((nx, ny))
        return region

    for x in range(w):
        for y in range(h):
            if not visitados[x][y] and img.getpixel((x, y)) != (255, 255, 255):
                regiones.append(explorar(x, y))

    return regiones


# Borra regiones pequeñas según un umbral.
def limpiar_regiones_pequenas(img, regiones, umbral):
    px = img.load()
    for region in regiones:
        if len(region) < umbral:
            for x, y in region:
                px[x, y] = (255, 255, 255)
    return img


# Filtra píxeles grises (RGB cercanos) de la imagen.
def eliminar_tonos_grises(img, tolerancia):
    px = img.load()
    w, h = img.size
    for x in range(w):
        for y in range(h):
            r, g, b = px[x, y]
            if max(abs(r - g), abs(r - b), abs(g - b)) < tolerancia:
                px[x, y] = (255, 255, 255)
    return img


# Reemplaza píxeles en una imagen basada en una matriz de vecinos.
def reemplazar_por_vecinos(img_base, marca_agua, tam_matriz):
    w, h = img_base.size
    img_resultado = img_base.copy()
    px_base = img_base.load()
    px_marca = marca_agua.load()
    px_result = img_resultado.load()

    def promedio_vecinos(x, y):
        colores = []
        for i in range(-tam_matriz // 2, tam_matriz // 2 + 1):
            for j in range(-tam_matriz // 2, tam_matriz // 2 + 1):
                nx, ny = (x + i) % w, (y + j) % h
                if px_marca[nx, ny] == (255, 255, 255):
                    colores.append(px_base[nx, ny])
        if colores:
            r, g, b = zip(*colores)
            return sum(r) // len(r), sum(g) // len(g), sum(b) // len(b)
        return None

    for x in range(w):
        for y in range(h):
            if px_marca[x, y] != (255, 255, 255):
                nuevo_color = promedio_vecinos(x, y)
                px_result[x, y] = nuevo_color if nuevo_color else px_base[x, y]

    return img_resultado


# Main
def ejecutar_reto(imagen, reto):
    if reto == "1":
        marca = detectar_areas_rojas(imagen)
        regiones = buscar_regiones(marca)
        marca = limpiar_regiones_pequenas(marca, regiones, 500)
        marca = eliminar_tonos_grises(marca, 12)

        imagen_resultado = reemplazar_por_vecinos(imagen, marca, 3)
        imagen_resultado.save("reto1_modificado.png")
        print("Primer reto completado: guardado como 'reto1_modificado.png'")
    elif reto == "2":
        marca = extraer_rojo(imagen)
        regiones = buscar_regiones(marca)
        marca = limpiar_regiones_pequenas(marca, regiones, 100)
        marca = eliminar_tonos_grises(marca, 15)

        imagen_resultado = barrer_marca_agua(imagen, marca, 3)
        imagen_resultado = incrementar_brillo_marca_agua(imagen_resultado, marca, 2.2)
        imagen_resultado.save("reto2_modificado.png")
        print("Segundo reto completado: guardado como 'reto2_modificado.png'")
    elif reto == "3":
        marca = extraer_rojo(imagen)
        regiones = buscar_regiones(marca)
        marca = eliminar_zonas_pequenas(marca, regiones, 100)
        marca = eliminar_pixeles_grises(marca, 20)

        imagen_resultado = barrer_marca_agua(imagen, marca, 3)
        rojo_prom = get_rojo_promedio(marca)
        imagen_resultado = demezclar_marca_agua(imagen_resultado, marca, rojo_prom, 0.5)
        imagen_resultado = incrementar_brillo_marca_agua(imagen_resultado, marca, 1.7)
        imagen_resultado.save("reto3_modificado.png")
        print("Tercer reto completado: guardado como 'reto3_modificado.png'")
    else:
        print("Reto no válido. Por favor, elige entre 1, 2 o 3.")

# Main interactivo
if __name__ == "__main__":
    print("=== Programa de procesamiento de imágenes ===")
    ruta_imagen = input("Introduce la ruta de la imagen que deseas procesar: ")
    
    try:
        imagen = Image.open(ruta_imagen)
        print(f"Imagen '{ruta_imagen}' cargada correctamente.")
    except FileNotFoundError:
        print("La imagen no se encontró. Asegúrate de que la ruta sea correcta.")
        exit()
    
    print("Opciones de retos:")
    print("1. Primer reto")
    print("2. Segundo reto")
    print("3. Tercer reto")
    reto = input("Selecciona el reto que deseas ejecutar (1, 2, o 3): ")
    ejecutar_reto(imagen, reto)