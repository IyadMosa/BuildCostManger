import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import styled from "styled-components";

const TicketContainer = styled(Box)`
  display: flex;
  overflow-x: auto;
  padding-top: 16px;
  flex-direction: column;
`;

const TicketGroup = styled(Box)`
  display: flex;
  overflow-x: auto;
`;

const Ticket = styled(Paper)`
  padding: 16px;
  margin-right: 8px;
  width: fit-content;
  min-width: 250px;
  border: 1px solid #ccc;
  background-color: ${({ isCurrentMonth, isNextMonth, isPast }) => {
    if (isPast) {
      return "lightgreen"; // Green for past
    } else if (isCurrentMonth) {
      return "lightcoral"; // Red for current month
    } else if (isNextMonth) {
      return "lightblue"; // Blue for next month
    } else {
      return "lightgray";
    }
  }} !important;
  flex-shrink: 0;
`;

const OrderedChecksDisplay = ({ orderedChecks }) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  return (
    <TicketContainer>
      <Typography variant="h5" gutterBottom>
        Checks
      </Typography>
      <TicketGroup>
        {orderedChecks.map((check, index) => {
          const checkDateString = check.checkDate;
          const checkDate = checkDateString ? new Date(checkDateString) : null;

          if (!checkDate) {
            return null;
          }

          const checkMonth = checkDate.getMonth();
          const checkYear = checkDate.getFullYear();

          const isCurrentMonth =
            checkYear === currentYear && checkMonth === currentMonth;
          const isNextMonth =
            (checkYear === currentYear && checkMonth === currentMonth + 1) ||
            (checkYear === currentYear + 1 && checkMonth === 0);
          const isPast = checkDate < today; // Check if the date is in the past

          return (
            <Ticket
              key={index}
              isCurrentMonth={isCurrentMonth}
              isNextMonth={isNextMonth}
              isPast={isPast} // Pass the isPast prop
            >
              <Typography variant="h6" noWrap>
                Check #{check.checkNumber || "N/A"}
              </Typography>
              <Typography>Amount: {check.amount || "N/A"}</Typography>
              <Typography>
                Check Date: {checkDate?.toLocaleDateString("en-GB") || "N/A"}
              </Typography>
              <Typography>Owner: {check.payeeName || "N/A"}</Typography>
            </Ticket>
          );
        })}
      </TicketGroup>
    </TicketContainer>
  );
};

export default OrderedChecksDisplay;
