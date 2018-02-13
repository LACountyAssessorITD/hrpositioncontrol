<?php
/*
PHP MSSQL Example

Replace data_source_name with the name of your data source.
Replace database_username and database_password
with the SQL Server database username and password.
*/

echo "hehe";

$Servername='Assessor';
$connection_info=array('UID'=>'zhdllwyc',
	'PWD'=> '19960806Wyc',
	'Database'=>'PositionControl',
'ReturnDatesAsStrings'=>true);
echo "ka";

// Connect to the data source and get a handle for that connection.
$conn=sqlsrv_connect($Servername,$connection_info);

echo "emmm";
if ($conn===false){
	echo "unable to connect";
	die(print_r(sqlsrv_errors(),true));

}
else{
 echo "connect";
}
$tran_id=4;
$employee_id='004845';
$p_id_s='10001636';
$p_id_d='10001637';
$t_s_h_d="AS";
$t_d_h_d="IT";


$sql = "INSERT INTO dbo.transaction_document (transaction_id, employee_id,position_id_source,position_id_destination, transaction_source_home_department, transaction_dest_home_department)
VALUES ('$tran_id', '$employee_id', '$p_id_s', '$p_id_d','$t_s_h_d','$t_d_h_d')";

$stmt = sqlsrv_query( $conn, $sql);
if( $stmt === false ) {
     die( print_r( sqlsrv_errors(), true));
}
else{
	echo "insert";
}

sqlsrv_close($conn);
?>
