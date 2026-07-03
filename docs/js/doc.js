(function () {
  "use strict";

  var sections = document.querySelectorAll(".doc-section");
  var navLinks = document.querySelectorAll(".nav-item a");
  var pageTitle = document.getElementById("pageTitle");
  var pageSubtitle = document.getElementById("pageSubtitle");

  var meta = {
    introduction:       ["Introduction", "guns.lol Profile Clone — Configuration & Setup Guide"],
    quickstart:         ["Quick Start", "Get up and running in 30 seconds"],
    "project-structure":["Project Structure", "How the project is organized"],
    "config-overview":  ["Configuration Overview", "All settings at a glance"],
    "config-profile":   ["Profile", "Username, avatar, splash, and join date"],
    "config-badges":    ["Badges", "Badge system with 12 icons"],
    "config-bio":       ["Bio & Typewriter", "Static or animated bio text"],
    "config-links":     ["Links", "Social link buttons"],
    "config-audio":     ["Audio Player", "Music player with playlist support"],
    "config-layout":    ["Layouts", "5 layout presets explained"],
    "config-theme":     ["Theme", "Colors, fonts, and appearance"],
    "config-background":["Background", "Colors, images, and animated effects"],
    "effect-mouse":     ["Mouse Effects", "Trail, particles, glow, and ripple"],
    "effect-card3d":    ["3D Card Tilt", "Interactive card rotation"],
    "effect-cursor":    ["Custom Cursor", "Replace the system cursor"],
    "effect-shuffle":   ["Shuffle Text", "Matrix-style text animation"],
    "effect-particles": ["Particle System", "Velocity-based particle engine"],
    "extra-location":   ["Location", "Timezone-aware location display"],
    "extra-about":      ["About", "About section with text"],
    "extra-portfolio":  ["Portfolio", "Skills and projects showcase"],
    "example-complete": ["Complete Config", "Full configuration example"],
    troubleshooting:     ["Troubleshooting", "Common issues and fixes"],
    changelog:           ["Changelog", "Recent changes and updates"],
  };

  function showSection(id) {
    // hide all
    for (var i = 0; i < sections.length; i++) {
      sections[i].classList.remove("active");
    }
    var target = document.getElementById(id);
    if (target) {
      target.classList.add("active");
    }
    // update breadcrumb
    var info = meta[id];
    if (info) {
      var crumb = document.getElementById("docBarCurrent");
      if (crumb) crumb.textContent = info[0];
    }
    // update nav active
    for (var j = 0; j < navLinks.length; j++) {
      navLinks[j].classList.remove("active");
    }
    var activeLink = document.querySelector('.nav-item a[data-target="' + id + '"]');
    if (activeLink) {
      activeLink.classList.add("active");
      // expand parent group
      var parent = activeLink.closest(".nav-items");
      if (parent) {
        parent.classList.remove("closed");
        var title = parent.previousElementSibling;
        if (title) title.classList.remove("closed");
      }
    }
    window.location.hash = id;
  }

  // Nav click handlers
  for (var k = 0; k < navLinks.length; k++) {
    navLinks[k].addEventListener("click", function (e) {
      e.preventDefault();
      var id = this.getAttribute("data-target");
      if (id) showSection(id);
      // close sidebar on mobile
      if (window.innerWidth <= 860) {
        document.getElementById("sidebar").classList.remove("open");
      }
    });
  }

  // Group collapse/expand
  var groupTitles = document.querySelectorAll(".nav-group-title");
  for (var g = 0; g < groupTitles.length; g++) {
    groupTitles[g].addEventListener("click", function () {
      this.classList.toggle("closed");
      var items = this.nextElementSibling;
      if (items) items.classList.toggle("closed");
    });
  }

  // Expose showSection globally for inline onclick handlers (nav cards, etc.)
  window.showSection = showSection;

  // Hash navigation
  window.addEventListener("hashchange", function () {
    var id = window.location.hash.replace("#", "");
    if (id) showSection(id);
  });

  // Initial load from hash
  var initialHash = window.location.hash.replace("#", "");
  if (initialHash && meta[initialHash]) {
    showSection(initialHash);
  } else {
    showSection("introduction");
  }

  // ─── Search modal ───
  var searchTrigger = document.getElementById("searchInput");
  var searchModal, searchInput, searchResults;
  var searchIndex = [];
  var selectedIdx = -1;

  function buildSearchIndex() {
    var ids = Object.keys(meta);
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      var el = document.getElementById(id);
      if (!el) continue;
      var title = (meta[id] && meta[id][0]) || id;
      var text = el.textContent || "";
      var lines = [];
      var headings = el.querySelectorAll("h1, h2, h3, h4");
      for (var j = 0; j < headings.length; j++) {
        var h = headings[j].textContent.trim();
        if (h) lines.push(h);
      }
      searchIndex.push({ id: id, title: title, text: text, headings: lines });
    }
  }

  function createSearchModal() {
    var overlay = document.createElement("div");
    overlay.className = "search-overlay";
    overlay.style.display = "none";
    var container = document.createElement("div");
    container.className = "search-modal";
    var input = document.createElement("input");
    input.className = "search-modal-input";
    input.type = "text";
    input.placeholder = "Search docs…";
    input.autocomplete = "off";
    input.spellcheck = false;
    var list = document.createElement("div");
    list.className = "search-results";
    container.appendChild(input);
    container.appendChild(list);
    overlay.appendChild(container);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeSearch();
    });
    document.body.appendChild(overlay);
    searchModal = overlay;
    searchInput = input;
    searchResults = list;

    input.addEventListener("input", function () {
      renderResults(this.value);
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeSearch();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectResult(selectedIdx + 1);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        selectResult(selectedIdx - 1);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIdx >= 0) {
          var items = searchResults.querySelectorAll(".sr-item");
          if (items[selectedIdx]) {
            var id = items[selectedIdx].getAttribute("data-id");
            if (id) { showSection(id); closeSearch(); }
          }
        }
        return;
      }
    });
  }

  function openSearch() {
    if (!searchModal) return;
    searchModal.style.display = "flex";
    searchModal.classList.remove("closing");
    searchInput.value = "";
    searchResults.innerHTML = '<div class="sr-empty">Start typing to search…</div>';
    selectedIdx = -1;
    document.body.style.overflow = "hidden";
    setTimeout(function () { searchInput.focus(); }, 10);
  }

  function closeSearch() {
    if (!searchModal) return;
    searchModal.classList.add("closing");
    setTimeout(function () {
      searchModal.style.display = "none";
      searchModal.classList.remove("closing");
    }, 120);
    document.body.style.overflow = "";
    if (searchTrigger) searchTrigger.blur();
  }

  function highlightMatch(text, q) {
    if (!q) return text;
    var re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
    return text.replace(re, "<mark>$1</mark>");
  }

  function getSnippet(text, q, maxLen) {
    maxLen = maxLen || 120;
    if (!q) return text.slice(0, maxLen);
    var idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text.slice(0, maxLen);
    var start = Math.max(0, idx - 40);
    var end = Math.min(text.length, idx + q.length + 60);
    var snippet = text.slice(start, end);
    if (start > 0) snippet = "…" + snippet;
    if (end < text.length) snippet = snippet + "…";
    return snippet;
  }

  function renderResults(q) {
    if (!searchResults) return;
    selectedIdx = -1;
    var query = q.toLowerCase().trim();
    if (!query) {
      searchResults.innerHTML = '<div class="sr-empty">Start typing to search…</div>';
      return;
    }
    var results = [];
    for (var i = 0; i < searchIndex.length; i++) {
      var item = searchIndex[i];
      var score = 0;
      var titleLower = item.title.toLowerCase();
      if (titleLower === query) score += 100;
      else if (titleLower.indexOf(query) !== -1) score += 50;
      if (item.text.toLowerCase().indexOf(query) !== -1) score += 10;
      for (var j = 0; j < item.headings.length; j++) {
        if (item.headings[j].toLowerCase().indexOf(query) !== -1) score += 20;
      }
      if (score > 0) {
        results.push({ item: item, score: score });
      }
    }
    results.sort(function (a, b) { return b.score - a.score; });
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="sr-empty">No results for <strong>' + escapeHtml(q) + '</strong></div>';
      return;
    }
    var html = "";
    for (var k = 0; k < results.length; k++) {
      var r = results[k];
      var snippet = getSnippet(r.item.text, query);
      html += '<div class="sr-item" data-id="' + r.item.id + '" data-idx="' + k + '">';
      html += '<div class="sr-title">' + highlightMatch(r.item.title, q) + '</div>';
      html += '<div class="sr-snippet">' + highlightMatch(snippet, q) + '</div>';
      html += '</div>';
    }
    searchResults.innerHTML = html;

    var items = searchResults.querySelectorAll(".sr-item");
    for (var m = 0; m < items.length; m++) {
      items[m].addEventListener("click", function () {
        var id = this.getAttribute("data-id");
        if (id) { showSection(id); closeSearch(); }
      });
      items[m].addEventListener("mouseenter", function () {
        var idx = parseInt(this.getAttribute("data-idx"), 10);
        selectResult(idx);
      });
    }
  }

  function selectResult(idx) {
    var items = searchResults.querySelectorAll(".sr-item");
    if (items.length === 0) return;
    if (idx < 0) idx = items.length - 1;
    if (idx >= items.length) idx = 0;
    selectedIdx = idx;
    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove("selected");
    }
    items[idx].classList.add("selected");
    items[idx].scrollIntoView({ block: "nearest" });
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  if (searchTrigger) {
    buildSearchIndex();
    createSearchModal();
    searchTrigger.addEventListener("click", function () { openSearch(); });
    searchTrigger.addEventListener("focus", function () { openSearch(); });
    searchTrigger.readOnly = true;
  }

  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      if (searchTrigger) openSearch();
    }
  });

  // Sidebar toggle
  var toggleBtn = document.getElementById("sidebarToggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      document.getElementById("sidebar").classList.toggle("open");
    });
  }

  // ─── Theme toggle ───
  var themeBtn = document.getElementById("themeToggle");
  var html = document.documentElement;
  html.setAttribute("data-theme", localStorage.getItem("docs-theme") || "light");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var cur = html.getAttribute("data-theme") || "dark";
      var next = cur === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
      localStorage.setItem("docs-theme", next);
    });
  }

  // ─── Copy button ───
  function addCopyButtons() {
    var blocks = document.querySelectorAll(".code-block:not(.has-copy)");
    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      b.classList.add("has-copy");
      var pre = b.querySelector("pre");
      if (!pre) continue;
      var btn = document.createElement("button");
      btn.className = "code-copy";
      btn.textContent = "Copy";
      btn.addEventListener("click", function () {
        var code = this.parentElement.querySelector("pre");
        if (!code) return;
        var text = code.textContent || "";
        // copy via clipboard API
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(function () {
            feedback(this);
          }.bind(this)).catch(function () {});
        } else {
          // fallback
          var ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed"; ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          feedback(this);
        }
        function feedback(el) {
          el.textContent = "Copied!";
          el.classList.add("copied");
          setTimeout(function () {
            el.textContent = "Copy";
            el.classList.remove("copied");
          }, 1500);
        }
      });
      b.appendChild(btn);
    }
  }

  // ─── Syntax highlighting (single-pass) ───
  function highlightCode(el) {
    var txt = el.textContent || el.innerText || "";
    var out = "";
    var i = 0;
    while (i < txt.length) {
      // Try to match a pattern starting at position i
      var best = null;
      for (var p = 0; p < HL.length; p++) {
        HL[p].re.lastIndex = 0;
        var m = HL[p].re.exec(txt.slice(i));
        if (m && m.index === 0) {
          if (!best || m[0].length > best.match.length) {
            best = { match: m[0], cls: HL[p].cls };
          }
        }
      }
      if (best) {
        out += '<span class="' + best.cls + '">' + best.match + "</span>";
        i += best.match.length;
      } else {
        out += txt[i];
        i++;
      }
    }
    el.innerHTML = out;
  }

  var HL = [
    { re: /\/\/.*/g, cls: "hl-com" },
    { re: /\/\*[\s\S]*?\*\//g, cls: "hl-com" },
    { re: /"(?:[^"\\]|\\.)*"\s*(?=:)/g, cls: "hl-prop" },
    { re: /`(?:[^`\\]|\\.)*`/g, cls: "hl-str" },
    { re: /"(?:[^"\\]|\\.)*"/g, cls: "hl-str" },
    { re: /'(?:[^'\\]|\\.)*'/g, cls: "hl-str" },
    { re: /\b(?:const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|typeof|instanceof|new|delete|import|export|from|default|class|extends|super|this|async|await|yield|throw|try|catch|finally|in|of)\b/g, cls: "hl-kw" },
    { re: /\b(?:true|false|null|undefined)\b/g, cls: "hl-bool" },
    { re: /\b(?:string|number|boolean|object|Array|Promise|void|never|any|unknown)\b/g, cls: "hl-type" },
    { re: /\b(\d+(?:\.\d+)?)\b/g, cls: "hl-num" },
  ];

  function highlightAll() {
    var codes = document.querySelectorAll(".code-block pre code");
    for (var i = 0; i < codes.length; i++) {
      if (codes[i].dataset.highlighted) continue;
      highlightCode(codes[i]);
      codes[i].dataset.highlighted = "1";
    }
  }

  // ─── Auto TOC for long sections ───
  function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function addToc() {
    var sectionList = document.querySelectorAll(".doc-section");
    for (var i = 0; i < sectionList.length; i++) {
      var sec = sectionList[i];
      var headings = sec.querySelectorAll("h2, h3");
      if (headings.length < 4) continue;
      for (var j = 0; j < headings.length; j++) {
        var h = headings[j];
        if (!h.id) h.id = "toc-" + slugify(h.textContent);
      }
      var toc = document.createElement("div");
      toc.className = "section-toc";
      var list = "<strong>On this page</strong><ul>";
      for (var k = 0; k < headings.length; k++) {
        var h2 = headings[k];
        var tag = h2.tagName.toLowerCase();
        list += '<li class="toc-' + tag + '"><a href="#" data-toc="' + h2.id + '">' + h2.textContent + '</a></li>';
      }
      list += "</ul>";
      toc.innerHTML = list;
      toc.addEventListener("click", function (e) {
        var a = e.target.closest("a");
        if (!a) return;
        e.preventDefault();
        var id = a.getAttribute("data-toc");
        if (!id) return;
        var el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      var hero = sec.querySelector(".section-hero");
      var ref = hero ? hero.nextElementSibling : sec.firstElementChild;
      if (ref) sec.insertBefore(toc, ref);
      else sec.appendChild(toc);
    }
  }

  // ─── Back to top ───
  var backBtn = document.getElementById("backTop");
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", function () {
      backBtn.classList.toggle("vis", window.scrollY > 300);
    });
  }

  // ─── Sidebar scroll memory ───
  var sidebarNav = document.querySelector(".sidebar-nav");
  if (sidebarNav) {
    var saved = sessionStorage.getItem("docs-sidebar-scroll");
    if (saved) sidebarNav.scrollTop = parseInt(saved, 10);
    sidebarNav.addEventListener("scroll", function () {
      sessionStorage.setItem("docs-sidebar-scroll", this.scrollTop);
    });
  }

  // Run on load
  addCopyButtons();
  highlightAll();
  addToc();

})();
