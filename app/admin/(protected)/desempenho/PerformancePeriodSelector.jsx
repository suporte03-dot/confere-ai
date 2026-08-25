'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import {
  DEFAULT_PERIOD,
  PERIOD_PRESETS,
  normalizePeriodKey,
} from '../../../../src/lib/admin/performance-period'

export default function PerformancePeriodSelector({
  periodKey = DEFAULT_PERIOD,
  fromInput = '',
  toInput = '',
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()
  const active = normalizePeriodKey(periodKey)

  function pushParams(next) {
    const params = new URLSearchParams(searchParams?.toString() || '')
    Object.entries(next).forEach(([key, value]) => {
      if (value == null || value === '') params.delete(key)
      else params.set(key, value)
    })
    const qs = params.toString()
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname)
    })
  }

  return (
    <div className="admin-perf-period" data-pending={pending ? 'true' : 'false'}>
      <div className="admin-perf-period__presets" role="group" aria-label="Período">
        {PERIOD_PRESETS.map((preset) => (
          <button
            key={preset.key}
            type="button"
            className={
              active === preset.key
                ? 'admin-perf-period__btn is-active'
                : 'admin-perf-period__btn'
            }
            onClick={() => {
              if (preset.key === 'custom') {
                pushParams({
                  periodo: 'custom',
                  de: fromInput || undefined,
                  ate: toInput || undefined,
                })
                return
              }
              pushParams({ periodo: preset.key, de: null, ate: null })
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {active === 'custom' ? (
        <form
          className="admin-perf-period__custom"
          onSubmit={(event) => {
            event.preventDefault()
            const form = new FormData(event.currentTarget)
            pushParams({
              periodo: 'custom',
              de: String(form.get('de') || ''),
              ate: String(form.get('ate') || ''),
            })
          }}
        >
          <label>
            De
            <input type="date" name="de" defaultValue={fromInput} required />
          </label>
          <label>
            Até
            <input type="date" name="ate" defaultValue={toInput} required />
          </label>
          <button type="submit" className="admin-btn admin-btn--ghost">
            Aplicar
          </button>
        </form>
      ) : null}
    </div>
  )
}
