import { RestRequest } from "./RestRequest";
import { PAYMENT_ERROR } from "./types";

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
