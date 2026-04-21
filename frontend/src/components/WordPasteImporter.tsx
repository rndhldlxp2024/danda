import React, { useState } from 'react';
import axios from 'axios';
import { Upload, ClipboardList, CheckCircle2, AlertCircle, Trash2, Save } from 'lucide-react';

// Prisma Enum 타입 정의
type PartOfSpeech = 'NOUN' | 'VERB' | 'ADJECTIVE' | 'ADVERB' | 'PRONOUN' | 'PREPOSITION' | 'CONJUNCTION' | 'INTERJECTION';

interface ParsedWord {
  english: string;
  korean: string;
  partOfSpeech: PartOfSpeech;
  example: string;
}

const POS_MAP: Record<string, PartOfSpeech> = {
  'n': 'NOUN', '명사': 'NOUN', 'noun': 'NOUN',
  'v': 'VERB', '동사': 'VERB', 'verb': 'VERB',
  'a': 'ADJECTIVE', 'adj': 'ADJECTIVE', '형용사': 'ADJECTIVE',
  'ad': 'ADVERB', 'adv': 'ADVERB', '부사': 'ADVERB',
  'pro': 'PRONOUN', '대명사': 'PRONOUN',
  'prep': 'PREPOSITION', '전치사': 'PREPOSITION',
  'conj': 'CONJUNCTION', '접속사': 'CONJUNCTION',
  'int': 'INTERJECTION', '감탄사': 'INTERJECTION',
};

const POS_LABELS: Record<PartOfSpeech, string> = {
  NOUN: '명사', VERB: '동사', ADJECTIVE: '형용사', ADVERB: '부사',
  PRONOUN: '대명사', PREPOSITION: '전치사', CONJUNCTION: '접속사', INTERJECTION: '감탄사'
};

