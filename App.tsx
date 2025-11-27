import React, { useState, useEffect } from 'react';
import { SCENARIOS } from './scenarios/data';
import { CodeBlock } from './components/CodeBlock';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import {
  ShieldAlert,
  Bug,
  Database,
  Code,
  Zap,
  Terminal,
  BookOpen,
  AlertTriangle
} from './components/Icons';

export default function App() {
  const [activeId, setActiveId] = useState(SCENARIOS[0].id);
  const activeScenario = SCENARIOS.find(s => s.id === activeId) || SCENARIOS[0];
  const ActiveComponent = activeScenario.component;

  // Reset scroll position on page load/refresh
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-green-500/30 pb-20">

      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-green-500/10 p-2 rounded-lg border border-green-500/20">
            <ShieldAlert className="w-5 h-5 text-green-500" />
          </div>
          <div className="hidden md:block">
            <h1 className="font-bold text-white tracking-tight font-mono text-lg leading-none">Blockchain <span className="text-green-500">Workshop</span></h1>
            {/* <span className="text-[10px] text-gray-500 font-mono tracking-widest">INTERACTIVE LAB</span> */}
          </div>
          <div className="md:hidden">
            <h1 className="font-bold text-white tracking-tight font-mono text-base">Blockchain <span className="text-green-500">Lab</span></h1>
          </div>
        </div>

        <div className="flex gap-1 md:gap-2 bg-[#111] p-1 rounded-lg border border-white/10 overflow-x-auto max-w-[calc(100vw-120px)] md:max-w-none no-scrollbar touch-pan-x">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => {
                setActiveId(scenario.id);
                // Always scroll to top when switching tabs
                window.scrollTo(0, 0);
              }}
              className={`
                px-2 py-1.5 md:px-4 md:py-2 rounded text-[9px] md:text-xs font-bold font-mono transition-all whitespace-nowrap flex-shrink-0
                ${activeId === scenario.id
                  ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'}
              `}
            >
              <span className="hidden sm:inline">{scenario.shortTitle}</span>
              <span className="sm:hidden">{scenario.shortTitle.replace('Access Control', 'Access').replace('Logic Errors', 'Logic').replace('Reentrancy', 'Reentry')}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Container - Single Page Scroll */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 pt-8 md:pt-12 space-y-12 md:space-y-16 animate-in fade-in duration-500">

        {/* Header Section */}
        <header className="space-y-4 text-center md:text-left border-b border-gray-800 pb-6 md:pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 text-blue-400 border border-blue-500/20 text-xs font-mono font-bold uppercase tracking-widest mb-2">
            <BookOpen className="w-3 h-3" />
            Module: {activeScenario.id.toUpperCase()}
          </div>
          <h2 className="text-2xl md:text-5xl font-bold text-white tracking-tight leading-tight">{activeScenario.title}</h2>
        </header>

        {/* 1. Theory Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
           <div className="md:col-span-4">
              <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm font-mono border border-gray-700">01</span>
                Онол & Асуудал
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Энэ хэсэгт тухайн эмзэг байдлын үндсэн ойлголт, яагаад үүсдэг, мөн ямар аюултай болохыг тайлбарласан болно.
              </p>
           </div>
           <div className="md:col-span-8 bg-[#0a0a0a] border border-gray-800 rounded-2xl p-5 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-green-500/5 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="relative z-10">
                <MarkdownRenderer content={activeScenario.description} />
              </div>
           </div>
        </section>

        {/* Attack Types Section */}
        {activeScenario.attackTypes && activeScenario.attackTypes.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
           <div className="md:col-span-4">
              <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm font-mono border border-gray-700">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                </span>
                Халдлагын Төрлүүд
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Энэ ангилалд багтах халдлагын төрлүүд болон тэдгээрийн аюулын түвшин.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded border border-red-800">Critical</span>
                <span className="px-2 py-1 bg-orange-900/30 text-orange-400 rounded border border-orange-800">High</span>
                <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded border border-yellow-800">Medium</span>
              </div>
           </div>
           <div className="md:col-span-8 space-y-3">
              {activeScenario.attackTypes.map((attack, index) => (
                <div
                  key={attack.id}
                  className={`bg-[#0a0a0a] border rounded-xl p-4 transition-all hover:border-gray-700 ${
                    attack.severity === 'critical' ? 'border-red-900/50 hover:border-red-700/50' :
                    attack.severity === 'high' ? 'border-orange-900/50 hover:border-orange-700/50' :
                    'border-yellow-900/50 hover:border-yellow-700/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        attack.severity === 'critical' ? 'bg-red-900/50 text-red-400' :
                        attack.severity === 'high' ? 'bg-orange-900/50 text-orange-400' :
                        'bg-yellow-900/50 text-yellow-400'
                      }`}>
                        {attack.id.toUpperCase()}
                      </span>
                      <h4 className="font-bold text-white text-sm">{attack.name}</h4>
                    </div>
                    <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                      attack.severity === 'critical' ? 'text-red-400' :
                      attack.severity === 'high' ? 'text-orange-400' :
                      'text-yellow-400'
                    }`}>
                      {attack.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2 font-mono">{attack.nameEn}</p>
                  <p className="text-sm text-gray-400 leading-relaxed mb-3">{attack.description}</p>
                  {attack.example && (
                    <div className="bg-black/50 rounded-lg p-3 border border-gray-800">
                      <code className="text-xs text-green-400 font-mono break-all">{attack.example}</code>
                    </div>
                  )}
                </div>
              ))}
           </div>
        </section>
        )}

        {/* 2. Code Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
           <div className="md:col-span-4">
              <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm font-mono border border-gray-700">02</span>
                Алдаатай Код
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Хөгжүүлэгчид ихэвчлэн гаргадаг алдааг Solidity кодын жишээн дээр харав.
              </p>
              <div className="bg-red-900/10 border border-red-500/20 rounded-lg p-4">
                 <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase mb-2">
                    <Bug className="w-4 h-4" />
                    Warning
                 </div>
                 <p className="text-red-200/70 text-xs">
                    Энэ код нь бодит төсөл дээр ашиглахад аюултай. Зөвхөн сургалтын зорилгоор ашиглана уу.
                 </p>
              </div>
           </div>
           <div className="md:col-span-8 -mx-4 md:mx-0">
              <CodeBlock code={activeScenario.vulnerableCode} />
           </div>
        </section>

        {/* 3. Real Case Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
          <div className="md:col-span-4">
            <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm font-mono border border-gray-700">03</span>
                Бодит Түүх
            </h3>
          </div>
          <div className="md:col-span-8">
            <div className="bg-gradient-to-br from-[#111] to-[#050505] border border-gray-800 rounded-2xl p-6 md:p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Database className="w-24 h-24 md:w-32 md:h-32 text-blue-500" />
              </div>

              <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 relative z-10 gap-4">
                <div>
                  <div className="text-blue-400 text-xs font-mono font-bold uppercase tracking-widest mb-1">Historical Context</div>
                  <h4 className="text-xl md:text-2xl font-bold text-white">{activeScenario.realCase.name}</h4>
                </div>
                <div className="self-start px-3 py-1 bg-gray-800 rounded text-gray-400 font-mono text-sm border border-gray-700">
                  {activeScenario.realCase.year}
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-6 relative z-10 leading-relaxed max-w-2xl">
                {activeScenario.realCase.description}
              </p>

              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 font-mono font-bold relative z-10 text-sm">
                <AlertTriangle className="w-4 h-4" />
                LOSS: {activeScenario.realCase.loss}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Interactive Lab Section */}
        <section className="pt-8 border-t border-gray-800">
           <div className="flex items-center justify-between mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-600 flex items-center justify-center text-white text-sm md:text-base font-mono border border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                  <Zap className="w-4 h-4 md:w-5 md:h-5" />
                </span>
                Simulation Lab
              </h3>
              <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 font-mono uppercase">
                 <Terminal className="w-4 h-4" />
                 Interactive Environment
              </div>
           </div>

           {/* The Simulation Component - Full Width */}
           <div className="bg-[#010101] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl h-auto md:h-[700px] relative ring-1 ring-white/5">
              <ActiveComponent />
           </div>
        </section>

      </main>
    </div>
  );
}