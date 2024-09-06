// Capture the time when the tab is opened
var tabOpenTime = new Date().getTime();

function onLocationFound(e) {
    var radius = e.accuracy / 2;
    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters").openPopup();
    L.circle(e.latlng, radius).addTo(map);
  
    // Access the coordinates
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    console.log("Latitude:", lat);
    console.log("Longitude:", lng);
    console.log("radius:", radius);
  
    // Store coordinates and radius to be sent with tab close event
    window.tabData = {
        lat: lat,
        lng: lng,
        radius: radius
    };
}

function sendTabTimeData() {
    if (!window.tabData) return;

    var tabCloseTime = new Date().getTime();
    var duration = (tabCloseTime - tabOpenTime) / 1000; // Duration in seconds

    // Send data to PHP script
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "save_coordinates.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
        }
    };
    xhr.send("lat=" + window.tabData.lat + "&lng=" + window.tabData.lng + "&open_time=" + tabOpenTime + "&close_time=" + tabCloseTime + "&duration=" + duration + "&radius=" + window.tabData.radius);
}

function onLocationError(e) {
    alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

map.locate({ setView: false, maxZoom: 10, enableHighAccuracy: true });

window.addEventListener("beforeunload", sendTabTimeData);
