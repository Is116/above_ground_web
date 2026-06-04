import { notFound } from 'next/navigation';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getEventBySlug, getEventSlugs, getSquadSlugs } from '@/lib/db';
import GallerySlideshow from './GallerySlideshow';

export async function generateStaticParams() {
  const slugs = await getEventSlugs();
  return slugs.map(slug => ({ slug }));
}

function soundcloudEmbedUrl(shareUrl: string): string {
  const encoded = encodeURIComponent(shareUrl);
  return `https://w.soundcloud.com/player/?url=${encoded}&color=%2300ffcc&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`;
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [event, squadSlugs] = await Promise.all([getEventBySlug(slug), getSquadSlugs()]);
  if (!event) notFound();

  const gallery: string[] = event.gallery ? JSON.parse(event.gallery) : [];

  const mono: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
  };

  return (
    <main style={{ background: '#000', minHeight: '100vh', color: '#fff' }}>
      <Nav />
      <div style={{ paddingTop: 64 }}>

        {/* Timeline date bar */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', height: 44 }}>
          <Link href="/events" style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
            ← All Events
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>
              {event.month} {event.day}, {event.year}
            </span>
            <span style={{ ...mono, fontSize: 9, padding: '2px 8px', color: event.type === 'ag' ? '#00ffcc' : '#ffe600', background: event.type === 'ag' ? 'rgba(0,255,204,0.08)' : 'rgba(255,230,0,0.08)' }}>
              {event.type === 'ag' ? '↑ AG Event' : '■ Community'}
            </span>
          </div>
          <span style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>
            Really Underground, Really Outside. est. 2021.
          </span>
        </div>

        {/* Gallery block */}
        {gallery.length > 0 ? (
          <GallerySlideshow
            items={gallery}
            title={event.title}
            venue={event.venue}
            city={event.city}
            artists={event.artists}
            squadSlugs={squadSlugs}
          />
        ) : (
          /* No-gallery header fallback */
          <div style={{ padding: '80px 40px 60px', background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
              {event.venue} · {event.city}
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 8vw, 80px)', letterSpacing: '0.04em', lineHeight: 1, marginBottom: 0 }}>
              {event.title}
            </h1>
          </div>
        )}

        {/* Recordings block */}
        {event.soundcloud && (
          <section style={{ padding: '64px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ maxWidth: 860, margin: '0 auto' }}>
              <div style={{ ...mono, fontSize: 13, color: '#00ffcc', marginBottom: 28 }}>
                Relive the wickedest sounds →
              </div>
              <iframe
                title="Soundcloud"
                width="100%"
                height="300"
                allow="autoplay"
                src={soundcloudEmbedUrl(event.soundcloud)}
                style={{ border: 'none', display: 'block' }}
              />
            </div>
          </section>
        )}

        {/* TY block */}
        {event.thankyou && (
          <section style={{ padding: '64px 40px', background: '#080808', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ maxWidth: 640, margin: '0 auto' }}>
              <div style={{ ...mono, fontSize: 9, color: '#00ffcc', marginBottom: 20 }}>
                From the AG family:
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.9, color: 'rgba(255,255,255,0.65)', whiteSpace: 'pre-wrap' }}>
                {event.thankyou}
              </p>
            </div>
          </section>
        )}

      </div>
      <Footer />
    </main>
  );
}
