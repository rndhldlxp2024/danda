"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, CheckCircle2, Save } from "lucide-react";

interface Question {
  content: string;
  options: string[];
  answer: number;
}

export default function NewQuizPage() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { content: "", options: ["", "", "", ""], answer: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const addQuestion = () => {
    setQuestions([...questions, { content: "", options: ["", "", "", ""], answer: 0 }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleSave = async () => {
    if (!title) return alert("퀴즈 제목을 입력해 주세요.");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subject,
          teacherId: "sample-teacher-id", // TODO: 실제 로그인 유저 ID로 교체
          questions,
        }),
      });

      if (response.ok) {
        alert("퀴즈가 성공적으로 생성되었습니다!");
        router.push("/teacher/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("퀴즈 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-600 transition-colors">
            취소
          </button>
          <div className="h-6 w-px bg-slate-200"></div>
          <h1 className="text-xl font-bold text-slate-800">새 퀴즈 만들기</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
        >
          <Save size={18} />
          {loading ? "저장 중..." : "퀴즈 저장"}
        </button>
      </header>

      <main className="max-w-4xl mx-auto mt-8 px-6 space-y-8">
        {/* Quiz Info Section */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-500 ml-1">퀴즈 제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 제 1회 수학 쪽지시험"
                className="w-full text-2xl font-bold bg-transparent border-b-2 border-slate-100 focus:border-indigo-500 outline-none transition-all py-2"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-500 ml-1">과목 / 태그</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="예: 공통수학"
                className="w-full text-lg bg-transparent border-b-2 border-slate-100 focus:border-purple-500 outline-none transition-all py-3"
              />
            </div>
          </div>
        </section>

        {/* Questions Section */}
        <div className="space-y-6">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6 animate-in fade-in slide-in-from-top-4">
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-black rounded-full uppercase tracking-wider">
                  질문 {qIndex + 1}
                </span>
                <button
                  onClick={() => removeQuestion(qIndex)}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <textarea
                value={q.content}
                onChange={(e) => updateQuestion(qIndex, "content", e.target.value)}
                placeholder="어떤 문제를 출제하고 싶으신가요?"
                className="w-full text-xl font-medium bg-slate-50 p-6 rounded-2xl border border-transparent focus:border-indigo-100 focus:bg-white outline-none transition-all min-h-[120px]"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((option, oIndex) => (
                  <div key={oIndex} className="relative group">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      placeholder={`보기 ${oIndex + 1}`}
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all outline-none ${
                        q.answer === oIndex 
                          ? "border-emerald-500 bg-emerald-50/30" 
                          : "border-slate-100 bg-slate-50 group-hover:border-slate-200"
                      }`}
                    />
                    <button
                      onClick={() => updateQuestion(qIndex, "answer", oIndex)}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                        q.answer === oIndex ? "text-emerald-500" : "text-slate-300 hover:text-slate-400"
                      }`}
                    >
                      <CheckCircle2 size={24} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={addQuestion}
            className="w-full py-6 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold flex items-center justify-center gap-2 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all"
          >
            <Plus size={24} />
            새 질문 추가하기
          </button>
        </div>
      </main>
    </div>
  );
}
