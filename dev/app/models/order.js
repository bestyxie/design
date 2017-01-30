import mongoose from 'mongoose';
import OrderSchema from '../schema/order';

const Order = mongoose.model('Order',OrderSchema);

module.exports = Order;