import type { InputHTMLAttributes } from "react";

interface PillInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
}

export const PillInput: React.FC<PillInputProps> = ({ placeholder, type = "text", ...rest }) => (
  <input
    type={type}
    placeholder={placeholder}
    className="w-full bg-[#F5EFEF] border border-[#E5D5D5] text-[#555] rounded-full py-2 px-6 text-center focus:outline-none focus:ring-2 focus:ring-[#02C39A] placeholder:text-[#888] mb-4"
    {...rest}
  />
);