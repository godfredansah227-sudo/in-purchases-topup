<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../db.php';

$orderId = trim($_GET['order_id'] ?? '');

if (empty($orderId)) {
    echo json_encode(['success' => false, 'error' => 'Order ID is required']);
    exit;
}

$pdo = getDbConnection();

if ($pdo) {
    try {
        $stmt = $pdo->prepare("SELECT order_id, game_name, item_name, item_price, player_id, customer_name, customer_phone, payment_reference, status, created_at, updated_at FROM orders WHERE order_id = :order_id OR customer_phone = :order_id ORDER BY created_at DESC LIMIT 1");
        $stmt->execute([':order_id' => $orderId]);
        $order = $stmt->fetch();

        if ($order) {
            echo json_encode([
                'success' => true,
                'order' => $order
            ]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Order not found']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Database connection unavailable']);
}
?>
