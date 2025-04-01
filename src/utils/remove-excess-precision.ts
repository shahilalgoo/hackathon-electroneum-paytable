export function roundDownExponential(num: number, precision: number): number {
    const [mantissa, exponent] = num.toExponential().split("e");
    const roundedMantissa = Math.floor(Number(mantissa) * 10 ** precision) / 10 ** precision;
    return Number(`${roundedMantissa}e${exponent}`);
}

export function removeExcessPrecision(payTable: number[]): number[] { 
    return payTable.map(num => roundDownExponential(num, 10));
}