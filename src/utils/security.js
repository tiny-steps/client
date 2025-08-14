import CryptoJS from "crypto-js";

// ========================
// 1. CLIENT-SIDE ENCRYPTION
// ========================

export const encryptData = (data, key) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      key
    ).toString();
    return encrypted;
  } catch (error) {
    console.error("Encryption failed:", error);
    return null;
  }
};

export const decryptData = (encryptedData, key) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};

// ========================
// 2. DEVICE FINGERPRINTING
// ========================

export const generateDeviceFingerprint = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "top";
  ctx.font = "14px Arial";
  ctx.fillText("Device fingerprint text", 2, 2);

  const canvasFingerprint = canvas.toDataURL();

  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvas: canvasFingerprint,
    webgl: getWebGLFingerprint(),
    fonts: getFontFingerprint(),
    plugins: getPluginFingerprint(),
  };

  return CryptoJS.SHA256(JSON.stringify(fingerprint)).toString();
};

const getWebGLFingerprint = () => {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return "no-webgl";

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    return {
      vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
      renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
    };
  } catch (e) {
    return "webgl-error";
  }
};

const getFontFingerprint = () => {
  const testFonts = [
    "Arial",
    "Helvetica",
    "Times",
    "Courier",
    "Verdana",
    "Georgia",
  ];
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  return testFonts
    .map((font) => {
      ctx.font = `12px ${font}`;
      const width = ctx.measureText("Font test").width;
      return `${font}:${width}`;
    })
    .join(",");
};

const getPluginFingerprint = () => {
  return Array.from(navigator.plugins)
    .map((plugin) => plugin.name)
    .sort()
    .join(",");
};

// ========================
// 3. TIME-BASED ROTATING KEYS
// ========================

export const generateTimeBasedKey = (intervalMinutes = 360) => {
  const now = Date.now();
  const interval = intervalMinutes * 60 * 1000;
  const timeSlot = Math.floor(now / interval);
  return CryptoJS.SHA256(`time-key-${timeSlot}`).toString();
};

export const getKeyRotationTimestamp = (intervalMinutes = 360) => {
  const now = Date.now();
  const interval = intervalMinutes * 60 * 1000;
  return Math.floor(now / interval) * interval;
};

// ========================
// 4. FRAGMENTED STORAGE
// ========================

export const fragmentData = (data, fragments = 3) => {
  const dataString = JSON.stringify(data);
  const fragmentSize = Math.ceil(dataString.length / fragments);
  const fragmentedData = [];

  for (let i = 0; i < fragments; i++) {
    const start = i * fragmentSize;
    const end = start + fragmentSize;
    fragmentedData.push(dataString.slice(start, end));
  }

  return fragmentedData;
};

export const reconstructData = (fragments) => {
  try {
    const reconstructed = fragments.join("");
    return JSON.parse(reconstructed);
  } catch (error) {
    console.error("Data reconstruction failed:", error);
    return null;
  }
};

export const storeFragmentedData = (key, data, encrypt = true) => {
  const fragments = fragmentData(data);
  const deviceKey = generateDeviceFingerprint();
  const timeKey = generateTimeBasedKey();
  const masterKey = CryptoJS.SHA256(deviceKey + timeKey).toString();

  fragments.forEach((fragment, index) => {
    const fragmentKey = `${key}_fragment_${index}`;
    const storageType = index % 3; // Rotate storage types

    const processedFragment = encrypt
      ? encryptData(fragment, masterKey)
      : fragment;

    switch (storageType) {
      case 0:
        localStorage.setItem(fragmentKey, processedFragment);
        break;
      case 1:
        sessionStorage.setItem(fragmentKey, processedFragment);
        break;
      case 2:
        // Store in memory (will be lost on refresh)
        window[`__secure_${fragmentKey}`] = processedFragment;
        break;
    }
  });

  // Store metadata
  localStorage.setItem(
    `${key}_meta`,
    JSON.stringify({
      fragments: fragments.length,
      encrypted: encrypt,
      timestamp: Date.now(),
    })
  );
};

export const retrieveFragmentedData = (key) => {
  try {
    const meta = JSON.parse(localStorage.getItem(`${key}_meta`) || "{}");
    if (!meta.fragments) return null;

    const fragments = [];
    const deviceKey = generateDeviceFingerprint();
    const timeKey = generateTimeBasedKey();
    const masterKey = CryptoJS.SHA256(deviceKey + timeKey).toString();

    for (let i = 0; i < meta.fragments; i++) {
      const fragmentKey = `${key}_fragment_${i}`;
      const storageType = i % 3;

      let fragment;
      switch (storageType) {
        case 0:
          fragment = localStorage.getItem(fragmentKey);
          break;
        case 1:
          fragment = sessionStorage.getItem(fragmentKey);
          break;
        case 2:
          fragment = window[`__secure_${fragmentKey}`];
          break;
      }

      if (!fragment) return null;

      const processedFragment = meta.encrypted
        ? decryptData(fragment, masterKey)
        : fragment;
      fragments.push(processedFragment);
    }

    return reconstructData(fragments);
  } catch (error) {
    console.error("Fragment retrieval failed:", error);
    return null;
  }
};

