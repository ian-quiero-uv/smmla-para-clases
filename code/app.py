import ffmpeg
import pyrebase
import os
import json
import subprocess
import cv2
import uuid
from functools import wraps

from flask import Flask, render_template, request, redirect, url_for, session, flash, abort, jsonify
from flask_paginate import Pagination, get_page_parameter, get_page_args
from werkzeug.utils import secure_filename
import requests

from program import main as programa

config = {
    'apiKey': "AIzaSyAKw-aWAeut-Ux-x9oWQa3Y-cQ88aJDIi8",
    'authDomain': "proyecto1-fdc35.firebaseapp.com",
    'databaseURL': "https://proyecto1-fdc35-default-rtdb.firebaseio.com",
    'projectId': "proyecto1-fdc35",
    'storageBucket': "proyecto1-fdc35.appspot.com",
    'messagingSenderId': "866839956611",
    'appId': "1:866839956611:web:6aac42811898efa4f21fb6"
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()

db = firebase.database()

app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = './code/static/'

app.secret_key = '3d6f1a2c-7b8e-4f3b-9c2e-8f5d4e1a0b6c'

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        #global user
        if 'user' not in session:
            return redirect(url_for('login'))
        
        # Verificar y refrescar el token si es necesario
        try:
            if 'expiresIn' in session:
                if int(session['expiresIn']) <= 0:
                    #Token expirado
                    return redirect(url_for('logout'))
                elif int(session['expiresIn']) < 60:  # Si el token expira en menos de 60 segundos
                    refreshToken()
        except KeyError:
            # Si no hay información de expiración, refrescamos el token
            refreshToken()
        except Exception as e:
            print("Error al verificar el token:", e)
            return redirect(url_for('logout'))  # Eliminar la sesión si hay un error
        
        return f(*args, **kwargs)
    return decorated_function

def refreshToken():
    #print(session['refreshToken'])
    #global user
    if 'user' in session:
        try:
            user = auth.refresh(session['refreshToken'])
            session['user'] = user['idToken']
            session['user_info'] = user
            session['refreshToken'] = user['refreshToken']
            session['expiresIn'] = user['expiresIn']
            session['email'] = user['email']
        except Exception as e:
            print("Error al refrescar el token:", e)
            flash("Ocurrió un error al intentar refrescar el token.")
            return redirect(url_for('logout'))

def generarThumbnail(video, path, frame_num=0, width=320, height=240):
    cap = cv2.VideoCapture(video)

    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_num)

    ret, frame = cap.read()

    if ret:
        thumbnail = cv2.resize(frame, (width, height))

        cv2.imwrite(path, thumbnail)
    
    cap.release()
    cv2.destroyAllWindows()

def cambiar_resolucion(input_file, output_file, width, height):
    """
    Cambia la resolución de un video utilizando ffmpeg.

    Args:
        input_file (str): Ruta del archivo de video de entrada.
        output_file (str): Ruta del archivo de video de salida.
        width (int): Ancho de la resolución deseada.
        height (int): Alto de la resolución deseada.
    """
    if input_file == output_file: #Casos donde el nombre del archivo de entrada y salida son iguales
        
        # Crear un nombre de archivo temporal
        temp_file = 'temp_output.mp4'
        
        # Crear un objeto de entrada para el archivo de video
        input_stream = ffmpeg.input(input_file)

        # Cambiar la resolución del video
        output_stream = ffmpeg.hflip(input_stream).filter('scale', width, height)

        # Crear un objeto de salida para el archivo de video temporal
        stream = ffmpeg.output(output_stream, temp_file, vcodec='libx264', crf=18)

        # Ejecutar el comando ffmpeg
        ffmpeg.run(stream)

        # Sobrescribir el archivo de entrada con el archivo temporal
        os.replace(temp_file, input_file)
    else: #Casos donde el nombre del archivo de entrada y salida no son iguales
        
        # Crear un objeto de entrada para el archivo de video
        input_stream = ffmpeg.input(input_file)

        # Cambiar la resolución del video
        output_stream = ffmpeg.hflip(input_stream).filter('scale', width, height)

        # Crear un objeto de salida para el archivo de video
        stream = ffmpeg.output(output_stream, output_file, vcodec='libx264', crf=18)

        # Ejecutar el comando ffmpeg
        ffmpeg.run(stream)




