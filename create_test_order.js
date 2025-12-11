// Create a test order for testing status updates
async function createTestOrder() {
    try {
        console.log('Creating test order...');

        const orderData = {
            userId: 1, // Assuming user ID 1 exists
            serviceId: 1, // Assuming service ID 1 exists
            paymentId: 1, // Assuming payment ID 1 exists
            note: "Test order for status update",
            shippingAddress: "Test Address",
            phoneNumber: "0123456789",
            items: [
                {
                    bookId: 1,
                    quantity: 1,
                    price: 100000
                }
            ]
        };

        const response = await fetch('http://localhost:8080/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error(`Create order failed: ${response.status}`);
        }

        const newOrder = await response.json();
        console.log('✅ Created order:', newOrder.id, 'Status:', newOrder.status);
        return newOrder.id;

    } catch (error) {
        console.error('❌ Error creating order:', error.message);
        return null;
    }
}

async function testStatusUpdates(orderId) {
    const statuses = ['CONFIRMED', 'INPROGRESS', 'COMPLETED'];

    for (const status of statuses) {
        try {
            console.log(`\nUpdating order ${orderId} to ${status}...`);

            const updateResponse = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: status })
            });

            if (!updateResponse.ok) {
                throw new Error(`Update to ${status} failed: ${updateResponse.status}`);
            }

            // Get updated order
            const getResponse = await fetch(`http://localhost:8080/api/orders/${orderId}`);
            const order = await getResponse.json();

            console.log(`✅ Status updated to: ${order.status}`);
            console.log(`📝 History entries: ${order.orderStatusHistories?.length || 0}`);

        } catch (error) {
            console.error(`❌ Error updating to ${status}:`, error.message);
        }
    }
}

async function runTests() {
    console.log('🚀 Starting order status update tests...\n');

    const orderId = await createTestOrder();
    if (orderId) {
        await testStatusUpdates(orderId);
    }

    console.log('\n🎉 Tests completed!');
}

runTests();


