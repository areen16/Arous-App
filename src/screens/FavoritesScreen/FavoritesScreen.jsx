import { PINK, PINK_LIGHT } from '../../constants';
import { useLang } from '../../context/LangContext';
import { useResponsive } from '../../hooks/useResponsive';
import './FavoritesScreen.css';

export function FavoritesHeader({ activeFilter, onFilterChange, favorites = [] }) {
  const { t } = useLang();
  const categorySet = new Set(favorites.map(v => v.category).filter(Boolean));
  const filters = [t.favFilterAll, ...Array.from(categorySet)];
  return (
    <section style={{ padding: "20px 16px 12px", direction: t.dir, background: "#fff" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#222", margin: "0 0 6px" }}>{t.favTitle}</h1>
      <p style={{ fontSize: 13, color: "#999", margin: "0 0 16px", lineHeight: 1.5 }}>{t.favSubtitle}</p>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {filters.map((f) => (
          <button key={f} onClick={() => onFilterChange(f)} style={{
            whiteSpace: "nowrap", padding: "6px 16px", borderRadius: 20,
            border: activeFilter === f ? "none" : "1px solid #ddd",
            background: activeFilter === f ? PINK : "#fff",
            color: activeFilter === f ? "#fff" : "#555",
            fontSize: 13, fontWeight: activeFilter === f ? 700 : 400, cursor: "pointer", transition: "all 0.15s",
          }}>{f}</button>
        ))}
      </div>
    </section>
  );
}

// ─── F2. FavoriteVendorCard ───────────────────────────────────────────────────
// כרטיס ספק במועדפים: תמונה רחבה + תג מבצע + כוכב מועדף + שם + תיאור + כפתור "לפרטים"

export function FavoriteVendorCard({ image, badge, badgeColor = "#E91E8C", title, description, location, category, priceRange, ctaLabel = "לפרטים ›", onRemove, onViewProfile }) {
  return (
    <article className="card-hover" style={{
      background: "#fff",
      borderRadius: 20,
      overflow: "hidden",
      border: "1px solid #f0e8ec",
      marginBottom: 16,
      direction: "rtl",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    }}>
      <div style={{ position: "relative" }}>
        <img
          src={image}
          alt={title}
          style={{ width: "100%", height: 190, objectFit: "cover", display: "block" }}
        />
        {badge && (
          <span style={{
            position: "absolute", bottom: 10, right: 10,
            background: badgeColor, color: "#fff",
            fontSize: 12, fontWeight: 700,
            padding: "4px 12px", borderRadius: 20,
          }}>{badge}</span>
        )}
        <button
          onClick={onRemove}
          style={{
            position: "absolute", top: 10, right: 10,
            background: "rgba(255,255,255,0.88)",
            border: "none", borderRadius: "50%",
            width: 34, height: 34, cursor: "pointer",
            fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center",
          }}
          aria-label="הסר ממועדפים"
        >⭐</button>
      </div>

      <div style={{ padding: "14px 16px 16px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#222", margin: "0 0 8px" }}>{title}</h3>

        {/* info row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10, alignItems: "center" }}>
          {location && <span style={{ fontSize: 12, color: "#888" }}>📍 {location}</span>}
          {category && (
            <span style={{
              background: PINK_LIGHT, color: PINK,
              fontSize: 11, fontWeight: 600,
              padding: "2px 10px", borderRadius: 12,
            }}>{category}</span>
          )}
          {priceRange && <span style={{ fontSize: 12, color: "#555", fontWeight: 600 }}>💰 {priceRange}</span>}
        </div>

        {description && (
          <p style={{ fontSize: 13, color: "#888", margin: "0 0 14px", lineHeight: 1.5 }}>{description}</p>
        )}
        <button
          onClick={onViewProfile}
          style={{
            width: "100%", background: PINK, color: "#fff",
            border: "none", borderRadius: 24, padding: "11px 0",
            fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5,
          }}>
          {ctaLabel}
        </button>
      </div>
    </article>
  );
}

// ─── F3. FavoriteVendorList ───────────────────────────────────────────────────
// מכיל את רשימת FavoriteVendorCard + ספירת תוצאות

const FAVORITE_VENDORS = [
  {
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=700&q=80",
    badge: "מבצע 20%",
    badgeColor: "#E91E8C",
    title: 'אירות חדיות - גן האירועים',
    location: "קיסריה",
    category: "אולם שמחות",
    priceRange: "₪800–₪1,200 לאורח",
    description: "מתחם אירועים יוקרתי עם נוף פנורמי וחוויה שלא תישכח לאורחיכם",
  },
  {
    image: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=700&q=80",
    badge: "חסכון ₪3,000",
    badgeColor: "#FF6F00",
    title: 'קייטרינג "שמחים"',
    location: "תל אביב",
    category: "קייטרינג",
    priceRange: "₪180–₪280 לאורח",
    description: "תפריט עשיר ומגוון, שירות מקצועי, עד 500 אורחים — כולל צוות הגשה",
  },
  {
    image: "https://images.unsplash.com/photo-1594938298603-b8968a9b2a48?w=700&q=80",
    badge: "מבצע 15%",
    badgeColor: "#E91E8C",
    title: 'סטודיו "שלום שלום"',
    location: "הרצליה",
    category: "שמלות כלה",
    priceRange: "₪6,000–₪12,000",
    description: "מעצבת שמלות כלה מובילה 2024 — ייעוץ אישי, התאמה מושלמת לגוף",
  },
];

export function FavoriteVendorList({ onViewVendor, favorites = [], onRemoveFavorite, activeFilter }) {
  const { isDesktop } = useResponsive();
  const { t } = useLang();
  const filterAll = t.favFilterAll;
  const currentFilter = activeFilter || filterAll;

  const filtered = currentFilter === filterAll
    ? favorites
    : favorites.filter(v => v.category === currentFilter);

  if (favorites.length === 0) {
    return (
      <div style={{ padding: "60px 16px", textAlign: "center", direction: t.dir }}>
        <p style={{ fontSize: 40 }}>⭐</p>
        <p style={{ fontSize: 16, fontWeight: 700, color: "#555" }}>{t.favEmpty}</p>
        <p style={{ fontSize: 13, color: "#aaa" }}>{t.favEmptySub}</p>
      </div>
    );
  }
  if (filtered.length === 0) {
    return (
      <div style={{ padding: "40px 16px", textAlign: "center", direction: t.dir }}>
        <p style={{ fontSize: 36 }}>🔍</p>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#888" }}>{t.favEmptyCat}</p>
        <p style={{ fontSize: 13, color: "#aaa" }}>{t.favEmptyCatSub}</p>
      </div>
    );
  }
  return (
    <section style={{ padding: "8px 16px", direction: t.dir }}>
      <p style={{ fontSize: 13, color: "#aaa", margin: "0 0 14px" }}>{t.favCount(filtered.length)}</p>
      <div className="fav-grid" style={{ display:"block" }}>
        {filtered.map((v) => (
          <FavoriteVendorCard key={v.title} {...v}
            onRemove={() => onRemoveFavorite && onRemoveFavorite(v.title)}
            onViewProfile={() => onViewVendor && onViewVendor(v)}
          />
        ))}
      </div>
    </section>
  );
}
