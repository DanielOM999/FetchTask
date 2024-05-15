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
const tiles = L.tileLayer(tileURL, {attribution}).addTo(map);
let place = document.getElementById("searchbar").value;
const api_url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + place;; 
console.log(place);

show_me(true, currentPage = 0)

async function show_me(Run, currentPage){
    let response = await fetch(`https://api.openbrewerydb.org/v1/breweries?page=${currentPage}&per_page=5`);
    let data = await response.json();
    if (data.length > 0) {
        data.forEach(element => {
            console.log("Latitude:", element.latitude, "Longitude:", element.longitude);
            if (element.latitude && element.longitude) {
                let marker = L.marker([element.latitude, element.longitude]).addTo(map);
                marker.bindPopup(`<b>${element.name}</b><br>${element.latitude}  ${element.longitude}`);
            }
        });
    } else {
        console.log("bu");
        Run = false;
    }
    if (Run) {
        setTimeout(() => show_me(Run, currentPage + 1), 1000);
    }
}
