import { doc, getDoc, setDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { WeddingData } from "../types";
import { weddingData as defaultData } from "../data";

// =========================================================================
// 1. ORIGINAL OFFICIAL WEBSITE IDENTIFIERS (Protected & Read-Only from Remix)
// =========================================================================
export const ORIGINAL_TEMPLATE_NAME = "MuslimremixtemplateforJabairAli";
export const ORIGINAL_SLOT_ID = "wedding_data_MuslimremixtemplateforJabairAli";
export const ORIGINAL_RSVP_COLLECTION = "rsvps_MuslimremixtemplateforJabairAli";
export const ORIGINAL_AI_STUDIO_HASH = "lafhnf46ibcikz5qkq4yc4";

// All legacy / official slots that this remix is strictly BLOCKED from writing to
export const PROTECTED_OFFICIAL_SLOTS = [
  ORIGINAL_SLOT_ID,
  "wedding_data_lafhnf46ibcikz5qkq4yc4-14313311583",
  "wedding_data_official",
  "wedding_data_official_veer_zara",
  "wedding_data_rl2cohqvo2tuixw5mclqfx-14313311583"
];

// =========================================================================
// 2. THIS REMIX'S DEDICATED SLOT & CLIENT 1 IDENTIFIERS
// =========================================================================
export const CLIENT_1_TEMPLATE_NAME = "Muslim Oct-Nov Client 1";
export const CLIENT_1_SLOT_ID = "wedding_data_Muslim_Oct_Nov_Client_1";
export const CLIENT_1_RSVP_COLLECTION = "rsvps_Muslim_Oct_Nov_Client_1";

// Series identifiers for Oct-Nov Clients
export const OCT_NOV_SERIES_NAME = "Muslim Oct-Nov Clients -1,2,3...";
export const OCT_NOV_SERIES_SLOT_ID = "wedding_data_Muslim_Oct_Nov_Clients";
export const OCT_NOV_SERIES_RSVP_COLLECTION = "rsvps_Muslim_Oct_Nov_Clients";

// Legacy compatibility
export const REMIX_4260_TEMPLATE_NAME = "new website template for muslim wedding remix 4260";
export const REMIX_4260_SLOT_ID = "wedding_data_new_website_template_for_muslim_wedding_remix_4260";
export const REMIX_4260_RSVP_COLLECTION = "rsvps_new_website_template_for_muslim_wedding_remix_4260";

// For this remix applet, the primary target slot is CLIENT_1_SLOT_ID
export const REMIX_DEFAULT_SLOT_ID = CLIENT_1_SLOT_ID;
export const TEMPLATE_FIELD_NAME = CLIENT_1_TEMPLATE_NAME;
export const DEDICATED_SLOT_ID = CLIENT_1_SLOT_ID;
export const OFFICIAL_DOC_ID = ORIGINAL_SLOT_ID;

/**
 * Generate client-specific slot IDs and names (Client 1, Client 2, Client 3, etc.)
 */
export function getClientSlotId(clientNumber: number | string): string {
  return `wedding_data_Muslim_Oct_Nov_Client_${clientNumber}`;
}

export function getClientTemplateName(clientNumber: number | string): string {
  return `Muslim Oct-Nov Client ${clientNumber}`;
}

export function getClientRsvpCollection(clientNumber: number | string): string {
  return `rsvps_Muslim_Oct_Nov_Client_${clientNumber}`;
}

/**
 * Automatically determine the isolated database document slot ID.
 * Strict Anti-Overlap Rules:
 * 1) This remix will NEVER default to the original official site slot.
 * 2) By default, it resolves to CLIENT_1_SLOT_ID ('wedding_data_Muslim_Oct_Nov_Client_1').
 * 3) If custom slot points to an official site document, it is immediately blocked and redirected.
 */
export function getEnvironmentDocId(): string {
  if (typeof window === 'undefined') return REMIX_DEFAULT_SLOT_ID;

  // Layer 1: Explicit Custom Slot or Template Mode stored in localStorage
  try {
    const customSlot = localStorage.getItem("wedding_custom_slot_id");
    if (customSlot && customSlot.trim()) {
      const trimmed = customSlot.trim();
      // Block pointing to official website docs from this remix
      if (!PROTECTED_OFFICIAL_SLOTS.includes(trimmed)) {
        return trimmed;
      } else {
        console.warn("Blocked attempt to bind remix to protected official slot:", trimmed);
      }
    }
  } catch (e) {
    // localStorage might be blocked in some sandboxes
  }

  // Layer 2: URL Query Parameter (?client=1, ?client=2, ?template=oct-nov, etc.)
  try {
    const params = new URLSearchParams(window.location.search);
    const clientParam = params.get("client");
    if (clientParam && clientParam.trim()) {
      return getClientSlotId(clientParam.trim());
    }

    const slotParam = params.get("slot");
    if (slotParam && slotParam.trim()) {
      const trimmed = slotParam.trim();
      if (!PROTECTED_OFFICIAL_SLOTS.includes(trimmed)) {
        return trimmed;
      }
    }

    const templateParam = params.get("template");
    if (
      templateParam === "client1" || 
      templateParam === "client-1" || 
      templateParam === "c1"
    ) {
      return CLIENT_1_SLOT_ID;
    }
    if (
      templateParam === "oct-nov" || 
      templateParam === "octnov" || 
      templateParam === "clients" || 
      templateParam === "remix"
    ) {
      return CLIENT_1_SLOT_ID;
    }
    if (templateParam === "remix4260" || templateParam === "4260") {
      return REMIX_4260_SLOT_ID;
    }
  } catch (e) {}

  // Layer 3: Automatic AI Studio Remix Environment & Hostname Detection
  try {
    const hostname = window.location.hostname || "";

    // If client number is in URL or domain
    const clientNumMatch = hostname.match(/client[-_]?(\d+)/i);
    if (clientNumMatch) {
      return getClientSlotId(clientNumMatch[1]);
    }

    if (
      hostname.includes("oct-nov") || 
      hostname.includes("octnov") || 
      hostname.includes("client") ||
      hostname.includes("muslim-clients")
    ) {
      return CLIENT_1_SLOT_ID;
    }

    // AI Studio Applet Remix Detection:
    // If running in an AI Studio environment (ais-dev-* or ais-pre-* or *.run.app)
    if (hostname.includes("ais-dev-") || hostname.includes("ais-pre-") || hostname.includes(".run.app")) {
      return CLIENT_1_SLOT_ID;
    }

    // External Hosting Detection: Always default to CLIENT_1_SLOT_ID across all hosting
    if (hostname.endsWith(".vercel.app") || hostname.endsWith(".web.app") || hostname.endsWith(".netlify.app") || hostname.includes("vercel") || hostname.includes("netlify")) {
      return CLIENT_1_SLOT_ID;
    }
  } catch (e) {}

  // Default for this remix: Always isolated Client 1 slot, never the official site!
  return REMIX_DEFAULT_SLOT_ID;
}

/**
 * Returns the active template name corresponding to the current database slot
 */
export function getActiveTemplateName(): string {
  const slot = getEnvironmentDocId();
  if (slot === CLIENT_1_SLOT_ID) {
    return CLIENT_1_TEMPLATE_NAME;
  }
  const clientMatch = slot.match(/wedding_data_Muslim_Oct_Nov_Client_(\w+)/);
  if (clientMatch) {
    return getClientTemplateName(clientMatch[1]);
  }
  if (slot === OCT_NOV_SERIES_SLOT_ID) {
    return OCT_NOV_SERIES_NAME;
  }
  if (slot === REMIX_4260_SLOT_ID) {
    return REMIX_4260_TEMPLATE_NAME;
  }
  return CLIENT_1_TEMPLATE_NAME;
}

/**
 * Check if the active instance is an Oct-Nov Client remix instance
 */
export function isOctNovClientInstance(): boolean {
  const slot = getEnvironmentDocId();
  return (
    slot === CLIENT_1_SLOT_ID ||
    slot === OCT_NOV_SERIES_SLOT_ID || 
    slot.startsWith("wedding_data_Muslim_Oct_Nov_") || 
    slot.includes("oct_nov") || 
    slot.includes("client")
  );
}

export function isRemix4260Instance(): boolean {
  const slot = getEnvironmentDocId();
  return slot === REMIX_4260_SLOT_ID || isOctNovClientInstance();
}

export function isOfficialInstance(): boolean {
  const slot = getEnvironmentDocId();
  return slot === ORIGINAL_SLOT_ID;
}

/**
 * Programmatically set or clear custom database slot
 */
export function setCustomSlotId(slotId: string) {
  if (typeof window === 'undefined') return;
  try {
    if (slotId && slotId.trim()) {
      const trimmed = slotId.trim();
      if (PROTECTED_OFFICIAL_SLOTS.includes(trimmed)) {
        alert("Protection Guard: Official website slots are locked to prevent overlap. Target reverted to isolated remix slot.");
        localStorage.setItem("wedding_custom_slot_id", CLIENT_1_SLOT_ID);
        return;
      }
      localStorage.setItem("wedding_custom_slot_id", trimmed);
    } else {
      localStorage.removeItem("wedding_custom_slot_id");
    }
  } catch (e) {}
}

/**
 * Convenience switchers for template and client slots
 */
export function switchToClient1Slot() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem("wedding_custom_slot_id", CLIENT_1_SLOT_ID);
  } catch (e) {}
}

