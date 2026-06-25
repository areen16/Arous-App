import React, {useState, useEffect} from 'react';
import { PINK, PINK_LIGHT } from '../../constants';
import { useLang } from '../../context/LangContext';
import { useResponsive } from '../../hooks/useResponsive';
import './DealsScreen.css';

const DEALS_DATA = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=700&q=80",
    badge: "בלעדי לאפליקציה",
    discount: "20%",
    title: 'דילום חמים - גן האירועים "זוהר"',
    location: "ראשון לציון",
    category: "אולם שמחות",
    rating: "4.8",
    reviews: 120,
    originalPrice: "₪1,200",
    dealPrice: "₪960",
    description: "מתחם אירועים מפואר עם נוף פנורמי, תאורת נברשות ועיצוב יוקרתי לזוגות מפנקים.",
    expiry: "נותרו 3 ימים",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=700&q=80",
    badge: "מוגבל בזמן",
    discount: "30%",
    title: 'צילום זוגי - "רגעים נצחיים"',
    location: "תל אביב",
    category: "צילום",
    rating: "5.0",
    reviews: 88,
    originalPrice: "₪4,500",
    dealPrice: "₪3,150",
    description: "סטודיו מוביל לצילום חתונות וסשן זוגי — 6 שעות צילום + עריכה + אלבום דיגיטלי.",
    expiry: "נותרו 5 ימים",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1594938298603-b8968a9b2a48?w=700&q=80",
    badge: "בלעדי לאפליקציה",
    discount: "15%",
    title: 'שמלת כלה - סטודיו "לבן על לבן"',
    location: "הרצליה",
    category: "שמלות כלה",
    rating: "4.9",
    reviews: 204,
    originalPrice: "₪8,000",
    dealPrice: "₪6,800",
    description: "מעצבת שמלות כלה עם 15 שנות ניסיון — ייעוץ אישי, 3 מדידות כולל שינויים.",
    expiry: "נותרו 7 ימים",
  },
];

// ─── D1. DealsHeader ──────────────────────────────────────────────────────────

