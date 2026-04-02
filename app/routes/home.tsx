import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import type { Route } from "./+types/home";
import { fetchCurrentUser, logout, type AuthUser } from "../api/auth";
import { BACKEND_URL } from "../api/backend";
import {
  fetchStyle,
  sendBackgroundColor,
  sendFont,
  type StyleSettings,
} from "../api/style";

type RgbColor = {
  r: number;
  g: number;
  b: number;
};

type FontOption = {
  name: string;
  stack: string;
  note: string;
  sample: string;
  badge: string;
};

const CURATED_FONT_OPTIONS: FontOption[] = [
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
];

const PHOTO_MEMBERS = [
  { photo: "/tristan.jpeg", name: "Tristan Rasheed Satria", npm: "2406358472", email: "tristan.rasheedsatria@gmail.com" },
  { photo: "/ibaadi.jpeg", name: "Muhammad Ibaadi Ilmi", npm: "2406357684", email: "ibaadijaya2@gmail.com" },
  { photo: "/fitto.jpeg", name: "Fitto Fadhelli Voltanie Ariyana", npm: "2406423401", email: "fitto.fadhelli@gmail.com" },
  { photo: "/amar.jpeg", name: "Amar Hakim", npm: "2406429563", email: "amarhakimhamzah@gmail.com" },
  { photo: "/falah.jpeg", name: "Muhammad Hadziqul Falah Teguh", npm: "2406437432", email: "hadziqulfalah18@gmail.com" },
];

const THEME_VARIABLES = [
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

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SQL Inject IP4" },
    { name: "description", content: "Halo dunia'); DROP TABLE Groups;--" },
  ];
}

function clampChannel(value: number) {
  return Math.max(0, Math.min(255, value));
}

