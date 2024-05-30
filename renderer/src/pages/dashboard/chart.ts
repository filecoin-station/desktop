import { PluginChartOptions, ChartType, Plugin } from 'chart.js'
import { TimeRange } from './ChartController'
import { formatFilValue } from 'src/lib/utils'

export type ExternalToltipHandler = PluginChartOptions<'line'>['plugins']['tooltip']['external']
export type CustomPlugin = Plugin<'line', unknown>

// At any given point, chart dataset points are held in an array,
// 0 is totalReceived data, 1 is scheduled data
export enum DatasetIndex {
  TotalReceived = 0,
  Scheduled = 1
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
  if (opacity === 0) {
    element.style.opacity = '0'
    return
  }

  element.querySelector('[data-date]')?.replaceChildren(
    formatDate(date)
  )
  element.querySelector('[data-totalreceived]')?.replaceChildren(
    `${formatFilValue(totalReceived.toString())} FIL`
  )
  element.querySelector('[data-scheduled]')?.replaceChildren(
    `${formatFilValue(scheduled.toString())} FIL`
  )

  element.style.opacity = '1'
  element.style.transform = `translate(${position.x}px, ${position.y}px)`
}

// Custom tooltip to draw cross lines at the tooltip point
export const hoverCrossLines: CustomPlugin = {
  id: 'hoverCrossLines',
  afterDatasetsDraw (chart) {
    const { tooltip, ctx, chartArea } = chart

    if (!tooltip?.dataPoints?.length) return

    const { x, y } = tooltip.dataPoints[DatasetIndex.Scheduled].element

    ctx.strokeStyle = '#A0A1BA'
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
