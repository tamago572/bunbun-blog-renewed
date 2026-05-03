"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type MarkdownImageViewerProps = {
  src: string;
  alt: string;
};

export default function MarkdownImageViewer({ src, alt }: MarkdownImageViewerProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    let viewerInstance: { destroy: () => void } | null = null;
    let isMounted = true;

    void import("viewerjs").then(({ default: Viewer }) => {
      if (!isMounted || !container) {
        return;
      }

      viewerInstance = new Viewer(container, {
        inline: false,
        navbar: false,
        title: false,
        toolbar: true,
        transition: true,
      });
    });

    return () => {
      isMounted = false;
      viewerInstance?.destroy();
    };
  }, []);

  return (
    <span ref={containerRef} className="my-4 inline-block max-w-full">
      <Image
        src={src}
        alt={alt}
        loading="eager"
        className="max-w-full h-auto rounded-lg shadow-xl"
        width={720}
        height={480}
      />
    </span>
  );
}
