var map, geojson;
const API_URL = "http://localhost/PMC_a/";
// const API_URL = "http://localhost/PMC-Project/";

//Add Basemap
var map = L.map("map", {}).setView([18.52, 73.895], 12, L.CRS.EPSG4326);

var googleSat = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);

var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);
// <!-- -----------------layer displayed------------------------ -->

var baseLayers = {};

var wms_layer1 = L.tileLayer.wms(
  "https://geo.geopulsea.com/geoserver/pmc/wms",
  {
    layers: "Revenue",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    attribution: "Revenue",
    opacity: 1,
  }
);

var wms_layer12 = L.tileLayer
  .wms("https://geo.geopulsea.com/geoserver/pmc/wms", {
    layers: "Admin_Ward",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    attribution: "Admin_Ward",
    opacity: 1,
  })
  .addTo(map);

var wms_layer13 = L.tileLayer
  .wms("https://geo.geopulsea.com/geoserver/pmc/wms", {
    layers: "Zone_layer",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    attribution: "Zone_layer",
    opacity: 1,
  })
  .addTo(map);

var wms_layer14 = L.tileLayer
  .wms("https://geo.geopulsea.com/geoserver/pmc/wms", {
    layers: "Village_Boundary",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    attribution: "Village_Boundary",
    opacity: 1,
  })
  .addTo(map);

var wms_layer15 = L.tileLayer
  .wms("https://geo.geopulsea.com/geoserver/pmc/wms", {
    layers: "IWMS_point",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    attribution: "IWMS_point",
    opacity: 1,
  })
  .addTo(map);
var wms_layer16 = L.tileLayer
  .wms("https://geo.geopulsea.com/geoserver/pmc/wms", {
    layers: "PMC_Layers",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    attribution: "PMC_Layers",
    opacity: 1,
    maxZoom: 25,
  })
  .addTo(map);

var wms_layer17 = L.tileLayer
  .wms("https://geo.geopulsea.com/geoserver/pmc/wms", {
    layers: "Exist_Road",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    attribution: "Exist_Road",
    opacity: 1,
    maxZoom: 25,
  })
  .addTo(map);

var wms_layer3 = L.tileLayer.wms(
  "https://geo.geopulsea.com/geoserver/pmc/wms",
  {
    layers: "Data",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    attribution: "Data",
    opacity: 1,
  }
);

var wms_layer4 = L.tileLayer
  .wms("https://geo.geopulsea.com/geoserver/pmc/wms", {
    layers: "geodata",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    attribution: "geodata",
    opacity: 1,
  })
  .addTo(map);

var WMSlayers = {
  OpenStreetMap: osm,
  "Esri World Imagery": Esri_WorldImagery,
  "Google Satellite": googleSat,
  Zone_layer: wms_layer13,
  Admin_Ward: wms_layer12,
  Village_Boundary: wms_layer14,
  IWMS_point: wms_layer15,
  PMC_Layers: wms_layer16,
  Exist_Road: wms_layer17,
  Revenue: wms_layer1,
  Data: wms_layer3,
  geodata: wms_layer4,
};
function refreshWMSLayer() {
  // Remove the layer from the map
  map.removeLayer(wms_layer4);
  // Add the layer again
  wms_layer4.addTo(map);
}

refreshWMSLayer();
var control = new L.control.layers(baseLayers, WMSlayers).addTo(map);

// FeatureGroup to store drawn items
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Add a search bar
var searchControl = new L.esri.Controls.Geosearch().addTo(map);
var results = new L.LayerGroup().addTo(map);

// Handle search results
searchControl.on("results", function (data) {
  results.clearLayers();
  for (var i = data.results.length - 1; i >= 0; i--) {
    results.addLayer(L.marker(data.results[i].latlng));
  }
});
var drawControl = new L.Control.Draw({
  draw: {
    polyline: {
      shapeOptions: {
        color: "red", // set the color for the polygon border
      },
      icon: new L.DivIcon({
        iconSize: new L.Point(6, 6), // set the size of the icon
        className: "leaflet-div-icon", // specify the icon class
      }),
    },
    polygon: {
      shapeOptions: {
        color: "blue", // set the color for the polygon border
      },
      icon: new L.DivIcon({
        iconSize: new L.Point(6, 6), // set the size of the icon
        className: "leaflet-div-icon", // specify the icon class
      }),
    },
    circle: false,
    marker: true,
    rectangle: true,
  },
  edit: {
    featureGroup: drawnItems,
    remove: true,
  },
});
map.addControl(drawControl);

// function for added buffer

var associatedLayersRegistry = {};

