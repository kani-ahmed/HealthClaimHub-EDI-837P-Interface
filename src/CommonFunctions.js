function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date) && date instanceof Date;
}

export function getArrayOfDates(dateRangeString) {
  try {
    const dateRanges = dateRangeString.split(",");
    const result = [];

    dateRanges.forEach((dateRange) => {
      if (!dateRange.includes(":") && isValidDate(dateRange)) {
        result.push(dateRange);
      } else {
        const [start, end] = dateRange.split(":");
        if (!isValidDate(start) || !isValidDate(end)) return;
        const startDate = new Date(start);
        const endDate = new Date(end);

        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          result.push(new Date(currentDate).toISOString().split("T")[0]);
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });
    return result;
  } catch (err) {
    return;
  }
}


export function oneDayBefore(date){
  console.log(date)
  // if(isValidDate(date)) return;
  const givenDate = new Date(date);
  // Subtract one day
  const oneDayBefore = new Date(givenDate);
  oneDayBefore.setDate(givenDate.getDate() - 1);

  // Format the result (optional)
  // Format the result (optional)
  return oneDayBefore.toISOString().split("T")[0];
}
