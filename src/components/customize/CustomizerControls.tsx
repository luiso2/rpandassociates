'use client'

import { Move, Maximize, Minimize, RotateCw, Sliders, RotateCcw } from 'lucide-react'

export interface CustomizerSettings {
  scale: number
  offsetX: number
  offsetY: number
  rotation: number
  opacity: number
}

export const defaultSettings: CustomizerSettings = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
  opacity: 1,
}

interface CustomizerControlsProps {
  settings: CustomizerSettings
  onChange: (next: CustomizerSettings) => void
  disabled?: boolean
}

export function CustomizerControls({
  settings,
  onChange,
  disabled,
}: CustomizerControlsProps) {
  const update = (patch: Partial<CustomizerSettings>) =>
    onChange({ ...settings, ...patch })

  return (
    <div
      className="glass rounded-xl p-5 border border-white/70 shadow-soft-sm space-y-5"
      aria-disabled={disabled}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-primary" />
          <h3 className="font-heading text-sm font-bold uppercase tracking-[1.5px] text-ink">
            Adjust
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onChange(defaultSettings)}
          disabled={disabled}
          className="flex items-center gap-1 text-[11px] text-ink-light hover:text-primary disabled:opacity-50 transition"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      <Slider
        label="Size"
        icon={<Maximize className="w-3.5 h-3.5" />}
        min={0.4}
        max={1.6}
        step={0.02}
        value={settings.scale}
        onChange={(v) => update({ scale: v })}
        format={(v) => `${Math.round(v * 100)}%`}
        disabled={disabled}
      />

      <div className="grid grid-cols-2 gap-4">
        <Slider
          label="Horizontal"
          icon={<Move className="w-3.5 h-3.5 rotate-90" />}
          min={-0.3}
          max={0.3}
          step={0.005}
          value={settings.offsetX}
          onChange={(v) => update({ offsetX: v })}
          format={(v) => (v === 0 ? 'center' : `${v > 0 ? '+' : ''}${Math.round(v * 100)}`)}
          disabled={disabled}
        />
        <Slider
          label="Vertical"
          icon={<Move className="w-3.5 h-3.5" />}
          min={-0.3}
          max={0.3}
          step={0.005}
          value={settings.offsetY}
          onChange={(v) => update({ offsetY: v })}
          format={(v) => (v === 0 ? 'center' : `${v > 0 ? '+' : ''}${Math.round(v * 100)}`)}
          disabled={disabled}
        />
      </div>

      <Slider
        label="Rotation"
        icon={<RotateCw className="w-3.5 h-3.5" />}
        min={-30}
        max={30}
        step={1}
        value={settings.rotation}
        onChange={(v) => update({ rotation: v })}
        format={(v) => `${v}°`}
        disabled={disabled}
      />

      <Slider
        label="Opacity"
        icon={<Minimize className="w-3.5 h-3.5" />}
        min={0.2}
        max={1}
        step={0.02}
        value={settings.opacity}
        onChange={(v) => update({ opacity: v })}
        format={(v) => `${Math.round(v * 100)}%`}
        disabled={disabled}
      />
    </div>
  )
}

interface SliderProps {
  label: string
  icon: React.ReactNode
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
  format: (v: number) => string
  disabled?: boolean
}

function Slider({
  label,
  icon,
  min,
  max,
  step,
  value,
  onChange,
  format,
  disabled,
}: SliderProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-ink-light">
          {icon}
          {label}
        </label>
        <span className="text-[11px] font-mono text-ink-body tabular-nums">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full accent-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  )
}
