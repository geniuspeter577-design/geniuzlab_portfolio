export const budgetRangeOptions = [
  { value: "5k-10k", label: "₦6,650,000–₦13,290,000" },
  { value: "10k-25k", label: "₦13,290,000–₦33,230,000" },
  { value: "25k-plus", label: "₦33,230,000+" },
  { value: "to-discuss", label: "Let’s discuss" },
] as const;

export function formatBudgetRange(value: string | null): string {
  if (!value) return "Not provided";
  return budgetRangeOptions.find((option) => option.value === value)?.label ?? value;
}