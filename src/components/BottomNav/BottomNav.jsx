import { PINK, PINK_LIGHT } from '../../constants';
import { useLang } from '../../context/LangContext';
import { useResponsive } from '../../hooks/useResponsive';
import './BottomNav.css';

export function BottomNav({ active, onNavigate }) {
  const { isMobile, isTablet } = useResponsive();
  const { t } = useLang();
  const isMobileOrTablet = isMobile || isTablet;

  const NAV_ITEMS = [
    { icon: "🏠", label: t.navHome },
    { icon: "⭐", label: t.navFavorites },
    { icon: "🏷️", label: t.navDeals },
    { icon: "👤", label: t.navProfile },
  ];

  if (isMobileOrTablet) {
    return (
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid #f0e0e8",
        display: "flex", justifyContent: "space-around",
        padding: "8px 0 max(14px,env(safe-area-inset-bottom))",
        direction: "rtl", zIndex: 200,
        boxShadow: "0 -4px 24px rgba(194,24,91,0.08)",
      }}>
        {NAV_ITEMS.map(({ icon, label }, i) => (
          <button
            key={label}
            onClick={() => onNavigate(i)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              background: "none", border: "none", padding: "4px 0", flex: 1,
            }}
            aria-label={label}
          >
            <div style={{
              width: 44, height: 30, borderRadius: 15,
              background: active === i ? PINK_LIGHT : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s",
            }}>
              <span style={{ fontSize: active === i ? 22 : 20 }}>{icon}</span>
            </div>
            <span style={{
              fontSize: 10, fontWeight: active === i ? 700 : 400,
              color: active === i ? PINK : "#aaa",
            }}>{label}</span>
          </button>
        ))}
      </nav>
    );
  }

  // Desktop: side navigation
  return (
    <nav style={{
      position: "fixed", top: 0, right: 0,
      width: 220, height: "100vh",
      background: "linear-gradient(180deg,#fff 0%,#fff8fa 100%)",
      borderLeft: "1px solid #f0e0e8",
      display: "flex", flexDirection: "column",
      direction: "rtl", zIndex: 200,
      boxShadow: "-4px 0 24px rgba(194,24,91,0.07)",
    }}>
      <div style={{ padding: "24px 20px 18px", borderBottom: "1px solid #f0e0e8" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
          <span style={{ fontSize:26 }}>💍</span>
          <span style={{ fontSize:22, fontWeight:900, color:PINK }}>{t.appName}</span>
        </div>
        <p style={{ fontSize:11, color:"#bbb", margin:0, paddingRight:34 }}>{t.appTagline}</p>
      </div>
      <div style={{ flex:1, padding:"10px 0", overflowY:"auto" }}>
        {NAV_ITEMS.map(({ icon, label }, i) => (
          <button
            key={label}
            onClick={() => onNavigate(i)}
            style={{
              width:"100%", display:"flex", alignItems:"center", gap:12,
              padding:"11px 16px 11px 20px",
              background: active === i ? PINK_LIGHT : "none",
              border:"none",
              borderRight: active === i ? `4px solid ${PINK}` : "4px solid transparent",
              direction:"rtl", textAlign:"right",
              transition:"background 0.15s",
            }}
            aria-label={label}
          >
            <div style={{
              width:36, height:36, borderRadius:12,
              background: active === i ? PINK : "#f5f5f5",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:18, flexShrink:0,
              boxShadow: active === i ? "0 4px 12px rgba(194,24,91,0.3)" : "none",
              transition:"all 0.2s",
            }}>{icon}</div>
            <span style={{
              fontSize:14, fontWeight: active === i ? 700 : 500,
              color: active === i ? PINK : "#444",
            }}>{label}</span>
          </button>
        ))}
      </div>
      <div style={{ padding:"14px 20px", borderTop:"1px solid #f0e0e8" }}>
        <p style={{ fontSize:10, color:"#ccc", margin:0, textAlign:"center" }}>© 2025 ערוס</p>
      </div>
    </nav>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
// ─── Router utils ─────────────────────────────────────────────────────────────
