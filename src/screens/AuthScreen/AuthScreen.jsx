import {useState, useEffect} from 'react';
import { PINK, PINK_LIGHT } from '../../constants';
import { useLang } from '../../context/LangContext';
import './AuthScreen.css';

const inputStyle = {
  width: "100%", boxSizing: "border-box",
  border: "1px solid #e0e0e0", borderRadius: 12,
  padding: "12px 14px", fontSize: 14, color: "#333",
  outline: "none", marginBottom: 14,
  background: "#fafafa",
};
const labelStyle = { fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 };

const vinputStyle = {
  width: "100%", boxSizing: "border-box", border: "1px solid #e0e0e0",
  borderRadius: 12, padding: "12px 14px", fontSize: 14, color: "#333",
  outline: "none", background: "#fafafa", fontFamily: "inherit",
};

export function AuthHero({ title, subtitle }) {
  const { t } = useLang();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "36px 16px 20px", direction: t.dir }}>
      <div style={{ width: 88, height: 88, borderRadius: "50%", overflow: "hidden", border: `3px solid ${PINK_LIGHT}`, marginBottom: 16, background: "#f0e6f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src="https://images.unsplash.com/photo-1594938298603-b8968a9b2a48?w=200&q=80" alt="פרופיל" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#222", margin: "0 0 8px", textAlign: "center" }}>{title || t.authWelcome}</h1>
      <p style={{ fontSize: 13, color: "#999", margin: 0, textAlign: "center", lineHeight: 1.6 }}>{subtitle || t.authSub}</p>
    </div>
  );
}

// ─── FormField helper (מחוץ לקומפוננטות כדי שלא ייווצר מחדש בכל render) ──────

export function FormField({ label, type = "text", placeholder, value, onChange, error, children }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <label style={labelStyle}>{label}</label>
      {children || (
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder}
          style={{ ...inputStyle, border: error ? "1px solid #e53935" : "1px solid #e0e0e0", marginBottom: 0 }}
        />
      )}
      {error && <p style={{ fontSize: 11, color: "#e53935", margin: "3px 0 10px" }}>{error}</p>}
      {!error && <div style={{ marginBottom: 14 }} />}
    </div>
  );
}

// ─── AU2. RegisterForm ────────────────────────────────────────────────────────

export function RegisterForm({ onRegistered, onBack }) {
  const { t } = useLang();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", eventDate: "" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = t.valFirstName;
    if (!form.lastName.trim()) e.lastName = t.valLastName;
    if (!form.email.includes("@")) e.email = t.valEmail;
    if (!/^05\d{8}$/.test(form.phone)) e.phone = t.valPhone;
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(form.password)) e.password = t.valPassword;
    if (!form.eventDate) e.eventDate = t.valEventDate;
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    const users = JSON.parse(localStorage.getItem("aros_users") || "[]");
    if (users.find(u => u.email === form.email)) { setErrors({ email: t.authEmailExists }); return; }
    const newUser = { ...form, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem("aros_users", JSON.stringify(users));
    localStorage.setItem("aros_current_user", JSON.stringify(newUser));
    setSuccess(true);
    setTimeout(() => onRegistered(newUser), 1200);
  };

  if (success) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", direction: t.dir }}>
        <p style={{ fontSize: 48 }}>🎉</p>
        <p style={{ fontSize: 18, fontWeight: 800, color: "#222" }}>{t.authSuccess(form.firstName)}</p>
        <p style={{ fontSize: 13, color: "#aaa" }}>{t.authSuccessSub}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 20px 20px", direction: t.dir }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: PINK, fontSize: 14, cursor: "pointer", marginBottom: 16, padding: 0 }}>{t.authBack}</button>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <FormField label={t.authFirstName} value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="נועה" error={errors.firstName} />
        </div>
        <div style={{ flex: 1 }}>
          <FormField label={t.authLastName} value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="כהן" error={errors.lastName} />
        </div>
      </div>
      <FormField label={t.authEmail} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="example@gmail.com" error={errors.email} />
      <FormField label={t.authPhone} type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="05XXXXXXXX" error={errors.phone} />
      <FormField label={t.authPassword} error={errors.password}>
        <div style={{ position: "relative" }}>
          <input type={showPass ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)}
            placeholder={t.authPassHint}
            style={{ ...inputStyle, marginBottom: 0, border: errors.password ? "1px solid #e53935" : "1px solid #e0e0e0" }} />
          <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#bbb" }}>
            {showPass ? "🙈" : "👁️"}
          </button>
        </div>
      </FormField>
      <FormField label={t.authEventDate} type="date" value={form.eventDate} onChange={e => set("eventDate", e.target.value)} error={errors.eventDate} />
      <button onClick={handleSubmit} style={{ width: "100%", background: PINK, color: "#fff", border: "none", borderRadius: 28, padding: "14px 0", fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5 }}>
        {t.authCreate}
      </button>
    </div>
  );
}

