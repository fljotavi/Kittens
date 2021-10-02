/**
 * @file constants.js
 * @description Constants used across the app
 * @author Tzingtao Chow <i@tzingtao.com>
 */

import { randomOffset } from './utils'

// Horizontal or vertical layout?
export const WINDOW_RATIO = window.innerWidth / window.innerHeight
export const IS_VERTICAL = WINDOW_RATIO < 1

// Discrete values
export const ROWS = 6
export const COLUMNS = IS_VERTICAL ? 4 : 13
export const MARGIN = 100

// Render time values
export const REPAINT_INTERVAL = 2000
export const REPAINT_TRANSITION_OCCUPIED_DURATION = 750
export const REPAINT_DELAY = 800
export const STAGE_REVEAL_DURATION = 500
export const STAGE_REVEAL_DELAY = 1000

// Kitten-props-related
export const MIN_KITTEN_AGE = 0
export const MAX_KITTEN_AGE = 16
export const DEFAULT_KITTEN_AGE = 5
export const MIN_KITTEN_WEIGHT = 0.7
export const MAX_KITTEN_WEIGHT = 4.8
export const KITTEN_WEIGHT_DISTRIBUTION_SKEW = 2.7
export const LGBTQ_PERCENTAGE = 0.043

// Shape length values
export const STROKE_WIDTH = 2
export const BELL_STROKE_WIDTH = 1.5
export const KITTEN_IMG_SIZE = 28

// Color values
export const STROKE_COLOR = 'black'
export const BELL_COLOR = 'orange'
export const BELLY_BASE_COLOR = 'white'

// Miscellaneous
export const VERTICAL_VISUAL_BALANCE_OFFSET = 30
export const SINGLE_KITTEN_VIEWBOX = [-45, -100, 90, 100]
const ACTIVE_KITTEN_INDEX = { COLUMN: IS_VERTICAL ? 2 : 9, ROW: 5 }

// Feel like doin' some math?
export const VIEWBOX = [0, 0, (COLUMNS + 1) * MARGIN, (ROWS + 1) * MARGIN]

export const ACTIVE_KITTEN_COORDS = [
    ACTIVE_KITTEN_INDEX.COLUMN * MARGIN,
    ACTIVE_KITTEN_INDEX.ROW * MARGIN + VERTICAL_VISUAL_BALANCE_OFFSET
].join(',')

export const POPOVER_TRANSFORM_VALUE = (activeKittenHeight = 0) => {
    const offset = -activeKittenHeight * (IS_VERTICAL ? 5 : 3)
    const r = randomOffset(5)
    return IS_VERTICAL 
        ? `translate(0px, ${offset + 90}px) scale(0.4) rotate(${r}deg)` 
        : `translate(480px, ${offset + 40}px) scale(0.5) rotate(${r}deg)`
}
