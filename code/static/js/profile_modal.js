
//Script desabilitado por no existitr funcionalidad en Pyrebase4 para cambiar la contraseña del usuario.
/*document.getElementById('password_change').addEventListener("click", function () {
    document.getElementById('password_form').addEventListener('submit', function(event) {
        event.preventDefault();
    });

    var password = document.getElementById('newPassword').value;
    var confirm = document.getElementById('confirmPassword').value;
    var toast = document.getElementById('password_toast');
    const toast_message = document.getElementById('toast_message')
    const passwordLengthText = document.getElementById('passwordLength');

    // Validar longitud de la contraseña
    if (password.length < 8) {
        //alert("La contraseña debe tener al menos 8 caracteres.");
        toast_message.textContent = "La contraseña debe tener al menos 8 caracteres.";
        toast.style.display = 'block';
        setTimeout(function() {
            toast.style.display = 'none';
        }, 3000);
        return; // Detiene la ejecución si la contraseña es demasiado corta
    }

    // Validar coincidencia de contraseñas
    if (password !== confirm) {
        toast_message.textContent = "Las contraseñas no coinciden.";
        toast.style.display = 'block'; // Mostrar el toast
        setTimeout(function() {
            toast.style.display = 'none';
        }, 3000);
        return; // Detiene la ejecución si las contraseñas no coinciden
    }

    //console.log("Contraseña nueva: " + password + " confirmacion contraseña: " +  confirm)

    fetch('/change_password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            console.log(data.message);
            toast_message.textContent = "Cambio de contraseña exitoso."; // Mensaje de éxito
            toast.style.backgroundColor = 'green'; // Cambiar a color verde
            toast.style.display = 'block'; // Mostrar el toast
            setTimeout(function() {
                toast.style.display = 'none';
            }, 3000);

            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
            document.getElementById('passwordLength').textContent = 'Caracteres restantes: 8'; // Reiniciar contador
            document.getElementById('confirmMessage').textContent = ''; // Reiniciar mensaje de confirmación
            passwordLengthText.style.color = 'red'; //Cambiar el color del contador de caracteres
            
        } else {
            console.error("Error: " + data.message);
            // Aquí podrías mostrar un mensaje de error al usuario
        }
    })
    .catch(error => {
        console.error("Error al realizar la solicitud: ", error);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Inicializa los tooltips de Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    const passwordInput = document.getElementById('newPassword');
    const passwordLengthText = document.getElementById('passwordLength');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const confirmMessage = document.getElementById('confirmMessage');

    passwordInput.addEventListener('input', function () {
        const passwordLength = passwordInput.value.length;
        const remainingCharacters = 8 - passwordLength;

        // Actualiza el texto de longitud
        passwordLengthText.textContent = `Caracteres restantes: ${Math.max(0, remainingCharacters)}`;

        // Cambia el color del texto según la longitud
        if (passwordLength >= 8) {
            passwordLengthText.style.color = 'green';
        } else {
            passwordLengthText.style.color = 'red';
        }

        // Muestra el tooltip si la longitud es menor a 8
        if (passwordLength < 8) {
            tooltipList[0].setContent({ '.tooltip-inner': `La contraseña debe tener al menos 8 caracteres. Te faltan ${Math.abs(remainingCharacters)} caracteres.` });
        } else {
            tooltipList[0].setContent({ '.tooltip-inner': `Contraseña válida.` });
        }
    });

    confirmPasswordInput.addEventListener('input', function () {
        if (passwordInput.value === confirmPasswordInput.value && confirmPasswordInput.value.length >= 8) {
            confirmMessage.textContent = "Las contraseñas coinciden.";
            confirmMessage.style.color = 'green';
        } else {
            confirmMessage.textContent = "Las contraseñas no coinciden.";
            confirmMessage.style.color = 'red';
        }
    });
});*/