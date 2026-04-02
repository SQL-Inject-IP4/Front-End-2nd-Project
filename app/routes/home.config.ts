export type RgbColor = {
  r: number;
  g: number;
  b: number;
};

export type FontOption = {
  name: string;
  stack: string;
  note: string;
  sample: string;
  badge: string;
};

export const CURATED_FONT_OPTIONS: FontOption[] = [
  {
    name: "Gallery Sans",
    stack: "\"Manrope\", \"Segoe UI\", sans-serif",
    note: "Clean, rounded, and calm for a polished interface.",
    sample: "Soft geometry for a modern paper system.",
    badge: "Balanced",
  },
  {
    name: "Editorial Serif",
    stack: "\"Fraunces\", Georgia, serif",
    note: "Sharper and more expressive, like a printed feature spread.",
    sample: "A headline with presence and a little drama.",
    badge: "Expressive",
  },
  {
    name: "Signal Sans",
    stack: "\"Sora\", \"Trebuchet MS\", sans-serif",
    note: "Crisp, architectural, and slightly more futuristic.",
    sample: "Structured wording with a confident silhouette.",
    badge: "Modern",
  },
  {
    name: "Archive Mono",
    stack: "\"IBM Plex Mono\", \"Courier New\", monospace",
    note: "Technical and methodical, good for a dossier feel.",
    sample: "Measured notes and labels with terminal energy.",
    badge: "Technical",
  },
  {
    name: "Classic Display",
    stack: "\"Cormorant Garamond\", Georgia, serif",
    note: "Lighter, more graceful, and distinctly editorial.",
    sample: "Elegant wording that feels curated and airy.",
    badge: "Elegant",
  },
  {
    name: "Space Grotesk",
    stack: "\"Space Grotesk\", \"Segoe UI\", sans-serif",
    note: "Compact rhythm with a more designed tech profile.",
    sample: "A sharper voice for interface labels and sections.",
    badge: "Compact",
  },
  {
    name: "Modern Humanist",
    stack: "\"Aptos\", \"Calibri\", sans-serif",
    note: "Friendly and readable with a softer office-modern tone.",
    sample: "Clear wording with an easy rhythm for body text.",
    badge: "Readable",
  },
  {
    name: "Studio Neo",
    stack: "\"Century Gothic\", \"Trebuchet MS\", sans-serif",
    note: "Rounder geometry for a cleaner portfolio-style voice.",
    sample: "Bright interface copy with balanced spacing.",
    badge: "Rounded",
  },
  {
    name: "Scholar Serif",
    stack: "\"Cambria\", \"Times New Roman\", serif",
    note: "Formal and structured for a more academic presentation.",
    sample: "Document-style wording with stronger serif contrast.",
    badge: "Formal",
  },
  {
    name: "Newsroom Serif",
    stack: "\"Baskerville\", \"Georgia\", serif",
    note: "Classic editorial texture with a slightly richer personality.",
    sample: "A more refined reading tone for headings and labels.",
    badge: "Classic",
  },
  {
    name: "Console Mono",
    stack: "\"Consolas\", \"Courier New\", monospace",
    note: "Sharper technical feel with cleaner monospace proportions.",
    sample: "Structured interface notes with a precise system mood.",
    badge: "System",
  },
  {
    name: "Humanist Sans",
    stack: "\"Gill Sans\", \"Segoe UI\", sans-serif",
    note: "Airier and slightly more editorial than standard UI sans fonts.",
    sample: "Elegant labels with a lighter human touch.",
    badge: "Airy",
  },
];

export const PHOTO_MEMBERS = [
  { photo: "/tristan.jpeg", name: "Tristan Rasheed Satria", npm: "2406358472", email: "tristan.rasheedsatria@gmail.com" },
  { photo: "/ibaadi.jpeg", name: "Muhammad Ibaadi Ilmi", npm: "2406357684", email: "ibaadijaya2@gmail.com" },
  { photo: "/fitto.jpeg", name: "Fitto Fadhelli Voltanie Ariyana", npm: "2406423401", email: "fitto.fadhelli@gmail.com" },
  { photo: "/amar.jpeg", name: "Amar Hakim", npm: "2406429563", email: "amarhakimhamzah@gmail.com" },
  { photo: "/falah.jpeg", name: "Muhammad Hadziqul Falah Teguh", npm: "2406437432", email: "hadziqulfalah18@gmail.com" },
];

export const THEME_VARIABLES = [
  "--page-base",
  "--page-ink",
  "--page-ink-soft",
  "--page-surface",
  "--page-surface-strong",
  "--page-surface-soft",
  "--page-border",
  "--page-border-strong",
  "--page-shadow",
  "--page-accent",
  "--page-accent-soft",
  "--page-highlight",
  "--font-live",
];

