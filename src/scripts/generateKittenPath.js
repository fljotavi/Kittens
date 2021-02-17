import { standardKittenDefs } from "./constants"
import { randomOffset } from "./utils"

export const generateKittenPath = (coords, age = 5, chubbiness = 1, randomness = 1) => {

    const [x, y] = coords
    const defs = standardKittenDefs
    const heightOffset = age * 3 - 20
    const sizeCoefficient = chubbiness - 1
    const k = randomness

    // Define series of drawing process, corresponding to the SVG Path Standard
    // Each point (vertex) is calculated with given parameters deriving from body height / weight
    // And applied a random offset to create a 'sketchy' feeling

    const drawProcess = [{
        action: 'M',
        to: [
            defs.leftWaist[0] * chubbiness + k * randomOffset(3),
            defs.leftWaist[1] + k * randomOffset(3)
        ]
    },
    {
        action: 'L',
        to: [
            defs.leftEarTop[0] * chubbiness + k * randomOffset(2),
            defs.leftEarTop[1] - heightOffset + k * randomOffset(2)
        ]
    },
    {
        action: 'L',
        to: [
            defs.leftEarCut[0] * chubbiness - sizeCoefficient * 4 + k * randomOffset(2),
            defs.leftEarCut[1] - heightOffset - chubbiness * 2 + k * randomOffset(2)
        ]
    },
    {
        action: 'L',
        to: [
            defs.rightEarCut[0] * chubbiness + sizeCoefficient * 4 + k * randomOffset(2),
            defs.rightEarCut[1] - heightOffset - chubbiness * 2 + k * randomOffset(2)
        ]
    },
    {
        action: 'L',
        to: [
            defs.rightEarTop[0] * chubbiness + k * randomOffset(2),
            defs.rightEarTop[1] - heightOffset + k * randomOffset(2)
        ]
    },
    {
        action: 'L',
        to: [
            defs.rightWaist[0] * chubbiness + k * randomOffset(3),
            defs.rightWaist[1] + k * randomOffset(3)
        ]
    },
    {
        action: 'M',
        to: [
            defs.leftEyeTop[0] * chubbiness + k * randomOffset(0.2),
            defs.leftEyeTop[1] - heightOffset + k * randomOffset(0.2)
        ]
    },
    {
        action: 'L',
        to: [
            defs.leftEyeBottom[0] * chubbiness + k * randomOffset(0.2),
            defs.leftEyeBottom[1] - heightOffset * 1.2 + k * randomOffset(0.2) // Young cats have bigger eyes 'ω'
        ]
    },
    {
        action: 'M',
        to: [
            defs.rightEyeTop[0] * chubbiness + k * randomOffset(0.2),
            defs.rightEyeTop[1] - heightOffset + k * randomOffset(0.2)
        ]
    },
    {
        action: 'L',
        to: [
            defs.rightEyeBottom[0] * chubbiness + k * randomOffset(0.2),
            defs.rightEyeBottom[1] - heightOffset * 1.2 + k * randomOffset(0.2)
        ]
    }
    ]

    const path = drawProcess
        .map(step => ({
            action: step.action,
            to: [
                step.to[0] + x,
                step.to[1] + y
            ]
        }))
        .reduce(
            (accu, step) => `${accu} ${step.action} ${step.to.join(' ')}`,
            `M ${x} ${y}`
        )

    return path
}