import { createClient } from '@libsql/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

async function main() {
  console.log('Clearing tables...')
  await client.execute('DELETE FROM events')
  await client.execute('DELETE FROM squad_members')
  await client.execute('DELETE FROM shop_items')
  await client.execute('DELETE FROM marquee_items')

  // Reset autoincrement counters
  await client.execute("DELETE FROM sqlite_sequence WHERE name IN ('events','squad_members','shop_items','marquee_items')")

  // ── Squad ──────────────────────────────────────────────────────────────────
  console.log('Seeding squad...')
  const squad = [
    { slug: 'sankta-t',  name: 'Sankta T',    initials: 'ST', role: 'MC · DJ',            bio: 'Sankta T brings a blend of underground house and techno with a Chicago edge. Bio coming soon.',          quote: 'Sauce: something unique to me' },
    { slug: 'louie-lanka', name: 'Louie Lanka', initials: 'LL', role: 'DJ · Producer',      bio: "Louie Lanka's sound defies easy categorization — expect the unexpected. Bio coming soon.",               quote: 'Your vibe, your frequency' },
    { slug: 'hypelies',  name: 'HypeLies',     initials: 'HL', role: 'DJ · Badbwoi',        bio: 'HypeLies cuts through the noise with surgical precision. Bio coming soon.',                              quote: 'Truth in the noise' },
    { slug: 'dru-boy',   name: 'Dru-Boy',      initials: 'DB', role: 'DJ · Producer',       bio: 'Dru-Boy keeps the dance floor moving. Bio coming soon.',                                                 quote: 'In the mix, always' },
    { slug: 'glass-guts', name: 'Glass Guts',  initials: 'GG', role: 'DJ · Dubplate Don',   bio: 'Glass Guts — raw, transparent, unfiltered. Bio coming soon.',                                           quote: 'Transparent frequencies' },
    { slug: 'alexi',     name: 'Alexi',         initials: 'AX', role: 'DJ · Guitarist',      bio: 'Alexi stays in the cut, building energy with intention. Bio coming soon.',                              quote: 'In the cut, always' },
  ]
  for (const m of squad) {
    await client.execute({
      sql: 'INSERT INTO squad_members (slug, name, initials, role, bio, quote) VALUES (?,?,?,?,?,?)',
      args: [m.slug, m.name, m.initials, m.role, m.bio, m.quote],
    })
  }

  // ── Events ─────────────────────────────────────────────────────────────────
  console.log('Seeding events...')
  const events = [
    {
      type: 'ag',
      month: 'JUN', day: '15', year: '2026',
      title: 'AG Pres: Too Many Men Radio',
      venue: 'TBA', city: 'Chicago, IL',
      desc: 'AboveGround presents Too Many Men Radio — a night of deep house and electronic music.',
      artists: 'Louie Lanka\nHypeLies\nDru-Boy',
      gallery: null, thankyou: null,
      slug: '2606-toomanymen', soundcloud: null,
      ticketUrl: null,
    },
    {
      type: 'ag',
      month: 'JUL', day: '18', year: '2026',
      title: 'AboveGround × Vibe Syndicate',
      venue: 'TBA', city: 'Chicago, IL',
      desc: 'A collaborative event with Vibe Syndicate collective.',
      artists: 'Sankta T\nGlass Guts\nAlexi',
      gallery: null, thankyou: null,
      slug: '2607-vibesyndicate', soundcloud: null,
      ticketUrl: null,
    },
    {
      type: 'community',
      month: 'AUG', day: '3', year: '2026',
      title: 'Sankta T @ Underground Resistance',
      venue: 'Underground Resistance HQ', city: 'Detroit, MI',
      desc: 'Sankta T plays Underground Resistance event in Detroit.',
      artists: 'Sankta T',
      gallery: JSON.stringify(['https://eugyl49crx.ufs.sh/f/gxsoMIVbtrkJ66ucOzIWbEdV1T3ZFK6zAxPBDpmhoX9rQOHw']),
      thankyou: null,
      slug: '2608-undergroundresistance', soundcloud: null,
      ticketUrl: null,
    },
    {
      type: 'ag',
      month: 'AUG', day: '22', year: '2026',
      title: 'AboveGround Open Decks',
      venue: 'TBA', city: 'Chicago, IL',
      desc: 'Open decks night with the full AboveGround crew.',
      artists: 'Sankta T\nLouie Lanka\nHypeLies\nDru-Boy\nGlass Guts\nAlexi',
      gallery: null, thankyou: null,
      slug: '2608-opendecks', soundcloud: null,
      ticketUrl: null,
    },
  ]
  for (const e of events) {
    await client.execute({
      sql: `INSERT INTO events (type,month,day,year,title,venue,city,desc,artists,gallery,thankyou,slug,soundcloud,ticket_url)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [e.type, e.month, e.day, e.year, e.title, e.venue, e.city, e.desc,
             e.artists, e.gallery, e.thankyou, e.slug, e.soundcloud, e.ticketUrl],
    })
  }

  // ── Shop ───────────────────────────────────────────────────────────────────
  console.log('Seeding shop...')
  const shopItems = [
    { icon: '◎', label: 'Stickers', price: '$5' },
    { icon: '▣', label: 'Shirts',   price: '$35' },
    { icon: '⬡', label: 'USB Mixes', price: '$15' },
  ]
  for (const s of shopItems) {
    await client.execute({
      sql: 'INSERT INTO shop_items (icon, label, price) VALUES (?,?,?)',
      args: [s.icon, s.label, s.price],
    })
  }

  // ── Marquee ────────────────────────────────────────────────────────────────
  console.log('Seeding marquee...')
  const marqueeItems = [
    'Sankta T', 'Louie Lanka', 'HypeLies', 'Dru-Boy', 'Glass Guts', 'Alexi',
    'Really Underground, Really Outside', 'Est. 2021', 'Chicago, IL', 'Music · Events · Community',
  ]
  for (const text of marqueeItems) {
    await client.execute({
      sql: 'INSERT INTO marquee_items (text) VALUES (?)',
      args: [text],
    })
  }

  console.log('Done.')
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
