//Gráfico Líneas
function cargarGraficoPorDia() {
    fetch('/api/estadisticas/por-dia')
        .then(response => response.json())
        .then(data => {
            const fechas = data.map(item => item.fecha);
            const cantidades = data.map(item => item.cantidad);

            Highcharts.chart('chart-por-dia', {
                chart: {type: 'line'},
                title: {text: ''},
                xAxis: {categories: fechas, title: {text: 'Fecha'}},
                yAxis: {title: {text: 'Cantidad de Avisos'}, allowDecimals: false},
                series: [{name: 'Avisos de Adopción', data: cantidades, color: '#ffbb46ff'}],
                credits: {enabled: false}
            });
        })
        .catch(error => {
            console.error('Error al cargar gráfico por día:', error);
            document.getElementById('chart-por-dia').innerHTML = '<p>Error al cargar datos</p>';
        });
}

//Gráfico Torta
function cargarGraficoPorTipo() {
    fetch('/api/estadisticas/por-tipo')
        .then(response => response.json())
        .then(data => {
            const seriesData = data.map(item => ({
                name: item.tipo === 'perro' ? 'Perros' : 'Gatos',
                y: item.cantidad
            }));

            Highcharts.chart('chart-por-tipo', {
                chart: {type: 'pie'},
                title: {text: ''},
                plotOptions: {pie: { allowPointSelect: true, cursor: 'pointer', 
                    dataLabels: { enabled: true,format: '<b>{point.name}</b>: {point.percentage:.1f} %'}, showInLegend: true}}, 
                series: [{ name: 'Cantidad',colorByPoint: true, data: seriesData}],
                colors: ['#ff6b6bff', '#4ebacdff'],
                credits: {enabled: false}
            });
        })
        .catch(error => {
            console.error('Error al cargar gráfico por tipo:', error);
            document.getElementById('chart-por-tipo').innerHTML = '<p>Error al cargar datos</p>';
        });
}

//Gráfico Barras
function cargarGraficoPorMes() {
    fetch('/api/estadisticas/por-mes-tipo')
        .then(response => response.json())
        .then(data => {
            //Organizar datos por mes
            const meses = [...new Set(data.map(item => item.mes))].sort();
            const datosGatos = [];
            const datosPerros = [];

            meses.forEach(mes => {
                const gatosMes = data.find(item => item.mes === mes && item.tipo === 'gato');
                const perrosMes = data.find(item => item.mes === mes && item.tipo === 'perro');

                datosGatos.push(gatosMes ? gatosMes.cantidad : 0);
                datosPerros.push(perrosMes ? perrosMes.cantidad : 0);
            });

            //Formatear meses para mostrar (ej: 2025-10 -> Oct 2025)
            const mesesFormateados = meses.map(mes => {
                const [año, numeroMes] = mes.split('-');
                const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                                      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                return `${nombresMeses[parseInt(numeroMes) - 1]} ${año}`;
            });

            Highcharts.chart('chart-por-mes', {
                chart: {type: 'column'},
                title: {text: ''},
                xAxis: {categories: mesesFormateados, title: {text: 'Mes'}},
                yAxis: {title: {text: 'Cantidad de Avisos'}, allowDecimals: false},
                plotOptions: {column: {dataLabels: {enabled: true}}},
                series: [{ name: 'Gatos', data: datosGatos, color: '#4ebacdff'}, 
                    {name: 'Perros', data: datosPerros, color: '#ff6b6bff'}],
                credits: { enabled: false }
            });
        })
        .catch(error => {
            console.error('Error al cargar gráfico por mes:', error);
            document.getElementById('chart-por-mes').innerHTML = '<p>Error al cargar datos</p>';
        });
}

document.addEventListener('DOMContentLoaded', function() {
    cargarGraficoPorDia();
    cargarGraficoPorTipo();
    cargarGraficoPorMes();
});
