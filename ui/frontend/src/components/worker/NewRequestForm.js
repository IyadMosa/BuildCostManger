import React from 'react';
import { Grid, Paper, TextField } from '@mui/material';
import { AmountSelector } from "@iyadmosa/react-library";

const NewRequestForm = ({ paymentData, onChange, disabled = false }) => {
  const handleChange = (name, value) => {
    onChange((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AmountSelector
            label="New Request Amount"
            name="newRequestTotal"
            amount={paymentData?.newRequestTotal || 0}
            onChange={(value) => handleChange('newRequestTotal', value)}
            fullWidth
            required
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12}>
          <AmountSelector
            label="Pay Now (Optional)"
            name="newRequestPaid"
            amount={paymentData?.newRequestPaid || 0}
            onChange={(value) => handleChange('newRequestPaid', value)}
            fullWidth
            disabled={disabled}
            helperText="Leave at 0 to pay later"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default NewRequestForm;
