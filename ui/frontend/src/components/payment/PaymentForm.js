import React, { useState, useEffect } from "react";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Box,
  Alert,
  Fade,
  styled,
} from "@mui/material";
import { AmountSelector } from "@iyadmosa/react-library";
import DatePickerComponent from "../reusable/DatePickerComponent";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

const StyledDatePicker = styled(DatePickerComponent)(({ theme }) => ({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius,
    transition: "all 0.2s ease-in-out",
    height: "56px",
    fontSize: "1.1rem",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.01)",
    },
    "&.Mui-focused": {
      boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "1.1rem",
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiSelect-select": {
    padding: theme.spacing(2),
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.01)",
    },
    "&.Mui-focused": {
      boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
    },
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.01)",
    },
    "&.Mui-focused": {
      boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
    },
  },
}));

const PaymentForm = ({
  paymentData = {},
  onChange,
  disabled = false,
  hideAmount = false,
}) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    paidAt: new Date(),
    checkDate: new Date(),
    transactionDate: new Date(),
    currency: "NIS",
    ...paymentData,
  });

  useEffect(() => {
    if (paymentData) {
      setFormData((prev) => ({
        ...prev,
        ...paymentData,
        paidAt: paymentData.paidAt || new Date(),
        checkDate: paymentData.checkDate || new Date(),
        transactionDate: paymentData.transactionDate || new Date(),
        currency: paymentData.currency || "NIS",
      }));
    }
  }, [paymentData]);

  const paymentMethods = [
    {
      value: "BANK TRANSFER",
      label: "Bank Transfer",
      icon: "🏦",
    },
    {
      value: "CASH",
      label: "Cash",
      icon: "💵",
    },
    {
      value: "CHECK",
      label: "Check",
      icon: "📝",
    },
    {
      value: "CREDIT CARD",
      label: "Credit Card",
      icon: "💳",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedData);
    validateField(name, value);
    onChange(updatedData);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "bankAccount":
      case "bankBranch":
        if (formData.paymentMethod === "BANK TRANSFER" && !value) {
          newErrors[name] = `${name
            .replace(/([A-Z])/g, " $1")
            .trim()} is required`;
        } else {
          delete newErrors[name];
        }
        break;
      case "checkNumber":
      case "payeeName":
        if (formData.paymentMethod === "CHECK" && !value) {
          newErrors[name] = `${name
            .replace(/([A-Z])/g, " $1")
            .trim()} is required`;
        } else {
          delete newErrors[name];
        }
        break;
      case "cardHolderName":
        if (formData.paymentMethod === "CREDIT CARD" && !value) {
          newErrors[name] = "Card holder name is required";
        } else {
          delete newErrors[name];
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  function toCamelCase(phrase) {
    return phrase
      .toLowerCase()
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
        index === 0 ? letter.toLowerCase() : letter.toUpperCase()
      )
      .replace(/\s+/g, "");
  }

  const renderPaymentMethodFields = () => {
    const method = formData.paymentMethod?.toUpperCase();

    if (!method) return null;

    const fieldSets = {
      "BANK TRANSFER": [
        { name: "Bank Name", required: true },
        { name: "Transaction ID", required: true },
        { name: "Bank Account", required: true },
        { name: "Bank Branch", required: true },
      ],
      CHECK: [
        { name: "Check Number", required: true },
        { name: "Payee Name", required: true },
      ],
      "CREDIT CARD": [{ name: "Card Holder Name", required: true }],
    };

    const fields = fieldSets[method];
    if (!fields) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ mb: 2, fontWeight: 500 }}
        >{`${method.charAt(0)}${method
          .slice(1)
          .toLowerCase()} Details`}</Typography>
        <Grid container spacing={2}>
          {fields.map(({ name, required }) => {
            const camelName = toCamelCase(name);
            return (
              <Grid item xs={12} sm={6} key={name}>
                <StyledTextField
                  label={name}
                  name={camelName}
                  value={formData[camelName] || ""}
                  onChange={handleChange}
                  fullWidth
                  required={required}
                  disabled={disabled}
                  error={!!errors[camelName]}
                  helperText={errors[camelName]}
                />
              </Grid>
            );
          })}
          {method === "BANK TRANSFER" && (
            <DatePickerComponent
              label="Transaction Date"
              value={formData.transactionDate}
              onChange={(date) =>
                handleChange({
                  target: { name: "transactionDate", value: date },
                })
              }
              disabled={disabled}
            />
          )}
          {method === "CHECK" && (
            <DatePickerComponent
              label="Check Date"
              value={formData.checkDate}
              onChange={(date) =>
                handleChange({ target: { name: "checkDate", value: date } })
              }
              disabled={disabled}
            />
          )}
        </Grid>
      </Box>
    );
  };

  return (
    <StyledPaper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              color: "text.primary",
              fontWeight: 500,
              fontSize: "1.25rem",
            }}
          >
            Payment Details
          </Typography>
        </Grid>

        {!hideAmount && (
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ color: "text.secondary", mb: 1 }}
            >
              Payment Amount
            </Typography>
            <AmountSelector
              label="Amount"
              name="amount"
              amount={formData.amount || 0}
              onChange={(value) =>
                handleChange({ target: { name: "amount", value } })
              }
              fullWidth
              required
              disabled={disabled}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{
              color: "text.primary",
              mb: 1.5,
              fontSize: "1.1rem",
              fontWeight: 500,
            }}
          >
            Payment Date
          </Typography>
          <StyledDatePicker
            label="Select Date"
            value={formData.paidAt || new Date()}
            onChange={(date) =>
              handleChange({ target: { name: "paidAt", value: date } })
            }
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{
              color: "text.primary",
              mb: 1.5,
              fontSize: "1.1rem",
              fontWeight: 500,
            }}
          >
            Payment Method
          </Typography>
          <StyledFormControl fullWidth required>
            <InputLabel>Select Payment Method</InputLabel>
            <StyledSelect
              name="paymentMethod"
              value={formData.paymentMethod || ""}
              onChange={handleChange}
              disabled={disabled}
            >
              {paymentMethods.map(({ value, label, icon }) => (
                <MenuItem
                  key={value}
                  value={value}
                  sx={{
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <span
                    role="img"
                    aria-label={label}
                    style={{ fontSize: "1.2em" }}
                  >
                    {icon}
                  </span>
                  {label}
                </MenuItem>
              ))}
            </StyledSelect>
          </StyledFormControl>
        </Grid>

        {formData.paymentMethod === "CASH" && (
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{
                color: "text.primary",
                mb: 1.5,
                fontSize: "1.1rem",
                fontWeight: 500,
              }}
            >
              Currency
            </Typography>
            <StyledFormControl fullWidth>
              <InputLabel>Select Currency</InputLabel>
              <StyledSelect
                name="currency"
                value={formData.currency || "NIS"}
                onChange={handleChange}
                disabled={disabled}
              >
                {[
                  { value: "NIS", label: "NIS ₪", icon: "₪" },
                  { value: "USD", label: "USD $", icon: "$" },
                  { value: "EUR", label: "EUR €", icon: "€" },
                ].map(({ value, label, icon }) => (
                  <MenuItem
                    key={value}
                    value={value}
                    sx={{
                      py: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <span style={{ fontSize: "1.2em" }}>{icon}</span>
                    {label}
                  </MenuItem>
                ))}
              </StyledSelect>
            </StyledFormControl>
          </Grid>
        )}

        {renderPaymentMethodFields()}

        {Object.keys(errors).length > 0 && (
          <Grid item xs={12}>
            <Fade in>
              <Alert severity="error" sx={{ mt: 1 }}>
                Please fill in all required fields correctly
              </Alert>
            </Fade>
          </Grid>
        )}
      </Grid>
    </StyledPaper>
  );
};

export default PaymentForm;
