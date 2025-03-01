import React, { useEffect, useState } from "react";
import { Box, Grid, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import styled from "styled-components";
import DatePickerComponent from "../reusable/DatePickerComponent";

const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MaterialForm = ({ material = {}, onChange, isEdit, disabled }) => {
  material.date ??= new Date();
  material.unit ??= "m2";
  material.price ??= 0;
  const handleChange = (field, value) => {
    onChange({ ...material, [field]: value });
  };
  const [totalCost, setTotalCost] = useState(material.totalCost || 0);

  useEffect(() => {
    const calculatedTotalCost =
      (material.quantity || 0) * (material.price || 0);
    setTotalCost(calculatedTotalCost);
    onChange({ ...material, totalCost: calculatedTotalCost });
  }, [material.quantity, material.price]);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormContainer component="form">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Name"
              name="name"
              value={material?.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              fullWidth
              disabled={isEdit || disabled}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Description"
              name="description"
              value={material?.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              required
              fullWidth
              disabled={isEdit || disabled}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="price"
              name="price"
              value={material?.price || ""}
              onChange={(e) => handleChange("price", e.target.value)}
              required
              fullWidth
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="unit"
              name="unit"
              value={material?.unit || ""}
              onChange={(e) => handleChange("unit", e.target.value)}
              required
              fullWidth
              disabled={disabled}
            />
          </Grid>{" "}
          <Grid item xs={6}>
            <TextField
              label="quantity"
              name="quantity"
              value={material?.quantity || ""}
              onChange={(e) => handleChange("quantity", e.target.value)}
              required
              fullWidth
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="totalCost"
              name="totalCost"
              value={totalCost}
              required
              fullWidth
              disabled={true}
            />
          </Grid>
          <DatePickerComponent
            label="Date"
            value={material?.date}
            onChange={(date) => onChange({ ...material, date: date })}
            disabled={disabled}
          />
        </Grid>
      </FormContainer>
    </LocalizationProvider>
  );
};

export default MaterialForm;