function createBufferAndDashedLine(polylineLayer, roadLenght, bufferWidth) {
  var geoJSON = polylineLayer.toGeoJSON();
  var halfBufferWidth = bufferWidth / 2;
  var buffered = turf.buffer(geoJSON, halfBufferWidth, { units: "meters" }); // Adjust buffer size as needed

  var bufferLayer = L.geoJSON(buffered, {
    style: {
      color: "#000000",
      weight: 4,
      opacity: 0.5,
      lineJoin: "round",
    },
  }).addTo(map);

  var dashedLineLayer = L.geoJSON(geoJSON, {
    style: {
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      dashArray: "10, 10",
      lineJoin: "round",
    },
  }).addTo(map);

  // Store references to the associated layers
  associatedLayersRegistry[polylineLayer._leaflet_id] = {
    bufferLayer: bufferLayer,
    dashedLineLayer: dashedLineLayer,
  };
}

function removeAssociatedLayers(layerId) {
  var associatedLayers = associatedLayersRegistry[layerId];
  if (associatedLayers) {
    if (associatedLayers.bufferLayer)
      map.removeLayer(associatedLayers.bufferLayer);
    if (associatedLayers.dashedLineLayer)
      map.removeLayer(associatedLayers.dashedLineLayer);
    delete associatedLayersRegistry[layerId]; // Clear the registry entry
  }
}

function checkPolylineIntersection(newPolyline) {
  var existingPolylines = getExistingPolylines();
  var totalIntersectionLength = 0;
  var newPolylineLength = turf.length(newPolyline, { units: "kilometers" });

  existingPolylines.forEach(function (polyline) {
    var intersection = turf.intersect(newPolyline, polyline);
    if (intersection) {
      totalIntersectionLength += turf.length(intersection, {
        units: "kilometers",
      });
    }
  });

  var intersectionPercentage =
    (totalIntersectionLength / newPolylineLength) * 100;
  return intersectionPercentage <= 20;
}

function getWFSUrl() {
  const geoserverBaseUrl = "https://geo.geopulsea.com/geoserver/pmc/ows"; // Adjust this URL to your GeoServer OWS endpoint
  const params = {
    service: "WFS",
    version: "1.0.0",
    request: "GetFeature",
    typeName: "pmc:geodata", // Keep the workspace:layer format
    outputFormat: "application/json",
    srsName: "EPSG:4326",
  };
  const queryString = new URLSearchParams(params).toString();
  return `${geoserverBaseUrl}?${queryString}`;
}

async function getGeodataFeatures() {
  try {
    const url = getWFSUrl();
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const geojson = await response.json();
    return geojson.features; // Assuming the response is a GeoJSON object
  } catch (error) {
    console.error("Error fetching geodata features:", error);
    return []; // Return an empty array in case of error
  }
}

function checkOverlapWithGeodata(newFeature, geodataFeatures) {
  let totalOverlapArea = 0;
  let newFeatureArea = 0;
  let conversionFactor = 0; // Used for converting lengths to areas for LineStrings

  // Convert newFeature to a buffer if it's a LineString to approximate as a Polygon
  if (newFeature.geometry.type === "LineString") {
    newFeature = turf.buffer(newFeature, 0.001, { units: "kilometers" }); // Buffer size might need adjustment
    conversionFactor = 0.001; // Assuming a narrow buffer width for conversion factor
  }

  if (
    newFeature.geometry.type === "Polygon" ||
    newFeature.geometry.type === "MultiPolygon"
  ) {
    newFeatureArea = turf.area(newFeature);
  }

  geodataFeatures.forEach(function (feature) {
    // Convert feature to a buffer if it's a LineString
    if (feature.geometry.type === "LineString") {
      feature = turf.buffer(feature, 0.001, { units: "kilometers" }); // Adjust buffer size as necessary
    }

    if (
      feature.geometry.type === "Polygon" ||
      feature.geometry.type === "MultiPolygon"
    ) {
      let intersection = turf.intersect(newFeature, feature);

      if (intersection) {
        totalOverlapArea += turf.area(intersection);
      }
    }
  });

  let overlapPercentage = 0;
  if (newFeatureArea > 0) {
    overlapPercentage = (totalOverlapArea / newFeatureArea) * 100;
  }

  // Adjust calculation if the original newFeature was a LineString
  if (newFeature.geometry.type === "LineString" && conversionFactor > 0) {
    let newFeatureLength = turf.length(newFeature, { units: "kilometers" });
    let estimatedArea = newFeatureLength * conversionFactor;

    overlapPercentage = (totalOverlapArea / estimatedArea) * 100;
  }

  return overlapPercentage <= 20;
}

