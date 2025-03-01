import { RestRequest } from "./RestRequest";
import { SHOP, SHOP_ERROR, SHOPS } from "./types";

export const getAllShops = () => (dispatch) => {
  return RestRequest("/api/shops?nameOnly=false", "GET")
    .then((data) => {
      dispatch({ type: SHOPS, payload: data });
    })
    .catch((error) => {
      dispatch({ type: SHOP_ERROR, payload: error.message });
    });
};
export const addShop = (shop, navigate) => (dispatch) => {
  return RestRequest("/api/shops", "POST", shop)
    .then(() => navigate("/shops"))
    .catch((error) => {
      dispatch({ type: SHOP_ERROR, payload: error.message });
    });
};

export const getShop = (name) => async (dispatch) => {
  return RestRequest(`/api/shops/${encodeURIComponent(name)}`, "GET")
    .then((data) => {
      dispatch({ type: SHOP, payload: data });
    })
    .catch((error) => {
      dispatch({ type: SHOP_ERROR, payload: error.message });
    });
};
