> [!IMPORTANT]
> ## Project Status
>
> **This project is actively maintained and developed by 6sfy.**

> [!CAUTION]
> **This is a fan-made clone of a guns.lol profile page. It is missing many features and layouts from the real site.**
> **I am not responsible for what you do with this code. Build on it, extend it, break it — it's yours now.**

## About

<strong>Welcome to `guns.lol`, a vanilla HTML/CSS/JS profile page clone that lets you create a fully customizable link-in-bio page — no frameworks, no build tools, no server.</strong>

- guns.lol is a static site that runs entirely in the browser. Edit a config file, refresh, and see changes instantly.
- **Like this project?** Drop a view on [guns.lol/500](https://guns.lol/500) or [sexcaller.lol](https://sexcaller.lol) — it helps a lot.


<div align="center">
  <p>
    <a href="https://github.com/6sfy/guns.lol"><img src="https://img.shields.io/github/stars/6sfy/guns.lol?style=flat&logo=github" alt="GitHub stars" /></a>
    <a href="https://github.com/6sfy/guns.lol/blob/main/LICENSE"><img src="https://img.shields.io/github/license/6sfy/guns.lol?style=flat" alt="License" /></a>
  </p>
</div>

> [!WARNING]
> **I don't take any responsibility for blocked guns.lol accounts that used this project.**

> [!CAUTION]
> **Using this project may violate the guns.lol Terms of Service. Use at your own risk.**

### <strong>[Documentation →](https://6sfy.github.io/guns.lol/)</strong>

### <strong>[Example Config](https://github.com/6sfy/guns.lol/blob/main/src/js/config.js)</strong>

## Features
- [x] 5 Layout Presets (default, stacked, compact, minimal, glass)
- [x] 12 Badge Icons (premium, staff, bug, legend, shield, star, heart, crown, verified, gift, trophy, booster)
- [x] Typewriter Bio (animated text that cycles through phrases)
- [x] Audio Player (inline player with playlist, volume, progress bar)
- [x] 7 Background Effects (aurora, stars, snow, rain, plasma, fireflies, dither)
- [x] 4 Mouse Effects (trail, particles, glow, ripple)
- [x] 3D Card Tilt (interactive perspective rotation on hover)
- [x] Custom Cursor (replace system cursor with any PNG)
- [x] Theme Presets (dark, light, neon, ocean, or fully custom)
- [x] Extra Sections (location with live clock, about, portfolio)
- [x] Shuffle Text Animation (matrix-style scramble on load)
- [x] Fonts (custom families via Google Fonts or @import)
- [ ] Everything

## Installation

> [!NOTE]
> **No Node.js, no npm, no server required. Just a browser and a text editor.**

```sh-session
git clone https://github.com/6sfy/guns.lol.git
cd guns.lol
```

Open `index.html` in your browser, then edit `src/js/config.js` to customize your profile. Refresh the page to see changes.

## Example

```js
const CONFIG = {
  username: "YourName",
  uid: "12,345",
  splash: { text: "hello", fontSize: "34px" },
  avatar: { type: "icon" },
  bio: { typewriter: false, staticBio: "Just vibing." },
  joinedDate: "Joined 3 months ago",
  badges: ["verified", "premium", "booster"],
  links: [
    { url: "https://github.com/YourName", icon: "src/assets/icons/icon.png", color: "#ffffff" },
  ],
  views: 0,
  layout: { type: "glass", containerWidth: "44rem" },
  theme: { preset: "dark" },
  background: { color: "#000000", effects: {} },
};
```

## Get Started ?

<strong>Edit `src/js/config.js` — every feature is optional. Set values to `false`, empty arrays, or empty strings to disable anything.</strong>

```sh
# Serve locally if you want live reload
python -m http.server 8080
# or
npx serve .
```

## Contributing

- Before creating an issue, please ensure that it hasn't already been reported/suggested, and double-check the
[documentation](https://6sfy.github.io/guns.lol/).
- Fork the repo, make your changes, and submit a pull request.

## Need help?
GitHub Issues: [Here](https://github.com/6sfy/guns.lol/issues)

## Credits
- Original [guns.lol](https://guns.lol) platform
- [forge-agent](https://github.com/anomalyco/opencode) for the development environment

## Other project(s)

- 🌐 [***Sexcaller***](https://sexcaller.lol) <br/>
  Personal profile and links

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=6sfy/guns.lol&type=Date)](https://star-history.com/#6sfy/guns.lol&Date)
