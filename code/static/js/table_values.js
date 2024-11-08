var id_video

function validateUse(id) {
    let table = document.getElementById('mytable');
    for (let r=1, n=table.rows.length; r<n; r++) {
        if(table.rows[r].cells[0].innerText == id){
            id_video = table.rows[r].cells[0].innerText;

            thumbnail = document.getElementById("thumbnails")
            nombre = table.rows[r].cells[1].innerText;

            img = new Image()
            img.src = "static/img/thumbnails/" + nombre + ".jpeg"

            thumbnail.setAttribute("src", img.src)
            thumbnail.setAttribute("alt", nombre)
            
            document.getElementById("card_nombre").innerText = nombre;
            document.getElementById("card_fecha").innerHTML = table.rows[r].cells[2].innerText;
            document.getElementById("card_practicante").innerHTML = table.rows[r].cells[3].innerText;
            document.getElementById("card_establecimiento").innerHTML = table.rows[r].cells[4].innerText;
            document.getElementById("card_contenido").innerHTML = table.rows[r].cells[5].innerText;
        }
    }
}

function gotoVideo() {
    var anchor = document.getElementById('card_access');
    let link = '/video/' + id_video;
    anchor.setAttribute('href', link);
}

function reAnalize(modelo) {
    let link = '/analizar/' + id_video + '/' + modelo;
    window.location.href = link;
}

const reAnalyzeButton = document.getElementById('reAnalyzeButton');

reAnalyzeButton.addEventListener('click', () => {
    const radios = document.getElementsByName('inlineRadioOptions');
    let selectedValue;
    for (const radio of radios) {
        if (radio.checked) {
            selectedValue = radio.value;
            break;
        }
    }

    reAnalize(selectedValue)
});