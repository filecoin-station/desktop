export function roundToSixDecimalPlaces(number: string | number | undefined) {
    if (!number) return 0
    const roundedNumber = Number(number).toFixed(6); // Round to 6 decimal places
    return roundedNumber.toString();
}