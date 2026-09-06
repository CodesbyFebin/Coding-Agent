import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PillarDetailPage } from '../../../features/pillars/PillarDetailPage';
import { pillarBySlug, pillarStaticParams, pillarMetadata } from '../../../lib/site';

export function generateStaticParams() {
  return pillarStaticParams();
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return pillarMetadata(params.slug);
}

export default function Page({ params }: { params: { slug: string } }) {
  if (!pillarBySlug(params.slug)) {notFound();}
  return <PillarDetailPage slug={params.slug} />;
}
