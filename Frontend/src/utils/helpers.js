export const countWords = (text = "") => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

export const getQualityLabel = (score = 0) => {
  if (score >= 8) return "Excellent";
  if (score >= 6) return "Good";
  if (score >= 4) return "Average";
  return "Poor";
};

export const getQualityColor = (score = 0) => {
  if (score >= 8) return "#22c55e";
  if (score >= 6) return "#fbbf24";
  if (score >= 4) return "#f97316";
  return "#ef4444";
};

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};