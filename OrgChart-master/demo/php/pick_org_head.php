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


$stmt_employee="SELECT  DISTINCT dbo.tblPayLoc$.MgrEmpNo,
        dbo.EMPLOYEE.EMPL_FIRST_NM,
		dbo.EMPLOYEE.EMPL_LAST_NM
 FROM   dbo.tblPayLoc$
        INNER JOIN dbo.EMPLOYEE
        ON dbo.EMPLOYEE.EMPLOYEE_ID =
           dbo.tblPayLoc$.MgrEmpNo";


$stmt = sqlsrv_query( $conn, $stmt_employee);
if($stmt===false){
   echo "sbsbssbsbbsbs";
}else{


	$result=array();
	while($row = sqlsrv_fetch_array($stmt)) {
		$myobject= new \stdClass();
		$myobject->employee_id=$row["MgrEmpNo"];
		$myobject->first_name=$row["EMPL_FIRST_NM"];
		$myobject->last_name=$row["EMPL_LAST_NM"];

    	$result[] = $myobject;
	}
	echo json_encode($result);



}






sqlsrv_close($conn);
?>
