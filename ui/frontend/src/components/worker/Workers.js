import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addWorker,
  getAllWorkers,
  getWorkerSpecialties,
} from "../../actions/workerAction";
import { LoadingSpinner, Modal, TableScreen } from "@iyadmosa/react-library";
import AddWorkerForm from "./AddWorkerForm";
import { FaDollarSign } from "react-icons/fa";
import PaymentForm from "../payment/PaymentForm";
import { payForWorker } from "../../actions/paymentAction";

const Workers = () => {
  const [worker, setWorker] = useState({
    id: "",
    name: "",
    specialty: "",
    startedOn: "",
    endedOn: "",
  });
  const [paymentData, setPaymentData] = useState({
    paidAt: new Date(),
    amount: null,
    paymentMethod: "CASH",
    currency: "NIS",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workerName, setWorkerName] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const workers = useSelector((state) => state.workerTable.workers) || [];
  const specialties =
    useSelector((state) => state.workerTable.specialties) || [];

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        dispatch(getAllWorkers()),
        dispatch(getWorkerSpecialties()),
      ]);
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  const columns = useMemo(
    () => [
      { id: "id", Header: "ID", accessor: "id" },
      { id: "name", Header: "Name", accessor: "name" },
      { id: "specialty", Header: "Specialty", accessor: "specialty" },
      { id: "startedOn", Header: "Started On", accessor: "startedOn" },
      { id: "endedOn", Header: "Ended On", accessor: "endedOn" },
      {
        Header: "",
        filterable: false,
        sortable: false,
        resizable: false,
        Cell: (row) => (
          <button
            onClick={() => handlePaymentClick(row.original.name)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <FaDollarSign size={20} />
          </button>
        ),
      },
    ],
    []
  );

  const handlePaymentClick = useCallback((name) => {
    setWorkerName(name);
    setIsModalOpen(true);
  }, []);

  const handleSubmitPayment = async () => {
    if (workerName) {
      await dispatch(payForWorker(workerName, paymentData));
      setWorkerName(null);
      setIsModalOpen(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  console.log(`Pay to worker ${workerName}, paymentData`, paymentData);

  return (
    <div>
      <TableScreen
        title="Worker Management"
        onInit={async () => {
          setLoading(true);
          await dispatch(getAllWorkers());
          setLoading(false);
        }}
        onAddSubmit={() => dispatch(addWorker(worker))}
        columns={columns}
        data={workers}
        addForm={
          <AddWorkerForm
            worker={worker}
            onChange={setWorker}
            specialties={specialties}
          />
        }
      />

      <Modal
        title="Payment Modal"
        isOpen={isModalOpen}
        onSubmit={handleSubmitPayment}
        onClose={() => {
          setIsModalOpen(false);
          setWorkerName(null);
        }}
      >
        <PaymentForm paymentData={paymentData} onChange={setPaymentData} />
      </Modal>
    </div>
  );
};

export default Workers;
