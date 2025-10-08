
const showFieldError = (input, message) => {
  clearFieldError(input);
  
  //Crear y agregar mensaje de error
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  errorDiv.style.color = '#dc3545';
  errorDiv.style.fontSize = '0.875rem';
  errorDiv.style.marginTop = '0.25rem';
  errorDiv.style.fontWeight = '500';
  
  //Agregar borde rojo al input
  input.style.borderColor = '#dc3545';
  input.style.borderWidth = '2px';
  
  //Insertar mensaje después del input
  input.parentElement.appendChild(errorDiv);
};

const clearFieldError = (input) => {
  const errorDiv = input.parentElement.querySelector('.error-message');
  if (errorDiv) {
    errorDiv.remove();
  }
  
  //Restaurar borde 
  input.style.borderColor = '';
  input.style.borderWidth = '';
};

const showNotification = (message, type = 'error') => {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  //Estilo 
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '1rem 1.5rem',
    backgroundColor: type === 'error' ? '#dc3545' : '#28a745',
    color: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    zIndex: '9999',
    fontSize: '0.95rem',
    fontWeight: '500',
    maxWidth: '400px',
    animation: 'slideInRight 0.3s ease-out'
  });
  
  document.body.appendChild(notification);
  
  //Auto-remover después de 4 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
};

