interface PageProps {
  params: Promise<{
    page: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">{resolvedParams.page}</h1>
      {/* TODO: Add dynamic page content */}
    </div>
  );
}
