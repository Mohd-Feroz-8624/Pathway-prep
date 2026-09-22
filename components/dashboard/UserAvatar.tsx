"use client";



type UserAvatarProps = {
  name?: string | null;
  size?: "sm" | "md";
};

export default function UserAvatar({ name, size = "md" }: UserAvatarProps) {
  const initials =
    name
      ?.trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const sizeClass = size === "sm" ? "h-8 w-8" : "h-9 w-9";

  return (
    <div
      className={`flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100`}
    >
      <div className="flex h-full w-full items-center justify-center bg-blue-50 text-xs font-bold text-blue-700">
        {initials}
      </div>
    </div>
  );
}
