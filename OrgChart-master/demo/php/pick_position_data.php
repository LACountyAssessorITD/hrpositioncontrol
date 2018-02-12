<?php
/*
PHP MSSQL Example

Replace data_source_name with the name of your data source.
Replace database_username and database_password
with the SQL Server database username and password.
*/

echo "hehe";
$employee_id_initial=$_POST['employee_id'];
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

$stmt_employee="SELECT * FROM dbo.position WHERE (HOME_UNIT_CD = (SELECT HOME_UNIT_CD from dbo.position WHERE POSN_ID = (SELECT POSN_ID from dbo.EMPLOYEE_POSITION WHERE( employee_id = 415748))))
";

$stmt = sqlsrv_query( $conn, $stmt_employee);
if($stmt===false){
   echo "sbsbssbsbbsbs";
}else{
	$result=array();
	while($row = sqlsrv_fetch_array($stmt)) {
    	$result[] = $row["POSN_ID"].", ".$row["HOME_UNIT_CD"];
	}
	echo json_encode($result);
}







sqlsrv_close($conn);
?>