function parseRgb(color: string): RgbColor {
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

function mixColor(first: RgbColor, second: RgbColor, ratio: number): RgbColor {
  return {
    r: Math.round(first.r + (second.r - first.r) * ratio),
    g: Math.round(first.g + (second.g - first.g) * ratio),
    b: Math.round(first.b + (second.b - first.b) * ratio),
  };
}

function toRgbString(color: RgbColor, alpha?: number) {
  if (alpha === undefined) {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  }

  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}

function toHexChannel(value: number) {
  return clampChannel(value).toString(16).padStart(2, "0");
}

function rgbToHex(color: string) {
  const parsed = parseRgb(color);
  return `#${toHexChannel(parsed.r)}${toHexChannel(parsed.g)}${toHexChannel(parsed.b)}`;
}

function hexToRgbString(hex: string) {
  const sanitized = hex.replace("#", "");

  if (sanitized.length !== 6) {
    return "rgb(226, 232, 240)";
  }

  const r = Number.parseInt(sanitized.slice(0, 2), 16);
  const g = Number.parseInt(sanitized.slice(2, 4), 16);
  const b = Number.parseInt(sanitized.slice(4, 6), 16);

  return `rgb(${r}, ${g}, ${b})`;
}

function getLuminance(color: RgbColor) {
  return (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 255;
}

function createThemeTokens(base: RgbColor) {
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

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function formatFontName(fontFamily: string) {
  return fontFamily.split(",")[0].replaceAll("\"", "").trim();
}

function getFontOptions(currentFont?: string | null) {
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

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Home() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [currentStyle, setCurrentStyle] = useState<StyleSettings | null>(null);
  const [selectedFont, setSelectedFont] = useState(CURATED_FONT_OPTIONS[0].stack);
  const [primaryColorHex, setPrimaryColorHex] = useState("#e2e8f0");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function hydrateFromBackend() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const params = new URLSearchParams(window.location.search);
        const authError = params.get("error");

        if (authError === "oauth_failed") {
          setErrorMessage("Login Google gagal. Coba ulangi lagi.");
        }

        const [auth, style] = await Promise.all([fetchCurrentUser(), fetchStyle()]);

        if (!isMounted) {
          return;
        }

        setCurrentStyle(style);

        if (!auth.authenticated || !auth.user) {
          setUser(null);
          return;
        }

        setUser(auth.user);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message = error instanceof Error ? error.message : "Failed to connect to backend";
        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    hydrateFromBackend();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    if (!currentStyle) {
      THEME_VARIABLES.forEach((key) => root.style.removeProperty(key));
      return;
    }

    const themeTokens = createThemeTokens(parseRgb(currentStyle.backgroundColor));

    Object.entries(themeTokens).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    root.style.setProperty("--font-live", currentStyle.fontFamily);

    return () => {
      THEME_VARIABLES.forEach((key) => root.style.removeProperty(key));
    };
  }, [currentStyle]);

  useEffect(() => {
    if (!currentStyle) {
      return;
    }

    setSelectedFont(currentStyle.fontFamily);
    setPrimaryColorHex(rgbToHex(currentStyle.backgroundColor));
  }, [currentStyle]);

  const fontOptions = getFontOptions(currentStyle?.fontFamily);
  const selectedFontOption = fontOptions.find((option) => option.stack === selectedFont);
  const primaryColorPreview = primaryColorHex.toUpperCase();
  const canEditStyle = user?.role === "EDITOR";
  const previewBackgroundColor = hexToRgbString(primaryColorHex);
  const previewThemeTokens = createThemeTokens(parseRgb(previewBackgroundColor));
  const previewCardStyle = {
    "--preview-base": previewThemeTokens["--page-base"],
    "--preview-ink": previewThemeTokens["--page-ink"],
    "--preview-ink-soft": previewThemeTokens["--page-ink-soft"],
    "--preview-surface": previewThemeTokens["--page-surface-strong"],
    "--preview-border": previewThemeTokens["--page-border-strong"],
    "--preview-accent": previewThemeTokens["--page-accent"],
    "--preview-accent-soft": previewThemeTokens["--page-accent-soft"],
    "--preview-font": selectedFont,
  } as CSSProperties;

  async function handleLogout() {
    await logout();
    window.location.reload();
  }

  async function handleBackgroundSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setErrorMessage(null);
      const color = hexToRgbString(primaryColorHex);
      const style = await sendBackgroundColor(color);
      setCurrentStyle(style);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update background color";
      setErrorMessage(message);
    }
  }

  async function handleFontSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setErrorMessage(null);
      const style = await sendFont(selectedFont);
      setCurrentStyle(style);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update font";
      setErrorMessage(message);
    }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div>
            <p className="brand-kicker">Global Interface</p>
            <p className="brand-name">SQL Inject IP4</p>
          </div>
        </div>

        <nav className="section-switcher" aria-label="Page sections">
          <a href="#overview">Overview</a>
          <a href="#members">Anggota</a>
          <a href="#studio">Style Studio</a>
        </nav>

        <div className="topbar-note">
          <span className="topbar-dot" />
          {currentStyle ? "Live theme connected" : "Waiting for backend"}
        </div>
      </header>

      <section className="hero-stage" id="overview">
        <div className="hero-copy">
          <p className="eyebrow">Nama Tim</p>
          <h1>SQL Inject IP4</h1>

          <div className="hero-pills">
          </div>
        </div>

        <article className="paper-card auth-card">
          <div className="card-heading-row">
            <p className="card-kicker">Authentication</p>
            <span className="card-badge">{user?.role ?? "Guest"}</span>
          </div>

          {isLoading ? (
            <div className="auth-copy">
              <h2>Menghubungkan frontend ke backend</h2>
              <p>Session pengguna dan style aktif sedang dimuat.</p>
            </div>
          ) : !user ? (
            <div className="auth-copy">
              <h2>Kamu belum login</h2>
              <p>
                Masuk dengan Google untuk mengakses dashboard.
                Akun yang tidak masuk daftar izin tetap bisa login, tetapi role-nya hanya VIEWER.
              </p>
              <a className="action-button primary-button" href={`${BACKEND_URL}/auth/google`}>
                Login dengan Google
              </a>
            </div>
          ) : (
            <div className="auth-copy">
              <div className="identity-row">
                <div>
                  <p className="identity-label">Current user</p>
                  <h2>{user.name ?? user.email}</h2>
                </div>
                {user.avatarUrl ? (
                  <img className="user-avatar" src={user.avatarUrl} alt={user.name ?? user.email} />
                ) : (
                  <div className="avatar-fallback">{getInitials(user.name ?? user.email)}</div>
                )}
              </div>

              <p className="auth-description">
                {user.role === "EDITOR"
                  ? "Akun ini punya akses untuk mengubah warna latar dan wording style seluruh interface."
                  : "Akun ini bisa login dan melihat style aktif, tetapi tidak ada di daftar akun yang boleh edit."}
              </p>

              <div className="action-row">
                <button className="action-button secondary-button" onClick={handleLogout} type="button">
                  Logout
                </button>
              </div>
            </div>
          )}
        </article>

        {currentStyle ? (
          <article className="paper-card snapshot-card">
            <div className="card-heading-row">
              <p className="card-kicker">Style Snapshot</p>
              <span className="card-badge">Active</span>
            </div>

            <div className="swatch-row" aria-hidden="true">
              <span className="swatch" style={{ background: currentStyle.backgroundColor }} />
              <span className="swatch" style={{ background: "var(--page-surface-strong)" }} />
              <span className="swatch" style={{ background: "var(--page-accent)" }} />
            </div>

            <div className="detail-rows">
              <div className="detail-row">
                <span>Primary color</span>
                <strong>{rgbToHex(currentStyle.backgroundColor).toUpperCase()}</strong>
              </div>
              <div className="detail-row">
                <span>Word style</span>
                <strong>{formatFontName(currentStyle.fontFamily)}</strong>
              </div>
              <div className="detail-row">
                <span>Updated by</span>
                <strong>{currentStyle.updatedBy?.name ?? "Registered editor"}</strong>
              </div>
              <div className="detail-row">
                <span>Last saved</span>
                <strong>{formatDate(currentStyle.updatedAt)}</strong>
              </div>
            </div>
          </article>
        ) : null}
      </section>

      {errorMessage ? (
        <section className="notice-section">
          <article className="paper-card notice-card">
            <div className="card-heading-row">
              <p className="card-kicker">Status Notice</p>
              <span className="card-badge">Attention</span>
            </div>
            <h2>Backend message</h2>
            <p>{errorMessage}</p>
          </article>
        </section>
      ) : null}

      <section className="section-shell" id="members">
        <div className="section-heading">
          <p className="section-kicker">Biodata Kelompok</p>
          <h2>Anggota Tim</h2>
        </div>

        <div className="member-grid">
          {PHOTO_MEMBERS.map((member, index) => (
            <article key={member.photo} className="member-card">
              <div className="member-card-top">
                <div>
                  <p className="member-order">Member {String(index + 1).padStart(2, "0")}</p>
                  <h3>{getInitials(member.name)}</h3>
                </div>
                <span className="member-chip">Active</span>
              </div>

              <img className="member-photo" src={member.photo} alt={member.name} />

              <div className="member-body">
                <p className="member-name">{member.name}</p>


                <div className="member-meta-row">
                  <span>NPM</span>
                  <strong>{member.npm.trim()}</strong>
                </div>
                <div className="member-meta-row">
                  <span>Gmail</span>
                  <strong>{member.email}</strong>
                </div>
                <div className="member-meta-row">
                  <span>Profile status</span>
                  <strong>Registered member</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {currentStyle ? (
        <section className="section-shell studio-shell" id="studio">
          <div className="section-heading">
            <p className="section-kicker">Style Website</p>
            <p className="section-script">Global</p>
            <h2>Kontrol Tampilan</h2>
          </div>

          <div className="studio-grid">
            {!user ? (
              <article className="paper-card studio-message-card">
                <p>Login terlebih dahulu untuk membuka Style Studio.</p>
              </article>
            ) : !canEditStyle ? (
              <article className="paper-card studio-message-card">
                <p>Akun ini bukan registered account editor, jadi Style Studio tidak tersedia.</p>
              </article>
            ) : (
              <>
                <article className="paper-card studio-card">
                  <div className="card-heading-row">
                    <p className="card-kicker">Primary Color</p>
                    <span className="card-badge">1 theme color</span>
                  </div>

                  <form className="studio-form" onSubmit={handleBackgroundSubmit}>
                    <div className="preview-panel">
                      <div className="preview-swatch" style={{ backgroundColor: primaryColorHex }} />
                      <div>
                        <p className="preview-label">Current primary color</p>
                        <strong>{primaryColorPreview}</strong>
                      </div>
                    </div>

                    <label className="color-field" htmlFor="primary-color">
                      <span>Pilih warna utama</span>
                      <div className="color-picker-row">
                        <input
                          id="primary-color"
                          className="color-picker"
                          name="primary-color"
                          onChange={(event) => setPrimaryColorHex(event.target.value)}
                          required
                          type="color"
                          value={primaryColorHex}
                        />
                        <div className="color-value">{primaryColorPreview}</div>
                      </div>
                    </label>

                    <button className="action-button primary-button" type="submit">
                      Save primary color
                    </button>
                  </form>
                </article>

                <article className="paper-card studio-card font-studio-card">
                  <div className="card-heading-row">
                    <p className="card-kicker">Word Style</p>
                    <span className="card-badge">1 global font</span>
                  </div>

                  <form className="studio-form" onSubmit={handleFontSubmit}>
                    <div className="font-preview-card">
                      <p className="preview-label">Current font preview</p>
                      <p className="font-preview-name">{selectedFontOption?.name ?? formatFontName(selectedFont)}</p>
                      <p className="font-preview-sample" style={{ fontFamily: selectedFont }}>
                        Biodata kelompok dengan gaya kata yang konsisten untuk seluruh halaman.
                      </p>
                      <p className="control-note">
                        {selectedFontOption?.note ?? "Satu style font ini akan diterapkan secara global."}
                      </p>
                    </div>

                    <label className="font-select-field" htmlFor="word-style">
                      <span>Pilih style font global</span>
                      <div className="font-select-shell">
                        <select
                          id="word-style"
                          className="font-select"
                          name="word-style"
                          onChange={(event) => setSelectedFont(event.target.value)}
                          value={selectedFont}
                        >
                          {fontOptions.map((option) => (
                            <option key={option.stack} value={option.stack}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </label>

                    <div className="selection-footer is-compact">
                      <div>
                        <p className="preview-label">Selected word style</p>
                        <strong>{selectedFontOption?.badge ?? "Global"}</strong>
                      </div>
                      <button className="action-button primary-button" type="submit">
                        Save font style
                      </button>
                    </div>
                  </form>
                </article>

                <article className="paper-card studio-preview-card" style={previewCardStyle}>
                  <div className="card-heading-row">
                    <p className="card-kicker">Preview Result</p>
                    <span className="card-badge">Before save</span>
                  </div>

                  <div className="studio-preview-layout">
                    <div className="studio-preview-notes">
                      <p className="preview-label">Preview warna dan word style</p>
                      <h3>{selectedFontOption?.name ?? formatFontName(selectedFont)}</h3>
                      <p className="control-note">
                        Kotak ini menunjukkan kira-kira hasil tampilan kalau pilihan warna dan font yang sekarang kamu simpan.
                      </p>

                      <div className="preview-meta-list">
                        <div className="preview-meta-item">
                          <span>Primary color</span>
                          <strong>{primaryColorPreview}</strong>
                        </div>
                        <div className="preview-meta-item">
                          <span>Word style</span>
                          <strong>{selectedFontOption?.badge ?? "Selected"}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="studio-preview-canvas">
                      <div className="studio-preview-chip-row">
                        <span className="studio-preview-chip">Live preview</span>
                        <span className="studio-preview-chip is-soft">{formatFontName(selectedFont)}</span>
                      </div>

                      <h4>Kalau disimpan, nuansa website akan bergerak ke arah ini.</h4>
                      <p>
                        Warna utama akan mempengaruhi panel, aksen, dan titik fokus visual. Font pilihanmu juga akan
                        mengubah karakter seluruh isi halaman secara global.
                      </p>

                      <div className="studio-preview-mini-card">
                        <p className="studio-preview-mini-kicker">Example card</p>
                        <strong>SQL Inject IP4</strong>
                        <span>Biodata kelompok dengan tampilan yang lebih sesuai pilihan terbaru.</span>
                      </div>
                    </div>
                  </div>
                </article>
              </>
            )}
          </div>
        </section>
      ) : null}
    </main>
  );
}