// var layer;
map.on("draw:created", function (e) {
  const works_aa_approval_id = "856";
  var newFeature = e.layer.toGeoJSON();

  getGeodataFeatures().then(function (geodataFeatures) {
    var isAllowed = checkOverlapWithGeodata(newFeature, geodataFeatures);

    if (isAllowed) {
      // Add the feature to the map if overlap is 20% or less
      drawnItems.addLayer(e.layer);
    } else {
      alert("Road overlaps more than 20% with existing Road.");
      // Do not add the new feature to the map
    }
  });

  if (e.layerType === "polyline") {
    var length = turf.length(e.layer.toGeoJSON(), { units: "kilometers" });
    var roadLenght = localStorage.getItem("roadLenght");
    if (length > roadLenght) {
      alert(
        `The Road is longer than ${roadLenght} kilometers. Please draw a shorter Road.`
      );
      return; // Stop further processing
    }
  }
  var layer = e.layer;
  drawnItems.addLayer(layer);

  if (e.layerType === "polyline") {
    var bufferWidth = localStorage.getItem("bufferWidth");

    createBufferAndDashedLine(layer, roadLenght, bufferWidth);
  }

  var geoJSON = layer.toGeoJSON();
  var popupContent = UpdateArea(geoJSON);
  var lastInsertedId = localStorage.getItem("lastInsertedId");
  var lastDrawnPolylineId = layer._leaflet_id;
  $.ajax({
    // url: API_URL + "/process.php", // Path to the PHP script
    url: API_URL + "APIS/Get_Conceptual_Form.php", // Path to the PHP script
    type: "GET",
    data: { id: lastInsertedId },
    dataType: "json",
    success: function (response) {
      // if (response.success) {
      if (response.data != undefined) {
        const responseData = response.data;

        if (responseData != undefined) {
          popupContent +=
            "<tr><td>Name of work</td><td>" +
            responseData.work_name +
            "</td></tr>";
          popupContent +=
            "<tr><td>Department</td><td>" +
            responseData.department +
            "</td></tr>";
          popupContent +=
            "<tr><td>ID</td><td>" +
            responseData.works_aa_approval_id +
            "</td></tr>";
          popupContent += "<tr><td>Lat-Long</td><td></td></tr>";
          popupContent +=
            "<tr><td>Scope of work</td><td>" +
            responseData.scope_of_work +
            "</td></tr>";
          popupContent +=
            "<tr><td>Work-type</td><td>" +
            responseData.work_type +
            "</td></tr>";
          popupContent +=
            "<tr><td>Zone</td><td>" + responseData.zone + "</td></tr>";
          popupContent +=
            "<tr><td>Ward</td><td>" + responseData.ward + "</td></tr>";
          popupContent +=
            "<tr><td>Prabhag no.</td><td>" +
            responseData.project_no +
            "</td></tr>";
          popupContent +=
            "<tr><td>Date of competition work</td><td>" +
            responseData.created_date +
            "</td></tr>";
          popupContent +=
            "<tr><td>JE Name</td><td>" +
            responseData.junior_engineer_name +
            "</td></tr>";
          popupContent += "<tr><td>Village- name , Gut no,</td><td></td></tr>";
        }

        // Add CSV data to the popup content
        // var csvData = response.data;
        // if (csvData) {
        //   popupContent +=
        //     "<tr><td>" +
        //     csvData[0][0] +
        //     "</td><td>" +
        //     csvData[1][0] +
        //     "</td></tr>";
        //   popupContent +=
        //     "<tr><td>" +
        //     csvData[0][1] +
        //     "</td><td>" +
        //     csvData[1][1] +
        //     "</td></tr>";
        //   popupContent +=
        //     "<tr><td>" +
        //     csvData[0][2] +
        //     "</td><td>" +
        //     csvData[1][2] +
        //     "</td></tr>";
        //   popupContent +=
        //     "<tr><td>" +
        //     csvData[0][3] +
        //     "</td><td>" +
        //     csvData[1][3] +
        //     "</td></tr>";
        //   popupContent +=
        //     "<tr><td>" +
        //     csvData[0][6] +
        //     "</td><td>" +
        //     csvData[1][6] +
        //     "</td></tr>";
        //   popupContent +=
        //     "<tr><td>" +
        //     csvData[0][7] +
        //     "</td><td>" +
        //     csvData[1][7] +
        //     "</td></tr>";
        //   popupContent +=
        //     "<tr><td>" +
        //     csvData[0][8] +
        //     "</td><td>" +
        //     csvData[1][8] +
        //     "</td></tr>";
        //   popupContent +=
        //     "<tr><td>" +
        //     csvData[0][9] +
        //     "</td><td>" +
        //     csvData[1][9] +
        //     "</td></tr>";
        // }

        // Close the table tag
        popupContent += "</table>";

        // Add buttons for adding and deleting rows
        popupContent += `
        <button class="popup-button" onclick="Savedata('${lastDrawnPolylineId}')">Save</button>
    `;
        popupContent +=
          '<button class="popup-button" onclick="SavetoKML()">Save to KML</button>';

        // Bind the table popup to the layer
        layer.bindPopup(popupContent).openPopup();
      } else {
        console.error("Error fetching CSV data:", response.error);
      }
    },
    error: function (error) {
      console.error("AJAX request failed:", error);
    },
  });

  // Bind the table popup to the layer
  // layer.bindPopup(popupContent).openPopup();
});
map.on("draw:edited", function (e) {
  e.layers.eachLayer(function (layer) {
    var geoJSON = layer.toGeoJSON();
    var popupContent = UpdateArea(geoJSON);
    var roadLenght = localStorage.getItem("roadLenght");
    var bufferWidth = localStorage.getItem("bufferWidth");

    // Check for and remove existing associated layers
    removeAssociatedLayers(layer._leaflet_id);

    if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
      createBufferAndDashedLine(layer, roadLenght, bufferWidth);
    }

    $.ajax({
      url: API_URL + "process.php", // Path to the PHP script
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.success) {
          // Add CSV data to the popup content
          var csvData = response.data;
          if (csvData) {
            popupContent +=
              "<tr><td>" +
              csvData[0][0] +
              "</td><td>" +
              csvData[1][0] +
              "</td></tr>";
            popupContent +=
              "<tr><td>" +
              csvData[0][1] +
              "</td><td>" +
              csvData[1][1] +
              "</td></tr>";
            popupContent +=
              "<tr><td>" +
              csvData[0][2] +
              "</td><td>" +
              csvData[1][2] +
              "</td></tr>";
            popupContent +=
              "<tr><td>" +
              csvData[0][3] +
              "</td><td>" +
              csvData[1][3] +
              "</td></tr>";
            popupContent +=
              "<tr><td>" +
              csvData[0][6] +
              "</td><td>" +
              csvData[1][6] +
              "</td></tr>";
            popupContent +=
              "<tr><td>" +
              csvData[0][7] +
              "</td><td>" +
              csvData[1][7] +
              "</td></tr>";
            popupContent +=
              "<tr><td>" +
              csvData[0][8] +
              "</td><td>" +
              csvData[1][8] +
              "</td></tr>";
            popupContent +=
              "<tr><td>" +
              csvData[0][9] +
              "</td><td>" +
              csvData[1][9] +
              "</td></tr>";
          }

          // Close the table tag
          popupContent += "</table>";

          // Add buttons for adding and deleting rows
          popupContent +=
            '<button class="popup-button" onclick="Savedata()">Save</button>';
          popupContent +=
            '<button class="popup-button" onclick="SavetoKML()">Save to KML</button>';

          layer.bindPopup(popupContent).openPopup();
        } else {
          console.error("Error fetching CSV data:", response.error);
        }
      },
      error: function (error) {
        console.error("AJAX request failed:", error);
      },
    });
  });
});