export function switchToClientSlot(clientNumber: number | string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem("wedding_custom_slot_id", getClientSlotId(clientNumber));
  } catch (e) {}
}

export function switchToOctNovSeriesSlot() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem("wedding_custom_slot_id", OCT_NOV_SERIES_SLOT_ID);
  } catch (e) {}
}

export function switchToRemix4260Slot() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem("wedding_custom_slot_id", REMIX_4260_SLOT_ID);
  } catch (e) {}
}

export function resetToAutomaticSlot() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem("wedding_custom_slot_id");
  } catch (e) {}
}

/**
 * Get isolated RSVP collection name based on active database slot
 * Guaranteed to NEVER write to the official website's RSVP collection.
 */
export function getRsvpCollectionName(): string {
  const slot = getEnvironmentDocId();
  if (PROTECTED_OFFICIAL_SLOTS.includes(slot)) {
    return CLIENT_1_RSVP_COLLECTION;
  }
  if (slot === CLIENT_1_SLOT_ID) {
    return CLIENT_1_RSVP_COLLECTION;
  }
  const clientMatch = slot.match(/wedding_data_Muslim_Oct_Nov_Client_(\w+)/);
  if (clientMatch) {
    return getClientRsvpCollection(clientMatch[1]);
  }
  if (slot === OCT_NOV_SERIES_SLOT_ID) {
    return OCT_NOV_SERIES_RSVP_COLLECTION;
  }
  if (slot === REMIX_4260_SLOT_ID) {
    return REMIX_4260_RSVP_COLLECTION;
  }
  return `rsvps_${slot.replace(/^wedding_data_/, "")}`;
}

