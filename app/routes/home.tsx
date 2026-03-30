import type { Route } from "./+types/home";
import { useEffect, useState, type FormEvent } from "react";
import { fetchCurrentUser, logout, type AuthUser } from "../api/auth";
import { BACKEND_URL } from "../api/backend";
import { fetchStyle, sendBackgroundColor, sendFont, type StyleSettings } from "../api/style";

const FONT_OPTIONS = [
  "Arial, sans-serif",
  "Verdana, sans-serif",
  "Tahoma, sans-serif",
  "\"Trebuchet MS\", sans-serif",
  "Georgia, serif",
  "\"Times New Roman\", serif",
  "\"Palatino Linotype\", serif",
  "\"Comic Sans MS\", cursive",
  "\"Courier New\", monospace",
  "\"Lucida Console\", monospace"
];

const PHOTO_MEMBERS = [
  { photo: "/tristan.jpeg", name: "Tristan Rasheed Satria", npm: "2406358472" },
  { photo: "/ibaadi.jpeg", name: "Muhammad Ibaadi Ilmi", npm: "2406357684" },
  { photo: "/fitto.jpeg", name: "Fitto Fadhelli Voltanie Ariyana", npm: "	2406423401" },
  { photo: "/amar.jpeg", name: "Amar Hakim", npm: "2406429563" },
  { photo: "/falah.jpeg", name: "Muhammad Hadziqul Falah Teguh", npm: "2406437432" },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SQL Inject IP4" },
    { name: "description", content: "Halo dunia'); DROP TABLE Groups;--" },
  ];
}

function parseRgb(color: string) {
  const match = color.match(/\d+/g);

  if (!match || match.length !== 3) {
    return { r: 0, g: 127, b: 255 };
  }

  return {
    r: Number(match[0]),
    g: Number(match[1]),
    b: Number(match[2])
  };
}

async function handleSubmitBackground(e: FormEvent<HTMLFormElement>, onSuccess: (style: StyleSettings) => void) {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const [r, g, b] = ["r", "g", "b"].map((channel) => Number(formData.get(channel) as string));
  const color = `rgb(${r}, ${g}, ${b})`;

  const style = await sendBackgroundColor(color);
  onSuccess(style);
}

async function handleSubmitFont(e: FormEvent<HTMLFormElement>, onSuccess: (style: StyleSettings) => void) {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const font = formData.get("new-font") as string;

  const style = await sendFont(font);
  onSuccess(style);
}

export default function Home() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [currentStyle, setCurrentStyle] = useState<StyleSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function hydrateFromBackend() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const [auth, style] = await Promise.all([
          fetchCurrentUser(),
          fetchStyle()
        ]);

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
    if (!currentStyle) {
      document.documentElement.style.backgroundColor = "";
      document.body.style.backgroundColor = "";
      document.documentElement.style.fontFamily = "";
      document.body.style.fontFamily = "";
      return;
    }

    document.documentElement.style.backgroundColor = currentStyle.backgroundColor;
    document.body.style.backgroundColor = currentStyle.backgroundColor;
    document.documentElement.style.fontFamily = currentStyle.fontFamily;
    document.body.style.fontFamily = currentStyle.fontFamily;
  }, [currentStyle]);

  const rgb = currentStyle ? parseRgb(currentStyle.backgroundColor) : { r: 0, g: 127, b: 255 };

  async function handleLogout() {
    await logout();
    window.location.reload();
  }

  async function handleBackgroundSubmit(e: FormEvent<HTMLFormElement>) {
    try {
      await handleSubmitBackground(e, setCurrentStyle);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update background color";
      setErrorMessage(message);
    }
  }

  async function handleFontSubmit(e: FormEvent<HTMLFormElement>) {
    try {
      await handleSubmitFont(e, setCurrentStyle);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update font";
      setErrorMessage(message);
    }
  }

  return <main className="page-shell">
    <section className="hero-card">
      <div className="hero-copy">
        <h1>SQL Inject IP4</h1>
        <p className="subtitle">
          Login Google. Siapapun yang berhasil login google bisa mengganti Font dan warna Background dari website.
        </p>
      </div>

      {isLoading ? (
        <div className="auth-panel">
          <p>Menghubungkan frontend ke backend...</p>
        </div>
      ) : !user ? (
        <div className="auth-panel">
          <p>Kamu belum login. Masuk dengan Google untuk mengubah tampilan website.</p>
          <a className="primary-button" href={`${BACKEND_URL}/auth/google`}>Login dengan Google</a>
        </div>
      ) : (
        <div className="auth-panel">
          <p>
            Login sebagai <strong>{user.name ?? user.email}</strong>
          </p>
          <div className="auth-actions">
            <button className="secondary-button" onClick={handleLogout} type="button">Logout</button>
          </div>
        </div>
      )}
    </section>

    <section className="viewer-card" style={{ marginTop: "1.5rem" }}>
      <h2>Daftar Anggota</h2>
      <div style={{ display: "flex", flexDirection: "row", gap: "1rem", flexWrap: "wrap" }}>
        {PHOTO_MEMBERS.map((member) => (
          <article
            key={member.photo}
            className="info-card"
            style={{
              flex: "1 1 calc((100% - 2rem) / 3)",
              maxWidth: "calc((100% - 2rem) / 3)",
              minWidth: "220px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center"
            }}
          >
            <img
              src={member.photo}
              alt={member.name}
              style={{ width: "160px", height: "160px", objectFit: "cover", borderRadius: "8px" }}
            />
            <p>
              <strong>Name:</strong>
              <br />
              {member.name}
            </p>
            <p>
              <strong>NPM:</strong>
              <br />
              {member.npm}
            </p>
          </article>
        ))}
      </div>
    </section>

    {errorMessage ? (
      <section className="viewer-card" style={{ marginTop: "1.5rem" }}>
        <h2>Backend Error</h2>
        <p>{errorMessage}</p>
      </section>
    ) : null}

    {currentStyle ? (
      <section className="content-grid">
        <article className="info-card">
          <h2>Style Aktif</h2>
          <p>Background: <strong>{currentStyle.backgroundColor}</strong></p>
          <p>Font: <strong>{currentStyle.fontFamily}</strong></p>
          <p>
            Last update by:{" "}
            <strong>{currentStyle.updatedBy?.name ?? currentStyle.updatedBy?.email ?? "System seed"}</strong>
          </p>
        </article>

        {user ? (
          <>
            <article className="form-card">
              <h2>Change Background Color</h2>
              <form onSubmit={handleBackgroundSubmit}>
                <label htmlFor="r">R</label>
                <input defaultValue={rgb.r} type="number" id="r" name="r" min="0" max="255" required />
                <label htmlFor="g">G</label>
                <input defaultValue={rgb.g} type="number" id="g" name="g" min="0" max="255" required />
                <label htmlFor="b">B</label>
                <input defaultValue={rgb.b} type="number" id="b" name="b" min="0" max="255" required />
                <input type="submit" value="Change Background Color" />
              </form>
            </article>

            <article className="form-card">
              <h2>Change Font</h2>
              <form onSubmit={handleFontSubmit}>
                <label htmlFor="new-font">New font name</label>
                <div className="select-shell">
                  <select defaultValue={currentStyle.fontFamily} id="new-font" name="new-font" required>
                    {FONT_OPTIONS.map((font) => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>
                <input type="submit" value="Change Font" />
              </form>
            </article>
          </>
        ) : null}
      </section>
    ) : null}
  </main>;
}
