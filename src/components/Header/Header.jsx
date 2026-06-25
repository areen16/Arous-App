import { useState } from 'react';
import { PINK, PINK_LIGHT } from '../../constants';
import { useLang } from '../../context/LangContext';
import { useResponsive } from '../../hooks/useResponsive';
import './Header.css';

const IS_LOGGED_IN = true;

export function Header({ onNavigate, currentUser }) {
  const [open, setOpen] = useState(false);
  const { isDesktop } = useResponsive();
  const { t } = useLang();

  const MENU_ITEMS = [
    { icon: "⚙️", label: t.menuSettings, danger: false },
    { icon: "❤️", label: t.menuFavorites, danger: false },
    { icon: "🏷️", label: t.menuDeals, danger: false },
    { icon: "🆘", label: t.menuSupport, danger: false },
    { icon: "🚪", label: t.menuLogout, danger: true, authOnly: true },
  ];

  // For vendors: show their business cover image; for regular users: show avatar
  const avatarSrc = currentUser?.isVendor
    ? (currentUser?.coverImage || currentUser?.avatar || null)
    : (currentUser?.avatar || null);
  const displayName = currentUser ? t.drawerGreeting(currentUser.firstName) : t.drawerGreeting("אורח");
  const displayEmail = currentUser?.email || "";

  return (
    <>
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px",
        borderBottom: "1px solid #f0e0e8",
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(10px)",
        direction: "rtl",
        position: "sticky", top: 0,
        zIndex: 150,
        boxShadow: "0 1px 10px rgba(194,24,91,0.06)",
      }}>
        {/* hamburger — right side (RTL), hidden on desktop */}
        {!isDesktop && (
          <button
            onClick={() => setOpen(true)}
            aria-label="פתח תפריט"
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", gap: 5, padding: 4,
            }}
          >
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: "block", width: 22, height: 2,
                background: "#444", borderRadius: 2,
              }} />
            ))}
          </button>
        )}

        {/* centered logo */}
        <span style={{
          position: isDesktop ? "relative" : "absolute",
          left: isDesktop ? undefined : "50%",
          transform: isDesktop ? undefined : "translateX(-50%)",
          fontSize: 20, fontWeight: 800, color: PINK, letterSpacing: 1,
        }}>{t.appName}</span>

        {/* profile avatar — click navigates to profile */}
        <button
          onClick={() => onNavigate && onNavigate(3)}
          aria-label="מסך פרופיל"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            border: `2px solid ${PINK_LIGHT}`, overflow: "hidden",
            background: "#f8d0e0",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {avatarSrc
              ? <img src={avatarSrc} alt="פרופיל" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontSize: 18 }}>👤</span>
            }
          </div>
        </button>
      </header>

      {/* backdrop overlay */}
      {open && !isDesktop && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 200,
          }}
        />
      )}

      {/* side drawer — mobile/tablet only */}
      {!isDesktop && (
      <div style={{
        position: "fixed", top: 0, right: open ? 0 : "-280px",
        width: 260, height: "100%",
        background: "#fff", zIndex: 201,
        boxShadow: "-4px 0 20px rgba(0,0,0,0.12)",
        transition: "right 0.25s ease",
        direction: "rtl", display: "flex", flexDirection: "column",
      }}>
        {/* drawer header */}
        <div style={{
          padding: "20px 16px 16px",
          borderBottom: "0.5px solid #eee",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 46, height: 46, borderRadius: "50%", overflow: "hidden",
            border: `2px solid ${PINK_LIGHT}`, background: "#f8d0e0",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            {avatarSrc
              ? <img src={avatarSrc} alt="פרופיל" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontSize: 22 }}>👤</span>
            }
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#222" }}>{displayName}</p>
            <p style={{ margin: 0, fontSize: 12, color: "#999" }}>{displayEmail}</p>
          </div>
          <button onClick={() => setOpen(false)} style={{
            marginRight: "auto", background: "none", border: "none",
            fontSize: 20, cursor: "pointer", color: "#aaa", lineHeight: 1,
          }}>✕</button>
        </div>

        {/* menu items */}
        <div style={{ flex: 1, padding: "8px 0" }}>
          {MENU_ITEMS.filter(item => !item.authOnly || IS_LOGGED_IN).map(({ icon, label, danger }) => (
            <button
              key={label}
              onClick={() => {
                setOpen(false);
                if (label === "מועדפים" && onNavigate) onNavigate(1);
              }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 14,
                padding: "14px 20px", background: "none", border: "none",
                cursor: "pointer", fontSize: 15,
                color: danger ? "#E53935" : "#333",
                borderBottom: "0.5px solid #f5f5f5",
                textAlign: "right",
              }}
            >
              <span style={{ fontSize: 18 }}>{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>
      )}
    </>
  );
}

// ─── 2. HeroSection ──────────────────────────────────────────────────────────
