import { csrfFetch } from "./csrf";

const CREATE_ORDER = 'orders/CREATE_ORDER';

export const createOrder = (order) => ({
    type: CREATE_ORDER,
    order
});

export const addOrder = (order) => async (dispatch) => {
    const res = await csrfFetch('/api/checkout', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
    });

    if (res.ok) {
        const order = await res.json();
        dispatch(createOrder(order));
        return order
    } else {
        const errors = await res.json();
        return errors
    }
}

const ordersReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_ORDER: {
            const orderState = {}
            orderState[action.order.id] = action.order
            return orderState
        }

        default:
            return { ...state }
    }
}

export default ordersReducer;