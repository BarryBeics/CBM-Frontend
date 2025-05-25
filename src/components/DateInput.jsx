import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import enGB from "date-fns/locale/en-GB";
import { Box } from "@mui/material";
import { format, parse } from "date-fns";

const DateInput = ({ label, name, value, setFieldValue, error, touched }) => {
  return (
    <Box sx={{ width: "25%", minWidth: 150 }}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
        <DatePicker
          label={label}
          format="dd-MM-yyyy"
          value={value ? parse(value, "dd-MM-yyyy", new Date()) : null}
          onChange={(date) => {
            if (date) {
              const formatted = format(date, "dd-MM-yyyy");
              setFieldValue(name, formatted);
            } else {
              setFieldValue(name, "");
            }
            console.log("setFieldValue", typeof setFieldValue); 

          }}
          slotProps={{
            textField: {
              variant: "filled",
              fullWidth: true,
              name,
              error: touched && !!error,
              helperText: touched && error,
              InputLabelProps: { shrink: true },
              sx: {
                svg: { color: "#fff" }, 
              },
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default DateInput;
