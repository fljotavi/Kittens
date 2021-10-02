/**
 * @file index.js
 * @description The main entry and the render pipeline
 * @author Tzingtao Chow <i@tzingtao.com>
 */

import * as d3 from 'd3'
import {
    KITTEN_IMG_SIZE,
    REPAINT_DELAY,
    REPAINT_INTERVAL, 
    STAGE_REVEAL_DELAY, 
    STAGE_REVEAL_DURATION, 
    VIEWBOX
} from './constants'
import {
    adjustPopoverPosition,
    appendGlobalDefsOn, 
    appendKittensOn,
    appendOverlayDynamicOn,
    appendOverlayStaticOn
} from './manip'
import { setCanvasContext } from './store'

// Init canvas for kitten color picking
const kittenColorImg = document.querySelector('#canvas-src')
const context = document.querySelector('canvas').getContext('2d')
context.drawImage(kittenColorImg, 0, 0, KITTEN_IMG_SIZE, KITTEN_IMG_SIZE)
setCanvasContext(context)

// Init SVG elements
const svg = d3.select('svg-frame').append('svg').attr('id', 'top-level-svg').attr('viewBox', VIEWBOX)
const g = svg.append('g').attr('class', 'turbulent-g').attr('style', 'filter: url(#xkcdify)')

// Append global SVG defs, including filters, gradients, etc.
appendGlobalDefsOn(svg)

// Append layered SVG groups respectively
const gKittensBody = g.append('g').attr('class', 'g-kittens-body')
const gPopover = g.append('g').attr('class', 'g-popover')
const gOverlaidStatic = gPopover.append('g').attr('class', 'g-overlaid-static')
const gOverlaidDynamic = gPopover.append('g').attr('class', 'g-overlaid-dynamic')

// Append static layers
appendOverlayStaticOn(gOverlaidStatic)

// Append dynamic layers
const appendAllDynamicContent = () => {
    appendKittensOn(gKittensBody)
    setTimeout(() => {
        appendOverlayDynamicOn(gOverlaidDynamic)
        adjustPopoverPosition(gPopover)
    }, REPAINT_DELAY)
}
appendAllDynamicContent()
setInterval(() => {
    appendAllDynamicContent()
}, REPAINT_INTERVAL)

// Reveal stage and start animating!
setTimeout(() => {
    d3.select('svg-frame').transition().duration(STAGE_REVEAL_DURATION).style('opacity', 1)
}, STAGE_REVEAL_DELAY)