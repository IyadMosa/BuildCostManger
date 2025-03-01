import { useParams } from "react-router-dom";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LoadingSpinner,
  Modal,
  TableWithAddForm,
  TotalPaid,
} from "@iyadmosa/react-library";
import {
  fetchPaymentsById,
  getPaymentsByShop,
  payForShop,
} from "../../actions/paymentAction";
import PaymentForm from "../payment/PaymentForm";
import { FaInfoCircle } from "react-icons/fa";
import OrderedChecksDisplay from "../payment/OrderedChecksDisplay";
import {
  fetchMaterialById,
  getAllMaterialsByShop,
  purchaseMaterial,
} from "../../actions/materialAction";
import MaterialForm from "./MaterialForm";

const ShopBills = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [materialDetails, setMaterialDetails] = useState({});
  const [totalCost, setTotalCost] = useState(0);

  const payments = useSelector((state) => state.payments.shopPayments) || [];
  const materials =
    useSelector((state) => state.materialsTable.materials) || [];

  const paymentInfo =
    useSelector((state) => state.payments.paymentDetails) || {};
  const materialInfo =
    useSelector((state) => state.materialsTable.material) || {};

  const fetchShopData = useCallback(async () => {
    setLoading(true);
    await dispatch(getPaymentsByShop(name));
    await dispatch(getAllMaterialsByShop(name));
    setLoading(false);
  }, [dispatch, name]);

  useEffect(() => {
    fetchShopData();
  }, [fetchShopData]);

  const handleSubmitPayment = useCallback(async () => {
    if (name) {
      await dispatch(payForShop(name, paymentDetails));
      setPaymentDetails({});
      await fetchShopData(); // Refresh data after submitting payment
    }
  }, [dispatch, name, paymentDetails, fetchShopData]);

  const handleSubmitMaterial = useCallback(async () => {
    if (name) {
      await dispatch(purchaseMaterial(name, materialDetails));
      setMaterialDetails({});
      await fetchShopData(); // Refresh data after submitting material
    }
  }, [dispatch, name, materialDetails, fetchShopData]);

  const handlePaymentInfoClick = useCallback(
    async (id) => {
      await dispatch(fetchPaymentsById(id));
      setIsModalOpen(true);
    },
    [dispatch]
  );
  const handleMaterialInfoClick = useCallback(
    async (id) => {
      await dispatch(fetchMaterialById(id));
      setIsMaterialModalOpen(true);
    },
    [dispatch]
  );

  useEffect(() => {
    if (isModalOpen && paymentInfo) {
      setPaymentDetails(paymentInfo);
    }
  }, [paymentInfo, isModalOpen]);

  useEffect(() => {
    const calculatedTotalCost = materials.reduce(
      (sum, material) => sum + (material.totalCost || 0),
      0
    );
    setTotalCost(calculatedTotalCost);
  }, [materials]);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsMaterialModalOpen(false);
    setPaymentDetails({});
    setMaterialDetails({});
  };

  const columns = useMemo(
    () => [
      {
        id: "id",
        Header: "ID",
        accessor: "id",
        minWidth: 200,
        maxWidth: 400,
      },
      { id: "paidAt", Header: "Paid At", accessor: "paidAt" },
      { id: "amount", Header: "Amount", accessor: "amount" },
      {
        id: "paymentMethod",
        Header: "Payment Method",
        accessor: "paymentMethod",
      },
      {
        maxWidth: 50,
        filterable: false,
        sortable: false,
        Cell: (row) => (
          <button
            onClick={() => handlePaymentInfoClick(row.original.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <FaInfoCircle size={20} />
          </button>
        ),
      },
    ],
    [handlePaymentInfoClick]
  );

  const materialsColumns = useMemo(
    () => [
      {
        id: "id",
        Header: "ID",
        accessor: "id",
        minWidth: 200,
        maxWidth: 400,
      },
      { id: "date", Header: "Date", accessor: "date" },
      { id: "name", Header: "Name", accessor: "name" },
      {
        id: "totalCost",
        Header: "Total Cost",
        accessor: "totalCost",
      },
      {
        maxWidth: 50,
        filterable: false,
        sortable: false,
        Cell: (row) => (
          <button
            onClick={() => handleMaterialInfoClick(row.original.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <FaInfoCircle size={20} />
          </button>
        ),
      },
    ],
    [handlePaymentInfoClick]
  );

  const orderedChecks = useMemo(
    () =>
      payments
        .filter((p) => p.paymentMethod?.toUpperCase() === "CHECK")
        .sort(
          (a, b) => new Date(a.checkDate || 0) - new Date(b.checkDate || 0)
        ),
    [payments]
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <TotalPaid
        totalPaid={payments.reduce((sum, payment) => sum + payment.amount, 0)}
        totalRequested={totalCost}
        name={name}
      />
      <OrderedChecksDisplay orderedChecks={orderedChecks} />

      <div style={{ display: "flex", gap: "20px", width: "100%" }}>
        <TableWithAddForm
          tableTitle="Payments"
          data={payments}
          columns={columns}
          modelTitle="Add Payment"
          addForm={
            <PaymentForm
              paymentData={paymentDetails}
              onChange={setPaymentDetails}
            />
          }
          onAddSubmit={handleSubmitPayment}
        />
        <TableWithAddForm
          tableTitle="Materials"
          data={materials}
          columns={materialsColumns}
          modelTitle="Add Material"
          addForm={
            <MaterialForm
              material={materialDetails}
              onChange={setMaterialDetails}
            />
          }
          onAddSubmit={handleSubmitMaterial}
        />
      </div>

      <Modal
        title="Payment Details"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        showButtons={false}
        disabled
      >
        <PaymentForm paymentData={paymentInfo} onChange={setPaymentDetails} />
      </Modal>

      <Modal
        title="Material Details"
        isOpen={isMaterialModalOpen}
        onClose={handleCloseModal}
        showButtons={false}
        disabled
      >
        <MaterialForm material={materialInfo} onChange={setMaterialDetails} />
      </Modal>
    </div>
  );
};

export default ShopBills;
