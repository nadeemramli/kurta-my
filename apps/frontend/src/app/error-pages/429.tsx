"use client";

export default function TooManyRequestsError() {
  return (
    <div className="mx-auto my-4 flex max-w-xl flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 dark:border-neutral-800 dark:bg-black">
      <h2 className="text-xl font-bold">Too Many Requests</h2>
      <p className="my-2">
        You&apos;ve made too many requests recently. Please wait a moment before
        trying again.
      </p>
      <button
        className="mx-auto mt-4 flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white hover:opacity-90"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );
}
