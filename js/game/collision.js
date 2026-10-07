/* Axis-aligned box overlap. Boxes are { x, y, w, h } in game pixels. */
export const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
