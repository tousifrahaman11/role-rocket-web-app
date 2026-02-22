"use client";

import { useState } from "react";

interface Props {
  type: "job" | "user";
  id: string;
}

export function AdminDeleteButton({ type, id }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/${type === "job" ? "jobs" : "users"}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to remove.");
        return;
      }

      window.location.reload();
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="rounded-full border border-red-500/40 bg-red-500/10 px-2 py-1 text-[10px] text-red-100 hover:border-red-400 disabled:opacity-60"
      >
        {loading ? "Removing..." : "Remove"}
      </button>
      {error && <span className="text-[9px] text-red-300">{error}</span>}
    </div>
  );
}

