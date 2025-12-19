import React, { useState, useMemo } from 'react';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import Mascot from './components/Mascot';
import { judgeMyTime } from './services/geminiService';
import { ChronosResponse, UserInput, MascotMood } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ChronosResponse | null>(null);
  
  // Time Thief State
  const [minutes, setMinutes] = useState<number>(30); // Default 30 mins

  // Derived logic for Mascot Reaction (Local Logic)
  const mascotState = useMemo(() => {
    if (result) return { mood: result.mood, text: null }; // Let result card handle text

    // 0-2 Hours (0-120 mins)
    if (minutes <= 120) return { 
      mood: MascotMood.HAPPY, 
      text: "Doing Great!",
      color: "text-green-400"
    };
    
    // 2-5 Hours (120-300 mins)
    if (minutes <= 300) return { 
      mood: MascotMood.NEUTRAL, 
      text: "Stop scrolling...",
      color: "text-yellow-400"
    };
    
    // 5+ Hours (300+ mins)
    return { 
      mood: MascotMood.ANGRY, 
      text: "YOU ARE STEALING YOUR LIFE!",
      color: "text-red-500"
    };
  }, [minutes, result]);

  const handleJudge = async (input: UserInput) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await judgeMyTime(input);
      setResult(response);
    } catch (err: any) {
      setError("Chronos is refusing to speak (API Error). Check your connection or API Key.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setMinutes(30);
  };

  return (
    // Used fixed positioning for background to prevent scroll bounce issues on mobile
    <div className="fixed inset-0 w-full h-[100dvh] bg-slate-900 selection:bg-sky-500/30 overflow-hidden">
      
      {/* Background Ambience (Fixed) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-600/10 rounded-full blur-[80px]"></div>
      </div>

      {/* Scrollable Content Container */}
      <div className="absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden z-10">
        <div className="min-h-full flex flex-col items-center justify-center p-4 py-8 md:py-12">
          
          <div className="w-full max-w-4xl flex flex-col items-center gap-6 md:gap-8">
            
            {/* Header Section */}
            <div className="text-center space-y-2 mt-4 md:mt-0">
              <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-indigo-300 to-purple-300 tracking-tight">
                TIME THIEF
              </h1>
              <p className="text-slate-400 text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
                Simulate • Judge • Recover
              </p>
            </div>

            {/* Mascot & Live Feedback */}
            <div className="relative flex flex-col items-center my-4">
              
              {/* Speech Bubble - Only show when no result is displayed */}
              {!result && !loading && (
                 <div className={`absolute -top-14 md:-top-16 bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl rounded-bl-none shadow-xl transform -translate-x-12 animate-float ${mascotState.color} z-20`}>
                    <p className="font-bold text-sm whitespace-nowrap">"{mascotState.text}"</p>
                 </div>
              )}

              <div className="w-40 h-40 md:w-48 md:h-48 transition-all duration-500">
                <Mascot mood={mascotState.mood} />
              </div>
            </div>

            {/* Content Switcher */}
            {error && (
                <div className="w-full max-w-md p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-center text-sm">
                    {error}
                </div>
            )}

            {!result ? (
              <div className={`w-full flex justify-center transition-opacity duration-500 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <InputForm 
                  onSubmit={handleJudge} 
                  isLoading={loading}
                  timeSpent={minutes}
                  onTimeChange={setMinutes}
                />
              </div>
            ) : (
              <ResultCard data={result} onReset={handleReset} />
            )}

            {/* Footer Spacer for Mobile Scrolling */}
            <div className="h-12 md:h-0"></div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 w-full text-center text-slate-600 text-[10px] md:text-xs font-mono pointer-events-none">
            Powered by Gemini 3 Flash
        </div>
      </div>
    </div>
  );
};

export default App;