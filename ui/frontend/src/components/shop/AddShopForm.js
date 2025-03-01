import React from "react";
import { Box, Grid, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import styled from "styled-components";
import ReactInputMask from "react-input-mask";

const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AddShopForm = ({ shop = {}, onChange, isEdit, disabled }) => {
  // Handle input change
  const handleChange = (field, value) => {
    onChange({ ...shop, [field]: value });
  };

  // Phone number validation
  const isPhoneNumberValid =
    shop.phoneNumber && !/^05\d{8}$/.test(shop.phoneNumber);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormContainer component="form">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Name"
              name="name"
              value={shop?.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              fullWidth
              disabled={isEdit || disabled}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Shop Owner"
              name="shopOwner"
              value={shop?.shopOwner || ""}
              onChange={(e) => handleChange("shopOwner", e.target.value)}
              required
              fullWidth
              disabled={isEdit || disabled}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Location"
              name="location"
              value={shop?.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
              required
              fullWidth
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={6}>
            <ReactInputMask
              mask="0599999999"
              value={shop?.phoneNumber || ""}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              disabled={disabled}
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
                  error={!!isPhoneNumberValid}
                  helperText={isPhoneNumberValid ? "Invalid phone number" : ""}
                />
              )}
            </ReactInputMask>
          </Grid>
        </Grid>
      </FormContainer>
    </LocalizationProvider>
  );
};

export default AddShopForm;