// Agregar estilos de animación
const addAnimationStyles = () => {
  if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

// Ejecutar al cargar
addAnimationStyles();

// ============================================
// VALIDACIONES - ¿Dónde está la mascota?
// ============================================

const validateSelect = (select) => {
  if(!select) return false;
  return true;
};

const validateSector = (sector) => {
  let lengthValid = sector.trim().length <= 100;
  return lengthValid;
};

// VALIDACIONES - Contacto

const validateNombre = (nombre) => {
  if (!nombre) return false;
  let lenghtValid = nombre.trim().length >= 3 && nombre.trim().length <= 200;
  return lenghtValid;
};

const validateEmail = (email) => {
  if (!email) return false;
  let lengthValid = email.trim().length < 100;

  // validamos el formato
  let re = /^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  let formatValid = re.test(email);

  return lengthValid && formatValid;
};

const validatePhoneNumber = (phoneNumber) => {
  //Si está vacío, es válido (opcional)
  if (!phoneNumber || phoneNumber.trim() === '') {
    return true;
  }
  
  //Si tiene contenido, validar formato: +XXX.XXXXXXXX
  const re = /^\+[0-9]{3}\.[0-9]{8}$/;
  return re.test(phoneNumber);
};

const validateContactPlatforms = () => {
  const platformNames = {
    'tiktok': 'TikTok',
    'instagram': 'Instagram',
    'whatsapp': 'WhatsApp',
    'x': 'X',
    'telegram': 'Telegram',
    'linkedin': 'LinkedIn'
  };
  
  const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
  
  for (let checkbox of checkedBoxes) {
    const textarea = document.querySelector(`#${checkbox.id}-box textarea`);
    const value = textarea.value.trim();
    
    if (!value || value.length < 3) {
      const platformName = platformNames[checkbox.id] || checkbox.id;
      showFieldError(textarea, `Complete el campo de ${platformName} (mínimo 3 caracteres)`);
      showNotification(`Por favor complete el campo de ${platformName}`, 'error');
      textarea.focus();
      return false;
    }
  }
  
  return true;
};

// VALIDACIONES - Mascota

const validateMascota = () => {
  const radioButtons = document.querySelectorAll('input[name="tipo"]');
  const isSelected = Array.from(radioButtons).some(radio => radio.checked);
  
  if (!isSelected) {
    showNotification('Debe seleccionar el tipo de mascota', 'error');
    return false;
  }
  
  return true;
};

const validateQuantity = (quantity) => {
  const qty = Number(quantity);
  return Number.isInteger(qty) && qty > 0;
};

const validateAge = (age) => {
  const ageNum = Number(age);
  return Number.isInteger(ageNum) && ageNum >= 0;
};

const validateAgeUnit = () => {
  const radioButtons = document.querySelectorAll('input[name="unidad-edad"]');
  const isSelected = Array.from(radioButtons).some(radio => radio.checked);
  
  if (!isSelected) {
    showNotification('Debe seleccionar la unidad de edad', 'error');
    return false;
  }
  
  return true;
};

const validateDate = (date) => {
  if (!date) return false;
  const selectedDate = new Date(date);
  const today = new Date();
  return selectedDate >= today;
};

const validateDescription = (description) => {
  if (!description || description.trim() === '') {
    return true;
  }

  return description.trim().length <= 500;
};

const validateFiles = (files) => {
  if (!files) return false;
  
  let lengthValid = 1 <= files.length && files.length <= 5;

  let typeValid = true;

  for (const file of files) {
    //el tipo de archivo debe ser "image/<foo>" o "application/pdf"
    let fileFamily = file.type.split("/")[0];
    typeValid &&= fileFamily == "image" || file.type == "application/pdf";
  }

  return lengthValid && typeValid;
};

// VALIDADORES GENERALES

const validadorDonde = () => {
  let regionInput = document.getElementById("region");
  let comunaInput = document.getElementById("comuna");
  let sectorInput = document.getElementById("sector");

  // Limpiar errores previos
  clearFieldError(regionInput);
  clearFieldError(comunaInput);
  clearFieldError(sectorInput);

  if (!validateSelect(regionInput.value)) {
    showFieldError(regionInput, "Seleccione una región válida");
    showNotification("Por favor seleccione una región", 'error');
    regionInput.focus();
    return false;
  }

  if (!validateSelect(comunaInput.value)) {
    showFieldError(comunaInput, "Seleccione una comuna válida");
    showNotification("Por favor seleccione una comuna", 'error');
    comunaInput.focus();
    return false;
  }

  if (!validateSector(sectorInput.value)) {
    showFieldError(sectorInput, "Máximo 100 caracteres");
    showNotification("El sector no puede exceder 100 caracteres", 'error');
    sectorInput.focus();
    return false;
  }

  return true;
};

const validadorContacto = () => {
  let nombreInput = document.getElementById("nombre");
  let emailInput = document.getElementById("email");
  let numeroInput = document.getElementById("numero");

  // Limpiar errores previos
  clearFieldError(nombreInput);
  clearFieldError(emailInput);
  clearFieldError(numeroInput);

  if (!validateNombre(nombreInput.value)) {
    showFieldError(nombreInput, "Entre 3 y 200 caracteres");
    showNotification("Ingrese un nombre válido (entre 3 y 200 caracteres)", 'error');
    nombreInput.focus();
    return false;
  }

  if (!validateEmail(emailInput.value)) {
    showFieldError(emailInput, "Correo inválido (máximo 100 caracteres)");
    showNotification("Ingrese un correo electrónico válido", 'error');
    emailInput.focus();
    return false;
  }

  if (!validatePhoneNumber(numeroInput.value)) {
    showFieldError(numeroInput, "Formato: +XXX.XXXXXXXX");
    showNotification("Formato de teléfono inválido. Use: +XXX.XXXXXXXX", 'error');
    numeroInput.focus();
    return false;
  }

  if (!validateContactPlatforms()) {
    return false; 
  }

  return true;
};

const validadorMascota = () => {
  let cantidadInput = document.getElementById("cantidad");
  let edadInput = document.getElementById("edad");
  let fechaInput = document.getElementById("fecha");
  let descripcionInput = document.getElementById("descripcion");
  let fotoInput = document.getElementById("foto");

  // Limpiar errores previos
  clearFieldError(cantidadInput);
  clearFieldError(edadInput);
  clearFieldError(fechaInput);
  clearFieldError(descripcionInput);
  clearFieldError(fotoInput);

  if (!validateMascota()) {
    return false;
  }

  if (!validateQuantity(cantidadInput.value)) {
    showFieldError(cantidadInput, "Debe ser un número entero positivo");
    showNotification("Ingrese una cantidad válida (número entero positivo)", 'error');
    cantidadInput.focus();
    return false;
  }

  if (!validateAge(edadInput.value)) {
    showFieldError(edadInput, "Debe ser un número entero no negativo");
    showNotification("Ingrese una edad válida (número entero no negativo)", 'error');
    edadInput.focus();
    return false;
  }

  if (!validateAgeUnit()) {
    return false;
  }

  if (!validateDate(fechaInput.value)) {
    showFieldError(fechaInput, "La fecha no puede ser pasada");
    showNotification("Ingrese una fecha válida (no puede ser pasada)", 'error');
    fechaInput.focus();
    return false;
  }

  if (!validateDescription(descripcionInput.value)) {
    showFieldError(descripcionInput, "Máximo 500 caracteres");
    showNotification("La descripción no puede exceder 500 caracteres", 'error');
    descripcionInput.focus();
    return false;
  }

  if (!validateFiles(fotoInput.files)) {
    showFieldError(fotoInput, "Entre 1 y 5 archivos (imágenes o PDF)");
    showNotification("Debe subir entre 1 y 5 archivos válidos (imágenes o PDF)", 'error');
    fotoInput.focus();
    return false;
  }

  return true;
};


// AGREGAR CAMPOS DE CONTACTO AL FORM

const agregarCamposContacto = (form) => {
  const platformIds = ['tiktok', 'instagram', 'whatsapp', 'x', 'telegram', 'linkedin'];
  
  platformIds.forEach(platformId => {
    const checkbox = document.getElementById(platformId);
    if (checkbox && checkbox.checked) {
      const textarea = document.querySelector(`#${platformId}-box textarea`);
      if (textarea && textarea.value.trim()) {
        //Crear input hidden para el checkbox
        const hiddenCheckbox = document.createElement('input');
        hiddenCheckbox.type = 'hidden';
        hiddenCheckbox.name = platformId;
        hiddenCheckbox.value = 'on';
        form.appendChild(hiddenCheckbox);
        
        //Crear input hidden para el valor del textarea
        const hiddenTextarea = document.createElement('input');
        hiddenTextarea.type = 'hidden';
        hiddenTextarea.name = `${platformId}_url`;
        hiddenTextarea.value = textarea.value.trim();
        form.appendChild(hiddenTextarea);
      }
    }
  });
};


// VALIDACIÓN Y ENVÍO DEL FORMULARIO

const validarForm = async () => {
  if (!validadorDonde()) return false;
  if (!validadorContacto()) return false;
  if (!validadorMascota()) return false;

  // Confirmación con SweetAlert2
  const result = await Swal.fire({
    title: '¿Confirmar adopción?',
    text: '¿Está seguro de que desea agregar este aviso de adopción?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, estoy seguro',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#dc3545',
  });
  
  if (result.isConfirmed) {
    // Mensaje de procesamiento
    await Swal.fire({
      title: '¡Enviando!',
      text: 'Procesando su aviso de adopción...',
      icon: 'info',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true
    });
    
    // Agregar campos de contacto y enviar formulario
    const form = document.getElementById('add-adoption-form');
    agregarCamposContacto(form);
    form.submit();
    
    return true;
  } else {
    showNotification('Envío cancelado', 'error');
    return false;
  }
};


// EVENT LISTENERS

// Limpiar errores al escribir en los campos
const setupRealTimeValidation = () => {
  const inputs = [
    'region', 'comuna', 'sector', 'nombre', 'email', 'numero',
    'cantidad', 'edad', 'fecha', 'descripcion', 'foto'
  ];
  
  inputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => clearFieldError(input));
      input.addEventListener('change', () => clearFieldError(input));
    }
  });
};

//Inicializar
document.addEventListener('DOMContentLoaded', () => {
  setupRealTimeValidation();
  
  let submitBtn = document.getElementById("envio");
  if (submitBtn) {
    submitBtn.addEventListener("click", validarForm);
  }
});

//Si el DOM ya está cargado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupRealTimeValidation);
} else {
  setupRealTimeValidation();
}

let submitBtn = document.getElementById("envio");
if (submitBtn) {
  submitBtn.addEventListener("click", validarForm);
}