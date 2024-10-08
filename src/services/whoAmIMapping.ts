const whoOption: { [key: string]: string } = {
  "1": "Brand",
  "2": "Investor",
  "3": "Independent Franchise Partner",
  "4": "Real Estate Developer",
};

export default function mapWhoAmI(value: number | string | null): string {
  if (
    value === null ||
    (typeof value === "string" && isNaN(Number(value))) ||
    !whoOption[value.toString()]
  ) {
    return "-";
  }
  return whoOption[value.toString()];
}
