<?php
/*
PHP MSSQL Example

Replace data_source_name with the name of your data source.
Replace database_username and database_password
with the SQL Server database username and password.
*/


$position_id_initial=$_POST["position_id"];

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


$stmt_position="SELECT * from dbo.POSITION where (POSN_ID  =  $position_id_initial)";

$stmt = sqlsrv_query( $conn, $stmt_position);
if($stmt===false){
   echo "sbsbssbsbbsbs";
}else{


	$row = sqlsrv_fetch_array($stmt);
	$myobject= new \stdClass();
	$myobject->position_id=$row["POSN_ID"];
	$myobject->home_unit_cd=$row["HOME_UNIT_CD"];
	$myobject->salary_maximum_am=$row["SALARY_MAXIMUM_AM"];
	$myobject->title_cd=$row["TITLE_CD"];
	$myobject->sub_title_cd=$row["SUB_TITLE_CD"];
	$myobject->ordinance=$row["ORDINANCE"];
	$myobject->budgeted_fte=$row["BUDGETED_FTE"];

	// query to get the title name (TITL_SHORT_DD)
	if ($myobject->title_cd != NULL) {
		$param = $row["TITLE_CD"];
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
	}

	echo json_encode($myobject);
}

sqlsrv_free_stmt($stmt);
sqlsrv_close($conn);
?>
