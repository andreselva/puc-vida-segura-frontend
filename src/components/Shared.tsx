import React from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface PillInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
}

interface AppContainerProps {
  children: ReactNode;
}

export const PillInput: React.FC<PillInputProps> = ({ 
  placeholder, 
  type = "text", 
  value, 
  onChange, 
  ...rest 
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-[#F5EFEF] border border-[#E5D5D5] text-[#555] rounded-full py-2 px-6 text-center focus:outline-none focus:ring-2 focus:ring-[#02C39A] placeholder:text-[#888] mb-4 transition-all"
      {...rest}
    />
  );
};

export const AppContainer: React.FC<AppContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#BDECE2] flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-[2rem] shadow-lg w-full max-w-4xl p-10 flex flex-col items-center relative">
        {children}
      </div>
    </div>
  );
};