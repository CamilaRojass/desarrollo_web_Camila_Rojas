// Validación de fotos
function validatePhotos(input) {
    const files = input.files;
    const maxSize = 5 * 1024 * 1024; //5MB
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf'];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name.toLowerCase();
        const fileExtension = fileName.substring(fileName.lastIndexOf('.'));

        //Validar extensión
        if (!allowedExtensions.includes(fileExtension)) {
            errors.push(`${file.name}: Formato no permitido. Use: JPG, PNG, GIF o PDF`);
        }

        //Validar tamaño
        if (file.size > maxSize) {
            errors.push(`${file.name}: Tamaño excede 5MB (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
        }
    }

    if (errors.length > 0) {
        Swal.fire({
            icon: 'error',
            title: 'Archivos no válidos',
            html: errors.join('<br>'),
            confirmButtonText: 'Entendido'
        });
        input.value = ''; 
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    const fotoInput = document.getElementById('foto-input');

    if (fotoInput) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        const fileInputs = node.querySelectorAll('input[type="file"]');
                        fileInputs.forEach(function(input) {
                            input.setAttribute('onchange', 'validatePhotos(this)');
                            input.setAttribute('accept', '.jpg,.jpeg,.png,.gif,.pdf');
                        });
                    }
                });
            });
        });
        observer.observe(fotoInput, { childList: true, subtree: true });
    }
});
