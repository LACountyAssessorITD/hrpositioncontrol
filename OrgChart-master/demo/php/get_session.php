<?php 
if (session_status() == PHP_SESSION_NONE) {
	session_start();
}

$myobject= new \stdClass();
$myobject->role=$_SESSION["ROLE"];
$myobject->employee_id=$_SESSION["EMPLOYEE_ID"];

echo json_encode($myobject);
?>