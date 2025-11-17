//Cargar comentarios cuando se abre el detalle de un aviso
function cargarComentarios(avisoId) {
    const contenedor = document.getElementById(`lista-comentarios-${avisoId}`);

    fetch(`/api/comentarios/${avisoId}`)
        .then(response => response.json())
        .then(comentarios => {
            if (comentarios.length === 0) {
                contenedor.innerHTML = '<p class="no-comments">No hay comentarios aún.</p>';
            } else {
                let html = '';
                comentarios.forEach(comentario => {
                    const fecha = new Date(comentario.fecha);
                    const fechaFormateada = fecha.toLocaleDateString('es-CL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    html += `
                        <div class="comentario-item">
                            <div class="comentario-header">
                                <strong class="comentario-nombre">${escapeHtml(comentario.nombre)}</strong>
                                <span class="comentario-fecha">${fechaFormateada}</span>
                            </div>
                            <p class="comentario-texto">${escapeHtml(comentario.texto)}</p>
                        </div>
                    `;
                });
                contenedor.innerHTML = html;
            }
        })
        .catch(error => {
            console.error('Error al cargar comentarios:', error);
            contenedor.innerHTML = '<p class="error">Error al cargar comentarios</p>';
        });
}

//Agregar un nuevo comentario
function agregarComentario(event, avisoId) {
    event.preventDefault();

    const form = document.getElementById(`form-comentario-${avisoId}`);
    const nombreInput = document.getElementById(`nombre-${avisoId}`);
    const textoInput = document.getElementById(`texto-${avisoId}`);
    const mensajeDiv = document.getElementById(`mensaje-${avisoId}`);

    const nombre = nombreInput.value.trim();
    const texto = textoInput.value.trim();

    //Validación 
    if (nombre.length < 3 || nombre.length > 80) {
        mostrarMensaje(mensajeDiv, 'El nombre debe tener entre 3 y 80 caracteres', 'error');
        return;
    }

    if (texto.length < 5) {
        mostrarMensaje(mensajeDiv, 'El comentario debe tener al menos 5 caracteres', 'error');
        return;
    }

    // Mostrar mensaje de carga
    mostrarMensaje(mensajeDiv, 'Enviando comentario...', 'info');

    // Enviar comentario al servidor
    fetch(`/api/comentarios/${avisoId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: nombre,
            texto: texto
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || 'Error al agregar comentario');
            });
        }
        return response.json();
    })
    .then(data => {
        mostrarMensaje(mensajeDiv, '¡Comentario agregado exitosamente!', 'success');

        //Limpiar formulario
        nombreInput.value = '';
        textoInput.value = '';

        //Recargar lista de comentarios
        cargarComentarios(avisoId);

        //Limpiar mensaje después de 3 segundos
        setTimeout(() => {
            mensajeDiv.innerHTML = '';
        }, 3000);
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje(mensajeDiv, error.message || 'Error al agregar comentario', 'error');
    });
}

// Mostrar mensaje de estado
function mostrarMensaje(elemento, mensaje, tipo) {
    elemento.innerHTML = `<p class="mensaje ${tipo}">${mensaje}</p>`;
}

//Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

//Modificar la función original de adopt.js para cargar comentarios
const originalToggleAdoptionDetail = window.toggleAdoptionDetail;

window.toggleAdoptionDetail = function(detailId) {
    const detail = document.getElementById(detailId);
    const wasHidden = !detail.classList.contains('show');

    if (originalToggleAdoptionDetail) {
        originalToggleAdoptionDetail(detailId);
    } else {
        detail.classList.toggle('show');
    }

    if (wasHidden) {
        const avisoId = detailId.replace('detail-', '');
        cargarComentarios(avisoId);
    }
};
