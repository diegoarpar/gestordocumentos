import base64

def almacenarArchivo(base64Str, fileName, filePath):
    try:
        contenido = base64Str.split(",")[1]
        with open(filePath, "w+") as f:
            contenido = base64.b64decode(contenido)
            f.write(contenido.decode("utf-8"))
    except Exception as e:
        print(str(e))