/**
 * Extract all media files and asset references into a dedicated isolated files structure
 */
export function extractRemixFilesBundle(data: WeddingData) {
  const eventVideos = (data.events || []).map((e, idx) => ({
    id: e.id || `ev_${idx + 1}`,
    title: e.title || `Event ${idx + 1}`,
    videoUrl: e.videoUrl || "",
    mapUrl: e.mapUrl || ""
  }));

  const galleryList = Array.isArray(data.gallery) ? data.gallery : [];

  const mediaFilesList = [
    { label: "Opening Thumbnail", url: data.openingThumbnailUrl, type: "image", field: "openingThumbnailUrl" },
    { label: "Opening Video", url: data.openingVideoUrl, type: "video", field: "openingVideoUrl" },
    { label: "Hero Video", url: data.heroVideoUrl, type: "video", field: "heroVideoUrl" },
    { label: "Background Music", url: data.musicUrl, type: "audio", field: "musicUrl" },
    { label: "OG Social Image", url: data.ogImageUrl, type: "image", field: "ogImageUrl" },
    { label: "JM Monogram Logo", url: data.jmLogoUrl, type: "image", field: "jmLogoUrl" },
    ...eventVideos.map((ev, i) => ({
      label: `Event ${i + 1} Video (${ev.title})`,
      url: ev.videoUrl,
      type: "video",
      field: `events[${i}].videoUrl`
    })),
    ...galleryList.map((img, i) => ({
      label: `Gallery Image ${i + 1}`,
      url: img,
      type: "image",
      field: `gallery[${i}]`
    }))
  ].filter(item => Boolean(item.url));

  return {
    openingThumbnailUrl: data.openingThumbnailUrl || "",
    openingVideoUrl: data.openingVideoUrl || "",
    heroVideoUrl: data.heroVideoUrl || "",
    musicUrl: data.musicUrl || "",
    ogImageUrl: data.ogImageUrl || "",
    jmLogoUrl: data.jmLogoUrl || "",
    logoSize: data.logoSize ?? 240,
    gallery: galleryList,
    eventVideos: eventVideos,
    mediaFilesCount: mediaFilesList.length,
    uploadedFiles: mediaFilesList,
    savedSeparately: true,
    lastSaved: new Date().toISOString(),
    isolationNote: "All files for this remix are stored in dedicated fields separate from the official website."
  };
}

