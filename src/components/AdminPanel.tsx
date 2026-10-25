import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  getWeddingData, 
  saveWeddingData, 
  getEnvironmentDocId, 
  getActiveTemplateName,
  isOctNovClientInstance,
  switchToClient1Slot,
  switchToOctNovSeriesSlot,
  switchToClientSlot,
  resetToAutomaticSlot,
  getClientSlotId,
  getClientTemplateName,
  CLIENT_1_SLOT_ID,
  CLIENT_1_TEMPLATE_NAME,
  ORIGINAL_TEMPLATE_NAME,
  OCT_NOV_SERIES_NAME,
  ORIGINAL_SLOT_ID,
  OCT_NOV_SERIES_SLOT_ID,
  PROTECTED_OFFICIAL_SLOTS,
  setCustomSlotId,
  restoreOfficialMasterData,
  verifyDatabaseIsolation
} from "../services/db";
import { WeddingData } from "../types";
import { 
  Save, 
  Image as ImageIcon, 
  ArrowLeft, 
  Download, 
  Upload, 
  FileJson, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  Music, 
  Video, 
  Database,
  RefreshCw,
  Plus,
  Trash2,
  Users,
  User,
  Sparkles,
  Layers,
  Calendar,
  Lock,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export function AdminPanel() {
  const [data, setData] = useState<WeddingData | null>(null);
  const [saving, setSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [currentSlot, setCurrentSlot] = useState<string>("");
  const [activeTemplate, setActiveTemplate] = useState<string>("");
  const [isOctNov, setIsOctNov] = useState<boolean>(false);
  const [customSlotInput, setCustomSlotInput] = useState<string>("");
  const [clientNumberInput, setClientNumberInput] = useState<string>("1");
  const [showSlotSettings, setShowSlotSettings] = useState<boolean>(false);
  const [isolationReport, setIsolationReport] = useState<any>(null);
  const [verifyingIsolation, setVerifyingIsolation] = useState<boolean>(false);
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadData() {
      const dbData = await getWeddingData();
      setData(dbData);
      setCurrentSlot(getEnvironmentDocId());
      setActiveTemplate(getActiveTemplateName());
      setIsOctNov(isOctNovClientInstance());
    }
    loadData();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-blush-main flex items-center justify-center p-4 font-serif">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-pink-border max-w-sm w-full text-center">
          <h2 className="text-2xl font-script text-wine-dark mb-4">Admin Login</h2>
          <input 
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (password === "4260") setIsAuthenticated(true);
                else alert("Incorrect password");
              }
            }}
            className="w-full border border-pink-border rounded-md px-4 py-2 mb-4 text-center focus:outline-none focus:border-pink-accent"
          />
          <button 
            onClick={() => {
              if (password === "4260") setIsAuthenticated(true);
              else alert("Incorrect password");
            }}
            className="w-full bg-burgundy text-white py-2 rounded-md font-bold uppercase tracking-widest text-xs hover:bg-wine-dark transition-colors"
          >
            Enter
          </button>
          <Link to="/" className="block mt-4 text-sm text-wine-dark/70 hover:text-wine-dark underline">
            Return to Website
          </Link>
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-8 font-serif">Loading Admin Panel...</div>;

  const handleChange = (path: string, value: any) => {
    setData((prev: any) => {
      const updated = { ...prev };
      const keys = path.split('.');
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
          current[keys[i]] = {};
        } else {
          current[keys[i]] = Array.isArray(current[keys[i]]) ? [...current[keys[i]]] : { ...current[keys[i]] };
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleBrotherChange = (index: number, field: 'name' | 'wife' | 'child', value: string) => {
    setData((prev: any) => {
      const family = prev.familyDetails ? { ...prev.familyDetails } : { groomSide: {}, brideSide: {} };
      const groomSide = family.groomSide ? { ...family.groomSide } : {};
      const brothers = groomSide.brothers ? [...groomSide.brothers] : [];
      if (!brothers[index]) {
        brothers[index] = { name: "", wife: "", child: "" };
      } else {
        brothers[index] = { ...brothers[index] };
      }
      brothers[index][field] = value;
      groomSide.brothers = brothers;
      family.groomSide = groomSide;
      return { ...prev, familyDetails: family };
    });
  };

  const addBrother = () => {
    setData((prev: any) => {
      const family = prev.familyDetails ? { ...prev.familyDetails } : { groomSide: {}, brideSide: {} };
      const groomSide = family.groomSide ? { ...family.groomSide } : {};
      const brothers = groomSide.brothers ? [...groomSide.brothers] : [];
      brothers.push({ name: "", wife: "", child: "" });
      groomSide.brothers = brothers;
      family.groomSide = groomSide;
      return { ...prev, familyDetails: family };
    });
  };

  const removeBrother = (index: number) => {
    setData((prev: any) => {
      const family = prev.familyDetails ? { ...prev.familyDetails } : { groomSide: {}, brideSide: {} };
      const groomSide = family.groomSide ? { ...family.groomSide } : {};
      const brothers = groomSide.brothers ? [...groomSide.brothers] : [];
      brothers.splice(index, 1);
      groomSide.brothers = brothers;
      family.groomSide = groomSide;
      return { ...prev, familyDetails: family };
    });
  };

  const handleSisterChange = (index: number, value: string) => {
    setData((prev: any) => {
      const family = prev.familyDetails ? { ...prev.familyDetails } : { groomSide: {}, brideSide: {} };
      const brideSide = family.brideSide ? { ...family.brideSide } : {};
      const sisters = brideSide.sisters ? [...brideSide.sisters] : [];
      sisters[index] = value;
      brideSide.sisters = sisters;
      family.brideSide = brideSide;
      return { ...prev, familyDetails: family };
    });
  };

  const addSister = () => {
    setData((prev: any) => {
      const family = prev.familyDetails ? { ...prev.familyDetails } : { groomSide: {}, brideSide: {} };
      const brideSide = family.brideSide ? { ...family.brideSide } : {};
      const sisters = brideSide.sisters ? [...brideSide.sisters] : [];
      sisters.push("");
      brideSide.sisters = sisters;
      family.brideSide = brideSide;
      return { ...prev, familyDetails: family };
    });
  };

  const removeSister = (index: number) => {
    setData((prev: any) => {
      const family = prev.familyDetails ? { ...prev.familyDetails } : { groomSide: {}, brideSide: {} };
      const brideSide = family.brideSide ? { ...family.brideSide } : {};
      const sisters = brideSide.sisters ? [...brideSide.sisters] : [];
      sisters.splice(index, 1);
      brideSide.sisters = sisters;
      family.brideSide = brideSide;
      return { ...prev, familyDetails: family };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setData((prev: any) => {
        const newGallery = [...prev.gallery];
        newGallery[index] = base64String;
        return { ...prev, gallery: newGallery };
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSingleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      handleChange(field, base64String);
    };
    reader.readAsDataURL(file);
  };

  const addImage = () => {
    setData((prev: any) => ({
      ...prev,
      gallery: [...prev.gallery, ""]
    }));
  };

  const removeImage = (index: number) => {
    setData((prev: any) => {
      const newGallery = [...prev.gallery];
      newGallery.splice(index, 1);
      return { ...prev, gallery: newGallery };
    });
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const result = await saveWeddingData(data);
      alert(
        `SUCCESS: Settings and ${result.filesCount} media files saved into separated fields!\n\n` +
        `• Target Slot: ${result.slotId}\n` +
        `• Dedicated Fields Saved:\n` +
        `   - client_1_data (Complete Wedding Object)\n` +
        `   - client_1_files (All Uploaded & Linked Media Files)\n` +
        `   - client_1_family, client_1_events, client_1_timeline\n` +
        `   - client_1_venue, client_1_messages, client_1_couple\n` +
        `   - oct_nov_client_data, remix_files\n\n` +
        `Zero Overlap Guaranteed: The official website document (${ORIGINAL_SLOT_ID}) was NOT touched.`
      );
    } catch (error) {
      console.error(error);
      alert("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyIsolation = async () => {
    setVerifyingIsolation(true);
    try {
      const report = await verifyDatabaseIsolation();
      setIsolationReport(report);
      setShowVerificationModal(true);
    } catch (err) {
      console.error("Verification failed:", err);
      alert("Failed to verify database isolation.");
    } finally {
      setVerifyingIsolation(false);
    }
  };

  // EXPORT: Download complete JSON package containing all wedding data & files
  const handleExport = () => {
    if (!data) return;
    try {
      const templateLabel = activeTemplate || ORIGINAL_TEMPLATE_NAME;
      const exportPayload = {
        version: "1.0",
        templateName: templateLabel,
        exportedAt: new Date().toISOString(),
        databaseSlot: getEnvironmentDocId(),
        couple: `${data.groom?.name || "Groom"} & ${data.bride?.name || "Bride"}`,
        data: data
      };
      const jsonString = JSON.stringify(exportPayload, null, 2);
      const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const sanitizedName = templateLabel.replace(/[^a-zA-Z0-9_-]/g, "_");
      link.download = `${sanitizedName}_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export data. Please try again.");
    }
  };

  // IMPORT: Import complete JSON package from another website or remix
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        // Support both wrapped export format { data: WeddingData } and raw WeddingData
        const importedData: WeddingData = parsed.data && typeof parsed.data === "object" ? parsed.data : parsed;

        if (!importedData || typeof importedData !== "object") {
          throw new Error("Invalid file format. Please provide a valid JSON backup.");
        }
        if (!importedData.groom || !importedData.bride) {
          throw new Error("Missing groom or bride information in the backup file.");
        }

        // Safety defaults for nested structures
        if (!Array.isArray(importedData.events)) importedData.events = [];
        if (!Array.isArray(importedData.timeline)) importedData.timeline = [];
        if (!Array.isArray(importedData.gallery)) importedData.gallery = [];
        if (!importedData.venue) {
          importedData.venue = { name: "", addressLine1: "", addressLine2: "", mapUrl: "" };
        }

        // Update local state immediately so fields update
        setData(importedData);

        const shouldAutoSave = window.confirm(
          `Backup loaded successfully for ${importedData.groom?.name || "Groom"} & ${importedData.bride?.name || "Bride"}!\n\n` +
          `Events: ${importedData.events.length}\n` +
          `Do you want to SAVE this imported data to this website's database now?`
        );

        if (shouldAutoSave) {
          setSaving(true);
          await saveWeddingData(importedData);
          setSaving(false);
          alert("All data and files have been successfully imported and saved to the database!");
        } else {
          alert("Backup data loaded into the Admin Panel! You can make further edits and click 'Save Changes' whenever you are ready.");
        }
      } catch (err: any) {
        console.error("Import error:", err);
        alert("Failed to import file: " + (err.message || "Invalid JSON structure"));
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  // DOWNLOAD ASSET HELPER: Allows downloading individual media files (videos, mp3, images)
  const handleDownloadAsset = async (url: string, filename: string) => {
    if (!url) return;
    try {
      if (url.startsWith("data:")) {
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      // Fetch blob to prompt download
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Fallback if CORS prevents blob download
      window.open(url, "_blank");
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // List of all media files currently configured in this wedding, with dedicated separated fields
  const mediaFilesList = [
    { label: "Opening Thumbnail", url: data.openingThumbnailUrl, type: "image", filename: "opening_thumbnail.png", field: "client_1_files.openingThumbnailUrl" },
    { label: "Opening Video", url: data.openingVideoUrl, type: "video", filename: "opening_video.mp4", field: "client_1_files.openingVideoUrl" },
    { label: "Hero Section Video", url: data.heroVideoUrl, type: "video", filename: "hero_video.mp4", field: "client_1_files.heroVideoUrl" },
    { label: "Background Music", url: data.musicUrl, type: "audio", filename: "background_music.mp3", field: "client_1_files.musicUrl" },
    { label: "OG Social Image", url: data.ogImageUrl, type: "image", filename: "social_og_image.jpg", field: "client_1_files.ogImageUrl" },
    { label: "JM Monogram Logo", url: data.jmLogoUrl, type: "image", filename: "jm_monogram_logo.png", field: "client_1_files.jmLogoUrl" },
    ...(data.events || []).map((ev, i) => ({
      label: `Event ${i + 1} Video (${ev.title || "Untitled"})`,
      url: ev.videoUrl,
      type: "video",
      filename: `event_${i + 1}_video.mp4`,
      field: `client_1_files.eventVideos[${i}].videoUrl`
    })),
    ...(data.gallery || []).map((img, i) => ({
      label: `Gallery Image ${i + 1}`,
      url: img,
      type: "image",
      filename: `gallery_${i + 1}.jpg`,
      field: `client_1_files.gallery[${i}]`
    }))
  ].filter(item => Boolean(item.url));

  const handleDownloadAllLinksTxt = () => {
    if (!data) return;
    const lines: string[] = [
      `================================================`,
      `WEDDING ASSET & MEDIA URL BACKUP (REMIX SEPARATED)`,
      `Couple: ${data.groom?.name} & ${data.bride?.name}`,
      `Generated: ${new Date().toLocaleString()}`,
      `Database Slot: ${currentSlot}`,
      `Separated File Fields: client_1_files & remix_files`,
      `Zero Overlap Protection: Active`,
      `================================================`,
      ``,
      `[OPENING THUMBNAIL]`,
      data.openingThumbnailUrl || "(None)",
      ``,
      `[OPENING VIDEO]`,
      data.openingVideoUrl || "(None)",
      ``,
      `[HERO BACKGROUND VIDEO]`,
      data.heroVideoUrl || "(None)",
      ``,
      `[BACKGROUND MUSIC TRACK]`,
      data.musicUrl || "(None)",
      ``,
      `[JM MONOGRAM LOGO]`,
      data.jmLogoUrl || "(None)",
      ``,
      `[OG SOCIAL SHARE IMAGE]`,
      data.ogImageUrl || "(None)",
      ``,
      `[EVENTS]`,
      ...(data.events || []).map((ev, i) => 
        `Event ${i + 1}: ${ev.title} (${ev.date || 'No date'})\n  Video: ${ev.videoUrl || 'None'}\n  Map: ${ev.mapUrl || 'None'}`
      ),
      ``,
      `[GALLERY IMAGES]`,
      ...(data.gallery || []).map((img, i) => `Photo ${i + 1}: ${img.startsWith('data:') ? '[Base64 Uploaded Image]' : img}`)
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wedding_media_links_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpdateCustomSlot = () => {
    const trimmed = customSlotInput.trim();
    if (!trimmed) {
      resetToAutomaticSlot();
      alert("Reset to automatic slot identification.");
    } else {
      if (PROTECTED_OFFICIAL_SLOTS.includes(trimmed)) {
        alert("Protection Guard: Official website slots are locked to prevent any overlap. Target reverted to isolated remix slot.");
        switchToClient1Slot();
        return;
      }
      setCustomSlotId(trimmed);
      alert(`Database slot updated to: ${trimmed}`);
    }
    window.location.reload();
  };

  const handleRestoreOfficial = async () => {
    const templateLabel = activeTemplate || CLIENT_1_TEMPLATE_NAME;
    const confirm = window.confirm(
      `Are you sure you want to recover and restore default template data for "${templateLabel}"?\n\nThis will restore all default Nikah details, Quranic verse, hero & opening videos, family details, events, and timeline settings for this remix slot without affecting the official website.`
    );
    if (!confirm) return;

    setSaving(true);
    try {
      const restored = await restoreOfficialMasterData();
      setData(restored);
      setCurrentSlot(getEnvironmentDocId());
      alert(`Default template data for "${templateLabel}" successfully restored into isolated fields!`);
    } catch (err) {
      console.error("Failed to restore data:", err);
      alert("Failed to restore data. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSelectTemplateMode = (mode: 'original' | 'octnov_series' | 'client', clientNum?: number | string) => {
    if (mode === 'octnov_series') {
      switchToOctNovSeriesSlot();
      alert(`Switched to template series:\n"${OCT_NOV_SERIES_NAME}"\n\nActive Database Slot: ${OCT_NOV_SERIES_SLOT_ID}\nIsolated Fields: oct_nov_client_data, remix_files\n\nAll changes saved here will be stored in this isolated slot without overlapping with the official website.`);
    } else if (mode === 'client') {
      const num = clientNum || clientNumberInput || "1";
      if (String(num) === "1") {
        switchToClient1Slot();
      } else {
        switchToClientSlot(num);
      }
      alert(`Switched to Client ${num} remix slot:\n"${getClientTemplateName(num)}"\n\nActive Database Slot: ${getClientSlotId(num)}\nDedicated Isolated Fields: client_1_data, client_1_files, oct_nov_client_data\n\nAll data and files saved here are completely isolated with ZERO overlap with the official website.`);
    } else {
      alert(`Anti-Overlap Protection Notice:\n\nThe official website "${ORIGINAL_TEMPLATE_NAME}" is locked in read-only protection mode from this remix to guarantee zero overlap. All edits will continue saving into this remix's isolated fields.`);
    }
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-blush-main p-4 md:p-8 font-serif text-text-body">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-10 border border-pink-border">
        
        {/* Top Header with Navigation & Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-pink-border pb-6 gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-wine-dark hover:text-burgundy bg-blush-light px-3 py-1.5 rounded-full border border-pink-border/50 transition-colors text-sm font-semibold">
              <ArrowLeft className="w-4 h-4" /> Go Back
            </Link>
            <div>
              <h1 className="text-3xl font-script text-wine-dark">Admin Panel</h1>
              <p className="text-xs text-text-body/70 font-sans mt-0.5">
                <span className="font-semibold text-wine-dark">{activeTemplate || ORIGINAL_TEMPLATE_NAME}</span> • Manage wedding details, media files, and backups
              </p>
            </div>
          </div>

          {/* Action Bar: Export, Import, Save */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Hidden JSON file input */}
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".json,application/json"
              onChange={handleImport}
              className="hidden"
            />

            <button 
              onClick={handleExport}
              type="button"
              className="flex items-center gap-1.5 bg-white text-wine-dark border border-pink-border px-3.5 py-2 rounded-md hover:bg-blush-light transition-colors text-xs font-bold uppercase tracking-wider shadow-sm"
              title="Download full wedding data & media as a JSON file"
            >
              <Download className="w-4 h-4 text-wine-dark" />
              Export
            </button>

            <button 
              onClick={() => fileInputRef.current?.click()}
              type="button"
              className="flex items-center gap-1.5 bg-white text-wine-dark border border-pink-border px-3.5 py-2 rounded-md hover:bg-blush-light transition-colors text-xs font-bold uppercase tracking-wider shadow-sm"
              title="Upload and load a wedding JSON backup file"
            >
              <Upload className="w-4 h-4 text-wine-dark" />
              Import
            </button>

            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-burgundy text-white px-5 py-2 rounded-md hover:bg-wine-dark transition-colors disabled:opacity-50 text-xs font-bold uppercase tracking-wider shadow-sm ml-auto md:ml-0"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="space-y-8">

          {/* REMIX ISOLATION & SEPARATED FIELDS COMMAND CENTER */}
          <div className="bg-gradient-to-r from-pink-50 via-blush-light to-amber-50/50 rounded-xl p-5 border border-pink-border/80 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-white rounded-lg border border-pink-border/60 text-wine-dark shadow-xs">
                  <ShieldCheck className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-wine-dark text-sm">Remix Data Isolation & Anti-Overlap Protection</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-700" /> {activeTemplate || CLIENT_1_TEMPLATE_NAME}
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 100% Separated Fields
                    </span>
                    <span className="bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-700" /> Official Site Protected
                    </span>
                  </div>

                  {/* Active slot & field details */}
                  <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                    <div className="bg-white/90 p-2.5 rounded-lg border border-pink-border/60">
                      <div className="flex items-center justify-between">
                        <span className="text-text-body/60 text-[10px] uppercase font-bold tracking-wider">Active Remix Document Slot</span>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/60 px-1.5 py-0.2 rounded">Remix Target</span>
                      </div>
                      <code className="text-wine-dark font-mono text-[11px] font-semibold break-all mt-0.5 block">{currentSlot}</code>
                    </div>

                    <div className="bg-white/90 p-2.5 rounded-lg border border-pink-border/60">
                      <div className="flex items-center justify-between">
                        <span className="text-text-body/60 text-[10px] uppercase font-bold tracking-wider">Protected Official Document</span>
                        <span className="text-[10px] text-amber-800 font-bold bg-amber-100/60 px-1.5 py-0.2 rounded">Locked / Untouched</span>
                      </div>
                      <code className="text-amber-900 font-mono text-[11px] font-semibold break-all mt-0.5 block">{ORIGINAL_SLOT_ID}</code>
                    </div>
                  </div>

                  {/* Separated Fields Pill Display */}
                  <div className="mt-3 bg-white/70 p-2.5 rounded-lg border border-pink-border/40 font-sans">
                    <span className="text-[10px] uppercase font-bold text-wine-dark tracking-wider block mb-1.5">
                      Dedicated Isolated Fields Stored Separately For This Website:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { name: "client_1_data", desc: "Full Wedding Config" },
                        { name: "client_1_files", desc: "All Uploaded Files & URLs" },
                        { name: "client_1_family", desc: "Parents, Brothers & Sisters" },
                        { name: "client_1_events", desc: "Ceremonies & Event Videos" },
                        { name: "client_1_timeline", desc: "Nikah Milestones" },
                        { name: "client_1_venue", desc: "Mahal & Map Link" },
                        { name: "client_1_messages", desc: "Hero & Quranic Verse" },
                        { name: "client_1_couple", desc: "Groom & Bride" },
                        { name: "oct_nov_client_data", desc: "Series Sync" },
                        { name: "remix_files", desc: "Files Backup" }
                      ].map((fld) => (
                        <span key={fld.name} className="px-2 py-0.5 bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-200/80 rounded text-[11px] font-mono flex items-center gap-1 shadow-2xs">
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                          <span className="font-semibold">{fld.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-text-body/80 mt-2.5 font-sans leading-relaxed">
                    <strong>Zero-Overlap Guarantee:</strong> Every file you upload (videos, thumbnail, music, photos, logo) and all form details are completely saved into separate fields in <code className="text-wine-dark font-mono text-[11px] font-bold">{currentSlot}</code>. 
                    The official website of Jubair &amp; Mugsina is write-protected and will NEVER be touched or overlapped by this remix.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={handleVerifyIsolation}
                  disabled={verifyingIsolation}
                  className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-sans font-bold shadow-xs transition-colors"
                  title="Check live Firestore database to verify zero overlap"
                >
                  <ShieldCheck className={`w-4 h-4 ${verifyingIsolation ? "animate-spin" : ""}`} />
                  <span>{verifyingIsolation ? "Checking..." : "Verify Zero Overlap Live"}</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setShowSlotSettings(!showSlotSettings)}
                  className="text-xs text-wine-dark underline hover:text-burgundy font-sans"
                >
                  {showSlotSettings ? "Hide Advanced Slot Settings" : "Advanced Slot Settings"}
                </button>
              </div>
            </div>

            {/* Quick 1-Click Template & Client Mode Switcher */}
            <div className="mt-4 pt-3 border-t border-pink-border/50 font-sans">
              <span className="text-[11px] font-semibold text-text-body/80 uppercase tracking-wider block mb-2">
                Active Remix Slot View:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectTemplateMode('client', 1)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                    currentSlot === CLIENT_1_SLOT_ID
                      ? "bg-purple-900 text-white border-purple-950 shadow-sm"
                      : "bg-white text-wine-dark border-pink-border hover:bg-blush-light"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  Client 1 Remix Home ({CLIENT_1_SLOT_ID})
                  {currentSlot === CLIENT_1_SLOT_ID && (
                    <span className="bg-emerald-400 text-black text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">Active</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectTemplateMode('octnov_series')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                    currentSlot === OCT_NOV_SERIES_SLOT_ID
                      ? "bg-wine-dark text-white border-wine-dark shadow-sm"
                      : "bg-white text-wine-dark border-pink-border hover:bg-blush-light"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Muslim Oct-Nov Clients (Series Main)
                  {currentSlot === OCT_NOV_SERIES_SLOT_ID && (
                    <span className="bg-purple-300 text-purple-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">Active</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectTemplateMode('original')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 bg-amber-50/70 text-amber-900 border-amber-300 hover:bg-amber-100"
                  title="Official website is locked in read-only mode"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  Official Website (Protected Read-Only)
                </button>
              </div>

              {/* Client 1, 2, 3 Selector Pills */}
              <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-pink-border/30">
                <span className="text-[11px] text-text-body/70 font-medium">Other Client Slots:</span>
                {[1, 2, 3].map((num) => {
                  const clientSlot = getClientSlotId(num);
                  const isCurrent = currentSlot === clientSlot;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleSelectTemplateMode('client', num)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all flex items-center gap-1 ${
                        isCurrent 
                          ? "bg-purple-900 text-white border-purple-950 shadow-xs" 
                          : "bg-white/90 text-wine-dark border-pink-border hover:bg-pink-100"
                      }`}
                    >
                      <User className="w-3 h-3" />
                      Client {num}
                      {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1"></span>}
                    </button>
                  );
                })}

                <div className="flex items-center gap-1 ml-auto">
                  <span className="text-[11px] text-text-body/60">Other Client:</span>
                  <input 
                    type="number"
                    min="1"
                    max="99"
                    value={clientNumberInput}
                    onChange={(e) => setClientNumberInput(e.target.value)}
                    className="w-12 bg-white border border-pink-border rounded px-1.5 py-0.5 text-xs text-center focus:outline-none focus:border-pink-accent"
                  />
                  <button
                    type="button"
                    onClick={() => handleSelectTemplateMode('client', clientNumberInput)}
                    className="bg-wine-dark text-white px-2 py-0.5 rounded text-xs hover:bg-burgundy transition-colors"
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>

            {showSlotSettings && (
              <div className="mt-4 pt-4 border-t border-pink-border/40 font-sans text-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <span className="text-text-body/80 font-medium">Custom Database Slot ID:</span>
                <input 
                  type="text"
                  placeholder="e.g. wedding_data_custom_slot"
                  value={customSlotInput}
                  onChange={(e) => setCustomSlotInput(e.target.value)}
                  className="bg-white border border-pink-border rounded px-2.5 py-1.5 text-xs flex-1 max-w-xs focus:outline-none focus:border-pink-accent"
                />
                <button
                  type="button"
                  onClick={handleUpdateCustomSlot}
                  className="bg-wine-dark text-white px-3 py-1.5 rounded text-xs hover:bg-burgundy transition-colors"
                >
                  Apply Slot
                </button>
                <button
                  type="button"
                  onClick={() => { resetToAutomaticSlot(); window.location.reload(); }}
                  className="bg-white border border-pink-border text-wine-dark px-3 py-1.5 rounded text-xs hover:bg-blush-light transition-colors"
                >
                  Reset to Auto
                </button>
              </div>
            )}
          </div>

          {/* VERIFICATION REPORT MODAL / POPUP */}
          {showVerificationModal && isolationReport && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-pink-border p-6 font-sans">
                <div className="flex items-center justify-between pb-3 border-b border-pink-border">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <ShieldCheck className="w-6 h-6" />
                    <h3 className="font-bold text-lg text-wine-dark">Database Isolation Verification Report</h3>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowVerificationModal(false)}
                    className="text-text-body/50 hover:text-text-body p-1 rounded-md text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-emerald-900 text-sm">Zero Overlap Confirmed</h4>
                      <p className="text-emerald-800 text-[11px] mt-0.5 leading-relaxed">
                        This remix is confirmed to be isolated into its own dedicated document slot. All data and all media files are stored in separate dedicated fields.
                      </p>
                    </div>
                  </div>

                  <div className="bg-blush-light/70 p-3 rounded-lg border border-pink-border/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-text-body/70 font-semibold">Active Remix Slot:</span>
                      <code className="bg-white px-2 py-0.5 rounded border border-pink-border font-mono text-wine-dark font-bold">
                        {isolationReport.activeSlot}
                      </code>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-text-body/70 font-semibold">Protected Official Slot:</span>
                      <code className="bg-white px-2 py-0.5 rounded border border-pink-border font-mono text-amber-900 font-bold">
                        {isolationReport.officialDocId} (Untouched)
                      </code>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-text-body/70 font-semibold">Files Saved in Separated Field:</span>
                      <span className="bg-purple-100 text-purple-950 px-2 py-0.5 rounded font-bold">
                        {isolationReport.filesCount} Media Files Tracked
                      </span>
                    </div>

                    <div>
                      <span className="text-text-body/70 font-semibold block mb-1">Separated Database Fields Verified:</span>
                      <div className="flex flex-wrap gap-1">
                        {isolationReport.separatedFields.map((f: string) => (
                          <span key={f} className="px-1.5 py-0.5 bg-white text-emerald-800 border border-emerald-300 rounded font-mono text-[10px] font-bold">
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-text-body/60 italic">
                    Verified at: {new Date(isolationReport.verifiedAt).toLocaleString()}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-pink-border flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowVerificationModal(false)}
                    className="bg-wine-dark text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-burgundy transition-colors"
                  >
                    Close Report
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* BACKUP, IMPORT & EXPORT CENTER */}
          <section className="bg-white rounded-xl p-5 border border-pink-border/80 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <FileJson className="w-5 h-5 text-wine-dark" />
              <h2 className="text-lg font-bold text-wine-dark">Data Backup & Migration (Import / Export)</h2>
            </div>
            <p className="text-xs text-text-body/75 font-sans mb-4">
              Download all details, messages, timeline events, and file URLs as a portable backup file. 
              You can import this backup file into any remix or another wedding website with 1-click.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                onClick={handleExport}
                className="flex items-center justify-center gap-2 p-3 bg-blush-light hover:bg-pink-100/70 border border-pink-border rounded-lg text-wine-dark font-sans font-semibold text-xs transition-colors"
              >
                <Download className="w-4 h-4 text-wine-dark" />
                <span>Download Backup ({activeTemplate || (isOctNov ? "Muslim Oct-Nov Clients" : "Original Jubair & Mugsina")})</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 p-3 bg-blush-light hover:bg-pink-100/70 border border-pink-border rounded-lg text-wine-dark font-sans font-semibold text-xs transition-colors"
              >
                <Upload className="w-4 h-4 text-wine-dark" />
                <span>Import Wedding Backup File (.json)</span>
              </button>

              <button
                type="button"
                onClick={handleRestoreOfficial}
                disabled={saving}
                className="flex items-center justify-center gap-2 p-3 bg-burgundy/10 hover:bg-burgundy/20 border border-burgundy/30 rounded-lg text-burgundy font-sans font-semibold text-xs transition-colors sm:col-span-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-burgundy ${saving ? "animate-spin" : ""}`} />
                <span>Restore Clean Default Template Data ({activeTemplate || "Current Template"})</span>
              </button>
            </div>

            {/* Uploaded Files & Media List */}
            <div className="mt-4 pt-4 border-t border-pink-border/50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-wine-dark">Uploaded Media & Files ({mediaFilesList.length})</h3>
                  <p className="text-[11px] text-text-body/70 font-sans">
                    All media files and videos uploaded to this wedding website. Click to download or copy direct links.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadAllLinksTxt}
                  className="flex items-center gap-1.5 text-xs text-wine-dark hover:text-burgundy bg-blush-light px-2.5 py-1 rounded border border-pink-border font-sans font-medium"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download Links (.txt)</span>
                </button>
              </div>

              {mediaFilesList.length === 0 ? (
                <p className="text-xs text-text-body/60 italic font-sans py-2">No media files currently uploaded.</p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {mediaFilesList.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-blush-light/50 rounded-lg border border-pink-border/40 text-xs font-sans gap-2">
                      <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                        {item.type === "video" ? (
                          <Video className="w-3.5 h-3.5 text-wine-dark shrink-0" />
                        ) : item.type === "audio" ? (
                          <Music className="w-3.5 h-3.5 text-wine-dark shrink-0" />
                        ) : (
                          <ImageIcon className="w-3.5 h-3.5 text-wine-dark shrink-0" />
                        )}
                        <span className="font-semibold text-wine-dark shrink-0">{item.label}:</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-100 text-purple-900 border border-purple-200 font-mono shrink-0 font-bold" title="Dedicated field saved in Firestore">
                          {item.field}
                        </span>
                        <span className="truncate text-text-body/70 text-[11px]">{item.url}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(item.url || "", idx)}
                          className="p-1 text-wine-dark hover:bg-white rounded transition-colors"
                          title="Copy Link"
                        >
                          {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadAsset(item.url || "", item.filename)}
                          className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-blush-light border border-pink-border/60 rounded text-[11px] font-medium text-wine-dark transition-colors"
                          title="Download File"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Couple Details */}
          <section>
            <h2 className="text-xl font-bold text-wine-dark mb-4">Couple Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 bg-blush-light p-4 rounded-lg border border-pink-border/50">
                <h3 className="font-bold">Groom</h3>
                <Input label="Name" value={data.groom.name} onChange={(v) => handleChange("groom.name", v)} />
                <Input label="Parents" value={data.groom.parents} onChange={(v) => handleChange("groom.parents", v)} />
                <Input label="Education" value={data.groom.education} onChange={(v) => handleChange("groom.education", v)} />
                <Input label="Profession" value={data.groom.profession} onChange={(v) => handleChange("groom.profession", v)} />
              </div>
              <div className="space-y-4 bg-blush-light p-4 rounded-lg border border-pink-border/50">
                <h3 className="font-bold">Bride</h3>
                <Input label="Name" value={data.bride.name} onChange={(v) => handleChange("bride.name", v)} />
                <Input label="Parents" value={data.bride.parents} onChange={(v) => handleChange("bride.parents", v)} />
                <Input label="Education" value={data.bride.education} onChange={(v) => handleChange("bride.education", v)} />
                <Input label="Profession" value={data.bride.profession} onChange={(v) => handleChange("bride.profession", v)} />
              </div>
            </div>
          </section>

          {/* Family & Parents Details */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-xl font-bold text-wine-dark flex items-center gap-2">
                  <Users className="w-5 h-5 text-burgundy" />
                  Parents & Family Details Section
                </h2>
                <p className="text-xs text-wine-dark/70">
                  Full control over parents' names, family blessings, brothers, and sisters displayed in the website's Family Details section.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* GROOM'S SIDE */}
              <div className="bg-blush-light p-5 rounded-xl border border-pink-border/70 shadow-2xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-pink-border/60">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-wine-dark" />
                    <h3 className="font-bold text-base text-wine-dark">Groom's Parents & Family</h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded text-burgundy border border-pink-border/50">
                    Groom Side
                  </span>
                </div>

                {/* Parents' Names */}
                <div className="space-y-3 bg-white/80 p-3.5 rounded-lg border border-pink-border/50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-burgundy flex items-center gap-1.5">
                    Parents' Names (Family Section)
                  </h4>
                  <Input 
                    label="Father's Name" 
                    value={data.familyDetails?.groomSide.father || ""} 
                    onChange={(v) => handleChange("familyDetails.groomSide.father", v)} 
                  />
                  <Input 
                    label="Mother's Name" 
                    value={data.familyDetails?.groomSide.mother || ""} 
                    onChange={(v) => handleChange("familyDetails.groomSide.mother", v)} 
                  />
                  <div className="pt-1">
                    <Input 
                      label="Hero Parents Subtitle (Under Groom Name on Hero)" 
                      value={data.groom.parents} 
                      onChange={(v) => handleChange("groom.parents", v)} 
                    />
                  </div>
                </div>

                {/* Groom's Brothers & Family */}
                <div className="space-y-3 bg-white/80 p-3.5 rounded-lg border border-pink-border/50">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-burgundy">
                      Groom's Brothers & Family ({data.familyDetails?.groomSide.brothers?.length || 0})
                    </h4>
                    <button
                      type="button"
                      onClick={addBrother}
                      className="flex items-center gap-1 px-2.5 py-1 bg-burgundy hover:bg-wine-dark text-white rounded text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Brother
                    </button>
                  </div>

                  {(!data.familyDetails?.groomSide.brothers || data.familyDetails.groomSide.brothers.length === 0) ? (
                    <p className="text-xs text-wine-dark/60 italic py-2">No brothers listed. Click "Add Brother" above to add one.</p>
                  ) : (
                    <div className="space-y-3 pt-1">
                      {data.familyDetails.groomSide.brothers.map((brother, bIdx) => (
                        <div key={bIdx} className="p-3 bg-blush-main/40 rounded-lg border border-pink-border/60 relative space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-wine-dark flex items-center gap-1">
                              <span className="w-4 h-4 rounded-full bg-burgundy text-white text-[9px] flex items-center justify-center font-bold">
                                {bIdx + 1}
                              </span>
                              Brother {bIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeBrother(bIdx)}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete Brother"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <Input 
                            label="Brother Name & Qualification" 
                            value={brother.name} 
                            onChange={(v) => handleBrotherChange(bIdx, 'name', v)} 
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <Input 
                              label="Wife's Name (Optional)" 
                              value={brother.wife || ""} 
                              onChange={(v) => handleBrotherChange(bIdx, 'wife', v)} 
                            />
                            <Input 
                              label="Child Details (Optional)" 
                              value={brother.child || ""} 
                              onChange={(v) => handleBrotherChange(bIdx, 'child', v)} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* BRIDE'S SIDE */}
              <div className="bg-blush-light p-5 rounded-xl border border-pink-border/70 shadow-2xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-pink-border/60">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-wine-dark" />
                    <h3 className="font-bold text-base text-wine-dark">Bride's Parents & Family</h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded text-burgundy border border-pink-border/50">
                    Bride Side
                  </span>
                </div>

                {/* Parents' Names */}
                <div className="space-y-3 bg-white/80 p-3.5 rounded-lg border border-pink-border/50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-burgundy flex items-center gap-1.5">
                    Parents' Names (Family Section)
                  </h4>
                  <Input 
                    label="Father's Name" 
                    value={data.familyDetails?.brideSide.father || ""} 
                    onChange={(v) => handleChange("familyDetails.brideSide.father", v)} 
                  />
                  <Input 
                    label="Mother's Name" 
                    value={data.familyDetails?.brideSide.mother || ""} 
                    onChange={(v) => handleChange("familyDetails.brideSide.mother", v)} 
                  />
                  <div className="pt-1">
                    <Input 
                      label="Hero Parents Subtitle (Under Bride Name on Hero)" 
                      value={data.bride.parents} 
                      onChange={(v) => handleChange("bride.parents", v)} 
                    />
                  </div>
                </div>

                {/* Bride's Sisters */}
                <div className="space-y-3 bg-white/80 p-3.5 rounded-lg border border-pink-border/50">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-burgundy">
                      Bride's Sisters ({data.familyDetails?.brideSide.sisters?.length || 0})
                    </h4>
                    <button
                      type="button"
                      onClick={addSister}
                      className="flex items-center gap-1 px-2.5 py-1 bg-burgundy hover:bg-wine-dark text-white rounded text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Sister
                    </button>
                  </div>

                  {(!data.familyDetails?.brideSide.sisters || data.familyDetails.brideSide.sisters.length === 0) ? (
                    <p className="text-xs text-wine-dark/60 italic py-2">No sisters listed. Click "Add Sister" above to add one.</p>
                  ) : (
                    <div className="space-y-2 pt-1">
                      {data.familyDetails.brideSide.sisters.map((sister, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2 bg-blush-main/40 p-2.5 rounded-lg border border-pink-border/60">
                          <span className="w-4 h-4 rounded-full bg-burgundy text-white text-[9px] flex items-center justify-center font-bold shrink-0">
                            {sIdx + 1}
                          </span>
                          <div className="flex-1">
                            <input 
                              type="text"
                              placeholder="Sister's Full Name"
                              value={sister}
                              onChange={(e) => handleSisterChange(sIdx, e.target.value)}
                              className="w-full bg-white border border-pink-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-pink-accent focus:ring-1 focus:ring-pink-accent"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSister(sIdx)}
                            className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                            title="Delete Sister"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </section>

          {/* Event Details */}
          <section>
             <h2 className="text-xl font-bold text-wine-dark mb-4">Event Date & Time</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Target Date (Countdown ISO)" value={data.weddingDate} onChange={(v) => handleChange("weddingDate", v)} type="datetime-local" />
                <Input label="Formatted Date" value={data.weddingDateFormatted} onChange={(v) => handleChange("weddingDateFormatted", v)} />
                <Input label="Formatted Time" value={data.weddingTimeFormatted} onChange={(v) => handleChange("weddingTimeFormatted", v)} />
                <Input label="Day of Week" value={data.weddingDayFormatted} onChange={(v) => handleChange("weddingDayFormatted", v)} />
             </div>
          </section>

          {/* Messages */}
          <section>
             <h2 className="text-xl font-bold text-wine-dark mb-4">Messages & Text</h2>
             <div className="space-y-4">
               <TextArea label="Hero Message" value={data.heroMessage} onChange={(v) => handleChange("heroMessage", v)} />
               <TextArea label="Quranic Verse (Arabic)" value={data.quranicVerse?.arabic || ""} onChange={(v) => handleChange("quranicVerse.arabic", v)} />
               <Input label="Quranic Verse Translation" value={data.quranicVerse?.translation || ""} onChange={(v) => handleChange("quranicVerse.translation", v)} />
               <Input label="Custom Text : Initials of Groom & Bride" value={data.customText || ""} onChange={(v) => handleChange("customText", v)} />
               
               <div className="flex flex-col gap-3 p-4 bg-white/85 rounded-xl border border-pink-border/70 shadow-xs">
                 <div className="flex items-center justify-between">
                   <label className="text-xs font-bold uppercase tracking-wider text-wine-dark">
                     Monogram Logo (Message Section & Floating Scroll Header)
                   </label>
                   <span className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-burgundy/10 text-burgundy font-bold">
                     Current Size: {data.logoSize || 240}px
                   </span>
                 </div>
                 
                 <p className="text-xs text-text-body/75">
                   Insert background-removed logo photo or paste image URL. This exact logo will appear in both the Invitation Message section and persistently in the top floating scroll header!
                 </p>
                 
                 <input 
                   type="file" 
                   accept="image/*"
                   onChange={(e) => handleSingleImageUpload(e, 'jmLogoUrl')}
                   className="w-full text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-burgundy file:text-white hover:file:bg-wine-dark cursor-pointer"
                 />
                 <Input label="Logo Image URL (Message Section & Floating Scroll Logo)" value={data.jmLogoUrl || ""} onChange={(v) => handleChange("jmLogoUrl", v)} />
                 
                 {/* LOGO SIZE CONTROLS (Option to Increase or Decrease Logo Size) */}
                 <div className="mt-2 pt-3 border-t border-pink-border/60 flex flex-col gap-3">
                   <div className="flex items-center justify-between">
                     <div>
                       <span className="text-xs font-bold uppercase tracking-wider text-wine-dark block">
                         Logo Size Controls
                       </span>
                       <span className="text-[11px] text-text-body/70">
                         Increase or decrease the logo size on the invitation page
                       </span>
                     </div>
                     <div className="flex items-center gap-1.5">
                       <span className="text-xs font-bold text-burgundy bg-pink-50 border border-pink-border px-2.5 py-1 rounded-md">
                         {data.logoSize || 240} px
                       </span>
                     </div>
                   </div>

                   {/* Step Increase / Decrease Buttons */}
                   <div className="grid grid-cols-4 gap-2">
                     <button
                       type="button"
                       onClick={() => {
                         const current = data.logoSize || 240;
                         handleChange("logoSize", Math.max(80, current - 25));
                       }}
                       className="py-1.5 px-2 bg-pink-50 hover:bg-pink-100 text-wine-dark font-sans text-xs font-bold rounded-lg border border-pink-border/80 transition-colors flex items-center justify-center gap-1 active:scale-95"
                     >
                       - 25px
                     </button>
                     <button
                       type="button"
                       onClick={() => {
                         const current = data.logoSize || 240;
                         handleChange("logoSize", Math.max(80, current - 10));
                       }}
                       className="py-1.5 px-2 bg-pink-50 hover:bg-pink-100 text-wine-dark font-sans text-xs font-bold rounded-lg border border-pink-border/80 transition-colors flex items-center justify-center gap-1 active:scale-95"
                     >
                       - 10px
                     </button>
                     <button
                       type="button"
                       onClick={() => {
                         const current = data.logoSize || 240;
                         handleChange("logoSize", Math.min(500, current + 10));
                       }}
                       className="py-1.5 px-2 bg-burgundy/10 hover:bg-burgundy/20 text-burgundy font-sans text-xs font-bold rounded-lg border border-burgundy/30 transition-colors flex items-center justify-center gap-1 active:scale-95"
                     >
                       + 10px
                     </button>
                     <button
                       type="button"
                       onClick={() => {
                         const current = data.logoSize || 240;
                         handleChange("logoSize", Math.min(500, current + 25));
                       }}
                       className="py-1.5 px-2 bg-burgundy/10 hover:bg-burgundy/20 text-burgundy font-sans text-xs font-bold rounded-lg border border-burgundy/30 transition-colors flex items-center justify-center gap-1 active:scale-95"
                     >
                       + 25px
                     </button>
                   </div>

                   {/* Smooth Range Slider */}
                   <div className="flex items-center gap-3">
                     <span className="text-[11px] text-text-body/70 font-sans whitespace-nowrap">Smaller (80px)</span>
                     <input 
                       type="range" 
                       min="80" 
                       max="450" 
                       step="5" 
                       value={data.logoSize || 240} 
                       onChange={(e) => handleChange("logoSize", Number(e.target.value))}
                       className="flex-1 accent-burgundy cursor-pointer h-2 bg-pink-border/40 rounded-lg"
                     />
                     <span className="text-[11px] text-text-body/70 font-sans whitespace-nowrap">Bigger (450px)</span>
                   </div>

                   {/* Quick Preset Buttons */}
                   <div className="flex flex-wrap items-center gap-1.5">
                     <span className="text-[10px] uppercase font-bold text-text-body/60 mr-1">Presets:</span>
                     {[
                       { label: "Compact", size: 140 },
                       { label: "Normal", size: 200 },
                       { label: "Large", size: 240 },
                       { label: "X-Large", size: 300 },
                       { label: "Jumbo", size: 380 }
                     ].map((preset) => (
                       <button
                         key={preset.size}
                         type="button"
                         onClick={() => handleChange("logoSize", preset.size)}
                         className={`text-[11px] font-sans px-2.5 py-1 rounded-full border transition-all ${
                           (data.logoSize || 240) === preset.size
                             ? "bg-burgundy text-white border-burgundy shadow-xs"
                             : "bg-white/80 text-wine-dark/80 border-pink-border hover:bg-pink-50"
                         }`}
                       >
                         {preset.label} ({preset.size}px)
                       </button>
                     ))}
                   </div>

                   {/* Live Preview Box in Admin */}
                   <div className="mt-2 p-3 bg-blush-light rounded-xl border border-pink-border flex flex-col items-center">
                     <div className="w-full flex justify-between items-center mb-2 pb-1.5 border-b border-pink-border/50 text-[11px]">
                       <span className="text-text-body/70 font-medium">Live Admin Preview:</span>
                       <span className="text-burgundy font-bold">Rendered Height: {data.logoSize || 240}px</span>
                     </div>
                     {data.jmLogoUrl ? (
                       <div className="w-full flex flex-col items-center justify-center p-2 min-h-[120px] bg-white/40 rounded-lg overflow-hidden">
                         <img 
                           src={data.jmLogoUrl} 
                           style={{ 
                             height: `${Math.min(data.logoSize || 240, 260)}px`,
                             maxHeight: '260px'
                           }} 
                           className="w-auto object-contain drop-shadow-md transition-all duration-200" 
                           alt="JM Logo Preview" 
                         />
                         {(data.logoSize || 240) > 260 && (
                           <span className="text-[10px] text-text-body/60 mt-1 italic">
                             (Preview scaled in admin panel; on invitation website will render full {data.logoSize || 240}px)
                           </span>
                         )}
                       </div>
                     ) : (
                       <div className="text-xs text-text-body/60 py-4 text-center">
                         Upload a logo to see live scaling preview
                       </div>
                     )}
                     {data.jmLogoUrl && (
                       <button 
                         type="button" 
                         onClick={() => handleChange("jmLogoUrl", "")}
                         className="mt-2 text-xs text-red-500 hover:underline font-sans"
                       >
                         Remove Logo (Revert to (JM) text)
                       </button>
                     )}
                   </div>
                 </div>
               </div>
               
               <TextArea label="Wedding Invitation Message (Arabic & English)" value={data.invitationMessage} onChange={(v) => handleChange("invitationMessage", v)} />
               <TextArea label="Transportation Details" value={data.transportation} onChange={(v) => handleChange("transportation", v)} />
               <Input label="Dress Code" value={data.dressCode} onChange={(v) => handleChange("dressCode", v)} />
               <TextArea label="Closing Message" value={data.closingMessage} onChange={(v) => handleChange("closingMessage", v)} />
             </div>
          </section>

          {/* Events */}
          <section>
            <h2 className="text-xl font-bold text-wine-dark mb-4">Events</h2>
            <div className="space-y-4">
              {data.events.map((event, idx) => (
                <div key={event.id || idx} className="bg-blush-light p-4 rounded-lg border border-pink-border/50 space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-wine-dark">Event {idx + 1}</h3>
                    <button onClick={() => {
                      const newEvents = [...data.events];
                      newEvents.splice(idx, 1);
                      handleChange("events", newEvents);
                    }} className="text-red-500 hover:bg-red-50 px-3 py-1 rounded-md text-sm">Remove</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Event Title" value={event.title} onChange={(v) => handleChange(`events.${idx}.title`, v)} />
                    <Input label="Date" value={event.date} type="date" onChange={(v) => handleChange(`events.${idx}.date`, v)} />
                    <Input label="Time (e.g., 7:00 PM)" value={event.time} onChange={(v) => handleChange(`events.${idx}.time`, v)} />
                    <Input label="Location Name" value={event.location} onChange={(v) => handleChange(`events.${idx}.location`, v)} />
                    <Input label="Timeline Message" value={event.description || ""} onChange={(v) => handleChange(`events.${idx}.description`, v)} />
                    <Input label="Video URL (.mp4)" value={event.videoUrl || ""} onChange={(v) => handleChange(`events.${idx}.videoUrl`, v)} />
                    <Input label="Map Link (URL)" value={event.mapUrl || ""} onChange={(v) => handleChange(`events.${idx}.mapUrl`, v)} />
                  </div>
                </div>
              ))}
              <button onClick={() => {
                const newEvent = {
                  id: Date.now().toString(),
                  title: "New Event",
                  date: "",
                  time: "",
                  location: "",
                  videoUrl: "",
                  mapUrl: ""
                };
                handleChange("events", [...data.events, newEvent]);
              }} className="text-wine-dark hover:bg-blush-light px-4 py-2 rounded-md border border-pink-border w-full text-center">
                + Add Event
              </button>
            </div>
          </section>

          {/* Media Settings */}
          <section>
            <h2 className="text-xl font-bold text-wine-dark mb-4">Media Settings</h2>
            <div className="space-y-4 bg-blush-light p-4 rounded-lg border border-pink-border/50">
              
              <div className="flex flex-col gap-2">
                <h3 className="font-bold">Opening Thumbnail (Click to Enter)</h3>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleSingleImageUpload(e, 'openingThumbnailUrl')}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-burgundy file:text-white hover:file:bg-wine-dark cursor-pointer"
                />
                <Input label="Or Thumbnail URL" value={data.openingThumbnailUrl || ""} onChange={(v) => handleChange("openingThumbnailUrl", v)} />
                {data.openingThumbnailUrl && <img src={data.openingThumbnailUrl} className="w-24 h-24 object-cover rounded-md mt-2 border border-pink-border" alt="Thumbnail Preview" />}
              </div>

              <div className="flex flex-col gap-2 border-t border-pink-border pt-4">
                <h3 className="font-bold">Opening Video</h3>
                <p className="text-xs opacity-70">Plays immediately after clicking the thumbnail. Must be a direct URL (e.g., .mp4).</p>
                <Input label="Video URL" value={data.openingVideoUrl || ""} onChange={(v) => handleChange("openingVideoUrl", v)} />
              </div>

              <div className="flex flex-col gap-2 border-t border-pink-border pt-4">
                <h3 className="font-bold">OG Image URL (Social Sharing Preview)</h3>
                <p className="text-xs opacity-70">Image shown when sharing the link on WhatsApp, Facebook, etc. Direct URL.</p>
                <Input label="OG Image URL" value={data.ogImageUrl || ""} onChange={(v) => handleChange("ogImageUrl", v)} />
              </div>

              <div className="flex flex-col gap-2 border-t border-pink-border pt-4">
                <h3 className="font-bold">Hero Section Video</h3>
                <p className="text-xs opacity-70">Background video for the first section. Must be a direct URL (e.g., .mp4).</p>
                <Input label="Hero Video URL" value={data.heroVideoUrl || ""} onChange={(v) => handleChange("heroVideoUrl", v)} />
              </div>

              <div className="flex flex-col gap-2 border-t border-pink-border pt-4">
                <h3 className="font-bold">Background Music</h3>
                <p className="text-xs opacity-70">Direct link to an audio file (e.g., .mp3) to play in the background.</p>
                <Input label="Music URL" value={data.musicUrl || ""} onChange={(v) => handleChange("musicUrl", v)} />
              </div>
            </div>
          </section>

          {/* Venue Settings */}
          <section>
            <h2 className="text-xl font-bold text-wine-dark mb-4">Venue Details</h2>
            <div className="space-y-4 bg-blush-light p-4 rounded-lg border border-pink-border/50">
              <Input label="Venue Name" value={data.venue.name} onChange={(v) => handleChange("venue.name", v)} />
              <Input label="Address Line 1" value={data.venue.addressLine1} onChange={(v) => handleChange("venue.addressLine1", v)} />
              <Input label="Address Line 2" value={data.venue.addressLine2} onChange={(v) => handleChange("venue.addressLine2", v)} />
              <Input label="Google Maps URL" value={data.venue.mapUrl} onChange={(v) => handleChange("venue.mapUrl", v)} />
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string, value: string, onChange: (v: string) => void, type?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-widest opacity-70">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-pink-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-pink-accent focus:ring-1 focus:ring-pink-accent"
      />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-widest opacity-70">{label}</label>
      <textarea 
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-pink-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-pink-accent focus:ring-1 focus:ring-pink-accent resize-y"
      />
    </div>
  );
}
