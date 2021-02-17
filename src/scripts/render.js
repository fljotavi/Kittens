import {
    CAT_WEIGHT_DISTRIBUTION_SKEW,
    MAX_CAT_AGE,
    MAX_CAT_WEIGHT,
    MIN_CAT_AGE,
    MIN_CAT_WEIGHT,
    startingPoints
} from "./constants";

import { generateKittenPath } from "./generateKittenPath";
import { getRandomCatColor, getRandomGender, getNormalDistribution } from "./utils";

export const renderSingleKittenOn = (el, isUpdate = false) => {

    const { svg } = window.state.els

    if (isUpdate) {
        const t = svg.transition().duration(750);
        el.call(update => update.transition(t)
            .attr('d', d => d.path)
            .attr('fill', d => d.color)
        )
    } else {
        el.append("path")
            .attr('d', d => d.path)
            .attr('data-coords', d => d.coords)
            .attr('fill', d => d.color)
            .attr('stroke-width', 2)
            .attr('stroke', 'black')
            .transition()
    }

}

export const renderKittensOn = el => {

    el.selectAll('path')
        .data(startingPoints.map(sp => {

            const coords = `${sp[0]},${sp[1]}`
            const age = MIN_CAT_AGE + Math.random() * MAX_CAT_AGE
            const chubbiness = getNormalDistribution(MIN_CAT_WEIGHT, MAX_CAT_WEIGHT, CAT_WEIGHT_DISTRIBUTION_SKEW)
            const path = generateKittenPath(sp, age, chubbiness)
            const color = getRandomCatColor()
            const gender = getRandomGender()

            const kittenMetrics = { coords, age, chubbiness, path, color, gender }

            if (coords === '200,1230') {
                window.state.activeKitten = {
                    ...kittenMetrics,
                    path: generateKittenPath([0, 0], age, chubbiness)
                }
            }
            return kittenMetrics

        }))
        .join(
            enter => renderSingleKittenOn(enter),
            update => renderSingleKittenOn(update, true)
        )

}

export const kittenPropsToRender = [
    { text: 'Age', key: 'age', middleware: age => Math.round(age) },
    { text: 'Gender', key: 'gender', middleware: gender => gender },
    {
        text: 'Bodyweight', key: 'chubbiness',
        middleware: (chub, self) => `${(chub * 2.5 + chub * self.age / 6).toFixed(1)}kg`
    },
    { text: 'Color', key: 'color', middleware: 'CUSTOM' }
]

export const renderOverlayStaticOn = el => {
    el.append('path')
        .attr('d', 'm193.07708,524.84422c0,0.88124 52.87463,-71.38075 71.38075,-76.66821c18.50612,-5.28746 410.65962,-5.28746 410.57493,-5.79162c0.08469,0.50415 11.54086,-1.25833 16.82833,-6.5458c5.28746,-5.28746 5.28746,-5.28746 5.20277,-5.79162c0.08469,0.50415 2.72843,-355.51835 -1.67779,-360.80581c-4.40622,-5.28746 -21.14985,-6.16871 -21.23455,-6.67285c0.08469,0.50415 -523.37414,-2.13959 -532.18658,2.26663c-8.81244,4.40622 -7.93119,17.62488 -8.01588,17.12073c0.08468,0.50415 0.08468,347.71421 5.37214,357.4079c5.28746,9.69368 24.67483,10.57493 24.59014,10.07077c0.08468,0.50415 45.90936,-1.25833 45.82468,-1.76249c0.08468,0.50415 -16.65895,76.29112 -16.65895,77.17237z')
        .attr('fill', '#222')
    el.append('text')
        .attr('class', 'overlaid-text heading')
        .text('mxm!')
        .attr('x', 170)
        .attr('y', 170)
    el.append('rect')
        .attr('class', 'overlaid-text avatar')
        .attr('x', 174)
        .attr('y', 210)
        .attr('width', 155)
        .attr('height', 185)

    kittenPropsToRender.forEach((prop, iRow) => {
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

export const renderOverlayDynamicOn = el => {

    const { activeKitten } = window.state

    el.selectAll('text')
        .data(kittenPropsToRender
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
        .html("")

    renderSingleKittenOn(gKittenFrame)
}

export const renderFilterOn = el => {
    el.append('filter')
        .attr('id', 'xkcdify')
        .attr('filterUnits', 'userSpaceOnUse')
        .attr('x', -5)
        .attr('y', -5)
        .attr('width', '100%')
        .attr('height', '100%')
        .call((f) => f.append('feTurbulence')
            .attr('type', 'fractalNoise')
            .attr('baseFrequency', '0.07')
            .attr('result', 'noise'))
        .call((f) => f.append('feDisplacementMap')
            .attr('scale', '3')
            .attr('xChannelSelector', 'R')
            .attr('yChannelSelector', 'G')
            .attr('in', 'SourceGraphic')
            .attr('in2', 'noise'));
}

export const adjustPopoverRotation = el => {
    el.attr("style", `transform: rotate(${Math.random() * 5 - 1}deg)`)
}