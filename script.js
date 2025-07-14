const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

const aircraftLayer = L.layerGroup().addTo(map);

async function fetchAircraftData() {
    try {
        const response = await fetch('https://api.duckybot.xyz/atc24/aircraft');
        const data = await response.json();
        console.log('API Response:', data);
        updateMap(data.data);
    } catch (error) {
        console.error('Error fetching aircraft data:', error);
    }
}

const aircraftIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1029/1029183.png',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

function updateMap(aircraftData) {
    aircraftLayer.clearLayers();
    const aircraftArray = Object.keys(aircraftData).map(key => {
        const ac = aircraftData[key];
        return {
            flight: key,
            lat: ac.position.y,
            lon: ac.position.x,
            alt_geom: ac.altitude,
            gs: ac.speed,
            track: ac.heading,
            // squawk: ac.squawk, // Squawk is not in the provided sample, commenting out for now
            ...ac
        };
    });

    aircraftArray.forEach(ac => {
        const marker = L.marker([ac.lat, ac.lon], { 
            icon: aircraftIcon,
            rotationAngle: ac.track
        }).addTo(aircraftLayer);

        marker.on('click', () => {
            showDetails(ac);
        });
    });
}

const detailsPanel = document.getElementById('details-panel');
const detailsContent = document.getElementById('details-content');
const closeBtn = document.getElementById('close-btn');

function showDetails(aircraft) {
    detailsContent.innerHTML = `
        <p><strong>Callsign:</strong> ${aircraft.flight}</p>
        <p><strong>Altitude:</strong> ${aircraft.alt_geom} ft</p>
        <p><strong>Speed:</strong> ${aircraft.gs} kts</p>
        
        <p><strong>Latitude:</strong> ${aircraft.lat}</p>
        <p><strong>Longitude:</strong> ${aircraft.lon}</p>
    `;
    detailsPanel.classList.add('visible');
    detailsPanel.classList.remove('hidden');
}

closeBtn.addEventListener('click', () => {
    detailsPanel.classList.remove('visible');
    detailsPanel.classList.add('hidden');
});

fetchAircraftData();
setInterval(fetchAircraftData, 10000);
