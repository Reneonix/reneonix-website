import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { FileText, Loader2 } from 'lucide-react';
import ArticlePDFDocument from './ArticlePDFDocument.jsx';
import './ArticlePDF.css';

/**
 * <ArticlePDF article={article} /> — a button that generates a real PDF for
 * the given article and saves it straight to the user's downloads with a
 * clean, real filename (article.fileName, falling back to article.title).
 * Opening the blob in a new tab and letting the browser's own "Save"
 * suggest a name doesn't work reliably — blob: URLs carry no filename, so
 * browsers fall back to the object URL's internal id (a raw UUID). An
 * anchor's `download` attribute is the one thing every browser honours.
 * Works for any article shaped like the data files in src/pdf/data/ — no
 * per-article code.
 */
export default function ArticlePDF({ article, label = 'Download PDF', className = '' }) {
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);

    try {
      const blob = await pdf(<ArticlePDFDocument article={article} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${article.fileName || article.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      console.error('Failed to generate article PDF:', err);
      window.alert('Sorry — something went wrong generating this PDF. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className={`btn btn-outline-dark article-pdf-btn ${className}`.trim()}
      onClick={handleClick}
      disabled={busy}
    >
      {busy ? <Loader2 size={16} className="article-pdf-btn__spin" aria-hidden="true" /> : <FileText size={16} aria-hidden="true" />}
      {busy ? 'Preparing PDF…' : label}
    </button>
  );
}
