const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileElem');
const fileFeedback = document.getElementById('fileFeedback');
//const form = document.querySelector('#form-upload');
//const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));

document.getElementById('fileFeedback').classList.add('d-none');
document.getElementById('fileFeedback').classList.remove('d-none');

/*
// Al intentar enviar el formulario
form.addEventListener('submit', function (e) {
    if (!fileInput.files.length) {
        e.preventDefault();
        fileInput.classList.add('is-invalid');
        fileFeedback.style.display = 'block';
    } 
    else {
        fileInput.classList.remove('is-invalid');
        fileFeedback.style.display = 'none';
    }
});*/

// Al cambiar el archivo, corregimos el error si había uno
fileInput.addEventListener('change', function () {
  if (fileInput.files.length > 0) {
    fileInput.classList.remove('is-invalid');
    fileFeedback.style.display = 'none';
  }
});

dropzone.addEventListener('click', () => fileInput.click());

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    handleFiles(files);
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    const content = document.getElementById('dropzone-content');
    const icon = document.getElementById('dropzone-icon');

    for (const file of files) {
        if (file.type !== 'video/mp4') {
            showTablerAlert('Solo se permiten archivos de video en formato .mp4');
            continue;
        }
        content.innerHTML = ''; // Limpiar contenido previo

        if (icon) icon.remove();

        // Crear contenedor para thumbnail + nombre
        const videoPreview = document.createElement('div');
        videoPreview.classList.add('mb-3');

        generateThumbnail(file, videoPreview); //Thumbnail

        const fileName = document.createElement('div');
        fileName.textContent = `${file.name}`;
        fileName.style.marginBottom = '0.5rem';
        fileName.style.fontWeight = 'bold';
        fileName.style.textAlign = 'center';
        videoPreview.appendChild(fileName); //Filename

        content.appendChild(videoPreview);
    }
}

function generateThumbnail(file, container) {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.src = URL.createObjectURL(file);
    video.crossOrigin = 'anonymous';

    video.addEventListener('loadeddata', () => {
        if (video.duration < 1) {
            captureFrame(video);
        } 
        else {
            video.currentTime = 1;
        }
    });

    video.addEventListener('seeked', () => {
        captureFrame(video);
    });

    function captureFrame(video) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/jpeg');
        img.style.display = 'block';
        img.style.margin = '0 auto 0.5rem auto';
        img.style.maxWidth = '200px';
        img.style.maxHeight = '150px';
        container.insertBefore(img, container.firstChild); // Thumbnail antes del texto
        URL.revokeObjectURL(video.src);
    }
}

function showTablerAlert(message, type = 'danger') {
    const container = document.getElementById('alert-container');
    container.innerHTML = `
        <div class="alert alert-${type} alert-dismissible" role="alert">
            <div class="d-flex">
                <div>
                    <i class="fas fa-exclamation-circle me-2"></i>
                </div>
                <div>
                    ${message}
                </div>
            </div>
            <a class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></a>
        </div>
    `;
}

/*
form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!fileInput.files.length) {
        fileInput.classList.add('is-invalid');
        fileFeedback.style.display = 'block';
        return;
    }

    loadingModal.show();

    const formData = new FormData();
    formData.append('video', fileInput.files[0]);

    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if(!response.ok){
            throw new Error("Error en el servidor: ", response.statusText);
        }
        return response.json();
    })
    .then(data => {
        loadingModal.hide();
        showTablerAlert('Video subido exitosamente', 'success');
        // Aquí podrías limpiar el formulario si deseas
    })
    .catch(error => {
        loadingModal.hide();
        showTablerAlert('Ocurrió un error al procesar el archivo.', 'danger');
        console.error(error);
    });
});
*/