// ─── ForgotPassword ──────────────────────────────────────────────────────────
function ForgotPassword({ onBack }) {
  const { t } = useLang();
  const [step, setStep]         = useState("email");   // email | reset | done
  const [email, setEmail]       = useState("");
  const [newPass, setNewPass]   = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showNew, setShowNew]   = useState(false);
  const [showCon, setShowCon]   = useState(false);
  const [error, setError]       = useState("");

  const passOk = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(newPass);

  const handleEmail = () => {
    setError("");
    if (!email.trim()) { setError("יש להזין אימייל"); return; }
    const users = JSON.parse(localStorage.getItem("aros_users") || "[]");
    const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) { setError("אימייל זה לא רשום במערכת"); return; }
    setStep("reset");
  };

  const handleReset = () => {
    setError("");
    if (!passOk) { setError("סיסמה חייבת לכלול לפחות 8 תווים, אותיות ומספרים"); return; }
    if (newPass !== confirm) { setError("הסיסמאות אינן תואמות"); return; }

    const users = JSON.parse(localStorage.getItem("aros_users") || "[]");
    const idx = users.findIndex(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (idx === -1) { setError("משהו השתבש, נסה שוב"); return; }

    users[idx] = { ...users[idx], password: newPass, isTempPassword: false };
    localStorage.setItem("aros_users", JSON.stringify(users));

    // Update current user if same email is logged in
    const current = JSON.parse(localStorage.getItem("aros_current_user") || "null");
    if (current && current.email.toLowerCase() === email.trim().toLowerCase()) {
      localStorage.setItem("aros_current_user", JSON.stringify(users[idx]));
    }

    setStep("done");
  };

  const fieldBox = { marginBottom: 16 };
  const inp = (extra = {}) => ({ ...inputStyle, ...extra });

  if (step === "done") return (
    <div style={{ padding: "32px 20px", textAlign: "center", direction: t.dir }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#222", marginBottom: 8 }}>הסיסמה עודכנה!</h2>
      <p style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>
        כעת תוכל להתחבר עם הסיסמה החדשה שלך
      </p>
      <button onClick={onBack} style={{
        width: "100%", background: PINK, color: "#fff", border: "none",
        borderRadius: 28, padding: "14px 0", fontSize: 16, fontWeight: 700, cursor: "pointer",
      }}>
        חזרה להתחברות
      </button>
    </div>
  );

  return (
    <div style={{ padding: "0 20px", direction: t.dir }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>🔑</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#222", margin: "0 0 6px" }}>
          {step === "email" ? "שחזור סיסמה" : "הגדרת סיסמה חדשה"}
        </h2>
        <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
          {step === "email"
            ? "הזן את האימייל שנרשמת איתו"
            : `מגדיר סיסמה חדשה עבור ${email}`}
        </p>
      </div>

      {/* Step 1 — Email */}
      {step === "email" && (
        <>
          <div style={fieldBox}>
            <label style={labelStyle}>אימייל</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              placeholder="example@gmail.com"
              style={inp({ border: error ? "1px solid #e53935" : "1px solid #e0e0e0" })}
            />
          </div>
          {error && <p style={{ fontSize: 12, color: "#e53935", margin: "-8px 0 14px", textAlign: "center" }}>{error}</p>}
          <button onClick={handleEmail} style={{
            width: "100%", background: PINK, color: "#fff", border: "none",
            borderRadius: 28, padding: "14px 0", fontSize: 16, fontWeight: 700,
            cursor: "pointer", marginBottom: 14,
          }}>
            המשך ←
          </button>
        </>
      )}

      {/* Step 2 — New password */}
      {step === "reset" && (
        <>
          <div style={fieldBox}>
            <label style={labelStyle}>סיסמה חדשה</label>
            <div style={{ position: "relative" }}>
              <input
                type={showNew ? "text" : "password"}
                value={newPass}
                onChange={e => { setNewPass(e.target.value); setError(""); }}
                placeholder="לפחות 8 תווים, אותיות ומספרים"
                style={inp({ marginBottom: 0, border: error && !passOk ? "1px solid #e53935" : newPass && passOk ? "1px solid #22C55E" : "1px solid #e0e0e0" })}
              />
              <button onClick={() => setShowNew(s => !s)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#bbb" }}>
                {showNew ? "🙈" : "👁️"}
              </button>
            </div>
            {newPass && (
              <p style={{ fontSize: 11, margin: "4px 0 0", color: passOk ? "#22C55E" : "#e53935" }}>
                {passOk ? "✓ סיסמה תקינה" : "חייב לכלול אותיות ומספרים, לפחות 8 תווים"}
              </p>
            )}
          </div>

          <div style={fieldBox}>
            <label style={labelStyle}>אישור סיסמה</label>
            <div style={{ position: "relative" }}>
              <input
                type={showCon ? "text" : "password"}
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setError(""); }}
                placeholder="הזן שוב את הסיסמה"
                style={inp({ marginBottom: 0, border: confirm && confirm !== newPass ? "1px solid #e53935" : confirm && confirm === newPass ? "1px solid #22C55E" : "1px solid #e0e0e0" })}
              />
              <button onClick={() => setShowCon(s => !s)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#bbb" }}>
                {showCon ? "🙈" : "👁️"}
              </button>
            </div>
            {confirm && confirm !== newPass && (
              <p style={{ fontSize: 11, margin: "4px 0 0", color: "#e53935" }}>הסיסמאות אינן תואמות</p>
            )}
          </div>

          {error && <p style={{ fontSize: 12, color: "#e53935", margin: "-8px 0 14px", textAlign: "center" }}>{error}</p>}

          <button onClick={handleReset} style={{
            width: "100%", background: PINK, color: "#fff", border: "none",
            borderRadius: 28, padding: "14px 0", fontSize: 16, fontWeight: 700,
            cursor: "pointer", marginBottom: 14,
            opacity: (passOk && confirm === newPass) ? 1 : 0.6,
          }}>
            עדכן סיסמה
          </button>
        </>
      )}

      <button onClick={onBack} style={{
        width: "100%", background: "none", border: "none",
        fontSize: 13, color: "#888", cursor: "pointer", padding: "8px 0",
      }}>
        ← חזרה להתחברות
      </button>
    </div>
  );
}

// ─── AU3. LoginForm ───────────────────────────────────────────────────────────

export function LoginForm({ onLogin, onRegister }) {
  const { t } = useLang();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [forceChange, setForceChange] = useState(null);
  const [forgotMode, setForgotMode]   = useState(false);

  const handleSubmit = () => {
    setError("");
    if (!email || !password) { setError(t.authFillAll); return; }
    const users = JSON.parse(localStorage.getItem("aros_users") || "[]");
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) { setError(t.authWrongCreds); return; }
    localStorage.setItem("aros_current_user", JSON.stringify(user));
    if (user.isVendor && user.isTempPassword) { setForceChange(user); return; }
    onLogin(user);
  };

  if (forceChange) return <ForcePasswordChange user={forceChange} onDone={(u) => onLogin(u)} />;
  if (forgotMode)  return <ForgotPassword onBack={() => setForgotMode(false)} />;

  return (
    <div style={{ padding: "0 20px", direction: t.dir }}>
      <label style={labelStyle}>{t.authEmail}</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@gmail.com"
        style={{ ...inputStyle, border: error ? "1px solid #e53935" : "1px solid #e0e0e0" }} />

      <label style={labelStyle}>{t.authPassword}</label>
      <div style={{ position: "relative", marginBottom: 8 }}>
        <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
          style={{ ...inputStyle, marginBottom: 0, border: error ? "1px solid #e53935" : "1px solid #e0e0e0" }} />
        <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#bbb" }}>
          {showPass ? "🙈" : "👁️"}
        </button>
      </div>

      {error && <p style={{ fontSize: 12, color: "#e53935", margin: "0 0 8px", textAlign: "center" }}>{error}</p>}

      <div style={{ textAlign: "left", marginBottom: 20 }}>
        <span
          onClick={() => setForgotMode(true)}
          style={{ fontSize: 13, color: PINK, cursor: "pointer", fontWeight: 600, textDecoration: "underline" }}
        >
          {t.authForgot}
        </span>
      </div>

      <button onClick={handleSubmit} style={{ width: "100%", background: PINK, color: "#fff", border: "none", borderRadius: 28, padding: "14px 0", fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 16, letterSpacing: 0.5 }}>
        {t.authLogin}
      </button>

      <p style={{ textAlign: "center", fontSize: 13, color: "#888", margin: "0 0 20px" }}>
        {t.authNoAccount}{" "}
        <span onClick={onRegister} style={{ color: PINK, fontWeight: 700, cursor: "pointer" }}>{t.authRegisterLink}</span>
      </p>
    </div>
  );
}

// ─── ForcePasswordChange — vendor must change temp password on first login ────

export function ForcePasswordChange({ user, onDone }) {
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSave = () => {
    setError("");
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(newPass)) {
      setError("הסיסמה חייבת לכלול לפחות 8 תווים, אותיות ומספרים"); return;
    }
    if (newPass !== confirm) {
      setError("הסיסמאות אינן תואמות"); return;
    }

    const updated = { ...user, password: newPass, isTempPassword: false };
    // Update in users array
    try {
      const users = JSON.parse(localStorage.getItem("aros_users") || "[]");
      const idx = users.findIndex(u => u.email === user.email);
      if (idx !== -1) { users[idx] = updated; localStorage.setItem("aros_users", JSON.stringify(users)); }
    } catch {}
    localStorage.setItem("aros_current_user", JSON.stringify(updated));
    setDone(true);
    setTimeout(() => onDone(updated), 1500);
  };

  if (done) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", direction: "rtl" }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🔓</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#222", marginBottom: 6 }}>הסיסמה עודכנה!</h2>
        <p style={{ fontSize: 14, color: "#888" }}>מעביר אותך לאפליקציה...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 20px 40px", direction: "rtl", background: "#fff", minHeight: "60vh" }}>
      {/* Banner */}
      <div style={{
        background: "linear-gradient(135deg, #880E4F 0%, #C2185B 100%)",
        margin: "0 -20px 28px", padding: "28px 20px", color: "#fff", textAlign: "center",
      }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>🔐</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>שינוי סיסמה נדרש</h2>
        <p style={{ fontSize: 13, opacity: 0.88, lineHeight: 1.6 }}>
          זו הכניסה הראשונה שלך כספק.<br />אנא הגדר סיסמה חדשה לחשבון שלך.
        </p>
      </div>

      <div style={{
        background: "#FFF9C4", borderRadius: 12, padding: "12px 14px",
        marginBottom: 20, fontSize: 13, color: "#7B6000", border: "1px solid #FFD700",
      }}>
        ⚠️ אתה מחובר עם סיסמה זמנית. יש לשנות אותה לפני שתמשיך.
      </div>

      <label style={labelStyle}>סיסמה חדשה</label>
      <div style={{ position: "relative", marginBottom: 14 }}>
        <input type={showNew ? "text" : "password"} value={newPass} onChange={e => setNewPass(e.target.value)}
          placeholder="לפחות 8 תווים, אותיות ומספרים"
          style={{ ...inputStyle, border: error ? "1px solid #e53935" : "1px solid #e0e0e0" }} />
        <button onClick={() => setShowNew(s => !s)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#bbb" }}>
          {showNew ? "🙈" : "👁️"}
        </button>
      </div>

      <label style={labelStyle}>אישור סיסמה</label>
      <div style={{ position: "relative", marginBottom: 8 }}>
        <input type={showConfirm ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)}
          placeholder="הזן שוב את הסיסמה"
          style={{ ...inputStyle, border: error ? "1px solid #e53935" : "1px solid #e0e0e0" }} />
        <button onClick={() => setShowConfirm(s => !s)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#bbb" }}>
          {showConfirm ? "🙈" : "👁️"}
        </button>
      </div>

      {/* Strength indicator */}
      {newPass.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: i <= (newPass.length >= 8 && /[A-Za-z]/.test(newPass) && /\d/.test(newPass) ? 4 : newPass.length >= 6 ? 2 : 1) ? PINK : "#eee",
              }} />
            ))}
          </div>
          <p style={{ fontSize: 11, color: "#888" }}>
            {/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(newPass) ? "✅ סיסמה חזקה" : "⚠️ הוסף אותיות ומספרים (מינימום 8 תווים)"}
          </p>
        </div>
      )}

      {error && <p style={{ fontSize: 12, color: "#e53935", margin: "0 0 12px", textAlign: "center" }}>{error}</p>}

      <button onClick={handleSave} style={{
        width: "100%", background: PINK, color: "#fff", border: "none",
        borderRadius: 28, padding: "14px 0", fontSize: 16, fontWeight: 700, cursor: "pointer",
      }}>
        שמור סיסמה והמשך
      </button>
    </div>
  );
}

