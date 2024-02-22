import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import { searchParamFilters } from "./LiveInvocationsSideBar";
const DateFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const toDate = searchParams.get("ToDateFilter")
    ? (dayjs(searchParams.get("ToDateFilter")) as unknown as Date)
    : null;
  const fromDate = searchParams.get("FromDateFilter")
    ? (dayjs(searchParams.get("FromDateFilter")) as unknown as Date)
    : null;
  const handleFromDateChange = (date: Date | null) => {
    setSearchParams((prevSearchParams) => {
      const newSearchParams = new URLSearchParams(prevSearchParams);
      newSearchParams.set(searchParamFilters.fromDate, date?.toString() || "");
      return newSearchParams;
    });
  };

  const handleToDateChange = (date: Date | null) => {
    setSearchParams((prevSearchParams) => {
      const newSearchParams = new URLSearchParams(prevSearchParams);

      const fromDate = newSearchParams.get(searchParamFilters.fromDate);
      if (fromDate && date && dayjs(date).isBefore(dayjs(fromDate))) {
        handleFromDateChange(date);
        newSearchParams.set(searchParamFilters.toDate, fromDate);
      } else {
        newSearchParams.set(searchParamFilters.toDate, date?.toString() || "");
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
          slotProps={{
            actionBar: { actions: ["today"] },
          }}
          value={fromDate}
          format="DD/MM/YYYY HH:mm a"
          onChange={(date: Date | null) => handleFromDateChange(date)}
          sx={{
            width: 200,
            input: {
              padding: "8.5px 6px",
            },
            label: {
              top: "-8px",
            },
          }}
        />
      </div>
      <div className="flex flex-col">
        <DateTimePicker
          label="To"
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
          format="DD/MM/YYYY HH:mm a"
          onChange={(date: Date | null) => handleToDateChange(date)}
          value={toDate}
          slotProps={{
            actionBar: { actions: ["today"] },
          }}
          sx={{
            width: 200,
            input: {
              padding: "8.5px 6px",
            },
            label: {
              top: "-8px",
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
};

export default DateFilter;
