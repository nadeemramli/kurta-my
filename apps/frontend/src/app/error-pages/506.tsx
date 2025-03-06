"use client";

export default function VariantError() {
  return (
    <div className="mx-auto my-4 flex max-w-xl flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 dark:border-neutral-800 dark:bg-black">
      <h2 className="text-xl font-bold">Configuration Error</h2>
      <p className="my-2">
        There is an internal configuration error on our server. Our team has
        been notified and is working to resolve the issue.
      </p>
      <button
        className="mx-auto mt-4 flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white hover:opacity-90"
        onClick={() => (window.location.href = "/")}
      >
        Return Home
      </button>
    </div>
  );
}
