<?php
/*
PHP MSSQL Example

Replace data_source_name with the name of your data source.
Replace database_username and database_password
with the SQL Server database username and password.
*/
$employee_id=$_POST["employee_id"];
$src_pos_id=$_POST["src_pos_id"];
$dest_pos_id=$_POST["dest_pos_id"];
$src_supervisor_id=$_POST["src_supervisor_id"];
$dest_supervisor_id=$_POST["dest_supervisor_id"];
$time_current=$_POST["time"];
$user='415748';
// echo "$employee_id";
// echo "$src_pos_id";
// echo "$dest_pos_id";
// echo "$src_supervisor_id";
// echo "$dest_supervisor_id";
// echo "$time_current";
// echo "$user";



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



$sql = "INSERT INTO dbo.transaction_document ( employee_id,position_id_source,position_id_destination,user_employee_id, source_supervisor_id, dest_supervisor_id,time_transaction)
VALUES ('$employee_id', '$src_pos_id', '$dest_pos_id','$user' ,'$src_supervisor_id','$dest_supervisor_id','$time_current')";

$stmt = sqlsrv_query( $conn, $sql);
if( $stmt === false ) {
     die( print_r( sqlsrv_errors(), true));
}
else{

}

sqlsrv_close($conn);
?>
