function getTimeSlot(slot) {
  // slot: 1 → 24

  // 9 AM is base hour
  let startHour24 = (8 + slot) % 24;
  let endHour24 = (startHour24 + 1) % 24;

  const formatTime = (hour24) => {
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    return `${hour12} ${period}`;
  };

  return {
    startTimes: formatTime(startHour24),
    endTimes: formatTime(endHour24),
  };
}
export default getTimeSlot;