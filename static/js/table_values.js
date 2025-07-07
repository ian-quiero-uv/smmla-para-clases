var id_video

function validateUse(id) {
    let table = document.getElementById('mytable');
    for (let r=1, n=table.rows.length; r<n; r++) {
        if(table.rows[r].cells[0].innerText == id){
            id_video = table.rows[r].cells[0].innerText;

            thumbnail = document.getElementById("thumbnails")
            nombre = table.rows[r].cells[1].innerText;
            thumb_name = table.rows[r].cells[6].innerText;

            img = new Image()
            img.src = "static/uploads/" + id_video + "/" + thumb_name + ".jpeg"

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

async function reAnalize(modelo) {
    let link = '/analizar/' + id_video + '/' + modelo;
    //window.location.href = link;
    swal.fire({
        title: 'Analizando video.',
        text: 'Por favor, espere mientras se completa el analisis...',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick:false
    })
    try {
        const response = await fetch(link, {
            method: 'GET',
        })

        const result = await response.json();
        if(response.ok && result.success) {
            swal.fire({
                title: result.message,
                text: "Redirigiendo al video.",
                icon: "success",
                allowOutsideClick: true,
                showConfirmButton: false,
                timer: 3500
            });
            //console.log(result)
            window.location = result.redirect_url;
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
    } catch (error) {
        console.error(error);
        swal.fire({
            title: "Error en servidor.",
            text: "Hubo un error interno. Intente nuevamente.",
            icon: "error",
            allowOutsideClick: true,
            showConfirmButton: false,
            timer: 3500
        });
    }
}

const reAnalyzeButton = document.getElementById('reAnalyzeButton');

reAnalyzeButton.addEventListener('click', () => {
    let modeloSeleccionado = 'base';
    slider.noUiSlider.on('update', function (values, handle) {
        const index = parseInt(values[handle], 10);
        modeloSeleccionado = modelos[index] || '';
    })

    console.log(modeloSeleccionado);

    reAnalize(modeloSeleccionado);
});

const modelos = ['tiny', 'base', 'small', 'medium', 'large'];

const slider = document.getElementById('slider');

noUiSlider.create(slider, {
    start: 1,
    connect: false,
    step: 1,
    range: {
        min: 0,
        max: modelos.length - 1,
    },
    format: {
        // Convertir dato entre índice y valor:
        to: value => Number(value).toFixed(0),
        from: value => Number(value).toFixed(0)
    },
    tooltips: {
        to: function(value) {
          const index = Math.round(value);
          return modelos[index] || '';
        },
        from: function(value) {
          return modelos.indexOf(value);
        }
    },
    pips: {
        mode: 'positions',
        values: [0, 100],
        density: 100,
        format: {
            to: function(value) {
                if (value === 0) return '(más rápido)';
                if (value === modelos.length - 1) return '(más lento)';
                return '';
            },
        }
    }
});