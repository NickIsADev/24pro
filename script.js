const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

const aircraftLayer = L.layerGroup().addTo(map);

async function fetchAircraftData() {
    try {
        const response = await fetch('https://24data.ptfs.app/acft-data');
        const data = await response.json();
        updateMap(data.aircraft);
    } catch (error) {
        console.error('Error fetching aircraft data:', error);
    }
}

const aircraftIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1029/1029183.png',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

function updateMap(aircraft) {
    aircraftLayer.clearLayers();
    aircraft.forEach(ac => {
        const marker = L.marker([ac.lat, ac.lon], { 
            icon: aircraftIcon,
            rotationAngle: ac.track
        }).addTo(aircraftLayer);
        marker.bindPopup(`<b>${ac.flight}</b><br>Altitude: ${ac.alt_geom} ft`);
    });
}

fetchAircraftData();
setInterval(fetchAircraftData, 10000);
