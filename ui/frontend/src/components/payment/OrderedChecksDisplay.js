import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import styled from "styled-components";

const TicketContainer = styled(Box)`
  display: flex;
  overflow-x: auto;
  padding-top: 16px;
  flex-direction: column; // To allow space for the title
`;

const TicketGroup = styled(Box)`
  display: flex; // Arrange tickets horizontally within the group
  overflow-x: auto;
  padding-bottom: 16px;
`;

const Ticket = styled(Paper)`
  padding: 16px;
  margin-right: 8px;
  width: fit-content;
  min-width: 250px;
  border: 1px solid #ccc; // Add border to the ticket
  background-color: ${({ isNext10Days, inFuture }) =>
    inFuture
      ? "lightblue"
      : isNext10Days
      ? "lightcoral"
      : "lightgreen"} !important;
  flex-shrink: 0;
`;

const OrderedChecksDisplay = ({ orderedChecks }) => {
  const today = new Date();
  const next10Days = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 10
  );

  return (
    <TicketContainer>
      <Typography variant="h5" gutterBottom>
        {" "}
        {/* Group Title */}
        Checks
      </Typography>
      <TicketGroup>
        {" "}
        {/* Tickets container */}
        {orderedChecks.map((check, index) => {
          const checkDateString = check.checkDate;
          const checkDate = checkDateString ? new Date(checkDateString) : null;
          const isNext10Days =
            checkDate && checkDate <= next10Days && checkDate >= today;
          const isPast = checkDate && checkDate < today;

          return (
            <Ticket
              key={index}
              isNext10Days={isNext10Days && !isPast}
              inFuture={!isNext10Days && !isPast}
            >
              <Typography variant="h6" noWrap>
                Check #{check.checkNumber || "N/A"}
              </Typography>
              <Typography>Amount: {check.amount || "N/A"}</Typography>
              <Typography>
                Check Date: {checkDate?.toLocaleDateString() || "N/A"}
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
