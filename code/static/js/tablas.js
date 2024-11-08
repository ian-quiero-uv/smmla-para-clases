
const transcription = null 

function documentGet(trans){
    transcription = JSON.parse(trans)
}

table = document.getElementById("transcript");
//console.log(table)

for (let row of table.rows){
    if(row.cells[2].innerText != "Inicio"){
        init_time = parseInt(row.cells[2].innerText) 
        let minutes = Math.floor(init_time /60);
        let seconds = Math.floor(init_time - minutes *60);
        let timeString = `${minutes}:${seconds}`
        row.cells[2].innerText = timeString
    }
}

for (let row of table.rows){
    if(row.cells[3].innerText != "Cierre"){
        init_time = parseInt(row.cells[3].innerText) 
        let minutes = Math.floor(init_time /60);
        let seconds = Math.floor(init_time - minutes *60);
        let timeString = `${minutes}:${seconds}`
        row.cells[3].innerText = timeString
    }
}

table2 = document.getElementById("objetos");
//console.log(table)

for (let row of table2.rows){
    if(row.cells[1].innerText != "Inicio"){
        init_time = parseInt(row.cells[1].innerText) 
        let minutes = Math.floor(init_time /60);
        let seconds = Math.floor(init_time - minutes *60);
        let timeString = `${minutes}:${seconds}`
        row.cells[1].innerText = timeString
    }
}

for (let row of table2.rows){
    if(row.cells[2].innerText != "Cierre"){
        init_time = parseInt(row.cells[2].innerText) 
        let minutes = Math.floor(init_time /60);
        let seconds = Math.floor(init_time - minutes *60);
        let timeString = `${minutes}:${seconds}`
        row.cells[2].innerText = timeString
    }
}

var id_transcript
//var video_id = url.charAt(url.length-1)

function editarTranscript(id){
    let table = document.getElementById('transcript');
    for (let r=1, n=table.rows.length; r<n; r++) {
        if(table.rows[r].cells[0].innerText == id){
            id_transcript = table.rows[r].cells[0].innerText;
            document.getElementById("message-text").value = table.rows[r].cells[1].innerText;
        }
    }
}

function saveTranscript(){
    var transcript_edit = document.getElementById("message-text").value;

    let video = document.getElementById("myvideo").currentSrc;
    let url = new URL(video);
    let filename = url.pathname.split('/').pop().replace(".mp4", "");

    data = {
        id: id_transcript,
        text: transcript_edit
    }

    fetch(`/jsontranscript/${filename}`, {
        headers : {
            'Content-Type': 'application/json'
        },
        method : 'POST',
        body : JSON.stringify(data)
    })
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

    let table = document.getElementById('transcript');
    for (let r=1, n=table.rows.length; r<n; r++) {
        if(table.rows[r].cells[0].innerText == id_transcript){
            table.rows[r].cells[1].innerText = transcript_edit;
        }
    }
}

function limpiarCaja(){
    document.getElementById("message-text").value="";
}

function downloadText(){
    let video = document.getElementById("myvideo").currentSrc;
    let url = new URL(video);
    let filename = url.pathname.split('/').pop().replace(".mp4", "");
    

    let table = document.getElementById("transcript");
    let csvData = [];
    for (let r=0, n=table.rows.length; r<n; r++){
        let row = []
        row.push(table.rows[r].cells[2].innerText);
        row.push(table.rows[r].cells[3].innerText);
        row.push(table.rows[r].cells[1].innerText);
        csvData.push(row.join(";"))
    }

    var csvString = csvData.join("\n");

    const enlace = document.createElement('a')
    const archivo = new Blob([csvString], { type: 'text/csv' });
    enlace.href = URL.createObjectURL(archivo);
    enlace.download = filename + ".csv";

    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);

}
