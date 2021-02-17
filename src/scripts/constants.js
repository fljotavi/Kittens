export const CAT_IMG_SIZE = 28
export const VIEWBOX = [0, 0, 800, 1500]
export const LGBTQ_PERCENTAGE = 0.05

export const MIN_CAT_AGE = 0
export const MAX_CAT_AGE = 16

export const MIN_CAT_WEIGHT = 0.7
export const MAX_CAT_WEIGHT = 4.8
export const CAT_WEIGHT_DISTRIBUTION_SKEW = 2.7

export const standardKittenDefs = {
    leftWaist: [-15, 0],
    rightWaist: [15, 0],
    leftEarTop: [-10, -50],
    rightEarTop: [10, -50],
    leftEyeTop: [-5, -33],
    rightEyeTop: [5, -33],
    leftEyeBottom: [-5, -24],
    rightEyeBottom: [5, -24],
    leftEarCut: [-5, -40],
    rightEarCut: [5, -40]
}

export const startingPoints = new Array(7).fill(0).map((curr, i) => {
    return new Array(14).fill(0).map((curr, j) => [i * 100 + 100, j * 100 + 130])
}).flat(1)