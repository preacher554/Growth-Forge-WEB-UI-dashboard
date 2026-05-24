"use client";

import { ImagePlus, Settings2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "growthforge.ai-assistant-portrait";
const SETTINGS_KEY = "growthforge.ai-assistant-portrait-settings";
const DEFAULT_PORTRAIT = "/avatar-yuya.jpg";
const DEFAULT_SETTINGS = {
  zoom: 1,
  x: 50,
  y: 50,
};

type AssistantPortraitCardProps = {
  operator: {
    name: string;
    model: string;
    provider: string;
    status: string;
  };
};

export function AssistantPortraitCard({ operator }: AssistantPortraitCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [portrait, setPortrait] = useState<string>(DEFAULT_PORTRAIT);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isEditing, setIsEditing] = useState(false);
  const isRunning = operator.status.toLowerCase() === "running";
  const presenceStatus = isRunning
    ? "Active · with Chief"
    : "Standby · waiting for dispatch";

  useEffect(() => {
    setPortrait(window.localStorage.getItem(STORAGE_KEY) ?? DEFAULT_PORTRAIT);
    const savedSettings = window.localStorage.getItem(SETTINGS_KEY);

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;

      if (result) {
        window.localStorage.setItem(STORAGE_KEY, result);
        setPortrait(result);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <div className="grid min-h-40 grid-cols-[0.43fr_1fr]">
        <div className="flex flex-col justify-between p-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-forge-red">
              Main Operator
            </p>
            <h3 className="mt-4 text-base font-medium text-white">
              {operator.name} · Operator Layer
            </h3>
            <p className="mt-2 text-xs leading-5 text-white/55">
              Calm, read-only command presence for GrowthForge Mission Monitor.
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <MetaLine label="Presence" value={presenceStatus} />
              <MetaLine label="Current Focus" value="Monitoring InstaGrow · keeping workers ready" />
              <MetaLine label="Role" value="Yuya / strategic operator" />
              <MetaLine label="Model" value={operator.model} />
              <MetaLine label="Provider" value={operator.provider} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing((current) => !current)}
            className="mt-5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition hover:border-forge-red/40 hover:text-white"
            aria-label="Adjust portrait"
          >
            <Settings2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="relative overflow-hidden bg-black/30"
          aria-label="Upload AI assistant portrait"
        >
          {/* Plain img is intentional here: uploaded portraits are stored as local data URLs. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={portrait}
            alt="AI assistant portrait"
            className="h-full w-full object-cover"
            style={{
              transform: `scale(${settings.zoom})`,
              transformOrigin: `${settings.x}% ${settings.y}%`,
              objectPosition: `${settings.x}% ${settings.y}%`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-forge-black via-forge-black/70 to-transparent" />
        </button>
      </div>

      {isEditing && (
        <div className="border-t border-white/10 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">
              Portrait Settings
            </p>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-full border border-white/10 bg-white/[0.04] p-1.5 text-white/50 transition hover:border-forge-red/40 hover:text-white"
              aria-label="Close portrait settings"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mb-5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-white/60 transition hover:border-forge-red/40 hover:text-white"
            >
              <ImagePlus className="h-3.5 w-3.5" />
              Upload photo
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <RangeControl
              label="Zoom"
              min={1}
              max={2}
              step={0.01}
              value={settings.zoom}
              onChange={(value) => updateSettings({ zoom: value })}
            />
            <RangeControl
              label="Horizontal"
              min={0}
              max={100}
              step={1}
              value={settings.x}
              onChange={(value) => updateSettings({ x: value })}
            />
            <RangeControl
              label="Vertical"
              min={0}
              max={100}
              step={1}
              value={settings.y}
              onChange={(value) => updateSettings({ y: value })}
            />
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </section>
  );

  function updateSettings(next: Partial<typeof DEFAULT_SETTINGS>) {
    setSettings((current) => {
      const updated = { ...current, ...next };
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    });
  }
}

function MetaLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <span className="text-white/35">{label}</span>
      <span className="block break-all text-white/70">{value}</span>
    </div>
  );
}

function RangeControl({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-white/40">
        <span>{label}</span>
        <span>{label === "Zoom" ? `${value.toFixed(2)}x` : `${Math.round(value)}%`}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#ff3b00]"
      />
    </label>
  );
}
