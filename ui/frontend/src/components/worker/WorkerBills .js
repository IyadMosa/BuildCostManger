import { useParams } from "react-router-dom";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LoadingSpinner,
  Modal,
  TableScreen,
  TotalPaid,
} from "@iyadmosa/react-library";
import {
  fetchPaymentsById,
  getPaymentsByWorker,
  payForWorker,
} from "../../actions/paymentAction";
import PaymentForm from "../payment/PaymentForm";
import { FaInfoCircle } from "react-icons/fa";
import { getWorker } from "../../actions/workerAction";

const defaultPaymentData = {
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
};

const WorkerBills = () => {
  const { name } = useParams();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [paymentData, setPaymentData] = useState(defaultPaymentData);

  const payments = useSelector((state) => state.payments.workerPayments) || [];
  const paymentDetails =
    useSelector((state) => state.payments.paymentDetails) || {};

  const worker = useSelector((state) => state.workerTable.worker) || {};

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(getPaymentsByWorker(name));
      await dispatch(getWorker(name));
      setLoading(false);
    };
    fetchData();
  }, [dispatch, name]);

  const handleSubmitPayment = useCallback(async () => {
    if (name) {
      await dispatch(payForWorker(name, paymentData));
      setPaymentData(defaultPaymentData);
    }
  }, [dispatch, name, paymentData]);

  const handlePaymentInfoClick = useCallback(
    async (id) => {
      setPaymentId(id);
      await dispatch(fetchPaymentsById(id));
      setIsModalOpen(true); // Open modal after fetching data
    },
    [dispatch]
  );
  useEffect(() => {
    if (isModalOpen && paymentDetails) {
      setPaymentData(paymentDetails);
    }
  }, [paymentDetails, isModalOpen]);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPaymentId(null);
    setPaymentData(defaultPaymentData);
  };

  const columns = useMemo(
    () => [
      { id: "id", Header: "ID", accessor: "id", minWidth: 300 },
      { id: "paidAt", Header: "Paid At", accessor: "paidAt" },
      { id: "amount", Header: "Amount", accessor: "amount" },
      {
        id: "paymentMethod",
        Header: "Payment Method",
        accessor: "paymentMethod",
      },
      {
        Header: "",
        filterable: false,
        sortable: false,
        resizable: false,
        Cell: (row) => (
          <button
            onClick={() => handlePaymentInfoClick(row.original.id)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <FaInfoCircle size={20} />
          </button>
        ),
      },
    ],
    [handlePaymentInfoClick]
  );

  if (loading) return <LoadingSpinner />;
  console.log(worker);
  return (
    <div>
      <TotalPaid
        totalPaid={payments.reduce((sum, payment) => sum + payment.amount, 0)}
        totalRequested={worker.totalMoneyAmountRequested}
        name={name}
      />
      <TableScreen
        title=""
        onInit={async () => {
          setLoading(true);
          await dispatch(getPaymentsByWorker(name));
          setLoading(false);
        }}
        onAddSubmit={handleSubmitPayment}
        columns={columns}
        data={payments}
        addForm={
          <PaymentForm paymentData={paymentData} onChange={setPaymentData} />
        }
      />
      <Modal
        title="Payment Details"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        showButtons={false}
        disabled={true}
      >
        <PaymentForm paymentData={paymentDetails} />
      </Modal>
    </div>
  );
};

export default WorkerBills;
