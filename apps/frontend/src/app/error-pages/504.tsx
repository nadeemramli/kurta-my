"use client";

export default function GatewayTimeoutError() {
  return (
    <div className="mx-auto my-4 flex max-w-xl flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 dark:border-neutral-800 dark:bg-black">
      <h2 className="text-xl font-bold">Gateway Timeout</h2>
      <p className="my-2">
        The server took too long to respond. This could be due to high traffic
        or connectivity issues. Please try again.
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
