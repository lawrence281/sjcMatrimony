/**
 * Design Token System
 * Single source of truth for all design values.
 * Used across JS (not CSS-only) — e.g., chart libraries, dynamic styles.
 */
const theme = {
  colors: {
    primary: {
      50:  '#fdf4ff',
      100: '#fae8ff',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
    },
    secondary: {
      500: '#f43f5e',
      600: '#e11d48',
      700: '#be123c',
    },
    success:  { light: '#dcfce7', DEFAULT: '#22c55e', dark: '#15803d' },
    warning:  { light: '#fef9c3', DEFAULT: '#eab308', dark: '#a16207' },
    danger:   { light: '#fee2e2', DEFAULT: '#ef4444', dark: '#b91c1c' },
    neutral: {
      50:  '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      500: '#71717a',
      600: '#52525b',
      900: '#18181b',
    },
    white: '#ffffff',
    black: '#000000',
  },
  fonts: {
    body:    'Inter, system-ui, sans-serif',
    heading: 'Plus Jakarta Sans, Inter, sans-serif',
  },
  fontSizes: {
    xs:   '0.75rem',
    sm:   '0.875rem',
    base: '1rem',
    lg:   '1.125rem',
    xl:   '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeights: {
    normal:   400,
    medium:   500,
    semibold: 600,
    bold:     700,
    extrabold: 800,
  },
  radii: {
    sm:   '0.375rem',
    md:   '0.5rem',
    lg:   '0.75rem',
    xl:   '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm:   '0 1px 3px rgba(0,0,0,0.08)',
    md:   '0 4px 24px -4px rgba(0,0,0,0.12)',
    lg:   '0 10px 40px -8px rgba(0,0,0,0.18)',
    glow: '0 0 20px rgba(217,70,239,0.25)',
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  transitions: {
    fast:   '150ms ease',
    normal: '250ms ease',
    slow:   '400ms ease',
  },
  breakpoints: {
    sm:  '640px',
    md:  '768px',
    lg:  '1024px',
    xl:  '1280px',
    '2xl': '1536px',
  },
  layout: {
    sidebarWidth:          '260px',
    sidebarCollapsedWidth: '72px',
    topbarHeight:          '64px',
    maxContentWidth:       '1280px',
  },
};

export default theme;
