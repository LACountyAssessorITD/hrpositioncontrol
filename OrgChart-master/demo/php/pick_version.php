<?php
/*
PHP MSSQL Example

Replace data_source_name with the name of your data source.
Replace database_username and database_password
with the SQL Server database username and password.
*/




include_once 'constants.php';

$serverName = SQL_SERVER_NAME;
$uid = SQL_SERVER_USERNAME;
$pwd = SQL_SERVER_PASSWORD;

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

$stmt_version="(SELECT * FROM dbo.VERSION_TABLE)";


$stmt = sqlsrv_query( $conn, $stmt_version);
if($stmt===false){
   echo "false";
}else{


	$result=array();
	while($row = sqlsrv_fetch_array($stmt)) {
		$myobject= new \stdClass();
		$myobject->time=$row["TIME_MODIFIED"];
		$myobject->version_name=$row["VERSION_NAME"];
		$myobject->user=$row["USER_CREATED"];
		$myobject->version_id = $row["VERSION_ID"];

    	$result[] = $myobject;
	}
	echo json_encode($result);
}
sqlsrv_close($conn);
?>
