/**
 * @file utils.js
 * @description Kittens would definitely like some utility functions
 * @author Tzingtao Chow <i@tzingtao.com>
 */

import { KITTEN_IMG_SIZE, LGBTQ_PERCENTAGE } from './constants'
import { getCanvasContext } from './store'

/**
 * Returns a random offset in a zero-centered interval
 *
 * @param {number} r Random scale factor
 * @return {number} Generated random number within (-r/2, r/2)
 */
export const randomOffset = (r = 1) => (Math.random() - 0.5) * r

/**
 * Returns a random integer within the given bounds
 *
 * @param {number} min Lower bound
 * @param {number} max Upper bound
 * @return {number} Generated random integer
 */
export const getRandomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Returns a random gender string in the given gender set
 *
 * @return {string} Generated gender string
 */
export const getRandomGender = () => {
    if (Math.random() > 1 - LGBTQ_PERCENTAGE) {
        return 'Queer!'
    } else {
        return Math.random() > 0.5 ? 'Male' : 'Female'
    }
}

/**
 * Returns a random kitten color rgb string
 * Colors are picked in a blurred image of different species of kittens, taken from wikipedia
 * The logic here is to pick a random coordinate first, and then index the color of the pixel at that coordinate
 *
 * @return {string} Generated color string
 */
export const getRandomKittenColor = () => {
    const x = getRandomInt(0, KITTEN_IMG_SIZE - 1)
    const y = getRandomInt(0, KITTEN_IMG_SIZE - 1)
    const d = getCanvasContext().getImageData(x, y, 1, 1).data
    return `rgb(${d[0]}, ${d[1]}, ${d[2]})`
}

/**
 * Returns the bell color.
 * Typically red, but according to a recent scientific research, in rare cases,
 * mutations of a special combination of bright colors may be observed.
 *
 * @param {string} gender Cat gender
 * @return {string} Generated color string
 */
export const getRandomBeltColor = (gender) => {
    return gender === 'Queer!' ? 'url(#queer)' : '#ee3344'
}

/**
 * Randomly generate a number between the given bound and skew factor
 * Statistically, the numbers generated should match the corresponding normal distribution
 *
 * @param {number} min Lower bound
 * @param {number} max Upper bound
 * @param {number} skew Skew factor
 * @return {number} generated random number within the distribution
 */
export const getNormalDistribution = (min, max, skew) => {
    let u = 0,
        v = 0
    while (u === 0) u = Math.random() // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random()
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)

    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    num = Math.pow(num, skew) // Skew
    num *= max - min // Stretch to fill range
    num += min // Offset to min
    return num
}

/**
 * Works just like Array.prototype.map!
 *
 * @param {Object} min The original object
 * @param {Function} max Mapping function (value and key as the first and second argument)
 */
export const mapObject = (obj, mapFunction) =>
    Object.assign(
        ...Object.keys(obj).map((k) => ({
            [k]: mapFunction(obj[k], k),
        }))
    )
