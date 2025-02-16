import {RestRequest} from "./RestRequest";
import {WORKER, WORKER_ERROR, WORKER_SPECIALTIES} from "./types";

export const getAllWorkers = () => (dispatch) => {
    return RestRequest("/api/workers", "GET")
        .then((data) => {
            dispatch({type: WORKER, payload: data});
        })
        .catch((error) => {
            dispatch({type: WORKER_ERROR, payload: error.message});
        });
};
export const addWorker = (worker, navigate) => (dispatch) => {
    return RestRequest("/api/workers", "POST", worker)
        .then(() => navigate("/workers"))
        .catch((error) => {
            dispatch({type: WORKER_ERROR, payload: error.message});
        });
};

export const getWorkerSpecialties = () => async (dispatch) => {
    return RestRequest("/api/workers/specialties", "GET")
        .then((data) => {
            dispatch({type: WORKER_SPECIALTIES, payload: data});
        })
        .catch((error) => {
            dispatch({type: WORKER_ERROR, payload: error.message});
        });
};
