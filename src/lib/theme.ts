// Shared design tokens for the "case file" / verification dossier visual identity.
// Used across the homepage, report/results views, and PDF template so all three
// surfaces read as the same product. Do not hardcode colors that drift from this.

export const theme = {
  inkGreen: '#0F2B22',
  inkGreenDeep: '#0A1F19',
  gold: '#C7A65C',
  paper: '#F3EEE1',
  ink: '#171B14',
  inkSoft: '#6B6A5E',
  registryGreen: '#3E8A63',
  stampRed: '#C25B45',
  lagoonBlue: '#6FA8C7',
} as const

export const fontDisplay = "'Fraunces', serif"
export const fontBody = "'IBM Plex Sans', sans-serif"
export const fontMono = "'IBM Plex Mono', monospace"

export const GOOGLE_FONTS_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');"
