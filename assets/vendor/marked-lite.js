/**
 * Minimal Markdown parser providing a Marked-compatible interface: marked.parse(md)
 * Supports: headings (#), paragraphs, unordered/ordered lists, links, bold, italics, inline code.
 * Designed for small bios and offline use.
 */
(function (global) {
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function inline(text) {
    // Work on escaped text to avoid HTML injection
    let t = escapeHtml(text);
    // Inline code
    t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Bold (strong) - handle **text**
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Italic - *text*
    t = t.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    // Links [text](url)
    t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return t;
  }

  function parse(md) {
    const lines = md.replace(/\r\n?/g, '\n').split('\n');
    const out = [];
    let inUl = false;
    let inOl = false;
    let para = [];

    function closeLists() {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
    }

    function flushPara() {
      if (para.length) {
        out.push('<p>' + inline(para.join(' ')) + '</p>');
        para = [];
      }
    }

    for (let raw of lines) {
      const line = raw.trimEnd();
      if (/^\s*$/.test(line)) {
        flushPara();
        closeLists();
        continue;
      }

      // Heading
      const hm = line.match(/^(#{1,6})\s+(.*)$/);
      if (hm) {
        flushPara();
        closeLists();
        const level = hm[1].length;
        out.push(`<h${level}>${inline(hm[2])}</h${level}>`);
        continue;
      }

      // Unordered list
      if (/^[-*]\s+/.test(line)) {
        flushPara();
        if (!inUl) { closeLists(); out.push('<ul>'); inUl = true; }
        out.push('<li>' + inline(line.replace(/^[-*]\s+/, '')) + '</li>');
        continue;
      }

      // Ordered list
      if (/^\d+\.\s+/.test(line)) {
        flushPara();
        if (!inOl) { closeLists(); out.push('<ol>'); inOl = true; }
        out.push('<li>' + inline(line.replace(/^\d+\.\s+/, '')) + '</li>');
        continue;
      }

      // Paragraph content
      para.push(line);
    }

    flushPara();
    closeLists();
    return out.join('\n');
  }

  global.marked = { parse };
})(typeof window !== 'undefined' ? window : globalThis);

