import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getArrayOfDates } from "./CommonFunctions";

const CalendarComponent = ({
  highlightedRange,
  excludeDateRange,
  selectedDays, // Corrected the prop name
}) => {
  const [startDate, endDate] = highlightedRange;
  const excludedDates = getArrayOfDates(excludeDateRange); // Fixed the variable name
  console.log(excludedDates);

  let formattedStartDate;
  if (startDate && endDate) {
    const givenDate = new Date(startDate);
    // Subtract one day
    const oneDayBefore = new Date(givenDate);
    oneDayBefore.setDate(givenDate.getDate() - 1);

    // Format the result
    formattedStartDate = oneDayBefore.toISOString().split("T")[0];
  }

  const isInRange = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return (
      highlightedRange &&
      highlightedRange[0] &&
      highlightedRange[1] &&
      formattedDate >= formattedStartDate &&
      formattedDate < endDate &&
      isAvailable(date) // Check if the day is selected
    );
  };
  

  const isUnavailable = (date) => {
    return excludedDates.includes(date.toISOString().split("T")[0]);
  };

  const isAvailable = (date) => {
    const daysOfWeek = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ];
    return selectedDays.includes(daysOfWeek[date.getDay()]);
  };

  return (
    <div>
      <Calendar
        value={null}
        tileClassName={({ date }) => {
          if (isInRange(date)) {
            if (isUnavailable(date)) {
              return "highlighted-unavailable-range";
            } else if (isAvailable(date)) {
              return "highlighted-available-range";
            }
            return "highlighted-range";
          }
        }}
        navigationAriaLabel={null}
        prev2Label={null}
        next2Label={null}
      />
    </div>
  );
};

export default CalendarComponent;