// ========================
// 5. DECOY DATA + HONEYPOTS
// ========================

export const generateDecoyData = () => ({
  // Fake user data
  fakeUser: {
    id: "decoy_user_" + Math.random().toString(36),
    email: "decoy@fake-email.com",
    name: "Decoy User",
    role: "ADMIN", // Tempting fake role
    token: "fake_jwt_token_" + Math.random().toString(36),
    secret: "fake_secret_key_123",
  },

  // Fake API endpoints
  fakeEndpoints: [
    "/api/admin/users",
    "/api/secret/data",
    "/api/internal/config",
  ],

  // Fake configuration
  fakeConfig: {
    apiUrl: "https://fake-api.com",
    secretKey: "fake_secret_12345",
    adminPassword: "fake_admin_pass",
  },
});

export const deployHoneypots = () => {
  const decoyData = generateDecoyData();

  // Store decoy data in obvious places
  localStorage.setItem("user_token", decoyData.fakeUser.token);
  localStorage.setItem("admin_secret", decoyData.fakeConfig.secretKey);
  localStorage.setItem("api_config", JSON.stringify(decoyData.fakeConfig));

  // Create fake global variables
  window.__SECRET_TOKEN__ = decoyData.fakeUser.token;
  window.__ADMIN_KEY__ = decoyData.fakeConfig.adminPassword;

  // Monitor access to honeypots
  Object.defineProperty(window, "__SECRET_TOKEN__", {
    get() {
      triggerSecurityAlert("Honeypot accessed: __SECRET_TOKEN__");
      return decoyData.fakeUser.token;
    },
  });

  return decoyData;
};

export const triggerSecurityAlert = (message) => {
  console.warn("🚨 SECURITY ALERT:", message);

  // Send alert to backend
  fetch("/api/security/alert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      alert: message,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }),
  }).catch(() => {}); // Fail silently
};

// ========================
// 6. ZERO-KNOWLEDGE ARCHITECTURE
// ========================

export const sanitizeForStorage = (data) => {
  // Remove sensitive fields before storage
  const { password, token, ssn, creditCard, ...safe } = data;
  return safe;
};

export const createDataTiers = (userData) => ({
  // TIER 0: Public (never encrypted)
  public: {
    isAuthenticated: true,
    theme: userData.theme || "light",
    language: userData.language || "en",
  },

  // TIER 1: Low sensitivity (device encrypted only)
  lowSensitive: sanitizeForStorage({
    userId: userData.id,
    displayName: userData.name?.split(" ")[0], // First name only
    avatar: userData.avatar,
    role: userData.role,
  }),

  // TIER 2: Medium sensitivity (device + time encrypted)
  mediumSensitive: {
    preferences: userData.preferences,
    lastLogin: userData.lastLogin,
    activitySummary: userData.recentActivity?.slice(0, 5), // Limited recent activity
  },

  // TIER 3: High sensitivity (never stored, fetch on-demand)
  // Full name, email, phone, address, medical data, payment info
  highSensitive: null, // Never store in frontend
});

// ========================
// MASTER SECURITY CONTROLLER
// ========================

export const secureStore = {
  init() {
    deployHoneypots();
    this.deviceKey = generateDeviceFingerprint();
    this.timeKey = generateTimeBasedKey();
    console.log("🔒 Security fortress initialized");
  },

  store(key, data, tier = "medium") {
    const tieredData = createDataTiers(data);

    switch (tier) {
      case "public":
        localStorage.setItem(key, JSON.stringify(tieredData.public));
        break;

      case "low":
        const lowKey = CryptoJS.SHA256(this.deviceKey).toString();
        const encryptedLow = encryptData(tieredData.lowSensitive, lowKey);
        localStorage.setItem(`${key}_low`, encryptedLow);
        break;

      case "medium":
        const mediumKey = CryptoJS.SHA256(
          this.deviceKey + this.timeKey
        ).toString();
        storeFragmentedData(`${key}_medium`, tieredData.mediumSensitive, true);
        break;

      case "high":
        // Never store high sensitivity data
        console.warn("High sensitivity data should not be stored in frontend");
        break;
    }
  },

  retrieve(key, tier = "medium") {
    switch (tier) {
      case "public":
        return JSON.parse(localStorage.getItem(key) || "{}");

      case "low":
        const lowKey = CryptoJS.SHA256(this.deviceKey).toString();
        const encryptedLow = localStorage.getItem(`${key}_low`);
        return encryptedLow ? decryptData(encryptedLow, lowKey) : null;

      case "medium":
        return retrieveFragmentedData(`${key}_medium`);

      default:
        return null;
    }
  },

  rotateKeys() {
    this.timeKey = generateTimeBasedKey();
    console.log("🔄 Security keys rotated");
  },
};
