<?php
/*
PHP MSSQL Example

Replace data_source_name with the name of your data source.
Replace database_username and database_password
with the SQL Server database username and password.
*/
$time=$_POST["time"];
$version_name=$_POST["version_name"];
$owner=$_POST["owner"];

echo "$time";


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



$sql = "INSERT INTO dbo.VERSION_INFO (TIME_MODIFY,VERSION_MODIFY,OWNER_MODIFY)
VALUES ('$time', '$version_name', '$owner')";

$stmt = sqlsrv_query( $conn, $sql);
if( $stmt === false ) {
     die( print_r( sqlsrv_errors(), true));
}
else{

}

sqlsrv_close($conn);
?>
