/*(function () {
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
})()*/

function validateFileType() {
    const fileInput = document.getElementById('fileElem');
    const fileNameDisplay = document.getElementById('file-name');
    const thumbnailIcon = document.getElementById('thumbnail-icon');
    const thumbnail = document.getElementById('thumbnail');

    const file = fileInput.files[0];

    const fileMessage = document.getElementById('file-name');

    if (file) {
        fileMessage.textContent = fileNameDisplay; // Cambia el texto al nombre del archivo
    }
    else {
        fileMessage.textContent = 'Drag and drop your image here or click to select a file.'; // Mensaje inicial
    }

    const validFileTypes = ['video/mp4'];
    if (!validFileTypes.includes(file.type)) {
        alert('Por favor, selecciona un archivo en formato MP4.');
        fileInput.value = '';
        fileNameDisplay.textContent = '';
        thumbnailIcon.classList.remove('d-none');
        thumbnail.classList.add('d-none');
        return;
    }

    fileNameDisplay.textContent = file.name;
    const videoURL = URL.createObjectURL(file);
    const videoElement = document.createElement('video');
    videoElement.src = videoURL;
    videoElement.preload = 'metadata';

    videoElement.onloadedmetadata = function() {
        console.log('Video metadata loaded:', videoElement);
        videoElement.currentTime = 1; // Cambia al primer segundo
    };

    videoElement.onseeked = function() {
        requestAnimationFrame(() => {
            thumbnail.src = videoElement.currentSrc; // Establece el thumbnail
            thumbnail.classList.remove('d-none');
            thumbnailIcon.classList.add('d-none');
        });
        //URL.revokeObjectURL(videoURL); // Libera el objeto URL
    };

    videoElement.onerror = function() {
        console.error('Error al cargar el video:', videoElement.error);
        alert('Error al cargar el video. Por favor, selecciona un archivo válido.');
    };

    // Inicia la carga del video
    videoElement.load();

    console.log('Archivo seleccionado:', file);
    console.log('Blob URL creado:', videoURL);
}