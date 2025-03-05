interface SearchPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const { q: searchValue } = (resolvedParams || {}) as {
    [key: string]: string;
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-4">
      <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12">
        <h1 className="text-2xl font-bold">Search Results</h1>
        {searchValue ? (
          <p className="mt-4">
            Showing results for:{" "}
            <span className="font-bold">{searchValue}</span>
          </p>
        ) : (
          <p className="mt-4">Search for products</p>
        )}
        {/* TODO: Add search results */}
      </div>
    </div>
  );
}
