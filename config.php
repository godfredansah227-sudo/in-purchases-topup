<?php
/**
 * IN-PURCHASES TOP-UP - Configuration & Neon DB connection settings
 */

// Define application constants
define('APP_NAME', 'IN-PURCHASES TOP-UP');
define('MOMO_NUMBER', '0205438685');
define('MOMO_NAME', 'Godfred Ansah'); // ONLY USED ON TRANSACTION PAYMENT PAGE

// Neon Database URL parsing (postgresql://user:pass@host/dbname?sslmode=require)
$dbUrl = getenv('DATABASE_URL');

if ($dbUrl) {
    $dbopts = parse_url($dbUrl);
    define('DB_HOST', isset($dbopts['host']) ? $dbopts['host'] : 'localhost');
    define('DB_PORT', isset($dbopts['port']) ? $dbopts['port'] : '5432');
    define('DB_USER', isset($dbopts['user']) ? $dbopts['user'] : 'postgres');
    define('DB_PASS', isset($dbopts['pass']) ? $dbopts['pass'] : '');
    define('DB_NAME', isset($dbopts['path']) ? ltrim($dbopts['path'], '/') : 'neondb');
} else {
    define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
    define('DB_PORT', getenv('DB_PORT') ?: '5432');
    define('DB_USER', getenv('DB_USER') ?: 'postgres');
    define('DB_PASS', getenv('DB_PASS') ?: '');
    define('DB_NAME', getenv('DB_NAME') ?: 'inpurchases_db');
}
?>
