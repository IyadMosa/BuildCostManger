import React, { useEffect, useMemo, useState } from "react";
import { LoadingSpinner, Table, TotalPaid } from "@iyadmosa/react-library";
import { getAllWorkers } from "../../actions/workerAction";
import { useDispatch, useSelector } from "react-redux";
import { getAllShops } from "../../actions/shopAction";
import { getPayments } from "../../actions/paymentAction";
import CheckPaymentsByMonth from "../payment/CheckPaymentsByMonth";
import { CardContainer, CardsWrapper, Container, TablesWrapper } from "./style";

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
    <Container>
      <CardsWrapper>
        <CardContainer>
          <TotalPaid
            name="workers"
            totalPaid={workers.reduce(
              (sum, w) => sum + w.totalMoneyAmountPaid,
              0
            )}
            totalRequested={workers.reduce(
              (sum, w) => sum + w.totalMoneyAmountRequested,
              0
            )}
          />
        </CardContainer>
        <CardContainer>
          <TotalPaid
            name="shops"
            totalPaid={shops.reduce(
              (sum, w) => sum + w.totalMoneyAmountPaid,
              0
            )}
            totalRequested={shops.reduce(
              (sum, s) => sum + s.totalMoneyAmountRequested,
              0
            )}
          />
        </CardContainer>
      </CardsWrapper>

      <CheckPaymentsByMonth payments={payments} />

      <TablesWrapper>
        <Table tableTitle="Workers" columns={workersColumns} data={workers} />
        <Table tableTitle="Shops" columns={shopColumns} data={shops} />
      </TablesWrapper>
    </Container>
  );
};

export default Dashboard;
