import api from '../../shared/api/axiosInstance';

export const createOrder = async (orderData) => {
    // orderData debe tener: { customerId, shippingAddress, billingAddress, orderItems }
    const response = await api.post('/orders', orderData);
    return response.data;
};