import { useState } from "react";
import { Calendar } from "react-multi-date-picker";

const CalendarInput = (props) => {
  const [selectedDate, setSelectedDate] = useState(props.value || "");
  const [showCalendar, setShowCalendar] = useState(!props.value);

  // Handle date selection and hide calendar
  const handleDateChange = (e) => {
    setSelectedDate(e);
    setShowCalendar(false);
    props.onChange?.(e);
  };

  // Show calendar again when the input is clicked
  const handleInputClick = () => {
    setShowCalendar(true);
  };

  return (
    <div className={props.wrapperClass}>
      {showCalendar ? (
        <Calendar
          className={props.inputClass}
          format={props.format || "D/M/YYYY"}
          multiple={props.multiple}
          value={selectedDate}
          onChange={handleDateChange}
        />
      ) : (
        <input
          type="text"
          className="selected-date-input"
          value={selectedDate?.toString() || ""}
          readOnly
          onClick={handleInputClick}
        />
      )}
      {props.proSetting && <span className="admin-pro-tag">pro</span>}
    </div>
  );
};

export default CalendarInput;
