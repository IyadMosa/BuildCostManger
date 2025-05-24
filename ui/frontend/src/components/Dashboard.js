import React, { useEffect, useMemo, useState } from "react";
import { LoadingSpinner, Table, TotalPaid } from "@iyadmosa/react-library";
import { getAllWorkers } from "../actions/workerAction";
import { useDispatch, useSelector } from "react-redux";
import { getAllShops } from "../actions/shopAction";
import { getPayments } from "../actions/paymentAction";
import CheckPaymentsByMonth from "./payment/CheckPaymentsByMonth";

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

  if (loading) return <LoadingSpinner />;
  return (
    <div>
      <div>
        <TotalPaid
          name={"workers"}
          totalPaid={workers.reduce(
            (sum, worker) => sum + worker.totalMoneyAmountPaid,
            0
          )}
          totalRequested={workers.reduce(
            (sum, worker) => sum + worker.totalMoneyAmountRequested,
            0
          )}
        />
        <TotalPaid
          name={"shops"}
          totalPaid={payments.reduce((sum, payment) => sum + payment.amount, 0)}
          totalRequested={shops.reduce(
            (sum, shop) => sum + shop.totalMoneyAmountRequested,
            0
          )}
        />
        <CheckPaymentsByMonth payments={payments} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Table tableTitle={"Workers"} columns={workersColumns} data={workers} />
        <Table tableTitle={"Shops"} columns={shopColumns} data={shops} />
      </div>
    </div>
  );
};

export default Dashboard;
