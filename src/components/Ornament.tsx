/** Қошқар мүйіз («бараний рог») — традиционный казахский мотив.
 *  Две зеркальные спирали из дуг; используется как логотип-знак и разделители. */

export function HornMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 20" className={className} fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <path d="M35 16 A13 13 0 0 0 9 16 A5.5 5.5 0 0 0 20 16 A2.5 2.5 0 0 0 15 16" />
        <path d="M37 16 A13 13 0 0 1 63 16 A5.5 5.5 0 0 1 52 16 A2.5 2.5 0 0 1 57 16" />
      </g>
    </svg>
  );
}

export function OrnamentDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-line" />
      <HornMark className="h-4 w-14 shrink-0 text-clay/70" />
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
