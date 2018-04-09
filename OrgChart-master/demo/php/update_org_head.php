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

$sql = "UPDATE dbo.ORGANIZATION_HEAD
SET EMPLOYEE_ID = '$new_id', UPDATEDATE = '$time', UPDATEUSERID = '$user'
WHERE EMPLOYEE_ID = '$old_id'";


$stmt = sqlsrv_query( $conn, $sql);
if( $stmt === false ) {
	echo "false";
    die( print_r( sqlsrv_errors(), true));
}

sqlsrv_free_stmt($stmt);
sqlsrv_close($conn);
?>
