/** Preserve source newlines inside Markdown paragraphs as visible hard breaks. */
export function remarkLineBreaks() {
  return tree => {
    const visit = node => {
      if (!Array.isArray(node?.children)) return;
      const children = [];
      for (const child of node.children) {
        if (child.type === 'text' && typeof child.value === 'string' && child.value.includes('\n')) {
          const lines = child.value.split('\n');
          for (let index = 0; index < lines.length; index++) {
            if (lines[index]) children.push({ ...child, value: lines[index] });
            if (index < lines.length - 1) children.push({ type: 'break' });
          }
        } else {
          visit(child);
          children.push(child);
        }
      }
      node.children = children;
    };
    visit(tree);
  };
}
