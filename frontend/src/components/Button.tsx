import { type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:opacity-90 active:opacity-80 shadow-md",
  secondary:
    "bg-secondary text-gray-800 hover:opacity-90 active:opacity-80",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`
        font-body font-semibold text-body px-6 py-3 rounded-[0.75rem]
        transition-all duration-200 ease-in-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${className}
      `.trim()}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
