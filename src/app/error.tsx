"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-5">⚠️</div>
        <h1 className="text-xl font-bold text-white mb-2">Bir şeyler ters gitti</h1>
        <p className="text-white/40 text-sm mb-6">
          Sayfa yüklenirken bir hata oluştu. Lütfen tekrar dene.
        </p>
        {error?.message && (
          <pre className="text-[11px] text-white/30 bg-white/[0.04] rounded-xl p-3 mb-6 overflow-x-auto text-left">
            {error.message}
          </pre>
        )}
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-xl transition-all"
        >
          Tekrar Dene
        </button>
      </div>
    </div>
  );
}
