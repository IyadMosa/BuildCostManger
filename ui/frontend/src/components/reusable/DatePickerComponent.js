import React from "react";
import { Grid, TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const DatePickerComponent = ({ label, value, onChange, disabled }) => {
  const handleDateChange = (date) => {
    onChange(date);
  };

  return (
    <Grid item xs={12} sm={6}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={label}
          value={value ? dayjs(value) : dayjs()} // Ensure proper date format
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} fullWidth required />}
          disabled={disabled}
        />
      </LocalizationProvider>
    </Grid>
  );
};

export default DatePickerComponent;
