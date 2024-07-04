var main_url = "https://iwmsgis.pmc.gov.in/geoserver/"

function toggleFilter(div) {
  const input = div.querySelector('.filter-input');
  const ul = div.querySelector('ul');
  const isActive = input.classList.contains('active');


  document.querySelectorAll('.filter-input').forEach(input => {
    input.classList.remove('active');
    input.nextElementSibling.classList.remove('active');
  });

  if (!isActive) {
    input.classList.add('active');
    ul.classList.add('active');
  }
}

// Function to filter checkboxes based on search input
function filterCheckboxes(input) {
  const filter = input.value.toLowerCase();
  const ul = input.nextElementSibling;
  const li = ul.getElementsByTagName('li');

  for (let i = 0; i < li.length; i++) {
    const text = li[i].textContent || li[i].innerText;
    if (text.toLowerCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
document.addEventListener('DOMContentLoaded', function () {
  // Add event listeners to filter inputs
  document.querySelectorAll('.filter-input').forEach(input => {
    input.addEventListener('input', function (event) {
      event.stopPropagation(); // Stop event propagation
      filterCheckboxes(this);
    });
    // Stop event propagation for click events on the input element
    input.addEventListener('click', function (event) {
      event.stopPropagation(); // Stop event propagation
    });
    // Stop event propagation for mousedown events on the input element to prevent the div from closing
    input.addEventListener('mousedown', function (event) {
      event.stopPropagation(); // Stop event propagation
    });
  });

  // Add event listeners to checkboxes to stop propagation
  document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('click', function (event) {
      event.stopPropagation(); // Stop event propagation
    });
  });


});

// toggleFilterend---------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const filters = document.getElementById('filters');
  const map = document.getElementById('map');
  const tableBtn = document.getElementById('openTableBtn');
  const button = document.getElementById('toggleFilters');
  let filtersVisible = false;

  button.addEventListener('click', function () {
    if (!filtersVisible) {
      filters.style.marginLeft = '0';
      filters.style.opacity = '1';
      map.style.width = '81vw';
      button.style.top = "15vh";
      button.style.right = 'calc(1.3vw + 1px)';
      button.innerHTML = '<i class="fa-solid fa-filter-circle-xmark"></i>';
      tableBtn.style.right = 'calc(1.3vw + 1px)';
      tableBtn.style.top = '22vh';
      
    } else {
      filters.style.marginLeft = '-35vw';
      filters.style.opacity = '0';
      map.style.width = '100vw';
      button.style.top = "15vh";
      // button.style.right = '40px';
      button.style.right = '10px';
      button.innerHTML = '<i class="fa-solid fa-filter"></i>';
      tableBtn.style.right = '40px';
      tableBtn.style.top = '22vh';
      tableBtn.style.right = '10px';
    }
    filtersVisible = !filtersVisible;
  });
  // -------------------------------------------------------------------------


  // accordation clicking activity


  var acc = document.getElementsByClassName("accordion-header");
  for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }
});
// accordation Filter


