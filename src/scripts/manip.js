/**
 * @file manip.js
 * @description Defines all SVG manipulation processes using d3.js
 * @author Tzingtao Chow <i@tzingtao.com>
 */

import * as d3 from 'd3'
import {
    ACTIVE_KITTEN_COORDS,
    BELLY_BASE_COLOR,
    BELL_COLOR,
    BELL_STROKE_WIDTH,
    COLUMNS,
    KITTEN_WEIGHT_DISTRIBUTION_SKEW,
    MARGIN,
    MAX_KITTEN_AGE,
    MAX_KITTEN_WEIGHT,
    MIN_KITTEN_AGE,
    MIN_KITTEN_WEIGHT,
    POPOVER_TRANSFORM_VALUE,
    REPAINT_TRANSITION_OCCUPIED_DURATION,
    ROWS,
    SINGLE_KITTEN_VIEWBOX,
    STROKE_COLOR,
    STROKE_WIDTH,
    VERTICAL_VISUAL_BALANCE_OFFSET
} from './constants'
import { generateDrawingCommands } from './render'
import { getActiveKitten, setActiveKitten } from './store'
import { getRandomKittenColor, getRandomGender, getNormalDistribution, getRandomBeltColor } from './utils'

const startingPoints = new Array(COLUMNS).fill(0).map((curr, i) => {
    return new Array(ROWS).fill(0).map((curr, j) => [(i + 1) * MARGIN, (j + 1) * MARGIN + VERTICAL_VISUAL_BALANCE_OFFSET])
}).flat(1)

export const appendSingleKittenOn = (el, isUpdate = false) => {

    if (isUpdate) {
        const t = d3.select('svg').transition().duration(REPAINT_TRANSITION_OCCUPIED_DURATION)
        el.call(
            update => {
                update.select('.k-figure').transition(t)
                    .attr('d', d => d.paths.figure)
                    .attr('fill', d => d.color)

                update.select('.k-belly').transition(t)
                    .attr('cy', d => d.paths.bell.cy)
                    .attr('d', d => {
                        return ((d3.line().curve(d3.curveBasisClosed))(d.paths.belly.splineBy))
                    })
                    .attr('opacity', d => d.paths.belly.opacity)

                update.select('.k-belt').transition(t)
                    .attr('d', d => d.paths.belt)
                    .attr('fill', d => getRandomBeltColor(d.gender))

                update.select('.k-bell').transition(t)
                    .attr('cy', d => d.paths.bell.cy)

                update.select('.k-bell-hole').transition(t)
                    .attr('cy', d => d.paths.bell.cy)

                update.select('.k-bell-canyon').transition(t)
                    .attr('x1', d => d.paths.bell.cx)
                    .attr('x2', d => d.paths.bell.cx)
                    .attr('y1', d => d.paths.bell.cy)
                    .attr('y2', d => d.paths.bell.cy + 5)
            }
        )
    } else {
        const kGroup = el
            .append('svg')
            .attr('class', 'single-kitten-group')
            .attr('data-coords', d => d.coords)
            .attr('x', d => d.sp[0] + SINGLE_KITTEN_VIEWBOX[0])
            .attr('y', d => d.sp[1] + SINGLE_KITTEN_VIEWBOX[1])
            .attr('width', '90')
            .attr('height', '100')
            .attr('viewBox', SINGLE_KITTEN_VIEWBOX)
            .append('g')

        kGroup.append('path')
            .attr('class', 'k-figure')
            .attr('d', d => d.paths.figure)
            .attr('fill', d => d.color)
            .attr('stroke-width', STROKE_WIDTH)
            .attr('stroke', STROKE_COLOR)
            .transition()

        kGroup.append('path')
            .attr('class', 'k-belly')
            .attr('d', d => {
                return ((d3.line().curve(d3.curveBasisClosed))(d.paths.belly.splineBy))
            })
            .attr('fill', BELLY_BASE_COLOR)
            .attr('opacity', d => d.paths.belly.opacity)
            .transition()

        kGroup.append('path')
            .attr('class', 'k-belt')
            .attr('d', d => d.paths.belt)
            .attr('fill', d => getRandomBeltColor(d.gender))
            .attr('stroke-width', STROKE_WIDTH)
            .attr('stroke', STROKE_COLOR)
            .transition()

        kGroup.append('circle')
            .attr('class', 'k-bell')
            .attr('cx', d => d.paths.bell.cx)
            .attr('cy', d => d.paths.bell.cy)
            .attr('r', 5)
            .attr('fill', BELL_COLOR)
            .attr('stroke-width', BELL_STROKE_WIDTH)
            .attr('stroke', STROKE_COLOR)
            .transition()

        kGroup.append('circle')
            .attr('class', 'k-bell-hole')
            .attr('cx', d => d.paths.bell.cx)
            .attr('cy', d => d.paths.bell.cy)
            .attr('r', 0.6)
            .attr('stroke-width', STROKE_WIDTH)
            .attr('stroke', STROKE_COLOR)
            .transition()

        kGroup.append('line')
            .attr('class', 'k-bell-canyon')
            .attr('x1', d => d.paths.bell.cx)
            .attr('x2', d => d.paths.bell.cx)
            .attr('y1', d => d.paths.bell.cy)
            .attr('y2', d => d.paths.bell.cy + 5)
            .attr('stroke-width', BELL_STROKE_WIDTH)
            .attr('stroke', STROKE_COLOR)
            .transition()

    }

}

