# smmla-para-clases
Sistema de aprendizaje autónomo de elementos multimodales para docentes.

***Sistema diseñado como proyecto de tesis***.

# ChangeLog

## Versión: 1.0.0 (*08/11/2024*)

- Versión Inicial del sistema

## Versión: 1.0.1 (*06/12/2024*)

- Mejoras generales al sistema
- Cambio de dependencia de `opencv-python` a `opencv-python-headless`

## Versión: 1.0.2 (*10/12/2024*)

- Texto añadido a los `svg` de los gráficos en `video.html`
- Cambio en el tag de `title`
- Inclusión de archivo **DockerFile** para generar imagen del sistema.

## Versión: 1.0.3 (*12/12/2024*)

- Cambio de puerto **5000** a **80** en `app.py`
- Cambio de modo **Debug** a **Producción** en `app.py`
- Exposición del puerto **80** en el archivo **DockerFile**

## Versión: 1.0.4 (*19/12/2024*)

- Exposición del puerto **80** en `compose.yaml`
- Reducción de dependencias `pip`

## Versión: 1.1.0 (*22/05/2025*)

- Se modifico el `compose.yaml` para indicar la composición del sistema y volúmenes necesarios.
- Se remodelo el sistema usando de base el template de [Tabler Admin Template](https://tabler.io/admin-template).
- Se agregaron [Themify Icons](https://themify.me/themify-icons) y [Font-Awesome](https://fontawesome.com/icons) como iconos para el sistema.
- Se añadieron las siguientes dependencias a `requirements.txt`
    + `torch`
    + `torchvision`
    + `openai-whisper`

- Se incluyo un ***ChangeLog*** en `README.md`, de ahora en adelante se utilizará para indicar los cambios realizados al sistema.

## Versión: 1.1.1 (*30/06/2025*)

- Se implemento un gestor de colas con *SweetAlert2* tanto para las cargas de las grabaciones al sistema como para los análisis con IA.
- Se completo el proceso de registro para abarcar Nombre, Rut y Foto de Perfil (opcional).
- Se creo una página de Guía que explica el funcionamiento del sistema para los usuarios (Esta se accede por la página de Login).
- Se implemento **Nginx** con **gunicorn** para montaje como servidor y proxy inverso.
- Se creo la carpeta `logs` con registros de **Nginx**, esto se almacena como volumen en Docker para tener registros de accesos y errores mientras el container este activo.

## Versión: 1.1.2 (*13/08/2025*)

- Corrección de imagenes en la página de la Guía del sistema.
- Corrección error 404 cuando un video no se encuentra,