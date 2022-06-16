let lat;
let lon;
let map;



function createMap() {
    map = L.map('map', {
        center: [lat, lon],
        zoom: 10,
    });
    // add openstreetmap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: '15',
    }).addTo(map)
    // create and add geolocation marker
    const marker = L.marker([lat, lon])
    marker
        .addTo(map)
        .bindPopup('<p1><b>You are here</b><br></p1>')
        .openPopup()
}


async function getCoords() {
    const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    });
    return [pos.coords.latitude, pos.coords.longitude]
}


async function getFoursquare(business) {
    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: 'fsq3ATzZbmcGhdeFafr73wZcnJ+LlN6bK+4dh19a7ClS4u8='
        }
    }
    let limit = 5
    let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=5&ll=${lat}%2C${lon}`, options)
    let data = await response.text()
    let parsedData = JSON.parse(data)
    let businesses = parsedData.results
    console.log('RESULTS!!!', businesses)
    return businesses
}

async function startUsUp() {
    let coords = await getCoords();
    console.log('current location!!', coords)
    lat = coords[0]
    lon = coords[1]

    // const myBusiness = await getFoursquare('coffee shop')
    createMap()
}


startUsUp()

document.getElementById('submit').addEventListener('click', async function (e) {
    e.preventDefault()

    const type = document.getElementById("business").value
    console.log('clicked', type)
    const myBusinesses = await getFoursquare(type)
    console.log('did this work?', myBusinesses)
    addMarkers(myBusinesses)
})


function addMarkers(businesses) {
    for (let i = 0; i < businesses.length; i++) {
        const marker = L.marker([businesses[i].geocodes.main.latitude, businesses[i].geocodes.main.longitude])
        marker
            .addTo(map)
            .bindPopup(`<p1><b>${businesses[i].name}</b><br></p1>`)
            .openPopup()

    }
}