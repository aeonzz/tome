"use client"

import { IconEye, IconHeart, IconRocket } from "@tome/ui/icons"

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-24 py-24 px-52 max-w-7xl border-x border-border mx-auto">
      <section className="space-y-8 text-center">
        <h1 className="text-4xl md:text-6xl font-medium tracking-tighter">
          Beyond the <span className="text-muted-foreground">bookmark.</span>
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Tome was built with a simple premise: a digital library should be as
          elegant as a physical one, and as fast as thought itself.
        </p>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <IconRocket size={20} />
          </div>
          <h3 className="text-lg font-medium tracking-tight">Speed first</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every interaction is optimized for performance. No bloat, no lag,
            just instant access to inspiration.
          </p>
        </div>
        <div className="space-y-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <IconHeart size={20} />
          </div>
          <h3 className="text-lg font-medium tracking-tight">
            Privacy by design
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Data remains under user control. Transparency and user ownership are
            core to the digital footprint.
          </p>
        </div>
        <div className="space-y-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <IconEye size={20} />
          </div>
          <h3 className="text-lg font-medium tracking-tight">
            Minimalist focus
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Noise is stripped away to keep focus on the signal. A pristine
            workspace for digital treasures.
          </p>
        </div>
      </div>

      <section className="space-y-12 border-t border-border pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            <h2 className="text-3xl font-medium tracking-tight">Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Tome is a sanctuary for digital life, designed for capturing,
              organizing, and rediscovering inspiration with pure joy and zero
              friction.
            </p>
          </div>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              In a world of constant noise and information overload, Tome exists
              to provide clarity. A digital library shouldn&apos;t be a
              graveyard of forgotten links, but a vibrant source of wisdom that
              grows over time.
            </p>
            <p>
              The goal is to strip away every unnecessary pixel until only the
              tools that matter remain. A pristine workspace for absolute best
              ideas.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
