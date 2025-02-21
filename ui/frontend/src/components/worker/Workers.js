import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addWorker,
  getAllWorkers,
  getWorker,
  getWorkerSpecialties,
} from "../../actions/workerAction";
import { LoadingSpinner, Modal, TableScreen } from "@iyadmosa/react-library";
import AddWorkerForm from "./AddWorkerForm";
import { FaDollarSign, FaFileInvoiceDollar, FaUserEdit } from "react-icons/fa";
import PaymentForm from "../payment/PaymentForm";
import { payForWorker } from "../../actions/paymentAction";
import { useNavigate } from "react-router-dom";

const Workers = () => {
  const navigate = useNavigate();
  const [worker, setWorker] = useState({
    id: "",
    name: "",
    specialty: "",
    startedOn: "",
    endedOn: "",
    totalMoneyAmountRequested: "",
  });
  const [paymentData, setPaymentData] = useState({
    paidAt: new Date(),
    amount: null,
    paymentMethod: null,
    currency: "NIS",
    bankName: null,
    transactionId: null,
    bankAccount: null,
    bankBranch: null,
    checkNumber: null,
    checkDate: null,
    payeeName: null,
    cardHolderName: null,
    transactionDate: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [workerName, setWorkerName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const workers = useSelector((state) => state.workerTable.workers) || [];
  const specialties =
    useSelector((state) => state.workerTable.specialties) || [];
  console.log(workers);
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

  const handleGetBillsClick = useCallback(
    (name) => {
      navigate(`/worker-bills/${encodeURIComponent(name)}`); // Redirect to new page with worker name in URL
    },
    [navigate]
  );

  const columns = useMemo(
    () => [
      { id: "name", Header: "Name", accessor: "name" },
      { id: "specialty", Header: "Specialty", accessor: "specialty" },
      { id: "startedOn", Header: "Started On", accessor: "startedOn" },
      {
        id: "requested",
        Header: "Requested",
        accessor: "totalMoneyAmountRequested",
      },
      { id: "paid", Header: "Paid", accessor: "totalMoneyAmountPaid" },
      { id: "endedOn", Header: "Ended On", accessor: "endedOn" },
      {
        Header: "",
        filterable: false,
        sortable: false,
        resizable: false,
        Cell: (row) => (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => handleEditWorker(row.original.name)}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <FaUserEdit size={20} />
            </button>
            <button
              onClick={() => handlePaymentClick(row.original.name)}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <FaDollarSign size={20} />
            </button>
            <button
              onClick={() => handleGetBillsClick(row.original.name)}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <FaFileInvoiceDollar size={20} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const handlePaymentClick = useCallback((name) => {
    setWorkerName(name);
    setIsModalOpen(true);
  }, []);

  const workerToEdit = useSelector((state) => state.workerTable.worker) || {};

  const handleEditWorker = useCallback(
    (name) => {
      setWorkerName(name); // You can keep this to update the state
      setIsWorkerModalOpen(true);
      setIsEditing(true);
      setWorker(workerToEdit);
      dispatch(getWorker(name));
    },
    [dispatch]
  );

  const handleSubmitEditedWorker = async () => {
    if (worker) {
      await dispatch(addWorker(worker));
      setWorker(null);
      setIsWorkerModalOpen(false);
      setIsEditing(false);
    }
  };

  const handleSubmitPayment = async () => {
    if (workerName) {
      await dispatch(payForWorker(workerName, paymentData));
      setWorkerName(null);
      setIsModalOpen(false);
    }
  };

  if (loading) return <LoadingSpinner />;

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
            isEdit={isEditing}
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
      <Modal
        title="Payment Modal"
        isOpen={isWorkerModalOpen}
        onSubmit={handleSubmitEditedWorker}
        onClose={() => {
          setIsWorkerModalOpen(false);
          setWorkerName(null);
          setWorker(null);
        }}
      >
        <AddWorkerForm
          worker={worker}
          onChange={setWorker}
          specialties={specialties}
          isEdit={isEditing}
        />
      </Modal>
    </div>
  );
};

export default Workers;
