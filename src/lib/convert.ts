export const minutesToSeconds = (s: string) => {
    const parts = s.trim().split(":")

    if (parts.length == 1) return Number(parts[0])

    // minutes - parts[0]
    let sum = Number(parts[0]) * 60;
    sum += Number(parts[1])

    return sum;
}

export const secondsToMinutes = (n: number) => {
    const minutes = Math.trunc(n / 60);
    n = n - (minutes * 60)

    let leftPad = "";
    if (n < 10) {
        leftPad = "0"
    }

    return `${minutes}:${leftPad}${n.toFixed(2)}`
}