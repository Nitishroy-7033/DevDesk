/**
 * Formats seconds into HH:MM:SS format
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Parse time string (e.g., "10:30 AM") to minutes from midnight
 * @param {string} timeStr - Time string in format "HH:MM AM/PM"
 * @returns {number} Minutes from midnight
 */
export const parseTimeToMinutes = (timeStr) => {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period?.toLowerCase() === 'pm' && hours !== 12) {
    hours += 12;
  } else if (period?.toLowerCase() === 'am' && hours === 12) {
    hours = 0;
  }
  
  return hours * 60 + minutes;
};

/**
 * Calculate duration between two time strings in seconds
 * @param {string} startTime - Start time (e.g., "10:00 AM")
 * @param {string} endTime - End time (e.g., "12:00 PM")
 * @returns {number} Duration in seconds
 */
export const calculateTaskDuration = (startTime, endTime) => {
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);
  
  // Convert minutes to seconds
  return (endMinutes - startMinutes) * 60;
};
