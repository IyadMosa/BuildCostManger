import { RestRequest } from "./RestRequest";
import { PAYMENT_DETAILS, PAYMENT_ERROR, WORKER_PAYMENTS } from "./types";

export const payForWorker = (name, payment, navigate) => (dispatch) => {
  return RestRequest(
    `/api/payments/worker/${encodeURIComponent(name)}`,
    "POST",
    payment
  )
    .then(() => navigate("/workers"))
    .catch((error) => {
      dispatch({ type: PAYMENT_ERROR, payload: error.message });
    });
};
export const getPaymentsByWorker = (name) => (dispatch) => {
  return RestRequest(
    `/api/payments/worker/${encodeURIComponent(name)}`,
    "GET",
    null
  )
    .then((data) => {
      dispatch({ type: WORKER_PAYMENTS, payload: data });
    })
    .catch((error) => {
      dispatch({ type: PAYMENT_ERROR, payload: error.message });
    });
};

export const fetchPaymentsById = (id) => (dispatch) => {
  return RestRequest(`/api/payments/${id}`, "GET", null)
    .then((data) => {
      dispatch({ type: PAYMENT_DETAILS, payload: data });
    })
    .catch((error) => {
      dispatch({ type: PAYMENT_ERROR, payload: error.message });
    });
};
