"use client";

export default function GoneError() {
  return (
    <div className="mx-auto my-4 flex max-w-xl flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 dark:border-neutral-800 dark:bg-black">
      <h2 className="text-xl font-bold">Resource No Longer Available</h2>
      <p className="my-2">
        The requested resource is no longer available and will not be available
        again. Please check our latest products instead.
      </p>
      <button
        className="mx-auto mt-4 flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white hover:opacity-90"
        onClick={() => (window.location.href = "/products")}
      >
        Browse Products
      </button>
    </div>
  );
}
