var map, geojson;


//Add Basemap
var map = L.map("map", {
  center: [18.52, 73.89],
  zoom: 11,
  minZoom: 10,
  maxZoom: 19,
  zoomSnap: 0.5,
  zoomDelta: 0.5,
});

var googleSat = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
    maxZoom: 21,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);

var baseURL = "https://iwmsgis.pmc.gov.in/geoserver/pmc/wms";
// var demoURL ="https://iwmsgis.pmc.gov.in/geoserver/demo/wms";

var ward_boundary = L.tileLayer.wms(
  baseURL,
  {
    layers: "ward_boundary1",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    opacity: 1,
    maxZoom: 21,
  }
);

//pmc:PMC_wards_admin_boundary

var ward_admin_boundary = L.tileLayer.wms(
  baseURL,
  {
    layers: "PMC_wards_admin_boundary",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    opacity: 1,
    maxZoom: 21,
  }
).addTo(map);


var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

var wms_layer1 = L.tileLayer.wms(
  baseURL,
  {
    layers: "Roads",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  }
).addTo(map);


var Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 19.9,
  }
);
var baseLayers = {};



var wms_layer12 = L.tileLayer
  .wms(baseURL, {
    layers: "PMC_Boundary",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  }).addTo(map);





var wms_layer14 = L.tileLayer
  .wms(baseURL, {
    layers: "Data",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  });

var wms_layer15 = L.tileLayer
  .wms(baseURL, {
    layers: "Revenue",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  });

var wms_layer17 = L.tileLayer.wms(
  baseURL,
  {
    layers: "Village_Boundary",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    opacity: 1,
    maxZoom: 21,
  }
);
var wms_layer3 = L.tileLayer.wms(
  baseURL,
  {
    layers: "PMC_Layers",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  }
);



var IWMS_point = L.tileLayer
  .wms(baseURL, {
    layers: "IWMS_point",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    opacity: 1,
    maxZoom: 21,
  });

var IWMS_line = L.tileLayer
  .wms(baseURL, {
    layers: "IWMS_line",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  });

var wms_layer16 = L.tileLayer.wms(
  baseURL,
  {
    layers: "OSM_Road",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  }
);



var Zone_layer = L.tileLayer.wms(
  baseURL,
  {
    layers: "Zone_layer",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    opacity: 1,
    maxZoom: 21,
  }
);


// //////////////////////////added 11-03-2023/////////////////////////////////////////






var WMSlayers = {
  "OSM": osm,
  "Esri": Esri_WorldImagery,
  "Satellite": googleSat,
  Roads: wms_layer1,
  Boundary: wms_layer12,
  // Amenity: wms_layer11,
  // Drainage: wms_layer13,
  Data: wms_layer14,
  Revenue: wms_layer15,
  Village: wms_layer17,
  PMC: wms_layer3,
  // geodata: wms_layer4,
  OSMRoad: wms_layer16,
  ward_admin_boundary:ward_admin_boundary

};




// refreshWMSLayer();
var control = new L.control.layers(baseLayers, WMSlayers).addTo(map);
control.setPosition('topright');



// north image & scale
// You can also customize the scale options
L.control.scale().addTo(map);

var northArrowControl = L.Control.extend({
  options: {
    position: "bottomleft",
  },

  onAdd: function (map) {
    var container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
    container.innerHTML =
      // '<div class="north-arrow" ><i class="fas fa-long-arrow-alt-up p-1"  style="width: 20px; background-color:white;  height: 20px;"></i></div>';
      '<img  src="png/002-cardinal-point.png" alt="" style="width: 30px;  height:50px; border:2px solid darkblue; background:white; border-radius:5px;">';

    return container;
  },
});
map.addControl(new northArrowControl());

const lenght = getQueryParam('length') !== undefined ? getQueryParam('length') : 1.5;
const width = getQueryParam('width') !== undefined ? getQueryParam('width') : 10;
const lastInsertedId = getQueryParam('lastInsertedId');
const wardname = getQueryParam('wardName');
const department = getQueryParam('department');
const workType = getQueryParam('workType');
const struct_no = getQueryParam('struct_no') ;
const user_id = getQueryParam('user_id') ;
const worksAaApprovalId = getQueryParam('proj_id');
let wardNames = wardname.split(',').map(id => id.trim());
let ward_id =  getQueryParam('ward_id') ;
let zone_id =  getQueryParam('zone_id') ;
let prabhag_id =  getQueryParam('prabhag_id') ;
let editMode =  getQueryParam('edit') ;
let editId =  getQueryParam('editId') ;
var wardBoundary = null ;
var lastDrawnPolylineIdSave = null;
var geoserverUrl = "https://iwmsgis.pmc.gov.in/geoserver";
var workspace = "Road";
var legendVisible = true;
var processedLayers = [];
var legendControl = L.control({ position: "topright" });
var collapseButton = L.control({ position: "topright" });

let ward_ids = ward_id ? ward_id.split(',').filter(id => id && id !== 'null') : [];
let zone_ids = zone_id ? zone_id.split(',').filter(id => id && id !== 'null') : [];
let prabhag_ids = prabhag_id ? prabhag_id.split(',').filter(id => id && id !== 'null') : [];
let cql_filterm = '';

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}









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
  div.style.height = "40vh";
  div.style.width = "300px";
  div.style.overflowY = "auto";
  div.style.scrollbarWidth = "thin";
  div.style.backgroundColor = "white";
  div.style.border = "2px solid darkblue";
  div.style.borderRadius = "10px";
  div.style.padding = "10px";
  div.style.transition = "all 0.3s ease-in-out"; // Add transition for smooth animation

  // Toggle legend visibility function
  function toggleLegend() {
    if (legendVisible) {
      div.style.height = "0"; // Minimize the legend
      legendVisible = false;
    } else {
      div.style.height = "40vh"; // Maximize the legend
      legendVisible = true;
    }
  }

  // Add event listener to the legend control
  div.addEventListener('click', toggleLegend);

  return div;
};
// -----------------------------------------------------
// Add collapsible button

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
    if (
      legendDiv.style.height === "0px" || legendDiv.style.display === "none") {


      legendDiv.style.display = "block";
      legendDiv.style.height = "40vh";
      legendDiv.style.width = "200px";
      legendDiv.style.top ="9%";
      legendDiv.style.right ="3%";
      legendDiv.style.scrollbarWidth = "thin";
      legendDiv.style.scrollbarColor =  "#163140 white";
      // legendDiv.style.borderRadius= "20px";
      legendDiv.style.boxShadow = "5px 5px 5px rgba(0, 0, 0, 0.7)"; // Add shadow
      button.innerHTML = "<i class='fa-solid fa-list' style='color:darkblue;'></i>";

      button.style.backgroundColor = "white"; // Change color to indicate action
      legendVisible = true;
    } else {
      legendDiv.style.display = "none";
      button.innerHTML = "<i class='fa-solid fa-list' style='color:darkblue;'></i>";
      button.style.backgroundColor = "white"; // Change color to indicate action
      legendVisible = false;
    }
  };

  return button;
};

