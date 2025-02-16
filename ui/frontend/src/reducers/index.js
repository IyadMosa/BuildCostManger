import {combineReducers} from "redux";
import authReducer from "./authReducer";
import workerReducer from "./workerReducer";

export default combineReducers({
    auth: authReducer,
    workerTable: workerReducer,
});
