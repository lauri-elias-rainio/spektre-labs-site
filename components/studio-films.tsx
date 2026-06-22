import { Reveal } from "@/components/reveal";
import studio from "@/data/studio-videos.json";

/*
  StudioFilms — the real @spektrelabs films. Thumbnails pulled from YouTube,
  each card links to the actual video. No placeholders — these exist.
*/

type Video = { id: string; title: string };

export function StudioFilms() {
  const videos = studio.videos as Video[];

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v, i) => (
          <Reveal key={v.id} delay={Math.min(i * 90, 270)}>
            <a
              href={`https://www.youtube.com/watch?v=${v.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              {/* thumbnail */}
              <div className="relative aspect-video overflow-hidden rounded-[12px] border border-[var(--line)] transition-colors duration-500 group-hover:border-[var(--line-strong)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                  alt={v.title}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-80 grayscale transition-all duration-700 group-hover:scale-[1.03] group-hover:opacity-100 group-hover:grayscale-0"
                />
                {/* OLED veil + grain */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                {/* play mark */}
                <div className="pointer-events-none absolute inset-0 grid place-items-center">
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-[var(--metal-3)] bg-black/40 backdrop-blur-sm transition-colors duration-500 group-hover:border-[var(--metal-1)]">
                    <span className="ml-0.5 text-[var(--metal-1)]">▶</span>
                  </span>
                </div>
                {/* index */}
                <span className="label absolute left-3 top-3 text-[0.6rem] text-[var(--metal-2)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              {/* title */}
              <p className="mt-3 text-[0.96rem] font-medium leading-snug text-[var(--fg-dim)] transition-colors duration-500 group-hover:text-[var(--fg)]">
                {v.title}
              </p>
            </a>
          </Reveal>
        ))}
      </div>

      <div className="mt-8">
        <a
          href={studio.channel}
          target="_blank"
          rel="noopener noreferrer"
          className="label text-[var(--fg-mute)] transition-colors duration-500 hover:text-[var(--fg)]"
        >
          @spektrelabs — full channel ↗
        </a>
      </div>
    </div>
  );
}
