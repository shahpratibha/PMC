// GeoServer URL
var geoserverUrl = "https://iwmsgis.pmc.gov.in/geoserver";
var workspace = "Bhavan";
var legendVisible = true;
var processedLayers = [];

// Add the WMS Legend control to the map
var legendControl = L.control({ position: "topright" });

legendControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend");

  function updateLegend() {
    div.innerHTML = '';

    fetch(geoserverUrl + "/ows?service=wms&version=1.3.0&request=GetCapabilities")
      .then((response) => response.text())
      .then((data) => {
        var parser = new DOMParser();
        var xml = parser.parseFromString(data, "text/xml");

        var layers = xml.querySelectorAll('Layer[queryable="1"]');
        layers.forEach((layer) => {
          var layerName = layer.querySelector("Name").textContent;
          var layerWorkspace = layerName.split(":")[0];
          if (layerWorkspace === workspace && !processedLayers.includes(layerName)) {
            var legendUrl = `${geoserverUrl}/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${layerName}`;
            var layerParts = layerName.split(":");
            var layerDisplayName = layerParts[layerParts.length - 1];
            div.innerHTML += `<p><strong>${layerDisplayName}</strong></p><img src="${legendUrl}" alt="${layerDisplayName} legend"><br>`;
            processedLayers.push(layerName);
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching capabilities:", error);
      });
  }

  updateLegend();

  div.style.position = "fixed";
  div.style.bottom = "0";
  div.style.right = "0";
  div.style.height = "40vh";
  div.style.width = "300px";
  div.style.overflowY = "auto";
  div.style.scrollbarWidth = "thin";
  div.style.backgroundColor = "white";
  div.style.border = "2px solid darkblue";
  div.style.borderRadius = "10px";
  div.style.padding = "10px";
  div.style.transition = "all 0.3s ease-in-out";

  function toggleLegend() {
    if (legendVisible) {
      div.style.height = "0";
      legendVisible = false;
    } else {
      div.style.height = "40vh";
      legendVisible = true;
    }
  }

  div.addEventListener('click', toggleLegend);
  return div;
};

legendControl.addTo(map);

// Add collapsible button
var collapseButton = L.control({ position: "topright" });

collapseButton.onAdd = function (map) {
  var button = L.DomUtil.create("button", "collapse-button");
  button.innerHTML = "<i class='fa-solid fa-list' style='color:darkblue;'></i>";

  button.style.backgroundColor = "white";
  button.style.border = "2px solid darkblue";
  button.style.width = "35px";
  button.style.height = "35px";
  button.style.borderRadius = "5px";
  button.style.color = "black";
  button.style.padding = "10px";
  button.style.textAlign = "center";
  button.style.textDecoration = "none";
  button.style.display = "block";
  button.style.margin = "10px";
  button.style.cursor = "pointer";
  button.style.transition = "background-color 0.3s ease-in-out";

  button.onclick = function () {
    var legendDiv = document.querySelector(".info.legend");
    if (legendDiv.style.height === "0px" || legendDiv.style.display === "none") {
      legendDiv.style.display = "block";
      legendDiv.style.height = "40vh";
      legendDiv.style.width = "200px";
      legendDiv.style.top = "12%";
      legendDiv.style.right = "3%";
      legendDiv.style.scrollbarWidth = "thin";
      legendDiv.style.scrollbarColor = "#163140 white";
      legendDiv.style.borderRadius = "10px";
      legendDiv.style.boxShadow = "5px 5px 5px rgba(0, 0, 0, 0.7)";
      button.innerHTML = "<i class='fa-solid fa-list' style='color:darkblue;'></i>";
      button.style.backgroundColor = "white";
      legendVisible = true;
    } else {
      legendDiv.style.display = "none";
      button.innerHTML = "<i class='fa-solid fa-list' style='color:darkblue;'></i>";
      button.style.backgroundColor = "white";
      legendVisible = false;
    }
  };

  return button;
};

collapseButton.addTo(map);

// Hide the legend when the mouse moves over the map
map.on('mousemove', function () {
  var legendDiv = document.querySelector(".info.legend");
  if (legendDiv.style.display === "block") {
    legendDiv.style.display = "none";
    legendVisible = false;
  }
});

// North Image and scale
map.options.scale = true;
L.control.scale().addTo(map);

var northArrowControl = L.Control.extend({
  options: {
    position: "bottomleft",
  },
  onAdd: function (map) {
    var container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
    container.innerHTML = '<img src="png/002-cardinal-point.png" class="border-0;" alt="" style="width: 30px; height:50px; background-color: white; border:2px solid darkblue;">';
    return container;
  },
});

map.addControl(new northArrowControl());