collapseButton.addTo(map);

// Create a legend control
var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend");

  // Initially hide the legend content
  div.style.display = "none";

  // Create a button to toggle the visibility of the legend content
  var toggleButton = L.DomUtil.create("button", "legend-toggle");
  toggleButton.innerHTML = "";
  toggleButton.style.backgroundColor = "transparent";

  toggleButton.onclick = function () {
    if (div.style.display === "none") {
      div.style.display = "block";
    } else {
      div.style.display = "none";
    }
  };
  div.appendChild(toggleButton);

  // Fetch capabilities to get all layers in the 'pmc' workspace
  fetch(
    "https://iwmsgis.pmc.gov.in//geoserver/ows?service=wms&version=1.3.0&request=GetCapabilities"
  )
    .then((response) => response.text())
    .then((data) => {
      // Parse capabilities XML response
      var parser = new DOMParser();
      var xml = parser.parseFromString(data, "text/xml");

      // Extract layer names and legend URLs for layers in the 'pmc' workspace
      var layers = xml.querySelectorAll('Layer[queryable="1"]');
      layers.forEach(function (layer) {
        var layerName = layer.querySelector("Name").textContent;
        if (layerName.startsWith("Road:")) {
          var legendUrl =
            this.geoserverUrl +
            "/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" +
            layerName;
          var layerParts = layerName.split(":"); // Split layer name by ":"
          var layerDisplayName = layerParts[layerParts.length - 1]; // Take the last part as the display name
          div.innerHTML +=
            "<p><strong>" +
            layerDisplayName +
            "</strong></p>" +
            '<img src="' +
            legendUrl +
            '" alt="' +
            layerDisplayName +
            ' legend"><br>';
        }
      });

      // Apply CSS to fit to bottom right, occupy 60% of screen height, and provide scrollbar
      div.style.position = "fixed";
      div.style.bottom = "0";
      div.style.right = "0";
      div.style.height = "60vh";
      div.style.width = "300px";
      div.style.overflowY = "auto";
      div.style.scrollbarWidth = "thin";
      div.style.backgroundColor = "white";
      div.style.border = "2px solid darkblue";
      // div.style.borderRadius = "10px";
      div.style.padding = "10px";
    })
    .catch((error) => {
      console.error("Error fetching capabilities:", error);
    });

  return div;
};

legend.addTo(map);
map.on('mousemove', function () {
  var legendDiv = document.querySelector(".info.legend");
  if (legendDiv.style.display === "block") {
    legendDiv.style.display = "none";
    var button = document.querySelector(".collapse-button");
    button.innerHTML = "<i class='fa-solid fa-list' style='color:darkblue;'></i>";
    button.style.backgroundColor = "white"; // Change color to indicate action
  }
});

// ---------------

// FeatureGroup to store drawn items
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

function fitbou(filter) {
  var layer = "pmc:PMC_wards_admin_boundary";
  var urlm =
    "https://iwmsgis.pmc.gov.in//geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
    layer +
    "&CQL_FILTER=" +
    filter +
    "&outputFormat=application/json";
    console.log(urlm)
  $.getJSON(urlm, function (data) {
    geojson = L.geoJson(data, {});
    wardBoundary = data;
    map.fitBounds(geojson.getBounds());
  });
}

if (editMode) {
  // edit id is coming as IWMS_line.11338
  // split the string and get the id
 let editIdTemp = editId.split(".")[1];
 let geometryTypeTemp = editId.split(".")[0];
  $.ajax({
      url: 'APIS/get_geometry_page_edit_layer.php', // Path to the PHP script
      type: 'GET',
      data: { id: editIdTemp, geometryType: geometryTypeTemp == 'IWMS_line' ? 'LineString' : geometryTypeTemp == 'IWMS_point' ? 'Point' : 'Polygon' },
      dataType: 'json',
      success: function (response) {
          const geometry = response.data;

          let coordinatesData = [];
          if (geometry.type == 'Polygon') {
              // Handle single Polygon
              coordinatesData.push(
                  L.polygon(geometry.coordinates[0].map((coord) => [coord[1], coord[0]]))
              );
          } else if (geometry.type === 'MultiPolygon') {
              // Handle MultiPolygon
              geometry.coordinates.forEach((polygonCoords) => {
                  coordinatesData.push(L.polygon(polygonCoords[0].map((coord) => [coord[1], coord[0]])));
              });
          } else if (geometry.type === 'LineString') {
              // Handle single LineString
              let coordinates = geometry.coordinates.map((coord) => [coord[1], coord[0]]);
              coordinatesData.push(L.polyline(coordinates, { color: 'red' }));
          } else if (geometry.type === 'MultiLineString') {
              // Handle MultiLineString
              geometry.coordinates.forEach((lineCoords) => {
                  let coordinates = lineCoords.map((coord) => [coord[1], coord[0]]);
                  coordinatesData.push(L.polyline(coordinates, { color: 'red' }));
              });
          }

          // Add polygons to the map and make them editable
          coordinatesData.forEach((layer) => {
            editableLayers.addLayer(layer); // Add to editable layers
         
            layer.on('click', function () {
                if (layer.editing) {
                    layer.editing.enable();
                    updatePopupEdit(layer);
                    layer.on('edit', function () {
                      updatePopupEdit(layer);
                    });
                }
            });
        });

          // Fit the map view to the bounds of the polygons
          if (coordinatesData.length > 0) {
              let bounds = coordinatesData.reduce((bounds, polygon) => {
                  return bounds.extend(polygon.getBounds());
              }, L.latLngBounds());
              map.fitBounds(bounds);
          }
      },
      error: function (error) {
          console.error('AJAX request failed:', error);
      },
  });
}

// Add edit event handler to save changes
map.on(L.Draw.Event.EDITED, function (event) {
  const layers = event.layers;
  layers.eachLayer(function (layer) {
      // Here you can save the updated geometry back to your server
      const updatedGeoJSON = layer.toGeoJSON();
      console.log('Updated geometry:', updatedGeoJSON);
      // Perform your AJAX call to save the updated geometry
  });
});








if (zone_ids.length > 0) {
  cql_filterm = `zone_id IN(${zone_ids.map(id => `'${id}'`).join(",")})`;
} else {
  console.log('No valid zone_id provided.');
}

// Add ward_id to the filter
if (ward_ids.length > 0) {
  cql_filterm += ` AND ward_id IN(${ward_ids.map(id => `'${id}'`).join(",")})`;
} else {
  console.log('No valid ward_id provided.');
}

// Add prabhag_id to the filter if any
if (prabhag_ids.length > 0) {
  cql_filterm += ` AND prabhag_id IN(${prabhag_ids.map(id => `'${id}'`).join(",")})`;
}
   
        fitbou(cql_filterm);
        ward_admin_boundary.setParams({
          cql_filter: cql_filterm,
          styles: "highlight",
        });
        ward_admin_boundary.addTo(map).bringToFront();





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




