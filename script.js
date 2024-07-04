// global variables
let map;
let service;
let infowindow;
let geocoder;

function initMap() {
    const center = new google.maps.LatLng(28.6139, 77.2088);
    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 15,
    });

    infowindow = new google.maps.InfoWindow();   // initializes var used to display info windows on map
    geocoder = new google.maps.Geocoder();  // initializes var used to convert addresses to coordinates
}

function geocodeAddress() {
    const address = document.getElementById('address').value;
    geocoder.geocode({ 'address': address }, function(results, status) { // callback function executed after geocoding
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            const marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function performSearch() {
    const placeType = document.getElementById('place-type').value.toLowerCase();
    const radius = document.getElementById('radius').value * 1000;

    const request = {
        location: map.getCenter(),
        radius: radius,
        type: [placeType]
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, handleSearchResults);
}

function handleSearchResults(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        for (let i = 0; i < results.length; i++) {
            createMarker(results[i]);
            const place = results[i];
            const rating = place.rating ? place.rating : 'No rating available';
            const photo = place.photos ? place.photos[0].getUrl({maxWidth: 100, maxHeight: 100}) : '';
            const placeDiv = document.createElement('div');
            placeDiv.classList.add('result');
            placeDiv.innerHTML = `
                <div class="result-content">
                    <strong>${place.name}</strong><br>
                    ${place.vicinity}<br>
                    <div class="rating"><span class="star">★</span><span>${rating}</span></div>
                </div>
                ${photo ? `<img src="${photo}" alt="${place.name}">` : ''}
            `;
            resultsDiv.appendChild(placeDiv);
        }
    }
}

function createMarker(place) {
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

document.getElementById('geocode-button').addEventListener('click', geocodeAddress);
document.getElementById('search-button').addEventListener('click', performSearch);

window.onload = initMap;
