import { Document, Page, View, Text, Image } from '@react-pdf/renderer';
import { styles } from './pdfStyles.js';
import ContentBlock from './ContentBlocks.jsx';

// react-pdf's minPresenceAhead only reserves blank space after a heading —
// it doesn't guarantee the block that follows actually fits in it, so a
// heading (section-level or h2/h3) can end up stranded alone at the bottom
// of a page with the rest of its section pushed onto a mostly-blank next
// page. Pairing every heading with whatever immediately follows it inside
// a single wrap={false} View is the deterministic fix: the pair always
// moves to the next page together as a unit, never splits.
function renderBlocks(blocks) {
  const nodes = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const next = blocks[i + 1];
    const isHeading = block.type === 'sectionHeading' || block.type === 'heading';
    if (isHeading && next) {
      nodes.push(
        <View key={i} wrap={false}>
          <ContentBlock block={block} />
          <ContentBlock block={next} />
        </View>
      );
      i += 1; // next has been consumed as part of this pair
    } else {
      nodes.push(<ContentBlock key={i} block={block} />);
    }
  }
  return nodes;
}

const SITE_URL = 'www.reneonix.com';
const YEAR = new Date().getFullYear();
const LOGO_SRC = '/Reneonix Logo white bg.jpg';
const ICON_SRC = '/Reneonix icon_ transparent.jpg';

function Footer() {
  return (
    <View style={styles.footer} fixed>
      <View style={styles.footerLeft}>
        <Image src={ICON_SRC} style={styles.footerLogoImage} />
        <Text style={styles.footerText}>Reneonix · {SITE_URL} · © {YEAR} Reneonix. All rights reserved.</Text>
      </View>
      <Text
        style={styles.footerPage}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
      />
    </View>
  );
}

function RunningHeader({ title, category }) {
  return (
    <View style={styles.runningHeader} fixed>
      <Text style={styles.runningHeaderTitle}>{title}</Text>
      <Text style={styles.runningHeaderCategory}>{category?.toUpperCase()}</Text>
    </View>
  );
}

/**
 * The one reusable PDF template every article renders through. Nothing in
 * here is article-specific — every word/image/list comes from `article`.
 * See src/pdf/data/*.js for the shape each article file provides.
 *
 * @param {{
 *   title: string, category: string, author: string, publishedDate: string,
 *   readingTime: string, description?: string, heroImage?: string,
 *   sections: { heading: string, blocks: object[] }[],
 * }} props.article
 */
export default function ArticlePDFDocument({ article }) {
  const { title, fileName, category, author, publishedDate, readingTime, description, heroImage, sections } = article;

  return (
    <Document title={fileName || title} author="Reneonix">
      {/* ============ COVER PAGE ============ */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverLogoRow}>
          <Image src={LOGO_SRC} style={styles.coverLogoImage} />
        </View>

        {category && <Text style={styles.coverCategory}>{category}</Text>}
        <Text style={styles.coverTitle}>{title}</Text>
        {description && <Text style={styles.coverDescription}>{description}</Text>}

        {heroImage && (
          <View style={styles.coverImageWrap}>
            <Image src={heroImage} style={styles.coverImage} />
          </View>
        )}

        <View style={styles.coverMetaRow}>
          {author && (
            <View style={styles.coverMetaItem}>
              <Text style={styles.coverMetaLabel}>Author</Text>
              <Text style={styles.coverMetaValue}>{author}</Text>
            </View>
          )}
          {publishedDate && (
            <View style={styles.coverMetaItem}>
              <Text style={styles.coverMetaLabel}>Published</Text>
              <Text style={styles.coverMetaValue}>{publishedDate}</Text>
            </View>
          )}
          {readingTime && (
            <View style={styles.coverMetaItem}>
              <Text style={styles.coverMetaLabel}>Reading Time</Text>
              <Text style={styles.coverMetaValue}>{readingTime}</Text>
            </View>
          )}
        </View>

        <Footer />
      </Page>

      {/* ============ CONTENT PAGES ============ */}
      <Page size="A4" style={styles.page} wrap>
        <RunningHeader title={title} category={category} />
        {sections.map((section, si) => (
          <View key={si}>
            {renderBlocks([{ type: 'sectionHeading', text: section.heading }, ...section.blocks])}
          </View>
        ))}
        <Footer />
      </Page>
    </Document>
  );
}
