import React, {useEffect, useState} from 'react';
import { PINK, PINK_LIGHT } from '../../constants';
import { useLang } from '../../context/LangContext';
import { useResponsive } from '../../hooks/useResponsive';
import { VendorCard } from '../../components/VendorCard/VendorCard';
import { SAMPLE_VENDORS, userToVendorCard } from '../../data/vendors';
import './HomeScreen.css';

export function HeroSection({ searchQuery, onSearchChange }) {
  const { t } = useLang();
  return (
    <section style={{ padding: "24px 20px 14px", direction: t.dir, background: "#fff" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#222", margin: "0 0 16px", lineHeight: 1.4 }}>
        {t.heroTitle}
      </h1>
      <div style={{
        display: "flex", alignItems: "center", background: "#F8F8F8",
        border: "0.5px solid #ddd", borderRadius: 24, padding: "10px 14px", gap: 8,
      }}>
        <span style={{ fontSize: 18, color: "#999" }}>🔍</span>
        <input
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={t.heroSearch}
          style={{ border: "none", background: "transparent", outline: "none", fontSize: 14, color: "#555", flex: 1, direction: t.dir }}
        />
        {searchQuery && (
          <button onClick={() => onSearchChange("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", fontSize: 16, lineHeight: 1, padding: 0 }}>✕</button>
        )}
      </div>
    </section>
  );
}

// ─── 3. CategoryBar ──────────────────────────────────────────────────────────

export function CategoryBar({ activeCategory, onCategoryChange }) {
  const { t } = useLang();
  const CATEGORIES = [
    { icon: "🍽️", label: t.catCatering },
    { icon: "🎵", label: t.catMusic },
    { icon: "🎧", label: t.catDJ },
    { icon: "📸", label: t.catPhoto },
    { icon: "💐", label: t.catFlowers },
    { icon: "👗", label: t.catDress },
  ];
  return (
    <section style={{ padding: "12px 16px", direction: t.dir }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#222" }}>{t.catTitle}</span>
        {activeCategory
          ? <span onClick={() => onCategoryChange(null)} style={{ fontSize: 13, color: PINK, cursor: "pointer" }}>{t.catClear}</span>
          : <span style={{ fontSize: 13, color: PINK, cursor: "pointer" }}>{t.catShowAll}</span>
        }
      </div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
        {CATEGORIES.map(({ icon, label }) => (
          <button
            key={label}
            onClick={() => onCategoryChange(activeCategory === label ? null : label)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              minWidth: 60,
              background: activeCategory === label ? PINK_LIGHT : "#F5F5F5",
              border: activeCategory === label ? `1.5px solid ${PINK}` : "0.5px solid #eee",
              borderRadius: 16, padding: "10px 8px", cursor: "pointer", transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 22 }}>{icon}</span>
            <span style={{ fontSize: 11, color: activeCategory === label ? PINK : "#555", fontWeight: activeCategory === label ? 600 : 400 }}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

// ─── 4. PromoBanner ──────────────────────────────────────────────────────────

export function PromoBanner({ onNavigateToProfile }) {
  const { t } = useLang();
  return (
    <section style={{
      margin: "12px 16px",
      background: `linear-gradient(135deg, #6a0035 0%, #880E4F 50%, ${PINK} 100%)`,
      borderRadius: 20, padding: "24px 22px", color: "#fff",
      direction: t.dir, position: "relative", overflow: "hidden",
      boxShadow: "0 8px 24px rgba(194,24,91,0.3)",
    }}>
      <div style={{ position: "absolute", top: -20, left: -20, width: 120, height: 120, background: "rgba(255,255,255,0.06)", borderRadius: "50%" }} />
      <h2 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 8px" }}>{t.promoTitle}</h2>
      <p style={{ fontSize: 13, opacity: 0.88, margin: "0 0 14px", lineHeight: 1.5 }}>{t.promoText}</p>
      <button onClick={onNavigateToProfile} style={{ background: "#fff", color: PINK, border: "none", borderRadius: 24, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
        {t.promoCTA}
      </button>
    </section>
  );
}

// ─── 5. VendorCard ────────────────────────────────────────────────────────────

export function VendorList({ onViewVendor, activeCategory, searchQuery, favorites, onToggleFavorite }) {
  const { isDesktop } = useResponsive();
  const { t } = useLang();

  const [vendorRefresh, setVendorRefresh] = useState(0);

  // Refresh vendor list when a vendor updates their profile/images
  useEffect(() => {
    const handler = () => setVendorRefresh(n => n + 1);
    window.addEventListener("aros_vendor_updated", handler);
    return () => window.removeEventListener("aros_vendor_updated", handler);
  }, []);

  // Merge static vendors + registered vendors from localStorage
  const allVendors = React.useMemo(() => {
    try {
      const users = JSON.parse(localStorage.getItem("aros_users") || "[]");
      const registeredVendors = users
        .filter(u => u.isVendor && u.businessName)
        .map(userToVendorCard);
      return [...SAMPLE_VENDORS, ...registeredVendors];
    } catch {
      return SAMPLE_VENDORS;
    }
  }, [vendorRefresh]);

  // Map translated category label → data category value
  const CATEGORY_MAP = {
    [t.catCatering]: "קייטרינג", [t.catMusic]: "מוזיקה", [t.catDJ]: "DJ",
    [t.catPhoto]: "צילום", [t.catFlowers]: "פרחים", [t.catDress]: "שמלה",
    // Hebrew fallbacks
    "קייטרינג": "קייטרינג", "מוזיקה": "מוזיקה", "DJ": "DJ",
    "צילום": "צילום", "פרחים": "פרחים", "שמלה": "שמלה",
    // Vendor category names (may differ slightly)
    "שמלות כלה": "שמלה", "הגברה": "מוזיקה", "עיצוב": "פרחים",
  };

  const q = (searchQuery || "").trim().toLowerCase();

  const filtered = allVendors.filter(v => {
    const vendorCat = CATEGORY_MAP[v.category] || v.category;
    const activeCat = activeCategory ? (CATEGORY_MAP[activeCategory] || activeCategory) : null;
    const catMatch = !activeCat || vendorCat === activeCat || v.category === activeCat;
    const searchMatch = !q || [v.title, v.category, v.location, v.subtitle, v.email, ...(v.tags || [])]
      .some(field => field && field.toLowerCase().includes(q));
    return catMatch && searchMatch;
  });

  const heading = searchQuery
    ? t.vendorsSearch(searchQuery)
    : activeCategory ? t.vendorsCat(activeCategory) : t.vendorsRecommended;

  return (
    <section style={{ padding: "8px 16px", direction: t.dir }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#222" }}>{heading}</span>
        {!searchQuery && <span style={{ fontSize: 13, color: PINK, cursor: "pointer" }}>{t.vendorsAll}</span>}
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#bbb" }}>
          <p style={{ fontSize: 36 }}>🔍</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#888" }}>{t.vendorsNotFound}</p>
          <p style={{ fontSize: 13 }}>{t.vendorsNotFoundSub}</p>
        </div>
      ) : (
        <div className="vendor-grid" style={{ display:"block" }}>
          {filtered.map((v) => (
            <VendorCard key={v.title} {...v}
              isFavorited={favorites && favorites.some(f => f.title === v.title)}
              onToggleFavorite={() => onToggleFavorite && onToggleFavorite(v)}
              onViewVendor={() => onViewVendor && onViewVendor(v)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── 7. BottomNav ─────────────────────────────────────────────────────────────
