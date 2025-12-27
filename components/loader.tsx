export default function AdminLoader() {
  return (
    <div className="fixed top-16 left-0 right-0 bottom-0 bg-slate-900 flex items-center justify-center z-50">
      <div className="relative w-24 h-24">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-700 border-t-blue-400 animate-spin"></div>

        {/* Middle rotating ring with delay */}
        <div
          className="absolute inset-2 rounded-full border-4 border-slate-700 border-b-cyan-400 animate-spin"
          style={{ animationDirection: "reverse", animationDelay: "0.3s" }}
        ></div>

        {/* Center logo/icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Settings/Gear icon */}
            <svg
              className="w-10 h-10 text-blue-400 animate-spin"
              style={{ animationDuration: "3s" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>

            {/* Pulsing accent */}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Loading text */}
      <div className="text-center mt-8">
        <p className="text-slate-400 text-sm font-medium">Loading ...</p>
      </div>
    </div>
  );
}