export function clampChannel(value: number) {
  return Math.max(0, Math.min(255, value));
}

export function parseRgb(color: string): RgbColor {
  const match = color.match(/\d+/g);

  if (!match || match.length < 3) {
    return { r: 226, g: 232, b: 240 };
  }

  return {
    r: clampChannel(Number(match[0])),
    g: clampChannel(Number(match[1])),
    b: clampChannel(Number(match[2])),
  };
}

export function mixColor(first: RgbColor, second: RgbColor, ratio: number): RgbColor {
  return {
    r: Math.round(first.r + (second.r - first.r) * ratio),
    g: Math.round(first.g + (second.g - first.g) * ratio),
    b: Math.round(first.b + (second.b - first.b) * ratio),
  };
}

export function toRgbString(color: RgbColor, alpha?: number) {
  if (alpha === undefined) {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  }

  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}

export function toHexChannel(value: number) {
  return clampChannel(value).toString(16).padStart(2, "0");
}

export function rgbToHex(color: string) {
  const parsed = parseRgb(color);
  return `#${toHexChannel(parsed.r)}${toHexChannel(parsed.g)}${toHexChannel(parsed.b)}`;
}

export function hexToRgbString(hex: string) {
  const sanitized = hex.replace("#", "");

  if (sanitized.length !== 6) {
    return "rgb(226, 232, 240)";
  }

  const r = Number.parseInt(sanitized.slice(0, 2), 16);
  const g = Number.parseInt(sanitized.slice(2, 4), 16);
  const b = Number.parseInt(sanitized.slice(4, 6), 16);

  return `rgb(${r}, ${g}, ${b})`;
}

export function getLuminance(color: RgbColor) {
  return (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 255;
}

export function createThemeTokens(base: RgbColor) {
  const inkBase = getLuminance(base) < 0.48
    ? mixColor({ r: 248, g: 250, b: 252 }, base, 0.78)
    : mixColor({ r: 18, g: 24, b: 38 }, base, 0.14);
  const accent = getLuminance(base) < 0.48
    ? mixColor(base, { r: 255, g: 255, b: 255 }, 0.3)
    : mixColor(base, { r: 61, g: 77, b: 102 }, 0.3);

  return {
    "--page-base": toRgbString(mixColor(base, { r: 255, g: 255, b: 255 }, 0.18)),
    "--page-ink": toRgbString(inkBase),
    "--page-ink-soft": toRgbString(mixColor(inkBase, { r: 255, g: 255, b: 255 }, 0.35), 0.88),
    "--page-surface": toRgbString(mixColor(base, { r: 255, g: 255, b: 255 }, 0.78), 0.76),
    "--page-surface-strong": toRgbString(mixColor(base, { r: 255, g: 255, b: 255 }, 0.9), 0.94),
    "--page-surface-soft": toRgbString(mixColor(base, { r: 255, g: 255, b: 255 }, 0.58), 0.54),
    "--page-border": toRgbString(mixColor(base, { r: 31, g: 41, b: 55 }, 0.22), 0.14),
    "--page-border-strong": toRgbString(mixColor(base, { r: 31, g: 41, b: 55 }, 0.28), 0.22),
    "--page-shadow": toRgbString(mixColor(base, { r: 15, g: 23, b: 42 }, 0.48), 0.18),
    "--page-accent": toRgbString(accent),
    "--page-accent-soft": toRgbString(accent, 0.12),
    "--page-highlight": toRgbString(mixColor(base, { r: 255, g: 255, b: 255 }, 0.74), 0.62),
  };
}

export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export function formatFontName(fontFamily: string) {
  return fontFamily.split(",")[0].replaceAll("\"", "").trim();
}

export function findFontOption(fontFamily: string) {
  return CURATED_FONT_OPTIONS.find((option) => option.stack === fontFamily);
}

export function getFontDisplayName(fontFamily: string) {
  return findFontOption(fontFamily)?.name ?? formatFontName(fontFamily);
}

export function getFontOptions(currentFont?: string | null) {
  if (!currentFont || CURATED_FONT_OPTIONS.some((option) => option.stack === currentFont)) {
    return CURATED_FONT_OPTIONS;
  }

  return [
    {
      name: "Current Saved Font",
      stack: currentFont,
      note: "Font ini berasal dari style yang sudah tersimpan di backend.",
      sample: `Current live choice: ${formatFontName(currentFont)}`,
      badge: "Saved",
    },
    ...CURATED_FONT_OPTIONS,
  ];
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
