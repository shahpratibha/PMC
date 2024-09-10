var departments = {};

// Define colors for each department
var departmentColors = {
    "Road": "#e53c3d",
    "Building": "#f05224", // orange
    "Electric": "#fcb300",
    "Drainage": "#218be6",
    "Water Supply": "#5155d4",
    "Garden": "#7e0488",
    "Garden Horticulture": "#7e0488",
    "Slum": "#bbb",
    "City Engineer Office": "#262626",
    "Education Department": "darkblue",
    "Environment": "#000000",
    "Project Work": "#5639b3",
    "Solid waste Management": "#49a44c",
    "Market":"yellow",
    "Encrochment": "#198754",
    "Sport":"#d63384",
    // Add more departments and colors as needed
};

// Function to create custom cluster icons with colors based on the department
function createClusterIcon(cluster) {
    var childCount = cluster.getChildCount();
    var childMarkers = cluster.getAllChildMarkers();

      // Calculate total tender_amount for the cluster
  var totalTenderAmountK = childMarkers.reduce(function (sum, marker) {
    return sum + (marker.feature.properties.Tender_Amount || 0);
}, 0);


var totalTenderAmountCr = totalTenderAmountK / 10000; 
    // var department = cluster.getAllChildMarkers()[0].feature.properties.Department;
    var department = childMarkers[0].feature.properties.Department;
    console.log(department,"department")
    var color = departmentColors[department] || 'lightpink'; // Default to green if department color is not found
    
    var zoomLevel = map.getZoom();
    var size = Math.max(Math.sqrt(childCount) * 5, 20); // Ensure a minimum size of 20px
    
    var adjustedSize = Math.min(totalTenderAmountCr, 70);// Adjust the divisor to scale size
    var dynamicSize = Math.min(size * (zoomLevel /5), adjustedSize); 
    // var adjustedColor = color; // You can customize color based on tender_amount if needed

  
    return L.divIcon({
      html: '<div class="bufferColor cluster-text" style="background-color: ' + color + '; width: ' + dynamicSize + 'px; height: ' + dynamicSize + 'px; line-height: ' + dynamicSize + 'px; font-size: 10px;">' + totalTenderAmountCr.toFixed(2) + ' Cr</div>',
      className: 'custom-cluster-icon',
      iconSize: [dynamicSize, dynamicSize] // Adjust the size based on dynamicSize
  });
}

// Function to load and process GeoJSON data

function loadAndProcessGeoJSON(main_url, layername, filter) {
  clearClusters(); // Clear previous clusters
// console.log("clreaeds")
  const urlm = `${main_url}ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${layername}&CQL_FILTER=${encodeURIComponent(filter)}&outputFormat=application/json`;
  console.log("GeoServer Request URL cluster:", urlm);

  $.getJSON(urlm, function (geojsonData) {
    //   console.log('GeoJSON Response:', geojsonData);

      try {
          if (!geojsonData.features || !Array.isArray(geojsonData.features)) {
              console.error('Invalid GeoJSON data structure:', geojsonData);
              return;
          }

          // Group features by department
          geojsonData.features.forEach(function (feature) {
              if (feature && feature.geometry && feature.properties && feature.properties.Department) {
                  var department = feature.properties.Department;
                  if (!departments[department]) {
                      departments[department] = L.markerClusterGroup({
                          iconCreateFunction: createClusterIcon
                      });
                  }

                  var processedFeatures = processFeature(feature);
                  if (processedFeatures.length) {
                      L.geoJSON(processedFeatures, {
                          pointToLayer: function (feature, latlng) {
                              var color = departmentColors[feature.properties.Department] || 'green'; // Default color
                              return L.marker(latlng, {
                                  icon: L.divIcon({
                                      className: 'custom-marker-icon',
                                      html: '<div style="background-color:' + color + '; width: 10px; height: 10px; border-radius: 50%;"></div>'
                                  })
                              });
                          }
                      }).addTo(departments[department]);
                  }
              }
          });

          // Add each department's marker cluster group to the map
          Object.keys(departments).forEach(function (department) {
              console.log('Adding layer for department15151:', department);
            //   console.log('Cluster group contains markers:', departments[department].getLayers().length);
              map.addLayer(departments[department]);
          });

      } catch (error) {
          console.error('Error processing GeoJSON data:', error);
      }
  })
  .fail(function (jqXHR, textStatus, errorThrown) {
      console.error('Error loading GeoJSON:', textStatus, errorThrown);
  });
}

