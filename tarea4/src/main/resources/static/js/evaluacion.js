function evaluar(element) {
    var avisoId = element.getAttribute('data-id');

    //Solicitar nota al usuario
    var notaStr = prompt('Seleccione una nota entre 1 y 7 para el aviso #' + avisoId + ':');

    if (notaStr === null) {
        return;
    }

    //Validar que sea un número entero
    var nota = parseInt(notaStr, 10);

    if (isNaN(nota)) {
        alert('Error: La nota debe ser un numero entero');
        return;
    }

    //Validar rango
    if (nota < 1 || nota > 7) {
        alert('Error: La nota debe estar entre 1 y 7');
        return;
    }

    //Enviar nota al servidor
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/notas/' + avisoId, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            var response;
            try {
                response = JSON.parse(xhr.responseText);
            } catch (e) {
                alert('Error al procesar la respuesta del servidor');
                return;
            }

            if (xhr.status === 201) {
                //Actualizar la nota en la interfaz
                var notaCell = document.getElementById('nota-' + avisoId);
                if (notaCell) {
                    if (response.promedio !== null) {
                        notaCell.textContent = response.promedio;
                    } else {
                        notaCell.textContent = '-';
                    }
                }
                alert('Nota agregada exitosamente');
            } else {
                alert('Error: ' + (response.error || 'Error desconocido'));
            }
        }
    };

    xhr.onerror = function() {
        alert('Error de conexion con el servidor');
    };

    var data = JSON.stringify({ nota: nota });
    xhr.send(data);
}
