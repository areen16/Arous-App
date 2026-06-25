import React, { useState, useEffect } from 'react';
import { PINK, PINK_LIGHT } from '../../constants';
import { useLang } from '../../context/LangContext';
import { useResponsive } from '../../hooks/useResponsive';
import './VendorProfileScreen.css';

const PROFILE_GALLERY = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80",
  "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400&q=80",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80",
];

// ─── VP1. VendorProfileHero ───────────────────────────────────────────────────
// תמונת כותרת + כפתור חזור

export function VendorProfileHero({ image, title, onBack }) {
  return (
    <div style={{ position: "relative" }}>
      <img
        src={image || PROFILE_GALLERY[0]}
        alt={title}
        style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
      />
      <button
        onClick={onBack}
        style={{
          position: "absolute", top: 14, right: 14,
          background: "rgba(255,255,255,0.9)",
          border: "none", borderRadius: "50%",
          width: 36, height: 36, cursor: "pointer",
          fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
        aria-label="חזור"
      >›</button>
    </div>
  );
}

// ─── VP2. VendorProfileInfo ───────────────────────────────────────────────────
// שם + עיר + קטגוריה + תג מבצע (ללא כפתורי פעולה — אלו עברו מתחת ללוח)

export function VendorProfileInfo({ vendor }) {
  return (
    <div style={{ background: "#fff", padding: "16px 16px 20px", borderBottom: "0.5px solid #eee" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#222", margin: "0 0 4px" }}>{vendor.title}</h1>
          <p style={{ fontSize: 13, color: "#888", margin: "0 0 8px" }}>{vendor.subtitle || vendor.description}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {vendor.location && (
              <span style={{ fontSize: 12, color: "#888" }}>📍 {vendor.location}</span>
            )}
            {(vendor.tags?.[0] || vendor.category) && (
              <span style={{
                background: PINK_LIGHT, color: PINK,
                fontSize: 11, fontWeight: 600,
                padding: "3px 10px", borderRadius: 12,
              }}>{vendor.tags?.[0] || vendor.category}</span>
            )}
            {vendor.priceRange && (
              <span style={{ fontSize: 12, color: "#555", fontWeight: 600 }}>💰 {vendor.priceRange}</span>
            )}
          </div>
        </div>
        {vendor.badge && (
          <span style={{
            background: vendor.badgeColor || PINK,
            color: "#fff", fontSize: 12, fontWeight: 700,
            padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap",
          }}>{vendor.badge}</span>
        )}
      </div>
    </div>
  );
}

export function VendorAvailabilityCalendar({ vendor, isLoggedIn }) {
  const { t } = useLang();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showContact, setShowContact] = useState(false);

  const BOOKED = [3, 8, 14, 21, 28];

  const monthName = t.months[viewMonth];
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const isPastDay = (d) => {
    const cellDate = new Date(viewYear, viewMonth, d);
    return cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDate(null);
  };

  const YEARS = Array.from({ length: 5 }, (_, i) => today.getFullYear() + i);
  const formattedDate = selectedDate ? `${selectedDate} ${monthName} ${viewYear}` : null;
  const vendorPhone = vendor?.phone || "0500000000";
  const vendorWaPhone = vendorPhone.replace(/^0/, "972");
  const waMessage = encodeURIComponent(t.waMessage(formattedDate));

  const trackContact = (type) => {
    if (!vendor?.email) return;
    const key = type === "call" ? `aros_calls_${vendor.email}` : `aros_wa_${vendor.email}`;
    localStorage.setItem(key, String(parseInt(localStorage.getItem(key) || "0") + 1));
  };

  // Pull fresh vendor data from localStorage (so edits show immediately)
  const liveVendor = React.useMemo(() => {
    if (!vendor?.email) return vendor;
    try {
      const users = JSON.parse(localStorage.getItem("aros_users") || "[]");
      const found = users.find(u => u.email === vendor.email);
      return found ? { ...vendor, ...found } : vendor;
    } catch { return vendor; }
  }, [vendor]);

  const website   = liveVendor?.website   || vendor?.website   || "";
  const instagram = liveVendor?.instagram || vendor?.instagram || "";
  const yearsActive = liveVendor?.yearsActive || vendor?.yearsActive || "";
  const description = liveVendor?.description || vendor?.description || "";

  const hasLinks = website || instagram;

  return (
    <div style={{ background: "#fff", margin: "10px 0", padding: "16px", direction: t.dir }}>

      {/* ── Links section: website + instagram ── */}
      {hasLinks && (
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 10,
          marginBottom: 16,
          padding: "12px 14px",
          background: "#fafafa",
          borderRadius: 14,
          border: "1px solid #f0e8ec",
        }}>
          {website && (
            <a
              href={website.startsWith("http") ? website : `https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                color: PINK, fontSize: 13, fontWeight: 600,
                textDecoration: "none",
                background: PINK_LIGHT, borderRadius: 20,
                padding: "6px 14px",
              }}
            >
              🌐 {website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </a>
          )}
          {instagram && (
            <a
              href={`https://instagram.com/${instagram.replace(/^@/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                color: "#fff", fontSize: 13, fontWeight: 600,
                textDecoration: "none",
                background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
                borderRadius: 20,
                padding: "6px 14px",
              }}
            >
              📸 {instagram.startsWith("@") ? instagram : `@${instagram}`}
            </a>
          )}
          {yearsActive && (
            <span style={{
              display: "flex", alignItems: "center", gap: 6,
              color: "#555", fontSize: 13,
              background: "#f0f0f0", borderRadius: 20,
              padding: "6px 14px",
            }}>
              ⭐ {yearsActive} שנות ניסיון
            </span>
          )}
        </div>
      )}

      {/* ── Description ── */}
      {description && (
        <p style={{
          fontSize: 13, color: "#666", lineHeight: 1.7,
          margin: "0 0 16px",
          padding: "10px 14px",
          background: "#fafafa", borderRadius: 12,
          border: "1px solid #f0f0f0",
        }}>
          {description}
        </p>
      )}

      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#222", margin: "0 0 12px" }}>{t.vpCalendar}</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
        <select value={viewYear} onChange={e => { setViewYear(Number(e.target.value)); setSelectedDate(null); }}
          style={{ border: "1px solid #eee", borderRadius: 10, padding: "6px 10px", fontSize: 13, color: "#333", background: "#fafafa", cursor: "pointer" }}>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={viewMonth} onChange={e => { setViewMonth(Number(e.target.value)); setSelectedDate(null); }}
          style={{ border: "1px solid #eee", borderRadius: 10, padding: "6px 10px", fontSize: 13, color: "#333", background: "#fafafa", cursor: "pointer", flex: 1 }}>
          {t.months.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>
        <button onClick={goToPrevMonth} style={{ background: "none", border: "1px solid #eee", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14 }}>‹</button>
        <button onClick={goToNextMonth} style={{ background: "none", border: "1px solid #eee", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14 }}>›</button>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 10, alignItems: "center" }}>
        {[[PINK,"#fff",t.vpBooked],["#FFF9C4","#ddd",t.vpFree],["#22C55E",null,t.vpSelected]].map(([bg,border,label]) => (
          <span key={label} style={{ fontSize: 11, color: "#888", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 10, background: bg, border: border ? `1px solid ${border}` : undefined, borderRadius: 3, display: "inline-block" }} /> {label}
          </span>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
        {t.days.map(d => <div key={d} style={{ textAlign: "center", fontSize: 11, color: "#bbb", fontWeight: 600 }}>{d}</div>)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {blanks.map(i => <div key={`b${i}`} />)}
        {days.map(d => {
          const past = isPastDay(d);
          const booked = BOOKED.includes(d);
          const available = !past && !booked;
          const selected = selectedDate === d;
          return (
            <button key={d} onClick={() => { if (!available) return; setSelectedDate(d); setShowContact(false); }}
              disabled={past || booked}
              style={{ height: 36, borderRadius: 8, border: selected ? "2px solid #16A34A" : "none",
                fontSize: 13, fontWeight: selected ? 700 : 400, cursor: available ? "pointer" : "default",
                background: past ? "#f5f5f5" : booked ? PINK : selected ? "#22C55E" : "#FFF9C4",
                color: past ? "#ccc" : booked ? "#fff" : selected ? "#fff" : "#7B6000",
                transition: "all 0.12s" }}
            >{d}</button>
          );
        })}
      </div>

      {!selectedDate && (
        <p style={{ marginTop: 10, fontSize: 12, color: "#bbb", textAlign: "center" }}>{t.vpChooseDate}</p>
      )}

      {selectedDate && (
        <div style={{ marginTop: 16 }}>
          {/* אישור תאריך */}
          <div style={{
            padding: "12px 16px", background: "#F0FDF4",
            borderRadius: 14, border: "1px solid #BBF7D0", marginBottom: 16,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 22 }}>✅</span>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#16A34A" }}>
              {t.vpDateSelected(formattedDate)}
            </p>
          </div>

          {/* כפתורי יצירת קשר */}
          {isLoggedIn ? (
            <div style={{
              background: "linear-gradient(135deg, #fff8fa 0%, #fff 100%)",
              border: `1px solid ${PINK_LIGHT}`,
              borderRadius: 20, padding: "20px 18px",
              boxShadow: "0 4px 20px rgba(194,24,91,0.08)",
            }}>
              <p style={{ margin: "0 0 4px", fontSize: 12, color: "#999", textAlign: "center" }}>
                {t.vpPhoneLabel}
              </p>
              <p style={{
                margin: "0 0 18px", fontSize: 26, fontWeight: 900,
                color: "#222", letterSpacing: 2, textAlign: "center", direction: "ltr",
              }}>
                {vendorPhone}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <a
                  href={`tel:${vendorPhone}`}
                  onClick={() => trackContact("call")}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 10, background: PINK, color: "#fff",
                    borderRadius: 16, padding: "15px 0", fontSize: 16, fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 4px 14px rgba(194,24,91,0.35)",
                  }}
                >
                  <span style={{ fontSize: 22 }}>📞</span>
                  {t.vpCallNow}
                </a>

                <a
                  href={`https://wa.me/${vendorWaPhone}?text=${waMessage}`}
                  onClick={() => trackContact("wa")}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 10, background: "#25D366", color: "#fff",
                    borderRadius: 16, padding: "15px 0", fontSize: 16, fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 4px 14px rgba(37,211,102,0.35)",
                  }}
                >
                  <span style={{ fontSize: 22 }}>💬</span>
                  {t.vpWhatsapp}
                </a>
              </div>

              <p style={{ margin: "12px 0 0", fontSize: 11, color: "#ccc", textAlign: "center" }}>
                ההודעה לספק תכלול את התאריך שבחרת
              </p>
            </div>
          ) : (
            <div style={{
              background: "#FFF8FA", border: `1px solid ${PINK_LIGHT}`,
              borderRadius: 16, padding: "20px", textAlign: "center",
            }}>
              <span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>🔒</span>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#555" }}>
                {t.vpLoginRequired}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── VP4. VendorRating ────────────────────────────────────────────────────────

export function VendorRating({ vendor, currentUser }) {
  const { t } = useLang();

  const ratingKey = currentUser && vendor
    ? `aros_rating_${currentUser.email}_${vendor.title || vendor.id}`
    : null;

  const [rating, setRating] = useState(() => {
    if (!ratingKey) return 0;
    return parseInt(localStorage.getItem(ratingKey) || "0");
  });
  const [hovered, setHovered] = useState(0);

  const handleRate = (star) => {
    setRating(star);
    if (ratingKey) localStorage.setItem(ratingKey, String(star));
  };

  if (!currentUser) return null; // only logged-in users can rate

  return (
    <div style={{ background: "#fff", margin: "10px 0", padding: "16px", textAlign: "center" }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#222", margin: "0 0 6px" }}>{t.vpRatingTitle}</h2>
      <p style={{ fontSize: 12, color: "#aaa", margin: "0 0 14px" }}>{t.vpRatingSub}</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
        {[1,2,3,4,5].map(star => (
          <button key={star} onClick={() => handleRate(star)}
            onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 30, color: star <= (hovered || rating) ? "#FFD700" : "#ddd", transition: "color 0.1s" }}>★</button>
        ))}
      </div>
      {rating > 0 && <p style={{ fontSize: 13, color: PINK, marginTop: 8, fontWeight: 600 }}>{t.vpRatingDone(rating)}</p>}
    </div>
  );
}

// ─── VP5. VendorGallery ───────────────────────────────────────────────────────

export function VendorGallery({ images }) {
  const { isDesktop } = useResponsive();
  const { t } = useLang();

  const imgs = images && images.length > 0 ? images : PROFILE_GALLERY;

  return (
    <div style={{ background: "#fff", margin: "10px 0", padding: "16px" }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#222", margin: "0 0 14px" }}>{t.vpGallery}</h2>
      <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr 1fr 1fr" : "1fr 1fr", gap: 8 }}>
        {imgs.map((src, i) => (
          <img key={i} src={src} alt={`${i + 1}`}
            style={{
              width: "100%",
              height: (i === 0 && imgs.length > 2) ? 180 : 110,
              objectFit: "cover", borderRadius: 12, display: "block",
              gridColumn: (i === 0 && imgs.length > 2) ? "1 / -1" : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── VendorProfileScreen (מסך מלא — מרכיב את כל הקומפוננטות) ─────────────────

export function VendorProfileScreen({ vendor, onBack, isLoggedIn, currentUser }) {
  // Always load freshest data from localStorage for registered vendors
  const liveVendor = React.useMemo(() => {
    if (!vendor?.isRegisteredVendor || !vendor?.email) return vendor;
    try {
      const users = JSON.parse(localStorage.getItem("aros_users") || "[]");
      const u = users.find(u => u.email === vendor.email);
      if (!u) return vendor;
      // Merge: keep card fields + override with latest images/details
      return {
        ...vendor,
        image: u.coverImage || u.galleryImages?.[0] || vendor.image,
        coverImage: u.coverImage || null,
        galleryImages: u.galleryImages || [],
        description: u.description || vendor.subtitle || "",
        phone: u.phone || vendor.phone || "",
        website: u.website || "",
        instagram: u.instagram || "",
        yearsActive: u.yearsActive || "",
      };
    } catch { return vendor; }
  }, [vendor?.email]);

  // Build gallery: cover first (full width), then gallery images
  const galleryImages = React.useMemo(() => {
    const cover = liveVendor?.coverImage;
    const gallery = liveVendor?.galleryImages || [];
    if (cover) {
      // cover first, then gallery (without duplicates)
      return [cover, ...gallery.filter(g => g !== cover)];
    }
    return gallery;
  }, [liveVendor]);

  return (
    <div style={{ direction: "rtl", background: "#FAFAFA", minHeight: "100vh", paddingBottom: 30 }}>
      <VendorProfileHero image={liveVendor.image} title={liveVendor.title} onBack={onBack} />
      <VendorProfileInfo vendor={liveVendor} />
      <VendorAvailabilityCalendar vendor={liveVendor} isLoggedIn={isLoggedIn} />
      <VendorRating vendor={liveVendor} currentUser={currentUser} />
      <VendorGallery images={galleryImages} />
    </div>
  );
}