var drawControlRoad = new L.Control.Draw({
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
    polygon: false,

    circle: false,
    marker: false,
    rectangle: false,
    circlemarker: false
  },
  edit:false,
  //  {
  //   featureGroup: drawnItems,
  //   remove: true,
  // },
  drawcreate: function(e) {
    var layer = e.layer; // Get the drawn layer

    console.log(layer);
  }
});



if (workType == "New") {

  var customDrawControls = L.control({ position: 'topleft' });

  // Define the HTML content for the control
  customDrawControls.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'draw-control');
    div.innerHTML = '<button class="draw_feature" title="Draw New Feature"> <img src="png/006-drawing.png" style="width: 20px; height: 20px; padding:0px 3px;"></button>';
    customDrawControlsContainer = div;
    return div;
  };

  customDrawControls.addTo(map);

}


let mapMode = 'snapping';


var customSaveButton = L.control({ position: 'topleft' });

customSaveButton.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'save-button');
  div.innerHTML = '<button id="save-button" type="button"  title="Save Feature"> <i class="fa-regular fa-floppy-disk"></i> </button>';
  customDrawControlsContainer = div;
  return div;
};
customSaveButton.addTo(map);

// save data button 


var customSaveEditButton = L.control({ position: 'topleft' });
customSaveEditButton.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'saveDataButton');
  div.innerHTML = '<button id="saveDataButton" type="button"  title="Save Feature"> <i class="fa-regular fa-floppy-disk"></i></button>';
  customDrawControlsContainer = div;
  return div;
};
customSaveEditButton.addTo(map);

if(editMode){

var saveEditGeomButton = L.control({ position: 'topleft' });
saveEditGeomButton.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'saveEditGeomButton');
  div.innerHTML = '<button id="saveEditGeomButton" type="button"  title="Save Feature"> <i class="fa-regular fa-floppy-disk"></i></button>';
  customDrawControlsContainer = div;
  return div;
};


saveEditGeomButton.addTo(map);


document.getElementById('saveEditGeomButton').addEventListener('click', function () {
  let geojson = [];
  editableLayers.eachLayer(function (layer) {
      geojson.push(layer.toGeoJSON());
  });

  let editIdTemp = editId.split(".")[1];
  let geometryTypeTemp = editId.split(".")[0];

  $.ajax({
      url: 'APIS/Update_Geometry.php', // Path to your PHP save script
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ selectCoordinatesData: geojson,
        fid:editIdTemp,
        geometryType:
        geojson[0].geometry.type,
       }),
      success: function (response) {
        window.reload();
          alert('Data saved successfully!');
      },
      error: function (error) {
          console.error('Save request failed:', error);
      }
  });


  lenghtSelect = turf.length( geojson[0].geometry, { units: 'meters' }); 
  var formData = new FormData();
  formData.append('proj_id', worksAaApprovalId);
  formData.append('latitude',  geojson[0].geometry.coordinates[0][1]);
  formData.append('longitude',  geojson[0].geometry.coordinates[0][0]);
  formData.append('polygon_area', 0);
  formData.append('polygon_centroid', 0);
  formData.append('geometry', JSON.stringify(geojson[0].geometry.coordinates?.map(coordinates => coordinates.slice().reverse())));
  formData.append('road_no', struct_no);
  formData.append('user_id', user_id);
  formData.append('length', lenghtSelect);
  formData.append('width', width);

  $.ajax({
          type: "POST",
          url: "https://iwms.punecorporation.org/api/gis-data",
          data: formData,
          processData: false,
          contentType: false,
          success: function (response) {
         
            window.location.href = response.data.redirect_Url;
          },
          error: function (xhr, status, error) {
            console.error("Save failed:", error);
          },
        });


        });

     

//deleteEditGeomButton



var deleteEditGeomButton = L.control({ position: 'topleft' });
deleteEditGeomButton.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'deleteEditGeomButton');
  div.innerHTML = '<button id="deleteEditGeomButton" type="button"  title="Save Feature"> <i class="fa-regular fa-trash-alt"></i></button>';
  customDrawControlsContainer = div;
  return div;
};


deleteEditGeomButton.addTo(map);



document.getElementById('deleteEditGeomButton').addEventListener('click', function () {

  let editIdTemp = editId.split(".")[1];
  let geometryTypeTemp = editId.split(".")[0];

  $.ajax({
      url: 'APIS/Delete_Geometry.php', // Path to your PHP save script
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        fid:editIdTemp,
        geometryType: geometryTypeTemp == 'IWMS_line' ? 'LineString' : geometryTypeTemp == 'IWMS_point' ? 'Point' : 'Polygon',
       }),
      success: function (response) {
          alert('Data Deleted successfully!');
      },
      error: function (error) {
          console.error('Save request failed:', error);
      }
  });
});
}



var customEditLayerButton = L.control({ position: 'topleft' });

customEditLayerButton.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'editFeatureButton');
  div.innerHTML = '<img id="editFeatureButton"  title=" Edit Feature" src="png/editTool.png" >';
  customDrawControlsContainer = div;
  return div;
};


customEditLayerButton.addTo(map);



var customDeleteLayerButton = L.control({ position: 'topleft' });

customDeleteLayerButton.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'deleteFeatureButton');
  div.innerHTML = '<button id="deleteFeatureButton"  title="Delete Feature"> <i class="fa-solid fa-trash-can"></i></button>';
  customDrawControlsContainer = div;
  return div;
};


customDeleteLayerButton.addTo(map);


function enableEditing(layer) {
  console.log(layer);
  drawnItems.eachLayer(function (otherLayer) {
    if (otherLayer !== layer && otherLayer.editing && otherLayer.editing.enabled()) {
      otherLayer.editing.disable();
    }
  });
  var edit = new L.EditToolbar.Edit(map, {
    featureGroup: L.featureGroup([layer]), // Create a new feature group containing only the selected layer
    remove: true
  });
  edit.enable();
}



