// GeoServer URL
var geoserverUrl = "https://iwmsgis.pmc.gov.in/geoserver";
var workspace = "Bhavan";

// Variable to keep track of legend visibility
var legendVisible = false; // Initialize as false since legend is hidden initially
var processedLayers = [];

// Add the WMS Legend control to the map
var legendControl = L.control({ position: "topright" });

legendControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend");

  // Function to fetch and populate the legend
  function updateLegend() {
    // Clear the existing legend
    div.innerHTML = '';

    // Fetch capabilities to get all layers in the 'pmc' workspace
    fetch(geoserverUrl + "/ows?service=wms&version=1.3.0&request=GetCapabilities")
      .then((response) => response.text())
      .then((data) => {
        // Parse capabilities XML response
        var parser = new DOMParser();
        var xml = parser.parseFromString(data, "text/xml");

        // Extract layer names and legend URLs for layers in the 'pmc' workspace
        var layers = xml.querySelectorAll('Layer[queryable="1"]');
        layers.forEach((layer) => {
          var layerName = layer.querySelector("Name").textContent;
          var layerWorkspace = layerName.split(":")[0]; // Extract workspace from layer name
          if (layerWorkspace === workspace && !processedLayers.includes(layerName)) {
            var legendUrl =
              geoserverUrl +
              "/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" +
              layerName;
            var layerParts = layerName.split(":"); // Split layer name by ":"
            var layerDisplayName = layerParts[layerParts.length - 1]; // Take the last part as the display name
            div.innerHTML +=
              "<p><strong>" +
              layerDisplayName + // Use layerDisplayName instead of layerName
              "</strong></p>" +
              '<img src="' +
              legendUrl +
              '" alt="' +
              layerDisplayName + // Use layerDisplayName instead of layerName
              ' legend"><br>';
            processedLayers.push(layerName); // Add processed layer to the list
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching capabilities:", error);
      });
  }

  // Initially update the legend
  updateLegend();

  // Apply CSS to fit to bottom right, occupy 60% of screen height, and provide scrollbar
  div.style.position = "fixed";
  div.style.bottom = "0";
  div.style.right = "0";
  div.style.height = "0"; // Start with height 0 to keep it hidden initially
  div.style.width = "300px";
  div.style.overflowY = "auto";
  div.style.scrollbarWidth = "thin";
  div.style.backgroundColor = "white";
  div.style.border = "2px solid darkblue";
  div.style.borderRadius = "10px";
  div.style.padding = "10px";
  div.style.transition = "all 0.3s ease-in-out"; // Add transition for smooth animation

  return div;
};

legendControl.addTo(map);

// Add collapsible button
var collapseButton = L.control({ position: "topright" });

collapseButton.onAdd = function (map) {
  var button = L.DomUtil.create("button", "collapse-button");
  button.innerHTML = "<i class='fa-solid fa-list' style='color:darkblue;'></i>"; // Initial text

  // Apply styling
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
  button.style.transition = "background-color 0.3s ease-in-out"; // Add transition for smooth animation

  // Toggle legend visibility when the button is clicked
  button.onclick = function () {
    var legendDiv = document.querySelector(".info.legend");
    if (!legendVisible) {
      legendDiv.style.height = "40vh"; // Maximize the legend
      legendVisible = true;
    } else {
      legendDiv.style.height = "0"; // Minimize the legend
      legendVisible = false;
    }
  };

  return button;
};

collapseButton.addTo(map);

// Hide the legend when the map is clicked
map.on('click', function (e) {
  var legendDiv = document.querySelector(".info.legend");
  if (legendVisible && legendDiv) {
    // Check if the click event target is outside the legend
    if (!legendDiv.contains(e.originalEvent.target)) {
      legendDiv.style.height = "0"; // Minimize the legend
      legendVisible = false;
    }
  } else {
    console.log("Legend not visible or not found");
  }
});

// North Image and scale

// Scale
L.control.scale().addTo(map);

// Create a custom control for the north arrow
var northArrowControl = L.Control.extend({
  options: {
    position: "bottomleft",
  },
  onAdd: function (map) {
    var container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
    container.innerHTML =
      '<img src="png/002-cardinal-point.png" class="border-0;" alt="" style="width: 30px; height:50px; background-color: white; border:2px solid darkblue;">';
    return container;
  },
});

map.addControl(new northArrowControl());

// Handle legend visibility based on map interaction
map.on('click', function (e) {
  var legendDiv = document.querySelector(".info.legend");
  if (legendVisible && legendDiv) {
    // Check if the click event target is outside the legend
    if (!legendDiv.contains(e.originalEvent.target)) {
      legendDiv.style.height = "0"; // Minimize the legend
      legendVisible = false;
    }
  }
});
