import { useEffect, useId, useRef, useState } from 'react'
import { ArrowDown, Check } from 'lucide-react'

const controlClass = 'min-h-12 w-full rounded-lg border border-line bg-base px-4 py-3 text-base text-ink transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20'

export default function SelectDropdown({
  id,
  name,
  value,
  placeholder = 'Select an option',
  options,
  required = false,
  errorId,
  error = '',
  listLabel = 'Options',
  ariaLabel,
  onChange,
  onBlur,
  onValueChange,
  className = '',
  triggerClassName = '',
}) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const listId = useId()
  const rootRef = useRef(null)
  const selectedIndex = options.indexOf(value)
  const activeOptionId = open ? `${listId}-option-${activeIndex}` : undefined

  useEffect(() => {
    if (!open) return undefined
    const closeOnOutsidePointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsidePointer)
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer)
  }, [open])

  const openAt = (index = selectedIndex >= 0 ? selectedIndex : 0) => {
    setActiveIndex(index)
    setOpen(true)
  }

  const choose = (option) => {
    if (onValueChange) onValueChange(option)
    if (name && onChange) {
      const target = { name, value: option }
      onChange({ target })
      onBlur?.({ target })
    }
    setOpen(false)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) {
        openAt()
        return
      }
      const direction = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((current) => (current + direction + options.length) % options.length)
    } else if (event.key === 'Home' && open) {
      event.preventDefault()
      setActiveIndex(0)
    } else if (event.key === 'End' && open) {
      event.preventDefault()
      setActiveIndex(options.length - 1)
    } else if ((event.key === 'Enter' || event.key === ' ') && open) {
      event.preventDefault()
      choose(options[activeIndex])
    } else if ((event.key === 'Enter' || event.key === ' ') && !open) {
      event.preventDefault()
      openAt()
    } else if (event.key === 'Escape' && open) {
      event.preventDefault()
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={activeOptionId}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onKeyDown={handleKeyDown}
        onBlur={() => setOpen(false)}
        onClick={() => open ? setOpen(false) : openAt()}
        className={`${controlClass} flex items-center justify-between gap-3 text-left ${value ? '' : 'text-muted'} ${error ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''} ${triggerClassName}`}
      >
        <span className="truncate">{value || placeholder}</span>
        <ArrowDown aria-hidden="true" className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          id={listId}
          role="listbox"
          aria-label={listLabel}
          className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 max-h-64 overflow-y-auto rounded-xl border border-line bg-surface p-1.5 shadow-xl shadow-black/30"
        >
          {options.map((option, index) => (
            <div
              id={`${listId}-option-${index}`}
              key={option}
              role="option"
              aria-selected={value === option}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(option)}
              className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 text-sm transition-colors ${activeIndex === index ? 'bg-accent/15 text-ink' : 'text-muted hover:bg-base hover:text-ink'}`}
            >
              <span>{option}</span>
              {value === option && <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-accent-soft" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
