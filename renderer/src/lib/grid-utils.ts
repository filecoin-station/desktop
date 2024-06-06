// Source: https://easings.net/
export function easeInOutCubic (x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}
export function easeOutCirc (x: number): number {
  return Math.sqrt(1 - Math.pow(x - 1, 2))
}

// Max FIL amount that will cause changes to the grid
const maxFIL = 5
// Max amount of force to warp the grid. If it increases
// too much, the grid starts to break
const maxWarpForce = 700

// Determine warp properties for a given balance. This uses an
// easing function to return a bigger increment in warp for lower balances
export function getGridConfigForBalance (balance: number) {
  const progress = balance * 100 / maxFIL / 100

  const config = {
    force: easeOutCirc(progress) * maxWarpForce,
    radius: 90,
    linesAffected: 10
  }

  if (config.force > 600) {
    config.radius = 150
    config.linesAffected = 12
  } else if (config.force > 500) {
    config.radius = 135
    config.linesAffected = 12
  } else if (config.force > 400) {
    config.radius = 110
    config.linesAffected = 12
  } else if (config.force > 300) {
    config.radius = 100
    config.linesAffected = 11
  }

  return config
}
