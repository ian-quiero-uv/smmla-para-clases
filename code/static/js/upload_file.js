let dropArea = document.getElementById("drop-area");
let thumbnailImage = document.getElementById("thumbnail");
let fileNameElement = document.getElementById("file-name");
let thumbnailIcon = document.getElementById("thumbnail-icon");

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

["dragenter", "dragover"].forEach((eventName) => {
    dropArea.addEventListener(eventName, highlight, false);
});

["dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

dropArea.addEventListener("drop", handleDrop, false);

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    dropArea.classList.add("highlight");
}

function unhighlight(e) {
    dropArea.classList.remove("highlight");
}

dropArea.addEventListener("drop", handleDrop, false);

function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;
    handleFiles(files);

    fileElem.files = files;
}

function handleFiles(files) { // <--- Probar y arreglar esto.
    [...files].forEach(uploadFile);
}

function uploadFile(file) {
    if (file.type === 'video/mp4') {
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.currentTime = 1; // Capturamos el thumbnail en el segundo 1

        video.addEventListener("loadeddata", function() {
            const canvas = document.createElement("canvas");
            canvas.width = 160; // Ajusta el tamaño según sea necesario
            canvas.height = 90; // Ajusta el tamaño según sea necesario
            const context = canvas.getContext("2d");

            // Dibujamos el frame en el canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Creamos la imagen del thumbnail
            thumbnailImage.src = canvas.toDataURL(); // Convertimos el canvas a una URL de datos
            thumbnailImage.classList.remove("d-none"); // Mostramos el thumbnail

            // Ocultamos el ícono
            thumbnailIcon.classList.add("d-none"); // Ocultamos el ícono

            // Actualizamos el nombre del archivo
            fileNameElement.textContent = file.name; // Mostramos el nombre del archivo

            //fileElem.setCustomValidity('');
            //fileElem.classList.remove('is-invalid');
            // Liberamos el objeto URL URL.revokeObjectURL(video.src);
        URL.revokeObjectURL(video.src);
        });

        video.load(); // Cargamos el video
    } else {
        alert("Por favor, sube un archivo de video en formato MP4."); // Mensaje si no es un video MP4
        fileElem.setCustomValidity(''); // Resetea el mensaje de error
        fileElem.classList.add('is-invalid'); // Añade la clase de error
    }
}

dropArea.addEventListener("click", () => {
    fileElem.click();
});

let fileElem = document.getElementById("fileElem");
fileElem.addEventListener("change", function (e) {
    handleFiles(this.files);
});

(function () {
    'use strict'
    const forms = document.querySelectorAll('.requires-validation')
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()