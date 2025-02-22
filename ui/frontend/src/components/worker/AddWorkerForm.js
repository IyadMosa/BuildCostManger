import React from "react";
import {
  Box,
  Grid,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import styled from "styled-components";
import ReactInputMask from "react-input-mask";

const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AddWorkerForm = ({
  worker = {},
  onChange,
  specialties = [],
  isEdit,
  disabled,
}) => {
  const handleChange = (field, value) => {
    onChange((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    handleChange("totalMoneyAmountRequested", value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormContainer component="form">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Name"
              name="name"
              value={worker?.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              fullWidth
              disabled={isEdit || disabled}
            />
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth required>
              <InputLabel id="specialty-label">Specialty</InputLabel>
              <Select
                labelId="specialty-label"
                value={worker?.specialty || ""}
                onChange={(e) => handleChange("specialty", e.target.value)}
                displayEmpty
                disabled={isEdit || disabled}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                      overflowY: "auto",
                      whiteSpace: "normal",
                      paddingLeft: "15px",
                    },
                  },
                }}
              >
                {specialties.map((specialty, index) => (
                  <MenuItem
                    key={index}
                    value={specialty}
                    style={{ display: "block", whiteSpace: "normal" }}
                  >
                    {specialty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Total Money Amount Requested"
              name="totalMoneyAmountRequested"
              value={worker?.totalMoneyAmountRequested || ""}
              onChange={handleAmountChange}
              required
              fullWidth
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={6}>
            <ReactInputMask
              mask="0599999999"
              value={worker?.phoneNumber || ""}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              disabled={isEdit || disabled}
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  label="Phone Number"
                  name="phoneNumber"
                  required
                  fullWidth
                  inputMode="tel"
                  type="tel"
                  error={
                    !!worker.phoneNumber &&
                    !/^05\d{8}$/.test(worker.phoneNumber)
                  }
                  helperText={
                    worker.phoneNumber && !/^05\d{8}$/.test(worker.phoneNumber)
                      ? "Invalid phone number"
                      : ""
                  }
                  disabled={isEdit || disabled}
                />
              )}
            </ReactInputMask>
          </Grid>

          <Grid item xs={6}>
            <DatePicker
              label="Started On"
              value={worker?.startedOn || null}
              onChange={(date) => handleChange("startedOn", date)}
              renderInput={(params) => (
                <TextField {...params} fullWidth required />
              )}
              disabled={isEdit || disabled}
            />
          </Grid>

          <Grid item xs={6}>
            <DatePicker
              label="Ended On"
              value={worker?.endedOn || null}
              onChange={(date) => handleChange("endedOn", date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </FormContainer>
    </LocalizationProvider>
  );
};

export default AddWorkerForm;
