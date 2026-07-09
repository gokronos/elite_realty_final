"use client";

import { FormEvent, useState } from "react";
import { LockKeyhole } from "lucide-react";

const ACCESS_COOKIE = "elite_site_access";
const ACCESS_SECRET = "elite-preview-2026";

export function ClientAccessForm() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (code.trim() !== ACCESS_SECRET) {
      setError("Invalid access code.");
      return;
    }

    document.cookie = `${ACCESS_COOKIE}=${ACCESS_SECRET}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax; Secure`;
    window.location.href = "/";
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3"
    >
      <label className="sr-only" htmlFor="client-access-code">
        Client access code
      </label>
      <div className="flex min-h-12 overflow-hidden border border-white/25 bg-black/35">
        <div className="flex w-12 items-center justify-center text-[#d4af37]">
          <LockKeyhole className="h-4 w-4" />
        </div>
        <input
          id="client-access-code"
          type="password"
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setError("");
          }}
          placeholder="Client access code"
          className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-white/45"
        />
        <button
          type="submit"
          className="bg-white px-5 text-xs font-semibold uppercase tracking-[0.12em] text-black transition-colors hover:bg-[#d4af37]"
        >
          Enter
        </button>
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
    </form>
  );
}
