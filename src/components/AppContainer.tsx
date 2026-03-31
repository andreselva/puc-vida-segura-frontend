import type { ReactNode } from "react";

interface AppContainerProps {
  children: ReactNode;
}

export const AppContainer: React.FC<AppContainerProps> = ({ children }) => (
  <div className="min-h-screen bg-[#BDECE2] flex items-center justify-center p-6 font-sans">
    <div className="bg-white rounded-[2rem] shadow-lg w-full max-w-4xl p-10 flex flex-col items-center">
      {children}
    </div>
  </div>
);