const data = {
    "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
    "Tarapacá": ["Iquique", "Alto Hospicio", "Camiña", "Colchane", "Huara", "Pica"],
    "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
    "Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro"],
    "Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paihuano", "Vicuña", "Ovalle", "Río Hurtado", "Punitaqui", "Combarbalá", "Monte Patria", "San Juan de los Morros", "Salamanca", "Los Vilos"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Concón", "Quintero", "Puchuncaví", "Limache", "Olmué", "Villa Alemana", "San Felipe", "Los Andes", "Quillota", "La Calera", "Nogales", "La Ligua", "Petorca", "Cabildo", "Catemu", "San Esteban"],
    "Región Metropolitana": ["Santiago", "Cerro Navia", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Puente Alto", "Quinta Normal", "Recoleta", "Renca", "San Bernardo", "San Joaquín", "San Miguel", "Santiago", "Vitacura"],
    "Libertador General Bernardo O'Higgins": ["Rancagua", "Machalí", "Mostazal", "Graneros", "Chimbarongo", "San Vicente", "Pichidegua", "Peumo", "Coltauco", "Doñihue", "Requínoa", "Coinco", "Las Cabras", "Pichilemu", "La Estrella", "Lolol", "Peralillo", "Placilla", "Nancagua", "Santa Cruz", "Chépica", "Cachapoal", "San Fernando"],
    "Maule": ["Talca", "Constitución", "Curicó", "Linares", "San Javier", "San Clemente", "Colbún", "Maule", "Pelarco", "Pencahue", "Rauco", "Cauquenes", "Retiro", "Villa Alegre", "Longaví", "Colbún", "Parral"],
    "Ñuble": ["Chillán", "Chillán Viejo", "Quirihue", "San Carlos", "San Nicolás", "Yungay", "Pinto", "El Carmen", "Ñiquén", "Pemuco", "Cobquecura", "Coihueco"],
    "Biobío": ["Concepción", "Chiguayante", "Hualpén", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Talcahuano", "Coronel", "Tomé", "Santa Juana", "Florida", "Arauco", "Cabrero", "Mulchén", "Laja", "Nacimiento", "Negrete", "San Rosendo", "Alto Biobío"],
    "La Araucanía": ["Temuco", "Angol", "Cunco", "Curacautín", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Loncoche", "Los Sauces", "Lumaco", "Melipeuco", "Nueva Imperial", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Vilcún", "Villarrica"],
    "Los Ríos": ["Valdivia", "La Unión", "Río Bueno", "Corral", "Futrono", "Lago Ranco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "Lanco"],
    "Los Lagos": ["Osorno", "Puerto Montt", "Castro", "Ancud", "Puerto Varas", "Calbuco", "Frutillar", "Purranque", "San Juan de la Costa", "Puerto Octay", "San Pablo", "Dalcahue", "Curaco de Vélez", "Chonchi", "Quemchi", "Achao", "Cucao", "Maullín", "Hualaihué"],
    "Aysén del General Carlos Ibáñez del Campo": ["Coyhaique", "Aysén", "Cisnes", "Guaitecas", "Lago Verde", "Río Ibáñez", "Chile Chico", "Cochrane", "Ohiggins", "Tortel"],
    "Magallanes y de la Antártica Chilena": ["Punta Arenas", "Puerto Natales", "Porvenir", "Puerto Williams", "Cabo de Hornos", "Laguna Blanca", "Río Verde"]
};

const poblarRegiones = () => {
    let regionSelect = document.getElementById("region");
    for (let region in data) {
        let option = document.createElement("option");
        option.value = region;
        option.text = region;
        regionSelect.appendChild(option);
    }
};

const poblarComunas = () => {
    let regionSelect = document.getElementById("region");
    let comunaSelect = document.getElementById("comuna");
    let selectedRegion = regionSelect.value;

    comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
    if (selectedRegion && data[selectedRegion]) {
        data[selectedRegion].forEach(comuna => {
            let option = document.createElement("option");
            option.value = comuna;
            option.text = comuna;
            comunaSelect.appendChild(option);
        });
    }
};

document.getElementById("region").addEventListener("change", poblarComunas);

window.onload = () => {
    poblarRegiones();
    poblarComunas();
};