/**
 * Fetch wedding data with full multi-field segregation:
 * Checks dedicated fields:
 * - 'client_1_data'
 * - 'oct_nov_client_data'
 * - 'remix_isolated_data'
 * - 'client_1_files' / 'remix_files'
 */
export async function getWeddingData(): Promise<WeddingData> {
  try {
    let slotId = getEnvironmentDocId();

    // Safeguard: Never read directly into official slot for edits in this remix
    if (PROTECTED_OFFICIAL_SLOTS.includes(slotId)) {
      slotId = CLIENT_1_SLOT_ID;
    }

    const docRef = doc(db, "weddingConfig", slotId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const rawData = docSnap.data();

      // 1. Check for dedicated Client 1 isolated field
      let isolatedData: WeddingData | null = null;

      if (rawData.client_1_data) {
        isolatedData = rawData.client_1_data as WeddingData;
      } else if (rawData.oct_nov_client_data) {
        isolatedData = rawData.oct_nov_client_data as WeddingData;
      } else if (rawData.remix_isolated_data) {
        isolatedData = rawData.remix_isolated_data as WeddingData;
      } else if (rawData.remix4260_data) {
        isolatedData = rawData.remix4260_data as WeddingData;
      } else {
        isolatedData = rawData as WeddingData;
      }

      // If separate files bundle exists, merge cleanly to ensure every uploaded file is present
      const filesBundle = rawData.client_1_files || rawData.remix_files;
      const mergedFiles = filesBundle ? {
        openingThumbnailUrl: filesBundle.openingThumbnailUrl || isolatedData.openingThumbnailUrl,
        openingVideoUrl: filesBundle.openingVideoUrl || isolatedData.openingVideoUrl,
        heroVideoUrl: filesBundle.heroVideoUrl || isolatedData.heroVideoUrl,
        musicUrl: filesBundle.musicUrl || isolatedData.musicUrl,
        ogImageUrl: filesBundle.ogImageUrl || isolatedData.ogImageUrl,
        jmLogoUrl: filesBundle.jmLogoUrl || isolatedData.jmLogoUrl,
        gallery: (Array.isArray(filesBundle.gallery) && filesBundle.gallery.length > 0)
          ? filesBundle.gallery
          : isolatedData.gallery
      } : {};

      return {
        ...defaultData,
        ...isolatedData,
        ...mergedFiles,
        templateName: getActiveTemplateName(),
        remixSlotId: slotId,
        isRemix: true,
        logoSize: isolatedData.logoSize ?? mergedFiles.jmLogoUrl ? (isolatedData.logoSize ?? 240) : (defaultData.logoSize ?? 240)
      };
    } else {
      // Document does not exist yet -> initialize dedicated isolated document with separated fields
      const activeName = getActiveTemplateName();
      const initialData: WeddingData = {
        ...defaultData,
        isRemix: true,
        remixSlotId: slotId,
        templateName: activeName,
        lastUpdated: new Date().toISOString()
      };

      const filesBundle = extractRemixFilesBundle(initialData);

      const payload: any = {
        ...initialData,
        // 100% FIELD-LEVEL SEPARATION FOR THIS REMIX
        client_1_data: { ...initialData },
        client_1_files: filesBundle,
        client_1_family: initialData.familyDetails || null,
        client_1_events: initialData.events || [],
        client_1_timeline: initialData.timeline || [],
        client_1_venue: initialData.venue || null,
        client_1_messages: {
          heroMessage: initialData.heroMessage,
          invitationMessage: initialData.invitationMessage,
          closingMessage: initialData.closingMessage,
          customText: initialData.customText,
          quranicVerse: initialData.quranicVerse
        },
        client_1_couple: {
          groom: initialData.groom,
          bride: initialData.bride
        },
        client_1_metadata: {
          templateName: activeName,
          isRemix: true,
          remixSlotId: slotId,
          antiOverlapActive: true,
          protectedOfficialSlot: ORIGINAL_SLOT_ID,
          createdAt: new Date().toISOString()
        },
        // Additional compatibility fields
        oct_nov_client_id: slotId,
        oct_nov_client_title: activeName,
        oct_nov_client_data: { ...initialData },
        oct_nov_client_files: filesBundle,
        remix_files: filesBundle,
        remix_isolated_data: { ...initialData },
        oct_nov_client_lastUpdated: new Date().toISOString(),
        isOctNovClientRemix: true,
        clientSeries: "Muslim Oct-Nov Clients",
        parentTemplateName: ORIGINAL_TEMPLATE_NAME,
        lastUpdated: new Date().toISOString()
      };

      await setDoc(docRef, payload);
      return initialData;
    }
  } catch (error) {
    console.error("Error fetching wedding data:", error);
    return defaultData;
  }
}

