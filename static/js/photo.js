let n = 0;

function addPhoto(button) {
    //Máximo 4 fotos adicionales (5 en total con la primera)
    if (n >= 4) {
        alert('Máximo 5 fotos permitidas');
        return;
    }
    
    //Insertar el nuevo input ANTES del contenedor del botón
    const container = button.parentElement;
    const newPhotoDiv = document.createElement('div');
    newPhotoDiv.className = 'foto-input grupo-input';
    newPhotoDiv.style.marginBottom = '15px';
    newPhotoDiv.innerHTML = `
        <label style="font-weight: bold;">Foto adicional ${n + 2}</label>
        <input type="file" name="foto" accept="image/*,.pdf">
    `;
    
    //Insertar antes del botón
    container.parentElement.insertBefore(newPhotoDiv, container);
    
    n++;
}