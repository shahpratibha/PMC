var map, geojson;
const API_URL = "http://localhost/PMC/";
// const API_URL = "http://localhost/PMC-Project/";

//Add Basemap
var map = L.map("map", {}).setView([18.52, 73.895], 14, L.CRS.EPSG4326);

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
});

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
  "https://portal.geopulsea.com/geoserver/PMC/wms",
  {
    // layers: layerName,
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    attribution: "Final_Ward_PLU",
    opacity: 1,
  }
);

var wms_layer12 = L.tileLayer
  .wms("https://portal.geopulsea.com/geoserver/PMC/wms", {
    layers: "Final_Ward_PLU",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    attribution: "Final_Ward_PLU",
    opacity: 1,
  })
  .addTo(map);

var WMSlayers = {
  OpenStreetMap: osm,
  "Esri World Imagery": Esri_WorldImagery,
  "Google Satellite": googleSat,
  Final_Ward_PLU: wms_layer12,
};

var control = new L.control.layers(baseLayers, WMSlayers).addTo(map);

// FeatureGroup to store drawn items
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

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
// var layer;
map.on("draw:created", function (e) {
  const works_aa_approval_id = "856";
  var layer = e.layer;
  drawnItems.addLayer(layer);

  var geoJSON = layer.toGeoJSON();
  var popupContent = UpdateArea(geoJSON);
  $.ajax({
    // url: API_URL + "/process.php", // Path to the PHP script
    url: API_URL + "/API-Responses/all-project-data.json", // Path to the PHP script
    type: "GET",
    dataType: "json",
    success: function (response) {
      // if (response.success) {
      if (response.status === 200) {
        const responseData = response.data;
        const csvData = responseData.projectData.filter(
          (item) => item.project.works_aa_approval_id === works_aa_approval_id
        );

        const departmentData = responseData.depData.filter(
          (item) => item.department_id === csvData[0].project.d_id
        );

        const zoneData = responseData.zoneData.filter(
          (item) => item.zone_id === csvData[0].project.constituency_zone_id
        );

        const wardData = responseData.wardData.filter(
          (item) => item.ward_id === csvData[0].project.constituency_ward_id
        );

        if (csvData.length > 0) {
          popupContent +=
            "<tr><td>Name of work</td><td>" +
            csvData[0].project.name_of_work +
            "</td></tr>";
          popupContent +=
            "<tr><td>Department</td><td>" +
            departmentData[0].department_name +
            "</td></tr>";
          popupContent +=
            "<tr><td>ID</td><td>" +
            csvData[0].project.works_aa_approval_id +
            "</td></tr>";
          popupContent += "<tr><td>Lat-Long</td><td></td></tr>";
          popupContent +=
            "<tr><td>Scope of work</td><td>" +
            csvData[0].project.scope_of_work +
            "</td></tr>";
          popupContent +=
            "<tr><td>Work-type</td><td>" +
            csvData[0].project.work_type +
            "</td></tr>";
          popupContent +=
            "<tr><td>Zone</td><td>" + zoneData[0].zone_name + "</td></tr>";
          popupContent +=
            "<tr><td>Ward</td><td>" + wardData[0].ward_name + "</td></tr>";
          popupContent +=
            "<tr><td>Prabhag no.</td><td>" +
            csvData[0].project.constituency_prabhag_id +
            "</td></tr>";
          popupContent +=
            "<tr><td>Date of competition work</td><td>" +
            csvData[0].project.created_date +
            "</td></tr>";
          popupContent +=
            "<tr><td>JE Name</td><td>" +
            csvData[0].project.je_name +
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
        popupContent +=
          '<button class="popup-button" onclick="Savedata()">Save</button>';
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

function Savedata() {
  var geoJSONString = toGISformat();

  console.log(geoJSONString, "llllllllllllllllllllllll");
  $.ajax({
    type: "POST",
    url: "save.php",
    data: { geoJSON: geoJSONString },
    success: function (response) {
      console.log(response);
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
