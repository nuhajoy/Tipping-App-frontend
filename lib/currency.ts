export function formatCurrency(amount: number, currency: string = 'ETB'): string {
  return `${amount.toLocaleString()} ${currency}`;
}

export function formatAmount(amount: number): string {
  return amount.toLocaleString('en-ET');
}