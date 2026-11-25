// Shared, framework-free state between the choreography (writer) and the WebGL layer (reader).
export const state = {
  measure: 0, // 0 superposition .. 1 collapsed; max of scroll and click progress
  scroll: 0,
  click: 0,
  pointer: [0, 0] as [number, number], // -1..1 across the hero
};
export const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isMobile = () => window.matchMedia('(max-width: 899px)').matches;
