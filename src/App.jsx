import { useState, useEffect, Component } from 'react';
import { LangContext } from './context/LangContext';

class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) return (
      <div style={{ padding: 24, color: 'red', fontFamily: 'monospace', direction: 'ltr' }}>
        <strong>Error:</strong> {this.state.error.message}<br/>
        <pre style={{ fontSize: 11, whiteSpace: 'pre-wrap' }}>{this.state.error.stack}</pre>
      </div>
    );
    return this.props.children;
  }
}
import { TRANSLATIONS } from './i18n';
import { useResponsive } from './hooks/useResponsive';
import { Header } from './components/Header/Header';
import { BottomNav } from './components/BottomNav/BottomNav';
import { HeroSection, CategoryBar, PromoBanner, VendorList } from './screens/HomeScreen/HomeScreen';
import { FavoritesHeader, FavoriteVendorList } from './screens/FavoritesScreen/FavoritesScreen';
import { DealsScreen, DealProfileScreen } from './screens/DealsScreen/DealsScreen';
import { UserProfileScreen } from './screens/ProfileScreen/ProfileScreen';
import { VendorProfileScreen } from './screens/VendorProfileScreen/VendorProfileScreen';
import { AuthScreen } from './screens/AuthScreen/AuthScreen';

const ROUTES = {
  "/":          { screen: 0 },
  "/favorites": { screen: 1 },
  "/deals":     { screen: 2 },
  "/profile":   { screen: 3 },
};

function getInitialRoute() {
  const hash = window.location.hash.replace("#", "") || "/";
  if (hash.startsWith("/vendor/")) return { screen: "vendor", slug: hash.replace("/vendor/", "") };
  if (hash.startsWith("/deal/")) return { screen: 2 }; // stay on deals screen; deal detail is in state
  return ROUTES[hash] || { screen: 0 };
}

function pushRoute(path) {
  window.location.hash = path;
}

// ─── App ──────────────────────────────────────────────────────────────────────

// Seed demo vendor so AREEN ARA can always log in

(function seedDemoVendor() {
  try {
    const users = JSON.parse(localStorage.getItem("aros_users") || "[]");
    const exists = users.find(u => u.email === "areen@aros-demo.com");
    if (!exists) {
      users.push({
        firstName: "AREEN",
        lastName: "ARA",
        email: "areen@aros-demo.com",
        phone: "0500000000",
        password: "123AAA",
        eventDate: "",
        isVendor: true,
        isTempPassword: false,
        businessName: "AREEN ARA Studio",
        category: "צילום",
        city: "תל אביב",
        createdAt: new Date().toISOString(),
        avatar: null,
      });
      localStorage.setItem("aros_users", JSON.stringify(users));
    }
  } catch {}
})();

