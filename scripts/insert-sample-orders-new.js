const mysql = require('mysql2/promise');

async function insertSampleOrders() {
  // Create connection
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'tap_hoa_xanh'
  });

  try {
    console.log('🚀 Creating sample orders with new schema...');

    // Sample orders data với schema mới
    const sampleOrders = [
      {
        quantity: 3,
        images: '/client/images/product.png',
        comment: 'Giao hàng nhanh',
        usersId: 1,
        currency: 'VND',
        payment_description: 'Thanh toán đơn hàng #1',
        transaction_id: 'TXN_001',
        gateway_response: 'SUCCESS',
        payment_amount: 1750000,
        payment_method: 'Paypal',
        payment_status: 'completed',
        discount: 0,
        freeship: 1,
        shipping_fee: 0,
        voucherId: null,
        price: 1750000
      },
      {
        quantity: 2,
        images: '/client/images/product.png',
        comment: 'Gọi trước khi giao',
        usersId: 1,
        currency: 'VND',
        payment_description: 'Thanh toán đơn hàng #2',
        transaction_id: 'TXN_002',
        gateway_response: 'PENDING',
        payment_amount: 850000,
        payment_method: 'Credit Card',
        payment_status: 'pending',
        discount: 50000,
        freeship: 0,
        shipping_fee: 30000,
        voucherId: null,
        price: 850000
      },
      {
        quantity: 5,
        images: '/client/images/product.png',
        comment: 'Đơn hàng thường',
        usersId: 1,
        currency: 'VND',
        payment_description: 'Thanh toán đơn hàng #3',
        transaction_id: 'TXN_003',
        gateway_response: 'SUCCESS',
        payment_amount: 2100000,
        payment_method: 'Cash on Delivery',
        payment_status: 'completed',
        discount: 100000,
        freeship: 1,
        shipping_fee: 0,
        voucherId: 1,
        price: 2100000
      }
    ];

    // Clear existing orders first (optional)
    await connection.execute('DELETE FROM `order` WHERE usersId = 1');
    console.log('🗑️ Cleared existing orders for user 1');

    // Insert orders với schema mới
    const insertOrderQuery = `
      INSERT INTO \`order\` (
        quantity, 
        images, 
        comment, 
        usersId, 
        currency, 
        payment_description, 
        transaction_id, 
        gateway_response, 
        payment_amount, 
        payment_method, 
        payment_status, 
        discount, 
        freeship, 
        shipping_fee, 
        voucherId, 
        price,
        createdAt, 
        updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    let orderCount = 0;
    for (const order of sampleOrders) {
      try {
        const [result] = await connection.execute(insertOrderQuery, [
          order.quantity,
          order.images,
          order.comment,
          order.usersId,
          order.currency,
          order.payment_description,
          order.transaction_id,
          order.gateway_response,
          order.payment_amount,
          order.payment_method,
          order.payment_status,
          order.discount,
          order.freeship,
          order.shipping_fee,
          order.voucherId,
          order.price
        ]);

        const orderId = result.insertId;
        orderCount++;

        // Create delivery record
        const insertDeliveryQuery = `
          INSERT INTO delivery (
            orderId, 
            tracking_number, 
            status, 
            notes, 
            estimated_date, 
            shipped_at, 
            delivered_at, 
            delivery_fee, 
            createdAt, 
            updatedAt
          ) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?, NOW(), NOW())
        `;

        const deliveryStatus = order.payment_status === 'completed' ? 'delivered' : 'pending';

        await connection.execute(insertDeliveryQuery, [
          orderId,
          `TH${Date.now()}${orderId}`,
          deliveryStatus,
          order.comment,
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          order.shipping_fee
        ]);

        console.log(`✅ Created order #${orderId}: ${order.payment_method} - ${order.payment_status}`);
        
      } catch (error) {
        console.error(`❌ Failed to create order:`, error.message);
      }
    }

    console.log(`\n🎉 Successfully created ${orderCount} sample orders!`);

    // Show created orders
    const [rows] = await connection.execute(`
      SELECT 
        id, 
        quantity, 
        comment, 
        payment_method, 
        payment_status, 
        price, 
        createdAt 
      FROM \`order\` 
      WHERE usersId = 1
      ORDER BY createdAt DESC 
    `);

    console.log('\n📋 Orders for user 1:');
    console.table(rows);

  } catch (error) {
    console.error('❌ Error creating sample orders:', error);
  } finally {
    await connection.end();
    console.log('\n🔌 Database connection closed');
  }
}

insertSampleOrders(); 