// ─── AU4. AuthSocial ─────────────────────────────────────────────────────────

export function AuthSocial({ onLogin }) {
  const { t } = useLang();
  const [showAppleModal, setShowAppleModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // ── Apple Sign In handler ──
  const handleApple = async () => {
    // Try real Apple Sign In SDK first (requires Apple Developer credentials + HTTPS)
    if (window.AppleID) {
      try {
        const response = await window.AppleID.auth.signIn();
        const { authorization, user } = response;
        // Extract user info from Apple's response
        const email = user?.email || `apple_${Date.now()}@privaterelay.appleid.com`;
        const firstName = user?.name?.firstName || "Apple";
        const lastName  = user?.name?.lastName  || "User";
        _loginOrCreateAppleUser({ email, firstName, lastName, appleToken: authorization.id_token });
        return;
      } catch (err) {
        // Apple SDK present but login cancelled or failed — show modal
        if (err.error === "popup_closed_by_user") return;
      }
    }
    // Fallback: demo modal
    setShowAppleModal(true);
  };

  const _loginOrCreateAppleUser = ({ email, firstName, lastName, appleToken }) => {
    const users = JSON.parse(localStorage.getItem("aros_users") || "[]");
    let user = users.find(u => u.email === email);
    if (!user) {
      user = {
        firstName, lastName, email,
        phone: "", password: "", eventDate: "",
        isVendor: false, provider: "apple",
        appleToken: appleToken || null,
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      localStorage.setItem("aros_users", JSON.stringify(users));
    }
    localStorage.setItem("aros_current_user", JSON.stringify(user));
    onLogin && onLogin(user);
  };

  return (
    <>
      <div style={{ padding: "0 20px", direction: t.dir }}>
        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0 16px" }}>
          <div style={{ flex: 1, height: 1, background: "#eee" }} />
          <span style={{ fontSize: 12, color: "#ccc", whiteSpace: "nowrap" }}>{t.authOr}</span>
          <div style={{ flex: 1, height: 1, background: "#eee" }} />
        </div>

        {/* Email quick login */}
        <button
          onClick={() => setShowEmailModal(true)}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 10, padding: "13px 0", borderRadius: 14,
            background: "#fff", color: "#333",
            border: "1.5px solid #e0e0e0",
            fontSize: 15, fontWeight: 600, cursor: "pointer",
            marginBottom: 12,
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
          }}
        >
          <svg width="20" height="16" viewBox="0 0 24 19" fill="none">
            <rect x="0.5" y="0.5" width="23" height="18" rx="3.5" stroke="#888"/>
            <path d="M1 1l11 9L23 1" stroke="#888" strokeWidth="1.5"/>
          </svg>
          התחבר עם אימייל
        </button>

        {/* Apple Sign In */}
        <button
          onClick={handleApple}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 10, padding: "13px 0", borderRadius: 14,
            background: "#000", color: "#fff", border: "none",
            fontSize: 15, fontWeight: 600, cursor: "pointer",
            marginBottom: 8, letterSpacing: 0.3,
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          }}
        >
          <svg width="18" height="22" viewBox="0 0 814 1000" fill="white">
            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 405.5 1 264.7 1 206.8c0-154.4 100.6-236.6 198.7-236.6 54 0 98.7 36.9 131.8 36.9 31.7 0 81.3-38.8 143.8-38.8 22.4 0 108.2 2 168.3 77.9zm-143.3-166c13.4-15.5 23.6-37.3 23.6-59.1 0-3-.2-6-.7-8.5-22.4 .9-49 14.9-65.4 32.9-13.3 14.4-25.1 36.3-25.1 58.2 0 3.2 .5 6.4 .7 7.4 1.4 .2 3.5 .5 5.5 .5 20.4 0 44.3-13.6 61.4-31.4z"/>
          </svg>
          התחבר עם Apple
        </button>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <EmailLoginModal
          onLogin={onLogin}
          onClose={() => setShowEmailModal(false)}
        />
      )}

      {/* Apple Demo Modal */}
      {showAppleModal && (
        <AppleLoginModal
          onLogin={_loginOrCreateAppleUser}
          onClose={() => setShowAppleModal(false)}
        />
      )}
    </>
  );
}

