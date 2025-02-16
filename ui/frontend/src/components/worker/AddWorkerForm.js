import React from "react";
import { Box, Grid, MenuItem, Select, TextField, FormControl, InputLabel } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import styled from "styled-components";

const FormContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const StyledSelect = styled(Select)`
    & .MuiPaper-root {
        display: flex;
        flex-direction: column;
    }
    & .MuiMenuItem-root {
        display: block;
        width: 100%;
        text-align: left;
    }
`;


const AddWorkerForm = ({ worker, onChange, specialties }) => {
    const handleChange = (field, value) => {
        onChange({ ...worker, [field]: value });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FormContainer component="form">
                <Grid container spacing={2}>
                    {/* First Column */}
                    <Grid item xs={6}>
                        <TextField
                            label="Name"
                            name="name"
                            value={worker.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            required
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth required>
                            <InputLabel id="specialty-label">Specialty</InputLabel>
                            <Select
                                labelId="specialty-label"
                                value={worker.specialty}
                                onChange={(e) => handleChange("specialty", e.target.value)}
                                displayEmpty
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 300, // Ensure proper scrolling
                                            overflowY: "auto",
                                            whiteSpace: "normal", // Ensures options wrap properly
                                        },
                                    },
                                }}
                            >
                                {specialties.map((specialty, index) => (
                                    <MenuItem key={index} value={specialty} style={{ display: "block", whiteSpace: "normal" }}>
                                        {specialty}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Second Column */}
                    <Grid item xs={6}>
                        <DatePicker
                            label="Started On"
                            value={worker.startedOn}
                            onChange={(date) => handleChange("startedOn", date)}
                            renderInput={(params) => <TextField {...params} fullWidth required />}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <DatePicker
                            label="Ended On"
                            value={worker.endedOn}
                            onChange={(date) => handleChange("endedOn", date)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </Grid>
                </Grid>
            </FormContainer>
        </LocalizationProvider>
    );
};

export default AddWorkerForm;
