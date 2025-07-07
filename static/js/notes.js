var url = window.location.href;
var path = url.split("/")
var video_id = path[path.length-1]
var profileUserPhoto
var profileName
var timeTag
var newComment
var data = []
var element = {}
var video = document.getElementById("myvideo");

function guardarTiempo(){
    timeTag = document.getElementById("timeTag");
    let minutes = Math.floor(video.currentTime /60);
    let seconds = Math.floor(video.currentTime - minutes *60);
    let timeString = `${minutes}:${seconds}`
    timeTag.innerText = timeString;

    // Mostrar el toast
    var toast = document.getElementById('toast');
    toast.querySelector('.toast-body').innerText = `Tiempo guardado: ${timeString}`; // Actualiza el contenido del toast
    toast.style.display = 'block'; // Muestra el toast
    toast.style.opacity = 1; // Asegúrate de que sea visible

    // Ocultar el toast después de 3 segundos
    setTimeout(function() {
        toast.style.opacity = 0; // Desvanece el toast
        setTimeout(function() {
            toast.style.display = 'none'; // Oculta el toast
        }, 500); // Tiempo para que se desvanezca
    }, 3000); // Tiempo que el toast estará visible
}

document.getElementById("btn-post").addEventListener("click", function () {
    //Cambiar para fijar al usuario que esta colocando la info
    profileUserPhoto = document.getElementById("profilePhoto").cloneNode(true);
    profileName = document.createElement("h4");
    profileName.setAttribute("class", "text-primary mb-1");
    profileName.innerText = document.getElementById("profileName").innerText;
    if (document.getElementById("timeTag").innerText != "-") {
        timeTag = document.createElement("p");
        timeTag.setAttribute("class", "lead");
        timeTag.innerText = document.getElementById("timeTag").innerText;
    }
    newComment = document.getElementById("new-comment").value;
    
    //console.log(profileName.innerText) --> Info del perfil
    element.name = profileName.innerText;
    element.timeTag = timeTag.innerText;
    element.comment = newComment;
    //console.log(element)
    data.push(element)
    element = {}
    //console.log(data)

    
    fetch(`/jsonupload/${video_id}`, {
        headers : {
            'Content-Type' : 'application/json'
        },
        method : 'POST',
        body : JSON.stringify(data)
    })
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
    
    profileUserPhoto.setAttribute("width", "50");
    profileUserPhoto.setAttribute("height", "50");

    //const profileContainer = document.getElementById("profileInfo");

    const newCommentBox = document.getElementById("comments");
    const saveCommentBox = document.createDocumentFragment();
    //newCommentBox.appendChild(profileContainer)

    //Creacion del div con los datos del usuario
    const createCommentProfile = document.createElement("div")
    createCommentProfile.setAttribute("class", "mb-2 border-black border-3 border-bottom")
    const profileRow = document.createElement('div')
    profileRow.setAttribute("class", "row border-bottom border-1");
    //Foto de perfil
    const profilePhotoCol = document.createElement("div")
    profilePhotoCol.setAttribute("class", "col-2 mb-3 border-end");
    profilePhotoCol.append(profileUserPhoto);
    profileRow.append(profilePhotoCol);
    //Nombre y tag de tiempo si hay
    const profileElement = document.createElement("div");
    profileElement.setAttribute("class", "col-10");
    profileElement.append(profileName);
    if (document.getElementById("timeTag").innerText != "-"){
        profileElement.append(timeTag);
        document.getElementById("timeTag").innerText = "-"
    }
    profileRow.append(profileElement);
    //Añadimos los datos al contenedor de comentarios
    createCommentProfile.append(profileRow);

    //Creamos el div de los comentarios
    const createCommentElement = document.createElement("div");
    createCommentElement.setAttribute("class", "mt-1")
    const commentElement = document.createElement("p");
    commentElement.setAttribute("class", "ml-1");
    commentElement.innerText = newComment;
    createCommentElement.append(commentElement);


    //Se agrega el comentario a la card body
    saveCommentBox.appendChild(createCommentProfile)
    saveCommentBox.appendChild(createCommentElement)

    newCommentBox.appendChild(saveCommentBox)

    document.getElementById("new-comment").value = "";

});
//Lector de Json
function jsonScanner(alias){
    data = JSON.parse(alias)
    //console.log(data)

    for (let i=0; i<data.length; i++){
        //Creamos los tag HTML y con su formato para el usuario y el tag temporal
        profileName = document.createElement("h4");
        profileName.setAttribute("class", "text-primary mb-1");
        profileName.innerText = data[i].name;
        if (data[i].timeTag != "-"){
            timeTag = document.createElement("p")
            timeTag.setAttribute("class", "lead");
            timeTag.innerText = data[i].timeTag;
        }
        newComment = data[i].comment;

        //Aqui se registran los datos en la card
        const newCommentBox = document.getElementById("comments");
        const saveCommentBox = document.createDocumentFragment();

        const createCommentProfile = document.createElement("div")
        createCommentProfile.setAttribute("class", "mb-2 border-black border-3 border-bottom")
        const profileRow = document.createElement('div')
        profileRow.setAttribute("class", "row border-bottom border-1");
        //
        const profileElement = document.createElement("div");
        profileElement.setAttribute("class", "col-10");
        profileElement.append(profileName);
        if (data[i].timeTag != "-"){
            profileElement.append(timeTag);
        }
        profileRow.append(profileElement);
        createCommentProfile.append(profileRow);

        const createCommentElement = document.createElement("div");
        createCommentElement.setAttribute("class", "mt-1")
        const commentElement = document.createElement("p");
        commentElement.setAttribute("class", "ml-1");
        commentElement.innerText = newComment;
        createCommentElement.append(commentElement);

        saveCommentBox.appendChild(createCommentProfile)
        saveCommentBox.appendChild(createCommentElement)

        newCommentBox.appendChild(saveCommentBox)
    }
}
