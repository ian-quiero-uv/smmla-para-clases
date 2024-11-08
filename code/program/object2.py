import copy
#import object1 as object
from . import object1 as object

INTERVALO = 5

def definirConf(collection):
    conf = 0.0
    for i in range(len(collection)):
        if collection[i] >= conf:
            conf = collection[i]
    
    return conf 


def calcDelta(array_1, array_2):
    if array_1[2] == array_2[2]: #Son el mismo objeto
        delta_x = abs(array_2[4] - array_1[4])
        delta_y = abs(array_2[5] - array_1[5])
        delta = [delta_x, delta_y]
    else: #Son dos objetos diferentes que DeepSort les identifico con la misma id en cuadros diferentes
        delta = [0,0]
    return delta

def pasardeFramesaSeconds(collection):
    conf = 0
    count = 0

    output = []

    for i in range(len(collection)-1):
        if collection[i][2] == collection[i+1][2]: #El mismo objeto
            if collection[i][1] == collection[i+1][1]:
                conf = conf + collection[i][5]
                count += 1
                if (i+1) == len(collection):
                    object = []
                    object.append(collection[i][1])
                    object.append(collection[i][2])
                    object.append(collection[i][3])
                    object.append(collection[i][4])
                    object.append(round((conf/count),2))
                    output.append(object)
                    conf = 0
                    count = 0
            else:
                if count != 0:
                    object = []
                    object.append(collection[i][1])
                    object.append(collection[i][2])
                    object.append(collection[i][3])
                    object.append(collection[i][4])
                    object.append(round((conf/count),2))
                    output.append(object)
                    conf = 0
                    count = 0
        else:
            conf = 0
            count = 0
    
    return output

def inicioycierreNuevo(collection):
    
    output = []

    conf_collection = []

    collection = sorted(collection, key=lambda row: row[2])

    conf = 0.0
    inicio = 0
    cierre = 0

    for i in range(len(collection)):
        if i == 0: #Primer elemento de la lista -> Se entra a esta condicional solo una vez.
            conf_collection.append(collection[i][4])
            inicio = collection[i][0]
        else:
            if collection[i-1][2] == collection[i][2] and (collection[i][0] % INTERVALO) == 0 :
                if collection[i][0] == 0: #El objeto esta en el segundo 0
                    conf_collection.append(collection[i][4])
                    inicio = collection[i][0]
                else: #Corte del intervalo
                    conf_collection.append(collection[i][4])
                    cierre = collection[i][0]
                    #Generacion del objeto e inclusion en output
                    object = []
                    object.append(collection[i][1]) #ID del objeto
                    object.append(collection[i][2]) #Nombre del Objeto
                    object.append(inicio) #Tiempo inicio del objeto
                    object.append(cierre) #Tiempo cierre del objeto
                    conf = definirConf(conf_collection)
                    object.append(conf) #Confianza del objeto -> Se eige la mejor dentro del intervalo
                    output.append(object) #Agregamos el objeto a la colleccion final
                    conf_collection = [] #Al cerrar el intervalo, se limpia el grupo de conf.

            elif collection[i-1][2] == collection[i][2] and (collection[i][0] % INTERVALO) != 0: #El objeto en el intervalo
                if (collection[i-1][0] % INTERVALO) == 0: #Nuevo intervalo con el mismo objeto que el anterior
                    inicio = collection[i][0]
                
                conf_collection.append(collection[i][4]) #Se agrega la conf al grupo de conf del intervalo

            elif collection[i-1][2] != collection[i][2]: #Objetos diferentes
                #Primero cerramos el intervalo del objeto anterior
                cierre = collection[i-1][0]
                object = []
                object.append(collection[i][1]) #ID del objeto
                object.append(collection[i][2]) #Nombre del Objeto
                object.append(inicio) #Tiempo inicio del objeto
                object.append(cierre) #Tiempo cierre del objeto
                conf = definirConf(conf_collection)
                object.append(conf) #Confianza del objeto -> Se eige la mejor dentro del intervalo
                output.append(object)
                
                #Ahora iniciamos con el nuevo objeto
                conf_collection = []
                inicio = collection[i][0]
                conf_collection.append(collection[i][4])

    return output

def main(video):
    init_collection = object.main(video)

    init_collection = sorted(init_collection, key=lambda row: row[2])

    first_element = copy.deepcopy(init_collection[0]) #Se utiliza deepcopy, para que la alteracion de first_element no afecte a la colección.
    first_element.pop(5)
    first_element[4] = [0,0]

    second_collection = [first_element]

    for i in range(len(init_collection)-1):
        if init_collection[i][3] == init_collection[i+1][3]:
            delta = calcDelta(init_collection[i], init_collection[i+1])
            second_collection.append([
                init_collection[i][0], 
                init_collection[i][1], 
                init_collection[i][2], 
                init_collection[i][3], 
                delta, 
                init_collection[i][6]])
        else: 
            first_element = copy.deepcopy(init_collection[i+1])
            first_element.pop(5)
            first_element[4] = [0,0]
            second_collection.append(first_element)

    ###########################################
    
    second_collection = sorted(second_collection, key=lambda row: row[2])

    second_collection = [item for item in second_collection if item[4]!= [0,0]]
    
    third_collection = pasardeFramesaSeconds(second_collection)

    final_collection = inicioycierreNuevo(third_collection)

    final_collection = sorted(final_collection, key=lambda row: row[2])

    return final_collection