function clearClusters() {
  Object.keys(departments).forEach(function (department) {
      if (map.hasLayer(departments[department])) {
          map.removeLayer(departments[department]);
      }
      departments[department].clearLayers();
  });
  departments = {}; // Reset the departments object
}

// function loadAndProcessGeoJSON(main_url, layername, filter) {
//   clearClusters(); 
//     // const urlm = `${main_url}ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${layername}&CQL_FILTER=${filter}&outputFormat=application/json`;
//     const urlm = `${main_url}ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${layername}&CQL_FILTER=${encodeURIComponent(filter)}&outputFormat=application/json`;
//     console.log("GeoServer Request URL cluster:", urlm,"filter",filter);

//     $.getJSON(urlm, function (geojsonData) {
//       console.log('GeoJSON Response:', geojsonData); 
//       try {
//         // Log the received data for debugging
//         // console.log('GeoJSON Response:', geojsonData);

//         if (!geojsonData.features || !Array.isArray(geojsonData.features)) {
//             console.error('Invalid GeoJSON data structure:', geojsonData);
//             return;
//         }

//       // if (!geojsonData.features || !Array.isArray(geojsonData.features)) {
//       //       console.error('Invalid GeoJSON data structure:', geojsonData);
//       //       return;
//       //   }

//         // Group features by department
//         geojsonData.features.forEach(function (feature) {
//             if (feature && feature.geometry && feature.properties && feature.properties.Department) {
//                 var department = feature.properties.Department;
//                 if (!departments[department]) {
//                     departments[department] = L.markerClusterGroup({
//                         iconCreateFunction: createClusterIcon
//                     });
//                 }
                
//                 var processedFeatures = processFeature(feature);
//                 if (processedFeatures.length) {
//                     L.geoJSON(processedFeatures, {
//                         pointToLayer: function (feature, latlng) {
//                             var color = departmentColors[feature.properties.Department] || 'green'; // Default to green if department color is not found
//                             return L.marker(latlng, {
//                                 icon: L.divIcon({
//                                     className: 'custom-marker-icon',
//                                     html: '<div style="background-color:' + color + '; width: 10px; height: 10px; border-radius: 50%;"></div>'
//                                 })
//                             });
//                         }
//                     }).addTo(departments[department]);
//                 }
//             }
//         });

//         // Add each department's marker cluster group to the map
//         Object.keys(departments).forEach(function (department) {
//           console.log('Adding layer for department:', department); // Debug statement
//           console.log('Cluster group contains markers:', departments[department].getLayers().length); // Debug statement
//           map.addLayer(departments[department]);
//         });
//       } catch (error) {
//         console.error('Error processing GeoJSON data:', error);
//     }
//     })
//     .fail(function (jqXHR, textStatus, errorThrown) {
//         console.error('Error loading GeoJSON:', textStatus, errorThrown);
//     });
    
// }
//   map.on('zoomend', function () {
//     // Recreate clusters to adjust size based on new zoom level
//     Object.keys(departments).forEach(function (department) {
//         departments[department].clearLayers(); // Clear existing clusters
//         // Reload the clusters
//         loadAndProcessGeoJSON(main_url, layername, cql_filter1);
//     });
// });

map.on('zoomend', function () {
  clearClusters();
  loadAndProcessGeoJSON(main_url, layername, cql_filter1);
});
// Function to process a single feature and return an array of processed features
function processFeature(feature) {
    switch (feature.geometry.type) {
        case 'LineString':
        case 'MultiLineString':
            var centroid = turf.centroid(feature);
            return [{
                type: 'Feature',
                geometry: centroid.geometry,
                properties: feature.properties
            }];
        case 'Polygon':
        case 'MultiPolygon':
            var centroid = turf.centroid(feature);
            return [{
                type: 'Feature',
                geometry: centroid.geometry,
                properties: feature.properties
            }];
        case 'Point':
            return [feature];
        case 'MultiPoint':
            return feature.geometry.coordinates.map(function (coords) {
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: coords
                    },
                    properties: feature.properties
                };
            });
        default:
            console.warn('Unsupported geometry type:', feature.geometry.type);
            return [];
    }
}


function clearClusters() {
  Object.keys(departments).forEach(function (department) {
      if (map.hasLayer(departments[department])) {
          map.removeLayer(departments[department]);
      }
      departments[department].clearLayers();
  });
  departments = {}; // Reset the departments object
}