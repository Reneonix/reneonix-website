import { Text, View, Image } from '@react-pdf/renderer';
import { styles } from './pdfStyles.js';

// A paragraph's `text` is either a plain string, or an array of segments
// (`{ text, bold? }`) for inline emphasis — mirrors how the site's own
// article copy mixes plain and **bold** phrases without needing a full
// markdown parser.
function renderInline(text) {
  if (typeof text === 'string') return text;
  return text.map((seg, i) => (
    <Text key={i} style={seg.bold ? styles.bold : seg.italic ? styles.italic : undefined}>
      {seg.text}
    </Text>
  ));
}

/**
 * Renders one generic content block. Every block type below is what an
 * article's data file is built from — the template never branches on
 * *which* article it's rendering, only on which block types it contains.
 */
export default function ContentBlock({ block }) {
  switch (block.type) {
    // A section's own top-level heading, threaded through the same block
    // list as everything else purely so the orphan-pairing logic in
    // ArticlePDFDocument (which pairs any heading with whatever follows it)
    // applies here too, not just to h2/h3s.
    case 'sectionHeading':
      return <Text style={styles.sectionHeading}>{block.text}</Text>;

    case 'heading':
      return (
        <Text style={block.level === 3 ? styles.h3 : styles.h2}>
          {block.text}
        </Text>
      );

    case 'paragraph':
      return <Text style={styles.paragraph}>{renderInline(block.text)}</Text>;

    case 'image':
      return (
        <View style={styles.imageBlock} wrap={false}>
          <Image src={block.src} style={styles.image} />
          {block.caption && <Text style={styles.caption}>{block.caption}</Text>}
        </View>
      );

    case 'list':
      return (
        <View style={styles.list}>
          {block.items.map((item, i) => {
            const label = typeof item === 'string' ? item : item.text;
            const sub = typeof item === 'string' ? null : item.sub;
            return (
              <View key={i} style={styles.listItem} wrap={false}>
                <Text style={styles.listBullet}>{block.ordered ? `${i + 1}.` : '•'}</Text>
                <View style={styles.listItemBody}>
                  <Text style={styles.listItemText}>{renderInline(label)}</Text>
                  {sub && <Text style={styles.listItemSub}>{sub}</Text>}
                </View>
              </View>
            );
          })}
        </View>
      );

    case 'quote':
      return (
        <View style={styles.quoteBlock} wrap={false}>
          <Text style={styles.quoteText}>&#8220;{block.text}&#8221;</Text>
        </View>
      );

    case 'table':
      return (
        <View style={styles.table} wrap={false}>
          <View style={styles.tableHeaderRow}>
            {block.headers.map((h, i) => (
              <Text key={i} style={styles.tableHeaderCell}>{h}</Text>
            ))}
          </View>
          {block.rows.map((row, ri) => (
            <View key={ri} style={[styles.tableRow, ri % 2 === 1 ? styles.tableRowAlt : undefined]}>
              {row.map((cell, ci) => (
                <Text key={ci} style={styles.tableCell}>{cell}</Text>
              ))}
            </View>
          ))}
        </View>
      );

    case 'statPunch':
      return <Text style={styles.statPunch}>{renderInline(block.text)}</Text>;

    default:
      return null;
  }
}
