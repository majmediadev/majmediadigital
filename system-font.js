/*!
 * system-font.js
 * Forces the whole site to use the normal system sans-serif font.
 * Add ONE line inside <head> of any page (existing or future):
 *   <script src="/system-font.js"></script>
 * No other file needs to change. To use another font later, edit STACK below.
 */
(function () {
  'use strict';

  var STACK = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

  // 1) Override the font variables and every element's font-family (beats inline styles too).
  var css =
    ':root{--font-display:' + STACK + ';--font-body:' + STACK + ';--font-mono:' + STACK + ';}' +
    'html,body,body *,body *::before,body *::after{font-family:' + STACK + ' !important;}';

  var style = document.createElement('style');
  style.id = 'system-font-override';
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);

  // 2) Stop downloading web fonts (Google Fonts) - they're no longer needed.
  function isFontLink(n) {
    if (!n || n.tagName !== 'LINK') return false;
    var h = n.getAttribute('href') || '';
    return h.indexOf('fonts.googleapis.com') !== -1 || h.indexOf('fonts.gstatic.com') !== -1;
  }
  function stripFontLinks(root) {
    var links = (root.querySelectorAll ? root.querySelectorAll('link') : []);
    for (var i = 0; i < links.length; i++) {
      if (isFontLink(links[i])) links[i].parentNode.removeChild(links[i]);
    }
  }
  stripFontLinks(document);

  // Catch font links that appear while the page is still parsing (or get added later),
  // and keep our style tag last so nothing overrides it.
  new MutationObserver(function (muts) {
    for (var i = 0; i < muts.length; i++) {
      var added = muts[i].addedNodes;
      for (var j = 0; j < added.length; j++) {
        var n = added[j];
        if (isFontLink(n)) n.parentNode.removeChild(n);
        else if (n.nodeType === 1 && n.tagName === 'STYLE' && n.id !== 'system-font-override' && n.parentNode === style.parentNode) {
          style.parentNode.appendChild(style); // re-append so we stay last
        }
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
