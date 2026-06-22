import type { ResearchLayer } from "@/lib/research";

export function ResearchMap({ layers }: { layers: ResearchLayer[] }) {
  return (
    <div className="grid gap-px bg-[var(--line-soft)] lg:grid-cols-2 2xl:grid-cols-3">
      {layers.map((layer, index) => (
        <div
          key={layer.layer}
          className="rise surface-hover group relative bg-[var(--bg)] p-7 sm:p-8 lg:p-9 transition-colors duration-500 hover:bg-[var(--bg-1)]"
          style={{ animationDelay: `${index * 0.055}s` }}
        >
          {/* Corner index — Abloh-grade industrial metadata */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <span className="label text-[var(--fg-faint)] tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            {/* Hairline corner accent — top-right bracket */}
            <div className="w-5 h-5 border-t border-r border-[var(--line)] opacity-50 transition-opacity duration-500 group-hover:opacity-100 group-hover:border-[var(--metal-4)]" />
          </div>

          {/* Layer name */}
          <h3 className="metal-text max-w-[18rem] text-[1.05rem] font-semibold tracking-[-0.025em] leading-[1.2] sm:text-[1.15rem] transition-all duration-500">
            {layer.layer}
          </h3>

          {/* Description */}
          {layer.description ? (
            <p className="mt-4 max-w-[28rem] text-[0.88rem] leading-[1.8] text-[var(--fg-mute)] transition-colors duration-500 group-hover:text-[var(--fg-dim)]">
              {layer.description}
            </p>
          ) : null}

          {/* Note */}
          {layer.note ? (
            <p className="mt-3 whitespace-pre-line text-[0.84rem] leading-relaxed text-[var(--fg-faint)]">
              {layer.note}
            </p>
          ) : null}

          {/* Items list — hairline-separated rows */}
          <ul className="mt-6 space-y-0">
            {layer.items.slice(0, 4).map((item, itemIndex) => (
              <li
                key={item.title}
                className="flex items-baseline gap-3 border-b border-[var(--line-soft)] py-2.5 last:border-b-0 transition-colors duration-500 group-hover:border-[var(--line)]"
              >
                <span
                  className="label text-[0.55rem] text-[var(--fg-faint)] tabular-nums shrink-0"
                  aria-hidden="true"
                >
                  {String(itemIndex + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.84rem] text-[var(--fg-dim)] tracking-[-0.005em] transition-colors duration-500 group-hover:text-[var(--fg)]">
                  {item.title}
                </span>
              </li>
            ))}
          </ul>

          {/* Overflow count */}
          {layer.items.length > 4 ? (
            <p className="mt-4 label text-[var(--fg-faint)]">
              +{layer.items.length - 4}&nbsp;more
            </p>
          ) : null}

          {/* Bottom hairline signal bar — subtle accent on hover */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--line-soft)] to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        </div>
      ))}
    </div>
  );
}
