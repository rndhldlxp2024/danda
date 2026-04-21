import { Routes, Route } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import WordSetPage from './pages/WordSetPage'
import WordPasteImporter from './components/WordPasteImporter'

// Pages
const Dashboard = () => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <h2 className="text-3xl font-extrabold mb-2 text-slate-800 tracking-tight">대시보드</h2>
    <p className="text-slate-500 mb-8">환영합니다! 오늘의 단어 학습 현황을 확인하세요.</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">학습 중인 학급</h4>
        <p className="text-4xl font-black text-indigo-600">12</p>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">등록된 단어 수</h4>
        <p className="text-4xl font-black text-indigo-600">1,248</p>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">평균 암기율</h4>
        <p className="text-4xl font-black text-emerald-500">84%</p>
      </div>
    </div>
  </div>
)

const Classes = () => (
  <div className="animate-in fade-in duration-500">
    <h2 className="text-3xl font-extrabold mb-2 text-slate-800 tracking-tight">학급 관리</h2>
    <p className="text-slate-500 mb-8">담당 학급과 학생 목록을 관리합니다.</p>
    <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 text-center">
      <p className="text-slate-400 font-medium">학급 목록이 여기에 표시됩니다.</p>
    </div>
  </div>
)

const Reports = () => (
  <div className="animate-in fade-in duration-500">
    <h2 className="text-3xl font-extrabold mb-2 text-slate-800 tracking-tight">학습 리포트</h2>
    <p className="text-slate-500 mb-8">학생들의 암기 진행 상황과 오답 통계를 확인합니다.</p>
    <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 text-center">
      <p className="text-slate-400 font-medium">상세 통계 보고서가 여기에 표시됩니다.</p>
    </div>
  </div>
)

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/wordsets" element={<WordSetPage />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </MainLayout>
  )
}

export default App
