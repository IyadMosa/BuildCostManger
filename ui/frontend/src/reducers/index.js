import { combineReducers } from "redux";
import authReducer from "./authReducer";
import workerReducer from "./workerReducer";
import paymentReducer from "./paymentReducer";
import shopReducer from "./shopReducer";
import materialsReducer from "./mateialsReducer";
import projectReducer from "./projectReducer";

export default combineReducers({
  auth: authReducer,
  workerTable: workerReducer,
  payments: paymentReducer,
  shops: shopReducer,
  materialsTable: materialsReducer,
  projects: projectReducer,
});
