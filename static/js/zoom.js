function toggleFullscreen(img) { 
    //Crear el overlay de pantalla completa
    const overlay = document.createElement('div');
    overlay.id = 'fullscreen-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        cursor: pointer;
    `;
    
    //Crear contenedor para la imagen y el botón
    const container = document.createElement('div');
    container.style.cssText = `
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
    `;
    
    //Crear la imagen en pantalla completa
    const fullscreenImg = document.createElement('img');
    fullscreenImg.src = img.src;
    fullscreenImg.alt = img.alt;
    fullscreenImg.style.cssText = `
        width: 800px;
        height: 600px;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    `;
    
    //Crear botón de cerrar
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '✕ Cerrar';
    closeButton.style.cssText = `
        margin-top: 15px;
        padding: 10px 20px;
        background-color: #ff4444;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        transition: background-color 0.3s ease;
    `;
    
    // Efecto hover para el botón
    closeButton.onmouseover = function() {
        this.style.backgroundColor = '#cc0000';
    };
    closeButton.onmouseout = function() {
        this.style.backgroundColor = '#ff4444';
    };
    
    //Agregar evento click al botón de cerrar
    closeButton.onclick = function(e) {
        e.stopPropagation();
        exitFullscreen();
    };
    
    container.appendChild(fullscreenImg);
    container.appendChild(closeButton);
    
    overlay.appendChild(container);
    
    document.body.appendChild(overlay);
    
}

function exitFullscreen() {
    const overlay = document.getElementById('fullscreen-overlay');
    if (overlay) {
        overlay.remove();
    }
}

