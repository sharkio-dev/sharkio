import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";
import { searchParamFilters } from "./LiveInvocationsSideBar";

const DateFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const handleFromDateChange = (date: Date | null) => {
    setSearchParams((prevSearchParams) => {
      const newSearchParams = new URLSearchParams(prevSearchParams);
      newSearchParams.set(
        searchParamFilters.fromDate,
        date?.toString() || ""
      );
      return newSearchParams;
    });
  };
  const handleToDateChange = (date: Date | null) => {
    setSearchParams((prevSearchParams) => {
      const newSearchParams = new URLSearchParams(prevSearchParams);

      // Check if "To" date is after "From" date
      const fromDate = newSearchParams.get(searchParamFilters.fromDate);
      if (fromDate && date && dayjs(date).isBefore(dayjs(fromDate))) {
        // If "To" date is before "From" date, set "To" date to "From" date
        handleFromDateChange(date);
        newSearchParams.set(searchParamFilters.toDate, fromDate);
      } else {
        newSearchParams.set(
          searchParamFilters.toDate,
          date?.toString() || ""
        );
      }

      return newSearchParams;
    });
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <DateTimePicker
          label="From"
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
          value={dayjs(searchParams.get("FromDateFilter")) as unknown as Date}
          format="DD/MM/YYYY HH:mm a"
          onChange={(date: Date | null) => handleFromDateChange(date)}
        />
        <Button
          sx={{ height: "23px" }}
          onClick={() => handleFromDateChange(null)}
        >
          Clear
        </Button>
      </div>
      <div>
        <DateTimePicker
          label="To"
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
          format="DD/MM/YYYY HH:mm a"
          onChange={(date: Date | null) => handleToDateChange(date)}
          value={dayjs(searchParams.get("ToDateFilter")) as unknown as Date}
        />
        <Button
          sx={{ height: "23px" }}
          onClick={() => handleToDateChange(null)}
        >
          Clear
        </Button>
      </div>
    </LocalizationProvider>
  );
};

export default DateFilter;