// ─── EmailLoginModal ──────────────────────────────────────────────────────────
function EmailLoginModal({ onLogin, onClose }) {
  const { t } = useLang();
  const [step, setStep]           = useState("email"); // email | code | newuser | done
  const [email, setEmail]         = useState("");
  const [code, setCode]           = useState("");
  const [sentCode, setSentCode]   = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [eventDate, setEventDate] = useState("");
  const [error, setError]         = useState("");

  const OVERLAY = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 999, display: "flex", alignItems: "flex-end", justifyContent: "center" };
  const SHEET   = { width: "100%", maxWidth: 480, background: "#fff", borderRadius: "24px 24px 0 0", padding: "28px 24px 40px", direction: "rtl" };

  // Step 1 — check if email exists, generate demo OTP
  const handleEmail = () => {
    setError("");
    if (!email.trim() || !email.includes("@")) { setError("יש להזין אימייל תקין"); return; }
    const users = JSON.parse(localStorage.getItem("aros_users") || "[]");
    const exists = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    // Generate 6-digit OTP (demo: shown on screen since no email server)
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    setSentCode(otp);
    if (exists) {
      setStep("code");
    } else {
      setStep("newuser");
    }
  };

  // Step 2a — verify OTP for existing user
  const handleCode = () => {
    setError("");
    if (code.trim() !== sentCode) { setError("הקוד שגוי, נסה שוב"); return; }
    const users = JSON.parse(localStorage.getItem("aros_users") || "[]");
    const user  = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    localStorage.setItem("aros_current_user", JSON.stringify(user));
    onLogin(user);
    setStep("done");
    setTimeout(onClose, 1400);
  };

  // Step 2b — new user registration via email
  const handleNewUser = () => {
    setError("");
    if (!firstName.trim()) { setError("יש להזין שם פרטי"); return; }
    if (code.trim() !== sentCode) { setError("הקוד שגוי, נסה שוב"); return; }
    const newUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim() || "",
      email: email.trim(),
      phone: "", password: "",
      eventDate: eventDate || "",
      isVendor: false,
      provider: "email_otp",
      createdAt: new Date().toISOString(),
    };
    const users = JSON.parse(localStorage.getItem("aros_users") || "[]");
    users.push(newUser);
    localStorage.setItem("aros_users", JSON.stringify(users));
    localStorage.setItem("aros_current_user", JSON.stringify(newUser));
    onLogin(newUser);
    setStep("done");
    setTimeout(onClose, 1400);
  };

  if (step === "done") return (
    <div style={OVERLAY}>
      <div style={{ ...SHEET, textAlign: "center", paddingTop: 48 }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
        <p style={{ fontSize: 18, fontWeight: 700, color: "#222" }}>התחברת בהצלחה!</p>
      </div>
    </div>
  );

  return (
    <div style={OVERLAY} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={SHEET}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <div style={{ width: 44, height: 44, background: PINK_LIGHT, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="18" viewBox="0 0 24 19" fill="none">
              <rect x="0.5" y="0.5" width="23" height="18" rx="3.5" stroke={PINK} strokeWidth="1.5"/>
              <path d="M1 1l11 9L23 1" stroke={PINK} strokeWidth="1.5"/>
            </svg>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#222" }}>התחברות עם אימייל</p>
            <p style={{ margin: 0, fontSize: 12, color: "#888" }}>
              {step === "email" ? "הזן את כתובת המייל שלך" : step === "code" ? "משתמש קיים — אמת את הקוד" : "משתמש חדש — השלם פרטים"}
            </p>
          </div>
          <button onClick={onClose} style={{ marginRight: "auto", background: "none", border: "none", fontSize: 22, color: "#bbb", cursor: "pointer" }}>✕</button>
        </div>

        {/* Step 1 — Email */}
        {step === "email" && (
          <>
            <label style={labelStyle}>כתובת אימייל</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
              placeholder="example@gmail.com"
              style={{ ...inputStyle, direction: "ltr", textAlign: "left", border: error ? "1px solid #e53935" : "1px solid #e0e0e0" }} />
            {error && <p style={{ fontSize: 12, color: "#e53935", margin: "-8px 0 14px", textAlign: "center" }}>{error}</p>}
            <button onClick={handleEmail} style={{ width: "100%", background: PINK, color: "#fff", border: "none", borderRadius: 14, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
              שלח קוד אימות →
            </button>
          </>
        )}

        {/* Step 2a — OTP for existing user */}
        {step === "code" && (
          <>
            <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: "12px 16px", marginBottom: 16, textAlign: "center" }}>
              <p style={{ margin: "0 0 4px", fontSize: 13, color: "#16A34A", fontWeight: 600 }}>קוד האימות שלך (Demo)</p>
              <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#16A34A", letterSpacing: 6 }}>{sentCode}</p>
              <p style={{ margin: "4px 0 0", fontSize: 11, color: "#888" }}>בפרודקשן הקוד יישלח למייל {email}</p>
            </div>
            <label style={labelStyle}>הזן קוד 6 ספרות</label>
            <input type="text" value={code} onChange={e => { setCode(e.target.value.replace(/\D/g,"")); setError(""); }}
              placeholder="123456" maxLength={6}
              style={{ ...inputStyle, letterSpacing: 8, fontSize: 22, textAlign: "center", direction: "ltr", border: error ? "1px solid #e53935" : "1px solid #e0e0e0" }} />
            {error && <p style={{ fontSize: 12, color: "#e53935", margin: "-8px 0 14px", textAlign: "center" }}>{error}</p>}
            <button onClick={handleCode} style={{ width: "100%", background: PINK, color: "#fff", border: "none", borderRadius: 14, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
              אמת והתחבר
            </button>
          </>
        )}

        {/* Step 2b — New user */}
        {step === "newuser" && (
          <>
            <div style={{ background: "#FFF8FA", border: `1px solid ${PINK_LIGHT}`, borderRadius: 12, padding: "10px 14px", marginBottom: 16 }}>
              <p style={{ margin: 0, fontSize: 13, color: PINK, fontWeight: 600 }}>📧 כתובת חדשה — נרשמים עכשיו!</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#888" }}>הזן את הקוד שנשלח + פרטים קצרים</p>
            </div>
            <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: "10px 14px", marginBottom: 16, textAlign: "center" }}>
              <p style={{ margin: "0 0 2px", fontSize: 12, color: "#16A34A", fontWeight: 600 }}>קוד האימות שלך (Demo)</p>
              <p style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#16A34A", letterSpacing: 6 }}>{sentCode}</p>
            </div>
            <label style={labelStyle}>קוד אימות</label>
            <input type="text" value={code} onChange={e => { setCode(e.target.value.replace(/\D/g,"")); setError(""); }}
              placeholder="123456" maxLength={6}
              style={{ ...inputStyle, letterSpacing: 6, fontSize: 20, textAlign: "center", direction: "ltr" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>שם פרטי *</label>
                <input value={firstName} onChange={e => { setFirstName(e.target.value); setError(""); }}
                  placeholder="ישראל" style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>שם משפחה</label>
                <input value={lastName} onChange={e => setLastName(e.target.value)}
                  placeholder="ישראלי" style={inputStyle} />
              </div>
            </div>
            <label style={labelStyle}>📅 תאריך האירוע (אופציונלי)</label>
            <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} style={inputStyle} />
            {error && <p style={{ fontSize: 12, color: "#e53935", margin: "-8px 0 14px", textAlign: "center" }}>{error}</p>}
            <button onClick={handleNewUser} style={{ width: "100%", background: PINK, color: "#fff", border: "none", borderRadius: 14, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
              צור חשבון והתחבר
            </button>
          </>
        )}

        <button onClick={onClose} style={{ width: "100%", background: "none", border: "none", fontSize: 13, color: "#bbb", cursor: "pointer", padding: "6px 0" }}>
          ביטול
        </button>
      </div>
    </div>
  );
}

// ─── AppleLoginModal ──────────────────────────────────────────────────────────
function AppleLoginModal({ onLogin, onClose }) {
  const [email, setEmail]         = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [step, setStep]           = useState("info"); // info | form | done
  const [error, setError]         = useState("");

  const handleContinue = () => {
    setError("");
    if (!email.trim() || !email.includes("@")) { setError("יש להזין אימייל תקין"); return; }
    if (!firstName.trim()) { setError("יש להזין שם פרטי"); return; }
    onLogin({ email: email.trim(), firstName: firstName.trim(), lastName: lastName.trim() });
    setStep("done");
    setTimeout(onClose, 1500);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
      zIndex: 999, display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        width: "100%", maxWidth: 480,
        background: "#fff", borderRadius: "24px 24px 0 0",
        padding: "28px 24px 40px", direction: "rtl",
        animation: "slideUp 0.25s ease",
      }}>
        {step === "done" ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#222" }}>התחברת בהצלחה!</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, background: "#000", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="24" viewBox="0 0 814 1000" fill="white">
                  <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 405.5 1 264.7 1 206.8c0-154.4 100.6-236.6 198.7-236.6 54 0 98.7 36.9 131.8 36.9 31.7 0 81.3-38.8 143.8-38.8 22.4 0 108.2 2 168.3 77.9zm-143.3-166c13.4-15.5 23.6-37.3 23.6-59.1 0-3-.2-6-.7-8.5-22.4 .9-49 14.9-65.4 32.9-13.3 14.4-25.1 36.3-25.1 58.2 0 3.2 .5 6.4 .7 7.4 1.4 .2 3.5 .5 5.5 .5 20.4 0 44.3-13.6 61.4-31.4z"/>
                </svg>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#222" }}>התחברות עם Apple ID</p>
                <p style={{ margin: 0, fontSize: 12, color: "#888" }}>הזן את פרטי Apple ID שלך</p>
              </div>
              <button onClick={onClose} style={{ marginRight: "auto", background: "none", border: "none", fontSize: 22, color: "#bbb", cursor: "pointer", lineHeight: 1 }}>✕</button>
            </div>

            {/* Form */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>Apple ID (אימייל)</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder="name@icloud.com"
                style={{ ...inputStyle, direction: "ltr", textAlign: "left" }}
              />
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>שם פרטי</label>
                <input value={firstName} onChange={e => { setFirstName(e.target.value); setError(""); }} placeholder="ישראל"
                  style={{ ...inputStyle, marginBottom: 0 }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>שם משפחה</label>
                <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="ישראלי"
                  style={{ ...inputStyle, marginBottom: 0 }} />
              </div>
            </div>

            {error && <p style={{ fontSize: 12, color: "#e53935", margin: "0 0 12px", textAlign: "center" }}>{error}</p>}

            <button onClick={handleContinue} style={{
              width: "100%", background: "#000", color: "#fff", border: "none",
              borderRadius: 14, padding: "14px 0", fontSize: 15, fontWeight: 700,
              cursor: "pointer", marginBottom: 10,
            }}>
              המשך
            </button>

            <p style={{ fontSize: 11, color: "#bbb", textAlign: "center", lineHeight: 1.6, margin: 0 }}>
              🔒 הנתונים נשמרים רק במכשיר זה. בסביבת פרודקשן, Apple Sign In מאמת ב-server.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── AU5. AuthVendorBanner ────────────────────────────────────────────────────

export function AuthVendorBanner({ onVendorRegister }) {
  const { t } = useLang();
  return (
    <div style={{ margin: "24px 20px 0", background: PINK_LIGHT, borderRadius: 16, padding: "18px 16px", direction: t.dir, border: `1px solid #f8bbd0` }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: "#880E4F", margin: "0 0 6px" }}>{t.authVendorTitle}</p>
      <p style={{ fontSize: 12, color: "#c2185b", margin: "0 0 14px", lineHeight: 1.5 }}>{t.authVendorText}</p>
      <button
        onClick={onVendorRegister}
        style={{ background: "#fff", color: PINK, border: `1.5px solid ${PINK}`, borderRadius: 22, padding: "9px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
        {t.authVendorCTA}
      </button>
    </div>
  );
}

// ─── AU6. VendorRegisterForm ──────────────────────────────────────────────────

const VENDOR_CATEGORIES = ["אולם שמחות","צילום","קייטרינג","מוזיקה","DJ","פרחים","שמלות כלה","הגברה","עיצוב","כיבוד","הסעות","אחר"];
const ISRAEL_CITIES = ["תל אביב","ירושלים","חיפה","ראשון לציון","פתח תקווה","אשדוד","נתניה","באר שבע","בני ברק","רמת גן","הרצליה","חולון","רעננה","כפר סבא","מודיעין","אשקלון","רחובות","בת ים","נס ציונה","לוד","כרמיאל","עכו","נהריה","טבריה","אילת","כל הארץ"];

export function VendorField({ label, error, children }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>{label}</label>
      {children}
      {error && <p style={{ fontSize: 11, color: "#e53935", margin: "3px 0 10px" }}>{error}</p>}
      {!error && <div style={{ marginBottom: 14 }} />}
    </div>
  );
}

export function VendorRegisterForm({ onBack }) {
  const { t } = useLang();
  const [form, setForm] = useState({
    firstName: "", lastName: "", businessName: "", category: "",
    phone: "", email: "", city: "", website: "", description: "",
    yearsActive: "", instagram: "",
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("form"); // "form" | "sent"

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "שם פרטי חובה";
    if (!form.lastName.trim()) e.lastName = "שם משפחה חובה";
    if (!form.businessName.trim()) e.businessName = "שם העסק חובה";
    if (!form.category) e.category = "יש לבחור קטגוריה";
    if (!form.email.includes("@")) e.email = "אימייל לא תקין";
    if (!/^05\d{8}$/.test(form.phone)) e.phone = "מספר טלפון לא תקין (05XXXXXXXX)";
    if (!form.city) e.city = "יש לבחור עיר";
    if (!form.description.trim() || form.description.length < 20) e.description = "יש לכתוב תיאור של לפחות 20 תווים";
    return e;
  };

  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSending(true);

    // Save to localStorage
    const requests = JSON.parse(localStorage.getItem("aros_vendor_requests") || "[]");
    const req = { ...form, id: Date.now(), status: "pending", submittedAt: new Date().toISOString() };
    requests.push(req);
    localStorage.setItem("aros_vendor_requests", JSON.stringify(requests));

    // Send email via EmailJS (free tier — no server needed)
    try {
      // emailjs not configured in dev mode
    } catch (err) {
      console.warn("EmailJS error (continuing anyway):", err);
      // We still show success — request is saved locally
    }

    setSending(false);
    setStep("sent");
  };

  if (step === "sent") {
    return (
      <div style={{ padding: "50px 24px", textAlign: "center", direction: t.dir, background: "#fff", minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

        {/* Success icon with animated circle */}
        <div style={{
          width: 100, height: 100, borderRadius: "50%",
          background: "#F0FDF4", border: "3px solid #22C55E",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 48, marginBottom: 24,
        }}>✅</div>

        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#222", marginBottom: 10 }}>
          הבקשה נשלחה בהצלחה!
        </h2>
        <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, marginBottom: 6, maxWidth: 320 }}>
          תודה <strong>{form.firstName}</strong>, קיבלנו את בקשתך לפתיחת פרופיל עבור <strong>{form.businessName}</strong>.
        </p>
        <p style={{ fontSize: 14, color: "#888", lineHeight: 1.7, marginBottom: 20, maxWidth: 320 }}>
          נחזור אליך בהקדם לכתובת <span style={{ color: PINK, fontWeight: 600 }}>{form.email}</span> עם סיסמה לכניסה.
        </p>

        {/* Steps */}
        <div style={{ background: PINK_LIGHT, borderRadius: 14, padding: "16px 20px", border: `1px solid #f8bbd0`, marginBottom: 28, textAlign: "right", width: "100%", maxWidth: 340 }}>
          {[
            "✅ הבקשה נשמרה במערכת",
            "📧 תקבל מייל תוך 2–3 ימי עסקים",
            "🔐 תתחבר עם הסיסמה הזמנית",
            "🚀 תשנה סיסמה ותתחיל לפרסם",
          ].map((s, i) => (
            <p key={i} style={{ fontSize: 13, color: "#c2185b", lineHeight: 1.9 }}>{s}</p>
          ))}
        </div>

        <button onClick={onBack} style={{
          background: PINK, color: "#fff", border: "none",
          borderRadius: 28, padding: "13px 36px",
          fontSize: 15, fontWeight: 700, cursor: "pointer",
        }}>חזרה לדף הכניסה</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 20px 30px", direction: t.dir, background: "#fff" }}>
      {/* Progress indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "12px 0" }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: PINK, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>1</div>
        <div style={{ flex: 1, height: 2, background: "#eee", borderRadius: 2 }} />
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#eee", color: "#bbb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>2</div>
        <p style={{ fontSize: 12, color: "#bbb", marginRight: 4 }}>אישור מהצוות</p>
      </div>

      {/* ── Personal details ── */}
      <p style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>פרטים אישיים</p>

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <VendorField label="שם פרטי *" error={errors.firstName}>
            <input value={form.firstName} onChange={e => set("firstName", e.target.value)}
              placeholder="ישראל" style={{ ...vinputStyle, border: errors.firstName ? "1px solid #e53935" : "1px solid #e0e0e0" }} />
          </VendorField>
        </div>
        <div style={{ flex: 1 }}>
          <VendorField label="שם משפחה *" error={errors.lastName}>
            <input value={form.lastName} onChange={e => set("lastName", e.target.value)}
              placeholder="ישראלי" style={{ ...vinputStyle, border: errors.lastName ? "1px solid #e53935" : "1px solid #e0e0e0" }} />
          </VendorField>
        </div>
      </div>

      <VendorField label="אימייל *" error={errors.email}>
        <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
          placeholder="israel@mybusiness.co.il" style={{ ...vinputStyle, border: errors.email ? "1px solid #e53935" : "1px solid #e0e0e0" }} />
      </VendorField>

      <VendorField label="מספר טלפון *" error={errors.phone}>
        <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
          placeholder="05XXXXXXXX" style={{ ...vinputStyle, border: errors.phone ? "1px solid #e53935" : "1px solid #e0e0e0" }} />
      </VendorField>

      {/* ── Business details ── */}
      <div style={{ height: 1, background: "#f0f0f0", margin: "6px 0 18px" }} />
      <p style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>פרטי העסק</p>

      <VendorField label="שם העסק *" error={errors.businessName}>
        <input value={form.businessName} onChange={e => set("businessName", e.target.value)}
          placeholder='גן האירועים "שם העסק"' style={{ ...vinputStyle, border: errors.businessName ? "1px solid #e53935" : "1px solid #e0e0e0" }} />
      </VendorField>

      <VendorField label="קטגוריה *" error={errors.category}>
        <select value={form.category} onChange={e => set("category", e.target.value)}
          style={{ ...vinputStyle, cursor: "pointer", border: errors.category ? "1px solid #e53935" : "1px solid #e0e0e0" }}>
          <option value="">בחר קטגוריה...</option>
          {VENDOR_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </VendorField>

      <VendorField label="עיר / אזור פעילות *" error={errors.city}>
        <select value={form.city} onChange={e => set("city", e.target.value)}
          style={{ ...vinputStyle, cursor: "pointer", border: errors.city ? "1px solid #e53935" : "1px solid #e0e0e0" }}>
          <option value="">בחר עיר...</option>
          {ISRAEL_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </VendorField>

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <VendorField label="שנות ניסיון" error={null}>
            <input type="number" min="0" max="50" value={form.yearsActive} onChange={e => set("yearsActive", e.target.value)}
              placeholder="5" style={vinputStyle} />
          </VendorField>
        </div>
        <div style={{ flex: 1 }}>
          <VendorField label="אינסטגרם (אופציונלי)" error={null}>
            <input value={form.instagram} onChange={e => set("instagram", e.target.value)}
              placeholder="@mybusiness" style={vinputStyle} />
          </VendorField>
        </div>
      </div>

      <VendorField label="אתר אינטרנט (אופציונלי)" error={null}>
        <input type="url" value={form.website} onChange={e => set("website", e.target.value)}
          placeholder="https://www.mybusiness.co.il" style={vinputStyle} />
      </VendorField>

      <VendorField label="תיאור העסק *" error={errors.description}>
        <textarea value={form.description} onChange={e => set("description", e.target.value)}
          placeholder="ספרו על העסק שלכם, הניסיון, הסגנון, ומה מייחד אתכם מספקים אחרים..."
          rows={4} style={{ ...vinputStyle, resize: "vertical", border: errors.description ? "1px solid #e53935" : "1px solid #e0e0e0" }} />
        <p style={{ fontSize: 11, color: "#bbb", textAlign: "left", marginTop: -10 }}>{form.description.length} / 500</p>
      </VendorField>

      {/* ── Disclaimer ── */}
      <div style={{ background: "#F8F8F8", borderRadius: 12, padding: "12px 14px", marginBottom: 20, fontSize: 12, color: "#888", lineHeight: 1.6 }}>
        📋 הגשת הבקשה אינה מבטיחה אישור. הצוות שלנו יבחן את הפרטים ויחזור אליך תוך 2–3 ימי עסקים לכתובת האימייל שהזנת.
      </div>

      <button onClick={handleSubmit} disabled={sending} style={{
        width: "100%", background: sending ? "#e0a0b8" : PINK, color: "#fff",
        border: "none", borderRadius: 28, padding: "15px 0",
        fontSize: 16, fontWeight: 700, cursor: sending ? "not-allowed" : "pointer", letterSpacing: 0.5,
      }}>
        {sending ? "⏳ שולח..." : "📤 שלח בקשה לפתיחת פרופיל ספק"}
      </button>
    </div>
  );
}

// ─── AuthScreen (מסך מלא) ─────────────────────────────────────────────────────

export function AuthScreen({ onLogin }) {
  const { t } = useLang();
  const [mode, setMode] = useState("login"); // "login" | "register" | "vendor"

  useEffect(() => {
    const saved = localStorage.getItem("aros_current_user");
    if (saved) { try { onLogin(JSON.parse(saved)); } catch {} }
  }, []);

  if (mode === "register") {
    return (
      <div style={{ background: "#fff", minHeight: "100vh", direction: t.dir, paddingBottom: 80 }}>
        <AuthHero title={t.authRegisterTitle} subtitle={t.authRegisterSub} />
        <RegisterForm onRegistered={(user) => { setMode("login"); onLogin(user); }} onBack={() => setMode("login")} />
      </div>
    );
  }

  if (mode === "vendor") {
    return (
      <div style={{ background: "#fff", minHeight: "100vh", direction: t.dir, paddingBottom: 80 }}>
        {/* Vendor register header */}
        <div style={{
          background: `linear-gradient(135deg, #880E4F 0%, ${PINK} 100%)`,
          padding: "28px 16px 24px", direction: t.dir, color: "#fff",
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
        }}>
          <span style={{ fontSize: 44, marginBottom: 10 }}>🏢</span>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 8px" }}>הצטרפות כספק</h1>
          <p style={{ fontSize: 13, opacity: 0.88, lineHeight: 1.6 }}>
            מלא את הפרטים ונחזור אליך עם סיסמה לכניסה לאפליקציה
          </p>
          <button onClick={() => setMode("login")} style={{
            marginTop: 14, background: "rgba(255,255,255,0.18)", color: "#fff",
            border: "1px solid rgba(255,255,255,0.4)", borderRadius: 20,
            padding: "6px 16px", fontSize: 13, cursor: "pointer",
          }}>← חזרה לכניסה</button>
        </div>
        <VendorRegisterForm onBack={() => setMode("login")} />
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", minHeight: "100vh", direction: t.dir, paddingBottom: 80 }}>
      <AuthHero />
      <LoginForm onLogin={onLogin} onRegister={() => setMode("register")} />
      <AuthSocial onLogin={onLogin} />
      <AuthVendorBanner onVendorRegister={() => setMode("vendor")} />
    </div>
  );
}
