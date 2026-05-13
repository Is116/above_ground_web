import ArtistContent from "./ArtistContent";

const slugs = ["sankta-t", "louie-lanka", "hypelies", "dru-boy", "glass-guts", "alexi"];

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArtistContent slug={slug} />;
}
