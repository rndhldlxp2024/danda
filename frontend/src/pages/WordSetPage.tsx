import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, X, Info, Trash2, CheckCircle2, Save } from 'lucide-react';
import WordPasteImporter from '../components/WordPasteImporter';
import axios from 'axios';

// Prisma Enum과 매칭되는 품사 타입
type PartOfSpeech = 'NOUN' | 'VERB' | 'ADJECTIVE' | 'ADVERB' | 'PRONOUN' | 'PREPOSITION' | 'CONJUNCTION' | 'INTERJECTION';

interface WordEntry {
  english: string;
  korean: string;
  partOfSpeech: PartOfSpeech;
  example: string;
}

const POS_MAP: Record<string, PartOfSpeech> = {
  'n': 'NOUN',
  'noun': 'NOUN',
  'v': 'VERB',
  'verb': 'VERB',
  'a': 'ADJECTIVE',
  'adj': 'ADJECTIVE',
  'adjective': 'ADJECTIVE',
  'ad': 'ADVERB',
  'adv': 'ADVERB',
  'adverb': 'ADVERB',
  'pro': 'PRONOUN',
  'pron': 'PRONOUN',
  'prep': 'PREPOSITION',
  'conj': 'CONJUNCTION',
  'int': 'INTERJECTION',
};

const POS_LABELS: Record<PartOfSpeech, string> = {
  NOUN: '명사',
  VERB: '동사',
  ADJECTIVE: '형용사',
  ADVERB: '부사',
  PRONOUN: '대명사',
  PREPOSITION: '전치사',
  CONJUNCTION: '접속사',
  INTERJECTION: '감탄사',
};

const WordSetPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [isImportMode, setIsImportMode] = useState(false);
  const [wordSets, setWordSets] = useState([]);
  
  // Modal Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [inputText, setInputText] = useState('');
  const [parsedWords, setParsedWords] = useState<WordEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Parse Text Real-time
  useEffect(() => {
    if (!inputText.trim()) {
      setParsedWords([]);
      return;
    }

    const lines = inputText.split('\n');
    const words = lines
      .map(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return null;

        let parts: string[] = [];

        // Priority 1: Tab or 2+ Spaces
        if (trimmedLine.includes('\t') || / {2,}/.test(trimmedLine)) {
          parts = trimmedLine.split(/\t| {2,}/);
        } 
        // Priority 2: Hyphen with spaces " - "
        else if (trimmedLine.includes(' - ')) {
          parts = trimmedLine.split(' - ');
        }
        // Priority 3: Single comma
        else if (trimmedLine.includes(',')) {
          const commaParts = trimmedLine.split(',');
          if (commaParts.length > 2) {
            // Check if second part is a POS abbreviation
            const secondPart = commaParts[1].trim().toLowerCase();
            if (POS_MAP[secondPart]) {
               parts = [commaParts[0], commaParts[1], commaParts.slice(2).join(', ')];
            } else {
               parts = [commaParts[0], commaParts.slice(1).join(', ')];
            }
          } else {
            parts = commaParts;
          }
        } else {
          parts = [trimmedLine];
        }

        if (parts.length >= 2) {
          const rawParts = parts.map(p => p.trim());
          let english = rawParts[0];
          let pos: PartOfSpeech = 'NOUN';
          let korean = '';
          let example = '';

          // 3개 이상의 필드가 있을 때 두 번째 필드가 품사인지 확인
          const secondPartLower = rawParts[1].toLowerCase();
          if (POS_MAP[secondPartLower]) {
            pos = POS_MAP[secondPartLower];
            korean = rawParts[2] || '';
            example = rawParts[3] || '';
          } else {
            korean = rawParts[1];
            example = rawParts[2] || '';
            
            // 뜻 시작 부분에 (n), (v) 등이 있는지 확인 (옵션)
            const posMatch = korean.match(/^\((n|v|a|adj|adv|pro|prep|conj|int)\)\s*(.*)/i);
            if (posMatch) {
              pos = POS_MAP[posMatch[1].toLowerCase()] || 'NOUN';
              korean = posMatch[2];
            }
          }

          return { english, korean, partOfSpeech: pos, example };
        }
        return null;
      })
      .filter((w): w is WordEntry => w !== null);

    setParsedWords(words);
  }, [inputText]);

  const updateWord = (index: number, updates: Partial<WordEntry>) => {
    setParsedWords(prev => prev.map((w, i) => i === index ? { ...w, ...updates } : w));
  };

  const removeWord = (index: number) => {
    setParsedWords(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!title.trim() || parsedWords.length === 0) {
      alert('단어장 제목과 최소 하나 이상의 단어가 필요합니다.');
      return;
    }

    setIsSaving(true);
    try {
      await axios.post('http://localhost:4000/api/wordsets', {
        title,
        description,
        words: parsedWords
      });
      
      alert('단어장이 성공적으로 저장되었습니다!');
      setShowModal(false);
      setTitle('');
      setDescription('');
      setInputText('');
      setParsedWords([]);
    } catch (err) {
      console.error(err);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">단어장 관리</h2>
          <p className="text-slate-500 mt-1">학생들에게 배포할 단어 세트를 만들고 관리하세요.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <Plus size={20} />
          새 단어장 만들기
        </button>
      </div>

      {wordSets.length === 0 && !isImportMode ? (
        <div className="flex flex-col items-center justify-center py-20 lg:py-32 px-4 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-8 border border-slate-100 shadow-inner">
            <BookOpen size={48} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">등록된 단어장이 없습니다</h3>
          <p className="text-slate-500 max-w-sm mb-10 leading-relaxed">
            수업에서 사용할 단어장을 먼저 선물하듯 만들어보세요. <br />
            기존에 관리하던 엑셀 시트가 있다면 대량 등록으로 바로 가져올 수 있습니다.
          </p>
          <button 
            onClick={() => setIsImportMode(true)}
            className="px-8 py-3 bg-slate-50 text-indigo-600 font-bold rounded-full hover:bg-indigo-50 transition-all border border-slate-200"
          >
            이미 단어 목록이 있나요? 대량 등록하기
          </button>
        </div>
      ) : isImportMode ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <Plus className="text-indigo-500" size={18} />
              대량 등록 모드
            </h4>
            <button 
              onClick={() => setIsImportMode(false)}
              className="text-sm text-slate-400 hover:text-slate-600 font-bold underline"
            >
              취소하고 목록으로 돌아가기
            </button>
          </div>
          <WordPasteImporter />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* List would go here */}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">단어장 새로 만들기</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium italic">Create a new collection with parts of speech support</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">단어장 타이틀</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="중학교 1학년 필수 단어장"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">단어장 설명</label>
                  <input 
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="설명을 입력해주세요."
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">데이터 붙여넣기 (영어 [탭] 품사 [탭] 뜻)</label>
                  <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-bold italic">POS Detection Active</span>
                </div>
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={"apple  n  사과\nrun  v  달리다\nbeautiful  adj  아름다운"}
                  className="w-full h-40 px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all resize-none font-mono text-sm leading-relaxed"
                />
              </div>

              {parsedWords.length > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 px-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    추출 완료: {parsedWords.length}개
                  </h4>
                  <div className="border border-slate-100 rounded-[2rem] overflow-hidden bg-slate-50/50">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead className="bg-white border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4 text-xs font-bold text-slate-400">영어</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-400">품사</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-400">뜻</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-400">예문</th>
                          <th className="px-6 py-4 w-16"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedWords.map((word, idx) => (
                          <tr key={idx} className="group hover:bg-white transition-colors">
                            <td className="px-6 py-3 font-bold text-slate-800">{word.english}</td>
                            <td className="px-6 py-3">
                              <select 
                                value={word.partOfSpeech}
                                onChange={(e) => updateWord(idx, { partOfSpeech: e.target.value as PartOfSpeech })}
                                className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-lg border-none focus:ring-2 focus:ring-indigo-200 outline-none cursor-pointer"
                              >
                                {Object.entries(POS_LABELS).map(([value, label]) => (
                                  <option key={value} value={value}>{label}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-6 py-3 text-slate-600 font-medium">
                              <input 
                                type="text"
                                value={word.korean}
                                onChange={(e) => updateWord(idx, { korean: e.target.value })}
                                className="bg-transparent border-none focus:ring-0 w-full p-0 text-sm"
                              />
                            </td>
                            <td className="px-6 py-3 text-slate-400 text-xs italic">
                               <input 
                                type="text"
                                value={word.example}
                                onChange={(e) => updateWord(idx, { example: e.target.value })}
                                className="bg-transparent border-none focus:ring-0 w-full p-0 text-xs"
                                placeholder="예문 입력"
                              />
                            </td>
                            <td className="px-6 py-3 text-right">
                              <button 
                                onClick={() => removeWord(idx)}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between gap-4 shrink-0">
               <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
                <Info size={16} />
                <span>품사가 없는 경우 기본값(명사)으로 설정됩니다.</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all active:scale-95 text-sm"
                >
                  취소
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving || parsedWords.length === 0}
                  className="flex items-center gap-2 px-10 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 disabled:bg-slate-300 disabled:shadow-none text-sm"
                >
                  <Save size={18} />
                  {isSaving ? '저장 중...' : '단어장 및 단어 전체 저장'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordSetPage;