function UpdateArea(geoJSON) {
  // Create a table for the popup
  var popupContent = '<table id="popup-table">';

  // Add the first row based on geometry type
  var geometryType = geoJSON.geometry.type;
  if (geometryType === "Polygon" || geometryType === "MultiPolygon") {
    var area = turf.area(geoJSON);
    var formattedArea = (area / 100).toFixed(2);
    popupContent +=
      "<tr><td>Area in M²</td><td>" + formattedArea + "</td></tr>";
  } else if (
    geometryType === "LineString" ||
    geometryType === "MultiLineString"
  ) {
    var lengthInMeter = turf.length(geoJSON).toFixed(2) * 1000;
    popupContent +=
      "<tr><td>Length in M</td><td>" + lengthInMeter + "</td></tr>";
  } else if (geometryType === "Point" || geometryType === "MultiPoint") {
    popupContent += "<tr><td>Point features</td><td></td></tr>";
  } else if (geometryType === "CircleMarker" || geometryType === "Circle") {
    var radius = layer.getRadius(); // Get the radius of the circle
    var area = Math.PI * Math.pow(radius, 2); // Calculate area for a circle
    var formattedArea = (area / 100).toFixed(2) + " m²";
    popupContent += "<tr><td>Area</td><td>" + formattedArea + "</td></tr>";
  }
  return popupContent;
}

