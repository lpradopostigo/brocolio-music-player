export function valueToPercentage (value: number, referenceValue: number): number {
  return (value / referenceValue) * 100
}

export function percentageToValue (percentage: number, referenceValue: number): number {
  return (percentage * referenceValue) / 100
}
