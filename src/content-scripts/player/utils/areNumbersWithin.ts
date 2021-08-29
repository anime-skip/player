export function areNumbersWithin(num1: number, num2: number, maxAllowedDistance: number): boolean {
  return Math.abs(num2 - num1) > maxAllowedDistance;
}
