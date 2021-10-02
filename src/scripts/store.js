/**
 * @file store.js
 * @description The global store and its modifiers
 * @author Tzingtao Chow <i@tzingtao.com>
 */

// The application is designed as weak data-driven with a simple store

const store = {
    activeKitten: undefined,
    canvasContext: undefined,
}

export const setActiveKitten = (k) => (store.activeKitten = k)
export const getActiveKitten = () => store.activeKitten

export const setCanvasContext = (ctx) => (store.canvasContext = ctx)
export const getCanvasContext = () => store.canvasContext
