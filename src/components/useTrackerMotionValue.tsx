import { useEffect } from 'react'
import { useScrollbar } from '@14islands/r3f-scroll-rig'
import { useMotionValue } from 'framer-motion'

/**
 * Return a Framer Motion value bound to a tracker scrollState
 * @param {Tracker} tracker scroll-rig tracker instance
 * @param {string} prop scrollState prop to bind
 */

declare module 'tracker-motion-value' {
  export function useTrackerMotionValue(tracker, prop = 'progress') {
    const progress = useMotionValue(0)
    const { onScroll } = useScrollbar()
    const { scrollState, rect } = tracker

    useEffect(() => {
      // update progress on scroll
      return onScroll(() => {
        progress.set(scrollState[prop])
      })
    }, [progress, scrollState, prop, onScroll, rect])

    return progress
  }
}
