import { LogoIcon } from "./icons/logo-icon";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <div className="animate-pulse">
        <LogoIcon className="h-24 w-24" />
      </div>
      <p className="text-xl text-primary font-semibold mt-4">लोड हो रहा है...</p>
    </div>
  );
}
