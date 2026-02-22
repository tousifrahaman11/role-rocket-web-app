"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function JobActions({ jobId, isCandidate }: { jobId: string; isCandidate: boolean }) {
    const router = useRouter();
    const [loadingType, setLoadingType] = useState<"apply" | "save" | null>(null);

    if (!isCandidate) {
        return (
            <p className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-[11px] text-slate-400">
                Sign in as a candidate to apply and track this mission from your
                dashboard.
            </p>
        );
    }

    async function handleAction(type: "apply" | "save") {
        setLoadingType(type);
        try {
            const res = await fetch(`/api/jobs/${jobId}/${type}`, {
                method: "POST",
            });
            if (res.ok) {
                alert(type === "apply" ? "Successfully applied!" : "Saved to LaunchPad!");
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "Something went wrong.");
            }
        } catch (e) {
            alert("An error occurred.");
        } finally {
            setLoadingType(null);
        }
    }

    return (
        <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <button
                type="button"
                onClick={() => handleAction("apply")}
                disabled={loadingType !== null}
                className="inline-flex w-full items-center justify-center rounded-full bg-orange-500 px-4 py-2 text-xs font-medium text-slate-950 shadow-lg shadow-orange-500/40 transition hover:bg-orange-400 disabled:opacity-50"
            >
                {loadingType === "apply" ? "Processing..." : "Apply to this role"}
            </button>
            <button
                type="button"
                onClick={() => handleAction("save")}
                disabled={loadingType !== null}
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-medium text-slate-100 transition hover:border-sky-400 disabled:opacity-50"
            >
                {loadingType === "save" ? "Processing..." : "Save to LaunchPad"}
            </button>
            <p className="text-[10px] text-slate-500">
                We&apos;ll attach your latest RocketScore and resume to this application.
            </p>
        </div>
    );
}
