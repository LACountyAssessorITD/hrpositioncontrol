<?php 
if (session_status() == PHP_SESSION_NONE) {
	session_start();
}
$role = $_SESSION["ROLE"];
$employee_id = $_SESSION["EMPLOYEE_ID"];

$myobject= new \stdClass();
$myobject->role=$role;
$myobject->employee_id=$employee_id;

echo json_encode($myobject);
?>