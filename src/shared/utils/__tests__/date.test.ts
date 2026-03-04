import { describe, it, expect } from 'vitest'
import { formatDate, formatRelativeDate, startOfMonth, endOfMonth } from '../date'

describe('formatDate', () => {
  it('formats a date string', () => {
    const result = formatDate('2026-03-04', 'en-US')
    expect(result).toContain('Mar')
    expect(result).toContain('2026')
  })

  it('formats a Date object', () => {
    const result = formatDate(new Date(2026, 2, 4), 'en-US')
    expect(result).toContain('Mar')
    expect(result).toContain('4')
  })
})

describe('formatRelativeDate', () => {
  it('returns "Today" for today', () => {
    expect(formatRelativeDate(new Date())).toBe('Today')
  })

  it('returns "Yesterday" for yesterday', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    expect(formatRelativeDate(yesterday)).toBe('Yesterday')
  })

  it('returns "N days ago" for recent dates', () => {
    const threeAgo = new Date()
    threeAgo.setDate(threeAgo.getDate() - 3)
    expect(formatRelativeDate(threeAgo)).toBe('3 days ago')
  })
})

describe('startOfMonth', () => {
  it('returns the first day of the month at midnight', () => {
    const date = new Date(2026, 2, 15)
    const result = startOfMonth(date)
    expect(result.getDate()).toBe(1)
    expect(result.getMonth()).toBe(2)
    expect(result.getFullYear()).toBe(2026)
  })
})

describe('endOfMonth', () => {
  it('returns the last day of the month at end of day', () => {
    const date = new Date(2026, 1, 5) // Feb
    const result = endOfMonth(date)
    expect(result.getDate()).toBe(28)
    expect(result.getHours()).toBe(23)
    expect(result.getMinutes()).toBe(59)
  })
})
