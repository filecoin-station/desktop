import { PluginChartOptions, Plugin } from 'chart.js'
import { TimeRange } from './ChartController'
import { formatFilValue } from 'src/lib/utils'

export type ExternalToltipHandler = PluginChartOptions<'line'>['plugins']['tooltip']['external']
export type CustomPlugin = Plugin<'line', unknown>

export const colors = {
  black: '#000',
  xLine: '#D9D9E4',
  xAxisText: '#5F5A73',
  totalRewardsLine: '#2A1CF7',
  totalRewardsBg: '#b5b2f6',
  scheduledBg: '#dddcf5',
  crossLine: '#A0A1BA'
}

export const fonts = {
  body: 'SpaceGrotesk, serif',
  mono: 'SpaceMono, mono'
}

// At any given point, chart dataset points are held in an array,
// 0 is totalReceived data, 1 is scheduled data
export const datasetIndex = {
  totalRewards: 0,
  scheduled: 1
}

export const dateTimeFormatters = {
  daily: new Intl.DateTimeFormat(window.navigator.language, {
    day: 'numeric', month: 'short'
  }),
  monthly: new Intl.DateTimeFormat(window.navigator.language, {
    month: 'short', year: '2-digit'
  }),
  default: new Intl.DateTimeFormat(window.navigator.language, {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
}

type DateTimeFormat = keyof typeof dateTimeFormatters

export function formatDate (value: string | number | Date, type: DateTimeFormat = 'default') {
  return dateTimeFormatters[type].format(new Date(Number(value)))
}

export function formatTickDate (date: string, index: number, timeRange: TimeRange) {
  if (timeRange === '7d') {
    return formatDate(date, 'daily')
  }

  // In month view, show date every at every 4th tick
  if (timeRange === '1m') {
    return index % 4 === 0 ? formatDate(date, 'daily') : ''
  }

  // In year/all view, show date at start of every month
  if (timeRange === '1y' || timeRange === 'all') {
    const dateVal = new Date(date)

    return dateVal.getDate() === 1 ? formatDate(date, 'monthly') : ''
  }

  return formatDate(date)
}

// Update custom tooltip content imperatively, as this the easiest
// way to integrate with chart.js, and is more efficient for a
// constantly updating element than using regular React practices
export function updateTooltipElement ({
  element,
  date,
  totalReceived,
  scheduled,
  position,
  opacity
}: {
  element: HTMLDivElement;
  date: string;
  totalReceived: number;
  scheduled: number;
  position: {x: number; y: number};
  opacity: number;
}) {
  // Tooltip data provides an opacity value that is 0 when the
  // mouse has left the chart area; 1 when inside the chart
  if (opacity === 0) {
    element.style.opacity = '0'
    return
  }

  element.style.opacity = '1'

  const content = element.querySelector<HTMLDivElement>('[data-content]')

  if (content) {
    element.querySelector('[data-date]')?.replaceChildren(
      formatDate(date)
    )
    element.querySelector('[data-totalreceived]')?.replaceChildren(
      `${formatFilValue(totalReceived.toString())} FIL`
    )
    element.querySelector('[data-scheduled]')?.replaceChildren(
      `${formatFilValue(scheduled.toString())} FIL`
    )
    content.style.transform = `translate(${position.x}px, ${position.y}px)`
  }

  const indicator = element.querySelector<HTMLDivElement>('[data-indicator]')

  if (indicator) {
    indicator.style.transform = `translate(${position.x}px, ${position.y}px)`
  }
}

// Custom tooltip to draw cross lines at the tooltip point
export const hoverCrossLines: CustomPlugin = {
  id: 'hoverCrossLines',
  afterDatasetsDraw (chart) {
    const { tooltip, ctx, chartArea } = chart

    if (!tooltip?.dataPoints?.length) return

    const { x, y } = tooltip.dataPoints[datasetIndex.scheduled].element

    ctx.strokeStyle = colors.crossLine
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(chartArea.left, y)
    ctx.lineTo(chartArea.width + chartArea.left, y)
    ctx.moveTo(x, chartArea.top)
    ctx.lineTo(x, chartArea.top + chartArea.height)
    ctx.stroke()
  }
}
