"use client";

export default function UnauthorizedError() {
  return (
    <div className="mx-auto my-4 flex max-w-xl flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 dark:border-neutral-800 dark:bg-black">
      <h2 className="text-xl font-bold">Unauthorized Access</h2>
      <p className="my-2">
        You need to be authenticated to access this resource. Please log in and
        try again.
      </p>
      <div className="flex flex-col gap-4 mt-4">
        <button
          className="flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white hover:opacity-90"
          onClick={() => (window.location.href = "/login")}
        >
          Log In
        </button>
        <button
          className="flex w-full items-center justify-center rounded-full border border-neutral-200 p-4 tracking-wide text-neutral-900 hover:bg-neutral-100 dark:border-neutral-800 dark:text-white dark:hover:bg-neutral-900"
          onClick={() => (window.location.href = "/")}
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
