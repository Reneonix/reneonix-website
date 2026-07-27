import { StyleSheet } from '@react-pdf/renderer';

// Reneonix brand tokens, mirrored from src/styles/global.css — kept as
// plain hex here since react-pdf styles can't read CSS custom properties.
export const COLORS = {
  lime: '#B2DE3A',
  limeDeep: '#7FA426',
  ink: '#131516',
  mut: '#4A4F44',
  line: '#E2E2DC',
  paper: '#F5F5F5',
  white: '#FFFFFF',
};

// Core PDF fonts (Helvetica) — always available, no font files to fetch or
// register, so PDF generation never depends on a network request succeeding.
const FONT = 'Helvetica';
const FONT_BOLD = 'Helvetica-Bold';
const FONT_OBLIQUE = 'Helvetica-Oblique';

export const styles = StyleSheet.create({
  page: {
    fontFamily: FONT,
    fontSize: 10.5,
    lineHeight: 1.55,
    color: COLORS.ink,
    backgroundColor: COLORS.white,
    paddingTop: 64,
    paddingBottom: 56,
    paddingHorizontal: 56,
  },

  // ── Running header (content pages only) ─────────────────────
  runningHeader: {
    position: 'absolute', top: 24, left: 56, right: 56,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingBottom: 8, borderBottom: `0.75pt solid ${COLORS.line}`,
  },
  runningHeaderTitle: { fontFamily: FONT_BOLD, fontSize: 8, color: COLORS.mut, maxWidth: 340 },
  runningHeaderCategory: {
    fontFamily: FONT_BOLD, fontSize: 7.5, color: COLORS.limeDeep, letterSpacing: 1,
  },

  // ── Footer (every page) ──────────────────────────────────────
  footer: {
    position: 'absolute', bottom: 22, left: 56, right: 56,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 8, borderTop: `0.75pt solid ${COLORS.line}`,
  },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerLogoImage: { width: 11, height: 11 },
  footerText: { fontSize: 7.5, color: COLORS.mut },
  footerPage: { fontSize: 7.5, color: COLORS.mut },

  // ── Cover page ────────────────────────────────────────────────
  coverPage: {
    fontFamily: FONT, backgroundColor: COLORS.white, color: COLORS.ink,
    padding: 56, display: 'flex', flexDirection: 'column', height: '100%',
  },
  coverLogoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 48 },
  // Source asset is 951x244 — height fixed, width matches that aspect ratio.
  coverLogoImage: { width: 94, height: 24 },
  coverCategory: {
    alignSelf: 'flex-start',
    fontFamily: FONT_BOLD, fontSize: 9, letterSpacing: 1.2, color: COLORS.limeDeep,
    backgroundColor: '#EEF6DA', borderRadius: 999, paddingVertical: 5, paddingHorizontal: 12,
    marginBottom: 18, textTransform: 'uppercase',
  },
  coverTitle: {
    fontFamily: FONT_BOLD, fontSize: 27, lineHeight: 1.22, color: COLORS.ink, marginBottom: 16,
  },
  coverDescription: {
    fontSize: 12, lineHeight: 1.6, color: COLORS.mut, marginBottom: 26, maxWidth: 440,
  },
  coverImageWrap: {
    width: '100%', height: 270, borderRadius: 6, overflow: 'hidden',
    backgroundColor: COLORS.paper, marginBottom: 26,
    alignItems: 'center', justifyContent: 'center',
  },
  // 'contain' (not 'cover') so the source image is never cropped — hero
  // photos often carry their own padding/negative space, and cropping to
  // fill the box can cut into the actual subject.
  coverImage: { width: '100%', height: '100%', objectFit: 'contain' },
  coverMetaRow: {
    flexDirection: 'row', gap: 26, paddingTop: 18, borderTop: `0.75pt solid ${COLORS.line}`,
    marginTop: 'auto',
  },
  coverMetaItem: { flexDirection: 'column', gap: 2 },
  coverMetaLabel: {
    fontFamily: FONT_BOLD, fontSize: 7, letterSpacing: 1, color: COLORS.mut, textTransform: 'uppercase',
  },
  coverMetaValue: { fontFamily: FONT_BOLD, fontSize: 10, color: COLORS.ink },

  // ── Content blocks ───────────────────────────────────────────
  sectionHeading: {
    fontFamily: FONT_BOLD, fontSize: 16, color: COLORS.ink, marginTop: 18, marginBottom: 8,
    paddingBottom: 6, borderBottom: `1.5pt solid ${COLORS.limeDeep}`,
  },
  h2: { fontFamily: FONT_BOLD, fontSize: 13.5, color: COLORS.ink, marginTop: 14, marginBottom: 7 },
  h3: { fontFamily: FONT_BOLD, fontSize: 11.5, color: COLORS.ink, marginTop: 12, marginBottom: 6 },
  paragraph: { fontSize: 10.5, lineHeight: 1.6, color: COLORS.mut, marginBottom: 9, textAlign: 'left' },
  bold: { fontFamily: FONT_BOLD, color: COLORS.ink },
  italic: { fontFamily: FONT_OBLIQUE },

  imageBlock: { marginVertical: 10 },
  image: { width: '100%', borderRadius: 4, objectFit: 'cover', maxHeight: 210 },
  caption: {
    fontSize: 8, fontFamily: FONT_OBLIQUE, color: COLORS.mut, marginTop: 5, textAlign: 'center',
  },

  list: { marginBottom: 10, marginTop: 2 },
  listItem: { flexDirection: 'row', marginBottom: 5, paddingRight: 4 },
  listBullet: { width: 16, fontFamily: FONT_BOLD, fontSize: 10, color: COLORS.limeDeep },
  listItemBody: { flex: 1 },
  listItemText: { fontSize: 10.5, lineHeight: 1.5, color: COLORS.mut },
  listItemSub: { fontSize: 9, lineHeight: 1.4, color: COLORS.mut, marginTop: 1, fontFamily: FONT_OBLIQUE },

  quoteBlock: {
    marginVertical: 9, paddingVertical: 10, paddingLeft: 16,
    borderLeft: `2.5pt solid ${COLORS.limeDeep}`, backgroundColor: COLORS.paper,
  },
  quoteText: {
    fontFamily: FONT_OBLIQUE, fontSize: 11.5, lineHeight: 1.55, color: COLORS.ink,
  },

  table: {
    marginVertical: 10, border: `0.75pt solid ${COLORS.line}`, borderRadius: 3, overflow: 'hidden',
  },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#14170F' },
  tableHeaderCell: {
    flex: 1, fontFamily: FONT_BOLD, fontSize: 8.5, color: COLORS.lime,
    padding: 7, letterSpacing: 0.4, textTransform: 'uppercase',
  },
  tableRow: { flexDirection: 'row', borderTop: `0.75pt solid ${COLORS.line}` },
  tableRowAlt: { backgroundColor: COLORS.paper },
  tableCell: { flex: 1, fontSize: 9.5, color: COLORS.mut, padding: 7, lineHeight: 1.4 },

  statPunch: {
    fontFamily: FONT_BOLD, fontSize: 13, color: COLORS.ink, marginVertical: 10,
  },
});