if (workType == "New") {
  // Currently selected layer for editing
  // Custom button for toggling edit mode
  var editControl = L.control({ position: 'topleft' });
  editControl.onAdd = function (map) {

    var controlDiv = L.DomUtil.create('div', 'leaflet-control-edit leaflet-bar leaflet-control');

    var controlUI = L.DomUtil.create('a', 'leaflet-control-edit-interior', controlDiv);
    controlUI.title = 'Edit features';
    controlUI.href = '#';
    controlUI.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    
    controlUI.style.display = 'none'

    L.DomEvent.addListener(controlUI, 'click', function (e) {
      L.DomEvent.preventDefault(e);

      // Disable all layers' editing mode first
      drawnItems.eachLayer(function (layer) {
        if (layer.editing && layer.editing.enabled()) {
          layer.editing.disable();
        }
      });

      // Enable editing mode on click if not enabled
      if (!map.editEnabled) {
        alert("Please select a feature to edit.");
        map.editEnabled = true;
        controlUI.innerHTML = '<i class="fa-regular fa-floppy-disk"></i>';
        // Allow user to click on a feature to select and edit
        drawnItems.eachLayer(function (layer) {
          layer.on('click', function () {
            layer.setStyle({ color: 'green', weight: 7 });

            enableEditing(layer); // Enable editing on the clicked layer
          });
        });
      } else {
        map.editEnabled = false;
        controlUI.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        // Remove click handlers to disable selection
        drawnItems.eachLayer(function (layer) {
          layer.setStyle({ color: 'red', weight: 7 });
          layer.off('click');
        });
      }
    });

    return controlDiv;
  };

  editControl.addTo(map);

  var selectedPolylineId = null;


  var deleteControl = L.control({ position: 'topleft' });

  deleteControl.onAdd = function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar');
    var button = L.DomUtil.create('button', 'delete-button', container);
    button.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    button.title = "Delete  Feature";

    button.onclick = function () {
      if (selectedPolylineId) {
        handleDeletePolyline(selectedPolylineId._leaflet_id);
        selectedPolylineId = null;  // Reset selected polyline ID after deletion
        button.style.backgroundColor = 'white';
      } else {
        alert("Please select a feature to delete.");
        button.style.backgroundColor = 'red';
        drawnItems.eachLayer(function (layer) {
          layer.on('click', function () {
            console.log("hello")
            selectedPolylineId = layer;
            layer.setStyle({ color: 'green', weight: 7 });

          });
        });
      }
    };

    return container;
  };


  deleteControl.addTo(map);
}

function handleDeletePolyline(polylineId) {
  console.log(polylineId);
  removeAssociatedLayers(polylineId);
}



function toggleEditDeleteButton(show) {
  var saveBtns = document.getElementsByClassName('delete-button');
  var editBtn = document.getElementsByClassName('leaflet-control-edit-interior');
  for (let i = 0; i < saveBtns.length; i++) {
    saveBtns[i].style.display = show ? 'block' : 'none';
    editBtn[i].style.display = show ? 'block' : 'none';
  }
}



function toggleSaveButton(show) {
  var saveBtn = document.getElementById('save-button');
  if (saveBtn) {
    saveBtn.style.display = show ? 'block' : 'none';
    
  }
}


// Button Click Event to Show SweetAlert Success Popup
document.getElementById("save-button").addEventListener("click", function () {

  Swal.fire({
    icon: 'success',
    title: 'Success',
    text: 'Your feature has been saved successfully!',
    customClass: {
      popup: 'my-custom-popup', // Custom class for the popup
      title: 'my-custom-title', // Custom class for the title
      content: 'my-custom-text' // Custom class for the text
    }
  });
});

var isDrawControlAdded = false;


// toggleDrawControl();

function toggleDrawControl() {
  if (isDrawControlAdded) {
    map.removeControl(drawControlRoad);
    isDrawControlAdded = false;
  } else {
    map.addControl(drawControlRoad);
    isDrawControlAdded = true;

  }
}

// Event listener for map zoomend event
//map.on("zoomend", toggleDrawControl);

if (workType == "New") {
document.querySelector('.draw_feature').addEventListener('click', function (event) {
  event.preventDefault();
  // Toggle draw control when the "Draw Feature" button is clicked

  if (map.getZoom() > 15) {
    toggleDrawControl();

  } else {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Oops...",
      text: "Zoom In to 200 m zoom range",
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        popup: "custom-modal-class",
        icon: "custom-icon-class",
        title: "custom-title-class",
        content: "custom-text-class",
        closeButton: "custom-close-button-class",
      },
      showClass: {
        popup: "swal2-show",
        backdrop: "swal2-backdrop-show",
        icon: "swal2-icon-show",
      },
      hideClass: {
        popup: "swal2-hide",
        backdrop: "swal2-backdrop-hide",
        icon: "swal2-icon-hide",
      },
      didOpen: () => {
        // Apply custom styles directly to the modal elements
        document.querySelector(".custom-modal-class").style.width = "400px"; // Set your desired width
        document.querySelector(".custom-modal-class").style.height = "250px"; // Set your desired height
        document.querySelector(".custom-modal-class").style.transition = "all 0.5s ease";
        document.querySelector(".custom-icon-class").style.fontSize = "10px"; // Set your desired icon size
        document.querySelector(".custom-icon-class").style.transition = "all 0.5s ease";
        document.querySelector(".custom-title-class").style.fontSize =
          "1.5em"; // Set your desired title size
        document.querySelector(".custom-text-class").style.fontSize = "1em"; // Set your desired text size
        document.querySelector(
          ".custom-close-button-class"
        ).style.backgroundColor = "#f44336"; // Red background color
        document.querySelector(".custom-close-button-class").style.color =
          "white"; // White text color
        document.querySelector(
          ".custom-close-button-class"
        ).style.borderRadius = "0"; // Rounded corners
        document.querySelector(".custom-close-button-class").style.padding =
          "5px"; // Padding around the close button
        document.querySelector(".custom-close-button-class").style.fontSize =
          "20px"; // Font size of the close button
      },
    });

  }
});
}


document.querySelector('#save-button').addEventListener('click', function (event) {
  Savedata(lastDrawnPolylineIdSave);
});


// function for added buffer

var associatedLayersRegistry = {};

function createBufferAndDashedLine(polylineLayer, roadLength, bufferWidth) {
  var geoJSON = polylineLayer.toGeoJSON();
  var halfBufferWidth = bufferWidth / 2;
  var buffered = createRectangularBuffer(geoJSON, halfBufferWidth, "meters");

  
 
  var bufferLayer = L.geoJSON(buffered, {
    style: {
      color: "#000000",
      weight: 4,
      opacity: 0.5,
      lineJoin: "miter",
    },
    interactive: false
  }).addTo(map);

  var dashedLineLayer = L.geoJSON(geoJSON, {
    style: {
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      dashArray: "10, 10",
      lineJoin: "miter",
    },
    interactive: false
  }).addTo(map);

  // Store references to the associated layers
  associatedLayersRegistry[polylineLayer._leaflet_id] = {
    bufferLayer: bufferLayer,
    dashedLineLayer: dashedLineLayer,
    polylineLayer: polylineLayer
  };

  // Attach an event listener to update these layers when the polyline is edited
  polylineLayer.on('edit', function () {
    updateAssociatedLayers(polylineLayer._leaflet_id, bufferWidth);
  });
}


