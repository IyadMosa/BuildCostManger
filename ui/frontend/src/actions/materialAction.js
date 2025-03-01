import { RestRequest } from "./RestRequest";
import { MATERIAL, MATERIALS, MATERIALS_ERROR, PAYMENT_ERROR } from "./types";

export const purchaseMaterial = (shop, payment, navigate) => (dispatch) => {
  return RestRequest(
    `/api/materials/shop/${encodeURIComponent(shop)}`,
    "POST",
    payment
  )
    .then(() => navigate("/shops"))
    .catch((error) => {
      dispatch({ type: PAYMENT_ERROR, payload: error.message });
    });
};
export const getAllMaterialsByShop = (shop) => (dispatch) => {
  return RestRequest(
    `/api/materials/shop/${encodeURIComponent(shop)}`,
    "GET",
    null
  )
    .then((data) => {
      dispatch({ type: MATERIALS, payload: data });
    })
    .catch((error) => {
      dispatch({ type: MATERIALS_ERROR, payload: error.message });
    });
};
export const fetchMaterialById = (id) => (dispatch) => {
  return RestRequest(`/api/materials/${id}`, "GET", null)
    .then((data) => {
      dispatch({ type: MATERIAL, payload: data });
    })
    .catch((error) => {
      dispatch({ type: MATERIALS_ERROR, payload: error.message });
    });
};
