// Variables globales
let map, directionsService, directionsRenderer, trafficLayer, heatmap;
let currentRouteIndex = 0; // Índice para rutas alternativas
let currentMode = 'conductores'; // Modo actual (conductores o deportistas)

// Inicializar el mapa
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -33.4489, lng: -70.6693 }, // Santiago, Chile
        zoom: 13,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    trafficLayer = new google.maps.TrafficLayer();

    directionsRenderer.setMap(map);

    // Configurar autocompletado para los inputs
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');
    const fromAutocomplete = new google.maps.places.Autocomplete(fromInput);
    const toAutocomplete = new google.maps.places.Autocomplete(toInput);
}

// Mostrar el formulario de conductores
function showConductores() {
    currentMode = 'conductores';
    document.getElementById('location-form').style.display = 'flex';
    document.getElementById('air-quality-info').style.display = 'none';

    if (heatmap) heatmap.setMap(null);
    directionsRenderer.setMap(map);
    trafficLayer.setMap(map);
}

// Mostrar el mapa de calor para deportistas con clima
function showDeportistas() {
    currentMode = 'deportistas';
    document.getElementById('location-form').style.display = 'none';
    document.getElementById('air-quality-info').style.display = 'block';

    directionsRenderer.setMap(null);
    trafficLayer.setMap(null);

    // Crear datos simulados para el mapa de calor del clima
    const weatherData = [
        { location: new google.maps.LatLng(-33.4489, -70.6693), weight: 30 }, // Temperatura en °C
        { location: new google.maps.LatLng(-33.456, -70.65), weight: 25 },
        { location: new google.maps.LatLng(-33.44, -70.68), weight: 35 },
        { location: new google.maps.LatLng(-33.42, -70.66), weight: 20 },
    ];

    // Configurar el mapa de calor para clima
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: weatherData.map((point) =>
            Object.assign(point, { weight: point.weight / 50 }) // Normalizar peso
        ),
        map: map,
        radius: 50,
        gradient: [
            'rgba(0, 255, 0, 0)',    // Verde claro (bueno)
            'rgba(0, 255, 0, 1)',    // Verde
            'rgba(255, 255, 0, 1)',  // Amarillo
            'rgba(255, 165, 0, 1)',  // Naranja
            'rgba(255, 0, 0, 1)'     // Rojo (malo)
        ],
    });
}

// Buscar y mostrar rutas para conductores
function calculateAndDisplayRoute() {
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;

    if (from && to) {
        directionsService.route(
            {
                origin: from,
                destination: to,
                travelMode: google.maps.TravelMode.DRIVING,
                provideRouteAlternatives: true, // Habilitar rutas alternativas
            },
            (response, status) => {
                if (status === 'OK') {
                    directionsRenderer.setDirections(response);
                    currentRouteIndex = 0; // Iniciar con la primera ruta
                    document.getElementById('change-route').style.display = 'block'; // Mostrar botón de cambio
                } else {
                    alert('No se pudo calcular la ruta: ' + status);
                }
            }
        );
    } else {
        alert('Por favor, ingresa ambas ubicaciones.');
    }
}

// Cambiar a una ruta alternativa
function changeRoute() {
    const response = directionsRenderer.getDirections();
    if (response && response.routes.length > 1) {
        currentRouteIndex = (currentRouteIndex + 1) % response.routes.length; // Cambiar al siguiente índice
        directionsRenderer.setRouteIndex(currentRouteIndex); // Mostrar la ruta alternativa
    } else {
        alert('No hay rutas alternativas disponibles.');
    }
}

// Limpiar la ruta actual
function clearRoute() {
    directionsRenderer.set('directions', null);
    document.getElementById('change-route').style.display = 'none'; // Ocultar botón de cambio de ruta
}

// Manejar eventos de botones
document.getElementById('btn-conductores').addEventListener('click', showConductores);
document.getElementById('btn-deportistas').addEventListener('click', showDeportistas);

// Manejar formulario de rutas
document.getElementById('location-form').addEventListener('submit', (e) => {
    e.preventDefault();
    calculateAndDisplayRoute();
});

// Manejar cambio de ruta
document.getElementById('change-route').addEventListener('click', changeRoute);

// Manejar limpieza de ruta
document.getElementById('clear-route').addEventListener('click', clearRoute);

// Inicializar el mapa al cargar
window.onload = initMap;