export function DealsHeader() {
  const { t } = useLang();
  return (
    <section style={{ padding: "20px 16px 16px", background: `linear-gradient(135deg, #880E4F 0%, #C2185B 100%)`, direction: t.dir, color: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>🏷️</span>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{t.dealsTitle}</h1>
      </div>
      <p style={{ fontSize: 13, opacity: 0.88, margin: "0 0 14px", lineHeight: 1.5 }}>{t.dealsSub}</p>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.18)", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600 }}>
        {t.dealsLocked}
      </div>
    </section>
  );
}

// ─── D2. DealCard ─────────────────────────────────────────────────────────────

export function DealCard({ deal, onViewDeal, isLoggedIn }) {
  const { t } = useLang();
  return (
    <article style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "0.5px solid #eee", marginBottom: 16, direction: t.dir, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
      <div style={{ position: "relative" }}>
        <img src={deal.image} alt={deal.title} style={{ width: "100%", height: 185, objectFit: "cover", display: "block" }} />
        <span style={{ position: "absolute", top: 10, right: 10, background: "#880E4F", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>{deal.badge}</span>
        <span style={{ position: "absolute", top: 10, left: 10, background: "#FFD700", color: "#7B5800", fontSize: 13, fontWeight: 800, padding: "4px 12px", borderRadius: 20 }}>-{deal.discount}</span>
        <span style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>⏳ {deal.expiry}</span>
        {!isLoggedIn && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ background: "rgba(0,0,0,0.65)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 20 }}>🔒 למשתמשים רשומים</span>
          </div>
        )}
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: "#888" }}>📍 {deal.location} · {deal.category}</span>
          <span style={{ fontSize: 12, color: "#555", fontWeight: 600 }}>⭐ {deal.rating} ({deal.reviews})</span>
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#222", margin: "0 0 6px" }}>{deal.title}</h3>
        <p style={{ fontSize: 13, color: "#888", margin: "0 0 12px", lineHeight: 1.5 }}>{deal.description}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#C2185B" }}>{isLoggedIn ? deal.dealPrice : "****"}</span>
          <span style={{ fontSize: 13, color: "#bbb", textDecoration: "line-through" }}>{deal.originalPrice}</span>
          <span style={{ background: "#FCE4EC", color: "#C2185B", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, marginRight: "auto" }}>{t.dealsSaving(deal.discount)}</span>
        </div>
        <button onClick={() => onViewDeal && onViewDeal(deal)} style={{
          width: "100%", border: "none", borderRadius: 24, padding: "12px 0",
          fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: 0.3,
          background: isLoggedIn ? "#C2185B" : "#888",
          color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          {isLoggedIn ? t.dealsMoreInfo : "🔒 התחבר לצפייה בפרטים"}
        </button>
      </div>
    </article>
  );
}

// ─── D3. DealsFilter ─────────────────────────────────────────────────────────

export function DealsFilter({ areaSearch, selectedCategory, onAreaSearch, onCategoryChange }) {
  const { t } = useLang();
  const categories = [t.favFilterAll, "אולם שמחות", "צילום", "שמלות כלה", "קייטרינג", "DJ", "פרחים"];
  const chipStyle = (active) => ({
    whiteSpace: "nowrap", padding: "6px 14px", borderRadius: 20,
    border: active ? "none" : "1px solid #ddd",
    background: active ? PINK : "#fff", color: active ? "#fff" : "#555",
    fontSize: 12, fontWeight: active ? 700 : 400, cursor: "pointer", transition: "all 0.15s", flexShrink: 0,
  });
  return (
    <section style={{ padding: "14px 16px 8px", direction: t.dir, background: "#fff", borderBottom: "0.5px solid #eee" }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: "#555", margin: "0 0 8px" }}>{t.dealsAreaSearch}</p>
      <div style={{ display: "flex", alignItems: "center", background: "#F5F5F5", border: "1px solid #eee", borderRadius: 24, padding: "9px 14px", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 16, color: "#aaa" }}>📍</span>
        <input value={areaSearch} onChange={e => onAreaSearch(e.target.value)} placeholder={t.dealsAreaPlaceholder}
          style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#333", direction: t.dir }} />
        {areaSearch && <button onClick={() => onAreaSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", fontSize: 16, lineHeight: 1 }}>✕</button>}
      </div>
      <p style={{ fontSize: 12, fontWeight: 700, color: "#555", margin: "0 0 8px" }}>{t.dealsCategoryLabel}</p>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10, scrollbarWidth: "none" }}>
        {categories.map(c => (
          <button key={c} onClick={() => onCategoryChange(c)} style={chipStyle(selectedCategory === c)}>{c}</button>
        ))}
      </div>
    </section>
  );
}

// ─── D4. DealsList ────────────────────────────────────────────────────────────

export function DealsList({ onViewDeal, isLoggedIn }) {
  const [selectedCategory, setSelectedCategory] = useState("הכל");
  const [areaSearch, setAreaSearch] = useState("");
  const { isDesktop } = useResponsive();
  const { t } = useLang();

  // Merge static deals with vendor-created deals from localStorage
  const [allDeals, setAllDeals] = useState(() => {
    const vendorDeals = JSON.parse(localStorage.getItem("aros_vendor_deals") || "[]")
      .filter(d => {
        if (!d.expiryDate) return true;
        return new Date(d.expiryDate) > new Date();
      });
    return [...DEALS_DATA, ...vendorDeals];
  });

  // Refresh when storage changes (vendor adds a deal in same session)
  useEffect(() => {
    const refresh = () => {
      const vendorDeals = JSON.parse(localStorage.getItem("aros_vendor_deals") || "[]")
        .filter(d => !d.expiryDate || new Date(d.expiryDate) > new Date());
      setAllDeals([...DEALS_DATA, ...vendorDeals]);
    };
    window.addEventListener("aros_deals_updated", refresh);
    return () => window.removeEventListener("aros_deals_updated", refresh);
  }, []);

  const filtered = allDeals.filter(d => {
    const catMatch = selectedCategory === "הכל" || selectedCategory === t.favFilterAll || d.category === selectedCategory;
    const areaMatch = !areaSearch.trim() || (d.location || "").includes(areaSearch.trim());
    return catMatch && areaMatch;
  });

  return (
    <>
      <DealsFilter areaSearch={areaSearch} selectedCategory={selectedCategory} onAreaSearch={setAreaSearch} onCategoryChange={setSelectedCategory} />
      <section style={{ padding: "12px 16px", direction: t.dir }}>
        <p style={{ fontSize: 13, color: "#aaa", margin: "0 0 14px" }}>{t.dealsActive(filtered.length)}</p>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#bbb" }}>
            <p style={{ fontSize: 36 }}>🏷️</p>
            <p style={{ fontSize: 15, fontWeight: 600 }}>{t.dealsEmpty}</p>
            <p style={{ fontSize: 13 }}>{t.dealsEmptySub}</p>
          </div>
        ) : (
          <div style={{ display: isDesktop ? "grid" : "block", gridTemplateColumns: isDesktop ? "1fr 1fr 1fr" : undefined, gap: isDesktop ? 16 : undefined }}>
            {filtered.map((deal) => <DealCard key={deal.id} deal={deal} onViewDeal={onViewDeal} isLoggedIn={isLoggedIn} />)}
          </div>
        )}
      </section>
    </>
  );
}