function createRectangularBuffer(geoJSON, bufferWidth, units) {
  if (!geoJSON || !geoJSON.geometry || !geoJSON.geometry.coordinates) {
      console.error("Invalid GeoJSON format or empty GeoJSON");
      return null;
  }

  var coords = geoJSON.geometry.coordinates;
  var leftCoords = [];
  var rightCoords = [];

  for (var i = 0; i < coords.length - 1; i++) {
      var start = turf.point(coords[i]);
      var end = turf.point(coords[i + 1]);
      var line = turf.lineString([start.geometry.coordinates, end.geometry.coordinates]);

      var leftOffsetLine = turf.lineOffset(line, bufferWidth, { units: units });
      var rightOffsetLine = turf.lineOffset(line, -bufferWidth, { units: units });

      var leftStart = turf.getCoords(leftOffsetLine)[0];
      var leftEnd = turf.getCoords(leftOffsetLine)[1];
      var rightStart = turf.getCoords(rightOffsetLine)[0];
      var rightEnd = turf.getCoords(rightOffsetLine)[1];

      if (i === 0) {
          leftCoords.push(leftStart);
          rightCoords.push(rightStart);
      }

      leftCoords.push(leftEnd);
      rightCoords.push(rightEnd);

      // Handle the intersections at turns
      if (i < coords.length - 2) {
          var nextStart = turf.point(coords[i + 1]);
          var nextEnd = turf.point(coords[i + 2]);
          var nextLine = turf.lineString([nextStart.geometry.coordinates, nextEnd.geometry.coordinates]);

          var nextLeftOffsetLine = turf.lineOffset(nextLine, bufferWidth, { units: units });
          var nextRightOffsetLine = turf.lineOffset(nextLine, -bufferWidth, { units: units });

          var nextLeftStart = turf.getCoords(nextLeftOffsetLine)[0];
          var nextRightStart = turf.getCoords(nextRightOffsetLine)[0];

          var intersectionLeft = turf.lineIntersect(leftOffsetLine, nextLeftOffsetLine);
          var intersectionRight = turf.lineIntersect(rightOffsetLine, nextRightOffsetLine);

          if (intersectionLeft.features.length > 0) {
              leftCoords.push(intersectionLeft.features[0].geometry.coordinates);
          } else {
              leftCoords.push(nextLeftStart);
          }

          if (intersectionRight.features.length > 0) {
              rightCoords.push(intersectionRight.features[0].geometry.coordinates);
          } else {
              rightCoords.push(nextRightStart);
          }
      }

      if (i === coords.length - 2) {
          leftCoords.push(leftEnd);
          rightCoords.push(rightEnd);
      }
  }

  // Reverse rightCoords and merge with leftCoords
  rightCoords.reverse();
  var bufferedCoords = leftCoords.concat(rightCoords);

  // Ensure the polygon is closed by adding the first coordinate at the end
  if (bufferedCoords.length > 0) {
      bufferedCoords.push(bufferedCoords[0]);
  }

  var bufferedPolygon = turf.polygon([bufferedCoords]);
  return turf.featureCollection([bufferedPolygon]);
}



function updateAssociatedLayers(polylineId, bufferWidth) {
  var layers = associatedLayersRegistry[polylineId];
  if (layers) {
    var updatedGeoJSON = layers.polylineLayer.toGeoJSON();
    var halfBufferWidth = bufferWidth / 2;

  
    var newBuffered = createRectangularBuffer(updatedGeoJSON, halfBufferWidth, "meters");;
    layers.bufferLayer.clearLayers(); // Remove the old buffer
    layers.bufferLayer.addData(newBuffered); // Add the new buffer

    // Update the dashed line to match the new polyline geometry
    layers.dashedLineLayer.clearLayers();
    layers.dashedLineLayer.addData(updatedGeoJSON);
  }
}

function removeAssociatedLayers(layerId) {
  console.log(layerId);
  var associatedLayers = associatedLayersRegistry[layerId];
  console.log(associatedLayersRegistry);
  if (layerId) {
    drawnItems.removeLayer(layerId);
  }
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
  return intersectionPercentage <= 10;
}

function getWFSUrl() {
  const geoserverBaseUrl = "https://iwmsgis.pmc.gov.in//geoserver/pmc/ows"; // Adjust this URL to your GeoServer OWS endpoint
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

  return overlapPercentage <= 10;
}

// tracing tool




// Function to calculate distance between two points
function closestVertex(point, lineCoordinates) {
  console.log(lineCoordinates)

  // Initialize variables to store the closest vertex and its distance
  var closestVertex = null;
  var closestDistance = Infinity;

  // Iterate over line vertices
  lineCoordinates.forEach(function (coord) {
    // console.log(coord,"coord")
    var vertex = L.latLng(coord.lat, coord.lng);
    // console.log(vertex,"vertex,",point,"point")
    var dist = distance(vertex, point);
    if (dist < closestDistance) {
      closestVertex = vertex;
      closestDistance = dist;
    }
  });

  var result = {
    lat: closestVertex.lat,
    lng: closestVertex.lng,
    distance: closestDistance
  };

  console.log("Closest vertex:", closestVertex);
  console.log("Distance:", closestDistance);

  return result

}


function distance(latlng1, latlng2) {
  var latlng1Rad = L.latLng(latlng1.lat, latlng1.lng).toBounds(10).getCenter();
  var latlng2Rad = L.latLng(latlng2.lat, latlng2.lng).toBounds(10).getCenter();
  return latlng1Rad.distanceTo(latlng2Rad);
}


// for vertex mapping

let firstClickPoints = [];

function getClosestRoadPointTrace(latlng) {
  var buffer = 10; // Buffer distance in meters
  var clickedPoint = latlng;
  var bufferedPoint = turf.buffer(turf.point([clickedPoint.lng, clickedPoint.lat]), buffer, { units: 'meters' });
  var bbox = turf.bbox(bufferedPoint);
  layer = "pmc:Exist_Road";

  var url = `https://iwmsgis.pmc.gov.in//geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${layer}&outputFormat=application/json&bbox=${bbox.join(',')},EPSG:4326`;
  console.log("burl", url);
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        firstClickPoints = data;
        console.log(data);
        //  highlightFeature(data);
        var closestPoint = null;
        var closestPointv = null;
        var distance = Infinity;
        if (data.features && data.features.length > 0) {
          var geometry = data.features[0].geometry;
          var flattenedCoordinates = geometry.coordinates.reduce((acc, val) => acc.concat(val), []);
          var line = flattenedCoordinates.map(coord => L.latLng(coord[1], coord[0]));
          // closestPointL = L.GeometryUtil.closestLayerSnap(map, [line], clickedPoint,50,true);
         // closestPoint = L.GeometryUtil.closest(map, line, clickedPoint);
          closestPointv = closestVertex(clickedPoint, line)
          // (lat,lng,distance)
          console.log(closestPoint, "closestPoint", closestPointv, "closestPointv")

          distance = turf.distance(turf.point([clickedPoint.lng, clickedPoint.lat]), turf.point([closestPointv.lng, closestPointv.lat]), { units: 'meters' });
        }
        resolve({ marker: closestPointv, distance: distance, data });
      })
      .catch(error => {
        console.error('Error:', error);
        reject(error);
      });
  });
}




