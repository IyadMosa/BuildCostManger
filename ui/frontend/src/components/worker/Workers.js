import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addWorker,
  getAllWorkers,
  getWorker,
} from "../../actions/workerAction";
import { LoadingSpinner, Modal, TableScreen } from "@iyadmosa/react-library";
import AddWorkerForm from "./AddWorkerForm";
import {
  FaDollarSign,
  FaFileInvoiceDollar,
  FaQuestionCircle,
  FaRegPaperPlane,
  FaUserEdit,
} from "react-icons/fa";
import PaymentForm from "../payment/PaymentForm";
import { payForWorker } from "../../actions/paymentAction";
import { useNavigate } from "react-router-dom";

const Workers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const workers = useSelector((state) => state.workerTable.workers) || [];
  const workerToEdit = useSelector((state) => state.workerTable.worker) || {};

  const [worker, setWorker] = useState({
    id: "",
    name: "",
    phoneNumber: "",
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

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllWorkers());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (isEditing && workerToEdit?.name) {
      setWorker(workerToEdit);
    }
  }, [workerToEdit, isEditing]);

  const handleGetBillsClick = useCallback(
    (name) => {
      navigate(`/worker-bills/${encodeURIComponent(name)}`);
    },
    [navigate]
  );

  const handlePaymentClick = useCallback((name) => {
    setWorkerName(name);
    setIsModalOpen(true);
  }, []);

  const handleEditWorker = useCallback(
    async (name) => {
      setWorkerName(name);
      await dispatch(getWorker(name));
      setIsEditing(true);
      setIsWorkerModalOpen(true);
    },
    [dispatch]
  );

  const handleNewRequest = useCallback((name) => {
    setWorkerName(name);
    setIsModalOpen(true);
  }, []);
  const handleSubmitEditedWorker = async () => {
    if (worker) {
      await dispatch(addWorker(worker));
      setWorker({});
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

  const columns = useMemo(
    () => [
      { id: "name", Header: "Name", accessor: "name" },
      { id: "phoneNumber", Header: "Phone Number", accessor: "phoneNumber" },
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
        maxWidth: 140,
        Cell: (row) => (
          <div style={{ display: "flex" }}>
            <button
              onClick={() => handleEditWorker(row.original.name)}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <FaUserEdit size={20} />
            </button>
            <button
              onClick={() => handleNewRequest(row.original.name)}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <FaRegPaperPlane size={20} />
            </button>
            <button
              onClick={() => handlePaymentClick(row.original.name)}
              style={{ background: "none", border: "none", cursor: "pointer" }}
              disabled={
                row.original.totalMoneyAmountRequested ===
                row.original.totalMoneyAmountPaid
              }
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
    [handleEditWorker, handlePaymentClick, handleGetBillsClick]
  );

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
        title="Edit Worker"
        isOpen={isWorkerModalOpen}
        onSubmit={handleSubmitEditedWorker}
        onClose={() => {
          setIsWorkerModalOpen(false);
          setIsEditing(false);
        }}
      >
        <AddWorkerForm
          worker={worker}
          onChange={setWorker}
          isEdit={isEditing}
        />
      </Modal>
    </div>
  );
};

export default Workers;
