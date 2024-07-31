export const calculateOnlyInterstLoan = (
  amount: number,
  interest: number,
  years: number
) => {
  return {
    mortgage: (amount * (interest / 100)) / 12,
    total: amount * (interest / 100) * years,
  };
};

export const calculateRepaymentLoan = (
  amount: number,
  interest: number,
  years: number
) => {
  const r = interest / 100 / 12;
  const n = years * 12;
  const mortgage = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total = mortgage * n;
  return { mortgage, total };
};

export const numberWithCommas = (x: number | undefined) => {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