function addRow() {
  var table = document.getElementById("popup-table");
  var newRow = table.insertRow(-1); // -1 appends a new row at the end of the table
  var cell1 = newRow.insertCell(0);
  var cell2 = newRow.insertCell(1);
  var input1 = document.createElement("input");
  var input2 = document.createElement("input");
  input1.type = "text";
  input1.placeholder = "Enter Data";

  input2.type = "text";
  input2.placeholder = "Enter Value";
  cell1.appendChild(input1);
  cell2.appendChild(input2);
}

// Define the deleteRow function
function deleteRow() {
  if (table.rows.length > 2) {
    table.deleteRow(-1);
    rowIndex--;
    alert("Delete Row button clicked!");
  }
}

function Savedata(lastDrawnPolylineId) {
  var geoJSONString = toGISformat();
  var geoJSONStringJson = JSON.parse(geoJSONString);
  let selectCoordinatesData = geoJSONStringJson.features;
  localStorage.setItem(
    "selectCoordinatesData",
    JSON.stringify(selectCoordinatesData)
  );

  var roadLenght = localStorage.getItem("roadLenght");
  var bufferWidth = localStorage.getItem("bufferWidth");
  var lastInsertedId = localStorage.getItem("lastInsertedId");

  var polylineLayerId = lastDrawnPolylineId; // You need to set this to the correct ID
  var bufferGeoJSONString = "{}";
  if (
    associatedLayersRegistry[polylineLayerId] &&
    associatedLayersRegistry[polylineLayerId].bufferLayer
  ) {
    var bufferLayer = associatedLayersRegistry[polylineLayerId].bufferLayer;
    bufferGeoJSONString = JSON.stringify(bufferLayer.toGeoJSON());
  }

  var payload = JSON.stringify({
    geoJSON: bufferGeoJSONString,
    roadLength: roadLenght,
    bufferWidth: bufferWidth,
    gis_id: lastInsertedId,
  });

  $.ajax({
    type: "POST",
    url: "APIS/gis_save.php",
    data: payload,
    contentType: "application/json",
    success: function (response) {
      console.log(response);
      window.location.href = "geometry_page.html";
    },
    error: function (xhr, status, error) {
      console.error("Save failed:", error);
    },
  });
}

function Savedata(lastDrawnPolylineId) {
  // Retrieve the GeoJSON representation of the buffer
  var bufferGeoJSON = {}; // Initialize as an empty object
  if (
    associatedLayersRegistry[lastDrawnPolylineId] &&
    associatedLayersRegistry[lastDrawnPolylineId].bufferLayer
  ) {
    bufferGeoJSON =
      associatedLayersRegistry[lastDrawnPolylineId].bufferLayer.toGeoJSON();

    // Define the style for the buffered line
    var bufferedLineStyle = {
      color: "#000000",
      weight: 4,
      opacity: 0.5,
      lineJoin: "round",
      dashArray: "10, 10", // Assuming you want the dashed line style
    };

    // Embed the style directly within the GeoJSON object
    bufferGeoJSON.properties = bufferGeoJSON.properties || {}; // Ensure properties exist
    bufferGeoJSON.properties.style = bufferedLineStyle;
  } else {
    console.error("Layer ID not found in registry.");
    return;
  }

  // Serialize the modified GeoJSON object to a string
  var bufferedGeoJSONString = JSON.stringify(bufferGeoJSON);

  // Prepare other relevant data
  var roadLength = localStorage.getItem("roadLength");
  var bufferWidth = localStorage.getItem("bufferWidth");
  var lastInsertedId = localStorage.getItem("lastInsertedId");

  // Construct the payload to include the styled buffered line's GeoJSON
  var payload = JSON.stringify({
    geoJSON: bufferedGeoJSONString,
    roadLength: roadLength,
    bufferWidth: bufferWidth,
    gis_id: lastInsertedId,
  });

  // AJAX request to the server to save the data
  $.ajax({
    type: "POST",
    url: "APIS/gis_save.php",
    data: payload,
    contentType: "application/json",
    success: function (response) {
      console.log("Styled buffered line saved successfully:", response);
      window.location.href = "geometry_page.html";
    },
    error: function (xhr, status, error) {
      console.error("Save failed:", error);
    },
  });
}

