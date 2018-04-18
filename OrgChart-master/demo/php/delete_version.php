<?php
/*
PHP MSSQL Example

Replace data_source_name with the name of your data source.
Replace database_username and database_password
with the SQL Server database username and password.
*/

$version_id=$_POST["version_id"];



// echo "$time";


include 'constants.php';

$serverName = SQL_SERVER_NAME;
$uid = SQL_SERVER_USERNAME;
$pwd = SQL_SERVER_PASSWORD;
//$serverName = "Assessor";
//$uid = "zhdllwyc";
//$pwd = "19960806Wyc";
$connectionInfo = array(
    "UID"=>$uid,
    "PWD"=>$pwd,
    "Database"=>"PositionControl",
    "ReturnDatesAsStrings"=>true);

$conn = sqlsrv_connect($serverName, $connectionInfo);


if ($conn===false){
	echo "unable to connect";
	die(print_r(sqlsrv_errors(),true));

}

$sql = "DELETE FROM  dbo.VERSION_TABLE
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
