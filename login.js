const validarForm = () => {
}

const validadorDonde = () => {

}

const validadorContacto = () => {}

const validadorMascota = () => {
  const ahora = new Date();
  const fechaHoraActual = ahora.toISOString().slice(0, 16); 
  document.getElementById("fecha").min = fechaHoraActual;
}

