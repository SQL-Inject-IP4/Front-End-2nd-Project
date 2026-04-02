import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import type { Route } from "./+types/home";
import { fetchCurrentUser, logout, type AuthUser } from "../api/auth";
import {
  fetchStyle,
  sendBackgroundColor,
  sendFont,
  type StyleSettings,
} from "../api/style";
import {
  createThemeTokens,
  CURATED_FONT_OPTIONS,
  getFontOptions,
  hexToRgbString,
  parseRgb,
  rgbToHex,
  THEME_VARIABLES,
} from "./home.config";
import {
  AuthCard,
  MembersSection,
  NoticeSection,
  StudioSection,
  StyleSnapshotCard,
  TopBar,
} from "./home.sections";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SQL Inject IP4" },
    { name: "description", content: "Halo dunia'); DROP TABLE Groups;--" },
  ];
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
      <TopBar hasCurrentStyle={Boolean(currentStyle)} />

      <section className="hero-stage" id="overview">
        <div className="hero-copy">
          <p className="eyebrow">Nama Tim</p>
          <h1>SQL Inject IP4</h1>

          <div className="hero-pills">
          </div>
        </div>

        <AuthCard isLoading={isLoading} user={user} onLogout={handleLogout} />
        {currentStyle ? <StyleSnapshotCard currentStyle={currentStyle} /> : null}
      </section>

      {errorMessage ? <NoticeSection errorMessage={errorMessage} /> : null}

      <MembersSection />

      {currentStyle ? (
        <StudioSection
          user={user}
          canEditStyle={canEditStyle}
          primaryColorHex={primaryColorHex}
          primaryColorPreview={primaryColorPreview}
          selectedFont={selectedFont}
          selectedFontOption={selectedFontOption}
          fontOptions={fontOptions}
          previewCardStyle={previewCardStyle}
          onBackgroundSubmit={handleBackgroundSubmit}
          onFontSubmit={handleFontSubmit}
          setPrimaryColorHex={setPrimaryColorHex}
          setSelectedFont={setSelectedFont}
        />
      ) : null}
    </main>
  );
}
