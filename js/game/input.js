/* Keyboard, mouse and touch, turned into two things the plane understands:
   dir (−1 up, 1 down, 0) from the keys, and target, a y to fly to, from a
   pointer. Keys win until the pointer moves again. A mouse points where the
   plane should be; a finger drags it relatively, so it never covers the plane.
   While the game is open, scroll keys and the wheel never reach the page. */

const UP = new Set(['ArrowUp', 'KeyW']);
const DOWN = new Set(['ArrowDown', 'KeyS']);
const PAGE_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'PageUp', 'PageDown', 'Home', 'End']);

export function createInput({ root, toY, planeY, on }) {
  const held = new Set();
  const state = {
    get dir() { return (held.has('down') ? 1 : 0) - (held.has('up') ? 1 : 0); },
    target: null,
    touch: matchMedia('(hover: none) and (pointer: coarse)').matches,   // decides "TAP" or "SPACE" in prompts
  };
  let drag = null;

  function keydown(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (on.menu?.(e)) return;      // the secret screens have keys of their own
    // Space and Enter on a focused control press that control
    const onControl = e.target instanceof Element && e.target.closest('button, a');
    if (onControl && (e.key === ' ' || e.key === 'Enter')) return;
    if (PAGE_KEYS.has(e.key)) e.preventDefault();

    if (UP.has(e.code) || e.key === 'ArrowUp') { held.add('up'); state.target = null; }
    else if (DOWN.has(e.code) || e.key === 'ArrowDown') { held.add('down'); state.target = null; }
    else if (e.repeat) return;
    else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); state.touch = false; on.action(); }
    else if (e.code === 'KeyP') on.pause();
    else if (e.key === 'Escape') { e.preventDefault(); on.escape(); }
    else if (e.code === 'KeyM') on.mute();
  }
  function keyup(e) {
    if (UP.has(e.code) || e.key === 'ArrowUp') held.delete('up');
    if (DOWN.has(e.code) || e.key === 'ArrowDown') held.delete('down');
  }
  const blur = () => held.clear();

  function pointerdown(e) {
    if (e.target.closest('button, a')) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    state.touch = e.pointerType !== 'mouse';
    if (state.touch) {
      drag = { id: e.pointerId, from: toY(e.clientY), plane: planeY() };
      root.setPointerCapture?.(e.pointerId);
    } else state.target = toY(e.clientY);
    on.action();
  }
  function pointermove(e) {
    if (e.pointerType === 'mouse') { state.target = toY(e.clientY); return; }
    if (drag && e.pointerId === drag.id) state.target = drag.plane + (toY(e.clientY) - drag.from) * on.touchGain;
  }
  function pointerup(e) {
    if (drag && e.pointerId === drag.id) { drag = null; state.target = null; }
  }
  const stop = (e) => e.preventDefault();

  const opts = { capture: true };
  const active = { passive: false };
  function attach() {
    addEventListener('keydown', keydown, opts);
    addEventListener('keyup', keyup, opts);
    addEventListener('blur', blur);
    addEventListener('wheel', stop, { capture: true, passive: false });
    root.addEventListener('pointerdown', pointerdown);
    root.addEventListener('pointermove', pointermove);
    root.addEventListener('pointerup', pointerup);
    root.addEventListener('pointercancel', pointerup);
    root.addEventListener('touchmove', stop, active);
    root.addEventListener('contextmenu', stop);
  }
  function detach() {
    removeEventListener('keydown', keydown, opts);
    removeEventListener('keyup', keyup, opts);
    removeEventListener('blur', blur);
    removeEventListener('wheel', stop, { capture: true });
    root.removeEventListener('pointerdown', pointerdown);
    root.removeEventListener('pointermove', pointermove);
    root.removeEventListener('pointerup', pointerup);
    root.removeEventListener('pointercancel', pointerup);
    root.removeEventListener('touchmove', stop, active);
    root.removeEventListener('contextmenu', stop);
    held.clear();
  }
  // a new run: forget a finger or a pointer from before
  state.release = () => { held.clear(); drag = null; state.target = null; };

  return Object.assign(state, { attach, detach });
}
