export const formatPrice = (price) => {
  return Intl.NumberFormat("en-uk", {
    style: "currency",
    currency: "GBP",
  }).format(price);
};