$(document).ready(function () {
  var start = moment().subtract(29, 'days');
  var end = moment();

  $('#daterange').daterangepicker({
    opens: 'left',
    locale: {
      format: 'MMMM D, YYYY' 
    },
    startDate: start,
    endDate: end,
    ranges: {
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      '2021-2022': [moment('2021-04-01'), moment('2022-03-31')],
      '2022-2023': [moment('2022-04-01'), moment('2023-03-31')],
      '2023-2024': [moment('2023-04-01'), moment('2024-03-31')]
    }
  }, cb);

  cb(start, end);

  function cb(start, end) {
    $('#daterange').val(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    console.log('Selected date range: ' + start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    var cql_filter1 = `Created_At >= '${start}' AND Created_At < '${end}'`
    console.log(cql_filter1)
  }
  loadinitialData();
  getCheckedValues(function (filterString) {
    FilterAndZoom(filterString);
    console.log("Filter String:", filterString);
  });
});



function populateDropdown(dropdownId, data) {
  var ul = $("#" + dropdownId);
  ul.empty();

  data.forEach(function (item) {
    var listItem = $('<li><label><input type="checkbox" class="select2-option-checkbox" value="' + item + '"> ' + item + '</label></li>');
    ul.append(listItem);
  });
}



function loadinitialData() {
  const filternames = ["Project_Office", "project_fi", "zone", "ward", "Department", "stage", "village", "Work_Type"]
  // Function to load project offices
  console.log(filternames, "project_fi")

  filternames.forEach(
    function (filtername) {
      url = `${main_url}pmc/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=IWMS_line&propertyName=${filtername}&outputFormat=application/json`;
      console.log(url)
      $.getJSON(url,
        function (data) {
          var projectFiSet = new Set();

          // Iterate through the features and add non-null values to the set
          $.each(data.features, function (index, feature) {
            // console.log(feature.properties,"project_fi")
            var column_name = feature.properties[filtername];
            // console.log(column_name,"project_fi")
            if (column_name !== null && column_name !== "#N/A") {
              projectFiSet.add(column_name);
            }
          });

          var uniqueProjectFiSet = Array.from(projectFiSet);
          // console.log(uniqueProjectFiSet, "uniqueProjectFiSet");
          populateDropdown(filtername, uniqueProjectFiSet);


        }
      );
    })
}

function getCheckedValues(callback) {
  var selectedValues = {};
  const filternames = ["Project_Office", "project_fi", "zone", "ward", "Department", "stage", "village", "Work_Type"];
  
  filternames.forEach(function(filtername) {
    selectedValues[filtername] = []; // Initialize empty array for each filtername

    $('#' + filtername).on('click', 'input[type="checkbox"]', function(event) {
      event.stopPropagation(); // Prevent the event from bubbling up to the parent

      var values = []; // Local array to collect current filtername's selected values

      // Iterate through checked checkboxes and collect their values
      $('#' + filtername + ' input[type="checkbox"]:checked').each(function() {
        var single_val = $(this).val();
        if (single_val) {
          values.push(single_val);
        }
      });

      // Update selectedValues for the current filtername
      selectedValues[filtername] = values;

      // Construct filter strings for all filter names
      var filters = [];
      for (var key in selectedValues) {
        if (selectedValues[key].length > 0) {
          filters.push(`${key} IN ('${selectedValues[key].join("','")}')`);
        }
      }

      // Join all filter strings with "AND"
      var filterString = filters.join(" AND ");

      // Update the selected count in the label
      var label = $('label[for="' + filtername + '"]');
      if (label.length > 0) {
        label.find('.selected-count').text(' (' + values.length + ')');
      }

      // Call the callback function with filterString
      if (typeof callback === 'function') {
        callback(filterString);
      }
    });
  });
}

// Function to toggle the filter panel
function toggleFilter(element) {
  var filterGroup = $(element).closest('.filter-group');
  filterGroup.find('ul').toggle();
}



function FilterAndZoom(filter) {
  fitbous(filter)
  IWMS_point.setParams({
    CQL_FILTER: filter,
    maxZoom: 19.5,
  }).addTo(map);
  IWMS_polygon.setParams({
    CQL_FILTER: filter,
    maxZoom: 19.5,
  }).addTo(map);
  IWMS_line.setParams({
    CQL_FILTER: filter,
    maxZoom: 19.5,
  }).addTo(map);
};


function fitbous(filter) {
  var layers = ["pmc:IWMS_point", "pmc:IWMS_line", "pmc:IWMS_polygon"];
  var bounds = null;

  var processLayer = function (layerName, callback) {
    var urlm =
      main_url + "ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
      layerName +
      "&CQL_FILTER=" +
      filter +
      "&outputFormat=application/json";

    $.getJSON(urlm, function (data) {
      var geojson = L.geoJson(data);
      var layerBounds = geojson.getBounds();
      if (bounds) {
        bounds.extend(layerBounds);
      } else {
        bounds = layerBounds;
      }
      callback();
    });
  };

  var layersProcessed = 0;
  layers.forEach(function (layerName) {
    processLayer(layerName, function () {
      layersProcessed++;
      if (layersProcessed === layers.length) {
        // Apply the combined bounds to the map after all layers are processed
        if (bounds) {
          map.fitBounds(bounds);
        }
      }
    });
  });
}

$(document).ready(function () {
  var columns = [
    "Work_ID",
    "Name_of_Work",
    "Scope_of_Work",
    "Name_of_JE",
    "length",
  ];

  var select = document.getElementById("search_type");

  // Populate dropdown with column names
  for (var i = 0; i < columns.length; i++) {
    var option = document.createElement("option");
    option.text = columns[i];
    option.value = columns[i];
    select.appendChild(option);
  }

  // Event listener for dropdown change
  $("#search_type").change(function () {
    var selectedValue = $(this).val();

    function getValues(callback) {
      var geoServerURL =
        "https://iwmsgis.pmc.gov.in/geoserver/pmc/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=IWMS_line,IWMS_point,IWMS_polygon&propertyName=" + selectedValue + "&outputFormat=application/json";
      console.log(geoServerURL, "geoServerURLsearch");

      $.getJSON(geoServerURL, function (data) {
        var workTypeSet = new Set();

        // Populate the Set with work types
        $.each(data.features, function (index, feature) {
          var workType = feature.properties[selectedValue];

          // Convert number (double) values to strings
          if (typeof workType === 'number') {
            workType = workType.toString();
          }

          workTypeSet.add(workType);
        });

        // Convert the Set to an array
        var uniqueWorkTypes = Array.from(workTypeSet);
        console.log(uniqueWorkTypes, "uniqueWorkTypes");

        // Convert the array to the required format
        var formattedData = uniqueWorkTypes.map(function (item) {
          return { label: item, value: item };
        });

        // Call the callback function with the formatted data
        callback(formattedData);
      });
    }

    // Call getValues function and initialize autocomplete
    getValues(function (data) {
      console.log("Initializing autocomplete with data:", data);  // Debugging statement

      // Ensure the input element exists
      if ($("#searchInputDashboard").length) {
        $("#searchInputDashboard").autocomplete({
          source: data,
          select: function (event, ui) {
            var selectedValue1 = ui.item.value;

            var searchtypefield = $("#search_type").val();
            console.log(searchtypefield, "searchtypefield", "selectedValue1", selectedValue1);
            let cqlFilter;

            // Handle number (double) values in filter condition
            if (!isNaN(selectedValue1)) {
              // Use as is for number values in CQL_FILTER
              cqlFilter = `${searchtypefield} = ${selectedValue1}`;
            } else {
              // Enclose string values in quotes for CQL_FILTER
              cqlFilter = `${searchtypefield} = '${selectedValue1}'`;
            }

            var layers = ["pmc:IWMS_point", "pmc:IWMS_line", "IWMS_polygon"];
            var typeName = layers.join(',');

            var geoServerURL =
              "https://iwmsgis.pmc.gov.in/geoserver/pmc/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=" +
              typeName +
              "&outputFormat=application/json&CQL_FILTER=" +
              encodeURIComponent(cqlFilter);

            tableData(typeName, geoServerURL, cqlFilter);

            // Apply filter to IWMS_point, IWMS_line, and IWMS_polygon layers
            IWMS_point.setParams({
              CQL_FILTER: cqlFilter,
              maxZoom: 19.5,
              styles: "IWMS_points"
            });

            IWMS_line.setParams({
              CQL_FILTER: cqlFilter,
              maxZoom: 19.5,
              styles: "line"
            });

            IWMS_polygon.setParams({
              CQL_FILTER: cqlFilter,
              maxZoom: 19.5,
              styles: "IWMS_polygon"
            });

            // Add layers to map and perform other actions
            IWMS_point.addTo(map).bringToFront();
            IWMS_line.addTo(map).bringToFront();
            IWMS_polygon.addTo(map).bringToFront();
            fitbous(cqlFilter);
          }
        });
      } else {
        console.error("Element with id 'searchInputDashboard' not found.");
      }
    });
  });
});

/////////////////   // search butoon implemented   //////////////////////////////////////////////



function loadAdminWardNameAndFilter() {
  loadAdminWardName();
  filterDataAndDrawMap();
}

function loadVillagesAndFilter() {
  loadVillages();
  filterDataAndDrawMap();
}

function loadDepartmentsAndFilter() {
  loadDepartments();
  filterDataAndDrawMap();
}
function loadStagesAndFilter() {
  loadStage();
  filterDataAndDrawMap();
}
function loadWorkTypesAndFilter() {
  loadWorkTypes();
  filterDataAndDrawMap();
}

function printData() {
  const table = $('#workTableDashboard').DataTable();
  const totalRecords = table.page.info().recordsTotal;
  const pages = Math.ceil(totalRecords / table.page.info().length);

  let csvContent = "data:text/csv;charset=utf-8,";
  let headers = [];

  // Get table headers
  table.columns().every(function () {
    headers.push($(this.header()).text());
  });
  csvContent += headers.join(",") + "\n";

  // Iterate through each page
  for (let i = 0; i < pages; i++) {
    table.page(i).draw(false); // Move to page i

    // Get data from the current page
    table.rows().every(function () {
      const rowData = [];
      $(this.node()).find('td').each(function () {
        rowData.push($(this).text().trim());
      });
      csvContent += rowData.join(",") + "\n";
    });
  }

  // Restore to the first page
  table.page(0).draw(false);

  // Create a link to download the CSV file
  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", "data.csv");
  document.body.appendChild(link);

  // Trigger click event to start download
  link.click();

  // Remove the link after the download starts
  document.body.removeChild(link);
}



function tableData(typeName, geoServerURL, cqlFilter) {

  var openTable = $(document).ready(function () {
    // Function to toggle table visibility
    $("#openTableBtn").click(function () {
      var tableContainer = $("#table-container-dashboard");
      var isOpen = tableContainer.css("display") !== "none";
      if (isOpen) {
        tableContainer.hide(); // Hide the table if it's already open
      } else {
        tableContainer.show(); // Show the table if it's closed
      }
    });


    $.getJSON(geoServerURL, function (data) {
      filteredData = data;

      var totalcountofselectedrecords = filteredData.totalFeatures;
      var totalTenderAmount = filteredData.features.reduce(function (total, project) {
        var tenderAmount = parseFloat(project.properties.Tender_Amount);
        return total + (isNaN(tenderAmount) ? 0 : tenderAmount / 100000);
      }, 0);



      var project = data.features;
      const pageSize = 100; // Number of items per page
      let currentPage = 1; // Current page number

      function updateTable(project, page) {
        const tableBody = document.getElementById('workTableDashboard').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';

        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const currentPageData = project.slice(startIndex, endIndex);

        currentPageData.forEach(project => {
          var tenderAmount = parseFloat(project.properties.Tender_Amount);
          tenderAmount = isNaN(tenderAmount) ? 0 : tenderAmount / 100000;

          const row = `
        <tr data-coordinates='${JSON.stringify(project.geometry)}'>
            <td>${project.properties.zone}</td>
            <td>${project.properties.ward}</td>
            <td>${project.properties.Department}</td>
            <td>${project.properties.Work_Type}</td>
            <td>${tenderAmount}</td>
            <td>${project.properties.Name_of_JE}</td>
            <td>${project.properties.Agency}</td>
            <td>${project.properties.Project_Office}</td>
            <td>${project.properties.Budget_Code}</td>
            <td>${project.properties.Created_At}</td>
            <td>${project.properties.Work_Completion_Date}</td>
        </tr>`;

          tableBody.insertAdjacentHTML('beforeend', row);
        });

        updatePaginationButtons(project.length);
        const currentPageElement = document.getElementById('currentPage');
        if (currentPageElement) {
          currentPageElement.textContent = currentPage;
        }
      }

      function updatePaginationButtons(totalItems) {
        const totalPages = Math.ceil(totalItems / pageSize);
        const pagination = document.getElementById('paginationControls');
        pagination.innerHTML = '';

        const previousButton = document.createElement('button');
        previousButton.innerHTML = '<i class="fa-solid fa-backward"></i>';
        previousButton.addEventListener('click', () => {
          if (currentPage > 1) {
            currentPage--;
            updateTable(project, currentPage);
          }
        });
        pagination.appendChild(previousButton);

        const pageInfo = document.createElement('P');
        pageInfo.textContent = `Page${currentPage}`;
        pagination.appendChild(pageInfo);

        const nextButton = document.createElement('button');
        nextButton.innerHTML = '<i class="fa-solid fa-forward"></i>';
        nextButton.addEventListener('click', () => {
          if (currentPage < totalPages) {
            currentPage++;
            updateTable(project, currentPage);
          }
        });
        pagination.appendChild(nextButton);
      }

      // Assuming you have an initial call to updateTable with the initial page
      updateTable(project, currentPage);

      $(".tablestats").html(`Total Amount: ${totalTenderAmount.toFixed(2)}L ,
    Total Projects: ${totalcountofselectedrecords}`);

      $("#workTableDashboard tbody").on("click", "tr", function () {
        var coordinatesStr = $(this).data("coordinates");
        var coordinatesObj = coordinatesStr;
        var boundsLayer = L.geoJSON(coordinatesObj, {
          style: {
            fillColor: "blue", // Fill color
            fillOpacity: 0.3, // Fill opacity
            color: "blue", // Border color
            weight: 2, // Border weight
          },
        }).addTo(map); // Add the bounds layer to the map

        var bounds = boundsLayer.getBounds();
        map.fitBounds(bounds).setZoom(17.5);
        setTimeout(function () {
          map.removeLayer(boundsLayer);
        }, 5000); // Remove the bounds layer after 5 seconds (adjust duration as needed)
      });
      // drag and drop
      $(function () {
        $("#table-container-dashboard").draggable();
      });



      // -----------------------
      var printButton = $("#printButton")
      var tablestats = $("#tablestatss")
      var isClosed = false;


      $("#closeTableBtnDashboard").click(function () {

        var tableContainer = $("#table-container-dashboard");
        tableContainer.hide();

      });


    });

  });

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
              project.project.Work_Type,
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
    var nameOfWork = data[0]; 

    
    var highlightedAreaCoordinates = [
      [18.532343, 73.917303],
      [18.526969, 73.926744],
      [18.533809, 73.928547],
      [18.532343, 73.917303], 
    ];

 
    var highlightedAreaLayer = L.polygon(highlightedAreaCoordinates, {
      color: "red",
      fillColor: "red",
      fillOpacity: 0.5,
    }).addTo(map);

    map.fitBounds(highlightedAreaLayer.getBounds());
  });


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
