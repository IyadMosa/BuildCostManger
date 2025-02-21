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
import { AmountSelector } from "@iyadmosa/react-library";

const PaymentForm = ({ paymentData = {}, onChange, disabled = false }) => {
  const paymentMethods = [
    "Bank Transfer",
    "Cash",
    "Check",
    "Credit Card",
  ].map((method) => method.toUpperCase());

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    onChange((prevData) => ({ ...prevData, [name]: date }));
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <AmountSelector
              label="Amount"
              name="amount"
              amount={paymentData.amount}
              onChange={(value) =>
                onChange((prevData) => ({ ...prevData, amount: value }))
              }
              fullWidth
              required
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Paid At"
                value={paymentData.paidAt}
                onChange={(date) => handleDateChange("paidAt", date)} // Use consistent date handling
                renderInput={(params) => (
                  <TextField {...params} fullWidth required />
                )}
                disabled={disabled}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Payment Method</InputLabel>
              <Select
                name="paymentMethod"
                value={paymentData.paymentMethod?.toUpperCase()}
                onChange={handleChange}
                disabled={disabled}
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

          {/* Conditional Rendering - Refactored for clarity and conciseness */}
          {["BANK TRANSFER", "CASH", "CHECK", "CREDIT CARD"].map((method) => {
            if (paymentData.paymentMethod === method) {
              return (
                <React.Fragment key={method}>
                  {" "}
                  {/* Key for Fragment */}
                  {method === "BANK TRANSFER" && (
                    <>
                      {[
                        "Bank Name",
                        "Transaction ID",
                        "Bank Account",
                        "Bank Branch",
                      ].map((field) => (
                        <Grid item xs={12} sm={6} key={field}>
                          <TextField
                            label={field}
                            name={field.toLowerCase().replace(" ", "")}
                            value={
                              paymentData[field.toLowerCase().replace(" ", "")]
                            }
                            onChange={handleChange}
                            fullWidth
                            required
                          />
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Transaction Date"
                            value={paymentData.transactionDate}
                            onChange={(date) =>
                              handleDateChange("transactionDate", date)
                            }
                            renderInput={(params) => (
                              <TextField {...params} fullWidth required />
                            )}
                          />
                        </LocalizationProvider>
                      </Grid>
                    </>
                  )}
                  {method === "CASH" && (
                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel>Currency</InputLabel>
                        <Select
                          name="currency"
                          value={paymentData.currency}
                          onChange={handleChange}
                        >
                          {["NIS", "Dollar", "Euro"].map((currency) => (
                            <MenuItem key={currency} value={currency}>
                              {currency}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                  {method === "CHECK" && (
                    <>
                      {["CHECK Number", "Payee Name"].map((field) => (
                        <Grid item xs={12} sm={6} key={field}>
                          <TextField
                            label={field}
                            name={field.toLowerCase().replace(" ", "")}
                            value={
                              paymentData[field.toLowerCase().replace(" ", "")]
                            }
                            onChange={handleChange}
                            fullWidth
                            required
                          />
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="CHECK Date"
                            value={paymentData.checkDate}
                            onChange={(date) =>
                              handleDateChange("checkDate", date)
                            }
                            renderInput={(params) => (
                              <TextField {...params} fullWidth required />
                            )}
                          />
                        </LocalizationProvider>
                      </Grid>
                    </>
                  )}
                  {method === "CREDIT CARD" && (
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
                              handleDateChange("transactionDate", date)
                            }
                            renderInput={(params) => (
                              <TextField {...params} fullWidth required />
                            )}
                          />
                        </LocalizationProvider>
                      </Grid>
                    </>
                  )}
                </React.Fragment>
              );
            }
            return null;
          })}
        </Grid>
      </form>
    </Paper>
  );
};

export default PaymentForm;
