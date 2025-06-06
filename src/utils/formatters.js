// utils/formatters.js

export const formatElapsedTime = (ms) => {
  if (typeof ms !== "number" || isNaN(ms) || ms <= 0) return "--";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export const formatFloat = (value, decimals = 2, suffix = "") => {
  if (typeof value !== "number" || isNaN(value)) return "--";
  return value.toFixed(decimals) + suffix;
};

export const formatPercentage = (value, decimals = 2) => {
  return formatFloat(value, decimals, "%");
};

export const formatTimestamp = (ts) => {
  if (!ts || isNaN(ts)) return "--";
  const date = new Date(ts);
  return date.toLocaleString(); // Optional: format with options
};
