
from . import monologo
from . import object1
from . import object2

def main(video, modelo):
    #Primero llamaremos a monologo.py para que genere el json con los datos del video.
    monologo.main(video, modelo)

    #Ahora llamaremos a objects.py que retronara una matriz con todos los objetos detectados que no sean personas, luego filtramos en base a la cantidad de cuadros de diferencia y los valores de las bboxes de cada objeto.
    collection = object2.main(video)     

    #Ahora por cada objeto detectado, se genera un dict que tiene la clase, el conteo de frmaes continuos y la confiabilidad del ML
    obj_dict = []
    for obj in collection:
        element = {}
        element["objeto"] = obj[1]
        element["id"] = obj[0]
        element["inicio"] = obj[2]
        element["cierre"] = obj[3]
        element["conf"] = obj[4]
        obj_dict.append(element)
    
    return obj_dict

