"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"TEACHER" | "STUDENT">("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authClient.signUp.email({
        email,
        password,
        name,
        // Role은 Better-Auth의 metadata나 별도 DB 필드로 저장되도록 설정 가능
        // 여기서는 가입 시 기본 데이터를 전송합니다.
      });
      router.push("/login?message=signup-success");
    } catch (err: any) {
      setError(err.message || "가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            DANDA
          </h1>
          <p className="text-slate-500 font-medium">새로운 퀴즈 여정에 함께 하세요!</p>
        </div>

        {/* Role Selector */}
        <div className="flex p-1 bg-slate-100 rounded-2xl relative">
          <button
            onClick={() => setRole("STUDENT")}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all z-10 ${
              role === "STUDENT" ? "text-indigo-600" : "text-slate-500"
            }`}
          >
            학생으로 시작
          </button>
          <button
            onClick={() => setRole("TEACHER")}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all z-10 ${
              role === "TEACHER" ? "text-purple-600" : "text-slate-500"
            }`}
          >
            교사로 시작
          </button>
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 ${
              role === "TEACHER" ? "translate-x-[calc(100%)]" : "translate-x-0"
            }`}
          ></div>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">이름 / 닉네임</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">이메일 주소</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="최소 8자 이상"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] ${
              role === "TEACHER" 
                ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 shadow-purple-200" 
                : "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-200"
            } disabled:opacity-50`}
          >
            {loading ? "준비 중..." : "DANDA 가입하기"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 pt-2">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline">
            로그인하기
          </Link>
        </p>
      </div>
    </div>
  );
}
