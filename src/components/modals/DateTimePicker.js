import React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers";

function MUIDatePicker({ value, setValue }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        renderInput={(props) => <TextField {...props} />}
        label="DateTimePicker"
        value={value}
        onChange={(newValue) => {
          const isoDate = new Date(
            newValue.getTime() - newValue.getTimezoneOffset() * 60000
          )
            .toISOString()
            .slice(0, -14);
          console.log(`date: ${isoDate}`);
          setValue(isoDate);
        }}
      />
    </LocalizationProvider>
  );
}

function MUITimePicker({ value, setValue }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
        renderInput={(props) => <TextField {...props} />}
        label="DateTimePicker"
        value={value}
        onChange={(newValue) => {
          const isoTime = new Date(
            newValue.getTime() - newValue.getTimezoneOffset() * 60000
          )
            .toISOString()
            .slice(0, -5);
          console.log(isoTime.substring(11));
          setValue(isoTime);
        }}
      />
    </LocalizationProvider>
  );
}

export { MUIDatePicker, MUITimePicker };
