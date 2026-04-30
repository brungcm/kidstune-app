interface ThemeCardProps {
  emoji: string;
  label: string;
  color: string;
}

export default function ThemeCard({ emoji, label, color }: ThemeCardProps) {
  return (
    <div
      className="flex flex-col items-center gap-3 p-6 rounded-card shadow-sm transition-transform duration-200 hover:scale-105 hover:shadow-md"
      style={{ backgroundColor: color }}
    >
      <span className="text-4xl" aria-hidden="true">
        {emoji}
      </span>
      <span className="font-display font-semibold text-h3 text-gray-800">
        {label}
      </span>
    </div>
  );
}
