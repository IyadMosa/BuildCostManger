import { combineReducers } from "redux";
import authReducer from "./authReducer";
import workerReducer from "./workerReducer";
import paymentReducer from "./paymentReducer";

export default combineReducers({
  auth: authReducer,
  workerTable: workerReducer,
  payments: paymentReducer,
});
