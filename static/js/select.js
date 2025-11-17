
document.addEventListener('DOMContentLoaded', function() {
    cargarRegiones();
    
    //Agregar event listener para cuando cambie la región
    const selectRegion = document.getElementById('region');
    if (selectRegion) {
        selectRegion.addEventListener('change', function() {
            const regionId = this.value;
            if (regionId) {
                cargarComunas(regionId);
            } else {
                //Si no hay región seleccionada, limpiar comunas
                const selectComuna = document.getElementById('comuna');
                selectComuna.innerHTML = '<option value="">Seleccione una comuna</option>';
            }
        });
    }
});

/**
 * Carga todas las regiones desde el servidor
 */
function cargarRegiones() {
    fetch('/api/regiones')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar regiones');
            }
            return response.json();
        })
        .then(data => {
            const selectRegion = document.getElementById('region');
            
            //Limpiar opciones existentes (excepto la primera)
            selectRegion.innerHTML = '<option value="">Seleccione una región</option>';
            
            //Agregar cada región como opción
            data.forEach(region => {
                const option = document.createElement('option');
                option.value = region.id;
                option.textContent = region.nombre;
                selectRegion.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al cargar regiones:', error);
            alert('Error al cargar las regiones. Por favor recargue la página.');
        });
}

/**
 * Carga las comunas de una región específica
 */
function cargarComunas(regionId) {
    fetch(`/api/comunas/${regionId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar comunas');
            }
            return response.json();
        })
        .then(data => {
            const selectComuna = document.getElementById('comuna');
            
            //Limpiar opciones existentes
            selectComuna.innerHTML = '<option value="">Seleccione una comuna</option>';
            
            //Agregar cada comuna como opción
            data.forEach(comuna => {
                const option = document.createElement('option');
                option.value = comuna.id;
                option.textContent = comuna.nombre;
                selectComuna.appendChild(option);
            });
            
            //Habilitar el select de comunas
            selectComuna.disabled = false;
        })
        .catch(error => {
            console.error('Error al cargar comunas:', error);
            alert('Error al cargar las comunas. Por favor intente nuevamente.');
        });
}