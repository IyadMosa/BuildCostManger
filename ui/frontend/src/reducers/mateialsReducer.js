import { MATERIAL, MATERIALS, MATERIALS_ERROR } from "../actions/types";

const initialState = {
  shops: [],
  shop: {},
  error: null,
};

const handleErrorState = (state, action) => ({
  ...state,
  materials: [],
  material: {},
  error: action.payload || "An error occurred",
});

export default function materialsReducer(state = initialState, action) {
  switch (action.type) {
    case MATERIALS:
      return { ...state, materials: action.payload, error: null };
    case MATERIAL:
      return { ...state, material: action.payload, error: null };
    case MATERIALS_ERROR:
      return handleErrorState(state, action);

    default:
      return state;
  }
}
