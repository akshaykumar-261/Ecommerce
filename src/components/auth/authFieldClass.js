const BASE_FIELD_CLASS =
  "w-full border border-violet-200 rounded-lg py-1.5 pl-10 pr-3 text-sm outline-none bg-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] focus:border-violet-500 focus:shadow-[0_3px_10px_rgba(139,92,246,0.18)]";

export function authFieldClass(extraClass = "") {
  // Let a caller supplied border-* utility win over the default border color,
  // since duplicate Tailwind classes resolve by stylesheet order, not order here.
  const base = extraClass.includes("border-gray")
    ? BASE_FIELD_CLASS.replace("border-violet-200 ", "")
    : BASE_FIELD_CLASS;

  return [base, extraClass].filter(Boolean).join(" ");
}

export default authFieldClass;
