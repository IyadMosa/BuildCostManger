import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addWorker, getAllWorkers, getWorkerSpecialties} from "../../actions/workerAction";
import {TableScreen, LoadingSpinner} from "@iyadmosa/react-library";
import AddWorkerForm from "./AddWorkerForm";

const Workers = () => {
    const [worker, setWorker] = useState({
        id: "", name: "", specialty: "", startedOn: "", endedOn: "",
    });

    const dispatch = useDispatch();
    const data = useSelector((state) => state.workerTable.workers) || [];
    const specialties = useSelector((state) => state.workerTable.specialties) || [];
    const [loading, setLoading] = useState(true); // Manage loading state

    useEffect(() => {
        Promise.all([
            dispatch(getAllWorkers()),
            dispatch(getWorkerSpecialties()),
        ]).then(() => setLoading(false));
    }, [dispatch]);

    const columns = useMemo(() => [
        {id: "id", Header: "ID", accessor: "id"},
        {id: "name", Header: "Name", accessor: "name"},
        {id: "specialty", Header: "Specialty", accessor: "specialty"},
        {id: "startedOn", Header: "Started On", accessor: "startedOn"},
        {id: "endedOn", Header: "Ended On", accessor: "endedOn"},
    ], []);


    if (loading) {

        return <LoadingSpinner/>;

    }
    console.log("workers table data", data)
    return (
        <TableScreen
            title="Worker Management"
            onInit={() => {
                setLoading(true);
                dispatch(getAllWorkers()).then(() => setLoading(false));
            }}
            onAddSubmit={() => dispatch(addWorker(worker))}
            columns={columns}
            data={data}
            addForm={<AddWorkerForm worker={worker} onChange={setWorker} specialties={specialties}/>}
        />
    );
};

export default Workers;
