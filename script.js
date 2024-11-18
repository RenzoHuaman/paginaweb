// Inicialización de variables globales
var map, directionsService, directionsRenderer, trafficLayer, fromAutocomplete, toAutocomplete, currentRouteIndex = 0;

// Inicializar el mapa de Google Maps con la capa de tráfico
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.4489, lng: -70.6693}, // Santiago, Chile
        zoom: 13
    });

    // Añadir la capa de tráfico
    trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    // Inicializar los servicios de rutas de Google Maps
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Autocompletado para los campos de entrada de direcciones
    var fromInput = document.getElementById('from');
    var toInput = document.getElementById('to');
    
    fromAutocomplete = new google.maps.places.Autocomplete(fromInput);
    toAutocomplete = new google.maps.places.Autocomplete(toInput);
}

// Función para calcular la ruta entre dos ubicaciones
function calculateAndDisplayRoute() {
    var from = document.getElementById('from').value;
    var to = document.getElementById('to').value;

    if (from && to) {
        directionsService.route({
            origin: from,
            destination: to,
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true  // Proveer rutas alternativas
        }, function(response, status) {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);
                currentRouteIndex = 0;
                // Mostrar el botón de "Cambio de Ruta"
                document.getElementById('change-route').style.display = 'inline-block';
            } else {
                alert('No se pudo calcular la ruta: ' + status);
            }
        });
    } else {
        alert('Por favor, ingresa ambas ubicaciones.');
    }
}

// Función para cambiar a una ruta alternativa
function changeRoute() {
    var response = directionsRenderer.getDirections();
    if (response && response.routes.length > 1) {
        currentRouteIndex = (currentRouteIndex + 1) % response.routes.length;
        directionsRenderer.setRouteIndex(currentRouteIndex);
    } else {
        alert('No hay rutas alternativas disponibles.');
    }
}

// Limpiar la ruta actual del mapa
function clearRoute() {
    directionsRenderer.set('directions', null);
    document.getElementById('change-route').style.display = 'none';  // Ocultar el botón de cambio de ruta
}

// Manejo del formulario para buscar la ruta
document.getElementById('location-form').addEventListener('submit', function(e) {
    e.preventDefault();
    calculateAndDisplayRoute();
});

// Cambiar la ruta al hacer clic en el botón de "Cambio de Ruta"
document.getElementById('change-route').addEventListener('click', changeRoute);

// Limpiar la ruta al hacer clic en el botón de "Limpiar Ruta"
document.getElementById('clear-route').addEventListener('click', clearRoute);

// Inicializar el mapa al cargar la página
window.onload = initMap;
