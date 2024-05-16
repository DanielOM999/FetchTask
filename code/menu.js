const mybtn = document.getElementById('myList');
const tre = document.getElementById('btn');
tre.addEventListener("click", openmenu );
function openmenu() {
    if(mybtn.style.display != 'block') {
        mybtn.style.display = 'block';
    } else {
        mybtn.style.display = 'none';
    }
    console.log('clicked');
}

// map settings
const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'

var map = L.map('map1').setView([0, 0], 2);
let tileURL = 'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=jrWXhyKc3SrZIgzh4DCp';
const tiles = L.tileLayer(tileURL, {attribution}).addTo(map)
var customIcon = L.icon({
    iconUrl: '../public/beer.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});
show_me()

async function search () {
    let place = document.getElementById("searchbar").value;
    console.log(place);
    let response = await fetch('https://api.openbrewerydb.org/v1/breweries/search?query=' + place);
    let data = await response.json();

    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    data.forEach(element => {
        console.log("Latitude:", element.latitude, "Longitude:", element.longitude);
        if (element.latitude && element.longitude) {
            let marker = L.marker([element.latitude, element.longitude], {icon: customIcon}).addTo(map);
            marker.bindPopup(`<b>${element.name}</b><br>${element.latitude}  ${element.longitude}`).openPopup();
        }
    });
}

async function show_me(){
    let response = await fetch("https://api.openbrewerydb.org/v1/breweries/");
    let data = await response.json();

    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    data.forEach(element => {
        console.log("Latitude:", element.latitude, "Longitude:", element.longitude);
        if (element.latitude && element.longitude) {
            let marker = L.marker([element.latitude, element.longitude], {icon: customIcon}).addTo(map);
            marker.bindPopup(`<b>${element.name}</b><br>${element.latitude}  ${element.longitude}`);
        }
    });
}