function getClosestRoadPoint(latlng) {
  var buffer = 10; // Buffer distance in meters
  var clickedPoint = latlng;
  var bufferedPoint = turf.buffer(turf.point([clickedPoint.lng, clickedPoint.lat]), buffer, { units: 'meters' });
  var bbox = turf.bbox(bufferedPoint);
  layer = "pmc:Exist_Road";

  var url = `https://iwmsgis.pmc.gov.in//geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${layer}&outputFormat=application/json&bbox=${bbox.join(',')},EPSG:4326`;
  console.log("burl", url);
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        var closestPoint = null;
        var closestPointv = null;
        var distance = Infinity;
        if (data.features && data.features.length > 0) {
          var geometry = data.features[0].geometry;
          var flattenedCoordinates = geometry.coordinates.reduce((acc, val) => acc.concat(val), []);
          var line = flattenedCoordinates.map(coord => L.latLng(coord[1], coord[0]));
          // closestPointL = L.GeometryUtil.closestLayerSnap(map, [line], clickedPoint,50,true);
//          closestPoint = L.GeometryUtil.closest(map, line, clickedPoint);
          closestPointv = closestVertex(clickedPoint, line)
          // (lat,lng,distance)
          console.log(closestPoint, "closestPoint", closestPointv, "closestPointv")

          distance = turf.distance(turf.point([clickedPoint.lng, clickedPoint.lat]), turf.point([closestPointv.lng, closestPointv.lat]), { units: 'meters' });
        }
        resolve({ marker: closestPointv, distance: distance });
      })
      .catch(error => {
        console.error('Error:', error);
        reject(error);
      });
  });
}



function highlightFeature(featureData) {
  console.log(featureData);
  // Check if any features are present in the featureData
  if (!featureData || !featureData.features || featureData.features.length === 0)
    // Clear existing editable layers
    editableLayers.clearLayers();

  // Get the first feature from the featureData
  var feature = featureData.features[0];

  var geojsonLayer = L.geoJSON(feature, {
    style: {
      color: 'red',
      weight: 3,
      opacity: 1,
      fillOpacity: 0.5,
    },
  });

  editableLayers.addLayer(geojsonLayer);

  // if (editableLayers.getLayers().length > 0) {
  //   map.fitBounds(editableLayers.getBounds());
  // }
}

// for snapping tool

var lastPointMarker = null;

function getClosestRoadPointLast(latlng) {
  console.log(latlng);
  var buffer = 10; // Buffer distance in meters, adjust as necessary
  var clickedPoint = latlng;
  var bufferedPoint = turf.buffer(turf.point([clickedPoint.lng, clickedPoint.lat]), buffer, { units: 'meters' });
  var bbox = turf.bbox(bufferedPoint);
  let layer = "pmc:Exist_Road";
  var url = `https://iwmsgis.pmc.gov.in//geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${layer}&outputFormat=application/json&bbox=${bbox.join(',')},EPSG:4326`;

  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (lastPointMarker) {
          map.removeLayer(lastPointMarker);
          lastPointMarker = null;
        }

        if (data.features && data.features.length > 0) {
          var geometry = data.features[0].geometry;
          var flattenedCoordinates = geometry.coordinates.reduce((acc, val) => acc.concat(val), []);
          var line = flattenedCoordinates.map(coord => L.latLng(coord[1], coord[0]));
          var closestPoint = L.GeometryUtil.closest(map, line, clickedPoint);



          var distance = turf.distance(turf.point([clickedPoint.lng, clickedPoint.lat]), turf.point([closestPoint.lng, closestPoint.lat]), { units: 'meters' });

          if (distance <= 20) {
            var rectangleIcon = L.divIcon({
              className: 'custom-rectangle-icon',
              html: '<div style="width: 7px; height: 7px; background-color: white; border: 1px solid black;"></div>',
              iconSize: [7, 7]
            });


            lastPointMarker = L.marker(closestPoint, { icon: rectangleIcon }).addTo(map);
            lastPointMarker.distance = distance;
          }
        }

        resolve({ marker: lastPointMarker, distance: lastPointMarker ? lastPointMarker.distance : Infinity });
      })
      .catch(error => {
        console.error('Error:', error);
        reject(error);
      });
  });
}


let lastDrawnPoint = null;
let drawTimeout = null;
let currentDrawLayer;
let vertexClickCount = 0;


let traceLayer = L.layerGroup().addTo(map);
let currentPolyline;


map.on("draw:drawvertex", function (e) {
  vertexClickCount++;
  for (const key in e.layers._layers) {
    if (e.layers._layers.hasOwnProperty(key)) {
      const layer = e.layers._layers[key];
      const originalLatlng = layer._latlng;
      getClosestRoadPoint(originalLatlng).then(result => {
        if (result && result.distance <= 20.0000) {
          layer._latlng.lat = result.marker.lat;
          layer._latlng.lng = result.marker.lng;
          layer.setLatLng(result.marker);
        }
      });
    }
  }
});


map.on("draw:editvertex", function (e) {
  for (const key in e.layers._layers) {
    if (e.layers._layers.hasOwnProperty(key)) {
      const layer = e.layers._layers[key];
      const originalLatlng = layer._latlng;
      getClosestRoadPoint(originalLatlng).then(result => {
        if (result && result.distance <= 20.0000) {
          layer._latlng.lat = result.marker.lat;
          layer._latlng.lng = result.marker.lng;
          layer.setLatLng(result.marker);
        }
      });
    }
  }

});



function checkIfInsideWard(latlng) {
  var point = turf.point([latlng.lng, latlng.lat]);
  var isInside = false;

  wardBoundary.features.forEach(function(feature) {
    if (turf.booleanPointInPolygon(point, feature)) {
      isInside = true;
    }
  });

  return isInside;
}

var drawControlAdded = false;

map.on('mousemove', function(e) {
  var isInside = checkIfInsideWard(e.latlng);
  
 if (isInside && workType == "New") {
        map.getContainer().style.cursor = 'crosshair';
        // Add draw control if not already added
        if (!drawControlAdded) {
          map.addControl(drawControlRoad);
          drawControlAdded = true;
        }
      } else if (workType == "New") {
        map.getContainer().style.cursor = 'not-allowed';
        // Remove draw control if currently added
        if (drawControlAdded) {
          map.removeControl(drawControlRoad);
          drawControlAdded = false;
        }
      }
    
});



map.on('draw:drawstart', function (e) {
  // toggleSaveButton(false);
  vertexClickCount = 0;
  currentDrawLayer = e.layer;
  map.on('mousemove', handleMouseMove);

  currentPolyline = L.polyline([], { color: 'red' }).addTo(drawnItems);
});

map.on('draw:drawstop', function () {
  vertexClickCount = 0;
  if (drawTimeout) clearTimeout(drawTimeout);
  map.off('mousemove', handleMouseMove);
});


map.on('draw:editstart', function (e) {
  // toggleSaveButton(false);
  currentDrawLayer = e.layer;
  map.on('mousemove', handleMouseMove);
});

map.on('draw:editstop', function () {
  if (drawTimeout) clearTimeout(drawTimeout);
  map.off('mousemove', handleMouseMove);
});

map.on('draw:deleted', function (e) {

  e.layers.eachLayer(function (layer) {

    removeAssociatedLayers(layer._leaflet_id);


  });

  traceLayer.clearLayers();

  // Reset the currentPolyline variable to null to ensure it doesn't retain any old reference
  if (currentPolyline) {
    currentPolyline.remove(); // Removes the polyline from the map
    currentPolyline = null;   // Dereferences the polyline object
  }

});



