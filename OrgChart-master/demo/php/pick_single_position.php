<?php
/*
PHP MSSQL Example

Replace data_source_name with the name of your data source.
Replace database_username and database_password
with the SQL Server database username and password.
*/


$position_id_initial=$_POST["position_id"];
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


$stmt_position="SELECT * from dbo.POSITION where (POSN_ID  =  $position_id_initial)";

$stmt = sqlsrv_query( $conn, $stmt_position);
if($stmt===false){
   echo "sbsbssbsbbsbs";
}else{


	$row = sqlsrv_fetch_array($stmt);
	$myobject= new \stdClass();
	$myobject->position_id=$row["POSN_ID"];
	// see pick_position_vacant.php



	echo json_encode($myobject);
}







sqlsrv_close($conn);
?>
