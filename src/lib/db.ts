import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaLibSql({
    url: process.env.TURSO_DATABASE_URL ?? 'file:aboveground.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
  return new PrismaClient({ adapter })
}

const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export type Event = {
  id: number
  type: string
  month: string
  day: string
  year: string
  title: string
  venue: string
  city: string
  desc: string
}

export type SquadMember = {
  id: number
  slug: string
  name: string
  initials: string
  role: string
  bio: string
  quote: string
}

export type ShopItem = {
  id: number
  icon: string
  label: string
  price: string
}

export type MarqueeItem = {
  id: number
  text: string
}

export function getEvents(): Promise<Event[]> {
  return prisma.event.findMany({ orderBy: [{ year: 'asc' }, { month: 'asc' }, { day: 'asc' }] })
}

export function getAllSquadMembers(): Promise<SquadMember[]> {
  return prisma.squadMember.findMany({ orderBy: { id: 'asc' } })
}

export function getSquadMember(slug: string): Promise<SquadMember | null> {
  return prisma.squadMember.findUnique({ where: { slug } })
}

export async function getSquadSlugs(): Promise<string[]> {
  const rows = await prisma.squadMember.findMany({ select: { slug: true } })
  return rows.map(r => r.slug)
}

export function getShopItems(): Promise<ShopItem[]> {
  return prisma.shopItem.findMany({ orderBy: { id: 'asc' } })
}

export function getMarqueeItems(): Promise<MarqueeItem[]> {
  return prisma.marqueeItem.findMany({ orderBy: { id: 'asc' } })
}

export function createEvent(data: Omit<Event, 'id'>): Promise<Event> {
  return prisma.event.create({ data })
}

export function updateEvent(id: number, data: Omit<Event, 'id'>): Promise<Event> {
  return prisma.event.update({ where: { id }, data })
}

export function deleteEvent(id: number): Promise<Event> {
  return prisma.event.delete({ where: { id } })
}

export function createSquadMember(data: Omit<SquadMember, 'id'>): Promise<SquadMember> {
  return prisma.squadMember.create({ data })
}

export function updateSquadMember(id: number, data: Omit<SquadMember, 'id'>): Promise<SquadMember> {
  return prisma.squadMember.update({ where: { id }, data })
}

export function deleteSquadMember(id: number): Promise<SquadMember> {
  return prisma.squadMember.delete({ where: { id } })
}

export function createShopItem(data: Omit<ShopItem, 'id'>): Promise<ShopItem> {
  return prisma.shopItem.create({ data })
}

export function updateShopItem(id: number, data: Omit<ShopItem, 'id'>): Promise<ShopItem> {
  return prisma.shopItem.update({ where: { id }, data })
}

export function deleteShopItem(id: number): Promise<ShopItem> {
  return prisma.shopItem.delete({ where: { id } })
}

export function createMarqueeItem(text: string): Promise<MarqueeItem> {
  return prisma.marqueeItem.create({ data: { text } })
}

export function updateMarqueeItem(id: number, text: string): Promise<MarqueeItem> {
  return prisma.marqueeItem.update({ where: { id }, data: { text } })
}

export function deleteMarqueeItem(id: number): Promise<MarqueeItem> {
  return prisma.marqueeItem.delete({ where: { id } })
}
