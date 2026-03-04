import { describe, it, expect } from 'vitest'
import { formatCurrency, parseCurrency } from '../currency'

describe('formatCurrency', () => {
  it('formats IDR correctly', () => {
    const result = formatCurrency(100000, 'IDR', 'id-ID')
    expect(result).toContain('100')
    expect(result).toContain('000')
  })

  it('formats USD correctly', () => {
    const result = formatCurrency(1500, 'USD', 'en-US')
    expect(result).toBe('$1,500')
  })

  it('handles zero', () => {
    const result = formatCurrency(0, 'USD', 'en-US')
    expect(result).toBe('$0')
  })

  it('handles negative amounts', () => {
    const result = formatCurrency(-500, 'USD', 'en-US')
    expect(result).toContain('500')
  })
})

describe('parseCurrency', () => {
  it('parses plain number string', () => {
    expect(parseCurrency('1500')).toBe(1500)
  })

  it('strips currency symbols', () => {
    expect(parseCurrency('$1,500')).toBe(1500)
  })

  it('handles decimal values', () => {
    expect(parseCurrency('1500.50')).toBe(1500.5)
  })

  it('returns 0 for empty/invalid strings', () => {
    expect(parseCurrency('')).toBe(0)
    expect(parseCurrency('abc')).toBe(0)
  })
})