const WordPasteImporter: React.FC = () => {
  const [title, setTitle] = useState('');
  const [inputText, setInputText] = useState('');
  const [parsedWords, setParsedWords] = useState<ParsedWord[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  const mapPOS = (input: string): PartOfSpeech => {
    const key = input.toLowerCase().trim();
    return POS_MAP[key] || 'NOUN';
  };

  const handleParse = () => {
    const lines = inputText.split('\n');
    const words: ParsedWord[] = lines
      .map(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return null;

        let parts: string[] = [];
        if (trimmedLine.includes('\t')) {
          parts = trimmedLine.split('\t');
        } else if (/ {2,}/.test(trimmedLine)) {
          parts = trimmedLine.split(/ {2,}/);
        } else {
          parts = trimmedLine.split(/,|-/).map(p => p.trim());
        }

        if (parts.length >= 2) {
          const cleanParts = parts.map(p => p.trim().replace(/^["']|["']$/g, '').trim());
          
          let english = cleanParts[0];
          let pos: PartOfSpeech = 'NOUN';
          let korean = '';
          let example = '';

          if (cleanParts.length >= 4) {
            pos = mapPOS(cleanParts[1]);
            korean = cleanParts[2];
            example = cleanParts.slice(3).join(', ');
          } 
          else if (cleanParts.length === 3) {
            if (POS_MAP[cleanParts[1].toLowerCase()]) {
              pos = mapPOS(cleanParts[1]);
              korean = cleanParts[2];
            } else {
              korean = cleanParts[1];
              example = cleanParts[2];
            }
          } 
          else {
            korean = cleanParts[1];
          }

          return { english, korean, partOfSpeech: pos, example };
        }
        return null;
      })
      .filter((w): w is ParsedWord => w !== null);

    setParsedWords(words);
  };

  const updateWord = (index: number, updates: Partial<ParsedWord>) => {
    setParsedWords(prev => prev.map((w, i) => i === index ? { ...w, ...updates } : w));
  };

  const removeWord = (index: number) => {
    setParsedWords(prev => prev.filter((_, i) => i !== index));
  };

  const handleImport = async () => {
    if (!title.trim()) {
      alert('단어장 제목을 입력해주세요.');
      return;
    }
    if (parsedWords.length === 0) return;

    setIsImporting(true);
    try {
      await axios.post('http://localhost:4000/api/wordsets', {
        title,
        description: '대량 등록으로 생성된 단어장',
        words: parsedWords
      });
      
      alert(`성공! ${parsedWords.length}개의 단어가 저장되었습니다.`);
      setParsedWords([]);
      setInputText('');
      setTitle('');
    } catch (err) {
      console.error(err);
      alert('저장 중 오류가 발생했습니다. 백엔드 서버를 확인해주세요.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center gap-5 text-slate-800 bg-white">
          <div className="w-14 h-14 bg-indigo-50 rounded-[1.25rem] flex items-center justify-center text-indigo-600 shadow-inner">
            <Upload size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight">단어 대량 등록</h3>
            <p className="text-sm text-slate-400 font-medium">단어 데이터를 붙여넣어 한 번에 저장하세요.</p>
          </div>
        </div>

        <div className="p-8 space-y-8 bg-slate-50/30">
          <div className="space-y-3">
             <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">단어장 제목</label>
             <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 중학 필수 영단어 100"
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800"
             />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">텍스트 데이터</label>
              <div className="flex gap-2">
                 <span className="text-[10px] bg-white border border-slate-200 text-slate-400 px-2 py-1 rounded-md font-bold uppercase tracking-tighter">Support Tab/Excel</span>
              </div>
            </div>
            <textarea
              className="w-full h-48 lg:h-64 p-6 bg-white border border-slate-200 rounded-[1.5rem] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-mono text-sm leading-relaxed text-slate-700 shadow-inner"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={"apple\tn\t사과\nrun\tv\t달리다"}
            />
          </div>
          
          <div className="flex justify-end pt-2">
            <button 
              onClick={handleParse} 
              disabled={!inputText.trim()}
              className="flex items-center gap-3 px-10 py-4 bg-slate-900 hover:bg-black disabled:bg-slate-200 text-white font-bold rounded-2xl transition-all shadow-xl active:scale-95"
            >
              <ClipboardList size={22} />
              데이터 분석하기
            </button>
          </div>
        </div>
      </div>

      {parsedWords.length > 0 && (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-indigo-100 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className="p-8 bg-indigo-600 text-white flex justify-between items-center relative overflow-hidden">
             <div className="flex items-center gap-5 relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold tracking-tight">추출 완료: {parsedWords.length}개</h4>
                <p className="text-sm text-indigo-100 opacity-80">저장 전 품사와 뜻을 최종 확인하세요.</p>
              </div>
            </div>
            {/* Subtle BG Pattern */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">영어</th>
                  <th className="p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">품사</th>
                  <th className="p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">뜻</th>
                  <th className="p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">예문</th>
                  <th className="p-6 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {parsedWords.map((w, i) => (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="p-6 font-black text-lg text-slate-800">{w.english}</td>
                    <td className="p-6">
                      <select 
                        value={w.partOfSpeech}
                        onChange={(e) => updateWord(i, { partOfSpeech: e.target.value as PartOfSpeech })}
                        className="bg-indigo-50/50 text-indigo-700 text-[11px] font-black px-3 py-2 rounded-xl border border-indigo-100 focus:ring-4 focus:ring-indigo-100 outline-none cursor-pointer appearance-none transition-all shadow-sm"
                      >
                        {Object.entries(POS_LABELS).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-6 min-w-[200px]">
                      <input 
                        type="text" 
                        value={w.korean}
                        onChange={(e) => updateWord(i, { korean: e.target.value })}
                        className="bg-transparent border-none focus:ring-0 w-full p-2 rounded-lg hover:bg-slate-100 transition-colors font-semibold text-slate-700"
                      />
                    </td>
                    <td className="p-6 min-w-[300px]">
                      <input 
                        type="text" 
                        value={w.example}
                        onChange={(e) => updateWord(i, { example: e.target.value })}
                        className="bg-transparent border-none focus:ring-0 w-full p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 text-xs italic"
                        placeholder="예문 (선택)"
                      />
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => removeWord(i)} 
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button 
              className="flex items-center gap-3 px-14 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[1.5rem] transition-all shadow-2xl shadow-indigo-500/40 active:scale-95 disabled:bg-slate-300 disabled:shadow-none" 
              onClick={handleImport}
              disabled={isImporting}
            >
              <Save size={20} />
              {isImporting ? '단어장 저장 중...' : '전체 저장하고 등록하기'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordPasteImporter;
