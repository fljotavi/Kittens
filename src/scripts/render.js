/**
 * @file render.js
 * @description Shape calculation and path concatenation
 * @author Tzingtao Chow <i@tzingtao.com>
 */

import { DEFAULT_KITTEN_AGE } from './constants'
import { mapObject, randomOffset } from './utils'

// In the drawing process, each point (vertex) is calculated with given parameters
// deriving from kitten props, and applied a random offset to create a 'sketchy' feeling.
// This step is called morphing.

// A morphDef can morph a set of original point (x, y) into a new point
// based on metrics related to kitten figure / characteristics.

const morphDefs = {

    /**
     * @param {number} x Coordinate x(0) of the original point
     * @param {number} y Coordinate y(1) of the original point
     * @param {number} h Height coefficient, typically related to the age of a kitten
     * @param {number} c Chubbiness
     * @param {number} k Macro randomness (global)
     * @param {Function} r Micro randomness (differs in each calculation)
     * 
     * @return {Array} Coordinate [x, y] of the morphed point
     */

    waist: (x, y, h, c, k, r) => [
        x * c + k * r(3),
        y + k * r(3)
    ],
    earTop: (x, y, h, c, k, r) => [
        x * c + k * r(2),
        y - h + k * r(2)
    ],
    leftEarCut: (x, y, h, c, k, r) => [
        x * c - 4 * (c - 1) - k * r(2),
        y - h - 2 * c + k * r(2)
    ],
    rightEarCut: (x, y, h, c, k, r) => [
        x * c + 4 * (c - 1) + k * r(2),
        y - h - 2 * c + k * r(2)
    ],
    eyeTop: (x, y, h, c, k, r) => [
        x * c + k * r(0.2),
        y - h + k * r(0.2)
    ],
    eyeBottom: (x, y, h, c, k, r) => [
        x * c + k * r(0.2),
        y - 1.2 * h + k * r(0.2)
    ]
}

// Keypoint is the first set of points calculated that defines the general outer figure of the kitten.
// Some points may be derived later based on these points.
// e.g., the start point of a belt should located somewhere between the waist and ear top.

const keypointGenerators = {
    leftWaist: {
        origin: [-15, 0],
        morph: morphDefs.waist
    },
    rightWaist: {
        origin: [15, 0],
        morph: morphDefs.waist
    },
    leftEarTop: {
        origin: [-10, -50],
        morph: morphDefs.earTop
    },
    rightEarTop: {
        origin: [10, -50],
        morph: morphDefs.earTop
    },
    leftEyeTop: {
        origin: [-5, -33],
        morph: morphDefs.eyeTop
    },
    rightEyeTop: {
        origin: [5, -33],
        morph: morphDefs.eyeTop
    },
    leftEyeBottom: {
        origin: [-5, -24],
        morph: morphDefs.eyeBottom
    },
    rightEyeBottom: {
        origin: [5, -24],
        morph: morphDefs.eyeBottom
    },
    leftEarCut: {
        origin: [-5, -40],
        morph: morphDefs.leftEarCut
    },
    rightEarCut: {
        origin: [5, -40],
        morph: morphDefs.rightEarCut
    }
}

// Concatenates an array of commands into a complete SVG Path string that could be used directly
const concatCommands = commands => commands
    .map(step => ({
        action: step.action,
        to: step.to
    }))
    .reduce(
        (accu, step) => `${accu} ${step.action} ${step.to.join(' ')}`,
        ''
    )

/**
 * Generates drawing commands for a specific kitten with determined metrics
 *
 * @param {number} age Kitten's age
 * @param {number} chubbiness Kitten's chubbiness
 * @param {number} randomness How randomized the points should locate
 * @return {Object} An object containing all required drawing steps for different body parts
 */
export const generateDrawingCommands = (age = DEFAULT_KITTEN_AGE, chubbiness = 1, randomness = 1) => {

    const heightOffset = age * 3 - 20

    const keypoints = mapObject(keypointGenerators, values => {
        const { origin, morph } = values
        return morph(...origin, heightOffset, chubbiness, randomness, randomOffset)
    })

    const figure = concatCommands([

        // Draw the kitten outline
        { action: 'M', to: keypoints.leftWaist },
        { action: 'L', to: keypoints.leftEarTop },
        { action: 'L', to: keypoints.leftEarCut },
        { action: 'L', to: keypoints.rightEarCut },
        { action: 'L', to: keypoints.rightEarTop },
        { action: 'L', to: keypoints.rightWaist },

        // Draw the left eye
        { action: 'M', to: keypoints.leftEyeTop },
        { action: 'L', to: keypoints.leftEyeBottom },

        // Draw the right eye
        { action: 'M', to: keypoints.rightEyeTop },
        { action: 'L', to: keypoints.rightEyeBottom }

    ])

    const belt = concatCommands([

        // Starting from the left top corner of the belt
        {
            action: 'M',
            to: [
                0.7 * keypoints.leftWaist[0] + 0.3 * keypoints.leftEarTop[0] + 0.1 * heightOffset - 1,
                keypoints.leftEyeBottom[1] + 10
            ]
        },

        // Curves downwards slightly
        {
            action: 'Q',
            to: [
                0,
                keypoints.leftEyeBottom[1] + 19,
                0.7 * keypoints.rightWaist[0] + 0.3 * keypoints.rightEarTop[0] - 0.1 * heightOffset + 1,
                keypoints.rightEyeBottom[1] + 10
            ]
        },

        // And connects to the right bottom
        {
            action: 'L',
            to: [
                0.7 * keypoints.rightWaist[0] + 0.3 * keypoints.rightEarTop[0] - 0.1 * heightOffset + 1.7,
                keypoints.rightEyeBottom[1] + 15
            ]
        },

        // Curves downwards again
        {
            action: 'Q',
            to: [
                0,
                keypoints.leftEyeBottom[1] + 22,
                0.7 * keypoints.leftWaist[0] + 0.3 * keypoints.leftEarTop[0] + 0.1 * heightOffset - 1.7,
                keypoints.leftEyeBottom[1] + 15
            ]
        },

        // And close the belt shape
        {
            action: 'Z',
            to: []
        }

    ])

    const bell =  {
        // This is quite straightforward, innit
        cx: 0,
        cy: keypoints.leftEyeBottom[1] + 22
    }

    const belly = {

        // Draw a closed spline of multiple randomly distributed points inside the kitten's body
        splineBy: [
            [
                keypoints.leftWaist[0] * 0.75 + randomOffset(5),
                50
            ],
            [
                keypoints.leftWaist[0] * 0.6 + randomOffset(8),
                keypoints.leftEyeBottom[1] + 27 + randomOffset(25)
            ],
            [
                randomOffset(8),
                keypoints.leftEyeBottom[1] + 27 + randomOffset(28)
            ],
            [
                keypoints.rightWaist[0] * 0.6 + randomOffset(8),
                keypoints.leftEyeBottom[1] + 27 + randomOffset(25)
            ],
            [
                keypoints.rightWaist[0] * 0.75 + randomOffset(5),
                50
            ]
        ],

        // Sadly, not all kittens have belly
        opacity: Math.random() > 0.9 ? 0 : Math.random()

    }


    // Yep, these names are intentional
    return { figure, belt, bell, belly }
}
