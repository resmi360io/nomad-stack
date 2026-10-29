// The teller's stamp: violet ink, a ruled box, no fill. It marks the top row only, and only when
// that row's margin is sourced (see calculate()); this component decides nothing.
export function BestValueBadge() {
  return (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-[3px] border-[1.5px] border-stamp px-1.5 py-px text-xs font-semibold text-stamp">
      Best value
    </span>
  );
}
