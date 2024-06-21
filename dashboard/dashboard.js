var main_url = "https://iwmsgis.pmc.gov.in/geoserver/"

// html page code ......................

function toggleFilter(label) {
  console.log('Toggle filter function called');

  const div = label.closest('.filter-group');
  const input = div.querySelector('.filter-input');
  const ul = div.querySelector('ul');
  const isActive = input.classList.contains('active');

  console.log('Current active state:', isActive);

  // Remove 'active' class from all filter inputs and their associated ul elements
  document.querySelectorAll('.filter-input').forEach(input => {
    input.classList.remove('active');
    input.nextElementSibling.classList.remove('active');
  });

  input.classList.toggle('active');
  ul.classList.toggle('active');

  // Toggle visibility of the input field
  input.style.display = input.classList.contains('active') ? 'block' : 'none';

  console.log('Input display style:', input.style.display);
  // If the clicked filter is not active, add 'active' class to it
  if (input.classList.contains('active')) {
    input.focus();
    filterCheckboxes(input);
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



function updateTableStats(stats) {
  document.getElementById('tablestats').innerText = stats;
}


$(document).ready(function () {
  search()

  var start = moment().subtract(29, 'days');
  var end = moment();
  var cql_filter1; // Declare the variable in the outer scope

  $('#daterange').daterangepicker({
    opens: 'left',
    locale: {
      format: 'MMMM D, YYYY' // Format to show Month name, Day, and Year
    },
    startDate: start,
    endDate: end,
    ranges: {
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      '2024-2025': [moment('2024-04-01'), moment('2025-03-31')],
      '2023-2024': [moment('2023-04-01'), moment('2024-03-31')],
      '2022-2023': [moment('2022-04-01'), moment('2023-03-31')],
      '2021-2022': [moment('2021-04-01'), moment('2022-03-31')],
    }
  }, cb);

  // Call the callback function to set the initial value
  cb(start, end);

  // Additional initialization functions
  function cb(start, end) {
    $('#daterange').val(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    var formattedStartDate = start.format('M/D/YY, h:mm A');
    var formattedEndDate =  end.format('M/D/YY, h:mm A');
    cql_filter1 = `conc_appr_ >= '${formattedStartDate}' AND conc_appr_ < '${formattedEndDate}'`;


    loadinitialData(cql_filter1);
    // const cql_filter = getCqlFilter();
    getCheckedValues(function (filterString) {


      const mainfilter = combineFilters(cql_filter1, filterString);
      console.log("Main Filterfor checking:", mainfilter);


      FilterAndZoom(mainfilter);


      var layers = ["pmc:IWMS_line", "pmc:IWMS_point", "pmc:IWMS_polygon"];
      var typeName = layers.join(',');
      var cqlFilter = mainfilter;
      var geoServerURL =
        "https://iwmsgis.pmc.gov.in/geoserver/pmc/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=" +
        typeName +
        "&outputFormat=application/json&CQL_FILTER=" +
        encodeURIComponent(cqlFilter);
      var headers = ['Work_ID', 'Name_of_Work', 'Department', 'Budget_Code', 'Work_Type', 'Name_of_JE', 'Tender_Amount', 'Created_At'];

      showtable(typeName, geoServerURL, cqlFilter, headers);
    })

  }
  // Function to get cql_filter1 value
  function getCqlFilter() {
    return cql_filter1;
  }

  function loadinitialData(cql_filter) {
    const filternames = ["Project_Office", "project_fi", "zone", "ward", "Department", "stage", "village", "Work_Type"];
    // console.log(filternames, "project_fi");

    filternames.forEach(function (filtername) {
      var url = `${main_url}pmc/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=IWMS_line,IWMS_point,IWMS_polygon&propertyName=${filtername}&outputFormat=application/json&cql_filter=${encodeURIComponent(cql_filter)}`;
      console.log(url);
      $.getJSON(url, function (data) {
        var projectFiSet = new Set();
        var projectFiMap = new Map();

        // Iterate through the features and add non-null values to the set
        $.each(data.features, function (index, feature) {
          var column_name = feature.properties[filtername];
          if (column_name !== null && column_name !== "#N/A") {
            if (projectFiMap.has(column_name)) {
              projectFiMap.set(column_name, projectFiMap.get(column_name) + 1);
            } else {
              projectFiMap.set(column_name, 1);
            }
          }
        });

        var uniqueProjectFiList = Array.from(projectFiMap.entries()).map(([name, count]) => `${name} (${count})`);
        // console.log(uniqueProjectFiList, "uniqueProjectFiList")
        populateDropdown(filtername, uniqueProjectFiList);



      });
    });

    FilterAndZoom(cql_filter)
  }

  function combineFilters(cql_filter, filterString) {
    return `(${cql_filter}) AND (${filterString})`;
  }

  function initialize() {


    $('#daterange').on('apply.daterangepicker', function (ev, picker) {
      var startDate = picker.startDate.format('YYYY-MM-DD');
      var endDate = picker.endDate.format('YYYY-MM-DD');
      var formattedStartDate = startDate.format('M/D/YY, h:mm A');
    var formattedEndDate =  endDate.format('M/D/YY, h:mm A');

      console.log('Selected date rangelooooooooooooooo:', startDate, 'to', endDate);

      cql_filter1 = `conc_appr_ >= '${formattedStartDate}' AND conc_appr_ < '${formattedEndDate}'`;
      console.log(cql_filter1,"for trial")
      loadinitialData(cql_filter1);
      const cql_filter = getCqlFilter();
      getCheckedValues(function (filterString) {


        const mainfilter = combineFilters(cql_filter1, filterString);
        console.log("Main Filterfor checking:", mainfilter);

        FilterAndZoom(mainfilter);

        var layers = ["pmc:IWMS_line", "pmc:IWMS_point", "pmc:IWMS_polygon"];
        var typeName = layers.join(',');
        var cqlFilter = mainfilter;
        var geoServerURL =
          "https://iwmsgis.pmc.gov.in/geoserver/pmc/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=" +
          typeName +
          "&outputFormat=application/json&CQL_FILTER=" +
          encodeURIComponent(cqlFilter);
        var headers = ['Sr_No','Work_ID', 'Name_of_Work', 'Department', 'Budget_Code', 'Work_Type', 'Name_of_JE', 'Agency', 'stage', 'Tender_Amount', 'Created_At'];

        showtable(typeName, geoServerURL, cqlFilter, headers);
      });


    });
  }

  initialize();


});



function populateDropdown(dropdownId, data) {
  var ul = $("#" + dropdownId);
  ul.empty();

  data.forEach(function (item) {
    // console.log(item, "items")
    var listItem = $('<li><label><input type="checkbox" class="select2-option-checkbox" value="' + item + '"> ' + item + '</label></li>');
    ul.append(listItem);
  });
}


function getCheckedValues(callback) {
  var selectedValues = {};
  const filternames = ["Project_Office", "project_fi", "zone", "ward", "Department", "stage", "village", "Work_Type"];

  filternames.forEach(function (filtername) {
    selectedValues[filtername] = []; // Initialize empty array for each filtername

    $('#' + filtername).on('click', 'input[type="checkbox"]', function (event) {
      event.stopPropagation();
      var values = [];
      $('#' + filtername + ' input[type="checkbox"]:checked').each(function () {
        var single_val = $(this).val();
        console.log(single_val, "single_val")
        if (single_val) {
          // Remove the count from the value
          var actualValue = single_val.split(' (')[0];
          values.push(actualValue);
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

      // // Update the selected count in the label
      // var label = $('label[for="' + filtername + '"]');
      // if (label.length > 0) {
      //   label.find('.selected-count').text(' (' + values.length + ')');
      // }

      // Update the selected count in the label
    var label = $('label[for="' + filtername + '"]');
    if (label.length > 0) {
   var selectedCount = values.length;
  var countText = selectedCount > 0 ? ' (' + selectedCount + ')' : '';
  label.find('.selected-count').text(countText);
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






// for dashboard table dynamic



function showtable(typeName, geoServerURL, cqlFilter, headers) {


  tableData(typeName, geoServerURL, cqlFilter, headers);

  var currentPage = 1;
  var rowsPerPage = 10;
  var buttonsToShow = 3;

  function setupPagination(data, rowsPerPage, headers, tableContainer) {
    var paginationContainer = document.createElement('div');
    paginationContainer.id = 'pagination';

    var pageCount = Math.ceil(data.length / rowsPerPage);

    function renderPageButtons(startPage) {
      paginationContainer.innerHTML = ""; // Clear any existing content

      // Previous Button
      var prevButton = document.createElement('button');
      prevButton.innerText = 'Previous';
      prevButton.disabled = currentPage === 1;
      prevButton.addEventListener('click', function () {
        if (currentPage > 1) {
          currentPage--;
          createTable(data, currentPage, rowsPerPage, headers);
          renderPageButtons(Math.max(1, currentPage - Math.floor(buttonsToShow / 2)));
        }
      });
      paginationContainer.appendChild(prevButton);

      // Page Buttons
      var endPage = Math.min(startPage + buttonsToShow - 1, pageCount);
      for (var i = startPage; i <= endPage; i++) {
        var pageButton = document.createElement('button');
        pageButton.innerText = i;
        if (i === currentPage) {
          pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', function (event) {
          currentPage = Number(event.target.innerText);
          createTable(data, currentPage, rowsPerPage, headers);
          renderPageButtons(Math.max(1, currentPage - Math.floor(buttonsToShow / 2)));
        });
        paginationContainer.appendChild(pageButton);
      }

      // Next Button
      var nextButton = document.createElement('button');
      nextButton.innerText = 'Next';
      nextButton.disabled = currentPage === pageCount;
      nextButton.addEventListener('click', function () {
        if (currentPage < pageCount) {
          currentPage++;
          createTable(data, currentPage, rowsPerPage, headers);
          renderPageButtons(Math.max(1, currentPage - Math.floor(buttonsToShow / 2)));
        }
      });
      paginationContainer.appendChild(nextButton);
    }

    renderPageButtons(1);
    tableContainer.appendChild(paginationContainer); // Append paginationContainer after rendering buttons
  }

  
  function createTable(data, headers) {
    var tableContainer = document.getElementById('tablecontainer');
    if (!tableContainer) {
      console.error("Table container not found");
      return;
    }
    tableContainer.innerHTML = ""; // Clear any existing content
  
    // Create minimize button
    var minimizeButton = document.createElement('button');
    minimizeButton.innerText = '-';
    minimizeButton.className = 'minimize-button';
    minimizeButton.addEventListener('click', function () {
      var table = document.querySelector('.data-table');
      if (table.style.display === 'none') {
        table.style.display = 'table';
        minimizeButton.innerText = '-';
      } else {
        table.style.display = 'none';
        minimizeButton.innerText = '+';
      }
    });
    tableContainer.appendChild(minimizeButton);
  
    var table = document.createElement('table');
    table.className = 'data-table'; // Add a class for styling
    table.id = 'data-table'; // Add an ID for DataTables initialization
  
    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');
  
    // Add 'Serial No' as the first header
    headers.unshift('Sr_no');
  
    // Create header cells
    headers.forEach(headerText => {
      var th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
  
    var tbody = document.createElement('tbody');
  
    // Populate table rows with data
    data.forEach((item, index) => {
      var row = document.createElement('tr');
  
      // Add serial number as the first column
      var serialNumberCell = document.createElement('td');
      serialNumberCell.textContent = index + 1;
      row.appendChild(serialNumberCell);
  
      // Add other data columns
      headers.slice(1).forEach(header => { // Exclude the first header (Serial No)
        if (header !== 'Serial No' && header !== 'geometry') {
          var cell = document.createElement('td');
          cell.textContent = item[header] || ''; // Handle cases where item[header] might be undefined
          row.appendChild(cell);
        }
      });
  
      // Add click listener to highlight the geometry on the map
      row.addEventListener('click', function () {
        console.log(item);
        var boundsLayer = L.geoJSON(item.geometry, {
          style: {
            fillColor: "blue", // Fill color
            fillOpacity: 0.3, // Fill opacity
            color: "blue", // Border color
            weight: 2, // Border weight
          },
        }).addTo(map); // Add the bounds layer to the map
  
        var bounds = boundsLayer.getBounds();
        map.fitBounds(bounds);
  
        // Remove the bounds layer after 5 seconds
        setTimeout(function () {
          map.removeLayer(boundsLayer);
        }, 5000);
      });
  
      tbody.appendChild(row);
    });
  
    table.appendChild(tbody);
    tableContainer.appendChild(table);
  
    // Initialize DataTables after rendering the table
    $(document).ready(function() {
      $('#data-table').DataTable({
        paging: true, // Enable pagination
        lengthChange: true, // Disable the 'Show X entries' dropdown
        searching: true, // Enable search box
        ordering: true, // Enable column sorting
        info: true, // Enable showing 'Showing X of Y entries' info
        autoWidth: false, // Disable auto width calculation
      });
    });
  }
  
  function tableData(typeName, geoServerURL, cqlFilter, headers) {
    $.getJSON(geoServerURL, function (data) {
      var filteredData = data;
      console.log(filteredData, "ggggggggggggggggggg");
      // filteredData.features.properties.Work_ID
      const work_id =[];
      var exampleData = filteredData.features.map(feature => {
        let mappedData = {};
        headers.forEach(header => {
          // Convert header to camelCase or other naming convention if necessary
          let propertyName = header.replace(/ /g, '');
          mappedData[propertyName] = feature.properties[header];
        });
        mappedData.geometry = feature.geometry; 
        work_id.push(feature.properties.Work_ID)
        // Ensure geometry is included
        return mappedData;
      });
      console.log(work_id.length, "lllllllllllll")
      updateTableStats(`Total Projects: ${work_id.length}`);
      createTable(exampleData, headers);
    });
  }

  
};

$(document).ready(function() {
  // Handle click event on minimize-button
  $('#minimize-button').click(function() {
    // Hide the pagination div
    $('#pagination').hide();
  });
});


// for search button


function search(){

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

  // console.log("select dropdown", select);
  // console.log("dependent dropdown", selectedValue);






  function getValues(callback) {
    var geoServerURL =
      `https://iwmsgis.pmc.gov.in/geoserver/pmc/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=IWMS_line,IWMS_point,IWMS_polygon&propertyName=${selectedValue}&outputFormat=application/json`;
    console.log(geoServerURL, "geoServerURLsearch")
    $.getJSON(geoServerURL, function (data) {
      var workTypeSet = new Set();

      // Populate the Set with work types
      $.each(data.features, function (index, feature) {
        var workType = feature.properties[selectedValue];

        // Convert number (double) values to strings
        if (typeof workType === 'number') {
          workType = workType.toString();
        }

        if (workType !== null) {
          workTypeSet.add(workType);
        }
      });

      // Convert the Set to an array
      var uniqueWorkTypes = Array.from(workTypeSet);
      console.log(uniqueWorkTypes, "uniqueWorkTypes")
      // Call the callback function with the uniqueWorkTypes array
      callback(uniqueWorkTypes);
    });
  }

  // Call getValues function and initialize autocomplete
  getValues(function (data) {
    $("#searchInputDashboard").autocomplete({
      // console.log("heheheh")
      source: data,
      select: function (event, ui) {
        var selectedValue1 = ui.item.value;
        console.log(selectedValue1,"selectedValue1")
        var searchtypefield = $("#search_type").val();
        console.log(searchtypefield, "searchtypefield", "selectedValue1", selectedValue1)
        let cqlFilter;

        // Handle number (double) values in filter condition
        if (!isNaN(selectedValue1)) {
          // Use as is for number values in CQL_FILTER
          cqlFilter = `${searchtypefield} = ${selectedValue1}`;
        } else {
          // Enclose string values in quotes for CQL_FILTER
          cqlFilter = `${searchtypefield} = '${selectedValue1}'`;
        }





        var layers = ["pmc:IWMS_point", "pmc:IWMS_line", "pmc:IWMS_polygon"];
        var typeName = layers.join(',');

        var geoServerURL =
          "https://iwmsgis.pmc.gov.in/geoserver/pmc/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=" +
          typeName +
          "&outputFormat=application/json&CQL_FILTER=" +
          encodeURIComponent(cqlFilter);

        tableData(typeName, geoServerURL, cqlFilter)

        console.log("hrrrrrrrrrrrrrrrrrr")

        // Apply filter to IWMS_point and IWMS_line layers
        IWMS_point.setParams({
          CQL_FILTER: cqlFilter,
          maxZoom: 19.5,
          styles: "IWMS_points"
        });

        IWMS_line.setParams({
          CQL_FILTER: cqlFilter,
          maxZoom: 19.5,
          styles: "IWMS_line"
        });

        IWMS_polygon.setParams({
          CQL_FILTER: cqlFilter,
          maxZoom: 19.5,
          styles: "IWMS_polygon"
        });

        // Add layers to map and perform other actions
        console.log("Adding IWMS_point and IWMS_line layers with filter:", cqlFilter);
        IWMS_point.addTo(map).bringToFront();
        IWMS_line.addTo(map).bringToFront();
        IWMS_polygon.addTo(map).bringToFront();
        fitbous(cqlFilter);
      }
    });
  });
});
// });
};