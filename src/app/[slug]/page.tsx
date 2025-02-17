import Page from '@/components/Page';

export default function DynamicPage({ params }: { params: { slug: string } }) {
  return <Page slug={params.slug} />;
}