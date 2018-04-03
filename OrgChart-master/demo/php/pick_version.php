<?php
/*
PHP MSSQL Example

Replace data_source_name with the name of your data source.
Replace database_username and database_password
with the SQL Server database username and password.
*/




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


// $stmt_version="(SELECT * FROM dbo.VERSION_INFO)";
$stmt_version="(SELECT * FROM dbo.VERSION_TABLE)";


$stmt = sqlsrv_query( $conn, $stmt_version);
if($stmt===false){
   echo "sbsbssbsbbsbs";
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
