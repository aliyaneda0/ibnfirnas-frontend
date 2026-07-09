const themeColors = {
  // Spec palette (v1 integration spec, 2026-07-10) — descriptive keys, use
  // these in new code.
  navy: '#0B1F3A',          // deepest shade — gradients, splash bg
  primary: '#2E6FE0',       // app name / title / active tab / primary buttons
  primaryLight: '#5B9BF0',  // hover/pressed states, gradient end-stop
  sky: '#8FD3FF',           // gradient accents, glass tints, subtle highlights
  accent: '#F5A623',        // CTA badges ("Featured", discount) ONLY — not destructive actions, see `error`
  error: '#E5484D',         // destructive actions, form validation
  surface: '#FFFFFF',       // cards, sheets
  surfaceMuted: '#F4F7FC',  // app background
  textPrimary: '#0B1F3A',   // body text on light surfaces
  textMuted: '#5C6B7A',     // secondary text, subtitles, placeholders
  whatsapp: '#25D366',      // WhatsApp FAB only — don't reuse elsewhere

  // Legacy keys — kept so existing screens repaint with the new palette
  // without a rename sweep. Values mirror the descriptive keys above.
  secondary: '#5B9BF0',     // mirrors primaryLight
  background: '#F4F7FC',    // mirrors surfaceMuted
  card: '#FFFFFF',          // mirrors surface
  text: '#0B1F3A',          // mirrors textPrimary
  textSecondary: '#5C6B7A', // mirrors textMuted
  border: '#E4E9F2',        // neutral divider, no direct spec equivalent
  success: '#2AA876',
};

const themeFontFamily = {
  sans: ["Poppins_400Regular"],
  medium: ["IBMPlexSans_600SemiBold"],
  bold: ["IBMPlexSans_700Bold"],
};

module.exports = {
  themeColors,
  themeFontFamily,
};