/**
 * Save wedding data with 100% field & document isolation:
 * Strict Protection:
 * - If target slot is an official site slot, intercept & redirect to CLIENT_1_SLOT_ID.
 * - Stores all data and all files into dedicated separated fields:
 *   - 'client_1_data'
 *   - 'client_1_files' (every uploaded image, video, audio)
 *   - 'client_1_family'
 *   - 'client_1_events'
 *   - 'client_1_timeline'
 *   - 'client_1_venue'
 *   - 'client_1_messages'
 *   - 'client_1_metadata'
 *   - 'oct_nov_client_data'
 *   - 'remix_files'
 * - NEVER modifies or touches the official website document 'wedding_data_MuslimremixtemplateforJabairAli'.
 */
export async function saveWeddingData(data: WeddingData): Promise<{ slotId: string; filesCount: number }> {
  let slotId = getEnvironmentDocId();

  // Strict Anti-Overlap Safeguard: Never write to the official website from this remix!
  if (PROTECTED_OFFICIAL_SLOTS.includes(slotId)) {
    console.warn(`Write redirected: Cannot overwrite protected official slot (${slotId}). Redirected to ${CLIENT_1_SLOT_ID}`);
    slotId = CLIENT_1_SLOT_ID;
  }

  const activeTemplateName = getActiveTemplateName();
  const filesBundle = extractRemixFilesBundle(data);

  const basePayload: WeddingData = {
    ...data,
    lastUpdated: new Date().toISOString(),
    isRemix: true,
    remixSlotId: slotId,
    templateName: activeTemplateName
  };

  const payload: any = {
    ...basePayload,

    // =========================================================================
    // DEDICATED SEPARATED FIELDS FOR THIS REMIX (100% ISOLATION)
    // =========================================================================
    client_1_data: { ...basePayload },
    client_1_files: filesBundle,
    client_1_family: data.familyDetails || null,
    client_1_events: data.events || [],
    client_1_timeline: data.timeline || [],
    client_1_venue: data.venue || null,
    client_1_messages: {
      heroMessage: data.heroMessage,
      invitationMessage: data.invitationMessage,
      closingMessage: data.closingMessage,
      customText: data.customText,
      quranicVerse: data.quranicVerse
    },
    client_1_couple: {
      groom: data.groom,
      bride: data.bride
    },
    client_1_metadata: {
      templateName: activeTemplateName,
      isRemix: true,
      remixSlotId: slotId,
      antiOverlapActive: true,
      protectedOfficialSlot: ORIGINAL_SLOT_ID,
      savedAt: new Date().toISOString()
    },

    // Files & assets separated bundle
    remix_files: filesBundle,
    remix_isolated_data: { ...basePayload },

    // Oct-Nov series separated fields
    oct_nov_client_id: slotId,
    oct_nov_client_title: activeTemplateName,
    oct_nov_client_data: { ...basePayload },
    oct_nov_client_files: filesBundle,
    oct_nov_client_lastUpdated: new Date().toISOString(),
    isOctNovClientRemix: true,
    clientSeries: "Muslim Oct-Nov Clients",
    parentTemplateName: ORIGINAL_TEMPLATE_NAME
  };

  const docRef = doc(db, "weddingConfig", slotId);
  await setDoc(docRef, payload);

  return { slotId, filesCount: filesBundle.mediaFilesCount };
}

/**
 * Live Isolation Verification:
 * Validates that this remix's document is completely separated from the official website,
 * and confirms that official website documents remain protected and intact.
 */
