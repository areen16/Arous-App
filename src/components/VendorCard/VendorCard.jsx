import { PINK, PINK_LIGHT } from '../../constants';
import { useLang } from '../../context/LangContext';
import './VendorCard.css';

export function VendorCard({ image, badge, rating, title, subtitle, location, category, tags = [], priceRange, onViewVendor, isFavorited, onToggleFavorite }) {
  const { t } = useLang();
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
          style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
        />
        {/* badge (TOP RATED / HOT / etc.) + rating — both top-left */}
        <div style={{
          position: "absolute", top: 10, left: 10,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          {badge && (
            <span style={{
              background: badge === "ספק מאומת" ? "#22C55E" : "#FFD700",
              color: badge === "ספק מאומת" ? "#fff" : "#7B5800",
              fontSize: 11, fontWeight: 700,
              padding: "3px 10px", borderRadius: 12,
            }}>{badge === "ספק מאומת" ? "✓ " + badge : badge}</span>
          )}
          {rating && (
            <span style={{
              background: "rgba(0,0,0,0.55)", color: "#fff",
              fontSize: 12, fontWeight: 600,
              padding: "3px 8px", borderRadius: 12,
            }}>⭐ {rating}</span>
          )}
        </div>
        <button
          onClick={onToggleFavorite}
          style={{
            position: "absolute", bottom: 10, left: 10,
            background: "rgba(255,255,255,0.9)",
            border: "none", borderRadius: "50%",
            width: 36, height: 36, cursor: "pointer",
            fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.15s",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
          aria-label={isFavorited ? t.vendorRemove : t.vendorSave}
        >
          {isFavorited ? "⭐" : "☆"}
        </button>
      </div>
      <div style={{ padding: "12px 14px" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#222", margin: "0 0 6px" }}>{title}</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10, alignItems: "center" }}>
          {location && <span style={{ fontSize: 12, color: "#888" }}>📍 {location}</span>}
          {category && <span style={{ background: PINK_LIGHT, color: PINK, fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 12 }}>{category}</span>}
          {priceRange && <span style={{ fontSize: 12, color: "#555", fontWeight: 600 }}>💰 {priceRange}</span>}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onViewVendor} style={{ background: PINK, color: "#fff", border: "none", borderRadius: 20, padding: "7px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {t.vendorDetails}
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── 6. VendorList ────────────────────────────────────────────────────────────
