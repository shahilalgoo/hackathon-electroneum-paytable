export function RoundToDP(value: number, decimalPlaces: number) {
    let dp = Math.pow(10, decimalPlaces);
    let num = 0;
    while (num == 0) {
        num = Math.round(value * dp) / dp;
        dp *= 100;
    }
    return num;
}