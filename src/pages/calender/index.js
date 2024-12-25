import React, { useState, useMemo } from "react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const today = useMemo(() => new Date(), []);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  }, [currentDate]);

  const firstDayOfMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month, 1).getDay();
  }, [currentDate]);

  const allDays = useMemo(() => {
    const previousMonth = new Date(currentDate);
    previousMonth.setMonth(currentDate.getMonth() - 1);
    const prevMonthDays = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0).getDate();
    const previousMonthDaysArray = Array.from({ length: firstDayOfMonth }, (_, i) => prevMonthDays - firstDayOfMonth + i + 1);

    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const remainingDays = 35 - (previousMonthDaysArray.length + currentMonthDays.length);
    const nextMonthDaysArray = Array.from({ length: remainingDays }, (_, i) => i + 1);

    return [...previousMonthDaysArray, ...currentMonthDays, ...nextMonthDaysArray];
  }, [currentDate, daysInMonth, firstDayOfMonth]);

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const handleDateClick = (day, isCurrentMonth) => {
    if (isCurrentMonth) {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      setSelectedDate(newDate);
    }
  };

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className=" p-4 shadow-lg w-full max-w-sm">
      <div className="flex items-center justify-between mb-4 text-white">
        <button onClick={handlePrevMonth} className="focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-xl font-semibold">
          {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
        </span>
        <button onClick={handleNextMonth} className="focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <table className="w-full text-center">
        <thead>
          <tr className="text-gray-400">
            {daysOfWeek.map((day) => (
              <th key={day} className="p-2">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }, (_, row) => (
            <tr key={row}>
              {Array.from({ length: 7 }, (_, col) => {
                const dayIndex = row * 7 + col;
                const day = allDays[dayIndex];
                const isCurrentMonth = dayIndex >= firstDayOfMonth && dayIndex < firstDayOfMonth + daysInMonth;
                const isToday = isCurrentMonth && today.getDate() === day && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();

                return (
                  <td
                    key={dayIndex}
                    className={`p-2 cursor-pointer hover:bg-gray-700
                   ${isCurrentMonth ? "text-white" : "text-gray-500"}
                   ${isToday ? "bg-blue-500 text-white" : ""}
                   ${
                     selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth() && selectedDate.getFullYear() === currentDate.getFullYear()
                       ? "bg-gray-600 text-white"
                       : ""
                   }`}
                    onClick={() => handleDateClick(day, isCurrentMonth)}
                  >
                    {day}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
