import { CAT_IMG_SIZE, LGBTQ_PERCENTAGE } from "./constants";

export const randomOffset = (r = 1) => (Math.random() - 0.5) * r

export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getRandomGender = () => {
    if (Math.random() > 1 - LGBTQ_PERCENTAGE) {
        return 'Queer!'
    } else {
        return Math.random() > 0.5 ? 'Male' : 'Female'
    }
}

export const getRandomCatColor = () => {
    const { canvasContext } = window.state
    const x = getRandomInt(0, CAT_IMG_SIZE)
    const y = getRandomInt(0, CAT_IMG_SIZE)
    const d = canvasContext.getImageData(x, y, 1, 1).data;
    return `rgb(${d[0]}, ${d[1]}, ${d[2]})`
}

export const getNormalDistribution = (min, max, skew) => {
    let u = 0,
        v = 0;
    while (u === 0) u = Math.random() // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random()
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)

    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    if (num > 1 || num < 0)
        num = randn_bm(min, max, skew) // Resample between 0 and 1 if out of range

    else {
        num = Math.pow(num, skew) // Skew
        num *= max - min // Stretch to fill range
        num += min // Offset to min
    }
    return num
}
