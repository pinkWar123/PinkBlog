export const getFormatDate = (date: Date) => {
  const dateObject = new Date(date);
  const formattedDate = `${dateObject.getFullYear()}-${(
    dateObject.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${dateObject
    .getDate()
    .toString()
    .padStart(2, "0")} ${dateObject
    .getHours()
    .toString()
    .padStart(2, "0")}:${dateObject
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${dateObject.getSeconds().toString().padStart(2, "0")}`;
  return formattedDate;
};

export const formatDateWith = (date: Date) => {
  const _date = new Date(date); // Replace with your date

  // Create an Intl.DateTimeFormat object with appropriate options
  const options = {
    dateStyle: "medium",
    timeStyle: "short",
    hourCycle: "h12",
  };

  const formatter = new Intl.DateTimeFormat("en-US");

  // Format the date
  const formattedDate = formatter.format(_date);
  return formattedDate;
};
