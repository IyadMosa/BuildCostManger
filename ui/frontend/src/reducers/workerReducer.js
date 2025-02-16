import {WORKER, WORKER_ERROR, WORKER_SPECIALTIES} from "../actions/types";

const initialState = {
    workers: [],
    specialties: [],
    error: null,
};

const handleErrorState = (state, action) => ({
    ...state,
    workers: [],
    error: action.payload || "An error occurred", // Ensure error message is printed properly
});

export default function workerReducer(state = initialState, action) {
    switch (action.type) {
        case WORKER:
            return {...state, workers: action.payload, error: null};
        case WORKER_SPECIALTIES:
            return {...state, specialties: action.payload, error: null};
        case WORKER_ERROR:
            return handleErrorState(state, action);

        default:
            return state;
    }
}
