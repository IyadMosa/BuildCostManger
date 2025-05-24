import React, { useEffect, useMemo, useState } from "react";
import { LoadingSpinner, Table, TotalPaid } from "@iyadmosa/react-library";
import { getAllWorkers } from "../actions/workerAction";
import { useDispatch, useSelector } from "react-redux";
import { getAllShops } from "../actions/shopAction";
import OrderedChecksDisplay from "./payment/OrderedChecksDisplay";
import { getPayments } from "../actions/paymentAction";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllWorkers());
      await dispatch(getAllShops());
      await dispatch(getPayments());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);
  const workers = useSelector((state) => state.workerTable.workers) || [];
  const shops = useSelector((state) => state.shops.shops) || [];
  const payments = useSelector((state) => state.payments.payments) || [];

  const workersColumns = useMemo(
    () => [
      { id: "name", Header: "Name", accessor: "name" },
      {
        id: "requested",
        Header: "Requested",
        accessor: "totalMoneyAmountRequested",
      },
      { id: "paid", Header: "Paid", accessor: "totalMoneyAmountPaid" },
    ],
    []
  );

  const shopColumns = useMemo(
    () => [
      { id: "name", Header: "Name", accessor: "name" },
      {
        id: "requested",
        Header: "Requested",
        accessor: "totalMoneyAmountRequested",
      },
      { id: "paid", Header: "Paid", accessor: "totalMoneyAmountPaid" },
    ],
    []
  );

  const getOrderedChecksImproved = (payments) => {
    if (!Array.isArray(payments)) {
      throw new Error("Input must be an array of payments.");
    }

    const checks = payments.filter(
      (payment) => payment.paymentMethod.toUpperCase() === "CHECK"
    );

    // Create a new array with the sorted checks to avoid mutating the original array.
    const sortedChecks = [...checks].sort((a, b) => {
      const dateA = a.checkDate ? new Date(a.checkDate) : null;
      const dateB = b.checkDate ? new Date(b.checkDate) : null;

      if (dateA === null && dateB === null) return 0; // Both null, maintain order
      if (dateA === null) return -1; // a is null, put it first
      if (dateB === null) return 1; // b is null, put it first

      return dateA - dateB; // Compare valid dates
    });

    return sortedChecks;
  };
  const orderedChecks = useMemo(() => {
    return getOrderedChecksImproved(payments); // Call the improved function
  }, [payments]);

  if (loading) return <LoadingSpinner />;
  return (
    <div>
      <TotalPaid
        totalPaid={payments.reduce((sum, payment) => sum + payment.amount, 0)}
        totalRequested={[]}
        name={"Total"}
      />
      <OrderedChecksDisplay orderedChecks={orderedChecks} />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Table tableTitle={"Workers"} columns={workersColumns} data={workers} />
        <Table tableTitle={"Shops"} columns={shopColumns} data={shops} />
      </div>
    </div>
  );
};

export default Dashboard;
