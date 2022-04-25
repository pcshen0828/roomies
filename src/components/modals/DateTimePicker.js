import React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export default function MUIDateTimePicker({ value, setValue }) {
  const date = new Date();
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        renderInput={(props) => <TextField {...props} />}
        label="DateTimePicker"
        value={value}
        onChange={(newValue) => {
          const isoDateTime = new Date(
            newValue.getTime() - newValue.getTimezoneOffset() * 60000
          )
            .toISOString()
            .slice(0, -5);
          setValue(isoDateTime);
        }}
      />
    </LocalizationProvider>
  );
}
