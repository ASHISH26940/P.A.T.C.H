"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ingestVideo, getCookies, saveCookies } from "@/lib/api/memory";
import type { VideoIngestResult } from "@/lib/api/memory";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

const STEP_LABELS = ["Fetching Source", "Transcribing", "Extracting", "Linking Graph"];

interface ExtractionItem {
  title: string;
  status: string;
  memories: number;
  progress: number;
}

function getStepState(stepIdx: number, currentStep: number): "pending" | "current" | "complete" {
  if (stepIdx < currentStep) return "complete";
  if (stepIdx === currentStep) return "current";
  return "pending";
}

function VideoContent() {
  const { user } = useAuth();
  const storageKey = `patch_extractions_${user?.id ?? "anon"}`;
  const [url, setUrl] = useState("");
  const [ingesting, setIngesting] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [extractions, setExtractions] = useState<ExtractionItem[]>([]);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM]: Initializing...", "[READY]: Input pending"]);
  const [cookiesText, setCookiesText] = useState("");
  const [cookiesSaved, setCookiesSaved] = useState(false);
  const [showCookies, setShowCookies] = useState(false);
  const abortRef = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) try { setExtractions(JSON.parse(saved)); } catch {}
  }, [storageKey]);

  useEffect(() => {
    getCookies().then((c) => {
      if (c) { setCookiesText(c); setCookiesSaved(true); }
    });
  }, []);

  const persist = (items: ExtractionItem[]) => localStorage.setItem(storageKey, JSON.stringify(items));

  const addLog = (line: string) => setLogs((prev) => [...prev, line]);
  const advance = (to: number) => new Promise<void>((r) => setTimeout(() => { setStepIndex(to); r(); }, 600));
  const handleDelete = (index: number) => setExtractions((prev) => { const next = prev.filter((_, i) => i !== index); persist(next); return next; });

  const handleIngest = async () => {
    if (!url.trim() || ingesting) return;
    abortRef.current = false;
    setIngesting(true);
    setStepIndex(0);
    setError(null);
    addLog("[SYSTEM]: Starting ingestion...");

    // Advance through steps as the API processes
    advance(1).then(() => addLog("[FETCH]: Retrieving video source..."));

    try {
      const result: VideoIngestResult = await ingestVideo(url.trim());
      if (abortRef.current) return;

      await advance(2);
      addLog(`[SOURCE]: Fetched "${result.video_title}"`);

      await advance(3);
      if (result.subtitles_available) addLog("[TRANSCRIBE]: Subtitles found and processed");
      addLog(`[EXTRACT]: ${result.memories.length} memories created`);

      await advance(4);

      setExtractions((prev) => {
        const next = [{
          title: result.video_title,
          status: result.memories.length > 0 ? "Processed" : "No memories",
          memories: result.memories.length,
          progress: result.memories.length > 0 ? 100 : 0,
        }, ...prev];
        persist(next);
        return next;
      });
      setUrl("");
    } catch (err: any) {
      const msg = err?.message || "Ingestion failed";
      setError(msg);
      addLog(`[ERROR]: ${msg}`);
    } finally {
      setIngesting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface-dim">
      {/* ── Step bar ── */}
      <div className="bg-surface-lowest border-b border-glass-border flex-shrink-0">
        <div className="max-w-6xl mx-auto px-8 py-4 grid grid-cols-4 gap-4">
          {STEP_LABELS.map((label, i) => {
            const state = getStepState(i, stepIndex);
            return (
              <div key={label} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border ${
                    state === "complete"
                      ? "bg-primary-container/20 border-primary text-primary"
                      : state === "current"
                        ? "bg-primary-container/10 border-primary-container text-primary-container"
                        : "bg-surface-high border-glass-border text-on-surface-variant"
                  }`}
                >
                  {state === "complete" ? (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  ) : (
                    i + 1
                  )}
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-[10px] uppercase tracking-widest font-bold leading-none mb-0.5 ${
                      state === "complete"
                        ? "text-primary/60"
                        : state === "current"
                          ? "text-primary-container"
                          : "text-on-surface-variant/50"
                    }`}
                  >
                    {state === "complete" ? "Complete" : state === "current" ? "Current" : "Pending"}
                  </p>
                  <p
                    className={`text-sm truncate ${
                      state === "pending" ? "text-on-surface-variant" : "text-on-surface"
                    }`}
                  >
                    {label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Left column ── */}
            <section className="lg:col-span-2 flex flex-col gap-6">
              {/* Ingestion card */}
              <GlassPanel className="p-6 rounded-xl border-l-4 border-l-primary-container">
                <div className="mb-6">
                  <h2 className="font-heading text-xl text-primary font-bold mb-1">
                    Initialize Ingestion
                  </h2>
                  <p className="text-sm text-on-surface-variant">
                    Extract memories from a video URL.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[11px] text-primary uppercase tracking-widest font-bold mb-2">
                      Video Source URL
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary-container text-[20px]">link</span>
                      <input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full bg-surface-lowest border border-glass-border rounded-lg py-3 pl-11 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary-container outline-none transition-all"
                        placeholder="Paste YouTube link or video URL..."
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-error-container/10 border border-error-container/30 text-error text-sm rounded-lg px-4 py-3">
                      {error}
                    </div>
                  )}

                  <button
                    disabled={!url.trim() || ingesting}
                    onClick={handleIngest}
                    className="w-full bg-primary-container text-on-primary-container py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {ingesting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">bolt</span>
                        Process Asset
                      </>
                    )}
                  </button>

                  <div className="border-t border-glass-border pt-4">
                    <button
                      onClick={() => setShowCookies(!showCookies)}
                      className="text-[11px] text-on-surface-variant/60 hover:text-primary transition-all uppercase tracking-widest font-bold flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">cookie</span>
                      {showCookies ? "Hide" : "YouTube Cookie Auth"}
                      {cookiesSaved && !showCookies && <span className="text-[10px] text-tertiary ml-1">(saved)</span>}
                    </button>

                    {showCookies && (
                      <div className="mt-3 space-y-3">
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">
                          Export your YouTube cookies as a{" "}
                          <a className="text-primary underline" href="https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp" target="_blank" rel="noopener">cookies.txt</a>{" "}
                          file and paste the contents below. This bypasses YouTube's bot detection on server IPs.
                        </p>
                        <textarea
                          value={cookiesText}
                          onChange={(e) => { setCookiesText(e.target.value); setCookiesSaved(false); }}
                          className="w-full h-28 bg-surface-lowest border border-glass-border rounded-lg p-3 text-[11px] font-mono text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary-container outline-none transition-all resize-none"
                          placeholder="Paste cookies.txt contents here..."
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              try {
                                await saveCookies(cookiesText);
                                setCookiesSaved(true);
                                addLog("[COOKIES]: YouTube cookies saved");
                              } catch {
                                addLog("[ERROR]: Failed to save cookies");
                              }
                            }}
                            className="px-4 py-2 bg-primary-container/20 border border-primary-container/40 rounded-lg text-[11px] text-primary font-bold uppercase tracking-widest hover:bg-primary-container/30 transition-all"
                          >
                            Save Cookies
                          </button>
                          <button
                            onClick={() => { setCookiesText(""); setCookiesSaved(false); }}
                            className="px-4 py-2 border border-glass-border rounded-lg text-[11px] text-on-surface-variant font-bold uppercase tracking-widest hover:border-error/40 hover:text-error transition-all"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </GlassPanel>

              {/* Recent Extractions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-base font-bold text-primary uppercase tracking-wide">
                    Recent Extractions
                  </h3>
                </div>

                {extractions.length === 0 ? (
                  <div className="text-center py-12 text-sm text-on-surface-variant">
                    No extractions yet. Paste a video URL above and process it.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {extractions.map((item, i) => (
                      <div key={`ext-${Date.now()}-${i}`} className="bg-glass-fill backdrop-blur-glass border border-glass-border rounded-xl p-4 flex gap-4 items-center group relative hover:border-primary-container/30 transition-all">
                        <span
                          onClick={() => handleDelete(i)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 cursor-pointer text-on-surface-variant/40 hover:text-error transition-all"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </span>
                        <div className="w-14 h-14 rounded-lg flex-shrink-0 bg-surface-low flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-surface-variant/40 text-2xl">play_circle</span>
                        </div>
                        <Link href="/memory" className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-on-surface truncate mb-1 hover:text-primary-container transition-colors">{item.title}</h4>
                          <p className="text-[10px] text-primary font-mono uppercase tracking-wider mb-2">
                            {item.status} • {item.memories} memories
                          </p>
                          <div className="h-1 bg-surface-lowest rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${item.progress}%` }} />
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* ── Right column ── */}
            <aside className="flex flex-col gap-6">
              {/* Metrics */}
              <GlassPanel className="p-6 rounded-xl">
                <h4 className="text-[11px] text-primary uppercase tracking-widest font-bold mb-5">
                  Extraction Metrics
                </h4>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">Total Ingested</span>
                    <span className="text-sm font-mono text-on-surface font-semibold">{extractions.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">Total Memories</span>
                    <span className="text-sm font-mono text-on-surface font-semibold">
                      {extractions.reduce((sum, e) => sum + e.memories, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">Status</span>
                    <span className={`text-sm font-mono font-bold ${ingesting ? "text-primary" : "text-tertiary"}`}>
                      {ingesting ? "Processing" : "Idle"}
                    </span>
                  </div>
                </div>
                <button className="w-full mt-6 py-2.5 border border-primary-container/30 rounded-lg text-xs text-primary font-bold uppercase tracking-widest hover:bg-primary-container/5 transition-all">
                  Generate Report
                </button>
              </GlassPanel>

              {/* Live Console */}
              <GlassPanel className="p-5 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-2 h-2 rounded-full ${ingesting ? "bg-primary animate-pulse" : "bg-tertiary"} flex-shrink-0`} />
                  <h4 className="text-[11px] text-on-surface uppercase tracking-widest font-bold">
                    Live Console
                  </h4>
                </div>
                <div className="font-mono text-[11px] text-on-surface-variant space-y-1.5 h-44 overflow-y-auto" ref={(el) => { if (el) el.scrollTop = el.scrollHeight; }}>
                  {logs.map((line, i) => (
                    <div key={i} className={`leading-relaxed ${line.startsWith("[ERROR]") ? "text-error" : line.includes("SYSTEM") || line === "[READY]: Input pending" ? "text-primary-container/50" : "text-on-surface"}`}>
                      {line}
                      {i === logs.length - 1 && ingesting && (
                        <span className="inline-block w-2 h-3.5 bg-primary-container ml-1 align-middle animate-blink" />
                      )}
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VideoPage() {
  return (
    <AuthProvider>
      <VideoContent />
    </AuthProvider>
  );
}
