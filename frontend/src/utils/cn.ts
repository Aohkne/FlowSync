/**
 * Simple class name merger for Tailwind CSS v4
 */
export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Conditional class names helper
 */
export function conditional(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}