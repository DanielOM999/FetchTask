// Finds elements by id and adds an eventlistener
const mybtn = document.getElementById('myList');
const tre = document.getElementById('btn');
tre.addEventListener("click", openmenu );

// Initialize map and the icon
var map = L.map('map1')
var customIcon = L.icon({
    iconUrl: '../public/beer.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});
var mapIn = false;

// Toggle menu visibility
function openmenu() {
    if(mybtn.style.display != 'block') {
        mybtn.style.display = 'block';
    } else {
        mybtn.style.display = 'none';
    }
    console.log('clicked');
}

// Makes a search trought and display breweries on the map
async function search () {
    if (!mapIn) {
        document.getElementById("map1").style.backgroundImage = "url(" + "" + ")"
        document.getElementById("mapH").innerText = ""
        const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'

        map.setView([39.8333, -98.5855], 3);
        let tileURL = 'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=jrWXhyKc3SrZIgzh4DCp';
        const tiles = L.tileLayer(tileURL, {attribution}).addTo(map)
        mapIn = true;
    }
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

async function onClick(e) {
    let stringF = "";
    var customData = this.options.customData
    console.log(customData.id)
    let response = await fetch("https://api.openbrewerydb.org/v1/breweries/" + customData.id);
    let data = await response.json();
    for (const key in data) {
        if (data.hasOwnProperty(key) && data[key] !== null && data[key] != data.id) {
            stringF += `${key}: ${data[key]}\n`;
        }
    }
    // alert(stringF)
    showPopup()
}

// Function to display all breweries on first page and only 51 on the map
async function show_me(){
    if (!mapIn) {
        document.getElementById("map1").style.backgroundImage = "url(" + "" + ")"
        document.getElementById("mapH").innerText = ""
        const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'

        map.setView([39.8333, -98.5855], 3);
        let tileURL = 'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=jrWXhyKc3SrZIgzh4DCp';
        const tiles = L.tileLayer(tileURL, {attribution}).addTo(map)

        let response = await fetch("https://api.openbrewerydb.org/v1/breweries?per_page=51");
        let data = await response.json();

        map.eachLayer(function(layer) {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        data.forEach(element => {
            console.log("Latitude:", element.latitude, "Longitude:", element.longitude);
            if (element.latitude && element.longitude) {
                let customData = {
                    id: element.id
                };
                let marker = L.marker([element.latitude, element.longitude], {icon: customIcon, customData: customData}).addTo(map).on('click', onClick);
            }
        });
        mapIn = true
    }
}

function showPopup() {
    $('#popup-overlay').css({
        opacity: 0,
        transform: 'scale(1)'
    }).show().animate({
        opacity: 1,
        scale: 1
    }, 500);
}

$(document).ready(function() {
    $('#popup-overlay').hide();

    $('#close-btn').click(function() {
        $('#popup-overlay').fadeOut().animate({
            opacity: 0,
            scale: 0
        }, 500);;
    });
});
