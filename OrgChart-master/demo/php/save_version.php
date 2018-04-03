<?php
/*
PHP MSSQL Example

Replace data_source_name with the name of your data source.
Replace database_username and database_password
with the SQL Server database username and password.
*/
$content=$_POST["content"];
$version_id=$_POST["version_id"];
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

$sql = "UPDATE dbo.VERSION_TABLE
SET CONTENT = '$content', TIME_MODIFIED = '$time'
WHERE VERSION_ID = '$version_id'";


$stmt = sqlsrv_query( $conn, $sql);
if( $stmt === false ) {
	echo "false";
     die( print_r( sqlsrv_errors(), true));
}
else{
echo "yehhhhhhhhhhhhhhh";
}
sqlsrv_free_stmt($stmt);
sqlsrv_close($conn);
?>
