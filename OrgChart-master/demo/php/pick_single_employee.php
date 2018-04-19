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


$stmt_employee="SELECT * FROM dbo.EMPLOYEE WHERE (EMPLOYEE_ID =$employee_id_initial)";


$stmt = sqlsrv_query( $conn, $stmt_employee);
if($stmt===false){
   echo "sbsbssbsbbsbs";
}else{
	$result=array();

	$row = sqlsrv_fetch_array($stmt);
	$myobject= new \stdClass();
	$myobject->employee_id=$row["EMPLOYEE_ID"];
	$myobject->home_unit_cd=$row["PRIM_UNIT_CD"];
	$myobject->supervisor_id=$row["SUPERVISOR_ID"];
	$myobject->orig_hire_dt=$row["ORIG_HIRE_DT"];
	$myobject->pay_lctn_cd=$row["PAY_LCTN_CD"];
	$myobject->title_cd=$row["TITLE_CD"];
	$myobject->sub_title_cd=$row["SUB_TITLE_CD"];
	$myobject->first_name=$row["EMPL_FIRST_NM"];
	$myobject->last_name=$row["EMPL_LAST_NM"];

	// query to get the title name (TITL_SHORT_DD)
	$param = (int)$row["TITLE_CD"];

	$sql_title = "SELECT *
				FROM dbo.TITLE
				WHERE TITLE_CD = '$param'";
	if ($stmt_title = sqlsrv_query($conn, $sql_title)) {
		$data = sqlsrv_fetch_array($stmt_title);
	    $myobject->titl_short_dd = $data["TITL_SHORT_DD"];
	} else {
		echo "statment cannot be executed\n";
		die(print_r(sqlsrv_errors(), true));
	}

	sqlsrv_free_stmt($stmt_title);
	sqlsrv_free_stmt($stmt);
	echo json_encode($myobject);
}
sqlsrv_close($conn);
?>