function handleMouseMove(event) {
  if (throttle) return;

  throttle = true;
  setTimeout(() => {
    throttle = false;
  }, 300); // Adjust the 100 ms here to change the throttling rate

  if (mapMode === 'tracing' && vertexClickCount > 0) {
    if (!currentPolyline) return;
    let newPoint = event.latlng;
    getClosestRoadPointTrace(newPoint).then(result => {
      if (result.distance <= 50) {
        if (vertexClickCount === 1) {
          currentPolyline.addLatLng(result.marker);
          vertexClickCount++;
        } else {
          const lastPoint = currentPolyline.getLatLngs().slice(-1)[0];
          console.log(turf.distance(turf.point([lastPoint.lng, lastPoint.lat]), turf.point([result.marker.lng, result.marker.lat]), { units: 'meters' }));
         
          currentPolyline.addLatLng(result.marker);
          currentPolyline.redraw();
        }
      }
    });
  } else if (mapMode === 'snapping') {
    if (drawTimeout) clearTimeout(drawTimeout);
    lastDrawnPoint = event.latlng;
    drawTimeout = setTimeout(() => {
    getClosestRoadPointLast(lastDrawnPoint);
    }, 100); // Adjust the delay as needed
  }
}

let throttle = false; // Throttling flag to control event frequency




map.on("draw:created", function (e) {


  toggleSaveButton(true);

  toggleEditDeleteButton(true);

  if (mapMode == 'snapping') {
    var newFeature = e.layer.toGeoJSON();

    //var isInsideWard = checkIfInsideWard(newFeature, ward_boundary);

    //console.log(isInsideWard);

    getGeodataFeatures().then(function (geodataFeatures) {
      var isAllowed = checkOverlapWithGeodata(newFeature, geodataFeatures);

      if (isAllowed) {
        // Add the feature to the map if overlap is 10% or less
        // drawnItems.addLayer(e.layer);
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Oops...",
          text: "Road overlaps more than 10% with existing Road.",
          showConfirmButton: false,
          showCloseButton: true,
          
          customClass: {
            popup: "custom-modal-class",
            icon: "custom-icon-class",
            title: "custom-title-class",
            content: "custom-text-class",
            closeButton: "custom-close-button-class",
          },
          showClass: {
            popup: "swal2-show",
            backdrop: "swal2-backdrop-show",
            icon: "swal2-icon-show",
          },
          hideClass: {
            popup: "swal2-hide",
            backdrop: "swal2-backdrop-hide",
            icon: "swal2-icon-hide",
          },
          didOpen: () => {
            // Apply custom styles directly to the modal elements
            document.querySelector(".custom-modal-class").style.width = "400px"; // Set your desired width
            document.querySelector(".custom-modal-class").style.height = "250px"; // Set your desired height
            document.querySelector(".custom-modal-class").style.transition = "all 0.5s ease";
            document.querySelector(".custom-icon-class").style.fontSize = "10px"; // Set your desired icon size
            document.querySelector(".custom-icon-class").style.fontSize = "10px"; // Set your desired icon size
            
            document.querySelector(".custom-icon-class").style.transition = "all 0.5s ease";
            document.querySelector(".custom-title-class").style.fontSize =
              "1.5em"; // Set your desired title size
            document.querySelector(".custom-text-class").style.fontSize = "1em"; // Set your desired text size
            document.querySelector(
              ".custom-close-button-class"
            ).style.backgroundColor = "#f44336"; // Red background color
            document.querySelector(".custom-close-button-class").style.color =
              "white"; // White text color
            document.querySelector(
              ".custom-close-button-class"
            ).style.borderRadius = "0"; // Rounded corners
            document.querySelector(".custom-close-button-class").style.padding =
              "5px"; // Padding around the close button
            document.querySelector(".custom-close-button-class").style.fontSize =
              "20px"; // Font size of the close button
          },
        });
        return;
      }
    });
    if (e.layerType === "polyline") {
      var length = turf.length(e.layer.toGeoJSON(), { units: "kilometers" });
      var roadLenght = lenght;
      if (length > roadLenght) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Oops...",
          text: `The Road is longer than ${roadLenght} kilometers. Please draw a shorter Road.`,
          showConfirmButton: false,
          showCloseButton: true,
          customClass: {
            popup: 'custom-modal-class',
            icon: 'custom-icon-class',
            title: 'custom-title-class',
            content: 'custom-text-class',
            closeButton: 'custom-close-button-class'
          },
          showClass: {
            popup: 'swal2-show',
            backdrop: 'swal2-backdrop-show',
            icon: 'swal2-icon-show'
          },
          hideClass: {
            popup: 'swal2-hide',
            backdrop: 'swal2-backdrop-hide',
            icon: 'swal2-icon-hide'
          },
          didOpen: () => {
            // Apply custom styles directly to the modal elements
            document.querySelector('.custom-modal-class').style.width = '400px'; // Set your desired width
            document.querySelector('.custom-modal-class').style.height = '250px'; // Set your desired height
            document.querySelector('.custom-icon-class').style.fontSize = '10px'; // Set your desired icon size
            document.querySelector('.custom-title-class').style.fontSize = '1.5em'; // Set your desired title size
            document.querySelector('.custom-text-class').style.fontSize = '1em'; // Set your desired text size
            document.querySelector('.custom-close-button-class').style.backgroundColor = '#f44336'; // Red background color
            document.querySelector('.custom-close-button-class').style.color = 'white'; // White text color
            document.querySelector('.custom-close-button-class').style.borderRadius = '0'; // Rounded corners
            document.querySelector('.custom-close-button-class').style.padding = '5px'; // Padding around the close button
            document.querySelector('.custom-close-button-class').style.fontSize = '20px'; // Font size of the close button
          }
        });

        return; // Stop further processing
      }
    }
    var layer = e.layer;


    drawnItems.addLayer(layer);



    if (e.layerType === "polyline") {
      var bufferWidth = width;
      createBufferAndDashedLine(layer, roadLenght, bufferWidth);
    }
    nearestPointsStorage = []; // Reset the storage for the next drawing

    var geoJSON = layer.toGeoJSON();
    var popupContent = UpdateArea(geoJSON);

    var lastDrawnPolylineId = layer._leaflet_id;
    lastDrawnPolylineIdSave = layer._leaflet_id;
    $.ajax({
      // url: API_URL + "/process.php", // Path to the PHP script
      url: API_URL + "APIS/Get_Conceptual_Form.php", // Path to the PHP script
      type: "GET",
      data: { id: lastInsertedId },
      dataType: "json",
      success: function (response) {
        $('#table-container').show();
        const formDataFromStorage = response.data;
        console.log(formDataFromStorage);
        let contentData = '<tr>';
        for (const property in formDataFromStorage) {
          if (formDataFromStorage[property] !== null) {  // Check for null value
            contentData += `<tr><th>${property}</th><td>${formDataFromStorage[property]}</td></tr>`;
        }
        }
        contentData += '</tr>';
        $('#workTableData').html(contentData);

      },
      error: function (error) {
        console.error("AJAX request failed:", error);
      },
    });
  }
  else if (mapMode == 'tracing') {
    let layer = currentPolyline;
    var bufferWidth = width;
    createBufferAndDashedLine(layer, roadLenght, bufferWidth);
    nearestPointsStorage = []; // Reset the storage for the next drawing

    var geoJSON = layer.toGeoJSON();
    var popupContent = UpdateArea(geoJSON);
    var lastDrawnPolylineId = layer._leaflet_id;
    lastDrawnPolylineIdSave = layer._leaflet_id;

    $.ajax({
      // url: API_URL + "/process.php", // Path to the PHP script
      url: API_URL + "APIS/Get_Conceptual_Form.php", // Path to the PHP script
      type: "GET",
      data: { id: lastInsertedId },
      dataType: "json",
      success: function (response) {
        $('#table-container').show();
        const formDataFromStorage = response.data;
        console.log(formDataFromStorage);
        let contentData = '<tr>';
        for (const property in formDataFromStorage) {
          // contentData += `<tr><th>${property}</th><td>${formDataFromStorage[property]}</td></tr>`;
          if (formDataFromStorage[property] !== null) {  // Check for null value
            contentData += `<tr><th>${property}</th><td>${formDataFromStorage[property]}</td></tr>`;
        }
        }
        contentData += '</tr>';
        $('#workTableData').html(contentData);
      },
      error: function (error) {
        console.error("AJAX request failed:", error);
      },
    });
  }

});