// ─── D5. DealProfileScreen ────────────────────────────────────────────────────

export function DealProfileScreen({ deal, onBack, isLoggedIn, onNavigateToAuth }) {
  const { t } = useLang();
  const vendorPhone = deal.phone || null;
  const vendorWaPhone = vendorPhone ? vendorPhone.replace(/^0/, "972") : null;
  const waMsg = vendorPhone
    ? encodeURIComponent(`שלום! ראיתי את המבצע "${deal.title}" באפליקציה ואני מעוניינ/ת לפרטים נוספים.`)
    : null;

  // Compute days remaining from expiryDate or fallback to expiry string
  const daysRemaining = React.useMemo(() => {
    if (deal.expiryDate) {
      const diff = new Date(deal.expiryDate) - new Date();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
    }
    return null;
  }, [deal.expiryDate]);

  // Format expiry date nicely
  const expiryFormatted = deal.expiryDate
    ? new Date(deal.expiryDate).toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" })
    : deal.expiry || null;

  const sectionStyle = {
    background: "#fff", margin: "10px 0", padding: "18px 16px",
    borderBottom: "0.5px solid #eee",
  };

  return (
    <div style={{ direction: t.dir, background: "#FAFAFA", minHeight: "100vh", paddingBottom: 40 }}>

      {/* ── Hero image ── */}
      <div style={{ position: "relative" }}>
        <img src={deal.image} alt={deal.title}
          style={{ width: "100%", height: 230, objectFit: "cover", display: "block" }} />
        <button onClick={onBack} style={{
          position: "absolute", top: 14, right: 14,
          background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%",
          width: 36, height: 36, cursor: "pointer", fontSize: 18,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}>←</button>
        {deal.discount && (
          <span style={{ position: "absolute", top: 14, left: 14, background: "#FFD700", color: "#7B5800", fontSize: 15, fontWeight: 800, padding: "5px 14px", borderRadius: 20 }}>
            -{deal.discount}
          </span>
        )}
        {daysRemaining !== null && (
          <span style={{ position: "absolute", bottom: 14, left: 14, background: daysRemaining <= 3 ? "#E53935" : "rgba(0,0,0,0.65)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
            ⏳ {daysRemaining === 0 ? "מסתיים היום!" : `נותרו ${daysRemaining} ימים`}
          </span>
        )}
        {!daysRemaining && deal.expiry && (
          <span style={{ position: "absolute", bottom: 14, left: 14, background: "rgba(0,0,0,0.65)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
            ⏳ {deal.expiry}
          </span>
        )}
      </div>

      {/* ── Title & info ── */}
      <div style={sectionStyle}>
        {deal.badge && (
          <span style={{ display: "inline-block", background: "#880E4F", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 12, marginBottom: 10 }}>
            {deal.badge}
          </span>
        )}
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#222", margin: "0 0 10px" }}>{deal.title}</h1>

        {/* Meta row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 14 }}>
          {deal.location && <span style={{ fontSize: 13, color: "#888" }}>📍 {deal.location}</span>}
          {deal.category && (
            <span style={{ background: PINK_LIGHT, color: PINK, fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 12 }}>{deal.category}</span>
          )}
          {deal.rating && deal.rating !== "—" && (
            <span style={{ fontSize: 13, color: "#555", fontWeight: 600 }}>⭐ {deal.rating}{deal.reviews ? ` (${deal.reviews} ביקורות)` : ""}</span>
          )}
        </div>

        {/* Description */}
        {deal.description && (
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, margin: 0 }}>{deal.description}</p>
        )}
      </div>

      {/* ── Expiry ── */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#222", marginBottom: 14 }}>📅 תוקף המבצע</h2>
        <div style={{
          background: daysRemaining !== null && daysRemaining <= 7 ? "#FFF3F3" : "#F0FDF4",
          border: `1px solid ${daysRemaining !== null && daysRemaining <= 7 ? "#FFCDD2" : "#BBF7D0"}`,
          borderRadius: 12, padding: "14px 16px",
        }}>
          {expiryFormatted && (
            <p style={{ fontSize: 15, fontWeight: 700, color: "#222", margin: "0 0 4px" }}>
              🗓️ המבצע מסתיים: {expiryFormatted}
            </p>
          )}
          {daysRemaining !== null && (
            <p style={{ fontSize: 13, color: daysRemaining <= 3 ? "#E53935" : "#16A34A", fontWeight: 600, margin: 0 }}>
              {daysRemaining === 0
                ? "⚠️ המבצע מסתיים היום — מהרי להירשם!"
                : daysRemaining <= 3
                  ? `⚠️ נותרו ${daysRemaining} ימים בלבד!`
                  : `✅ נותרו ${daysRemaining} ימים להזמנה במחיר המבצע`}
            </p>
          )}
        </div>
      </div>

      {/* ── Price ── */}
      {(deal.dealPrice || deal.originalPrice) && (
        <div style={sectionStyle}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#222", marginBottom: 14 }}>💰 פרטי המחיר</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
            {deal.dealPrice && <span style={{ fontSize: 32, fontWeight: 800, color: PINK }}>{deal.dealPrice}</span>}
            {deal.originalPrice && (
              <div>
                <p style={{ fontSize: 13, color: "#bbb", textDecoration: "line-through", margin: "0 0 2px" }}>{deal.originalPrice}</p>
                {deal.discount && (
                  <span style={{ background: PINK_LIGHT, color: PINK, fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 10 }}>
                    {t.dealsSaving(deal.discount)}
                  </span>
                )}
              </div>
            )}
          </div>
          {expiryFormatted && (
            <p style={{ fontSize: 12, color: "#bbb", margin: 0 }}>* המחיר תקף בלעדית לאפליקציה עד {expiryFormatted}</p>
          )}
        </div>
      )}

      {/* ── What's included ── */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#222", marginBottom: 12 }}>✅ מה כלול בעסקה</h2>
        {(deal.includes || [
          "שירות מלא כמפורט בתיאור",
          "ליווי אישי לאורך כל התהליך",
          "ביטול עד 14 יום ללא עלות",
          "תיאום ישיר עם הספק",
        ]).map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
            <span style={{ color: "#22C55E", fontSize: 15, marginTop: 1 }}>✓</span>
            <span style={{ fontSize: 14, color: "#444" }}>{item}</span>
          </div>
        ))}
      </div>

      {/* ── Contact ── */}
      <div style={{ margin: "10px 16px 20px" }}>
        {isLoggedIn ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#555", margin: "0 0 4px", textAlign: "center" }}>
              📞 מעוניינ/ת במבצע? צרי קשר עכשיו
            </p>
            <a href={`tel:${vendorPhone || "0500000000"}`} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: PINK, color: "#fff", borderRadius: 16,
              padding: "15px 0", fontSize: 15, fontWeight: 700, textDecoration: "none",
              boxShadow: "0 4px 14px rgba(194,24,91,0.35)",
            }}>
              <span style={{ fontSize: 20 }}>📞</span> התקשרי — {vendorPhone || "050-000-0000"}
            </a>
            <button onClick={() => window.open(`https://wa.me/${vendorWaPhone || "972500000000"}?text=${waMsg}`, "_blank")}
              style={{ background: "#25D366", color: "#fff", border: "none", borderRadius: 16, padding: "15px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 14px rgba(37,211,102,0.35)" }}>
              <span style={{ fontSize: 20 }}>💬</span> שלחי הודעה בוואטסאפ
            </button>
          </div>
        ) : (
          <div style={{
            background: "linear-gradient(135deg, #fff8fa 0%, #fff 100%)",
            border: `1.5px solid ${PINK_LIGHT}`,
            borderRadius: 20, padding: "28px 20px",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(194,24,91,0.08)",
          }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🔒</div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#222", margin: "0 0 8px" }}>
              פרטי יצירת קשר זמינים למשתמשים רשומים
            </h3>
            <p style={{ fontSize: 13, color: "#888", margin: "0 0 20px", lineHeight: 1.6 }}>
              הצטרפי לערוס חינם וקבלי גישה לכל המבצעים הבלעדיים ופרטי הספקים
            </p>
            <button
              onClick={() => onNavigateToAuth && onNavigateToAuth()}
              style={{
                width: "100%", background: PINK, color: "#fff",
                border: "none", borderRadius: 16, padding: "14px 0",
                fontSize: 15, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 4px 14px rgba(194,24,91,0.35)",
              }}
            >
              התחברות / הרשמה חינם
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

// ─── D6. DealsScreen (מסך מלא) ───────────────────────────────────────────────

export function DealsScreen({ onViewDeal, isLoggedIn, onNavigateToAuth }) {
  return (
    <>
      <DealsHeader />
      <DealsList onViewDeal={onViewDeal} isLoggedIn={isLoggedIn} />
    </>
  );
}
