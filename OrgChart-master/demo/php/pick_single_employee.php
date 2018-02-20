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



	sqlsrv_free_stmt($stmt);


 	// foreach($result as $item) {

		// $titlecd=(string)$item->title_cd;
		// echo $titlecd;
 	//     $stmt_title="SELECT * FROM dbo.TITLE WHERE (TITLE_CD=$titlecd)";
 	// 	$stmt1 = sqlsrv_query( $conn, $stmt_title);
  // 		if($stmt1===false){
  //   		echo "sbsbssbsbbsbsssssssssssssss";
		// }else{
		// 	//$row_title = sqlsrv_fetch_array($stmt1);
		// 	//$item->title_cd=$row_title["TITL_SHORT_DD"];
	 // 	}

 	// 	sqlsrv_free_stmt($stmt1);
 	// }


	echo json_encode($myobject);
}






sqlsrv_close($conn);
?>