map.on("draw:edited", function (e) {
  toggleSaveButton(true);
  e.layers.eachLayer(function (layer) {
    var geoJSON = layer.toGeoJSON();
    var popupContent = UpdateArea(geoJSON);
    var roadLenght = lenght;
    var bufferWidth = width;

    // Check for and remove existing associated layers
    removeAssociatedLayers(layer._leaflet_id);

    if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
      createBufferAndDashedLine(layer, roadLenght, bufferWidth);
    }
    var lastDrawnPolylineId = layer._leaflet_id;
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
            `
          <button class="popup-button" onclick="Savedata('${lastDrawnPolylineId}')">Save</button>
      `;
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
  }
}

function Savedata(lastDrawnPolylineId) {
  var geoJSONString;
  let selectCoordinatesData;
  var geoJSONStringJson;
  var area = 0; // Initialize area variable
  var centroid = 0 ;

  if (mapMode == 'tracing') {
      geoJSONString = currentPolyline ? JSON.stringify(currentPolyline.toGeoJSON()) : '{}';
      geoJSONStringJson = JSON.parse(geoJSONString);
      selectCoordinatesData = [geoJSONStringJson];

      if (currentPolyline) {
          area = turf.area(geoJSONStringJson); 
          console.log(area);
      }
     
  } else {
      geoJSONString = toGISformat();
      geoJSONStringJson = JSON.parse(geoJSONString);
      selectCoordinatesData = geoJSONStringJson.features;

    
      if (geoJSONStringJson.features && geoJSONStringJson.features.length > 0) {
        const geometry = geoJSONStringJson.features[1].geometry;
        if (geometry.type === "Polygon") {
            area = turf.area(geoJSONStringJson.features[1]);
        } else if (geometry.type === "LineString") {
            area = turf.length(geoJSONStringJson.features[1], { units: 'meters' }); 
        }
    }
     
  }

  console.log(area);

  localStorage.setItem("selectCoordinatesData", JSON.stringify(selectCoordinatesData));
  let formDataTemp = localStorage.getItem("conceptual_form_data_temp");
  if (formDataTemp) {
      localStorage.setItem("conceptual_form_data", formDataTemp);
  }
   
// have to check and remote this code in future 


selectCoordinatesData.forEach((geom, index) => {
  


  if (geom.geometry.type === "Polygon") {
    area = turf.area(geom);
} else if (geom.geometry.type === "LineString") {
    area = turf.length(geom, { units: 'meters' }); 
}



  var roadLenght = lenght;
  var bufferWidth = width;

  var polylineLayerId = lastDrawnPolylineId; 
  var bufferGeoJSONString = "{}";
  if (associatedLayersRegistry[polylineLayerId] && associatedLayersRegistry[polylineLayerId].bufferLayer) {
      var bufferLayer = associatedLayersRegistry[polylineLayerId].bufferLayer;
      bufferGeoJSONString = JSON.stringify(bufferLayer.toGeoJSON());
  }

  var payload = JSON.stringify({
      geoJSON: bufferGeoJSONString,
      roadLength: roadLenght,
      bufferWidth: bufferWidth,
      gis_id: lastInsertedId,
      department: department, 
      selectCoordinatesData: geom,
      area: area ,
      geometryType: geom.geometry.type
  });

 
if (editMode) {



  let editIdTemp = editId.split(".")[1];
  let geometryTypeTemp = editId.split(".")[0];

  console.log('selectCoordinatesData', selectCoordinatesData);

  $.ajax({
      url: 'APIS/Update_Geometry.php', // Path to your PHP save script
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ selectCoordinatesData: selectCoordinatesData,
        fid:editIdTemp,
        geometryType:
        selectCoordinatesData[selectCoordinatesData.length - 1].geometry.type,
       }),
      success: function (response) {
          alert('Data saved successfully!');
      },
      error: function (error) {
          console.error('Save request failed:', error);
      }
  });


}else {
  $.ajax({
    type: "POST",
    url: "APIS/gis_save.php",
    data: payload,
    contentType: "application/json",
    success: function (response) {

     //  window.location.href = `geometry_page.html?id=` + response.lastInsertIdIWMS + `&department=Road` + `&lastInsertedId=` + lastInsertedId;
    },
    error: function (xhr, status, error) {
        console.error("Save failed:", error);
    },
});


}



  var formData = new FormData();
  formData.append('proj_id', worksAaApprovalId);
  formData.append('latitude', geom.geometry.coordinates[0][1]);
  formData.append('longitude', geom.geometry.coordinates[0][0]);
  formData.append('polygon_area', 0);
  formData.append('polygon_centroid', 0);
  formData.append('geometry', JSON.stringify(geom.geometry.coordinates?.map(coordinates => coordinates.slice().reverse())));
  formData.append('road_no', struct_no);
  formData.append('user_id', user_id);
  formData.append('length', area);
  formData.append('width', width);

  
  $.ajax({
      type: "POST",
      url: "https://iwms.punecorporation.org/api/gis-data",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
          console.log(response);
         window.location.href = response.data.redirect_Url;
      },
      error: function (xhr, status, error) {
          console.error("Save failed:", error);
      },
  });
  
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
  for (var i = 0; i < table?.rows.length; i++) {
    var row = table?.rows[i];

    // Get property name from the first column
    var propertyName = row?.cells[0]?.textContent.trim();

    // Get value from the second column
    var inputElement = row?.cells[1]?.querySelector("input");
    var propertyValue = inputElement
      ? inputElement.value
      : row?.cells[1]?.textContent.trim();

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