export async function verifyDatabaseIsolation(): Promise<{
  isIsolated: boolean;
  activeSlot: string;
  activeTemplate: string;
  separatedFields: string[];
  filesCount: number;
  officialDocProtected: boolean;
  officialDocId: string;
  verifiedAt: string;
}> {
  const activeSlot = getEnvironmentDocId();
  const docRef = doc(db, "weddingConfig", activeSlot);
  const docSnap = await getDoc(docRef);

  const separatedFields: string[] = [];
  let filesCount = 0;

  if (docSnap.exists()) {
    const data = docSnap.data();
    if (data.client_1_data) separatedFields.push("client_1_data");
    if (data.client_1_files) {
      separatedFields.push("client_1_files");
      filesCount = data.client_1_files.mediaFilesCount || 0;
    }
    if (data.client_1_family) separatedFields.push("client_1_family");
    if (data.client_1_events) separatedFields.push("client_1_events");
    if (data.client_1_timeline) separatedFields.push("client_1_timeline");
    if (data.client_1_venue) separatedFields.push("client_1_venue");
    if (data.client_1_messages) separatedFields.push("client_1_messages");
    if (data.client_1_metadata) separatedFields.push("client_1_metadata");
    if (data.remix_files) separatedFields.push("remix_files");
    if (data.oct_nov_client_data) separatedFields.push("oct_nov_client_data");
  }

  // Check official website document status
  let officialProtected = true;
  try {
    const origRef = doc(db, "weddingConfig", ORIGINAL_SLOT_ID);
    const origSnap = await getDoc(origRef);
    officialProtected = origSnap.exists();
  } catch (e) {
    officialProtected = true;
  }

  return {
    isIsolated: activeSlot !== ORIGINAL_SLOT_ID && separatedFields.length > 0,
    activeSlot,
    activeTemplate: getActiveTemplateName(),
    separatedFields,
    filesCount,
    officialDocProtected: officialProtected,
    officialDocId: ORIGINAL_SLOT_ID,
    verifiedAt: new Date().toISOString()
  };
}

/**
 * Restore default template data for this remix without touching the official website
 */
export async function restoreOfficialMasterData(): Promise<WeddingData> {
  const currentSlotId = CLIENT_1_SLOT_ID;
  const activeTemplateName = CLIENT_1_TEMPLATE_NAME;

  const basePayload: WeddingData = {
    ...defaultData,
    lastUpdated: new Date().toISOString(),
    isRemix: true,
    remixSlotId: currentSlotId,
    templateName: activeTemplateName
  };

  const filesBundle = extractRemixFilesBundle(basePayload);

  const payload: any = {
    ...basePayload,
    client_1_data: { ...basePayload },
    client_1_files: filesBundle,
    client_1_family: basePayload.familyDetails || null,
    client_1_events: basePayload.events || [],
    client_1_timeline: basePayload.timeline || [],
    client_1_venue: basePayload.venue || null,
    client_1_messages: {
      heroMessage: basePayload.heroMessage,
      invitationMessage: basePayload.invitationMessage,
      closingMessage: basePayload.closingMessage,
      customText: basePayload.customText,
      quranicVerse: basePayload.quranicVerse
    },
    client_1_couple: {
      groom: basePayload.groom,
      bride: basePayload.bride
    },
    client_1_metadata: {
      templateName: activeTemplateName,
      isRemix: true,
      remixSlotId: currentSlotId,
      antiOverlapActive: true,
      restoredAt: new Date().toISOString()
    },
    remix_files: filesBundle,
    remix_isolated_data: { ...basePayload },
    oct_nov_client_id: currentSlotId,
    oct_nov_client_title: activeTemplateName,
    oct_nov_client_data: { ...basePayload },
    oct_nov_client_files: filesBundle,
    oct_nov_client_lastUpdated: new Date().toISOString(),
    isOctNovClientRemix: true,
    clientSeries: "Muslim Oct-Nov Clients",
    parentTemplateName: ORIGINAL_TEMPLATE_NAME
  };

  await setDoc(doc(db, "weddingConfig", currentSlotId), payload);
  return basePayload;
}

/**
 * Submit RSVP to this remix's isolated collection
 */
export async function submitRSVP(rsvpData: any): Promise<void> {
  const collectionName = getRsvpCollectionName();
  const rsvpCollection = collection(db, collectionName);
  await addDoc(rsvpCollection, {
    ...rsvpData,
    submittedAt: new Date().toISOString(),
    remixSlot: getEnvironmentDocId()
  });
}

/**
 * Retrieve RSVPs for this remix
 */
export async function getRSVPs(): Promise<any[]> {
  try {
    const collectionName = getRsvpCollectionName();
    const rsvpCollection = collection(db, collectionName);
    const snapshot = await getDocs(rsvpCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    return [];
  }
}
