document.getElementById('uploader').addEventListener('submit', async function(event){
    event.preventDefault();

    if (!validarFormulario()) {
        return; // Detiene el envío si hay errores
    }
    // Si todos los campos estan validados, se continua con la subida del archivo.

    const form = event.target;
    const formData = new FormData(form);

    swal.fire({
        title: 'Cargando los datos.',
        text: 'Por favor, espere mientras se cargan sus datos...',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick:false
    })

    try {
        const response = await fetch('/uploader', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if(response.ok && result.success) {
            swal.fire({
                title: result.message,
                text: "Iniciando proceso de análisis.",
                icon: 'info',
                showConfirmButton: false,
                allowOutsideClick:false
            });
            
            const analyzeResponse = await fetch(result.fetch_url, {
                method: 'GET',
            });

            const analyzeResult = await analyzeResponse.json();
            if(analyzeResponse.ok && analyzeResult.success) {
                swal.fire({
                    title: analyzeResult.message,
                    text: "Redirigiendo al análisis del video.",
                    icon: "success",
                    allowOutsideClick: true,
                    showConfirmButton: false,
                    timer: 3500
                });
                window.location = analyzeResult.redirect_url;
            }
            else {
                swal.fire({
                    title: "Error",
                    text: result.message ||  'Hubo un error en el análisis de la grabación. Intente nuevamente.',
                    icon: "error",
                    allowOutsideClick: true,
                    showConfirmButton: false,
                    timer: 3500
                });
            }
        }
        else {
            swal.fire({
                title: "Error",
                text: result.message ||  'Hubo un error en la subida de los datos. Intente nuevamente.',
                icon: "error",
                allowOutsideClick: true,
                showConfirmButton: false,
                timer: 3500
            });
        }

    } catch (error){
        console.log(error);
        swal.fire({
            title: "Error en servidor.",
            text: "Hubo un error interno. Intente nuevamente.",
            icon: "error",
            allowOutsideClick: true,
            showConfirmButton: false,
            timer: 3500
        });
    }
})

function validarFormulario() {
    let valido = true;

    const campos = [
        {
            id: 'nombrePrac',
            mensaje: 'Ingrese el nombre del practicante.'
        },
        {
            id: 'fecha',
            mensaje: 'Indique la fecha de grabación.'
        },
        {
            id: 'nombreEstabl',
            mensaje: 'Ingrese el nombre del establecimiento donde se realizó la práctica.'
        },
        {
            id: 'contenidoClase',
            mensaje: 'Ingrese el contenido de la clase grabada.'
        },
        {
            id: 'fileName',
            mensaje: 'Ingrese un nombre para el video.'
        },
        {
            id: 'fileElem',
            mensaje: 'Debes subir un archivo de video en formato .mp4.'
        }
    ];

    campos.forEach(campo => {
        const input = document.getElementById(campo.id);
        const feedback = input.nextElementSibling;

        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            if (feedback) feedback.textContent = campo.mensaje;
            valido = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });

    return valido;
}