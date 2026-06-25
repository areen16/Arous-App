import {useState, useRef, useEffect} from 'react';
import { PINK, PINK_LIGHT } from '../../constants';
import { useLang } from '../../context/LangContext';
import { useResponsive } from '../../hooks/useResponsive';
import './ProfileScreen.css';

const vinS = { width:"100%", boxSizing:"border-box", border:"1px solid #e0e0e0", borderRadius:10, padding:"10px 12px", fontSize:14, color:"#333", outline:"none", background:"#fafafa", fontFamily:"inherit", marginBottom:14 };

const CITIES = ["תל אביב","ירושלים","חיפה","ראשון לציון","פתח תקווה","אשדוד","נתניה","באר שבע","בני ברק","רמת גן","הרצליה","חולון","רעננה","כפר סבא","מודיעין","אשקלון","רחובות","בת ים","נס ציונה","לוד"];

export function CountdownTimer({ eventDate }) {
  const [now, setNow] = useState(new Date());
  const { t } = useLang();
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  if (!eventDate) return null;
  const target = new Date(eventDate);
  const diff = target - now;
  if (diff <= 0) return (
    <div style={{ textAlign: "center", padding: "10px 0", color: PINK, fontWeight: 700, fontSize: 15 }}>
      {t.profileCountdownWed}
    </div>
  );

  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 12 }}>
      {[
        { val: months, label: t.countdownMonths },
        { val: days,   label: t.countdownDays   },
        { val: hours,  label: t.countdownHours  },
      ].map(({ val, label }) => (
        <div key={label} style={{ flex: 1, background: PINK_LIGHT, borderRadius: 14, padding: "12px 6px", textAlign: "center", border: `1px solid #f8bbd0` }}>
          <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: PINK, lineHeight: 1 }}>{val}</p>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: "#c2185b" }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

const VENDOR_CATS = ["אולם שמחות","צילום","קייטרינג","מוזיקה","DJ","פרחים","שמלות כלה","הגברה","עיצוב","כיבוד","הסעות","אחר"];
const VENDOR_CITIES_LIST = ["תל אביב","ירושלים","חיפה","ראשון לציון","פתח תקווה","אשדוד","נתניה","באר שבע","בני ברק","רמת גן","הרצליה","חולון","רעננה","כפר סבא","מודיעין","אשקלון","רחובות","בת ים","נס ציונה","לוד","כרמיאל","אילת","כל הארץ"];

