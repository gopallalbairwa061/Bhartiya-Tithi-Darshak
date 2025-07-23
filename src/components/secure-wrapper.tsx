
"use client";

import { useEffect, ReactNode } from 'react';
import { cn } from "@/lib/utils";

interface SecureWrapperProps {
  children: ReactNode;
  className?: string;
  isSecured: boolean;
}

export function SecureWrapper({ children, className, isSecured }: SecureWrapperProps) {
  useEffect(() => {
    if (!isSecured) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable Ctrl+C, Ctrl+V, Ctrl+U, Ctrl+P, F12
      if (e.ctrlKey && ['c', 'v', 'u', 'p'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i')) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSecured]);

  return (
    <div className={cn(className, isSecured && "select-none")}>
      {children}
    </div>
  );
}
