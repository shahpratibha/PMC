
<?php

try {
    $conn = new PDO("pgsql:host=localhost port=5432 dbname=abc_123 user=postgres password=123");

    // Set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Connection successful<br>";

    // Function to save GeoJSON data to the database
    $data = json_decode($_POST['geoJSON'], true);

    // Debugging output
    echo "Decoded GeoJSON data: ";
    print_r($data);

    // Call the saveToDatabase function
    saveToDatabase($data, $conn);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

echo 'hrrrrrrrrrrrrrrrrrrrrrrrr';
// Function to save GeoJSON data to the database
function saveToDatabase($data, $conn) {
    
    $geometryType = $data['features'][0]['geometry']['type'];
    echo 'gggggggggg';
    print_r( $geometryType);
    // print_r( $data['features'][0]['geometry']);
    print_r( $data['features'][0]['properties']);

$dd = $data['features'][0]['properties'];

$counter = 1;

// Iterate through the properties
foreach ($dd as $key => $value) {
    // Create dynamic variable names like key1, value1, key2, value2, etc.
    ${'key' . $counter} = $key;
    ${'value' . $counter} = $value;

    // Increment the counter
    $counter++;
}

// Now, you have variables like $key1, $value1, $key2, $value2, etc.
echo "Key1: $key1, Value1: $value1<br>";
echo "Key2: $key2, Value2: $value2<br>";


    $stmt = $conn->prepare("INSERT INTO geodataa (geometry, type) VALUES (ST_GeomFromGeoJSON(:geometry), :type)");

    // Bind parameters
    // $stmt->bindParam(':geometry', json_encode($data['geometry']), PDO::PARAM_STR);
    $stmt->bindParam(':geometry', json_encode($data['features'][0]['geometry']), PDO::PARAM_STR);
    $stmt->bindParam(':type', $geometryType, PDO::PARAM_STR);

// ''''''''''added from here

    $stmt = $conn->prepare("INSERT INTO geodata (geometry, type, key1, value1, key2, value2) 
                        VALUES (ST_GeomFromGeoJSON(:geometry), :type, :key1, :value1, :key2, :value2)");

// Bind parameters
    $stmt->bindParam(':geometry', json_encode($data['features'][0]['geometry']), PDO::PARAM_STR);
    $stmt->bindParam(':type', $geometryType, PDO::PARAM_STR);
    // foreach ($dd as $key => $value) {
    // Assuming you have key1, value1, key2, value2 in your $data array
    $stmt->bindParam(':key1',  $key1, PDO::PARAM_STR);
    $stmt->bindParam(':value1',$value1, PDO::PARAM_STR);
    $stmt->bindParam(':key2',$key2, PDO::PARAM_STR);
    $stmt->bindParam(':value2', $value2, PDO::PARAM_INT);


    try {
        // Execute the prepared statement
        $stmt->execute();
        echo "Data successfully saved to the database";
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }

}

?>

