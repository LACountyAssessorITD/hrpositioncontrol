<?php
/*
PHP MSSQL Example

Replace data_source_name with the name of your data source.
Replace database_username and database_password
with the SQL Server database username and password.
*/


$position_id_initial=$_POST["position_id"];
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

// only select vacant positions (positions not in EMPLOYEE_POSITION)
$stmt_position = "SELECT p.*
FROM
	dbo.POSITION p
	LEFT JOIN EMPLOYEE_POSITION e
		ON p.POSN_ID = e.POSN_ID
WHERE
	e.POSN_ID IS NULL
	AND p.POSN_ID = $position_id_initial";

$stmt = sqlsrv_query( $conn, $stmt_position);
if($stmt===false){
   echo "pick_vacant_position failed";
}else{

	$row = sqlsrv_fetch_array($stmt);
	$myobject= new \stdClass();
	$myobject->position_id=$row["POSN_ID"];
	$myobject->home_unit_cd=$row["HOME_UNIT_CD"];
	$myobject->salary_maximum_am=$row["SALARY_MAXIMUM_AM"];
	$myobject->title_cd=$row["TITLE_CD"];
	$myobject->sub_title_cd=$row["SUB_TITLE_CD"];

	// query to get the title name (TITL_SHORT_DD)
	$param = $row["TITLE_CD"];
	$sql_title = "SELECT *
				FROM dbo.TITLE
				WHERE TITLE_CD = $param";
	if ($stmt_title = sqlsrv_query($conn, $sql_title)) {
		$data = sqlsrv_fetch_array($stmt_title);
	    $myobject->titl_short_dd = $data["TITL_SHORT_DD"];
	} else {
		echo "statment cannot be executed\n";
		die(print_r(sqlsrv_errors(), true));
	}

	echo json_encode($myobject);
}

sqlsrv_free_stmt($stmt_title);
sqlsrv_free_stmt($stmt);





sqlsrv_close($conn);
?>
