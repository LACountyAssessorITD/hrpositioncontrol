<?php
/*
PHP MSSQL Example

Replace data_source_name with the name of your data source.
Replace database_username and database_password
with the SQL Server database username and password.
*/


$employee_id_initial=$_POST["employee_id"];

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

$stmt_employee=" (SELECT * from dbo.EMPLOYEE_POSITION where (POSN_ID IN (select POSN_ID from dbo.POSITION where HOME_UNIT_CD IN (select HOME_UNIT_CD from dbo.POSITION where( POSN_ID IN (SELECT POSN_ID FROM dbo.EMPLOYEE_POSITION WHERE (EMPLOYEE_ID IN (SELECT EMPLOYEE_ID FROM dbo.EMPLOYEE WHERE SUPERVISOR_ID=$employee_id_initial))) ))))) UNION  (SELECT * from dbo.EMPLOYEE_POSITION WHERE EMPLOYEE_ID=$employee_id_initial)";


$stmt = sqlsrv_query( $conn, $stmt_employee);
if($stmt===false){
   echo "false";
}else{

	$result=array();
	while($row = sqlsrv_fetch_array($stmt)) {
		$myobject= new \stdClass();
		$myobject->position_id=$row["POSN_ID"];
		$myobject->employee_id=$row["EMPLOYEE_ID"];

    	$result[] = $myobject;
	}
	echo json_encode($result);
}

sqlsrv_close($conn);
?>
