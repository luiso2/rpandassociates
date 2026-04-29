import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, Upload, ArrowRight, Wand2 } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Homepage section that surfaces the /customize feature without
 * burying it as a single nav link. Visually shows the value prop:
 * "upload your logo → see it on a product → submit a quote."
 */
export function LogoVisualizerTeaser() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-ink via-ink-body to-ink text-white">
      {/* Decorative background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            'radial-gradient(ellipse at 80% 30%, rgba(201,168,76,0.18), transparent 55%), radial-gradient(ellipse at 15% 80%, rgba(0,41,204,0.22), transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <Container>
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal variant="left">
            <span className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-pill text-[10px] font-bold uppercase tracking-[2px] text-gold bg-gold/10 border border-gold/30">
              <Sparkles className="w-3 h-3" />
              New · Live Preview
            </span>
            <h2 className="font-heading font-extrabold text-[clamp(2rem,4.5vw,3.4rem)] leading-tight mb-5 tracking-tight">
              See your <span className="text-gradient-gold">logo</span> on any
              product — before you order.
            </h2>
            <p className="text-white/75 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
              Upload your brand mark and our visualizer wraps it onto Moscow
              Mules, shakers, glacier bags, and grub tubs in real time, with
              cylinder, sphere, and flat 3D-feel rendering. Switch products,
              tune the placement, download a preview, then attach it to your
              quote.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href="/customize"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-pill bg-gradient-to-br from-gold to-gold-dark text-white text-sm font-bold uppercase tracking-wider shadow-gold hover:from-gold-light hover:to-gold hover:-translate-y-1 transition-all"
              >
                <Wand2 className="w-4 h-4" />
                Try Your Logo Live
              </Link>
              <Link
                href="/customize?p=classic-moscow-mule"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-pill bg-white/10 text-white text-sm font-bold uppercase tracking-wider border border-white/30 backdrop-blur-md hover:bg-white/20 transition"
              >
                Start with the Mule <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <ul className="space-y-2.5 text-white/70 text-sm">
              <Step icon={<Upload className="w-3.5 h-3.5" />} label="Drop a PNG, SVG, or JPG (5MB max)" />
              <Step icon={<Wand2 className="w-3.5 h-3.5" />} label="See it wrapped onto the product surface in real time" />
              <Step icon={<Sparkles className="w-3.5 h-3.5" />} label="Send it for a quote — your design comes attached" />
            </ul>
          </Reveal>

          <Reveal variant="right" delay={120}>
            <div className="relative">
              {/* Premium showcase frame — layered depth, ambient glow,
                  3D-tilt mug, and gold sparkles for a "studio-rendered"
                  feel without shipping a real WebGL scene. */}
              <div
                className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.02] to-transparent backdrop-blur-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.65)]"
                style={{ perspective: '1400px' }}
              >
                {/* Ambient color orbs (depth) */}
                <div
                  aria-hidden
                  className="absolute -top-1/3 -left-1/4 w-2/3 h-2/3 rounded-full bg-primary/20 blur-3xl"
                />
                <div
                  aria-hidden
                  className="absolute -bottom-1/4 -right-1/4 w-2/3 h-2/3 rounded-full bg-gold/20 blur-3xl"
                />
                {/* Subtle dot grid backdrop */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />

                {/* Product hero — tilted slightly for 3D feel,
                    huge drop shadow makes it feel like it's floating */}
                <div
                  className="absolute inset-0 flex items-center justify-center p-10"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div
                    className="relative w-full h-full transition-transform duration-700 ease-spring"
                    style={{
                      transform: 'rotateY(-7deg) rotateX(3deg)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <Image
                      src="https://www.rpacatalog.com/media/catalog/product/cache/e11a83343d9f0597480ee66c9eea9fbe/c/l/classic_moscow_mule_mugs_wix_1_.png"
                      alt="Classic Moscow Mule mug"
                      fill
                      sizes="(max-width: 1024px) 90vw, 560px"
                      className="object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.5)]"
                      priority
                    />
                  </div>
                </div>

                {/* Logo placeholder — wrapped on mug surface */}
                <div
                  aria-hidden
                  className="absolute top-[42%] left-1/2 -translate-x-1/2 w-[28%] aspect-[2/1] rounded-md flex items-center justify-center font-heading font-extrabold text-[10px] uppercase tracking-[2.5px] text-white bg-gradient-to-br from-gold-light via-gold to-gold-dark shadow-[0_8px_24px_-4px_rgba(201,168,76,0.6)] border border-white/30 z-10"
                  style={{
                    transform:
                      'translate(-50%, 0) perspective(800px) rotateY(-10deg) rotateX(4deg)',
                  }}
                >
                  Your Logo
                </div>

                {/* Glossy diagonal sheen — the "studio render" cue */}
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.02) 55%, transparent 70%)',
                  }}
                />

                {/* Floating gold sparkles */}
                <span
                  aria-hidden
                  className="absolute top-8 right-10 w-1 h-1 rounded-full bg-gold-light animate-pulse"
                />
                <span
                  aria-hidden
                  className="absolute top-16 right-20 w-[3px] h-[3px] rounded-full bg-gold animate-pulse"
                  style={{ animationDelay: '0.4s' }}
                />
                <span
                  aria-hidden
                  className="absolute bottom-14 left-10 w-[3px] h-[3px] rounded-full bg-gold-light animate-pulse"
                  style={{ animationDelay: '0.8s' }}
                />
                <span
                  aria-hidden
                  className="absolute bottom-24 left-20 w-1 h-1 rounded-full bg-gold animate-pulse"
                  style={{ animationDelay: '1.2s' }}
                />
              </div>

              {/* Caption pill */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-pill bg-white text-ink text-[11px] sm:text-xs font-bold uppercase tracking-[1.5px] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.45)] flex items-center gap-2 whitespace-nowrap z-20 border border-white/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Real-time render · 3D feel
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

function Step({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex items-center gap-2.5">
      <span className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-gold-light shrink-0">
        {icon}
      </span>
      {label}
    </li>
  )
}
