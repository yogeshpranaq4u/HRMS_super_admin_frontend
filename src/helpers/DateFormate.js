export const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-GB", options).replace(",", "");
};
