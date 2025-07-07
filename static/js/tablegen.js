let currentPage = 1;
let itemsPerPage = 10; // Cambia esto según cuántos elementos quieras por página
let totalItems = 0;
let totalPages = 0;
let grabaciones = [];

let sortOrder = 'asc';
let nombreColumna = '';

function tableGen(data) {
    grabaciones = JSON.parse(data);
    totalItems = grabaciones.length;
    totalPages = Math.ceil(totalItems / itemsPerPage);
    renderTable();
    renderPagination();

    document.getElementById('search').addEventListener('input', filterTable);
}

function renderTable() {
    const tablebody = document.getElementById('tabla-grabaciones-body');
    tablebody.innerHTML = ''; // Limpiar la tabla

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = grabaciones.slice(start, end);

    paginatedItems.forEach(grabacion => {
        const fila = document.createElement('tr');
        fila.setAttribute('onclick', `validateUse('${grabacion.id}')`);
        //console.log(grabacion.id)
        fila.innerHTML = `
            <td id="id" style="display:none;">${grabacion.id}</td>
            <td>${grabacion.nombre_vid}</td>
            <td>${grabacion.fecha}</td>
            <td>${grabacion.practicante}</td>
            <td>${grabacion.establecimiento}</td>
            <td>${grabacion.contenido}</td>
            <td style="display:none;">${grabacion.thumbnail}</td>
        `;
        tablebody.appendChild(fila);
    });
}

function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Limpiar la paginación

    const prevButton = document.createElement('li');
    prevButton.className = 'page-item' + (currentPage === 1 ? ' disabled' : '');
    prevButton.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage - 1})">&lt;</a>`;
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('li');
        pageButton.className = 'page-item' + (i === currentPage ? ' active' : '');
        pageButton.style = 'background-color: #06717E;';
        pageButton.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})" style='color: #FFFFFF'>${i}</a>`;
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement('li');
    nextButton.className = 'page-item' + (currentPage === totalPages ? ' disabled' : '');
    nextButton.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage + 1})">&gt;</a>`;
    paginationContainer.appendChild(nextButton);
}

function changePage(page) {
    if (page < 1 || page > totalPages) return; // Evitar páginas fuera de rango
    currentPage = page;

    const searchInput = document.getElementById('search').value.toLowerCase();
    let filteredData;

    if (searchInput) {
        // Filtrar datos si hay entrada en la búsqueda
        filteredData = grabaciones.filter(grabacion => {
            return (
                grabacion.nombre_vid.toLowerCase().includes(searchInput) ||
                grabacion.fecha.toLowerCase().includes(searchInput) ||
                grabacion.practicante.toLowerCase().includes(searchInput) ||
                grabacion.establecimiento.toLowerCase().includes(searchInput) ||
                grabacion.contenido.toLowerCase().includes(searchInput)
            );
        });
    } 
    else {
        // Si no hay entrada, usar todos los datos
        filteredData = grabaciones;
    }

    // Renderizar la tabla con los datos filtrados o todos
    renderFilteredTable(filteredData);

    // Renderizar la paginación después de cambiar de página
    renderPagination();
}

function filterTable() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    let filteredData;

    if (searchInput) {
        // Filtrar datos si hay entrada en la búsqueda
        filteredData = grabaciones.filter(grabacion => {
            return (
                grabacion.nombre_vid.toLowerCase().includes(searchInput) ||
                grabacion.fecha.toLowerCase().includes(searchInput) ||
                grabacion.practicante.toLowerCase().includes(searchInput) ||
                grabacion.establecimiento.toLowerCase().includes(searchInput) ||
                grabacion.contenido.toLowerCase().includes(searchInput)
            );
        });
    } else {
        // Si no hay entrada, usar todos los datos
        filteredData = grabaciones;
    }

    // Actualizar totalItems y totalPages
    totalItems = filteredData.length;
    totalPages = Math.ceil(totalItems / itemsPerPage);
    currentPage = 1; // Reiniciar a la primera página

    // Ordenar los datos filtrados
    filteredData.sort((a, b) => {
        if (a[nombreColumna] < b[nombreColumna]) {
            return sortOrder === 'asc' ? -1 : 1;
        }
        if (a[nombreColumna] > b[nombreColumna]) {
            return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // Renderizar la tabla y la paginación con los datos filtrados o todos
    renderFilteredTable(filteredData);
    renderPagination();
}

function renderFilteredTable(data) {
    const tablebody = document.getElementById('tabla-grabaciones-body');
    tablebody.innerHTML = ''; // Limpiar la tabla

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = data.slice(start, end);

    paginatedItems.forEach(grabacion => {
        const fila = document.createElement('tr');
        fila.setAttribute('onclick', `validateUse('${grabacion.id}')`);
        fila.innerHTML = `
            <td id="id" style="display:none;">${grabacion.id}</td>
            <td>${grabacion.nombre_vid}</td>
            <td>${grabacion.fecha}</td>
            <td>${grabacion.practicante}</td>
            <td>${grabacion.establecimiento}</td>
            <td>${grabacion.contenido}</td>
            <td style="display:none;">${grabacion.thumbnail}</td>
        `;
        tablebody.appendChild(fila);
    });
}

function sortTable(column) {
    nombreColumna = column //Guardar la columna actual
    // Cambiar el orden
    sortOrder = (sortOrder === 'asc') ? 'desc' : 'asc';

    // Ordenar los grabaciones según la columna seleccionada
    grabaciones.sort((a, b) => {
        //const aValue = a[column].toString().toLowerCase(); // Convertir a minúsculas
        //const bValue = b[column].toString().toLowerCase(); // Convertir a minúsculas

        if (a[column] < b[column]) { // aValue < bValue para no considerar mayusculas 
            return sortOrder === 'asc' ? -1 : 1;
        }
        if (a[column] > b[column]) { // aValue > bValue para no considerar mayusculas
            return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // Renderizar la tabla después de ordenar
    renderTable();
    renderPagination();
}

document.getElementById('items-per-page').addEventListener('change', function() {
    itemsPerPage = parseInt(this.value); // Actualizar el número de filas por página
    currentPage = 1; // Reiniciar a la primera página
    totalPages = Math.ceil(totalItems / itemsPerPage);
    renderTable(); // Renderizar la tabla con los nuevos ajustes
    renderPagination(); // Renderizar la paginación
});