export function getPreviousHeading(el, className = el.className, otherchildren = []) {
  const prevEl = el.previousElementSibling;
  if (prevEl && prevEl.tagName.match(/^H[1-6]$/)) {
    return {
      heading: prevEl.textContent,
      otherchildren,
      selector: `#${prevEl.id} ~ *[data-block-name="${className}"]`,
    };
  } else if (prevEl) {
    return getPreviousHeading(prevEl, className, [...otherchildren, el]);
  }
  return { otherchildren };
}
