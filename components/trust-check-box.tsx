"use client";

import { useState } from "react";

import { trustCheck, type TrustRead } from "@/lib/trust-check";

const SAMPLE =
  "This revolutionary AI is 100% accurate and the greatest ever built — it hits 2M throughput and 78% accuracy.";

export function TrustCheckBox() {
  const [text, setText] = useState("");
  const [read, setRead] = useState<TrustRead | null>(null);

  function run(v: string) {
    setText(v);
    setRead(v.trim() ? trustCheck(v) : null);
  }

  const tone =
    read?.read.startsWith("DO NOT")
      ? "text-[var(--signal)]"
      : read?.read.startsWith("read skeptically")
      ? "text-[var(--fg)]"
      : "text-[var(--fg-dim)]";

  return (
    <div className="border border-[var(--line-soft)] p-5 sm:p-6">
      <label className="label mb-3 block text-[var(--fg-faint)]">
        paste any AI answer — read stays on your device
      </label>
      <textarea
        value={text}
        onChange={(e) => run(e.target.value)}
        rows={4}
        placeholder="Paste an AI answer, a claim, an email…"
        className="w-full resize-y border border-[var(--line-soft)] bg-transparent p-3 font-mono text-[0.82rem] leading-relaxed text-[var(--fg-dim)] outline-none focus:border-[var(--line-strong)]"
      />
      <button
        onClick={() => run(SAMPLE)}
        className="label mt-3 text-[var(--fg-faint)] underline underline-offset-4 hover:text-[var(--fg-dim)]"
      >
        try a sample
      </button>

      {read && (
        <div className="mt-6 border-t border-[var(--line-soft)] pt-5">
          <p className={`text-base font-medium ${tone}`}>{read.read}</p>
          <div className="mt-4 grid gap-2 text-[0.82rem] leading-relaxed text-[var(--fg-dim)]">
            <p>
              <span className="label mr-2 text-[var(--fg-faint)]">evidence</span>
              {read.evidence_hint}
            </p>
            {read.injection.length > 0 && (
              <p>
                <span className="label mr-2 text-[var(--signal)]">injection</span>
                {read.injection.join(" · ")}
              </p>
            )}
            {read.overclaims.length > 0 && (
              <p>
                <span className="label mr-2 text-[var(--fg-faint)]">unanchored</span>
                {read.overclaims.join(" · ")}
              </p>
            )}
            {read.forbidden_merge && (
              <p>
                <span className="label mr-2 text-[var(--fg-faint)]">mixed evidence</span>
                {read.forbidden_merge.classes.join(" + ")} in one sentence
              </p>
            )}
          </div>
          <p className="mt-4 text-[0.75rem] leading-relaxed text-[var(--fg-mute)]">{read.note}</p>
        </div>
      )}
    </div>
  );
}
