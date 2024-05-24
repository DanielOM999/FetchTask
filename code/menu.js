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
    let response = await fetch('https://api.openbrewerydb.org/v1/breweries/search?query=' + place + "&per_page=51");
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
}

// Async fetches and sends and runs showpopup function
async function onClick(e) {
    var customData = this.options.customData
    console.log(customData.id)
    let response = await fetch("https://api.openbrewerydb.org/v1/breweries/" + customData.id);
    let data = await response.json();
    showPopup(data)
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

// Function to display detailed brewery information in a popup
function showPopup(data) {
    $('#popup-overlay').css({
        opacity: 0,
        transform: 'scale(1)'
    }).show().animate({
        opacity: 1,
        scale: 1
    }, 500);
    let stringF = "</br>";
    document.getElementById("name").innerText = data.name;
    
    for (const key in data) {
        if (data.hasOwnProperty(key) && data[key] !== null && data[key] != data.id && data[key] != data.name) {
            if (data[key] == data.website_url || data[key] == data.phone) {
                if (data[key] == data.phone) {
                    const formattedNumber = formatPhoneNumber(data[key]);
                    stringF += `<p><strong>${key}</strong>:</p> <p>${formattedNumber}</p></br>`;
                } else {
                    stringF += `<p><strong>${key}</strong>:</p> <a href="${data[key]}">${data[key]}</a></br>`;
                }
            } else {
                stringF += `<p><strong>${key}</strong>:</p> <p>${data[key]}</p></br>`;
            }
        }
    }

    document.getElementById("text").innerHTML = stringF;
}

// jQuery to handle popup overlay visibility mainly hiding
$(document).ready(function() {
    $('#popup-overlay').hide();

    $('#close-btn').click(function() {
        $('#popup-overlay').fadeOut().animate({
            opacity: 0,
            scale: 0
        }, 500);;
    });
});

// Function to format phone numbers to USA standars
function formatPhoneNumber(number) {
    if(!number) return number;
    const phoneNumber = number.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumber < 7) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6, )}-${phoneNumber.slice(6, 9)}`;
}