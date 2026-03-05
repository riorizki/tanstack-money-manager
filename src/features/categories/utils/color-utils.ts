/**
 * Calculate the perceived brightness of a color
 * Returns a value between 0 (black) and 255 (white)
 */
export function getColorBrightness(color: string): number {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  // Using the relative luminance formula
  return (r * 299 + g * 587 + b * 114) / 1000
}

/**
 * Check if a color is considered light
 */
export function isLightColor(color: string): boolean {
  return getColorBrightness(color) > 128
}

/**
 * Get the appropriate text/icon color (black or white) for a background color
 */
export function getContrastColor(color: string): 'black' | 'white' {
  return isLightColor(color) ? 'black' : 'white'
}

/**
 * Get icon color class based on background color
 */
export function getIconColorClass(color: string): string {
  return isLightColor(color) ? 'text-black' : 'text-white'
}
