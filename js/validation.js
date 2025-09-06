//Validaciones ¿Donde está la mascota?

const validateSelect = (select) => {
  if(!select) return false;
  return true
}

const validateSector = (sector) => {
  let lengthValid = sector.trim().length <= 100;
  return lengthValid
};

//Validaciones Contacto

const validateNombre = (nombre) => {
  if (!nombre) return false;
  let lenghtValid = nombre.trim().length >= 3 && nombre.trim().length <= 200;
  return lenghtValid
};

const validateEmail = (email) => {
  if (!email) return false;
  let lengthValid = email.trim().length < 100;

  // validamos el formato
  let re = /^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  let formatValid = re.test(email);

  // devolvemos la lógica AND de las validaciones.
  return lengthValid && formatValid;
};

const validatePhoneNumber = (phoneNumber) => {
  // Si está vacío, es válido (opcional)
  if (!phoneNumber || phoneNumber.trim() === '') {
    return true;
  }
  
  // Si tiene contenido, validar formato: +XXX.XXXXXXXX
  const re = /^\+[0-9]{3}\.[0-9]{8}$/;
  return re.test(phoneNumber);
};


const validateContactPlatforms = () => {
  // Ya no validamos si conteo === 0 (ahora es opcional)
  
  // Solo validar contenido si hay plataformas seleccionadas
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
      alert(`Complete el campo de ${platformName}`);
      textarea.focus();
      return false;
    }
  }
  
  return true;
};

//Validaciones Mascota

const validateMascota = () => {
  const radioButtons = document.querySelectorAll('input[name="tipo"]');
  const isSelected = Array.from(radioButtons).some(radio => radio.checked);
  
  if (!isSelected) {
    alert('Debe seleccionar el tipo de mascota');
    return false;
  }
  
  return true;
};

const validateQuantity = (quantity) => {
  const qty= Number(quantity);
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
    alert('Debe seleccionar la unidad de edad');
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
    // el tipo de archivo debe ser "image/<foo>" o "application/pdf"
    let fileFamily = file.type.split("/")[0];
    typeValid &&= fileFamily == "image" || file.type == "application/pdf";
  }

  return lengthValid && typeValid;
};

//Validadores generales

const validadorDonde = () => {
  let regionInput = document.getElementById("region");
  let comunaInput = document.getElementById("comuna");
  let sectorInput = document.getElementById("sector");

  if (!validateSelect(regionInput.value)) {
    alert("Seleccione una región válida.");
    regionInput.focus();
    return false;
  }

  if (!validateSelect(comunaInput.value)) {
    alert("Seleccione una comuna válida.");
    comunaInput.focus();
    return false;
  }

  if (!validateSector(sectorInput.value)) {
    alert("Ingrese un sector válido (máximo 100 caracteres).");
    sectorInput.focus();
    return false;
  }

  return true;
}

const validadorContacto = () => {
  let nombreInput = document.getElementById("nombre");
  let emailInput = document.getElementById("email");
  let numeroInput = document.getElementById("numero");

  if (!validateNombre(nombreInput.value)) {
    alert("Ingrese un nombre válido (entre 3 y 200 caracteres).");
    nombreInput.focus();
    return false;
  }

  if (!validateEmail(emailInput.value)) {
    alert("Ingrese un correo electrónico válido (máximo 100 caracteres).");
    emailInput.focus();
    return false;
  }

  if (!validatePhoneNumber(numeroInput.value)) {
    alert("Ingrese un número de teléfono válido en el formato +XXX.XXXXXXXX.");
    numeroInput.focus();
    return false;
  }

  if (!validateContactPlatforms()) {
    return false; 
  }

  return true;
}

const validadorMascota = () => {
  let cantidadInput = document.getElementById("cantidad");
  let edadInput = document.getElementById("edad");
  let fechaInput = document.getElementById("fecha");
  let descripcionInput = document.getElementById("descripcion");
  let fotoInput = document.getElementById("foto");

  if (!validateMascota()) {
    return false;
  }

  if (!validateQuantity(cantidadInput.value)) {
    alert("Ingrese una cantidad válida (número entero positivo).");
    cantidadInput.focus();
    return false;
  }

  if (!validateAge(edadInput.value)) {
    alert("Ingrese una edad válida (número entero no negativo).");
    edadInput.focus();
    return false;
  }

  if (!validateAgeUnit()) {
    return false;
  }

  if (!validateDate(fechaInput.value)) {
    alert("Ingrese una fecha válida (no pasada).");
    fechaInput.focus();
    return false;
  }

  if (!validateDescription(descripcionInput.value)) {
    alert("Ingrese una descripción válida (máximo 500 caracteres).");
    descripcionInput.focus();
    return false;
  }

  if (!validateFiles(fotoInput.files)) {
    alert("Ingrese entre 1 y 5 archivos válidos (imágenes o PDF).");
    fotoInput.focus();
    return false;
  }

  return true;
}

const validarForm = async () => {
    if (!validadorDonde()) return false;
    if (!validadorContacto()) return false;
    if (!validadorMascota()) return false;

    //Implemntacion de SweetAlert2
    //Primer confirm personalizado
    const result = await Swal.fire({
        title: '¿Confirmar adopción?',
        text: '¿Está seguro de que desea agregar este aviso de adopción?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, estoy seguro.',
        cancelButtonText: 'No, no estoy seguro, quiero volver al formulario.',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#dc3545',
    });
    
    if (result.isConfirmed) {
        //Mostrar mensaje de éxito
        const volverInicio = await Swal.fire({
            title: '¡Éxito!',
            text: 'Hemos recibido la información de adopción, muchas gracias y Suerte!',
            icon: 'success',
            confirmButtonText: 'Volver al inicio',
            confirmButtonColor: '#007bff'
        });
        
        if (volverInicio.isConfirmed) {
            window.location.href = "index.html"; //Redirigir al inicio
        }
        return true;
    } else {
        return false; //Usuario canceló
    }
};

let submitBtn = document.getElementById("envio");
submitBtn.addEventListener("click", validarForm);