export default
function App() {
  const initial = getInitialRoute();
  const [screen, setScreen] = useState(initial.screen);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [prevScreen, setPrevScreen] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("aros_current_user"));
  const [favoritesFilter, setFavoritesFilter] = useState("ALL");
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("aros_current_user") || "null"); } catch { return null; }
  });

  // favorites keyed per user email — loaded on mount / user change
  const favKey = currentUser ? `aros_favorites_${currentUser.email}` : null;
  const [favorites, setFavorites] = useState(() => {
    if (!favKey) return [];
    try { return JSON.parse(localStorage.getItem(favKey) || "[]"); } catch { return []; }
  });

  // Persist favorites whenever they change
  useEffect(() => {
    if (favKey) localStorage.setItem(favKey, JSON.stringify(favorites));
  }, [favorites, favKey]);

  // Reload favorites when the logged-in user changes
  useEffect(() => {
    if (favKey) {
      try { setFavorites(JSON.parse(localStorage.getItem(favKey) || "[]")); } catch { setFavorites([]); }
    } else {
      setFavorites([]);
    }
  }, [favKey]);

  // sync hash → state when user presses back/forward
  useEffect(() => {
    const onHash = () => {
      const r = getInitialRoute();
      if (r.screen !== "vendor") setSelectedVendor(null);
      // Don't reset if we're navigating to a deal detail (managed by state)
      if (window.location.hash.startsWith("#/deal/")) return;
      setScreen(r.screen);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (s, path) => {
    setScreen(s);
    pushRoute(path);
  };

  const goToVendor = (vendor) => {
    setPrevScreen(screen);
    setSelectedVendor(vendor);
    const slug = vendor.id || encodeURIComponent(vendor.title);
    pushRoute(`/vendor/${slug}`);
    setScreen("vendor");
  };

  const goBack = () => {
    const paths = ["/", "/favorites", "/deals", "/profile"];
    pushRoute(paths[prevScreen] || "/");
    setScreen(prevScreen);
  };

  const handleToggleFavorite = (vendor) => {
    const isFav = favorites.some(f => f.title === vendor.title);
    if (isFav) {
      setFavorites(prev => prev.filter(f => f.title !== vendor.title));
    } else {
      setFavorites(prev => [...prev, vendor]);
      // Navigate to favorites screen automatically
      navigate(1, "/favorites");
    }
  };

  const renderScreen = () => {
    if (screen === "vendor" && selectedVendor) {
      return <VendorProfileScreen vendor={selectedVendor} onBack={goBack} isLoggedIn={isLoggedIn} currentUser={currentUser} />;
    }
    if (screen === "deal" && selectedDeal) {
      return <DealProfileScreen deal={selectedDeal} isLoggedIn={isLoggedIn} onBack={() => { setScreen(2); setSelectedDeal(null); pushRoute("/deals"); }} onNavigateToAuth={() => navigate(3, "/profile")} />;
    }
    switch (screen) {
      case 1: return (
        <>
          <FavoritesHeader
            activeFilter={favoritesFilter}
            onFilterChange={setFavoritesFilter}
            favorites={favorites}
          />
          <FavoriteVendorList
            favorites={favorites}
            activeFilter={favoritesFilter}
            onRemoveFavorite={(title) => setFavorites(prev => prev.filter(f => f.title !== title))}
            onViewVendor={goToVendor}
          />
        </>
      );
      case 2: return (
        <DealsScreen
          isLoggedIn={isLoggedIn}
          onNavigateToAuth={() => navigate(3, "/profile")}
          onViewDeal={(deal) => {
            if (!isLoggedIn) { navigate(3, "/profile"); return; }
            setPrevScreen(2);
            setSelectedDeal(deal);
            setScreen("deal");
            pushRoute(`/deal/${deal.id}`);
          }}
        />
      );
      case 3: return (
        <ErrorBoundary key="profile">
          {isLoggedIn && currentUser
            ? <UserProfileScreen
                user={currentUser}
                onUserUpdate={(u) => { setCurrentUser(u); localStorage.setItem("aros_current_user", JSON.stringify(u)); }}
                onLogout={() => {
                  localStorage.removeItem("aros_current_user");
                  setIsLoggedIn(false);
                  setCurrentUser(null);
                  setFavorites([]);
                  navigate(0, "/");
                }}
              />
            : <AuthScreen onLogin={(user) => { localStorage.setItem("aros_current_user", JSON.stringify(user)); setIsLoggedIn(true); setCurrentUser(user); navigate(0, "/"); }} />
          }
        </ErrorBoundary>
      );
      default: return (
        <>
          <HeroSection searchQuery={searchQuery} onSearchChange={(q) => { setSearchQuery(q); if (q) setActiveCategory(null); }} />
          <CategoryBar activeCategory={activeCategory} onCategoryChange={(c) => { setActiveCategory(c); setSearchQuery(""); }} />
          {!isLoggedIn && <PromoBanner onNavigateToProfile={() => navigate(3, "/profile")} />}
          <VendorList
            onViewVendor={goToVendor}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        </>
      );
    }
  };

  const lang = currentUser?.lang || "he";
  const t = TRANSLATIONS[lang] || TRANSLATIONS.he;

  const navIndex = typeof screen === "number" ? screen : -1;
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const isMobileOrTablet = isMobile || isTablet;

  return (
    <LangContext.Provider value={{ t, lang }}>
    <div style={{
      marginRight: isDesktop ? 220 : 0,
      background: "#FAFAFA",
      minHeight: "100vh",
      paddingBottom: !isDesktop ? 80 : 0,
      direction: t.dir,
    }}>
      <Header onNavigate={(s) => {
        const paths = ["/", "/favorites", "/deals", "/profile"];
        navigate(s, paths[s] || "/");
      }} currentUser={currentUser} />
      {renderScreen()}
      {screen !== "vendor" && (
        <BottomNav
          active={navIndex}
          onNavigate={(s) => {
            const paths = ["/", "/favorites", "/deals", "/profile"];
            navigate(s, paths[s] || "/");
          }}
        />
      )}
    </div>
    </LangContext.Provider>
  );
}
