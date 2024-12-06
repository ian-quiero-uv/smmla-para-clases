var url = window.location.href;
var path = url.split("/")
var video_id = path[path.length-1]
var profileUserPhoto
var profileName
var timeTag = ""
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
    //console.log(profileUserPhoto.src)
    temp = profileUserPhoto.src.split("/")
    userPhoto=temp[temp.length-1]
    console.log(userPhoto)
    profileName = document.createElement("h6");
    profileName.setAttribute("class", "fw-bold text-primary mb-1");
    profileName.innerText = document.getElementById("profileName").innerText;

    var timeTagValue = document.getElementById("timeTag").innerText;

    element = {};

    if (timeTagValue !== "") {
        const timeTag = document.createElement("p");
        timeTag.setAttribute("class", "text-muted small mb-0");
        timeTag.innerText = timeTagValue;
        element.timeTag = timeTag.innerText; // Asignar solo si no está vacío
    }
    else {
        element.timeTag ="";
    }

    newComment = document.getElementById("new-comment").value;
    
    //console.log(profileName.innerText) --> Info del perfil
    element.name = profileName.innerText;
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

    profileUserPhoto.setAttribute("width", "25");
    profileUserPhoto.setAttribute("height", "25");

    //const profileContainer = document.getElementById("profileInfo");

    const newCommentBox = document.getElementById("comments");
    const saveCommentBox = document.createDocumentFragment();
    //newCommentBox.appendChild(profileContainer)

    //Creacion del div con los datos del usuario
    const createCommentProfile = document.createElement("div")
    createCommentProfile.setAttribute("class", "d-flex flex-start align-items-center border-bottom border-1")
    createCommentProfile.append(profileUserPhoto)
    const profileElement = document.createElement("div");
    profileElement.append(profileName);
    if (timeTagValue != ""){
        profileElement.append(timeTagValue);
        timeTagValue.innerText ="";
    }
    createCommentProfile.append(profileElement);

    const createCommentElement = document.createElement("div");
    createCommentElement.setAttribute("class", "mt-3 mb-4 pb-2 border-bottom border-2 border-black")
    const commentElement = document.createElement("p");
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
        profileName = document.createElement("h6");
        profileName.setAttribute("class", "fw-bold text-primary mb-1");
        profileName.innerText = data[i].name;
        if (data[i].timeTag != ""){
            timeTag = document.createElement("p")
            timeTag.setAttribute("class", "text-muted small mb-0");
            timeTag.innerText = data[i].timeTag;
        }
        newComment = data[i].comment;

        //Aqui se registran los datos en la card
        const newCommentBox = document.getElementById("comments");
        const saveCommentBox = document.createDocumentFragment();

        const createCommentProfile = document.createElement("div")
        createCommentProfile.setAttribute("class", "d-flex flex-start align-items-center border-bottom border-1")
        const profileElement = document.createElement("div");
        profileElement.append(profileName);
        if (data[i].timeTag != ""){
            profileElement.append(timeTag);
        }
        createCommentProfile.append(profileElement);

        const createCommentElement = document.createElement("div");
        createCommentElement.setAttribute("class", "mt-3 mb-4 pb-2 border-bottom border-2 border-black")
        const commentElement = document.createElement("p");
        commentElement.innerText = newComment;
        createCommentElement.append(commentElement);

        saveCommentBox.appendChild(createCommentProfile)
        saveCommentBox.appendChild(createCommentElement)

        newCommentBox.appendChild(saveCommentBox)
    }
}
