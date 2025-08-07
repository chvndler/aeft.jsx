# aeft.jsx

Public Repo of Adobe® After Effects scripts, snippets, style, and more.

# 🎞️ AE Expressions & Scripts

A curated library of After Effects expressions, scripts, and animation presets I use in motion design projects. Organized like a JS codebase for easy navigation and reuse.

---

## 📁 Folder Structure

```
├── src/
│   ├── expressions/
│   │   ├── animation/
│   │   │   └── bounce-ease.jsx
│   │   ├── text/
│   │   │   ├── typewriter.jsx
│   │   │   └── tracking-style.jsx
│   │   ├── layout/
│   │   │   └── auto-spacing.jsx
│   │   └── utility/
│   │       └── remap.jsx
│   ├── scripts/
│   │   └── batch-update-fonts.jsx
│   └── presets/
│       └── text-style.ffx
├── docs/
│   └── README.md
├── examples/
│   └── project-links.md
├── .gitignore
├── README.md
├── LICENSE
```

---

## 🔧 Usage

### ✨ Expressions

1. Copy any `.jsx` file from `src/expressions/`
2. Paste directly into the property’s expression field in After Effects
3. Customize any exposed variables if needed

### 📜 Scripts

- Run `.jsx` files via `File > Scripts > Run Script File…` or place in your AE Scripts folder
- Useful for bulk updates like font/style changes across projects

### 🎛 Presets

- Drag `.ffx` files into AE or import into the Effects & Presets panel

---

## 🧠 Suggestions

- Always label your control layers clearly (`_CTRL` suffix)
- Modularize reusable components in AE the same way this repo is structured
- Combine multiple expressions into presets for faster deployment

---

## 📂 License

MIT — use freely, tweak endlessly.

---

## ☕ Created by [@chandler](https://github.com/chandler)