function SavetoKML() {
  var kmlContent = toKMLFormat(); // Get KML data
  var blob = new Blob([kmlContent], {
    type: "application/vnd.google-earth.kml+xml",
  }); // Set MIME type to KML

  // Create a download link for the KML file
  var a = document.createElement("a");
  a.href = window.URL.createObjectURL(blob);
  a.download = "output.kml"; // Set file extension to .kml

  // Append the link to the document and trigger a click event to start the download
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function toGISformat() {
  var table = document.getElementById("popup-table");

  // Create an object to hold the data
  var data = {};

  // Loop through the rows
  for (var i = 0; i < table.rows.length; i++) {
    var row = table.rows[i];

    // Get property name from the first column
    var propertyName = row.cells[0].textContent.trim();

    // Get value from the second column
    var inputElement = row.cells[1].querySelector("input");
    var propertyValue = inputElement
      ? inputElement.value
      : row.cells[1].textContent.trim();

    // Assign the property only if it has a valid name
    if (propertyName) {
      data[propertyName] = propertyValue;
    }
  }

  // console.log(data);

  // Get GeoJSON representation of the drawn layer
  var geoJSON = drawnItems.toGeoJSON();

  // Add properties data to GeoJSON features
  for (var k = 0; k < geoJSON.features.length; k++) {
    var feature = geoJSON.features[k];

    // Check if the feature has properties
    if (!feature.properties) {
      feature.properties = {};
    }

    // Assign the data properties to GeoJSON feature properties
    for (var key in data) {
      feature.properties[key] = data[key];
    }
  }

  // Convert GeoJSON to a string
  var geoJSONString = JSON.stringify(geoJSON, null, 2);
  return geoJSONString;
}

function toKMLFormat() {
  var table = document.getElementById("popup-table");
  var data = {};

  // Loop through the rows
  for (var i = 0; i < table.rows.length; i++) {
    var row = table.rows[i];
    var propertyName = row.cells[0].textContent.trim();
    var inputElement = row.cells[1].querySelector("input");
    var propertyValue = inputElement
      ? inputElement.value
      : row.cells[1].textContent.trim();

    if (propertyName) {
      data[propertyName] = propertyValue;
    }
  }

  // Initialize KML content with KML opening tag
  var kmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
  kmlContent += '<kml xmlns="http://www.opengis.net/kml/2.2">\n';
  kmlContent += "<Document>\n";

  // Loop through the features and add Placemark for each feature
  var geoJSON = drawnItems.toGeoJSON();
  for (var k = 0; k < geoJSON.features.length; k++) {
    var feature = geoJSON.features[k];
    kmlContent += "<Placemark>\n";
    kmlContent += "<name>" + (data["name"] || "Untitled") + "</name>\n"; // Set name for the Placemark
    kmlContent += "<description><![CDATA[\n";
    // Add property data to the description
    for (var prop in data) {
      kmlContent += "<b>" + prop + ":</b> " + data[prop] + "<br>\n";
    }
    kmlContent += "]]></description>\n";

    // Check if the feature is a LineString or Polygon
    if (feature.geometry.type === "LineString") {
      kmlContent += "<LineString>\n";
    } else if (feature.geometry.type === "Polygon") {
      kmlContent += "<Polygon>\n";
    }
    if (feature.geometry.type === "LineString") {
      kmlContent += "<coordinates>\n";
    } else if (feature.geometry.type === "Polygon") {
      kmlContent += "<outerBoundaryIs>\n<LinearRing>\n<coordinates>\n";
    }
    // Loop through coordinates of the geometry
    if (feature.geometry.type === "LineString") {
      var coordinates = feature.geometry.coordinates;
    } else if (feature.geometry.type === "Polygon") {
      var coordinates = feature.geometry.coordinates[0];
    }
    for (var i = 0; i < coordinates.length; i++) {
      kmlContent += coordinates[i][0] + "," + coordinates[i][1] + "\n";
    }
    if (feature.geometry.type === "LineString") {
      kmlContent += "</coordinates>\n";
    } else if (feature.geometry.type === "Polygon") {
      kmlContent += "</coordinates>\n</LinearRing>\n</outerBoundaryIs>\n";
    }
    if (feature.geometry.type === "LineString") {
      kmlContent += "</LineString>\n";
    } else if (feature.geometry.type === "Polygon") {
      kmlContent += "</Polygon>\n";
    }

    kmlContent += "</Placemark>\n";
  }

  // Close KML Document and KML tags
  kmlContent += "</Document>\n";
  kmlContent += "</kml>";

  return kmlContent;
}

//  Bottom Data table
$(document).ready(function () {
  var dataTable = null;
  var tableContainer = $("#table-container");

  $("#showTableBtn").click(function () {
    // If DataTable is already initialized, just show the table container
    if (dataTable) {
      tableContainer.slideDown();
      return;
    }

    $("#workTable tfoot th").each(function () {
      var title = $("#workTable thead th").eq($(this).index()).text();
      $(this).html(
        '<input type="text" class="form-control" placeholder="Search ' +
          title +
          '" />'
      );
    });

    $.ajax({
      url: "API-Responses/all-project-data.json",
      method: "GET",
      success: function (response) {
        var data = response.data.projectData;

        // Initialize DataTable if not already initialized
        dataTable = $("#workTable").DataTable({
          data: data.map(function (project) {
            return [
              project.project.name_of_work,
              project.project.work_type,
              project.project.created_date,
              getZoneNameById(
                project.project.constituency_zone_id,
                response.data.zoneData
              ),
              getWardNameById(
                project.project.constituency_ward_id,
                response.data.wardData
              ),
              "", // Assuming this is for Prabhag data
            ];
          }),
          columns: [
            { title: "Name of Work" },
            { title: "Work Type" },
            { title: "Work Completion Date" },
            { title: "Zone" },
            { title: "Ward" },
            { title: "Prabhag" },
          ],
        });

        // Filter event for each column
        dataTable
          .columns()
          .eq(0)
          .each(function (colIdx) {
            $("input", dataTable.column(colIdx).footer()).on(
              "keyup change",
              function () {
                dataTable.column(colIdx).search(this.value).draw();
              }
            );
          });

        // Show the table container
        tableContainer.slideDown();
      },
      error: function (xhr, status, error) {
        console.error("Error fetching data:", error);
      },
    });
  });

  // Add event listener to DataTable rows
  // Add event listener to DataTable rows
  $("#workTable tbody").on("click", "tr", function () {
    var data = dataTable.row(this).data();
    var nameOfWork = data[0]; // Assuming the first column contains the name of the work

    // Your logic to determine the coordinates of the highlighted area based on the clicked data
    var highlightedAreaCoordinates = [
      [18.532343, 73.917303],
      [18.526969, 73.926744],
      [18.533809, 73.928547],
      [18.532343, 73.917303], // Example coordinates, replace with your actual coordinates
    ];

    // Create a polygon layer representing the highlighted area and add it to the map
    var highlightedAreaLayer = L.polygon(highlightedAreaCoordinates, {
      color: "red",
      fillColor: "red",
      fillOpacity: 0.5,
    }).addTo(map);

    // Fit the map view to the bounds of the highlighted area
    map.fitBounds(highlightedAreaLayer.getBounds());
  });

  // Hide table on close button click
  $("#closeTableBtn").click(function () {
    tableContainer.slideUp();
  });
});

$(document).ready(function () {
  let allProjectData;

  $.ajax({
    url: "API-Responses/all-project-data.json",
    method: "GET",
    success: function (data) {
      allProjectData = data.data.projectData;
    },
    error: function (xhr, status, error) {
      console.error("Error fetching all project data:", error);
    },
  });

  $("#searchInput").autocomplete({
    minLength: 3,
    source: function (request, response) {
      let searchTerm = request.term;
      if (searchTerm.length >= 3) {
        let filteredData = allProjectData.filter(function (item) {
          let nameOfWorkMatch =
            item.project.name_of_work
              .toLowerCase()
              .indexOf(searchTerm.toLowerCase()) !== -1;
          let jeNameMatch =
            item.project.je_name
              .toLowerCase()
              .indexOf(searchTerm.toLowerCase()) !== -1;
          return nameOfWorkMatch || jeNameMatch;
        });
        let suggestions = filteredData.map((item) => item.project.name_of_work);
        suggestions = suggestions.slice(0, 10);
        response(suggestions);
      } else {
        response([]);
      }
    },
    select: function (event, ui) {
      $("#searchInput").val(ui.item.label);
      drawHighlightedArea(ui.item.label);
      return false;
    },
  });

  function drawHighlightedArea(nameOfWork) {
    let project = allProjectData.find(
      (item) => item.project.name_of_work === nameOfWork
    );

    if (project) {
      let allCoordinates = [];

      if (project.gis && Array.isArray(project.gis)) {
        project.gis.forEach((gisObject) => {
          if (gisObject.geometry) {
            let geometryCoordinates = JSON.parse(gisObject.geometry);
            allCoordinates = allCoordinates.concat(geometryCoordinates);
          }
        });
      }

      if (allCoordinates.length > 0) {
        let highlightedAreaCoordinates = allCoordinates;

        let highlightedAreaLayer = L.polygon(highlightedAreaCoordinates, {
          color: "red",
          fillColor: "transparent",
          fillOpacity: 0.1,
        }).addTo(map);

        map.fitBounds(highlightedAreaLayer.getBounds());
      }
    }
  }
});

function getZoneNameById(zoneId, zoneData) {
  var filteredZone = zoneData.filter(function (zone) {
    return zone.zone_id === zoneId;
  });

  if (filteredZone.length > 0) {
    return filteredZone[0].zone_name;
  } else {
    return "";
  }
}

function getWardNameById(wardId, wardData) {
  var filteredWard = wardData.filter(function (ward) {
    return ward.ward_id === wardId;
  });

  if (filteredWard.length > 0) {
    return filteredWard[0].ward_name;
  } else {
    return "";
  }
}

map.on("contextmenu", (e) => {
  let size = map.getSize();
  let bbox = map.getBounds().toBBoxString();
  let layer = "pmc:Data";
  let style = "pmc:Data";
  let urrr = `https://geo.geopulsea.com/geoserver/pmc/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=${layer}&STYLES&LAYERS=${layer}&exceptions=application%2Fvnd.ogc.se_inimage&INFO_FORMAT=application/json&FEATURE_COUNT=50&X=${Math.round(
    e.containerPoint.x
  )}&Y=${Math.round(e.containerPoint.y)}&SRS=EPSG%3A4326&WIDTH=${
    size.x
  }&HEIGHT=${size.y}&BBOX=${bbox}`;

  if (urrr) {
    fetch(urrr)
      .then((response) => response.json())
      .then((html) => {
        var htmldata = html.features[0].properties;
        let keys = Object.keys(htmldata);
        let values = Object.values(htmldata);
        let txtk1 = "";
        var xx = 0;
        for (let gb in keys) {
          txtk1 +=
            "<tr><td>" + keys[xx] + "</td><td>" + values[xx] + "</td></tr>";
          xx += 1;
        }

        let detaildata1 =
          "<div style='max-height: 350px;  overflow-y: scroll;'><table  style='width:70%;' class='popup-table' >" +
          txtk1 +
          "</td></tr><tr><td>Co-Ordinates</td><td>" +
          e.latlng +
          "</td></tr></table></div>";

        L.popup().setLatLng(e.latlng).setContent(detaildata1).openOn(map);
      });
  }
});

// function generateKML(coordinatesArray, featureData) {
//     // Extract feature propertie

//     var area = featureData.properties.Area;
//     var id = featureData.properties.ID;

//     var kml =`<?xml version="1.0" encoding="UTF-8"?>
//                 <kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
//                 <Document>
//                     <name>UPolygon.kml</name>
//                     <StyleMap id="m_ylw-pushpin">
//                         <Pair>
//                             <key>normal</key>
//                             <styleUrl>#s_ylw-pushpin</styleUrl>
//                         </Pair>
//                         <Pair>
//                             <key>highlight</key>
//                             <styleUrl>#s_ylw-pushpin_hl</styleUrl>
//                         </Pair>
//                     </StyleMap>
//                     <Style id="s_ylw-pushpin">
//                         <IconStyle>
//                             <scale>1.1</scale>
//                             <Icon>
//                                 <href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
//                             </Icon>
//                             <hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
//                         </IconStyle>
//                         <LineStyle>
//                             <color>ff00ff00</color>
//                             <width>5</width>
//                         </LineStyle>
//                         <PolyStyle>
//                             <color>80ffffff</color>
//                         </PolyStyle>
//                     </Style>
//                     <Style id="s_ylw-pushpin_hl">
//                         <IconStyle>
//                             <scale>1.3</scale>
//                             <Icon>
//                                 <href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
//                             </Icon>
//                             <hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
//                         </IconStyle>
//                         <LineStyle>
//                             <color>ff00ff00</color>
//                             <width>5</width>
//                         </LineStyle>
//                         <PolyStyle>
//                             <color>80ffffff</color>
//                         </PolyStyle>
//                     </Style>
//                     <Placemark>
//                         <name>Untitled Polygon</name>
//                         <styleUrl>#m_ylw-pushpin</styleUrl>
//                         <Polygon>
//                             <tessellate>1</tessellate>
//                             <outerBoundaryIs>
//                                 <LinearRing>
//                                     <coordinates>
//                                     ${coordinatesArray.join(' ')}
//                                     </coordinates>
//                                     </LinearRing>
//                                 </outerBoundaryIs>
//                             </Polygon>
//                             <description><![CDATA[
//                                 <p><b>Area:</b> ${area}</p>
//                                 <p><b>ID:</b> ${id}</p>
//                             ]]></description>
//                         </Placemark>
//                     </Document>
//                     </kml>`;
//     return kml;
// }
