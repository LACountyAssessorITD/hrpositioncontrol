<?php
/*
PHP MSSQL Example

Replace data_source_name with the name of your data source.
Replace database_username and database_password
with the SQL Server database username and password.
*/
$content=$_POST["content"];
$user=$_POST["user"];
$version_name=$_POST["version_name"];
$time=$_POST["time"];


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

$sql = "INSERT INTO dbo.VERSION_TABLE ( VERSION_NAME,TIME_MODIFIED,USER_CREATED,CONTENT)
OUTPUT (INSERTED.VERSION_ID)
VALUES ('$version_name','$time','$user','$content')";

if ($stmt = sqlsrv_query( $conn, $sql)) {
    // statement executed successfully
    $myobject= new \stdClass();
    $row = sqlsrv_fetch_array($stmt);
    $myobject->version_id = $row["VERSION_ID"];
    echo json_encode($myobject);
}
else {
	echo "statment cannot be executed\n";
	die(print_r(sqlsrv_errors(), true));
}
sqlsrv_free_stmt($stmt);
sqlsrv_close($conn);
?>
