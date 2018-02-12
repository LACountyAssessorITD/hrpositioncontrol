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

$stmt_employee="SELECT * from dbo.EMPLOYEE_POSITION where (POSN_ID IN (select POSN_ID from dbo.position where HOME_UNIT_CD = (select HOME_UNIT_CD from dbo.position where( POSN_ID = (SELECT POSN_ID FROM dbo.EMPLOYEE_POSITION WHERE (employee_id = 415748)) ))))
";

$stmt = sqlsrv_query( $conn, $stmt_employee);
if($stmt===false){
   echo "sbsbssbsbbsbs";
}else{
	$result=array();
	while($row = sqlsrv_fetch_array($stmt)) {
    	$result[] = $row["employee_id"].", ".$row["POSN_ID"];
	}
	echo json_encode($result);
}







sqlsrv_close($conn);
?>
