import React, { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { TableContainer, Table, Th, Td } from "./style";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CheckPaymentsByMonth = ({ payments }) => {
  const checksByMonth = useMemo(() => {
    const result = Array.from({ length: 12 }, () => []);
    payments
      .filter((p) => p.paymentMethod === "Check" && p.checkDate)
      .forEach((p) => {
        const date = parseISO(p.checkDate);
        const monthIdx = date.getMonth();
        result[monthIdx].push(p);
      });
    return result;
  }, [payments]);

  // Get the maximum number of rows (checks in a month)
  const maxChecks = Math.max(...checksByMonth.map((list) => list.length));

  return (
    <TableContainer>
      <h2 className="text-xl font-bold mb-4 text-center">Checks per Month</h2>

      <Table>
        <thead>
          <tr>
            {checksByMonth.map((checks, idx) => {
              const total = checks.reduce((sum, p) => sum + (p.amount || 0), 0);
              return (
                <Th key={idx}>
                  <div className="font-semibold">{monthNames[idx]}</div>
                  <div className="text-sm text-gray-500">{total} NIS</div>
                </Th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxChecks }, (_, rowIndex) => (
            <tr key={rowIndex}>
              {checksByMonth.map((checks, colIndex) => {
                const check = checks[rowIndex];
                return (
                  <Td key={colIndex}>
                    {check ? (
                      <>
                        <div className="font-medium">#{check.checkNumber}</div>
                        <div className="text-xs text-gray-600">
                          {check.payeeName} —{" "}
                          {format(parseISO(check.checkDate), "dd MMM yyyy")}
                          <br />
                          {check.amount} NIS
                        </div>
                      </>
                    ) : null}
                  </Td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default CheckPaymentsByMonth;
