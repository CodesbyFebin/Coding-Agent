import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// Dark "Sovereign Command Center" theme. The palette is ported verbatim from
// the standalone prototype's CSS custom properties so the React app reproduces
// the same dark IDE surface rather than the prior light theme.
//
// `sovereign.*` are semantic tokens used directly: bg="sovereign.bg",
// color="sovereign.text", borderColor="sovereign.line", etc. The existing
// `brand` accent scale (#ff5a1f) is preserved so colorScheme="brand" usage
// keeps working.

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  colors: {
    // Accent scale unchanged from the verified build.
    brand: {
      50: '#fff5ed',
      100: '#ffe8d4',
      200: '#ffceaa',
      300: '#ffb080',
      400: '#ff8b57',
      500: '#ff5a1f',
      600: '#f0430e',
      700: '#c7330b',
      800: '#9e2a10',
      900: '#7f2811',
    },
    // Prototype's --bg / --panel* / --line*
    sovereign: {
      bg: '#080a0d',
      panel: '#0d1116',
      panel2: '#11171d',
      panel3: '#151d24',
      line: '#202a32',
      line2: '#2b3944',
      text: '#edf2f5',
      muted: '#8b99a4',
      dim: '#596771',
      accent: '#ff5a1f',
      accent2: '#ff8a4c',
      // codingagent.in brand flame accent (merged from the marketing build)
      flame: '#FF3E00',
      flameSoft: 'rgba(255, 62, 0, 0.11)',
      good: '#33d17a',
      warn: '#f5b942',
      bad: '#ff6b6b',
      blue: '#6aa9ff',
      purple: '#a878ff',
    },
  },
  fonts: {
    heading: `'Space Grotesk', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    display: `'Space Grotesk', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    body: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    mono: `'JetBrains Mono', 'SF Mono', ui-monospace, Menlo, Consolas, monospace`,
  },
  styles: {
    global: {
      'html, body': {
        bg: 'sovereign.bg',
        color: 'sovereign.text',
        fontFamily: 'body',
      },
      ':focus-visible': {
        outline: '2px solid #ff8a4c',
        outlineOffset: '2px',
      },
    },
  },
  components: {
    Input: { baseStyle: { field: { color: 'sovereign.text' } } },
    Textarea: { baseStyle: { color: 'sovereign.text' } },
    Select: { baseStyle: { field: { color: 'sovereign.text' } } },
  },
});
