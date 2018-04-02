<?php
/*
PHP MSSQL Example

Replace data_source_name with the name of your data source.
Replace database_username and database_password
with the SQL Server database username and password.
*/
$version_id=$_POST["version_id"];

// echo "$time";


$Servername='Assessor';
$connection_info=array('UID'=>'zhdllwyc',
	'PWD'=> '19960806Wyc',
	'Database'=>'PositionControl',
'ReturnDatesAsStrings'=>true);


// Connect to the data source and get a handle for that connection.
$conn=sqlsrv_connect($Servername,$connection_info);


if ($conn===false){
	echo "unable to connect";
	die(print_r(sqlsrv_errors(),true));

}

$sql = "SELECT CONTENT FROM dbo.VERSION_TEST
WHERE _ID = '$version_id'";

if ($stmt = sqlsrv_query( $conn, $sql)) {
    // statement executed successfully
    $data = sqlsrv_fetch_array($stmt);
    $myobject= new \stdClass();
    $myobject->content = $data["CONTENT"];
}
else {
	echo "statment cannot be executed\n";
	die(print_r(sqlsrv_errors(), true));
}
sqlsrv_free_stmt($stmt);
sqlsrv_close($conn);
echo json_encode($myobject);
?>
