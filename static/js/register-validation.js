DEFAULT_PROFILE_PHOTO = '/static/img/default_profile.jpg';

document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    if (!validarFormulario()) {
        return; // Detiene el envío si hay errores
    }

    const rutInput = document.getElementById('rut');
    const rutValue = rutInput.value.trim();

    if (!isValidRutFormat(rutValue)) {
        mostrarAlerta('El RUT debe tener el formato 12.345.678-9');
        rutInput.focus();
        return;
    }

    const cleanRut = rutInput.value.replace(/[^\dkK]/gi, '').toUpperCase();

    const password1 = document.getElementById('password1').value.trim();
    const password2 = document.getElementById('password2').value.trim();

    if(password1 !== password2) {
        //Aqui van las contraseñas
        //alert('Las contraseñas no coinciden');
        mostrarAlerta("Las contraseñas no coinciden");
        return;
    }

    const form = event.target;
    const formData = new FormData(form);

    const fileInput = document.getElementById('profileImage');
    const files = fileInput.files;

    if(!files || files.length === 0){
        try {
            const response = await fetch(DEFAULT_PROFILE_PHOTO);
            const blob = await response.blob();
            formData.set('profileImage', blob, `${cleanRut}.jpg`);
        } catch (err) {
            console.warn('', err);
        }
    } else {
        const file = files[0];
        const renamedFile = new File([file], `${cleanRut}.jpg`, {type: file.type});
        formData.set('profileImage', renamedFile);
    }

    formData.set('cleanRut', cleanRut);
    
    /*
    for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
        if (pair[1] instanceof File) {
            console.log(`  ↳ Archivo: ${pair[1].name}, tamaño: ${pair[1].size} bytes`);
        }
    }
    */

    swal.fire({
        title: 'Procesando Datos',
        text: 'Por favor, espere mientras se registran sus datos...',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick:false
    })
    try {
        const response = await fetch('/register', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if(response.ok && result.success) {
            swal.fire({
                title: "Registro exitoso",
                text: "Redirigiendo...",
                icon: "success",
                allowOutsideClick: true,
                showConfirmButton: false,
                timer: 3500
            });
            window.location = result.redirect_url;
        }
        else {
            swal.fire({
                title: "Error",
                text: result.message ||  'Hubo un error en el procesamiento de los datos. Intente nuevamente.',
                icon: "error",
                allowOutsideClick: true,
                showConfirmButton: false,
                timer: 3500
            });
        }
    } catch (error){
        console.log(error);
        swal.fire({
            title: "Error en servidor",
            text: "Hubo un error interno. Intente nuevamente.",
            icon: "error",
            allowOutsideClick: true,
            showConfirmButton: false,
            timer: 3500
        });
    }

});

function isValidRutFormat(rut) {
    const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
    return rutRegex.test(rut);
}

function mostrarAlerta(mensaje) {
    const alertaExistente = document.querySelector('.alert');
    if (alertaExistente) {
        alertaExistente.parentElement.parentElement.remove();  // remueve el .row
    }

    const contenedor = document.createElement('div');
    contenedor.className = 'row justify-content-end my-4 mx-1';

    contenedor.innerHTML = `
        <div class="col-auto">
          <div class="alert alert-warning alert-dismissible fade show" role="alert" id="alerta">
            <strong>${mensaje}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        </div>
    `;

    const page = document.getElementById('alerta');
    page.parentElement.insertBefore(contenedor, page);
}

function validarFormulario() {
    let valido = true;

    const campos = [
        {
            id: 'name',
            mensaje: 'Ingrese su nombre completo.'
        },
        {
            id: 'rut',
            mensaje: 'Ingrese un RUT válido.'
        },
        {
            id: 'email',
            mensaje: 'Ingrese un correo válido.'
        },
        {
            id: 'password1',
            mensaje: 'Ingrese una contraseña.'
        },
        {
            id: 'password2',
            mensaje: 'Repita la contraseña.'
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

    // Validar contraseñas iguales
    const pw1 = document.getElementById('password1');
    const pw2 = document.getElementById('password2');
    if (pw1.value && pw2.value && pw1.value !== pw2.value) {
        pw2.classList.add('is-invalid');
        const feedback = pw2.nextElementSibling;
        if (feedback) feedback.textContent = 'Las contraseñas no coinciden.';
        valido = false;
    }

    return valido;
}

document.querySelectorAll('#registerForm input').forEach(input => {
    input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
            input.classList.remove('is-invalid');
        }
    });
});

function formatearRUT(rut) {
    rut = rut.replace(/[^0-9kK]/gi, '').toUpperCase();

    if (rut.length <= 1) return rut;

    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1);

    let cuerpoFormateado = '';
    let contador = 0;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        cuerpoFormateado = cuerpo[i] + cuerpoFormateado;
        contador++;
        if (contador % 3 === 0 && i !== 0) {
            cuerpoFormateado = '.' + cuerpoFormateado;
        }
    }

    return `${cuerpoFormateado}-${dv}`;
}

const rutInput = document.getElementById('rut');

rutInput.addEventListener('input', function () {
    const cursor = this.selectionStart;
    const raw = this.value.replace(/[^0-9kK]/gi, '');
    const formateado = formatearRUT(raw);

    this.value = formateado;

    // Opcional: restaurar posición aproximada del cursor
    this.setSelectionRange(formateado.length, formateado.length);
});