export const appendKittensOn = el => {

    el.selectAll('g')
        .data(startingPoints.map(sp => {

            const coords = `${sp[0]},${sp[1]}`
            const age = MIN_KITTEN_AGE + Math.random() * MAX_KITTEN_AGE
            const color = getRandomKittenColor()
            // TODO: calc chubbiness based on color
            const chubbiness = getNormalDistribution(MIN_KITTEN_WEIGHT, MAX_KITTEN_WEIGHT, KITTEN_WEIGHT_DISTRIBUTION_SKEW)
            const paths = generateDrawingCommands(age, chubbiness)
            const gender = getRandomGender()

            const kittenMetrics = { coords, age, chubbiness, paths, color, gender, sp }

            if (coords === ACTIVE_KITTEN_COORDS) {
                setActiveKitten({
                    ...kittenMetrics,
                    sp: [0, 0]
                })
            }
            return kittenMetrics

        }))
        .join(
            enter => appendSingleKittenOn(enter),
            update => appendSingleKittenOn(update, true)
        )

}

export const kittenPropsToAppend = [
    { text: 'Age', key: 'age', middleware: age => Math.round(age) },
    { text: 'Gender', key: 'gender', middleware: gender => gender },
    {
        text: 'Weight',
        key: 'chubbiness',
        middleware: (chub, self) => `${(chub * 2.5 + chub * self.age / 6).toFixed(1)}kg`
    },
    { text: 'Color', key: 'color', middleware: 'CUSTOM' }
]

export const appendOverlayStaticOn = el => {

    el.append('image')
        .attr('href', 'assets/popover.svg')
    el.append('text')
        .attr('class', 'overlaid-text heading')
        .text('Kittens!')
        .attr('x', 170)
        .attr('y', 170)
    el.append('rect')
        .attr('class', 'overlaid-text avatar')
        .attr('x', 174)
        .attr('y', 210)
        .attr('width', 155)
        .attr('height', 185)

    kittenPropsToAppend.forEach((prop, iRow) => {
        el.append('text')
            .attr('class', 'overlaid-text prop-key')
            .text(prop.text)
            .attr('x', 370)
            .attr('y', 230 + iRow * 50)
        el.append('path')
            .attr('d', `M ${370} ${246 + iRow * 50} h ${290}`)
            .attr('stroke', '#444')
            .attr('stroke-width', 2)
    })

}

export const appendOverlayDynamicOn = el => {

    const activeKitten = getActiveKitten()

    el.selectAll('text')
        .data(kittenPropsToAppend
            .filter(prop => prop.middleware !== 'CUSTOM')
            .map(prop => prop.middleware(activeKitten[prop.key], activeKitten)))
        .join('text')
        .attr('class', 'overlaid-text prop-value')
        .text(d => d)
        .attr('x', 560)
        .attr('y', (d, iRow) => 230 + iRow * 50)

    el.selectAll('rect')
        .data([activeKitten.color])
        .join('rect')
        .attr('fill', d => d)
        .attr('x', 560)
        .attr('y', 370)
        .attr('width', 40)
        .attr('height', 10)

    const gKittenFrame = el.selectAll('g')
        .data([activeKitten])
        .join('g')
        .attr('class', 'kitten-frame')
        .html('')

    appendSingleKittenOn(gKittenFrame)
}

export const appendGlobalDefsOn = el => {
    el.append('defs').html(`
        <filter id="xkcdify" filterUnits="userSpaceOnUse">
            <feTurbulence 
                type="fractalNoise" 
                baseFrequency="0.07" 
                result="noise"
            >
            </feTurbulence>
            <feDisplacementMap 
                scale="3" 
                xChannelSelector="R"
                yChannelSelector="G"
                in="SourceGraphic" 
                in2="noise"
            >
            </feDisplacementMap>
        </filter>
        <linearGradient id="queer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#b91629;stop-opacity:1" />
            <stop offset="17%" style="stop-color:#b91629;stop-opacity:1" />
            <stop offset="17%" style="stop-color:#d35929;stop-opacity:1" />
            <stop offset="33%" style="stop-color:#d35929;stop-opacity:1" />
            <stop offset="33%" style="stop-color:#f9d942;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#f9d942;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#128a59;stop-opacity:1" />
            <stop offset="67%" style="stop-color:#128a59;stop-opacity:1" />
            <stop offset="67%" style="stop-color:#344175;stop-opacity:1" />
            <stop offset="83%" style="stop-color:#344175;stop-opacity:1" />
            <stop offset="83%" style="stop-color:#7f4778;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#7f4778;stop-opacity:1" />
        </linearGradient>
    `)
}

export const adjustPopoverPosition = el => {
    const activeKitten = getActiveKitten()
    el.attr('style', `transform: ${POPOVER_TRANSFORM_VALUE(activeKitten.age)}`)
}