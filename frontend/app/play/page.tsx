"use client";

import { useState } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { Sparkles, Trophy, ArrowRight } from "lucide-react";

export default function StudentEntryPage() {
  const [entryCode, setEntryCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (entryCode.length !== 6 || !nickname) return;
    
    setLoading(true);
    
    try {
      const socket = io("http://localhost:4000");
      
      socket.emit("join-quiz", entryCode);
      socket.emit("user-joined", nickname);
      
      setIsJoined(true);
    } catch (err) {
      alert("입장에 실패했습니다. 코드를 다시 확인해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (isJoined) {
    return (
      <div className="min-h-screen bg-[#46178f] flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in fade-in duration-1000">
        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center animate-bounce">
          <Trophy className="text-yellow-400" size={48} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white">당신은 들어왔습니다!</h1>
          <p className="text-indigo-200 text-lg">화면에서 자신의 닉네임({nickname})을 찾아보세요.</p>
        </div>
        <div className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-indigo-100 italic">
          교사가 퀴즈를 시작할 때까지 잠시만 기다려 주세요...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_#46178f_0%,_#f8fafc_40%)]">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-2 text-white">
          <h1 className="text-5xl font-black tracking-tighter">DANDA</h1>
          <p className="font-bold text-indigo-200 uppercase tracking-widest text-sm">Real-time Quiz</p>
        </div>

        <form onSubmit={handleJoin} className="bg-white rounded-[2.5rem] shadow-2xl p-10 space-y-6 border border-slate-100">
          <div className="space-y-4">
            <div className="relative group">
              <input
                type="text"
                value={entryCode}
                onChange={(e) => setEntryCode(e.target.value)}
                maxLength={6}
                placeholder="입장 코드 6자리"
                className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-3xl font-black tracking-[0.3em] text-slate-800 focus:border-indigo-500 focus:bg-white transition-all outline-none placeholder:tracking-normal placeholder:text-lg placeholder:text-slate-300"
                required
              />
            </div>

            <div className="relative group">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
                className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-xl font-bold text-slate-800 focus:border-purple-500 focus:bg-white transition-all outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-[#46178f] text-white font-black text-xl rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            퀴즈 입장하기
            <ArrowRight size={24} />
          </button>
        </form>

        <p className="text-slate-400 text-sm font-medium">
          준비가 되었다면 코드를 입력하고<br />친구들과 함께 시작해 보세요!
          <Sparkles className="inline-block ml-1 text-yellow-400" size={16} />
        </p>
      </div>
    </div>
  );
}
