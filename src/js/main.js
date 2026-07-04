(function () {
  var isPageHidden = false;
  var isLowEndDevice = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory && navigator.deviceMemory <= 4) || window.innerWidth < 480;
  var isMobile = window.innerWidth < 768;
  var performanceScale = (isLowEndDevice || isMobile) ? 0.4 : 1;
  document.addEventListener("visibilitychange", function () { isPageHidden = document.hidden; });

  var resizeTimer;
  var resizeCallbacks = [];
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      for (var i = 0; i < resizeCallbacks.length; i++) resizeCallbacks[i]();
    }, 120);
  });
  function onResize(fn) { resizeCallbacks.push(fn); }

  var canvasScale = (isLowEndDevice ? 0.35 : isMobile ? 0.5 : 0.55);
  var pixelScale = 0.35;

  var animationQueue = [];
  function _registerAnimation(fn, weight) {
    animationQueue.push({ fn: fn, weight: weight || 1, skipCounter: 0 });
  }
  function _unregisterAnimation(fn) {
    for (var i = animationQueue.length - 1; i >= 0; i--) {
      if (animationQueue[i].fn === fn) animationQueue.splice(i, 1);
    }
  }
  function runAnimationLoop() {
    requestAnimationFrame(runAnimationLoop);
    if (isPageHidden) return;
    for (var i = 0; i < animationQueue.length; i++) {
      var entry = animationQueue[i];
      if (entry.weight > 1) {
        entry.skipCounter++;
        if (entry.skipCounter < entry.weight) continue;
        entry.skipCounter = 0;
      }
      entry.fn();
    }
  }
  runAnimationLoop();

  var theme = CONFIG.theme;

  // Theme presets
  if (theme.preset) {
    var presets = {
      dark: {
        textColor: "#ffffff", backgroundColor: "#050505", glowColor: "#ffffff",
        containerColor: "rgba(255,255,255,0.04)", containerBlur: "8px", containerBorderColor: "rgba(255,255,255,0.15)",
        buttonBg: "rgba(255,255,255,0.1)", buttonBorder: "1px solid rgba(255,255,255,0.12)",
        selectionBg: "#ffffff", selectionColor: "#000000",
      },
      light: {
        textColor: "#1a1a1a", backgroundColor: "#ffffff", glowColor: "#1a1a1a",
        usernameEffects: "none", containerColor: "rgba(0,0,0,0.03)", containerBlur: "0px",
        containerBorderColor: "rgba(0,0,0,0.12)", buttonBg: "rgba(0,0,0,0.06)",
        buttonBorder: "1px solid rgba(0,0,0,0.1)", selectionBg: "#1a1a1a", selectionColor: "#ffffff",
        volumeBg: "rgba(0,0,0,0.08)", volumeBorder: "1px solid rgba(0,0,0,0.05)",
      },
      neon: {
        textColor: "#ffffff", backgroundColor: "#0a0015", glowColor: "#ff00ff",
        usernameEffects: "none", containerColor: "rgba(255,0,255,0.05)", containerBlur: "6px",
        containerBorderColor: "#ff00ff", containerBorderWidth: "1px",
        buttonBg: "rgba(255,0,255,0.15)", buttonBorder: "1px solid #ff00ff",
        selectionBg: "#ff00ff", selectionColor: "#000000",
      },
      ocean: {
        textColor: "#e0f7ff", backgroundColor: "#001220", glowColor: "#00e5ff",
        usernameEffects: "none", containerColor: "rgba(0,180,255,0.06)", containerBlur: "8px",
        containerBorderColor: "rgba(0,229,255,0.3)", buttonBg: "rgba(0,180,255,0.12)",
        buttonBorder: "1px solid rgba(0,229,255,0.2)", selectionBg: "#00e5ff", selectionColor: "#000a14",
        volumeBg: "rgba(0,180,255,0.12)", volumeBorder: "1px solid rgba(0,229,255,0.15)",
      },
    };
    var preset = presets[theme.preset];
    if (preset) { for (var key in preset) { theme[key] = preset[key]; } }
  }
  var css = document.createElement("style");
  css.textContent =
    ":root{" +
    "--textColor:" + theme.textColor + ";" +
    "--backgroundColor:" + theme.backgroundColor + ";" +
    "--colorUsernameGlow:0px 0px 16.5px " + theme.glowColor + ";" +
    "--usernameEffects:" + theme.usernameEffects + ";" +
    "--containerColor:" + theme.containerColor + ";" +
    "--containerBlur:" + theme.containerBlur + ";" +
    "--containerRadius:" + CONFIG.layout.containerRadius + ";" +
    "--containerWidth:" + CONFIG.layout.containerWidth + ";" +
    "--containerPadding:" + CONFIG.layout.containerPadding + ";" +
    "--profileBorderWidth:" + theme.containerBorderWidth + ";" +
    "--profileBorderColor:" + theme.containerBorderColor + ";" +
    "--presenceUsernameColor:" + theme.textColor + ";" +
    "--presenceStatusColor:" + theme.textColor + "b3;" +
    "--badgeContainerBackground:rgba(255,255,255,0.08);" +
    "--badgeContainerBorder:2px solid rgba(255,255,255,0.04);" +
    "--userBadge:18px;" +
    "--textColorDarker:rgba(255,255,255,0.5);" +
    "--iconColor:" + theme.textColor + ";" +
    "--joinStatus:rgba(255,255,255,0.65);" +
    "--audioPlayerBar:rgba(255,255,255,0.35);" +
    "--avatarBorder:2px solid rgba(255,255,255,0.4);" +
    "--containerBackgroundClip:border-box;" +
    "--containerBackgroundOrigin:border-box;" +
    "--volumeBackgroundcolor:" + theme.volumeBg + ";" +
    "--volumeBorder:" + theme.volumeBorder + ";" +
    "--buttonBackground:" + theme.buttonBg + ";" +
    "--buttonBorder:" + theme.buttonBorder + ";" +
    "--buttonRadius:" + theme.buttonRadius + ";" +
    "--buttonAlign:center;" +
    "--buttonBackgroundHover:" + theme.buttonBgHover + ";" +
    "--buttonBorderHover:" + theme.buttonBorder + ";" +
    "--buttonUrlColor:rgba(255,255,255,0.65);" +
    "--profileViewsContainerBorder:2px solid rgba(255,255,255,0.3);" +
    "--platformTextColor:rgba(255,255,255,0.4);" +
    "--audioIconBackground:rgba(255,255,255,0.2);" +
    "--progessBarFull:rgba(255,255,255,0.3);" +
    "--progessBarPlaying:" + theme.textColor + ";" +
    "--controlButtonsOther:rgba(255,255,255,0.5);" +
    "--controlButtonPlaying:" + theme.textColor + ";" +
    "--controlTextColor:rgba(255,255,255,0.7);" +
    "--modernLayoutBottomLeftDivider:rgba(255,255,255,0.14);" +
    "--sleekLayoutTopRightDivider:rgba(255,255,255,0.14);" +
    "}";

  if (CONFIG.theme.selectionBg) {
    css.textContent +=
      "::selection{background:" +
      CONFIG.theme.selectionBg +
      ";color:" +
      CONFIG.theme.selectionColor +
      "}";
  }

  if (CONFIG.cursor.enabled) {
    css.textContent +=
      '*{cursor:url("' +
      CONFIG.cursor.src +
      '") ' +
      CONFIG.cursor.hotspotX +
      " " +
      CONFIG.cursor.hotspotY +
      ",auto!important}";
  }
  css.textContent +=
    '.card{pointer-events:auto!important}' +
    '.badge{padding:2px!important}' +
    '.badge-icon,.splash-text{border-radius:6px!important}';
  css.textContent += ':root{--userBadge:14px!important}';

  // Global header-row rule (may be overridden per-layout below)
  css.textContent += '.header-row{flex-wrap:nowrap!important;overflow-x:visible!important}';

  // Layout presets
  switch (CONFIG.layout.type) {
    case "stacked":
      css.textContent +=
        '.profile-row{flex-direction:column!important;text-align:center!important;gap:6px!important}' +
        '.avatar{margin-right:0!important}' +
        '.text-col{align-items:center!important}' +
        '.header-row{flex-wrap:wrap!important;justify-content:center!important;overflow-x:visible!important}' +
        '.header-row>.tip-trigger{flex:0 0 100%!important;text-align:center!important}';
      break;
    case "compact":
      css.textContent +=
        '.profile-row{gap:8px!important}' +
        '.card{--containerPadding:14px!important;--containerRadius:12px!important;--containerWidth:36rem!important}' +
        '.avatar{height:80px!important;font-size:3.5em!important}' +
        '.text-col h1{font-size:28px!important;line-height:32px!important}' +
        '.links-row{gap:6px!important}' +
        '.link-btn{width:42px!important;height:42px!important}';
      break;
    case "minimal":
      css.textContent +=
        '.card{--containerColor:transparent!important;--profileBorderWidth:0px!important;--containerPadding:0px!important;--containerRadius:0px!important;--containerWidth:38rem!important}' +
        '.divider{display:none!important}' +
        '.links-section{margin-top:10px!important}' +
        '.views-box{border:none!important;padding:4px 10px!important;background:rgba(255,255,255,0.06)!important;border-radius:20px!important}';
      break;
    case "glass":
      css.textContent +=
        '.card{--containerColor:rgba(255,255,255,0.06)!important;--containerBlur:12px!important;--profileBorderColor:rgba(255,255,255,0.08)!important;--profileBorderWidth:1px!important}' +
        '.card{-webkit-backdrop-filter:blur(12px)!important;backdrop-filter:blur(12px)!important}';
      break;
    // default: no extra CSS needed
  }
  document.head.appendChild(css);

  // Font injection
  if (CONFIG.fonts.enabled && CONFIG.fonts.families) {
    var fontCss = document.createElement("style");
    fontCss.textContent =
      "body, * { font-family: '" +
      CONFIG.fonts.families.join("', '") +
      "', sans-serif !important; }" +
      ".Typewriter__wrapper { font-family: '" +
      CONFIG.fonts.families[0] +
      "', sans-serif !important; }";
    if (CONFIG.fonts.importUrl) {
      fontCss.textContent =
        '@import url("' +
        CONFIG.fonts.importUrl +
        '");' +
        fontCss.textContent;
    }
    document.head.appendChild(fontCss);
  }

  function renderAvatar() {
    var a = CONFIG.avatar;
    if (a.type === "image") {
      return       '<img class="avatar-img" src="' + a.src + '" alt="" width="120" height="120">';
    }
    return (
      '<span class="avatar">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="4 4 16 16">' +
      '<path fill="currentColor" d="M12 12q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12Zm-6 8q-.825 0-1.413-.588T4 18v-.8q0-.85.438-1.563T5.6 14.55q1.55-.775 3.15-1.163T12 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2v.8q0 .825-.588 1.413T18 20H6Z"/>' +
      "</svg></span>"
    );
  }

  var BADGE_NAMES = {
    premium: "Premium", staff: "Staff Member", bug: "Bug Hunter", legend: "Legend",
    shield: "Shield", star: "Image Host", heart: "Heart", crown: "Crown",
    verified: "Verified", gift: "Gift", trophy: "Trophy", booster: "Booster",
  };

  function renderBadges() {
    if (!CONFIG.badges.length) return "";
    var badgeStyle = document.createElement("style");
    badgeStyle.id = "forgeBadgeStyles";
    var badgeHtml = CONFIG.badges.map(function (b) {
      if (typeof b === "string") {
        b = { icon: b, name: BADGE_NAMES[b] || b.charAt(0).toUpperCase() + b.slice(1), monochrome: true };
      }
      var iconSvg = BADGE_SVGS[b.icon] || BADGE_SVGS.premium;
      var c = b.monochrome ? "#ffffff" : b.color || BADGE_DEFAULT_COLORS[b.name] || "#a749dd";
      var shadow = b.monochrome ? "#ffffff" : c;
      var cls = "bg-" + b.name.replace(/[^a-zA-Z0-9]/g, "");
      badgeStyle.textContent += "." + cls + " svg{color:" + c + "!important;filter:drop-shadow(" + shadow + " 0 0 2.5px)!important}";
      return (
        '<div class="badge">' +
        '<span class="tip-trigger">' +
        '<div class="badge-icon">' +
        '<div class="' + cls + '" style="display:flex">' + iconSvg + "</div>" +
        "</div>" +
        '<span class="tip-content" style="--tooltip-max-width:260px;top:0px;left:0px;border-color:#1a1a1a33;background-color:#14141463" data-visible="false" data-placement="top">' +
        b.name +
        "</span>" +
        "</span>" +
        "</div>"
      );
    }).join("");
    document.head.appendChild(badgeStyle);
    return badgeHtml;
  }

  function renderLinks() {
    return CONFIG.links
      .map(function (l) {
        return (
          '<div class="link-btn link-btn-alt">' +
          '<a target="_blank" href="' +
          l.url +
          '">' +
          '<img class="link-icon" alt="" loading="lazy" src="' +
          l.icon +
          '" style="filter:drop-shadow(' +
          l.color +
          " 1px 0 7px);\">" +
          "</a></div>"
        );
      })
      .join("");
  }

  function renderAbout() {
    if (!CONFIG.about.enabled) return "";
    return (
      '<div class="divider"><div class="divider-inner"></div></div>' +
      '<div style="width:100%;max-width:var(--containerWidth);text-align:left;color:var(--textColor);font-size:15px;line-height:1.5;opacity:.85;padding:0 5px">' +
      CONFIG.about.text +
      "</div>"
    );
  }

  function renderLocation() {
    if (!CONFIG.location.enabled) return "";
    return (
      '<div style="display:flex;align-items:center;gap:8px;color:var(--textColor);font-size:13px;opacity:.7;margin-top:5px">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>' +
      "<span>" +
      CONFIG.location.text +
      "</span>" +
      (CONFIG.location.timezone
        ? '<span style="margin-left:auto">' + getTimezoneTime(CONFIG.location.timezone) + "</span>"
        : "") +
      "</div>"
    );
  }

  function getTimezoneTime(tz) {
    try {
      return new Date().toLocaleTimeString("en-US", {
        timeZone: tz,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    } catch (e) {
      return "--:--:--";
    }
  }

  function renderPortfolio() {
    if (!CONFIG.portfolio.enabled) return "";
    var html =
      '<div class="divider false"><div class="divider-inner"></div></div>';
    if (CONFIG.portfolio.skills && CONFIG.portfolio.skills.length) {
      html +=
        '<div style="width:100%;max-width:var(--containerWidth);margin-bottom:10px">' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">';
      CONFIG.portfolio.skills.forEach(function (skill) {
        html +=
          '<span style="padding:5px 14px;border-radius:15px;background:var(--buttonBackground);border:var(--buttonBorder);color:var(--textColor);font-size:13px;font-weight:500">' +
          skill +
          "</span>";
      });
      html += "</div></div>";
    }
    if (CONFIG.portfolio.projects && CONFIG.portfolio.projects.length) {
      CONFIG.portfolio.projects.forEach(function (p) {
        html +=
          '<div style="width:100%;max-width:var(--containerWidth);padding:var(--containerPadding);border-radius:var(--containerRadius);background:var(--containerColor);-webkit-backdrop-filter:blur(var(--containerBlur));border:var(--profileBorderWidth) solid var(--profileBorderColor);box-sizing:border-box;margin-bottom:10px">' +
          '<div style="color:var(--textColor);font-weight:600;font-size:16px;margin-bottom:4px">' +
          p.name +
          "</div>" +
          '<div style="color:var(--textColor);font-size:14px;opacity:.75;margin-bottom:8px">' +
          p.description +
          "</div>" +
          (p.url
            ? '<a href="' +
              p.url +
              '" target="_blank" style="display:inline-block;padding:7px 18px;border-radius:20px;background:var(--buttonBackground);border:var(--buttonBorder);color:var(--textColor);text-decoration:none;font-size:13px;font-weight:500">Visit</a>'
            : "") +
          "</div>";
      });
    }
    return html;
  }

  function formatTime(t) {
    var m = Math.floor(t / 60);
    var s = Math.floor(t % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  // Background effects
  function mountCanvasContainer(containerClass, initializer) {
    var container = document.createElement("div");
    container.className = containerClass;
    var canvas = document.createElement("canvas");
    canvas.style.cssText = "width:100%;height:100%;display:block";
    container.appendChild(canvas);
    document.body.insertBefore(container, document.body.firstChild);
    initializer(canvas);
  }

  function initBackgroundEffects() {
    var effects = CONFIG.background.effects;
    if (!effects) return;
    if (effects.aurora) mountCanvasContainer("aurora-container", initAurora);
    if (effects.dither) mountCanvasContainer("dither-container", initDither);
    if (effects.plasma) mountCanvasContainer("plasma-container", initPlasma);
    if (effects.snow) mountCanvasContainer("dither-container", initSnow);
    if (effects.rain) mountCanvasContainer("dither-container", initRain);
    if (effects.stars) mountCanvasContainer("dither-container", initStars);
    if (effects.fireflies) mountCanvasContainer("dither-container", initFireflies);
  }

  function initAurora(canvas) {
    var ctx = canvas.getContext("2d");
    var _s = pixelScale;
    var w = (canvas.width = Math.round(canvas.offsetWidth * _s));
    var h = (canvas.height = Math.round(canvas.offsetHeight * _s));
    var time = 0;

    function resize() {
      w = canvas.width = Math.round(canvas.offsetWidth * _s);
      h = canvas.height = Math.round(canvas.offsetHeight * _s);
    }
    onResize(resize);

    function draw() {
      if(isPageHidden)return;
      time += 0.003;
      var imageData = ctx.createImageData(w, h);
      var data = imageData.data;
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var i = (y * w + x) * 4;
          var nx = x / w - 0.5;
          var ny = y / h - 0.5;
          var d = Math.sqrt(nx * nx + ny * ny);
          var v1 = Math.sin(nx * 8 + time) * Math.cos(ny * 6 + time * 0.7) * 0.5 + 0.5;
          var v2 = Math.sin(nx * 5 + ny * 7 + time * 1.3) * 0.5 + 0.5;
          var v3 = Math.sin(nx * 3 - ny * 9 + time * 0.5 + Math.sin(d * 4 + time) * 0.3) * 0.5 + 0.5;
          data[i] = Math.floor(80 + v1 * 120 + v2 * 30);
          data[i + 1] = Math.floor(20 + v2 * 60 + v3 * 80);
          data[i + 2] = Math.floor(120 + v3 * 100 + v1 * 40);
          data[i + 3] = Math.floor(180 + v2 * 75);
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }
    _registerAnimation(draw, 1);
  }

  function initDither(canvas) {
    var ctx = canvas.getContext("2d");
    var _s = canvasScale;
    var w = (canvas.width = Math.round(canvas.offsetWidth * _s));
    var h = (canvas.height = Math.round(canvas.offsetHeight * _s));

    function resize() {
      w = canvas.width = Math.round(canvas.offsetWidth * _s);
      h = canvas.height = Math.round(canvas.offsetHeight * _s);
    }
    onResize(resize);

    function draw() {
      if(isPageHidden){setTimeout(draw,200);return}
      var imageData = ctx.createImageData(w, h);
      var data = imageData.data;
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var i = (y * w + x) * 4;
          var v = Math.random() * 255;
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          data[i + 3] = Math.floor(15 + Math.random() * 25);
        }
      }
      ctx.putImageData(imageData, 0, 0);
      setTimeout(draw, isPageHidden ? 500 : 50);
    }
    draw();
  }

  function initPlasma(canvas) {
    var ctx = canvas.getContext("2d");
    var _s = pixelScale;
    var w = (canvas.width = Math.round(canvas.offsetWidth * _s));
    var h = (canvas.height = Math.round(canvas.offsetHeight * _s));
    var time = 0;

    function resize() {
      w = canvas.width = Math.round(canvas.offsetWidth * _s);
      h = canvas.height = Math.round(canvas.offsetHeight * _s);
    }
    onResize(resize);

    function draw() {
      if(isPageHidden)return;
      time += 0.05;
      var imageData = ctx.createImageData(w, h);
      var data = imageData.data;
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var i = (y * w + x) * 4;
          var v = Math.sin(x * 0.02 + time) + Math.sin(y * 0.03 + time * 0.7) + Math.sin((x + y) * 0.015 + time * 0.5) + Math.sin(Math.sqrt(x * x + y * y) * 0.02 + time);
          v = (v + 4) / 8;
          data[i] = Math.floor(100 + Math.sin(v * 6.28) * 100);
          data[i + 1] = Math.floor(50 + Math.sin(v * 6.28 + 2.09) * 80);
          data[i + 2] = Math.floor(150 + Math.sin(v * 6.28 + 4.19) * 100);
          data[i + 3] = 180;
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }
    _registerAnimation(draw, 1);
  }

  function initSnow(canvas) {
    var ctx = canvas.getContext("2d");
    var w = (canvas.width = canvas.offsetWidth);
    var h = (canvas.height = canvas.offsetHeight);
    var flakeCount = Math.max(Math.round(120 * performanceScale), 30);
    var flakes = [];
    for (var i = 0; i < flakeCount; i++) {
      flakes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 1,
        wind: Math.random() * 0.5 - 0.25,
      });
    }

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    onResize(resize);

    function draw() {
      if(isPageHidden)return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < flakes.length; i++) {
        var f = flakes[i];
        f.y += f.speed;
        f.x += f.wind;
        if (f.y > h) {
          f.y = -f.r;
          f.x = Math.random() * w;
        }
        if (f.x > w) f.x = 0;
        if (f.x < 0) f.x = w;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255," + (0.5 + Math.random() * 0.5) + ")";
        ctx.fill();
      }
    }
    _registerAnimation(draw, 1);
  }

  function initRain(canvas) {
    var ctx = canvas.getContext("2d");
    var w = (canvas.width = canvas.offsetWidth);
    var h = (canvas.height = canvas.offsetHeight);
    var drops = [];
    function resetDrops() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      if (w === 0 || h === 0) { w = window.innerWidth; h = window.innerHeight; canvas.width = w; canvas.height = h; }
      var dropCount = Math.max(Math.round(500 * performanceScale), 80);
      drops = [];
      for (var i = 0; i < dropCount; i++) {
        drops.push({
          x: Math.random() * w,
          y: Math.random() * h,
          len: Math.random() * 25 + 10,
          speed: Math.random() * 8 + 4,
          opacity: Math.random() * 0.3 + 0.2,
        });
      }
    }
    resetDrops();

    function resize() {
      resetDrops();
    }
    onResize(resize);

    function draw() {
      if(isPageHidden)return;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(220,230,255,1)";
      ctx.lineWidth = 1.5;
      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        ctx.globalAlpha = d.opacity;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + 0.5, d.y + d.len);
        ctx.stroke();
        d.y += d.speed;
        if (d.y > h) {
          d.y = -d.len;
          d.x = Math.random() * w;
        }
      }
    }
    _registerAnimation(draw, 1);
  }

  function initStars(canvas) {
    var ctx = canvas.getContext("2d");
    var w = (canvas.width = canvas.offsetWidth);
    var h = (canvas.height = canvas.offsetHeight);
    var starCount = Math.max(Math.round(200 * performanceScale), 50);
    var stars = [];
    for (var i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.3,
        alpha: Math.random(),
        speed: 0.005 + Math.random() * 0.015,
        twinkle: Math.random() * Math.PI * 2,
      });
    }

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    onResize(resize);

    var glowOffscreen = document.createElement("canvas");
    glowOffscreen.width = 64;
    glowOffscreen.height = 64;
    var gCtx = glowOffscreen.getContext("2d");
    var glowGrad = gCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    glowGrad.addColorStop(0, "rgba(200,220,255,0.3)");
    glowGrad.addColorStop(1, "rgba(200,220,255,0)");
    gCtx.fillStyle = glowGrad;
    gCtx.fillRect(0, 0, 64, 64);

    function draw() {
      if(isPageHidden)return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.twinkle += s.speed;
        var a = 0.3 + Math.sin(s.twinkle) * 0.5;
        ctx.globalAlpha = a;
        ctx.drawImage(glowOffscreen, s.x - glowOffscreen.width / 2, s.y - glowOffscreen.height / 2);
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255," + a + ")";
        ctx.fill();
      }
    }
    _registerAnimation(draw, 1);
  }

  function initFireflies(canvas) {
    var ctx = canvas.getContext("2d");
    var w = (canvas.width = canvas.offsetWidth);
    var h = (canvas.height = canvas.offsetHeight);
    var flyCount = Math.max(Math.round(40 * performanceScale), 8);
    var flies = [];
    for (var i = 0; i < flyCount; i++) {
      flies.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        r: Math.random() * 3 + 2,
        alpha: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        hue: 60 + Math.random() * 60,
        life: Math.random() * 200 + 100,
        maxLife: Math.random() * 200 + 100,
      });
    }

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    onResize(resize);

    function draw() {
      if(isPageHidden)return;
      ctx.clearRect(0, 0, w, h);
      for (var i = flies.length - 1; i >= 0; i--) {
        var f = flies[i];
        f.life--;
        if (f.life <= 0) {
          flies.splice(i, 1);
          flies.push({
            x: Math.random() * w, y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8,
            r: Math.random() * 3 + 2, alpha: 0.3 + Math.random() * 0.7,
            phase: Math.random() * Math.PI * 2, hue: 60 + Math.random() * 60,
            life: Math.random() * 200 + 100, maxLife: Math.random() * 200 + 100,
          });
          continue;
        }
        f.phase += 0.02;
        f.x += f.vx + Math.sin(f.phase) * 0.2;
        f.y += f.vy + Math.cos(f.phase * 0.7) * 0.2;
        if (f.x < 0) f.x = w; if (f.x > w) f.x = 0;
        if (f.y < 0) f.y = h; if (f.y > h) f.y = 0;
        var a = f.alpha * (f.life / f.maxLife) * (0.6 + Math.sin(f.phase) * 0.4);
        var grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 6);
        grad.addColorStop(0, "hsla(" + f.hue + ",100%,80%," + a + ")");
        grad.addColorStop(1, "hsla(" + f.hue + ",100%,60%,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(f.x - f.r * 6, f.y - f.r * 6, f.r * 12, f.r * 12);
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,220," + a * 0.9 + ")";
        ctx.fill();
      }
    }
    _registerAnimation(draw, 1);
  }

  // Views counter (localStorage)
  (function () {
    var storageKey = "forge_views_" + (CONFIG.username || "profile");
    var stored = parseInt(localStorage.getItem(storageKey), 10);
    if (isNaN(stored)) stored = CONFIG.views || 0;
    stored++;
    localStorage.setItem(storageKey, String(stored));
    CONFIG.views = stored;
  })();

  // Build HTML
  var bgStyle = CONFIG.background.src
    ? 'background-image:url("' + CONFIG.background.src + '")'
    : "";
  var html =
    '<div class="bg-image" style="' +
    bgStyle +
    '"></div>' +
    '<div class="bg-color" style="background-color:' +
    CONFIG.background.color +
    '"></div>';

  // Audio element
  if (CONFIG.audio.src) {
    html +=
      '<audio id="bgAudio" src="' +
      CONFIG.audio.src +
      '"' +
      (CONFIG.audio.loop ? " loop" : "") +
      ' preload="none"></audio>';
  }

  // Volume control
  if (CONFIG.audio.src && CONFIG.volumeControl.enabled) {
    var vpos = CONFIG.volumeControl.position || "top-left";
    html +=
      '<div id="volumeBtn" class="volume-btn" style="' +
      (vpos.indexOf("top") >= 0 ? "top:15px;" : "bottom:15px;") +
      (vpos.indexOf("left") >= 0 ? "left:15px;" : "right:15px;") +
      '">' +
      '<span id="volIcon">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>' +
      "</span>" +
      '<span id="volSlider" style="display:none;align-items:center;gap:8px;white-space:nowrap">' +
      '<input type="range" id="volumeRange" min="0" max="1" step="0.05" value="' +
      CONFIG.audio.volume +
      '" style="width:80px;accent-color:' +
      theme.textColor +
      '">' +
      '<span id="volPct" style="color:var(--textColor);font-size:13px;min-width:30px">' +
      Math.round(CONFIG.audio.volume * 100) +
      "%</span>" +
      "</span></div>";
  }

  // Overlay
  html +=
    '<div id="overlay" class="splash" style="pointer-events:auto;">' +
    '<div class="splash-text" style="font-weight:' + (CONFIG.splash.fontWeight || "500") + ";font-size:" + (CONFIG.splash.fontSize || "34px") + (CONFIG.splash.fontFamily ? ";font-family:" + CONFIG.splash.fontFamily : "") + (CONFIG.splash.color ? ";color:" + CONFIG.splash.color : "") + '">' +
    CONFIG.splash.text +
    "</div></div>";

  // Main content
  html += '<div id="mainContent">' +
    '<div class="page-wrap">' +
    '<div class="content-wrap">' +
    '<div style="position:relative;width:100%;align-items:center;max-width:var(--containerWidth);display:flex;justify-content:center;flex-direction:column;gap:15px;z-index:1;">' +
    // Profile card
    '<div class="card card-init" style="position:relative;">' +
    '<div class="text-col-2 text-col-4"></div>' +
    '<div class="profile-row false">' +
    renderAvatar() +
    '<div class="text-col">' +
    '<div class="header-row">' +
    '<span class="tip-trigger ">' +
    '<h1 style="font-weight:400;font-size:36.5px;line-height:41px;margin:0" class="false">' +
    CONFIG.username +
    "</h1>" +
    '<span class="tip-content" style="--tooltip-max-width:260px;top:0px;left:0px;border-color:#1a1a1a33;background-color:#14141463;" data-visible="false" data-placement="top">UID ' +
    CONFIG.uid +
    "</span>" +
    "</span>" +
    renderBadges() +
    "</div>" +
    // Bio
    '<h3 style="font-weight:570;font-size:17px;margin:0">' +
    '<div class="Typewriter" data-testid="typewriter-wrapper">' +
    '<span class="Typewriter__wrapper" id="bioText"></span>' +
    '<span class="Typewriter__cursor">|</span>' +
    "</div></h3>" +
    '<h2 style="font-weight:400;font-size:13px;margin:0;color:var(--joinStatus)">' +
    CONFIG.joinedDate +
    "</h2>" +
    renderLocation() +
    "</div></div>" +
    // Separator + links
    '<div class="divider"><div class="divider-inner"></div></div>' +
    '<div class="links-section" style="margin-bottom:10px">' +
    '<div class="links-row" style="justify-content:center">' +
    renderLinks() +
    "</div></div>" +
    renderAbout() +
    renderPortfolio() +
    // Views
    '<div class="views-box views-wrap">' +
    '<div class="views-inner">' +
    '<span class="tip-trigger">' +
    '<span style="font-weight:550;font-size:14px;display:flex;align-items:center;gap:4px">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"/></svg> ' +
    CONFIG.views +
    "</span>" +
    '<span class="tip-content" style="--tooltip-max-width:260px;border-color:#1a1a1a33;background-color:#14141463;" data-visible="false" data-placement="top">Profile Views</span>' +
    "</span></div></div>" +
    // Audio player (inline, inside profile card)
    renderAudioPlayer() +
    "</div>" + // close card
    "</div></div></div></div>";

  function renderAudioPlayer() {
    if (!CONFIG.audio.src || !CONFIG.audio.showControls) return "";
    var pb = CONFIG.progressBar || {};
    var pbH = pb.height || 3;
    var pbR = pb.radius || 15;
    var pbT = pb.thumbSize || 10;
    var fillBg = pb.gradient && pb.gradient.length
      ? "linear-gradient(90deg," + pb.gradient.join(",") + ")"
      : (pb.color || "var(--progessBarPlaying)");
    var thumbBg = pb.gradient && pb.gradient.length
      ? "linear-gradient(135deg," + pb.gradient.join(",") + ")"
      : (pb.color || "var(--progessBarPlaying)");
    var bgColor = pb.bgColor || "var(--progessBarFull)";
    return (
      '<div class="audio-player" id="audioPlayer" style="width:100%;max-width:var(--containerWidth);margin-top:12px;display:none">' +
      '<div class="audio-row" style="display:flex;align-items:center;gap:20px;width:100%;box-sizing:border-box;padding:7px 20px">' +
      '<div class="audio-icon" id="audioIcon">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>' +
      "</div>" +
      '<div style="flex:1;display:flex;flex-direction:column;gap:6px">' +
      '<div class="song-title" id="songTitle" style="font-size:16px;color:var(--controlTextColor);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' +
      (CONFIG.audio.title || "Unknown") +
      "</div>" +
      '<div class="playback-row" style="display:flex;gap:2px;align-items:center">' +
      '<button id="prevBtn" class="ctrl-btn" style="font-size:26px;color:var(--controlButtonsOther);background:none;border:none;cursor:pointer;padding:0;display:flex">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>' +
      "</button>" +
      '<button id="playBtn" class="play-btn" style="display:flex;background:none;border:none;cursor:pointer;padding:0">' +
      '<svg id="playIcon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" style="font-size:34px;color:var(--controlButtonPlaying)">' +
      '<path fill="currentColor" d="M8 5v14l11-7z"/>' +
      "</svg>" +
      "</button>" +
      '<button id="nextBtn" class="ctrl-btn" style="font-size:26px;color:var(--controlButtonsOther);background:none;border:none;cursor:pointer;padding:0;display:flex">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>' +
      "</button>" +
      "</div>" +
      '<div class="progress-wrap" style="display:flex;width:100%;height:' + (pbT + 8) + 'px;align-items:center;position:relative;cursor:default;pointer-events:all">' +
      '<div class="progress-bar" id="progressBar" style="display:flex;width:100%;height:' + pbH + 'px;align-items:center;position:relative;cursor:pointer">' +
      '<div class="progress-track" style="width:100%;height:' + pbH + 'px;border-radius:' + pbR + 'px;position:absolute;background:' + bgColor + ';pointer-events:none;transition:height .15s ease"></div>' +
      '<div class="progress-fill" id="progressFill" style="width:0%;height:' + pbH + 'px;z-index:999;border-radius:' + pbR + 'px;position:absolute;background:' + fillBg + ';pointer-events:none;transition:height .15s ease"></div>' +
      '<div class="progress-thumb" id="progressThumb" style="width:' + pbT + 'px;height:' + pbT + 'px;z-index:1000;border-radius:50%;position:absolute;background:' + thumbBg + ';opacity:0;pointer-events:none;transform:translateX(-50%) scale(.8);transition:opacity .12s ease,transform .12s ease"></div>' +
      "</div>" +
      "</div>" +
      '<div class="time-row" style="display:flex;width:100%;box-sizing:border-box;justify-content:space-between;gap:9px">' +
      '<span id="currentTime" style="color:var(--controlTextColor);font-size:13px">0:00</span>' +
      '<span id="totalTime" style="color:var(--controlTextColor);font-size:13px">0:00</span>' +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  document.body.innerHTML = html;

  // Init bg effects
  initBackgroundEffects();

  // Typewriter
  var bioEl = document.getElementById("bioText");
  if (bioEl) {
    if (CONFIG.bio.typewriter) {
      var texts = CONFIG.bio.texts;
      var idx = 0,
        charIdx = 0,
        deleting = false;
      function typeStep() {
        if(isPageHidden){setTimeout(typeStep,200);return}
        var word = texts[idx];
        if (!deleting) {
          bioEl.textContent = word.slice(0, charIdx + 1);
          charIdx++;
          if (charIdx === word.length) {
            deleting = true;
            setTimeout(typeStep, CONFIG.bio.pauseDuration);
            return;
          }
          setTimeout(typeStep, CONFIG.bio.typeSpeed);
        } else {
          bioEl.textContent = word.slice(0, charIdx - 1);
          charIdx--;
          if (charIdx === 0) {
            deleting = false;
            idx = (idx + 1) % texts.length;
            setTimeout(typeStep, CONFIG.bio.deleteSpeed);
            return;
          }
          setTimeout(typeStep, CONFIG.bio.deleteSpeed);
        }
      }
      typeStep();
    } else {
      bioEl.textContent = CONFIG.bio.staticBio;
    }
  }

  // Overlay click
  var overlay = document.getElementById("overlay");
  var card = document.querySelector(".card");
  var audio = document.getElementById("bgAudio");

  if (overlay) {
    overlay.addEventListener("click", function () {
      overlay.classList.add("overlay-hide");
      overlay.style.pointerEvents = "none";
      if (card) card.classList.add("card-show");
      setTimeout(function () {
        overlay.style.display = "none";
        if (audio && CONFIG.audio.showControls && CONFIG.audio.autoplay) {
          audio.volume = CONFIG.audio.volume;
          audio.play().catch(function () {});
        }
      }, 750);
    });
  }

  // Audio player logic
  var playlist = CONFIG.audio.playlist || [];
  var currentTrack = -1;
  var songTitleEl = null;

  function loadTrack(index) {
    if (!audio) return;
    if (index >= 0 && index < playlist.length) {
      var track = playlistheme[index];
      audio.src = track.src;
      audio.load();
      if (songTitleEl) songTitleEl.textContent = track.title || "Unknown";
      audio.play().catch(function () {});
    }
  }

  if (audio && CONFIG.audio.showControls) {
    var player = document.getElementById("audioPlayer");
    var playBtn = document.getElementById("playBtn");
    var playIcon = document.getElementById("playIcon");
    var prevBtn = document.getElementById("prevBtn");
    var nextBtn = document.getElementById("nextBtn");
    var progressFill = document.getElementById("progressFill");
    var progressBar = document.getElementById("progressBar");
    var progressThumb = document.getElementById("progressThumb");
    var currentTime = document.getElementById("currentTime");
    var totalTime = document.getElementById("totalTime");
    songTitleEl = document.getElementById("songTitle");

    audio.addEventListener("loadedmetadata", function () {
      if (player) player.style.display = "block";
      if (totalTime) totalTime.textContent = formatTime(audio.duration);
    });

    function togglePlay() {
      if (audio.paused) {
        audio.play().catch(function () {});
      } else {
        audio.pause();
      }
    }

    if (playBtn) playBtn.addEventListener("click", togglePlay);

    audio.addEventListener("play", function () {
      if (playIcon)
        playIcon.innerHTML =
          '<path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
      if (shareCtx && shareCtx.state === "suspended") shareCtx.resume();
    });
    audio.addEventListener("pause", function () {
      if (playIcon)
        playIcon.innerHTML =
          '<path fill="currentColor" d="M8 5v14l11-7z"/>';
      if (shareCtx && shareCtx.state === "running") shareCtx.suspend();
    });

    audio.addEventListener("timeupdate", function () {
      if (!audio.duration) return;
      var pct = (audio.currentTime / audio.duration) * 100;
      if (progressFill) progressFill.style.width = pct + "%";
      if (progressThumb) {
        progressThumb.style.left = pct + "%";
        progressThumb.style.opacity = "1";
        progressThumb.style.transform = "translateX(-50%) scale(1)";
      }
      if (currentTime) currentTime.textContent = formatTime(audio.currentTime);
    });

    if (progressBar) {
      progressBar.addEventListener("click", function (e) {
        var rect = this.getBoundingClientRect();
        var pct = (e.clientX - rect.left) / rect.width;
        audio.currentTime = pct * audio.duration;
      });
    }

    // Playlist-aware prev/next
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (playlist.length > 0) {
          currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
          loadTrack(currentTrack);
        } else {
          audio.currentTime = 0;
        }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (playlist.length > 0) {
          currentTrack = (currentTrack + 1) % playlist.length;
          loadTrack(currentTrack);
        } else {
          audio.currentTime = Math.max(0, audio.duration - 5);
        }
      });
    }
  }

  // Shared audio analyzer (equalizer + avatar wave)
  var sharedAnalyzer = null;
  var shareCtx = null;

  function getSharedAnalyzer(callback) {
    if (sharedAnalyzer) { callback(sharedAnalyzer); return; }
    if (!audio) return;
    try {
      shareCtx = new (window.AudioContext || window.webkitAudioContext)();
      sharedAnalyzer = shareCtx.createAnalyser();
      sharedAnalyzer.fftSize = 256;
      var src = shareCtx.createMediaElementSource(audio);
      src.connect(sharedAnalyzer);
      sharedAnalyzer.connect(shareCtx.destination);
      callback(sharedAnalyzer);
    } catch (e) {
      callback(null);
    }
  }

  // Visual equalizer
  if (audio && CONFIG.equalizer && CONFIG.equalizer.enabled) {
    (function () {
      var eq = CONFIG.equalizer;
      var eqCanvas = document.createElement("canvas");
      eqCanvas.id = "equalizerCanvas";
      eqCanvas.style.cssText = "position:fixed;bottom:0;left:0;width:100%;height:" + (eq.height || 80) + "px;z-index:99997;pointer-events:none;opacity:0.7";
      document.body.appendChild(eqCanvas);

      var eqCtx = eqCanvas.getContext("2d");
      var eqW = (eqCanvas.width = window.innerWidth);
      var eqH = (eqCanvas.height = eq.height || 80);
      var bars = isLowEndDevice ? 12 : (eq.bars || 32);
      var eqAnalyser = null;

      function resizeEq() {
        eqW = eqCanvas.width = window.innerWidth;
      }
      onResize(resizeEq);

      function drawEq() {
        if (isPageHidden) return;
        if (!eqAnalyser) return;
        var data = new Uint8Array(eqAnalyser.frequencyBinCount);
        eqAnalyser.getByteFrequencyData(data);
        eqCtx.clearRect(0, 0, eqW, eqH);

        var step = Math.floor(data.length / bars);
        var barW = (eqW / bars) * 0.7;
        var gap = (eqW / bars) * 0.3;
        var eqColor = eq.color || "#ffffff";
        var glowColor = eq.glowColor || "rgba(255,255,255,0.3)";

        for (var i = 0; i < bars; i++) {
          var val = 0;
          for (var j = 0; j < step; j++) val += data[i * step + j] || 0;
          val = val / step / 255;
          var h = val * eqH * 0.9;
          var x = i * (barW + gap) + gap / 2;
          var grad = eqCtx.createLinearGradient(x, eqH, x, eqH - h);
          grad.addColorStop(0, glowColor);
          grad.addColorStop(1, eqColor);
          eqCtx.fillStyle = grad;
          eqCtx.fillRect(x, eqH - h, barW, h);
        }
      }

      function startEq() {
        if (!eqAnalyser) {
          getSharedAnalyzer(function (a) {
            eqAnalyser = a;
            if (a) _registerAnimation(drawEq, 1);
          });
        } else {
          _registerAnimation(drawEq, 1);
        }
      }

      audio.addEventListener("play", startEq);
      audio.addEventListener("pause", function () {
        _unregisterAnimation(drawEq);
        eqCtx.clearRect(0, 0, eqW, eqH);
      });
      if (!audio.paused) startEq();
    })();
  }

  // Avatar wave effect
  if (CONFIG.avatarWave && CONFIG.avatarWave.enabled && audio) {
    (function () {
      var aw = CONFIG.avatarWave;
      var avatarEl = document.querySelector('.avatar') || document.querySelector('.avatar-img');
      if (!avatarEl) return;

      var waveCanvas = document.createElement("canvas");
      waveCanvas.id = "avatarWaveCanvas";
      waveCanvas.style.cssText = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:0;pointer-events:none";
      var parent = avatarEl.parentNode;
      if (parent) {
        parent.style.position = "relative";
        parent.insertBefore(waveCanvas, parent.firstChild);
      }

      var wCtx = waveCanvas.getContext("2d");
      var wW = (waveCanvas.width = avatarEl.offsetWidth + 40);
      var wH = (waveCanvas.height = avatarEl.offsetHeight + 40);
      var cx = wW / 2, cy = wH / 2;
      var maxR = Math.min(cx, cy) - 4;
      var lines = aw.lines || 3;
      var amplitude = aw.amplitude || 10;
      var speed = aw.speed || 0.02;
      var waveColor = aw.color || "#ffffff";
      var waveTime = 0;
      var waveAnalyser = null;

      function resizeWave() {
        if (!avatarEl) return;
        wW = waveCanvas.width = avatarEl.offsetWidth + 40;
        wH = waveCanvas.height = avatarEl.offsetHeight + 40;
        cx = wW / 2; cy = wH / 2;
        maxR = Math.min(cx, cy) - 4;
      }
      onResize(resizeWave);

      function drawWave() {
        if(isPageHidden)return;
        waveTime += speed;
        wCtx.clearRect(0, 0, wW, wH);
        var avg = 0.3 + Math.sin(waveTime * 0.5) * 0.2;
        if (waveAnalyser) {
          var wData = new Uint8Array(waveAnalyser.frequencyBinCount);
          waveAnalyser.getByteFrequencyData(wData);
          var sum = 0;
          for (var i = 0; i < wData.length; i++) sum += wData[i];
          avg = sum / wData.length / 255;
        }
        for (var l = 0; l < lines; l++) {
          var off = (l / lines) * Math.PI * 2;
          var r = maxR - l * 3 + Math.sin(waveTime + off) * amplitude * avg;
          if (r < 2) r = 2;
          wCtx.beginPath();
          wCtx.arc(cx, cy, r, 0, Math.PI * 2);
          wCtx.strokeStyle = waveColor;
          wCtx.globalAlpha = 0.4 - (l / lines) * 0.3;
          wCtx.lineWidth = 1.5 - (l / lines) * 0.5;
          wCtx.stroke();
        }
        wCtx.globalAlpha = 1;
      }

      audio.addEventListener("play", function () {
        if (!waveAnalyser) {
          getSharedAnalyzer(function (a) { waveAnalyser = a; });
        }
        _registerAnimation(drawWave, 1);
        resizeWave();
      });

      getSharedAnalyzer(function (a) { waveAnalyser = a; });
      _registerAnimation(drawWave, 1);
    })();
  }

  // Volume control (guarded: elements may not exist if disabled)
  if (CONFIG.volumeControl && CONFIG.volumeControl.enabled) {
    var volumeRange = document.getElementById("volumeRange");
    var volPct = document.getElementById("volPct");
    var volSlider = document.getElementById("volSlider");
    var volumeBtn = document.getElementById("volumeBtn");

    if (volumeBtn && volSlider) {
      volumeBtn.addEventListener("mouseenter", function () {
        volSlider.style.display = "flex";
      });
      volumeBtn.addEventListener("mouseleave", function () {
        volSlider.style.display = "none";
      });
    }

    if (volumeRange && audio) {
      audio.volume = parseFloat(volumeRange.value);
      volumeRange.addEventListener("input", function () {
        audio.volume = parseFloat(this.value);
        if (volPct) volPct.textContent = Math.round(this.value * 100) + "%";
      });
    }
  }

  // Global tooltip
  var tipEl = document.createElement("div");
  tipEl.id = "forge-tip";
  tipEl.style.cssText = "position:fixed;z-index:99999999;padding:5px 12px;border-radius:15px;font-size:14px;line-height:1.3;color:#fafafa;background:rgba(20,20,20,0.55);border:2px solid rgba(26,26,26,0.2);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);pointer-events:none;opacity:0;transition:opacity .12s ease;white-space:nowrap";
  document.body.appendChild(tipEl);

  var _tipRAF;
  document.addEventListener("mouseover", function (e) {
    var trigger = e.target.closest('.tip-trigger');
    if (!trigger) { if (e.target !== tipEl) tipEl.style.opacity = "0"; return; }
    if (_tipRAF) cancelAnimationFrame(_tipRAF);
    _tipRAF = requestAnimationFrame(function () {
      _tipRAF = null;
      var src = trigger.querySelector('.tip-content');
      if (!src) return;
      tipEl.textContent = src.textContent;
      var tw = tipEl.offsetWidth;
      var th = tipEl.offsetHeight;
      var l = Math.round(e.clientX - tw / 2);
      var t = Math.round(e.clientY - th - 12);
      if (l < 4) l = 4;
      if (l + tw > window.innerWidth - 4) l = window.innerWidth - tw - 4;
      if (t < 4) t = 4;
      tipEl.style.left = l + "px";
      tipEl.style.top = t + "px";
      tipEl.style.opacity = "1";
    });
  });

  document.addEventListener("mouseleave", function () {
    tipEl.style.opacity = "0";
  });

  // Location timezone update
  if (CONFIG.location.enabled && CONFIG.location.timezone) {
    setInterval(function () {
      if(isPageHidden)return;
      var el = document.querySelector(
        '.card ~ * [style*="margin-left:auto"]'
      );
      if (el) {
        try {
          el.textContent = new Date().toLocaleTimeString("en-US", {
            timeZone: CONFIG.location.timezone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });
        } catch (e) {}
      }
    }, 1000);
  }

  // Shuffle text
  if (CONFIG.shuffleText.enabled) {
    var h1 = document.querySelector("h1");
    if (h1) {
      var orig = CONFIG.shuffleText.text;
      h1.style.fontFamily =
        CONFIG.shuffleText.fontFamily || "'Press Start 2P',monospace";
      h1.style.fontSize = CONFIG.shuffleText.fontSize || "4rem";
      h1.style.textTransform = "uppercase";
      h1.style.visibility = "hidden";
      h1.className = "shuffle-parent";
      h1.textContent = "";
      orig.split("").forEach(function (ch) {
        var wrapper = document.createElement("span");
        wrapper.className = "shuffle-char-wrapper";
        var inner = document.createElement("span");
        inner.className = "shuffle-char";
        inner.textContent = ch;
        wrapper.appendChild(inner);
        h1.appendChild(wrapper);
      });
      h1.style.visibility = "visible";
      var chars = h1.querySelectorAll(".shuffle-char");
      var iterations = 0;
      var interval = setInterval(function () {
        if(isPageHidden)return;
        chars.forEach(function (c) {
          if (Math.random() > 0.5) {
            var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            c.textContent = letters[Math.floor(Math.random() * letters.length)];
          }
        });
        iterations++;
        if (iterations > 15) {
          clearInterval(interval);
          chars.forEach(function (c, i) {
            c.textContent = orig[i];
          });
        }
      }, 80);
    }
  }

  // 3D Card Tilt
  if (CONFIG.card3d && CONFIG.card3d.enabled) {
    var tiltCard = document.querySelector(".card");
    if (tiltCard) {
      var intensity = CONFIG.card3d.intensity || 8;
      var perspective = CONFIG.card3d.perspective || 1000;
      var rect = tiltCard.getBoundingClientRect();
      var ticking = false;
      var curX = 0, curY = 0;
      tiltCard.style.willChange = "transform";

      function updateTilt() {
        var rotY = (curX / (rect.width / 2)) * intensity;
        var rotX = -(curY / (rect.height / 2)) * intensity;
        tiltCard.style.transform =
          "perspective(" + perspective + "px) rotateX(" + rotX + "deg) rotateY(" + rotY + "deg)";
        ticking = false;
      }

      document.addEventListener("mousemove", function (e) {
        curX = e.clientX - rect.left - rect.width / 2;
        curY = e.clientY - rect.top - rect.height / 2;
        if (!ticking) {
          requestAnimationFrame(updateTilt);
          ticking = true;
        }
      });

      onResize(function () {
        rect = tiltCard.getBoundingClientRect();
      });

      tiltCard.addEventListener("mouseleave", function () {
        tiltCard.style.transform =
          "perspective(" + perspective + "px) rotateX(0deg) rotateY(0deg)";
      });
    }
  }

  // Mouse Effects
  if (CONFIG.mouseEffect && CONFIG.mouseEffect.enabled) {
    var mouseCanvas = document.createElement("canvas");
    mouseCanvas.id = "mouseEffectCanvas";
    mouseCanvas.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;z-index:99998;pointer-events:none";
    document.body.appendChild(mouseCanvas);

    var mCtx = mouseCanvas.getContext("2d");
    var mW = (mouseCanvas.width = window.innerWidth);
    var mH = (mouseCanvas.height = window.innerHeight);
    var variant = CONFIG.mouseEffect.variant || "trail";
    var mouseX = -100,
      mouseY = -100,
      prevX = -100,
      prevY = -100;

    function resizeMouseCanvas() {
      mW = mouseCanvas.width = window.innerWidth;
      mH = mouseCanvas.height = window.innerHeight;
    }
    onResize(resizeMouseCanvas);

    document.addEventListener("mousemove", function (e) {
      prevX = mouseX;
      prevY = mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    document.addEventListener("mouseleave", function () {
      mouseX = -100;
      mouseY = -100;
    });

    var trail, particles, pColor, lastMX, lastMY, emitAccum, ripples;

    // Trail
    if (variant === "trail") {
      trail = [];
      var trailLen = isLowEndDevice ? 8 : 20;
      function drawTrail() {
        if(isPageHidden)return;
        mCtx.clearRect(0, 0, mW, mH);
        if (mouseX > 0) {
          trail.push({ x: mouseX, y: mouseY });
          if (trail.length > trailLen) trail.shift();
        }
        for (var i = 0; i < trail.length; i++) {
          var alpha = (i / trail.length) * 0.6;
          var size = (i / trail.length) * 8 + 2;
          mCtx.beginPath();
          mCtx.arc(trail[i].x, trail[i].y, size, 0, Math.PI * 2);
          mCtx.fillStyle = "rgba(255,255,255," + alpha + ")";
          mCtx.fill();
        }
      }
      _registerAnimation(drawTrail, 1);
    }

    // Particles
    if (variant === "particles") {
      particles = [];
      pColor = CONFIG.mouseEffect.color || "#ffffff";
      lastMX = -1; lastMY = -1;
      emitAccum = 0;

      function emitParticles(x, y, count) {
        for (var i = 0; i < count; i++) {
          var angle = Math.random() * Math.PI * 2;
          var speed = Math.random() * 2 + 0.5;
          particles.push({
            x: x + (Math.random() - 0.5) * 6,
            y: y + (Math.random() - 0.5) * 6,
            vx: Math.cos(angle) * speed * 0.3,
            vy: Math.sin(angle) * speed * 0.3 - 0.5,
            life: 1,
            decay: 0.008 + Math.random() * 0.012,
            size: Math.random() * 3 + 1.5,
            gravity: 0.02,
          });
        }
      }

      function drawParticles() {
        if(isPageHidden)return;
        mCtx.clearRect(0, 0, mW, mH);

        if (mouseX > 0 && lastMX > 0) {
          var dx = mouseX - lastMX;
          var dy = mouseY - lastMY;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 1) {
            var burst = Math.min(Math.floor(dist * 0.5), isLowEndDevice ? 3 : 8);
            emitParticles(mouseX, mouseY, burst);
          }
          emitAccum += dist;
          if (emitAccum > 20) {
            emitParticles(mouseX, mouseY, isLowEndDevice ? 1 : 3);
            emitAccum = 0;
          }
        }
        if (mouseX > 0 && Math.random() < 0.25 && !isLowEndDevice) {
          emitParticles(
            mouseX + (Math.random() - 0.5) * 14,
            mouseY + (Math.random() - 0.5) * 14,
            1
          );
        }
        lastMX = mouseX;
        lastMY = mouseY;

        for (var i = particles.length - 1; i >= 0; i--) {
          var p = particles[i];
          p.vx *= 0.98;
          p.vy += p.gravity;
          p.x += p.vx;
          p.y += p.vy;
          p.life -= p.decay;
          if (p.life <= 0) { particles.splice(i, 1); continue; }
          mCtx.beginPath();
          mCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          mCtx.fillStyle = pColor;
          mCtx.globalAlpha = p.life * 0.8;
          mCtx.fill();
        }
        mCtx.globalAlpha = 1;
      }
      _registerAnimation(drawParticles, 1);
    }

    // Glow
    if (variant === "glow") {
      function drawGlow() {
        if(isPageHidden)return;
        mCtx.clearRect(0, 0, mW, mH);
        if (mouseX > 0) {
          var grad = mCtx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 120);
          grad.addColorStop(0, "rgba(255,255,255,0.15)");
          grad.addColorStop(0.5, "rgba(200,200,255,0.05)");
          grad.addColorStop(1, "rgba(255,255,255,0)");
          mCtx.fillStyle = grad;
          mCtx.fillRect(mouseX - 120, mouseY - 120, 240, 240);
        }
      }
      _registerAnimation(drawGlow, 1);
    }

    // Ripple
    if (variant === "ripple") {
      ripples = [];
      document.addEventListener("click", function (e) {
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          radius: 0,
          maxRadius: 80,
          alpha: 1,
          speed: 4,
        });
      });
      function drawRipple() {
        if(isPageHidden)return;
        mCtx.clearRect(0, 0, mW, mH);
        for (var i = ripples.length - 1; i >= 0; i--) {
          var r = ripples[i];
          r.radius += r.speed;
          r.alpha = 1 - r.radius / r.maxRadius;
          if (r.alpha <= 0) { ripples.splice(i, 1); continue; }
          mCtx.beginPath();
          mCtx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          mCtx.strokeStyle = "rgba(255,255,255," + r.alpha + ")";
          mCtx.lineWidth = 2;
          mCtx.stroke();
          mCtx.beginPath();
          mCtx.arc(r.x, r.y, r.radius * 0.6, 0, Math.PI * 2);
          mCtx.strokeStyle = "rgba(200,200,255," + r.alpha * 0.5 + ")";
          mCtx.lineWidth = 1;
          mCtx.stroke();
        }
      }
      _registerAnimation(drawRipple, 1);
    }
  }
})();
