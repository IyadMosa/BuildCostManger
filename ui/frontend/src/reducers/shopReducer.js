import { SHOP, SHOP_ERROR, SHOPS } from "../actions/types";

const initialState = {
  shops: [],
  shop: {},
  error: null,
};

const handleErrorState = (state, action) => ({
  ...state,
  shops: [],
  shop: {},
  error: action.payload || "An error occurred",
});

export default function shopReducer(state = initialState, action) {
  switch (action.type) {
    case SHOPS:
      return { ...state, shops: action.payload, error: null };
    case SHOP:
      return { ...state, shop: action.payload, error: null };
    case SHOP_ERROR:
      return handleErrorState(state, action);

    default:
      return state;
  }
}
