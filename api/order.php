<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../db.php';

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    echo json_encode(['success' => false, 'error' => 'Invalid JSON payload']);
    exit;
}

// Server-side validation
$gameId = trim($data['game_id'] ?? '');
$gameName = trim($data['game_name'] ?? '');
$itemId = trim($data['item_id'] ?? '');
$itemName = trim($data['item_name'] ?? '');
$itemPrice = floatval($data['item_price'] ?? 0);
$playerId = trim($data['player_id'] ?? '');
$serverId = trim($data['server_id'] ?? '');
$customerName = trim($data['customer_name'] ?? '');
$customerPhone = trim($data['customer_phone'] ?? '');
$customerEmail = trim($data['customer_email'] ?? '');
$paymentReference = trim($data['payment_reference'] ?? '');

if (empty($gameId) || empty($playerId) || empty($customerName) || empty($customerPhone) || empty($paymentReference)) {
    echo json_encode(['success' => false, 'error' => 'Please fill in all required fields including Player ID and Payment Reference']);
    exit;
}

if ($itemPrice <= 0) {
    echo json_encode(['success' => false, 'error' => 'Invalid package price']);
    exit;
}

// Generate unique order ID (IPT-XXXXXX)
$orderId = 'IPT-' . strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 8));

$pdo = getDbConnection();

if ($pdo) {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO orders (
                order_id, game_id, game_name, item_id, item_name, item_price,
                player_id, server_id, customer_name, customer_phone, customer_email,
                payment_method, payment_number, payment_reference, status
            ) VALUES (
                :order_id, :game_id, :game_name, :item_id, :item_name, :item_price,
                :player_id, :server_id, :customer_name, :customer_phone, :customer_email,
                'Telecel Mobile Money', '0205438685', :payment_reference, 'Pending Verification'
            )
        ");

        $stmt->execute([
            ':order_id' => $orderId,
            ':game_id' => $gameId,
            ':game_name' => $gameName,
            ':item_id' => $itemId,
            ':item_name' => $itemName,
            ':item_price' => $itemPrice,
            ':player_id' => $playerId,
            ':server_id' => $serverId,
            ':customer_name' => $customerName,
            ':customer_phone' => $customerPhone,
            ':customer_email' => $customerEmail,
            ':payment_reference' => $paymentReference
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'Order submitted successfully for manual verification',
            'order_id' => $orderId,
            'status' => 'Pending Verification'
        ]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    // In-memory or JSON fallback response if DB is not attached yet
    echo json_encode([
        'success' => true,
        'message' => 'Order submitted successfully (Local Fallback Mode)',
        'order_id' => $orderId,
        'status' => 'Pending Verification'
    ]);
}
?>
