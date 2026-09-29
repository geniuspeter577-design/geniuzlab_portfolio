export const budgetRangeOptions = [
  { value: "usd-5-10", label: "₦5,000–₦10,000" },
  { value: "usd-10-25", label: "₦10,000–₦25,000" },
  { value: "usd-25-plus", label: "₦25,000+" },
  { value: "to-discuss", label: "Let’s discuss" },
] as const;

const legacyBudgetRangeValues: Record<string, string> = {
  "5k-10k": "usd-5-10",
  "10k-25k": "usd-10-25",
  "25k-plus": "usd-25-plus",
};

export function formatBudgetRange(value: string | null): string {
  if (!value) return "Not provided";
  const normalizedValue = legacyBudgetRangeValues[value] ?? value;
  return budgetRangeOptions.find((option) => option.value === normalizedValue)?.label ?? value;
}