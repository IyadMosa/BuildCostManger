import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingSpinner, Modal, TableScreen } from "@iyadmosa/react-library";
import AddShopForm from "./AddShopForm";
import { FaCubes, FaDollarSign, FaFileInvoiceDollar } from "react-icons/fa";
import PaymentForm from "../payment/PaymentForm";
import { payForShop } from "../../actions/paymentAction";
import { useNavigate } from "react-router-dom";
import { addShop, getAllShops } from "../../actions/shopAction";
import MaterialForm from "./MaterialForm";
import { purchaseMaterial } from "../../actions/materialAction";

const Shops = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initial State Constants
  const initialShopState = {
    id: "",
    name: "",
    shopOwner: "",
    location: "",
    phoneNumber: "",
    totalMoneyAmountRequested: "",
  };

  const initialPaymentData = {
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

  const initialMaterialData = {
    name: null,
    description: null,
    price: null,
    unit: null,
    quantity: null,
    totalCost: null,
  };

  // State Hooks
  const [shop, setShop] = useState(initialShopState);
  const [paymentData, setPaymentData] = useState(initialPaymentData);
  const [material, setMaterial] = useState(initialMaterialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [shopName, setShopName] = useState(null);
  const [loading, setLoading] = useState(true);

  const shops = useSelector((state) => state.shops.shops) || [];

  // Fetch shops on component mount
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllShops());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  // Navigate to shop bills page
  const handleGetBillsClick = useCallback(
    (name) => {
      navigate(`/shop-bills/${encodeURIComponent(name)}`);
    },
    [navigate]
  );

  // Open payment modal
  const handlePaymentClick = useCallback((name) => {
    setShopName(name);
    setIsModalOpen(true);
  }, []);

  const handleMaterialClick = useCallback((name) => {
    setShopName(name);
    setIsMaterialModalOpen(true);
  }, []);

  // Handle payment submission
  const handleSubmitPayment = async () => {
    if (shopName) {
      await dispatch(payForShop(shopName, paymentData));
      setShopName(null);
      setIsModalOpen(false);
    }
  };

  const handleSubmitMaterial = async () => {
    if (shopName) {
      await dispatch(purchaseMaterial(shopName, material));
      setShopName(null);
      setIsMaterialModalOpen(false);
    }
  };

  // Table Columns
  const columns = useMemo(
    () => [
      { id: "name", Header: "Name", accessor: "name" },
      { id: "shopOwner", Header: "Shop Owner", accessor: "shopOwner" },
      { id: "location", Header: "Location", accessor: "location" },
      { id: "phoneNumber", Header: "Phone Number", accessor: "phoneNumber" },
      {
        Header: "",
        filterable: false,
        sortable: false,
        resizable: false,
        Cell: (row) => (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => handleMaterialClick(row.original.name)}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <FaCubes size={20} />
            </button>
            <button
              onClick={() => handlePaymentClick(row.original.name)}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <FaDollarSign size={20} />
            </button>
            <button
              onClick={() => {
                handleGetBillsClick(row.original.name);
              }}
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

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <TableScreen
        title="Shop Management"
        onInit={async () => {
          setLoading(true);
          await dispatch(getAllShops());
          setLoading(false);
        }}
        onAddSubmit={() => dispatch(addShop(shop))}
        columns={columns}
        data={shops}
        addForm={<AddShopForm shop={shop} onChange={setShop} />}
      />

      <Modal
        title="Payment Modal"
        isOpen={isModalOpen}
        onSubmit={handleSubmitPayment}
        onClose={() => {
          setIsModalOpen(false);
          setShopName(null);
        }}
      >
        <PaymentForm paymentData={paymentData} onChange={setPaymentData} />
      </Modal>
      <Modal
        title="Material Modal"
        isOpen={isMaterialModalOpen}
        onSubmit={handleSubmitMaterial}
        onClose={() => {
          setIsMaterialModalOpen(false);
          setShopName(null);
        }}
      >
        <MaterialForm material={material} onChange={setMaterial} />
      </Modal>
    </div>
  );
};

export default Shops;
