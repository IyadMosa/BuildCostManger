import React from "react";
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
import DatePickerComponent from "../reusable/DatePickerComponent";

const PaymentForm = ({ paymentData = {}, onChange, disabled = false }) => {
  paymentData.paidAt ??= new Date();
  paymentData.checkDate ??= new Date();
  paymentData.transactionDate ??= new Date();
  paymentData.currency ??= "NIS";
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

  function toCamelCase(phrase) {
    return phrase
      .toLowerCase() // Convert to lowercase
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
        return index === 0 ? letter.toLowerCase() : letter.toUpperCase(); // Capitalize first letter of each word except the first
      })
      .replace(/\s+/g, ""); // Remove all spaces
  }

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <AmountSelector
              label="Amount"
              name="amount"
              amount={paymentData?.amount || 0}
              onChange={(value) =>
                onChange((prevData) => ({ ...prevData, amount: value }))
              }
              fullWidth
              required
              disabled={disabled}
            />
          </Grid>
          <DatePickerComponent
            label="Paid At"
            value={paymentData?.paidAt}
            onChange={(date) => onChange({ ...paymentData, paidAt: date })}
            disabled={disabled}
          />

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
            if (paymentData.paymentMethod?.toUpperCase() === method) {
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
                            name={toCamelCase(field)}
                            value={paymentData[toCamelCase(field)]}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={disabled}
                          />
                        </Grid>
                      ))}
                      <DatePickerComponent
                        label="Transaction Date"
                        value={paymentData?.transactionDate}
                        onChange={(date) =>
                          onChange({ ...paymentData, transactionDate: date })
                        }
                        disabled={disabled}
                      />
                    </>
                  )}
                  {method === "CASH" && (
                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel>Currency</InputLabel>
                        <Select
                          name="currency"
                          value={paymentData?.currency || "NIS"}
                          onChange={handleChange}
                          disabled={disabled}
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
                      {["Check Number", "Payee Name"].map((field) => (
                        <Grid item xs={12} sm={6} key={field}>
                          <TextField
                            label={field}
                            name={toCamelCase(field)}
                            value={paymentData[toCamelCase(field)]}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={disabled}
                          />
                        </Grid>
                      ))}
                      <DatePickerComponent
                        label="CHECK Date"
                        value={paymentData?.checkDate}
                        onChange={(date) =>
                          onChange({ ...paymentData, checkDate: date })
                        }
                        disabled={disabled}
                      />
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
                          disabled={disabled}
                        />
                      </Grid>
                      <DatePickerComponent
                        label="Transaction Date"
                        value={paymentData?.transactionDate}
                        onChange={(date) =>
                          onChange({ ...paymentData, transactionDate: date })
                        }
                        disabled={disabled}
                      />
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
