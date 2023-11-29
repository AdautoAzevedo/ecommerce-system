const Order = require("../model/order");

const deleteUnpaidOrders = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        
        const unpaidOrders = await Order.findAll({
            where: {
                user_id: userId,
                status: 'unpaid'
            }
        });

        if (unpaidOrders.length > 0 ) {
            await Order.destroy({
                where: {
                    order_id: unpaidOrders.map(order => order.order_id)
                }
            });
            console.log('unpaind orders for user have been deleted');
        }
    } catch (error) {
        console.error('Error deleting unpaid orders:', error);
    }
    next();
};

module.exports = deleteUnpaidOrders;