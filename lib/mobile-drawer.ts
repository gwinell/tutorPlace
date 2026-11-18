type FocusTarget = {focus: () => void};
type TabEvent = {key: string; shiftKey: boolean; preventDefault: () => void};

export function trapDrawerTab(event: TabEvent, activeElement: unknown, focusable: FocusTarget[]) {
  if (event.key !== 'Tab') return false;
  if (!focusable.length) {
    event.preventDefault();
    return true;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && activeElement === first) {
    event.preventDefault();
    last.focus();
    return true;
  }
  if (!event.shiftKey && activeElement === last) {
    event.preventDefault();
    first.focus();
    return true;
  }
  return false;
}
