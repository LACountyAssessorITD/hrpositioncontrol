<?php
/*
PHP MSSQL Example

Replace data_source_name with the name of your data source.
Replace database_username and database_password
with the SQL Server database username and password.
*/


$employee_id_initial=$_POST["employee_id"];

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


$stmt_employee="SELECT * FROM dbo.EMPLOYEE WHERE (EMPLOYEE_ID IN (SELECT EMPLOYEE_ID FROM dbo.EMPLOYEE_POSITION WHERE POSN_ID IN (SELECT POSN_ID FROM dbo.POSITION WHERE HOME_UNIT_CD= (SELECT HOME_UNIT_CD FROM dbo.POSITION WHERE POSN_ID=(SELECT POSN_ID FROM dbo.EMPLOYEE_POSITION WHERE EMPLOYEE_ID=$employee_id_initial)))))";
//$stmt_position_employee="SELECT * FROM dbo.EMPLOYEE_POSITION WHERE POSN_ID IN (SELECT POSN_ID FROM dbo.POSITION WHERE HOME_UNIT_CD=10222)";
//$stmt_employee="SELECT * FROM dbo.employee WHERE (employee_id IN (SELECT EMPLOYEE_ID FROM dbo.EMPLOYEE_POSITION WHERE POSN_ID IN (SELECT POSN_ID FROM dbo.POSITION WHERE HOME_UNIT_CD=10222)))";


$stmt = sqlsrv_query( $conn, $stmt_employee);
if($stmt===false){
   echo "sbsbssbsbbsbs";
}else{
	$result=array();
	while($row = sqlsrv_fetch_array($stmt)) {
		$myobject= new \stdClass();
		$myobject->employee_id=$row["EMPLOYEE_ID"];
		$myobject->home_unit_cd=$row["PRIM_UNIT_CD"];
		$myobject->supervisor_id=$row["SUPERVISOR_ID"];
		$myobject->orig_hire_dt=$row["ORIG_HIRE_DT"];

		//$myjson=json_encode($myobject);
		//echo $myjson;
    	$result[] = $myobject;
	}
	echo json_encode($result);
}







sqlsrv_close($conn);
?>
