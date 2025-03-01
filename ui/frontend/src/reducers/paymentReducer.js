import {
  PAYMENT_DETAILS,
  PAYMENT_ERROR,
  SHOP_PAYMENTS,
  WORKER_PAYMENTS,
} from "../actions/types";

const initialState = {
  workerPayments: [],
  shopPayments: [],
  error: null,
};

const handleErrorState = (state, action) => ({
  ...state,
  workerPayments: [],
  shopPayments: [],
  error: action.payload || "An error occurred",
  paymentDetails: {},
});

export default function paymentReducer(state = initialState, action) {
  switch (action.type) {
    case WORKER_PAYMENTS:
      return { ...state, workerPayments: action.payload, error: null };
    case SHOP_PAYMENTS:
      return { ...state, shopPayments: action.payload, error: null };
    case PAYMENT_DETAILS:
      return { ...state, paymentDetails: action.payload, error: null };
    case PAYMENT_ERROR:
      return handleErrorState(state, action);

    default:
      return state;
  }
}
