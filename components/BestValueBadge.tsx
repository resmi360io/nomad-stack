// Marks the top row only, and only when that row's margin is sourced (see calculate()); this
// component decides nothing.
export function BestValueBadge() {
  return (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-[4px] bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
      Best value
    </span>
  );
}
