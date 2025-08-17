interface StreakBadgeProps {
  streak: number;
  xp: number;
  className?: string;
}

export default function StreakBadge({ streak, xp, className = "" }: StreakBadgeProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Streak Badge */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center gap-3 bg-gradient-to-r from-orange-400 to-red-500 px-4 py-3 rounded-2xl shadow-lg border border-orange-300/30 backdrop-blur-xl">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xl animate-pulse">🔥</span>
          </div>
          <div className="text-white">
            <div className="text-xs font-medium opacity-90 uppercase tracking-wide">Streak</div>
            <div className="text-sm font-bold">{streak} днів</div>
          </div>
        </div>
      </div>

      {/* XP Badge */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center gap-3 bg-gradient-to-r from-emerald-400 to-cyan-500 px-4 py-3 rounded-2xl shadow-lg border border-emerald-300/30 backdrop-blur-xl">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xl animate-bounce-gentle">⭐</span>
          </div>
          <div className="text-white">
            <div className="text-xs font-medium opacity-90 uppercase tracking-wide">Experience</div>
            <div className="text-sm font-bold">{xp} XP</div>
          </div>
        </div>
      </div>

      {/* Level Indicator */}
      <div className="hidden md:block">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg border border-purple-300/30">
            <div className="text-center text-white">
              <div className="text-xs font-medium opacity-90">Level</div>
              <div className="text-lg font-bold">{Math.floor(xp / 100) + 1}</div>
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-xs font-bold text-yellow-900">↑</span>
          </div>
        </div>
      </div>
    </div>
  );
}
