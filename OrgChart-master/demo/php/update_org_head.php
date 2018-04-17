<?php
/*
PHP MSSQL Example

Replace data_source_name with the name of your data source.
Replace database_username and database_password
with the SQL Server database username and password.
*/

$old_id=$_POST["old_id"];
$new_id=$_POST["new_id"];
$time=$_POST["time"];
$user=$_POST["user"];

include 'constants.php';

if ($conn===false){
	echo "unable to connect";
	die(print_r(sqlsrv_errors(),true));

}

$sql_pick_new_head="SELECT * FROM dbo.EMPLOYEE WHERE EMPLOYEE_ID= '$new_id'";

$stmt_new_head = sqlsrv_query( $conn, $sql_pick_new_head);

$pay_lc;
$home_unit;
$title_short;

if( $stmt_new_head === false ) {
	echo "false";
    die( print_r( sqlsrv_errors(), true));
}else{
	$data = sqlsrv_fetch_array($stmt_new_head);
    $pay_lc = $data["PAY_LCTN_CD"];
    $home_unit = $data["PRIM_UNIT_CD"];
    $title_short = $data["TITLE_CD"];

    // query to get the title name (TITL_SHORT_DD)
	if ($title_short != NULL) {
		$param = $title_short;
		$sql_title = "SELECT *
					FROM dbo.TITLE
					WHERE TITLE_CD = $param";
		if ($stmt_title = sqlsrv_query($conn, $sql_title)) {
			$data = sqlsrv_fetch_array($stmt_title);
		    $title_short = $data["TITL_SHORT_DD"];
		} else {
			echo "statment cannot be executed\n";
			die(print_r(sqlsrv_errors(), true));
		}
		sqlsrv_free_stmt($stmt_title);
	}

}
sqlsrv_free_stmt($stmt_new_head);

$sql_check_head="SELECT * FROM dbo.ORGANIZATION_HEAD WHERE EMPLOYEE_ID = '$new_id'";
$stmt_check_head = sqlsrv_query( $conn, $sql_check_head);
$sql;
$stmt;
if( $stmt_check_head === false ) {
	echo "false";
    die( print_r( sqlsrv_errors(), true));
}else{
	$data = sqlsrv_fetch_array($stmt_check_head);
    if(sizeof($data)!=0){
    	$sql = "UPDATE dbo.ORGANIZATION_HEAD
		SET UPDATEDATE = '$time', UPDATEUSERID = '$user', TITL_SHORT_DD = '$title_short', PAY_LCTN_CD = '$pay_lc', HOME_UNIT_CD = '$home_unit'
		WHERE EMPLOYEE_ID = '$new_id'";


		$stmt = sqlsrv_query( $conn, $sql);
		if( $stmt === false ) {
			echo "false";
		    die( print_r( sqlsrv_errors(), true));
		}
    }else{
    	$sql = "UPDATE dbo.ORGANIZATION_HEAD
		SET EMPLOYEE_ID = '$new_id', UPDATEDATE = '$time', UPDATEUSERID = '$user', TITL_SHORT_DD = '$title_short', PAY_LCTN_CD = '$pay_lc', HOME_UNIT_CD = '$home_unit'
		WHERE EMPLOYEE_ID = '$old_id'";


		$stmt = sqlsrv_query( $conn, $sql);
		if( $stmt === false ) {
			echo "false";
		    die( print_r( sqlsrv_errors(), true));
		}

    }

}


sqlsrv_free_stmt($stmt);
sqlsrv_free_stmt($stmt_check_head);
sqlsrv_close($conn);
?>
