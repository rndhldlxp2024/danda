"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useParams, useRouter } from "next/navigation";
import { Users, Play, X, UserCheck } from "lucide-react";

export default function TeacherSessionPage() {
  const { quizId } = useParams();
  const [entryCode, setEntryCode] = useState<string>("");
  const [students, setStudents] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 1. 임시 세션 생성 (실제로는 백엔드 API 호출)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setEntryCode(code);

    // 2. 소켓 연결
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    newSocket.emit("join-quiz", code);

    newSocket.on("user-joined", (name: string) => {
      setStudents((prev) => [...new Set([...prev, name])]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [quizId]);

  const startQuiz = () => {
    if (students.length === 0) {
      alert("적어도 한 명 이상의 학생이 입장해야 합니다!");
      return;
    }
    // TODO: 퀴즈 시작 소켓 이벤트 전송
    alert("퀴즈를 시작합니다!");
  };

  return (
    <div className="min-h-screen bg-[#46178f] text-white flex flex-col font-sans overflow-hidden">
      {/* Top Bar */}
      <div className="p-6 flex justify-between items-center bg-black/10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <h2 className="text-[#46178f] font-black italic text-xl">D</h2>
          </div>
          <h1 className="text-xl font-black tracking-tight uppercase">DANDA QUIZ LIVE</h1>
        </div>
        <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X />
        </button>
      </div>

      {/* Main Waiting Room Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-10 space-y-12 relative">
        {/* Entry Code Display */}
        <div className="text-center space-y-4 animate-in fade-in zoom-in duration-700">
          <p className="text-indigo-200 font-bold uppercase tracking-[0.2em] text-sm">입장 코드</p>
          <h2 className="text-9xl font-black tracking-tighter shadow-indigo-900 drop-shadow-2xl">
            {entryCode || "------"}
          </h2>
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-500/30 rounded-full text-indigo-100 font-medium">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
            학생들의 입장을 기다리고 있습니다...
          </div>
        </div>

        {/* Name Cloud Area */}
        <div className="w-full max-w-5xl h-[300px] relative overflow-hidden flex flex-wrap justify-center content-center gap-4">
          {students.length === 0 ? (
            <div className="text-white/20 text-2xl font-black italic select-none">WAITING FOR PLAYERS...</div>
          ) : (
            students.map((name, i) => (
              <div
                key={i}
                className="px-8 py-4 bg-white text-[#46178f] text-2xl font-black rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 hover:scale-110 transition-transform cursor-default"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {name}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Bottom Control Bar */}
      <footer className="p-8 bg-black/20 backdrop-blur-md border-t border-white/5 flex justify-between items-center px-12">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <Users className="text-indigo-300" size={28} />
            <span className="text-3xl font-black">{students.length}</span>
          </div>
        </div>

        <button
          onClick={startQuiz}
          className="flex items-center gap-3 px-10 py-5 bg-white text-[#46178f] font-black text-2xl rounded-2xl shadow-2xl hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all"
        >
          <Play fill="currentColor" size={24} />
          START
        </button>
      </footer>

      {/* Background Shapes */}
      <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
    </div>
  );
}
