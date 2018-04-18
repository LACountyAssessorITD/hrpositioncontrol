<?php
/*
Define global constants here.
*/
if (session_status() == PHP_SESSION_NONE) {
	session_start();
}
// IMPORTANT: toggle T/F for line below, when switching between Azure and LAC Server!
define("ON_AZURE", False);

define("HTTP_PREFIX", "http://localhost/");

if(ON_AZURE) {
	// git repo file path
	define("DIR", "PositionControl/OrgChart-master-20180412/demo/");
	// SQL Server Name
	define("SQL_SERVER_USERNAME", "zhdllwyc");
	define("SQL_SERVER_PASSWORD", "19960806Wyc");
	define("SQL_SERVER_NAME", "Assessor");
}
else {
	// git repo file path
	define("DIR", "PositionControl/OrgChart-master-20180412/demo/");
	// SQL Server Name
	define("SQL_SERVER_USERNAME", "superadmin");
	define("SQL_SERVER_PASSWORD", "admin");
	define("SQL_SERVER_NAME", "hrpersonneldev");
}

define("SQL_SERVER_LACDATABASE", "PositionControl");

// File Paths
define("USER_HOME_PAGE_URL",	HTTP_PREFIX.DIR."landing.html");
define("ADMIN_HOME_PAGE_URL",	HTTP_PREFIX.DIR."landing.html");
define("LOGIN_URL",				HTTP_PREFIX.DIR."index.php");

// LDAP Info
define("LDAP_SERVER_NAME", "ldap://laassessor.co.la.ca.us");
?>
