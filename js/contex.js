var map, geojson;


// var layers = ["pmc:Data", "pmc:Roads", "pmc:Reservations"]
//Pop-Up show
const layerDetails = {
    "pmc:Data": ["works_aa_a", "name_of_wo", "departme_1",  "work_type", "Project_Office", "zone_id", "zone", "ward", "tender_amo", "je_name", "contact_no"],
    "pmc:Exist_Road": ["rid", "surveystatus", "roadclass",  "swd_condition"],
    "pmc:Reservations": ["OBJECTID_1", "Broad_LU", "Decision",  "Area"],
    "pmc:storm_water": ["OBJECTID", "basin_name", "category",  "descriptio", "i_length"],
    "pmc:Sewage1": ["OBJECTID", "STP_Name", "STP_Area",  "Category", "Unique_ID"],
    "pmc:Sewage_Treatment_Plant": ["OBJECTID", "STP_Name", "STP_Area",  "Category", "Unique_ID"],
    "pmc:Pumping_station": ["OBJECTID", "Unique_ID", "SPS_Name"],
  
  };
  
  map.on("contextmenu", async (e) => {
    let bbox = map.getBounds().toBBoxString();
    let size = map.getSize();
  
    for (let layer in layerDetails) {
        let selectedKeys = layerDetails[layer];
        let urrr = `https://iwmsgis.pmc.gov.in//geoserver/pmc/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=${layer}&STYLES&LAYERS=${layer}&exceptions=application%2Fvnd.ogc.se_inimage&INFO_FORMAT=application/json&FEATURE_COUNT=50&X=${Math.round(e.containerPoint.x)}&Y=${Math.round(e.containerPoint.y)}&SRS=EPSG%3A4326&WIDTH=${size.x}&HEIGHT=${size.y}&BBOX=${bbox}`;
  
        try {
            let response = await fetch(urrr);
            let html = await response.json();
  
            var htmldata = html.features[0].properties;
            let txtk1 = "";
            for (let key of selectedKeys) {
                if (htmldata.hasOwnProperty(key)) {
                    let value = htmldata[key];
                    txtk1 += "<tr><td>" + key + "</td><td>" + value +"</td></tr>";
                }
            }
  
            let detaildata1 = "<div style='max-height: 350px; max-height: 250px;'><table  style='width:110%;' class='popup-table' >" + txtk1 + "</td></tr><tr><td>Co-Ordinates</td><td>" + e.latlng + "</td></tr></table></div>";
  
            L.popup().setLatLng(e.latlng).setContent(detaildata1).openOn(map);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
  });
  
  // thi line is added\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  
  // thi line is added\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\