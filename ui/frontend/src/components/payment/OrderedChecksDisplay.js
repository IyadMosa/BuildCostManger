import React from "react";
import { Box, LinearProgress, Paper, Typography } from "@mui/material";
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

  // Calculate progress
  const totalAmount = orderedChecks.reduce(
    (sum, check) => sum + (check.amount || 0),
    0
  );
  const passedAmount = orderedChecks.reduce((sum, check) => {
    const checkDateString = check.checkDate;
    const checkDate = checkDateString ? new Date(checkDateString) : null;
    const isPast = checkDate && checkDate < today;
    return isPast ? sum + (check.amount || 0) : sum;
  }, 0);
  const progressPercentage =
    totalAmount === 0 ? 0 : (passedAmount / totalAmount) * 100;

  return (
    <TicketContainer>
      <Box display="flex" alignItems="center" gap={2}>
        {" "}
        {/* Use gap for spacing */}
        <Typography variant="h5" fontWeight="medium">
          {" "}
          {/* Slightly bolder font weight */}
          Checks:
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{
            width: "300px",
            height: "15px",
            borderRadius: "8px", // More rounded corners
            backgroundColor: "#e0e0e0", // Subtle track color
            "& .MuiLinearProgress-bar": {
              backgroundColor:
                progressPercentage < 100
                  ? progressPercentage < 50
                    ? "#ff9800" // More vibrant orange
                    : "#4caf50" // Material Design green
                  : "#4caf50",
              borderRadius: "8px", // Match rounded corners of the track
            },
          }}
        />
        <Typography variant="body2" color="text.secondary">
          {" "}
          {/* Use color from theme */}
          {progressPercentage.toFixed(0)}%
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {passedAmount} / {totalAmount}
        </Typography>
      </Box>
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
