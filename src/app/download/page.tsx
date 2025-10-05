"use client";

import { useEffect } from "react";

export default function DownloadPage() {
  useEffect(() => {
    try {
      const raw = window.location.hash ? window.location.hash.substring(1) : "";
      const dataUrl = raw ? decodeURIComponent(raw) : "";
      if (dataUrl && dataUrl.startsWith("data:image/")) {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "image.png";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          try {
            document.body.removeChild(a);
          } catch {}
        }, 0);
      }
    } catch {}
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center text-sm text-gray-600">
        Preparing your download…
      </div>
    </div>
  );
}
