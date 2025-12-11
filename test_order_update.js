// Test script for order 105 status update
async function testOrderUpdate() {
    try {
        console.log('Testing order 105 status update...');

        // First get current order
        const getResponse = await fetch('http://localhost:8080/api/orders/105');
        const currentOrder = await getResponse.json();
        console.log('Current order status:', currentOrder.status);

        // Update to CONFIRMED
        const updateResponse = await fetch('http://localhost:8080/api/orders/105/status', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'CONFIRMED' })
        });
        console.log('Update response status:', updateResponse.status);

        if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            throw new Error(`Update failed: ${updateResponse.status} - ${errorText}`);
        }

        // Get updated order
        const updatedResponse = await fetch('http://localhost:8080/api/orders/105');
        const updatedOrder = await updatedResponse.json();
        console.log('Updated order status:', updatedOrder.status);
        console.log('Order history length:', updatedOrder.orderStatusHistories?.length || 0);

        console.log('✅ Test completed successfully!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testOrderUpdate();
