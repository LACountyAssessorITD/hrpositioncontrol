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
$stmt_employee="(SELECT * FROM dbo.position WHERE (HOME_UNIT_CD IN (SELECT HOME_UNIT_CD from dbo.position WHERE POSN_ID IN (SELECT POSN_ID from dbo.EMPLOYEE_POSITION WHERE(EMPLOYEE_ID IN (SELECT EMPLOYEE_ID FROM dbo.EMPLOYEE WHERE SUPERVISOR_ID=$employee_id_initial)))))) UNION (SELECT * FROM dbo.POSITION WHERE POSN_ID = (SELECT POSN_ID from dbo.EMPLOYEE_POSITION WHERE EMPLOYEE_ID=$employee_id_initial ))";
//$stmt_employee="SELECT * FROM dbo.position WHERE (HOME_UNIT_CD = (SELECT HOME_UNIT_CD from dbo.position WHERE POSN_ID = (SELECT POSN_ID from dbo.EMPLOYEE_POSITION WHERE( EMPLOYEE_ID = $employee_id_initial))))
//";

$stmt = sqlsrv_query( $conn, $stmt_employee);
if($stmt===false){
   echo "sbsbssbsbbsbs";
}else{
	$sql_title = "SELECT *
				FROM dbo.TITLE
				WHERE TITLE_CD = ?";

	$result=array();
	while($row = sqlsrv_fetch_array($stmt)) {
		$myobject= new \stdClass();
		$myobject->position_id=$row["POSN_ID"];
		$myobject->home_unit_cd=$row["HOME_UNIT_CD"];
		$myobject->salary_maximum_am=$row["SALARY_MAXIMUM_AM"];
		$myobject->title_cd=$row["TITLE_CD"];
		$myobject->sub_title_cd=$row["SUB_TITLE_CD"];
		$myobject->ordinance=$row["ORDINANCE"];
		$myobject->budgeted_fte=$row["BUDGETED_FTE"];
		//$myjson=json_encode($myobject);

		// query to get the title name (TITL_SHORT_DD)
		$param = $row["TITLE_CD"];
		if ($stmt_title = sqlsrv_prepare($conn, $sql_title, array(&$param))) {
		} else {
			echo "statment cannot be prepared\n";
			die(print_r(sqlsrv_errors(), true));
		}
		if (sqlsrv_execute($stmt_title)) {
		    $data = sqlsrv_fetch_array($stmt_title);
		    $myobject->titl_short_dd = $data["TITL_SHORT_DD"];
		} else {
		    echo "Statement could not be executed.\n";
		    die(print_r(sqlsrv_errors(), true));
		}

    	$result[] = $myobject;
	}
	echo json_encode($result);
}







sqlsrv_close($conn);
?>
