import whisper
from whisper.utils import get_writer

def main(audio, modelo):

    model = whisper.load_model(modelo)
    #audio="data\clase.mp4"
    result = model.transcribe(audio)

    #text_writer = get_writer("txt", "./whispertexts")
    #text_writer(result, audio)
    count = 1

    i=0

    while i < len(result["segments"]): #Se utiliza bucle while y no for, debido a que el largo de la lista va modificandose por cada union de longitud.
        if result["segments"][i-1]["end"] == result["segments"][i]["start"]:
            if count == 3: #Si hay mas de tres segmentos juntos, se corta en el tercero
                count = 1
            else:
                temp1 = result["segments"][i-1]["text"]
                temp2 = result["segments"][i]["text"]
                final = temp1 + temp2

                result["segments"][i-1]["text"] = final
                result["segments"][i-1]["end"] = result["segments"][i]["end"]
                result["segments"].pop(i)
                i = i - 1 #Se vuelve a comparar el valor inicial, para verificar si hay otro segmento junto.
                count =  count + 1
        else:
            count = 1
        i = i + 1


    json_writer = get_writer("json", "./code/whisperjson")
    json_writer(result["segments"], audio)

#main("app/static/vid/test2p.mp4")