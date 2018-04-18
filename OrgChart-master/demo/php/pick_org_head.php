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

$stmt_employee="SELECT  DISTINCT dbo.ORGANIZATION_HEAD.EMPLOYEE_ID,
        dbo.EMPLOYEE.EMPL_FIRST_NM,
		dbo.EMPLOYEE.EMPL_LAST_NM
 FROM   dbo.ORGANIZATION_HEAD
        INNER JOIN dbo.EMPLOYEE
        ON dbo.EMPLOYEE.EMPLOYEE_ID =
           dbo.ORGANIZATION_HEAD.EMPLOYEE_ID";


$stmt = sqlsrv_query( $conn, $stmt_employee);
if($stmt===false){
   echo "false";
}else{


	$result=array();
	while($row = sqlsrv_fetch_array($stmt)) {
		$myobject= new \stdClass();
		$myobject->employee_id=$row["EMPLOYEE_ID"];
		$myobject->first_name=$row["EMPL_FIRST_NM"];
		$myobject->last_name=$row["EMPL_LAST_NM"];

    	$result[] = $myobject;
	}
	echo json_encode($result);
}

sqlsrv_close($conn);
?>
