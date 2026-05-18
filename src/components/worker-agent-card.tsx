"use client";

import { ImagePlus, Settings2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type WorkerAgentCardProps = {
  id: string;
  name: string;
  model: string;
  provider: string;
  status: string;
  defaultPortrait: string;
};

const DEFAULT_SETTINGS = {
  zoom: 1,
  x: 50,
  y: 50,
};

export function WorkerAgentCard({
  id,
  name,
  model,
  provider,
  status,
  defaultPortrait,
}: WorkerAgentCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const storageKey = `growthforge.agent-portrait.${id}`;
  const settingsKey = `growthforge.agent-portrait-settings.${id}`;
  const [portrait, setPortrait] = useState<string>(defaultPortrait);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setPortrait(window.localStorage.getItem(storageKey) ?? defaultPortrait);
    const savedSettings = window.localStorage.getItem(settingsKey);

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, [settingsKey, storageKey]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;

      if (result) {
        window.localStorage.setItem(storageKey, result);
        setPortrait(result);
      }
    };
    reader.readAsDataURL(file);
  }

  function updateSettings(next: Partial<typeof DEFAULT_SETTINGS>) {
    setSettings((current) => {
      const updated = { ...current, ...next };
      window.localStorage.setItem(settingsKey, JSON.stringify(updated));
      return updated;
    });
  }

  return (
    <article className="min-w-[300px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] xl:min-w-0">
      <div className="grid min-h-52 grid-cols-[0.58fr_1fr]">
        <div className="flex flex-col justify-between p-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-forge-red">
              Agent
            </p>
            <p className="mt-3 text-[11px] leading-5 text-white/35">{id}</p>
            <h3 className="mt-1 text-base font-medium text-white">{name}</h3>
          </div>

          <div className="mt-4 space-y-2 text-xs">
            <MetaLine label="Status" value={status} />
            <MetaLine label="Model" value={model} />
            <MetaLine label="Provider" value={provider} />
          </div>

          <button
            type="button"
            onClick={() => setIsEditing((current) => !current)}
            className="mt-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition hover:border-forge-red/40 hover:text-white"
            aria-label={`Adjust portrait for ${name}`}
          >
            <Settings2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="relative flex items-center justify-center overflow-hidden bg-black/30"
          aria-label={`Upload portrait for ${name}`}
        >
          <img
            src={portrait}
            alt={`${name} portrait`}
            className="h-full w-full object-cover"
            style={{
              transform: `scale(${settings.zoom})`,
              transformOrigin: `${settings.x}% ${settings.y}%`,
              objectPosition: `${settings.x}% ${settings.y}%`,
            }}
          />
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-forge-black via-forge-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        </button>
      </div>

      {isEditing && (
        <div className="border-t border-white/10 p-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">
              Portrait Settings
            </p>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-full border border-white/10 bg-white/[0.04] p-1.5 text-white/50 transition hover:border-forge-red/40 hover:text-white"
              aria-label={`Close portrait settings for ${name}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/60 transition hover:border-forge-red/40 hover:text-white"
            >
              <ImagePlus className="h-3.5 w-3.5" />
              Upload photo
            </button>
          </div>

          <div className="grid gap-4">
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
    </article>
  );
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
