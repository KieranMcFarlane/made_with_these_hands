'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { DirectusBlocks } from './directus-blocks';

const DETAIL_SLOTS = ['before-content', 'after-content', 'related-content'];

export default function TemplateSlotPortals({ slots, content }) {
  const [targets, setTargets] = useState({});

  useEffect(() => {
    const syncTargets = () => {
      const nextTargets = Object.fromEntries(
        DETAIL_SLOTS.map((slot) => [
          slot,
          document.querySelector(`[data-mwth-template-slot="${slot}"]`),
        ]),
      );
      setTargets((current) => (
        DETAIL_SLOTS.every((slot) => current[slot] === nextTargets[slot])
          ? current
          : nextTargets
      ));
    };

    syncTargets();
    const observer = new MutationObserver(syncTargets);
    observer.observe(document.getElementById('root') || document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return DETAIL_SLOTS.map((slot) => {
    const target = targets[slot];
    const blocks = slots[slot] || [];
    if (!target || blocks.length === 0) return null;
    return createPortal(
      <DirectusBlocks blocks={blocks} content={content} slot={slot} />,
      target,
      slot,
    );
  });
}
