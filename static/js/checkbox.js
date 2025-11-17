let conteo = 0;

function manejarCheck(checkbox) {
    const caja = document.getElementById(checkbox.id + '-box');
    
    if (checkbox.checked) {
        caja.style.display = 'block';

        conteo++;
    } else {
        caja.style.display = 'none';
        conteo--;
        caja.querySelector('textarea').value = '';
    }
    
    const todosLosChecks = document.querySelectorAll('input[type="checkbox"]');
    
    if (conteo >= 5) {
        todosLosChecks.forEach(check => {
            if (!check.checked) {
                check.disabled = true;
            }
        });
    } else {
        todosLosChecks.forEach(check => {
            check.disabled = false;
        });
    }
}