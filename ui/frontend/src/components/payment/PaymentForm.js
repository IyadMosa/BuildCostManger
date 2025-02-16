import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";

const PaymentForm = ({ paymentData = {}, onChange }) => {
  const paymentMethods = [
    "BANK TRANSFER",
    "CASH",
    "CHECK",
    "CREDIT CARD",
  ].map((method) => method.toUpperCase());
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    onChange((prevData) => ({
      ...prevData,
      amount: value,
    }));
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Paid At"
                value={paymentData.paidAt}
                onChange={(date) => onChange({ ...paymentData, paidAt: date })}
                renderInput={(params) => (
                  <TextField {...params} fullWidth required />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Amount"
              name="amount"
              value={paymentData.amount}
              onChange={handleAmountChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Payment Method</InputLabel>
              <Select
                name="paymentMethod"
                value={paymentData.paymentMethod}
                onChange={handleChange}
              >
                {paymentMethods.map((method, index) => (
                  <MenuItem
                    key={index}
                    value={method === "Select Payment Method" ? "" : method}
                    style={{
                      display: "block",
                      whiteSpace: "normal",
                      paddingLeft: "10px",
                    }}
                  >
                    {method}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {paymentData.paymentMethod === "BANK TRANSFER" && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Bank Name"
                  name="bankName"
                  value={paymentData.bankName}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Transaction ID"
                  name="transactionId"
                  value={paymentData.transactionId}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Bank Account"
                  name="bankAccount"
                  value={paymentData.bankAccount}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Bank Branch"
                  name="bankBranch"
                  value={paymentData.bankBranch}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Transaction Date"
                    value={paymentData.transactionDate}
                    onChange={(date) =>
                      onChange({ ...paymentData, transactionDate: date })
                    }
                    renderInput={(params) => (
                      <TextField {...params} fullWidth required />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </>
          )}

          {paymentData.paymentMethod === "CASH" && (
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Currency</InputLabel>
                <Select
                  name="currency"
                  value={paymentData.currency}
                  onChange={handleChange}
                >
                  {["NIS", "Dollar", "Euro"].map((method, index) => (
                    <MenuItem
                      key={index}
                      value={method === "Select Payment Method" ? "" : method}
                      style={{
                        display: "block",
                        whiteSpace: "normal",
                        paddingLeft: "10px",
                      }}
                    >
                      {method}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {paymentData.paymentMethod === "CHECK" && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="CHECK Number"
                  name="checkNumber"
                  value={paymentData.checkNumber}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Payee Name"
                  name="payeeName"
                  value={paymentData.payeeName}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="CHECK Date"
                    value={paymentData.checkDate}
                    onChange={(date) =>
                      onChange({ ...paymentData, checkDate: date })
                    }
                    renderInput={(params) => (
                      <TextField {...params} fullWidth required />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </>
          )}

          {paymentData.paymentMethod === "CREDIT CARD" && (
            <>
              <Grid item xs={12}>
                <TextField
                  label="Card Holder Name"
                  name="cardHolderName"
                  value={paymentData.cardHolderName}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Transaction Date"
                    value={paymentData.transactionDate}
                    onChange={(date) =>
                      onChange({ ...paymentData, transactionDate: date })
                    }
                    renderInput={(params) => (
                      <TextField {...params} fullWidth required />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </>
          )}
        </Grid>
      </form>
    </Paper>
  );
};

export default PaymentForm;
