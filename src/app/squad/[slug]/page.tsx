import { notFound } from "next/navigation";
import ArtistContent from "./ArtistContent";
import { getSquadMember, getSquadSlugs } from "@/lib/db";

export async function generateStaticParams() {
  return getSquadSlugs().map(slug => ({ slug }));
}

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = getSquadMember(slug);
  if (!member) notFound();
  return <ArtistContent member={member} />;
}
