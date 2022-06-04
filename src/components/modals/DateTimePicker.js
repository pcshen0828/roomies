import PropTypes from "prop-types";
import { subColor } from "../../styles/GlobalStyle";

import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiIconButton: {
      styleOverrides: {
        sizeMedium: {
          color: subColor,
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: "40px",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: subColor,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: subColor,
          },
        },
        notchedOutline: {
          borderColor: "#dadada",
        },
      },
    },
  },
});

function MUIDatePicker({ value, setValue }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <DatePicker
          minDate={new Date()}
          renderInput={(props) => <TextField {...props} variant="outlined" />}
          label=""
          value={value}
          onChange={(newValue) => {
            const isoDate = new Date(
              newValue.getTime() - newValue.getTimezoneOffset() * 60000
            )
              .toISOString()
              .slice(0, -14);
            setValue(isoDate);
          }}
        />
      </ThemeProvider>
    </LocalizationProvider>
  );
}

function MUITimePicker({ value, setValue }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <TimePicker
          renderInput={(props) => <TextField {...props} variant="outlined" />}
          label=""
          value={value}
          onChange={(newValue) => {
            const isoTime = new Date(
              newValue.getTime() - newValue.getTimezoneOffset() * 60000
            )
              .toISOString()
              .slice(0, -5);
            setValue(isoTime);
          }}
        />
      </ThemeProvider>
    </LocalizationProvider>
  );
}

MUIDatePicker.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
};

MUITimePicker.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
};

export { MUIDatePicker, MUITimePicker };