export function VendorDashboard({ user, onUserUpdate }) {
  const [tab, setTab] = useState("profile"); // profile | deals | stats
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    businessName: user.businessName || "",
    category: user.category || "",
    city: user.city || "",
    phone: user.phone || "",
    email: user.email || "",
    website: user.website || "",
    instagram: user.instagram || "",
    yearsActive: user.yearsActive || "",
    description: user.description || "",
  });
  const [coverImage, setCoverImage] = useState(user.coverImage || null);
  const [galleryImages, setGalleryImages] = useState(user.galleryImages || []);
  const [profileSaved, setProfileSaved] = useState(false);

  // Deals state
  const [deals, setDeals] = useState(() =>
    JSON.parse(localStorage.getItem("aros_vendor_deals") || "[]").filter(d => d.vendorEmail === user.email)
  );
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [dealForm, setDealForm] = useState({ title:"", description:"", originalPrice:"", dealPrice:"", discount:"", category: user.category || "", location: user.city || "", expiryDate:"" });
  const [dealErrors, setDealErrors] = useState({});

  // Stats
  const [callCount] = useState(() => parseInt(localStorage.getItem(`aros_calls_${user.email}`) || "0"));
  const [waCount] = useState(() => parseInt(localStorage.getItem(`aros_wa_${user.email}`) || "0"));

  const setP = (k, v) => setProfile(p => ({ ...p, [k]: v }));
  const setD = (k, v) => setDealForm(f => ({ ...f, [k]: v }));

  // ── Persist to localStorage + notify parent ──
  const persistUser = (updated) => {
    try {
      const users = JSON.parse(localStorage.getItem("aros_users") || "[]");
      const idx = users.findIndex(u => u.email === updated.email);
      if (idx !== -1) users[idx] = updated;
      else users.push(updated);
      localStorage.setItem("aros_users", JSON.stringify(users));
    } catch {}
    localStorage.setItem("aros_current_user", JSON.stringify(updated));
    onUserUpdate(updated);
    // Notify VendorList to refresh cards
    window.dispatchEvent(new Event("aros_vendor_updated"));
  };

  // ── Save profile ──
  const saveProfile = () => {
    const updated = { ...user, ...profile, coverImage, galleryImages };
    persistUser(updated);
    setEditMode(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  // ── Cover image ──
  const handleCover = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      const dataUrl = ev.target.result;
      setCoverImage(dataUrl);
      persistUser({ ...user, ...profile, coverImage: dataUrl, galleryImages });
    };
    r.readAsDataURL(f);
  };

  // ── Gallery images ──
  const handleGallery = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(f => {
      const r = new FileReader();
      r.onload = ev => {
        setGalleryImages(prev => {
          const next = [...prev, ev.target.result];
          persistUser({ ...user, ...profile, coverImage, galleryImages: next });
          return next;
        });
      };
      r.readAsDataURL(f);
    });
  };

  const removeGalleryImage = (idx) => {
    setGalleryImages(prev => {
      const next = prev.filter((_, i) => i !== idx);
      persistUser({ ...user, ...profile, coverImage, galleryImages: next });
      return next;
    });
  };

  // ── Add deal ──
  const validateDeal = () => {
    const e = {};
    if (!dealForm.title.trim()) e.title = "כותרת חובה";
    if (!dealForm.originalPrice.trim()) e.originalPrice = "מחיר מקורי חובה";
    if (!dealForm.dealPrice.trim()) e.dealPrice = "מחיר מבצע חובה";
    if (!dealForm.expiryDate) e.expiryDate = "תאריך תפוגה חובה";
    if (!dealForm.description.trim()) e.description = "תיאור חובה";
    return e;
  };

  const addDeal = () => {
    const e = validateDeal();
    setDealErrors(e);
    if (Object.keys(e).length > 0) return;

    const allDeals = JSON.parse(localStorage.getItem("aros_vendor_deals") || "[]");
    const disc = dealForm.discount || Math.round((1 - parseFloat(dealForm.dealPrice.replace(/[^\d.]/g,"")) / parseFloat(dealForm.originalPrice.replace(/[^\d.]/g,""))) * 100) + "%";
    const expiry = new Date(dealForm.expiryDate);
    const daysLeft = Math.ceil((expiry - new Date()) / (1000*60*60*24));
    const newDeal = {
      ...dealForm,
      id: `vendor_${Date.now()}`,
      vendorEmail: user.email,
      badge: "מבצע ספק",
      discount: disc,
      expiry: `נותרו ${daysLeft} ימים`,
      expiryDate: dealForm.expiryDate,
      rating: "—", reviews: 0,
      image: coverImage || "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    };
    allDeals.push(newDeal);
    localStorage.setItem("aros_vendor_deals", JSON.stringify(allDeals));
    window.dispatchEvent(new Event("aros_deals_updated"));
    setDeals(prev => [...prev, newDeal]);
    setShowAddDeal(false);
    setDealForm({ title:"", description:"", originalPrice:"", dealPrice:"", discount:"", category: user.category || "", location: user.city || "", expiryDate:"" });
  };

  const deleteDeal = (id) => {
    const allDeals = JSON.parse(localStorage.getItem("aros_vendor_deals") || "[]").filter(d => d.id !== id);
    localStorage.setItem("aros_vendor_deals", JSON.stringify(allDeals));
    window.dispatchEvent(new Event("aros_deals_updated"));
    setDeals(prev => prev.filter(d => d.id !== id));
  };

  const tabStyle = (active) => ({
    flex: 1, padding: "10px 0", fontSize: 13, fontWeight: active ? 700 : 400,
    color: active ? PINK : "#888", background: "none", border: "none",
    borderBottom: active ? `2.5px solid ${PINK}` : "2.5px solid transparent",
    cursor: "pointer", fontFamily: "inherit",
  });
  const secCard = { background:"#fff", borderRadius:18, margin:"12px 16px", padding:"18px 16px", border:"0.5px solid #eee", boxShadow:"0 1px 6px rgba(0,0,0,0.04)" };

  return (
    <div style={{ direction:"rtl", background:"#FAFAFA", minHeight:"100vh", paddingBottom:40 }}>

      {/* ── Vendor Hero ── */}
      <div style={{ position:"relative" }}>
        <div style={{ height:160, background: coverImage ? `url(${coverImage}) center/cover` : `linear-gradient(135deg,#880E4F,${PINK})`, position:"relative" }}>
          <label style={{ position:"absolute", bottom:10, left:10, background:"rgba(0,0,0,0.5)", color:"#fff", borderRadius:20, padding:"6px 14px", fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", gap:6, alignItems:"center" }}>
            📷 שנה תמונת רקע
            <input type="file" accept="image/*" onChange={handleCover} style={{ display:"none" }} />
          </label>
        </div>
        <div style={{ padding:"0 16px", marginTop:-36 }}>
          <div style={{ width:72, height:72, borderRadius:16, border:"3px solid #fff", overflow:"hidden", background:PINK_LIGHT, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, boxShadow:"0 2px 8px rgba(0,0,0,0.15)" }}>
            {user.avatar ? <img src={user.avatar} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : "🏢"}
          </div>
        </div>
        <div style={{ padding:"8px 16px 0" }}>
          <h1 style={{ fontSize:20, fontWeight:800, color:"#222" }}>{user.businessName || `${user.firstName} ${user.lastName}`}</h1>
          <p style={{ fontSize:13, color:"#888" }}>{user.category} · {user.city}</p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display:"flex", borderBottom:"1px solid #eee", background:"#fff", margin:"14px 0 0" }}>
        <button style={tabStyle(tab==="profile")} onClick={() => setTab("profile")}>👤 פרופיל</button>
        <button style={tabStyle(tab==="deals")} onClick={() => setTab("deals")}>🏷️ מבצעים</button>
        <button style={tabStyle(tab==="stats")} onClick={() => setTab("stats")}>📊 סטטיסטיקות</button>
      </div>

      {/* ══ PROFILE TAB ══ */}
      {tab === "profile" && (
        <>
          <div style={secCard}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h2 style={{ fontSize:15, fontWeight:700 }}>פרטי העסק</h2>
              {!editMode
                ? <button onClick={() => setEditMode(true)} style={{ background:"none", border:`1px solid ${PINK}`, color:PINK, borderRadius:20, padding:"5px 14px", fontSize:13, cursor:"pointer", fontWeight:600 }}>עריכה ✏️</button>
                : <div style={{ display:"flex", gap:8 }}>
                    <button onClick={saveProfile} style={{ background:PINK, border:"none", color:"#fff", borderRadius:20, padding:"5px 16px", fontSize:13, cursor:"pointer", fontWeight:700 }}>שמירה</button>
                    <button onClick={() => setEditMode(false)} style={{ background:"none", border:"1px solid #ddd", color:"#888", borderRadius:20, padding:"5px 12px", fontSize:13, cursor:"pointer" }}>ביטול</button>
                  </div>
              }
            </div>

            {profileSaved && <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:10, padding:"8px 12px", marginBottom:12, fontSize:13, color:"#16A34A", fontWeight:600 }}>✅ הפרטים נשמרו בהצלחה</div>}

            {[
              { k:"businessName", label:"שם העסק" },
              { k:"phone", label:"טלפון" },
              { k:"email", label:"אימייל", type:"email" },
              { k:"website", label:"אתר אינטרנט", placeholder:"https://..." },
              { k:"instagram", label:"אינסטגרם", placeholder:"@mybusiness" },
              { k:"yearsActive", label:"שנות ניסיון", type:"number" },
            ].map(({ k, label, type="text", placeholder="" }) => (
              <div key={k} style={{ marginBottom:14 }}>
                <span style={{ fontSize:12, color:"#999", display:"block", marginBottom:4 }}>{label}</span>
                {editMode
                  ? <input type={type} value={profile[k]} onChange={e => setP(k, e.target.value)} placeholder={placeholder} style={vinS} />
                  : <p style={{ fontSize:15, fontWeight:600, color:"#222", margin:0 }}>{profile[k] || "—"}</p>
                }
              </div>
            ))}

            {/* Category & City selects */}
            {editMode ? (
              <>
                <span style={{ fontSize:12, color:"#999", display:"block", marginBottom:4 }}>קטגוריה</span>
                <select value={profile.category} onChange={e => setP("category", e.target.value)} style={vinS}>
                  <option value="">בחר...</option>
                  {VENDOR_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <span style={{ fontSize:12, color:"#999", display:"block", marginBottom:4 }}>עיר פעילות</span>
                <select value={profile.city} onChange={e => setP("city", e.target.value)} style={vinS}>
                  <option value="">בחר...</option>
                  {VENDOR_CITIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </>
            ) : (
              <>
                <div style={{ marginBottom:14 }}>
                  <span style={{ fontSize:12, color:"#999", display:"block", marginBottom:4 }}>קטגוריה</span>
                  <p style={{ fontSize:15, fontWeight:600, color:"#222", margin:0 }}>{profile.category || "—"}</p>
                </div>
                <div style={{ marginBottom:14 }}>
                  <span style={{ fontSize:12, color:"#999", display:"block", marginBottom:4 }}>עיר פעילות</span>
                  <p style={{ fontSize:15, fontWeight:600, color:"#222", margin:0 }}>{profile.city || "—"}</p>
                </div>
              </>
            )}

            <div style={{ marginBottom:14 }}>
              <span style={{ fontSize:12, color:"#999", display:"block", marginBottom:4 }}>תיאור העסק</span>
              {editMode
                ? <textarea value={profile.description} onChange={e => setP("description", e.target.value)} rows={4} style={{ ...vinS, resize:"vertical" }} />
                : <p style={{ fontSize:14, color:"#444", lineHeight:1.6, margin:0 }}>{profile.description || "—"}</p>
              }
            </div>
          </div>

          {/* ── Gallery ── */}
          <div style={secCard}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <h2 style={{ fontSize:15, fontWeight:700 }}>📸 תמונות גלריה</h2>
              <label style={{ background:PINK, color:"#fff", borderRadius:20, padding:"6px 14px", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                + הוסף תמונות
                <input type="file" accept="image/*" multiple onChange={handleGallery} style={{ display:"none" }} />
              </label>
            </div>
            {galleryImages.length === 0
              ? <p style={{ fontSize:13, color:"#bbb", textAlign:"center", padding:"20px 0" }}>עוד לא הועלו תמונות</p>
              : <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                  {galleryImages.map((src, i) => (
                    <div key={i} style={{ position:"relative" }}>
                      <img src={src} alt="" style={{ width:"100%", height:90, objectFit:"cover", borderRadius:10 }} />
                      <button onClick={() => removeGalleryImage(i)}
                        style={{ position:"absolute", top:4, left:4, background:"rgba(0,0,0,0.6)", color:"#fff", border:"none", borderRadius:"50%", width:22, height:22, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                    </div>
                  ))}
                </div>
            }
          </div>
        </>
      )}

      {/* ══ DEALS TAB ══ */}
      {tab === "deals" && (
        <div style={{ padding:"0 0 20px" }}>
          {/* Add deal button */}
          <div style={{ padding:"14px 16px" }}>
            <button onClick={() => setShowAddDeal(s => !s)} style={{
              width:"100%", background: showAddDeal ? "#fff" : PINK, color: showAddDeal ? PINK : "#fff",
              border:`1.5px solid ${PINK}`, borderRadius:24, padding:"12px 0",
              fontSize:15, fontWeight:700, cursor:"pointer",
            }}>
              {showAddDeal ? "✕ סגור טופס" : "+ הוסף מבצע חדש"}
            </button>
          </div>

          {/* Add deal form */}
          {showAddDeal && (
            <div style={{ ...secCard, marginTop:0 }}>
              <h2 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>מבצע חדש</h2>

              {[
                { k:"title", label:"כותרת המבצע *" },
                { k:"description", label:"תיאור *" },
                { k:"originalPrice", label:"מחיר מקורי *", placeholder:"₪1,200" },
                { k:"dealPrice", label:"מחיר מבצע *", placeholder:"₪960" },
                { k:"discount", label:"אחוז הנחה (אופציונלי)", placeholder:"20%" },
              ].map(({ k, label, placeholder="" }) => (
                <div key={k}>
                  <label style={{ fontSize:13, fontWeight:600, color:"#444", display:"block", marginBottom:6 }}>{label}</label>
                  {k === "description"
                    ? <textarea value={dealForm[k]} onChange={e => setD(k, e.target.value)} rows={3} style={{ ...vinS, resize:"vertical" }} />
                    : <input value={dealForm[k]} onChange={e => setD(k, e.target.value)} placeholder={placeholder} style={vinS} />
                  }
                  {dealErrors[k] && <p style={{ fontSize:11, color:"#e53935", marginTop:-10, marginBottom:10 }}>{dealErrors[k]}</p>}
                </div>
              ))}

              <label style={{ fontSize:13, fontWeight:600, color:"#444", display:"block", marginBottom:6 }}>קטגוריה</label>
              <select value={dealForm.category} onChange={e => setD("category", e.target.value)} style={vinS}>
                <option value="">בחר...</option>
                {VENDOR_CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <label style={{ fontSize:13, fontWeight:600, color:"#444", display:"block", marginBottom:6 }}>אזור</label>
              <select value={dealForm.location} onChange={e => setD("location", e.target.value)} style={vinS}>
                <option value="">בחר...</option>
                {VENDOR_CITIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <label style={{ fontSize:13, fontWeight:600, color:"#444", display:"block", marginBottom:6 }}>תאריך תפוגה *</label>
              <input type="date" value={dealForm.expiryDate} min={new Date().toISOString().split("T")[0]} onChange={e => setD("expiryDate", e.target.value)} style={vinS} />
              {dealErrors.expiryDate && <p style={{ fontSize:11, color:"#e53935", marginTop:-10, marginBottom:10 }}>{dealErrors.expiryDate}</p>}

              <button onClick={addDeal} style={{ width:"100%", background:PINK, color:"#fff", border:"none", borderRadius:24, padding:"13px 0", fontSize:15, fontWeight:700, cursor:"pointer" }}>
                🚀 פרסם מבצע
              </button>
            </div>
          )}

          {/* Active deals */}
          <div style={{ padding:"0 16px" }}>
            <p style={{ fontSize:13, color:"#aaa", margin:"8px 0 14px" }}>{deals.length} מבצעים פעילים</p>
            {deals.length === 0
              ? <div style={{ textAlign:"center", padding:"40px 0", color:"#bbb" }}>
                  <p style={{ fontSize:36 }}>🏷️</p>
                  <p style={{ fontSize:14, fontWeight:600, color:"#888" }}>עוד לא פרסמת מבצעים</p>
                  <p style={{ fontSize:13 }}>לחץ על "הוסף מבצע חדש" למעלה</p>
                </div>
              : deals.map(d => (
                  <div key={d.id} style={{ background:"#fff", borderRadius:16, padding:"14px", marginBottom:12, border:"0.5px solid #eee", boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                      <h3 style={{ fontSize:14, fontWeight:700, color:"#222", flex:1, marginLeft:8 }}>{d.title}</h3>
                      <button onClick={() => deleteDeal(d.id)} style={{ background:"#FFE5E5", border:"none", color:"#e53935", borderRadius:20, padding:"3px 10px", fontSize:12, cursor:"pointer", fontWeight:600 }}>מחק</button>
                    </div>
                    <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:4 }}>
                      <span style={{ fontSize:16, fontWeight:800, color:PINK }}>{d.dealPrice}</span>
                      <span style={{ fontSize:12, color:"#bbb", textDecoration:"line-through" }}>{d.originalPrice}</span>
                      <span style={{ background:PINK_LIGHT, color:PINK, fontSize:11, fontWeight:700, padding:"1px 8px", borderRadius:10 }}>-{d.discount}</span>
                    </div>
                    <p style={{ fontSize:12, color:"#888", margin:0 }}>⏳ {d.expiry} · 📍 {d.location}</p>
                  </div>
                ))
            }
          </div>
        </div>
      )}

      {/* ══ STATS TAB ══ */}
      {tab === "stats" && (
        <div style={{ padding:"0 16px 20px" }}>
          <p style={{ fontSize:13, color:"#aaa", margin:"14px 0 14px" }}>התקשרויות מלקוחות דרך האפליקציה</p>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            {[
              { icon:"📞", label:"שיחות טלפון", val: callCount, color:"#3B82F6", bg:"#EFF6FF" },
              { icon:"💬", label:"הודעות וואטסאפ", val: waCount, color:"#22C55E", bg:"#F0FDF4" },
              { icon:"⭐", label:"מבצעים פעילים", val: deals.length, color:PINK, bg:PINK_LIGHT },
              { icon:"📸", label:"תמונות בגלריה", val: galleryImages.length, color:"#F59E0B", bg:"#FFFBEB" },
            ].map(({ icon, label, val, color, bg }) => (
              <div key={label} style={{ background:bg, borderRadius:16, padding:"18px 14px", textAlign:"center", border:`1px solid ${bg}` }}>
                <p style={{ fontSize:28, margin:"0 0 6px" }}>{icon}</p>
                <p style={{ fontSize:28, fontWeight:800, color, margin:"0 0 4px", lineHeight:1 }}>{val}</p>
                <p style={{ fontSize:12, color:"#666", lineHeight:1.3 }}>{label}</p>
              </div>
            ))}
          </div>

          <div style={{ background:"#fff", borderRadius:16, padding:"16px", border:"0.5px solid #eee" }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:"#222", marginBottom:12 }}>📈 איך להגדיל חשיפה?</h3>
            {[
              "✅ הוסף תמונות לגלריה — ספקים עם תמונות מקבלים פי 3 יותר קליקים",
              "🏷️ פרסם מבצע זמני — לקוחות מחפשים עסקאות",
              "📝 כתוב תיאור מפורט ומשכנע",
              "📞 וודא שהטלפון עדכני ופעיל",
            ].map((tip, i) => (
              <p key={i} style={{ fontSize:13, color:"#555", lineHeight:1.8 }}>{tip}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LogoutConfirm dialog ────────────────────────────────────────────────────
function LogoutConfirm({ onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 24px",
    }}>
      <div style={{
        background: "#fff", borderRadius: 24, padding: "32px 24px 24px",
        width: "100%", maxWidth: 340, textAlign: "center",
        boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
        animation: "fadeIn 0.18s ease",
      }}>
        <div style={{ fontSize: 48, marginBottom: 14 }}>🚪</div>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#222", margin: "0 0 8px" }}>
          האם אתה רוצה להתנתק?
        </h2>
        <p style={{ fontSize: 13, color: "#888", margin: "0 0 24px", lineHeight: 1.5 }}>
          תצא מהחשבון ותחזור למסך ההתחברות
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: "13px 0", borderRadius: 14,
              background: "#f5f5f5", color: "#555",
              border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}
          >
            ביטול
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: "13px 0", borderRadius: 14,
              background: "#E53935", color: "#fff",
              border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer",
              boxShadow: "0 4px 12px rgba(229,57,53,0.3)",
            }}
          >
            כן, התנתק
          </button>
        </div>
      </div>
    </div>
  );
}

export function UserProfileScreen({ user, onUserUpdate, onLogout }) {
  const { t } = useLang();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => setShowLogoutConfirm(true);
  const handleLogoutConfirm = () => { setShowLogoutConfirm(false); onLogout(); };
  const handleLogoutCancel  = () => setShowLogoutConfirm(false);

  // ── Vendor gets their own dashboard ──
  if (user.isVendor) {
    return (
      <div style={{ direction: "rtl" }}>
        {showLogoutConfirm && <LogoutConfirm onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />}
        <VendorDashboard user={user} onUserUpdate={onUserUpdate} />
        <div style={{ margin: "0 16px 20px" }}>
          <button onClick={handleLogoutClick} style={{ width:"100%", background:"#fff", color:"#E53935", border:"1px solid #FFCDD2", borderRadius:16, padding:"14px 0", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            🚪 התנתקות
          </button>
        </div>
      </div>
    );
  }

  const [editMode, setEditMode] = useState(false);
  const [form, setForm]         = useState({ ...user });
  const [showPass, setShowPass] = useState(false);
  const [editDate, setEditDate] = useState(false);
  const [avatar, setAvatar]     = useState(user.avatar || null);
  const [errors, setErrors]     = useState({});
  const [saved, setSaved]       = useState(false);

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setAvatar(dataUrl);
      const updated = { ...form, avatar: dataUrl };
      try {
        const users = JSON.parse(localStorage.getItem("aros_users") || "[]");
        const idx = users.findIndex(u => u.email === updated.email);
        if (idx !== -1) { users[idx] = updated; localStorage.setItem("aros_users", JSON.stringify(users)); }
      } catch {}
      onUserUpdate(updated);
    };
    reader.readAsDataURL(file);
  };

  const validateAndSave = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = t.valFirstName;
    if (!form.email.includes("@")) e.email = t.valEmail;
    if (form.password && !/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(form.password)) e.password = t.valPassword;
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    const updated = { ...form, avatar };
    try {
      const users = JSON.parse(localStorage.getItem("aros_users") || "[]");
      const idx = users.findIndex(u => u.email === user.email);
      if (idx !== -1) { users[idx] = updated; localStorage.setItem("aros_users", JSON.stringify(users)); }
    } catch {}
    onUserUpdate(updated);
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sectionStyle = { background: "#fff", borderRadius: 18, margin: "12px 16px", padding: "18px 16px", border: "0.5px solid #eee", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" };
  const fieldRowStyle = { marginBottom: 14 };
  const fieldLabelStyle = { fontSize: 12, color: "#999", marginBottom: 4, display: "block" };
  const fieldValueStyle = { fontSize: 15, fontWeight: 600, color: "#222" };
  const editInputStyle = { width: "100%", boxSizing: "border-box", border: "1px solid #e0e0e0", borderRadius: 10, padding: "10px 12px", fontSize: 14, color: "#333", outline: "none", background: "#fafafa", direction: t.dir };

  return (
    <div style={{ direction: t.dir, background: "#FAFAFA", minHeight: "100vh", paddingBottom: 40 }}>
      <div style={{ background: `linear-gradient(135deg, #880E4F 0%, ${PINK} 100%)`, padding: "36px 16px 28px", textAlign: "center" }}>
        <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", overflow: "hidden", border: "3px solid #fff", background: "#f8d0e0", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {avatar ? <img src={avatar} alt="פרופיל" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 38 }}>👤</span>}
          </div>
          <label style={{ position: "absolute", bottom: 2, left: 2, background: "#fff", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 1px 6px rgba(0,0,0,0.2)", fontSize: 14 }}>
            📷<input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
          </label>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>{form.firstName} {form.lastName}</h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", margin: 0 }}>{form.email}</p>
      </div>

      {form.eventDate && (
        <div style={sectionStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#222", margin: 0 }}>{t.profileEventDate}</h2>
            <button onClick={() => setEditDate(e => !e)} style={{ background: "none", border: "none", color: PINK, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>{editDate ? t.profileClose : t.profileEdit}</button>
          </div>
          <p style={{ fontSize: 13, color: "#888", margin: "6px 0 0" }}>
            {new Date(form.eventDate).toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          {editDate && (
            <input type="date" value={form.eventDate}
              onChange={e => { setF("eventDate", e.target.value); onUserUpdate({ ...form, eventDate: e.target.value, avatar }); setEditDate(false); }}
              style={{ ...editInputStyle, marginTop: 10 }} />
          )}
          <CountdownTimer eventDate={form.eventDate} />
        </div>
      )}

      <div style={sectionStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#222", margin: 0 }}>{t.profilePersonal}</h2>
          {!editMode
            ? <button onClick={() => setEditMode(true)} style={{ background: "none", border: `1px solid ${PINK}`, color: PINK, borderRadius: 20, padding: "5px 14px", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>{t.profileEditBtn}</button>
            : <div style={{ display: "flex", gap: 8 }}>
                <button onClick={validateAndSave} style={{ background: PINK, border: "none", color: "#fff", borderRadius: 20, padding: "5px 16px", fontSize: 13, cursor: "pointer", fontWeight: 700 }}>{t.profileSave}</button>
                <button onClick={() => { setForm({ ...user }); setEditMode(false); setErrors({}); }} style={{ background: "none", border: "1px solid #ddd", color: "#888", borderRadius: 20, padding: "5px 12px", fontSize: 13, cursor: "pointer" }}>{t.profileCancel}</button>
              </div>
          }
        </div>

        {saved && <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "8px 12px", marginBottom: 12, fontSize: 13, color: "#16A34A", fontWeight: 600 }}>{t.profileSaved}</div>}

        {[
          { key: "firstName", label: t.authFirstName, type: "text" },
          { key: "lastName",  label: t.authLastName,  type: "text" },
          { key: "email",     label: t.authEmail,     type: "email" },
          { key: "phone",     label: t.authPhone,     type: "tel" },
        ].map(({ key, label, type }) => (
          <div key={key} style={fieldRowStyle}>
            <span style={fieldLabelStyle}>{label}</span>
            {editMode
              ? <><input type={type} value={form[key]} onChange={e => setF(key, e.target.value)}
                  style={{ ...editInputStyle, border: errors[key] ? "1px solid #e53935" : "1px solid #e0e0e0" }} />
                {errors[key] && <p style={{ fontSize: 11, color: "#e53935", margin: "2px 0 0" }}>{errors[key]}</p>}</>
              : <p style={{ ...fieldValueStyle, margin: 0 }}>{form[key] || "—"}</p>
            }
          </div>
        ))}

        <div style={fieldRowStyle}>
          <span style={fieldLabelStyle}>{t.authPassword}</span>
          {editMode
            ? <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} value={form.password} onChange={e => setF("password", e.target.value)}
                  placeholder={t.profilePasswordPlaceholder}
                  style={{ ...editInputStyle, border: errors.password ? "1px solid #e53935" : "1px solid #e0e0e0" }} />
                <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#bbb" }}>
                  {showPass ? "🙈" : "👁️"}
                </button>
                {errors.password && <p style={{ fontSize: 11, color: "#e53935", margin: "2px 0 0" }}>{errors.password}</p>}
              </div>
            : <p style={{ ...fieldValueStyle, margin: 0 }}>{t.profilePasswordDisplay}</p>
          }
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#222", margin: "0 0 16px" }}>{t.profileRegionLang}</h2>
        <div style={fieldRowStyle}>
          <span style={fieldLabelStyle}>{t.profileCity}</span>
          <select value={form.city || ""} onChange={e => { setF("city", e.target.value); onUserUpdate({ ...form, city: e.target.value, avatar }); }}
            style={{ ...editInputStyle, cursor: "pointer" }}>
            <option value="">{t.profileCityPlaceholder}</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={fieldRowStyle}>
          <span style={fieldLabelStyle}>{t.profileLang}</span>
          <div style={{ display: "flex", gap: 10 }}>
            {[{ val: "he", label: "עברית 🇮🇱" }, { val: "ar", label: "عربية 🇸🇦" }].map(lang => (
              <button key={lang.val} onClick={() => { setF("lang", lang.val); onUserUpdate({ ...form, lang: lang.val, avatar }); }}
                style={{ flex: 1, padding: "10px 0", borderRadius: 12, cursor: "pointer",
                  border: (form.lang || "he") === lang.val ? `2px solid ${PINK}` : "1px solid #eee",
                  background: (form.lang || "he") === lang.val ? PINK_LIGHT : "#fafafa",
                  color: (form.lang || "he") === lang.val ? PINK : "#555",
                  fontWeight: (form.lang || "he") === lang.val ? 700 : 400, fontSize: 14 }}>
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showLogoutConfirm && <LogoutConfirm onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />}

      <div style={{ margin: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={() => window.open("mailto:support@aros.co.il", "_blank")}
          style={{ width: "100%", background: "#fff", color: "#333", border: "0.5px solid #eee", borderRadius: 16, padding: "14px 0", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          {t.profileSupport}
        </button>
        <button onClick={handleLogoutClick}
          style={{ width: "100%", background: "#fff", color: "#E53935", border: "1px solid #FFCDD2", borderRadius: 16, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          {t.profileLogout}
        </button>
      </div>
    </div>
  );
}
