import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'aboveground.db');

declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

function getDb(): Database.Database {
  if (!global.__db) {
    global.__db = new Database(DB_PATH);
    global.__db.pragma('journal_mode = WAL');
    initSchema(global.__db);
  }
  return global.__db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      month TEXT NOT NULL,
      day TEXT NOT NULL,
      year TEXT NOT NULL,
      title TEXT NOT NULL,
      venue TEXT NOT NULL,
      city TEXT NOT NULL,
      desc TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS squad_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      initials TEXT NOT NULL,
      role TEXT NOT NULL,
      bio TEXT NOT NULL,
      quote TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS shop_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      icon TEXT NOT NULL,
      label TEXT NOT NULL,
      price TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS marquee_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL
    );
  `);

  const eventCount = (db.prepare('SELECT COUNT(*) as count FROM events').get() as { count: number }).count;
  if (eventCount === 0) seedData(db);

  const marqueeCount = (db.prepare('SELECT COUNT(*) as count FROM marquee_items').get() as { count: number }).count;
  if (marqueeCount === 0) seedMarquee(db);
}

function seedMarquee(db: Database.Database) {
  const insert = db.prepare('INSERT INTO marquee_items (text) VALUES (?)');
  db.transaction(() => {
    insert.run('Sankta T');
    insert.run('Louie Lanka');
    insert.run('HypeLies');
    insert.run('Dru-Boy');
    insert.run('Glass Guts');
    insert.run('Alexi');
    insert.run('Really Underground, Really Outside');
    insert.run('Est. 2021');
    insert.run('Chicago, IL');
    insert.run('Music · Events · Community');
  })();
}

function seedData(db: Database.Database) {
  const insertEvent = db.prepare(
    'INSERT INTO events (type, month, day, year, title, venue, city, desc) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  db.transaction(() => {
    insertEvent.run('ag',       'JUN', '15', '2026', 'AG Pres: Too Many Men Radio',       'TBA', 'Chicago, IL', 'AboveGround presents Too Many Men Radio — a night of deep house and electronic music.');
    insertEvent.run('ag',       'JUL', '18', '2026', 'AboveGround × Vibe Syndicate',      'TBA', 'Chicago, IL', 'A collaborative event with Vibe Syndicate collective.');
    insertEvent.run('external', 'AUG', '03', '2026', 'Sankta T @ Underground Resistance', 'TBA', 'Detroit, MI', 'Sankta T plays Underground Resistance event in Detroit.');
    insertEvent.run('ag',       'AUG', '22', '2026', 'AboveGround Open Decks',            'TBA', 'Chicago, IL', 'Open decks night with the full AboveGround crew.');
  })();

  const insertMember = db.prepare(
    'INSERT INTO squad_members (slug, name, initials, role, bio, quote) VALUES (?, ?, ?, ?, ?, ?)'
  );
  db.transaction(() => {
    insertMember.run('sankta-t',    'Sankta T',    'ST', 'DJ · Producer', 'Sankta T brings a blend of underground house and techno with a Chicago edge. Bio coming soon.', 'Sauce: something unique to me');
    insertMember.run('louie-lanka', 'Louie Lanka', 'LL', 'DJ · Producer', "Louie Lanka's sound defies easy categorization — expect the unexpected. Bio coming soon.",     'Your vibe, your frequency');
    insertMember.run('hypelies',    'HypeLies',    'HL', 'DJ · Producer', 'HypeLies cuts through the noise with surgical precision. Bio coming soon.',                       'Truth in the noise');
    insertMember.run('dru-boy',     'Dru-Boy',     'DB', 'DJ · Producer', 'Dru-Boy keeps the dance floor moving. Bio coming soon.',                                          'In the mix, always');
    insertMember.run('glass-guts',  'Glass Guts',  'GG', 'DJ · Producer', 'Glass Guts — raw, transparent, unfiltered. Bio coming soon.',                                    'Transparent frequencies');
    insertMember.run('alexi',       'Alexi',       'AX', 'DJ · Producer', 'Alexi stays in the cut, building energy with intention. Bio coming soon.',                       'In the cut, always');
  })();

  const insertItem = db.prepare(
    'INSERT INTO shop_items (icon, label, price) VALUES (?, ?, ?)'
  );
  db.transaction(() => {
    insertItem.run('◎', 'Stickers',  '$5');
    insertItem.run('▣', 'Shirts',    '$35');
    insertItem.run('⬡', 'USB Mixes', '$15');
  })();
}

export interface Event {
  id: number;
  type: string;
  month: string;
  day: string;
  year: string;
  title: string;
  venue: string;
  city: string;
  desc: string;
}

export interface SquadMember {
  id: number;
  slug: string;
  name: string;
  initials: string;
  role: string;
  bio: string;
  quote: string;
}

export interface ShopItem {
  id: number;
  icon: string;
  label: string;
  price: string;
}

export function getEvents(): Event[] {
  return getDb().prepare('SELECT * FROM events ORDER BY year, month, day').all() as Event[];
}

export function getAllSquadMembers(): SquadMember[] {
  return getDb().prepare('SELECT * FROM squad_members ORDER BY id').all() as SquadMember[];
}

export function getSquadMember(slug: string): SquadMember | undefined {
  return getDb().prepare('SELECT * FROM squad_members WHERE slug = ?').get(slug) as SquadMember | undefined;
}

export function getSquadSlugs(): string[] {
  const rows = getDb().prepare('SELECT slug FROM squad_members').all() as { slug: string }[];
  return rows.map(r => r.slug);
}

export function getShopItems(): ShopItem[] {
  return getDb().prepare('SELECT * FROM shop_items ORDER BY id').all() as ShopItem[];
}

export function createEvent(data: Omit<Event, 'id'>): Event {
  return getDb().prepare(
    'INSERT INTO events (type,month,day,year,title,venue,city,desc) VALUES (@type,@month,@day,@year,@title,@venue,@city,@desc) RETURNING *'
  ).get(data) as Event;
}

export function updateEvent(id: number, data: Omit<Event, 'id'>): Event | undefined {
  return getDb().prepare(
    'UPDATE events SET type=@type,month=@month,day=@day,year=@year,title=@title,venue=@venue,city=@city,desc=@desc WHERE id=@id RETURNING *'
  ).get({ ...data, id }) as Event | undefined;
}

export function deleteEvent(id: number): void {
  getDb().prepare('DELETE FROM events WHERE id=?').run(id);
}

export function createSquadMember(data: Omit<SquadMember, 'id'>): SquadMember {
  return getDb().prepare(
    'INSERT INTO squad_members (slug,name,initials,role,bio,quote) VALUES (@slug,@name,@initials,@role,@bio,@quote) RETURNING *'
  ).get(data) as SquadMember;
}

export function updateSquadMember(id: number, data: Omit<SquadMember, 'id'>): SquadMember | undefined {
  return getDb().prepare(
    'UPDATE squad_members SET slug=@slug,name=@name,initials=@initials,role=@role,bio=@bio,quote=@quote WHERE id=@id RETURNING *'
  ).get({ ...data, id }) as SquadMember | undefined;
}

export function deleteSquadMember(id: number): void {
  getDb().prepare('DELETE FROM squad_members WHERE id=?').run(id);
}

export function createShopItem(data: Omit<ShopItem, 'id'>): ShopItem {
  return getDb().prepare(
    'INSERT INTO shop_items (icon,label,price) VALUES (@icon,@label,@price) RETURNING *'
  ).get(data) as ShopItem;
}

export function updateShopItem(id: number, data: Omit<ShopItem, 'id'>): ShopItem | undefined {
  return getDb().prepare(
    'UPDATE shop_items SET icon=@icon,label=@label,price=@price WHERE id=@id RETURNING *'
  ).get({ ...data, id }) as ShopItem | undefined;
}

export function deleteShopItem(id: number): void {
  getDb().prepare('DELETE FROM shop_items WHERE id=?').run(id);
}

export interface MarqueeItem {
  id: number;
  text: string;
}

export function getMarqueeItems(): MarqueeItem[] {
  return getDb().prepare('SELECT * FROM marquee_items ORDER BY id').all() as MarqueeItem[];
}

export function createMarqueeItem(text: string): MarqueeItem {
  return getDb().prepare('INSERT INTO marquee_items (text) VALUES (?) RETURNING *').get(text) as MarqueeItem;
}

export function updateMarqueeItem(id: number, text: string): MarqueeItem | undefined {
  return getDb().prepare('UPDATE marquee_items SET text=? WHERE id=? RETURNING *').get(text, id) as MarqueeItem | undefined;
}

export function deleteMarqueeItem(id: number): void {
  getDb().prepare('DELETE FROM marquee_items WHERE id=?').run(id);
}