@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET' , 'POST'])
def login():
    #global user
    if 'user' in session:
        return redirect('/main_page')
    if request.method == 'POST':
        email = request.form['username']
        password = request.form['password']
        try:
            user = auth.sign_in_with_email_and_password(email, password)
            if user is not None:
                session['user'] = user['idToken']
                session['user_info'] = user
                session['expiresIn'] = user['expiresIn']
                session['refreshToken'] = user['refreshToken']
                session['email'] = user['email']
                #print("User  Info:", user) 
                return redirect('/main_page')
        except:
            flash("Usuario o contraseña no existente... ")
            return render_template('auth/login.html')
    else:
        return render_template('auth/login.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    session.pop('user_info', None)
    session.pop('refresh_token', None)
    session.pop('expiresIn', None)
    session.pop('email', None)
    return redirect('/')

@app.route("/forget", methods=['GET' , 'POST'])
def forget():
    if request.method == 'POST':
        email = request.form['email']
        try:
            auth.send_password_reset_email(email)
            flash("Se ha enviado un correo electrónico a la cuenta proporcionada, si no recibe el correo entonces esa cuenta no esta registrada en el sistema.")
            return redirect(url_for('login'))
        except Exception as e:  # Captura cualquier excepción
            error_message = str(e)
            flash("Ocurrió un error: " + error_message)
            return render_template('auth/forget.html')
    else:
        flash("Advertencia: no recibira un correo de reinicio, si el correo no esta registrado")
        return render_template('auth/forget.html')

@app.route("/register", methods=['GET' , 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        try:
            auth.sign_in_with_email_and_password(email=email, password=password)
            flash("Este correo ya tiene una cuenta registrada")
            return render_template('auth/register.html')
        except Exception as e:  # Captura cualquier excepción
            if "INVALID_LOGIN_CREDENTIALS" in str(e):
                try:
                    user = auth.create_user_with_email_and_password(email=email, password=password)
                    flash("Usuario creado con éxito. Ahora puedes iniciar sesion ahora")
                    return redirect(url_for('login'))
                except Exception as e:  # Captura cualquier excepción
                    flash("Error al registrar el usuario")
                    return render_template('auth/register.html')
            else:
                flash("Error al verificar el correo: " + str(e))
                return render_template('auth/register.html')
    else:
        return render_template('auth/register.html')

@app.route('/main_page', methods=['GET'])
@login_required
def main_page():
    #Verificamos si hay un usuario registrado ingresando a la ruta, de lo contrario, le negamos el acceso
    if 'user' in session:
        try:

            #Obtenemos informacion del perfil del usuario antes
            od_profile = db.child('usuarios').order_by_child("correo").equal_to(session['email']).get(session['user']).val()

            for key, value in od_profile.items():
                profile = value

            profile_photo = "img/users/" + profile['foto'] + ".jpg"

            #Obtenemos la informacion y luego contamos las practicas registradas en el sistema
            data = []
            od_dict=db.child('grabaciones').get(session['user']).val()

            #Rellenamos data con los valores de od_dict extraidos directamente de Firebase
            for key, value in od_dict.items():
                data.append(value)

            #Renderizamos la pagina
            return render_template('main_page.html', grabaciones=data, perfil=profile, foto=profile_photo)
        except Exception as e:
            print("Error en main_page", e)
            flash("Ocurrió un error al acceder a la página principal.")
            return redirect(url_for('logout'))
    else:
        abort(401) #Permite que los usuarios no registrados en sesion no puedan acceder...

@app.route('/video/<id>')
@login_required
def video(id):
    if 'user' in session:

        #Obtenemos informacion del perfil del usuario antes
        od_profile = db.child('usuarios').order_by_child("correo").equal_to(session['email']).get(session['user']).val()

        for key, value in od_profile.items():
            profile = value

        profile_photo = "img/users/" + profile['foto'] + ".jpg"

        #Obtenemos la informacion del video de la respectiva id
        od_dict = db.child("grabaciones").order_by_child("id").equal_to(id).get(session['user']).val()
        for key, value in od_dict.items():
            data = value.get('nombre_vid')
        video_file = "vid/" + data + ".mp4"
        json_data = []
        json_dir = "app/static/json/" + id + ".json"
        isFile = os.path.isfile(json_dir)
        if (not isFile): #De no existir el archivo json con los comentarios, se crea un archivo json con 
            with open(json_dir, "w") as fp:
                json.dump(json_data, fp)
        else:
            with open (json_dir, "r") as json_file:
                json_data = json.load(json_file)
        #Aqui recuperaremos la data de cada json del video
        transcript_dir = "./app/whisperjson/" + data + ".json"
        with open (transcript_dir, "r") as mono: #Monologo
            transcript = json.load(mono)

        with open ("./app/yolo_obj/" + data + ".json", "r") as obj: #Objetos
            detected = json.load(obj)

        return render_template('video.html', video=video_file, json=json_data, transcript_dir=transcript_dir, transcript=transcript, objetos=detected, perfil=profile, foto=profile_photo)
    else:
        abort(401)

@app.route('/upload')
@login_required
def upload():
    if 'user' in session:
        #Obtenemos informacion del perfil del usuario antes
        od_profile = db.child('usuarios').order_by_child("correo").equal_to(session['email']).get(session['user']).val()

        for key, value in od_profile.items():
            profile = value

        profile_photo = "img/users/" + profile['foto'] + ".jpg"

        return render_template('upload.html', perfil=profile, foto=profile_photo)
    else:
        abort(401)

#Rutas para cargar y/o cambiar datos a la base, tambien la ruta para realizar el analisis del video.
'''
@app.route('/change_password', methods=['POST']) #Ruta inhabilitada por limitaciones de Pyrebase4.
@login_required
def change_password():
    if request.method == 'POST':
        jsonData = request.get_json()  # Asegúrate de obtener el JSON del cuerpo de la solicitud
        new_password = jsonData.get('new_password')  # Extrae el nuevo password
        user_info = session.get('user_info')
        # Payload para cambiar la contraseña
        data = {
            "idToken": user_info['idToken'],
            "password": new_password,
            "returnSecureToken": True
        }

        if not new_password:
            return jsonify({"status": "error", "message": "No se proporcionó una nueva contraseña."}), 400
        else:
            print(new_password)
            try:
                # Cambiar la contraseña utilizando el token de usuario
                #auth.update_user(user_info['idToken'], password=new_password

                # Hacer la solicitud POST para actualizar la contraseña
                response = requests.post(url, data=data)
                # Verificar si la respuesta fue exitosa
                response.raise_for_status()  # Levanta un error para códigos de estado HTTP 4xx/5xx

                flash("La contraseña se ha cambiado correctamente.")
                return jsonify({"status": "success", "message": "La contraseña se ha cambiado correctamente."}), 200
            except Exception as e:
                flash("Error al cambiar la contraseña: " + str(e))
                return jsonify({"status": "error", "message": str(e)}), 400

    else:
        abort(401)
'''


@app.route('/uploader', methods=['POST'])
@login_required
def uploader():
    if 'user' in session:
        #refreshToken()
        if request.method == 'POST':
            id = str(uuid.uuid4())
            filename = request.form['fileName']
            practicante = request.form['nombrePrac']
            fecha = request.form['fecha']
            establecimiento = request.form['nombreEstabl']
            contenido = request.form['contenidoClase']
            f = request.files['fileElem']
            file_name = secure_filename(f.filename)
            f.save(os.path.join(app.config['UPLOAD_FOLDER'], "vid/" + file_name))
            file_uploaded = app.config['UPLOAD_FOLDER'] + 'vid/' + f.filename
            final_file = app.config['UPLOAD_FOLDER'] + 'vid/' + filename + '.mp4'
            thumb_path =  app.config['UPLOAD_FOLDER'] + 'img/thumbnails/' + filename + '.jpeg'
            data = {"establecimiento":establecimiento, "fecha":fecha, "id":id, "nombre_vid":filename, "practicante":practicante, "contenido":contenido}
            db.child('grabaciones').push(data, session['user'])
            if file_uploaded == final_file:
                cambiar_resolucion(file_uploaded, final_file, 640, 480)
                #subprocess.call(['ffmpeg.exe', '-y', '-i', file_uploaded, '-vf', 'scale=854:480', final_file]) Proceso por consola, no usar.
            else:
                cambiar_resolucion(file_uploaded, final_file, 640, 480)
                #subprocess.call(['ffmpeg.exe', '-i', file_uploaded, '-vf', 'scale=854:480', final_file]) Proceso por consola, no usar.
                os.remove(file_uploaded)
            generarThumbnail(final_file, thumb_path)
            return redirect(url_for('analizar', id=id, model="base"))
    else:
        abort(401)

@app.route("/jsonupload/<id>", methods=['POST']) #¿Cambiar a POST?
@login_required
def jsonupload(id):
    if request.method == 'POST':
        jsonData = request.get_json()
        json_dir = app.config['UPLOAD_FOLDER'] + "/json/" + id + ".json"
        with open(json_dir, 'w') as json_write:
            json.dump(jsonData, json_write)
        return {
            'response' : 'I am the response'
        }

@app.route("/jsontranscript/<filename>", methods=['POST'])
@login_required
def jsontranscript(filename):
    if request.method == 'POST':
        jsonData = request.get_json()
        transcript_dir = "./app/whisperjson/" + filename + ".json"
        with open(transcript_dir, "r") as read:
            transcript = json.load(read)
        
        for tran in transcript:
            if tran["id"] == int(jsonData["id"]):
                tran["text"] = jsonData["text"]

        with open(transcript_dir, "w") as write:
            json.dump(transcript, write)

        return {
            'response' : 'You did it!'
        }

@app.route("/analizar/<id>/<model>")
@login_required
def analizar(id, model):
    #idx = int(id)
    od_dict = db.child("grabaciones").order_by_child("id").equal_to(id).get(session['user']).val()
    for key, value in od_dict.items():
        data = value.get('nombre_vid')
    video_file = "vid/" + data + ".mp4"
    detected = programa.main("./app/static/" + video_file, modelo=model)
    dir = "app/yolo_obj/" + data + ".json" 
    with open (dir, "w") as json_file:
        json.dump(detected, json_file)

    return redirect(url_for('video', id=id))


#Generar caso con error 405 Method Not Allowed y 408 

def acceso_no_autorizado(error):
    flash("No tienes permiso para ver esta pagina")
    return redirect(url_for('index'))

def pagina_no_encontrada(error):
    return render_template('404.html'), 404
    #return redirect(url_for('index'))

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"status": "error", "message": "Error interno del servidor."}), 500


if __name__=='__main__':
    app.register_error_handler(404, pagina_no_encontrada)
    app.register_error_handler(401, acceso_no_autorizado)
    app.run(debug=True, port=5000)