/** "10s" -> "10 sec" for display */
export const formatDuration = (d: string) => (d.endsWith('s') ? `${d.slice(0, -1)} sec` : d);

/** Mention token for a reference name, e.g. "Mara Face" -> "MaraFace" */
export const mentionOf = (name: string) => name.replace(/\s+/g, '');
