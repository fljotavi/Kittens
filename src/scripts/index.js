import * as d3 from "d3"
import { CAT_IMG_SIZE, VIEWBOX } from "./constants";
import { adjustPopoverRotation, renderFilterOn, renderKittensOn, renderOverlayDynamicOn, renderOverlayStaticOn } from "./render";

// Init canvas for cat color picking
const catColorImg = document.querySelector('#canvas-src')
const context = document.querySelector('canvas').getContext('2d');
context.drawImage(catColorImg, 0, 0, CAT_IMG_SIZE, CAT_IMG_SIZE);

// Init SVG elements
const svg = d3.select('svg-frame').append('svg').attr('viewBox', VIEWBOX)
const g = svg.append('g').attr('class', 'turbulent-g').attr('style', 'filter: url(#xkcdify)')

// Init global state for the app
window.state = {
    activeKitten: {},
    canvasContext: context,
    els: { svg, g }
}

// Append layered SVG groups respectively
const gKittensBody = g.append('g').attr('class', 'g-kittens-body')
const gPopover = g.append('g').attr('class', 'g-popover')
const gOverlaidStatic = gPopover.append('g').attr('class', 'g-overlaid-static')
const gOverlaidDynamic = gPopover.append('g').attr('class', 'g-overlaid-dynamic')

// Render static layers
renderFilterOn(svg)
renderOverlayStaticOn(gOverlaidStatic)

// Render dynamic layers
const renderAllDynamicContent = () => {
    renderKittensOn(gKittensBody)
    setTimeout(() => {
        renderOverlayDynamicOn(gOverlaidDynamic)
        adjustPopoverRotation(gPopover)
    }, 800)
}
renderAllDynamicContent()
setInterval(() => {
    renderAllDynamicContent()
}, 2000)

// Reveal stage and start animating!
setTimeout(() => {
    d3.select("svg-frame").transition().duration(500).style("opacity", 1)
}, 1000)