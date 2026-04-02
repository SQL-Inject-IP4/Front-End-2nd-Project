import type { CSSProperties, Dispatch, FormEventHandler, SetStateAction } from "react";
import type { AuthUser } from "../api/auth";
import { BACKEND_URL } from "../api/backend";
import type { StyleSettings } from "../api/style";
import {
  getFontDisplayName,
  getInitials,
  type FontOption,
  PHOTO_MEMBERS,
  formatDate,
  rgbToHex,
} from "./home.config";

type TopBarProps = {
  hasCurrentStyle: boolean;
};

export function TopBar({ hasCurrentStyle }: TopBarProps) {
  return (
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
        {hasCurrentStyle ? "Live theme connected" : "Waiting for backend"}
      </div>
    </header>
  );
}

type AuthCardProps = {
  isLoading: boolean;
  user: AuthUser | null;
  onLogout: () => Promise<void>;
};

export function AuthCard({ isLoading, user, onLogout }: AuthCardProps) {
  return (
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
            <button className="action-button secondary-button" onClick={onLogout} type="button">
              Logout
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

type StyleSnapshotCardProps = {
  currentStyle: StyleSettings;
};

export function StyleSnapshotCard({ currentStyle }: StyleSnapshotCardProps) {
  return (
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
          <strong>{getFontDisplayName(currentStyle.fontFamily)}</strong>
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
  );
}

type NoticeSectionProps = {
  errorMessage: string;
};

export function NoticeSection({ errorMessage }: NoticeSectionProps) {
  return (
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
  );
}

export function MembersSection() {
  return (
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
  );
}

type StudioSectionProps = {
  user: AuthUser | null;
  canEditStyle: boolean;
  primaryColorHex: string;
  primaryColorPreview: string;
  selectedFont: string;
  selectedFontOption?: FontOption;
  fontOptions: FontOption[];
  previewCardStyle: CSSProperties;
  onBackgroundSubmit: FormEventHandler<HTMLFormElement>;
  onFontSubmit: FormEventHandler<HTMLFormElement>;
  setPrimaryColorHex: Dispatch<SetStateAction<string>>;
  setSelectedFont: Dispatch<SetStateAction<string>>;
};

export function StudioSection({
  user,
  canEditStyle,
  primaryColorHex,
  primaryColorPreview,
  selectedFont,
  selectedFontOption,
  fontOptions,
  previewCardStyle,
  onBackgroundSubmit,
  onFontSubmit,
  setPrimaryColorHex,
  setSelectedFont,
}: StudioSectionProps) {
  return (
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

              <form className="studio-form" onSubmit={onBackgroundSubmit}>
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

              <form className="studio-form" onSubmit={onFontSubmit}>
                <div className="font-preview-card">
                  <p className="preview-label">Current font preview</p>
                  <p className="font-preview-name">{selectedFontOption?.name ?? getFontDisplayName(selectedFont)}</p>
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
                  <h3>{selectedFontOption?.name ?? getFontDisplayName(selectedFont)}</h3>
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
                    <span className="studio-preview-chip is-soft">{getFontDisplayName(selectedFont)}</span>
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
  );
}
