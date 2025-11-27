import React, { useState, useEffect, useRef } from 'react';
import {
  Play, RotateCcw, Unlock, Zap, Database, Code, CheckCircle, XCircle,
  AlertTriangle, ShieldAlert, Wallet, TrendingUp, Activity, Server, Lock, ArrowRight,
  ChevronRight, FileCode, Cpu
} from '../components/Icons';

// --- Types ---
interface LogEntry {
  id: string;
  step: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
}

type TxStage = 'idle' | 'signing' | 'broadcasting' | 'mining' | 'executing' | 'completed';

// --- SHARED COMPONENTS ---

// 1. Transaction Flow Visualizer (The Network Layer)
const TransactionFlow = ({ stage, type = 'attack' }: { stage: TxStage, type?: 'attack' | 'normal' }) => {
  return (
    <div className="w-full bg-[#0a0c10] border-b border-gray-800 p-4 mb-4">
      <div className="flex items-center justify-between max-w-3xl mx-auto relative">

        {/* Connecting Line Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 z-0"></div>

        {/* Active Line Progress */}
        <div
          className={`absolute top-1/2 left-0 h-1 -translate-y-1/2 z-0 transition-all duration-1000 ease-in-out
            ${stage === 'idle' ? 'w-0' :
              stage === 'signing' ? 'w-[10%]' :
              stage === 'broadcasting' ? 'w-[40%]' :
              stage === 'mining' ? 'w-[60%]' :
              'w-full bg-gradient-to-r from-blue-500 to-purple-500'}
            ${type === 'attack' ? 'bg-red-500' : 'bg-blue-500'}
          `}
        ></div>

        {/* Node 1: Attacker Wallet */}
        <div className={`relative z-10 flex flex-col items-center gap-2 transition-all duration-300 ${stage !== 'idle' ? 'scale-110' : 'opacity-70'}`}>
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center bg-[#050505]
            ${stage !== 'idle' ? (type === 'attack' ? 'border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'border-blue-500 text-blue-500') : 'border-gray-700 text-gray-600'}
          `}>
            <Wallet className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="text-[10px] font-mono text-gray-400 uppercase bg-black/80 px-1">Хэтэвч</span>
        </div>

        {/* Moving Packet Animation */}
        {(stage === 'broadcasting' || stage === 'mining') && (
          <div className="absolute top-1/2 left-[50%] -translate-x-1/2 -translate-y-1/2 z-20">
             <div className={`w-3 h-3 rounded-full animate-ping ${type === 'attack' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
          </div>
        )}

        {/* Node 2: Blockchain Node */}
        <div className={`relative z-10 flex flex-col items-center gap-2 transition-all duration-300 ${['mining', 'executing', 'completed'].includes(stage) ? 'scale-110' : 'opacity-70'}`}>
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center bg-[#050505]
             ${stage === 'mining' ? 'border-yellow-500 text-yellow-500 animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.5)]' :
               ['executing', 'completed'].includes(stage) ? 'border-green-500 text-green-500' : 'border-gray-700 text-gray-600'}
          `}>
            <Server className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="text-[10px] font-mono text-gray-400 uppercase bg-black/80 px-1">Node (Mempool)</span>
        </div>

        {/* Node 3: Smart Contract */}
        <div className={`relative z-10 flex flex-col items-center gap-2 transition-all duration-300 ${['executing', 'completed'].includes(stage) ? 'scale-110' : 'opacity-70'}`}>
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center bg-[#050505]
             ${stage === 'executing' ? 'border-purple-500 text-purple-500 animate-bounce shadow-[0_0_15px_rgba(168,85,247,0.5)]' :
               stage === 'completed' ? 'border-green-500 text-green-500' : 'border-gray-700 text-gray-600'}
          `}>
            <FileCode className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="text-[10px] font-mono text-gray-400 uppercase bg-black/80 px-1">Гэрээ</span>
        </div>

      </div>

      {/* Status Text */}
      <div className="text-center mt-4 h-4">
        <span className="text-xs font-mono font-bold text-green-400 animate-pulse">
           {stage === 'signing' && "Гүйлгээнд гарын үсэг зурж байна..."}
           {stage === 'broadcasting' && "Сүлжээ рүү илгээж байна..."}
           {stage === 'mining' && "Node дээр баталгаажиж байна (Mining)..."}
           {stage === 'executing' && "Smart Contract ажиллаж байна..."}
           {stage === 'completed' && "Гүйлгээ амжилттай блокчэйнд бичигдлээ."}
        </span>
      </div>
    </div>
  );
};

// --- SPECIFIC VISUALIZERS ---

// 1. Vault Visualizer (Access Control) - Realistic DeFi Vault
const VaultVisualizer = ({ isLocked, owner, balance, attackerBalance }: { isLocked: boolean, owner: string, balance: number, attackerBalance: number }) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center h-full gap-6 py-4 md:py-0">
      
      {/* Vault Card */}
      <div className={`relative w-full max-w-sm bg-gradient-to-br from-[#1a1f2e] to-[#0d1117] border rounded-2xl p-6 transition-all duration-500 ${isLocked ? 'border-green-500/30' : 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]'}`}>
        
        {/* Vault Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLocked ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              {isLocked ? <Lock className="w-5 h-5 text-green-400" /> : <Unlock className="w-5 h-5 text-red-400 animate-pulse" />}
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">VulnerableVault</h4>
              <span className="text-gray-500 text-[10px] font-mono">0x7a250d...E559</span>
            </div>
          </div>
          {!isLocked && (
            <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded animate-pulse">
              EXPLOITED
            </div>
          )}
        </div>

        {/* Balance Display */}
        <div className="bg-black/40 rounded-xl p-4 mb-4 border border-gray-800">
          <div className="text-gray-500 text-[10px] font-mono uppercase mb-1">Total Value Locked</div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl md:text-3xl font-bold font-mono transition-all duration-500 ${balance === 0 ? 'text-red-500' : 'text-white'}`}>
              {balance.toFixed(2)}
            </span>
            <span className="text-gray-400 text-sm">ETH</span>
          </div>
          <div className="text-gray-600 text-[10px] font-mono mt-1">≈ ${(balance * 3500).toLocaleString()}</div>
        </div>

        {/* Owner Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Owner:</span>
            <span className={`font-mono font-bold ${isLocked ? 'text-green-400' : 'text-red-400'}`}>{owner}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Status:</span>
            <span className={`font-bold ${isLocked ? 'text-green-400' : 'text-red-400'}`}>
              {isLocked ? '🔒 Secure' : '🔓 Compromised'}
            </span>
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className={`hidden lg:flex flex-col items-center gap-2 transition-all duration-500 ${!isLocked ? 'opacity-100' : 'opacity-30'}`}>
        <ArrowRight className={`w-8 h-8 ${!isLocked ? 'text-red-500 animate-pulse' : 'text-gray-700'}`} />
        {!isLocked && <span className="text-red-400 text-[10px] font-mono">DRAINED</span>}
      </div>

      {/* Attacker Wallet */}
      <div className={`w-full max-w-sm bg-gradient-to-br from-[#1f1a1a] to-[#0d1117] border rounded-2xl p-6 transition-all duration-500 ${!isLocked ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 'border-gray-800 opacity-50'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">Attacker Wallet</h4>
            <span className="text-gray-500 text-[10px] font-mono">0xBAD...1337</span>
          </div>
        </div>

        <div className="bg-black/40 rounded-xl p-4 border border-gray-800">
          <div className="text-gray-500 text-[10px] font-mono uppercase mb-1">Stolen Funds</div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl md:text-3xl font-bold font-mono ${attackerBalance > 0 ? 'text-red-400' : 'text-gray-600'}`}>
              {attackerBalance.toFixed(2)}
            </span>
            <span className="text-gray-400 text-sm">ETH</span>
          </div>
          <div className="text-gray-600 text-[10px] font-mono mt-1">≈ ${(attackerBalance * 3500).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

// 2. DeFi Staking Visualizer (Logic Error) - Realistic Staking Protocol
const StakingVisualizer = ({ userStake, totalPool, rewardRate, earnedReward, method, isCalculating }: any) => {
  const expectedReward = method === 'good' ? (userStake * rewardRate / totalPool) : 0;
  
  return (
    <div className="flex flex-col lg:flex-row items-stretch justify-center h-full gap-6 py-4 md:py-0">
      
      {/* User Position Card */}
      <div className="flex-1 max-w-sm bg-gradient-to-br from-[#1a1f2e] to-[#0d1117] border border-blue-500/20 rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">Your Position</h4>
            <span className="text-gray-500 text-[10px] font-mono">Staking Pool V1</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-black/40 rounded-xl p-4 border border-gray-800">
            <div className="text-gray-500 text-[10px] font-mono uppercase mb-1">Your Stake</div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-blue-400">{userStake}</span>
              <span className="text-gray-500 text-sm">TOKENS</span>
            </div>
          </div>

          <div className="bg-black/40 rounded-xl p-4 border border-gray-800">
            <div className="text-gray-500 text-[10px] font-mono uppercase mb-1">Total Pool</div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono text-gray-400">{totalPool.toLocaleString()}</span>
              <span className="text-gray-600 text-sm">TOKENS</span>
            </div>
          </div>

          <div className="text-center text-gray-600 text-[10px] font-mono">
            Your Share: {((userStake / totalPool) * 100).toFixed(4)}%
          </div>
        </div>
      </div>

      {/* Calculation Flow */}
      <div className="flex-1 max-w-md flex flex-col justify-center">
        <div className={`bg-gradient-to-br from-[#1a1a1f] to-[#0d1117] border rounded-2xl p-5 ${method === 'bad' ? 'border-red-500/30' : 'border-green-500/30'}`}>
          
          <div className="flex items-center justify-between mb-4">
            <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded ${method === 'bad' ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'}`}>
              {method === 'bad' ? '❌ VULNERABLE CODE' : '✓ SECURE CODE'}
            </span>
            {isCalculating && <span className="w-2 h-2 rounded-full bg-yellow-500 animate-ping"></span>}
          </div>

          {/* Formula Display */}
          <div className="bg-black/60 rounded-xl p-4 font-mono text-sm border border-gray-800 mb-4">
            {method === 'bad' ? (
              <div className="space-y-2">
                <div className="text-gray-500">// Vulnerable: division first</div>
                <div>
                  <span className="text-purple-400">reward</span>
                  <span className="text-white"> = </span>
                  <span className="text-red-400">(</span>
                  <span className="text-blue-400">{userStake}</span>
                  <span className="text-white"> / </span>
                  <span className="text-gray-400">{totalPool}</span>
                  <span className="text-red-400">)</span>
                  <span className="text-white"> * </span>
                  <span className="text-yellow-400">{rewardRate}</span>
                </div>
                <div className="text-red-400 text-xs mt-2">
                  → {userStake} / {totalPool} = <span className="font-bold">0</span> (integer)
                </div>
                <div className="text-red-400 text-xs">
                  → 0 * {rewardRate} = <span className="font-bold text-lg">0</span> 💀
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-gray-500">// Secure: multiply first</div>
                <div>
                  <span className="text-purple-400">reward</span>
                  <span className="text-white"> = </span>
                  <span className="text-blue-400">{userStake}</span>
                  <span className="text-white"> * </span>
                  <span className="text-yellow-400">{rewardRate}</span>
                  <span className="text-white"> / </span>
                  <span className="text-gray-400">{totalPool}</span>
                </div>
                <div className="text-green-400 text-xs mt-2">
                  → {userStake} * {rewardRate} = {userStake * rewardRate}
                </div>
                <div className="text-green-400 text-xs">
                  → {userStake * rewardRate} / {totalPool} = <span className="font-bold text-lg">{expectedReward.toFixed(1)}</span> ✓
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Result Card */}
      <div className={`flex-1 max-w-sm bg-gradient-to-br rounded-2xl p-5 relative overflow-hidden transition-all duration-500 ${
        earnedReward === 0 && method === 'bad' 
          ? 'from-[#2a1a1a] to-[#1a0d0d] border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.1)]' 
          : 'from-[#1a2a1a] to-[#0d1a0d] border border-green-500/30'
      }`}>
        
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${earnedReward === 0 && method === 'bad' ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
            <TrendingUp className={`w-5 h-5 ${earnedReward === 0 && method === 'bad' ? 'text-red-400' : 'text-green-400'}`} />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">Claimed Reward</h4>
            <span className="text-gray-500 text-[10px] font-mono">From calculateReward()</span>
          </div>
        </div>

        <div className={`bg-black/40 rounded-xl p-6 border text-center ${earnedReward === 0 && method === 'bad' ? 'border-red-500/30' : 'border-green-500/30'}`}>
          <div className="text-gray-500 text-[10px] font-mono uppercase mb-2">You Received</div>
          <div className="flex items-baseline justify-center gap-2">
            <span className={`text-4xl font-bold font-mono ${earnedReward === 0 && method === 'bad' ? 'text-red-500' : 'text-green-400'}`}>
              {earnedReward}
            </span>
            <span className="text-gray-500">TOKENS</span>
          </div>
          {earnedReward === 0 && method === 'bad' && (
            <div className="mt-3 text-red-400 text-xs font-mono animate-pulse">
              ⚠️ Lost {expectedReward.toFixed(1)} tokens due to rounding!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 3. Reentrancy Bank Visualizer - Realistic Bank Contract Attack
const BankVisualizer = ({ stack, vaultBalance, attackerBalance, userBalance }: { 
  stack: string[], 
  vaultBalance: number, 
  attackerBalance: number,
  userBalance: number 
}) => {
  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 w-full py-2 md:py-0">
      
      {/* Left: Vault + Attacker */}
      <div className="w-full lg:w-2/5 flex flex-col gap-4">
        
        {/* Vulnerable Bank */}
        <div className={`flex-1 bg-gradient-to-br from-[#1a1f2e] to-[#0d1117] border rounded-xl p-4 relative overflow-hidden transition-all duration-500 ${vaultBalance === 0 ? 'border-red-500/50' : 'border-blue-500/30'}`}>
          <div className={`absolute bottom-0 left-0 w-full bg-blue-500/10 transition-all duration-500`} style={{ height: `${(vaultBalance / 100) * 100}%` }}></div>
          
          <div className="relative z-10 flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${vaultBalance === 0 ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
              <Database className={`w-5 h-5 ${vaultBalance === 0 ? 'text-red-400' : 'text-blue-400'}`} />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">VulnerableBank</h4>
              <span className="text-gray-500 text-[10px] font-mono">0x1234...BANK</span>
            </div>
            {vaultBalance === 0 && (
              <span className="ml-auto bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded animate-pulse">DRAINED</span>
            )}
          </div>

          <div className="relative z-10 bg-black/40 rounded-lg p-3 border border-gray-800">
            <div className="text-gray-500 text-[10px] font-mono uppercase mb-1">Contract Balance</div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold font-mono transition-all duration-300 ${vaultBalance === 0 ? 'text-red-500' : 'text-white'}`}>
                {vaultBalance.toFixed(1)}
              </span>
              <span className="text-gray-500 text-sm">ETH</span>
            </div>
            <div className="mt-2 text-gray-600 text-[10px] font-mono">
              User balances[attacker]: {userBalance} ETH
            </div>
          </div>
        </div>

        {/* Attacker Contract */}
        <div className={`flex-1 bg-gradient-to-br from-[#2a1a1a] to-[#1a0d0d] border rounded-xl p-4 transition-all duration-500 ${attackerBalance > 0 ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'border-gray-800'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">AttackerContract</h4>
              <span className="text-gray-500 text-[10px] font-mono">0xBAD...1337</span>
            </div>
          </div>

          <div className="bg-black/40 rounded-lg p-3 border border-gray-800">
            <div className="text-gray-500 text-[10px] font-mono uppercase mb-1">Stolen Funds</div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold font-mono ${attackerBalance > 0 ? 'text-red-400' : 'text-gray-600'}`}>
                {attackerBalance.toFixed(1)}
              </span>
              <span className="text-gray-500 text-sm">ETH</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Call Stack */}
      <div className="w-full lg:w-3/5 bg-[#0d1117] border border-gray-800 rounded-xl p-4 flex flex-col relative overflow-hidden h-[220px] lg:h-auto">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
        
        <h3 className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-500" /> Recursive Call Stack (EVM)
        </h3>

        <div className="flex-1 flex flex-col-reverse gap-1.5 overflow-y-auto custom-scrollbar pr-2">
          {stack.map((call, i) => (
            <div key={i} className="animate-in slide-in-from-bottom-2 fade-in duration-200">
              <div className={`
                p-2 rounded border font-mono text-[10px] flex items-center gap-2 shadow-md
                ${call.includes('fallback') || call.includes('Attacker')
                  ? 'bg-red-950/50 border-red-500/40 text-red-300 ml-3'
                  : call.includes('SEND') 
                    ? 'bg-yellow-950/50 border-yellow-500/40 text-yellow-300'
                    : 'bg-blue-950/40 border-blue-500/40 text-blue-300'}
              `}>
                <span className="text-gray-600 w-4">{i + 1}.</span>
                <span className="font-bold truncate flex-1">{call}</span>
                {i === stack.length - 1 && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping shrink-0"></span>}
              </div>
            </div>
          ))}
          {stack.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-gray-700 italic text-xs">
              Call stack empty. Ready for exploit...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// --- DASHBOARD COMPONENTS (UI) ---

const LogConsole = ({ logs }: { logs: LogEntry[] }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll only within the log container, not the whole page
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="h-full flex flex-col bg-[#0f1218] rounded-xl border border-gray-800 overflow-hidden shadow-lg relative">
      <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center bg-[#0a0c10]">
        <div className="flex items-center gap-2">
          <Code className="w-3 h-3 text-green-500" />
          <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">Transaction Logs</span>
        </div>
      </div>
      <div ref={scrollContainerRef} className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar font-mono text-xs bg-[#050608]">
        {logs.length === 0 && (
          <div className="text-center mt-10 text-gray-700">Туршилтыг эхлүүлнэ үү...</div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 border-b border-gray-800/30 pb-2 last:border-0 animate-in fade-in slide-in-from-left-2">
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold h-fit mt-0.5 ${
               log.type === 'info' ? 'bg-blue-900/20 text-blue-400' :
               log.type === 'success' ? 'bg-green-900/20 text-green-400' :
               log.type === 'warning' ? 'bg-yellow-900/20 text-yellow-400' :
               'bg-red-900/20 text-red-400'
            }`}>
               {log.step}
            </div>
            <span className="text-gray-300 leading-relaxed">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CyberDashboard = ({
  logs,
  customVisual,
  controls,
  instruction,
  txStage,
  txType = 'attack'
}: any) => {
  return (
    <div className="h-full w-full bg-[#050505] p-4 md:p-6 flex flex-col md:flex-row gap-6">

      {/* Main Visualization Stage */}
      <div className="flex-1 flex flex-col gap-4 h-full min-h-[400px] md:min-h-[300px]">

        {/* Network Layer Visualizer */}
        <TransactionFlow stage={txStage} type={txType} />

        {/* Specific Visualizer Box */}
        <div className="flex-1 bg-[#0a0c10] rounded-xl border border-gray-800 relative overflow-hidden shadow-inner group p-4 md:p-6">
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
           <div className="relative z-10 h-full">
              {customVisual}
           </div>
        </div>

        {/* Controls Bar */}
        <div className="h-auto bg-[#0f1218] rounded-xl border border-gray-800 p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shrink-0">
           <div className="flex items-center gap-3 text-sm text-gray-400 font-mono w-full md:w-auto">
             <div className="w-8 h-8 rounded-full bg-blue-900/20 flex items-center justify-center text-blue-400 shrink-0">
               <Zap className="w-4 h-4" />
             </div>
             <span className="text-xs md:text-sm">{instruction}</span>
           </div>
           <div className="flex gap-3 w-full md:w-auto justify-end">
             {controls}
           </div>
        </div>
      </div>

      {/* Right Sidebar: Logs */}
      <div className="w-full md:w-[350px] h-[250px] md:h-auto shrink-0">
        <LogConsole logs={logs} />
      </div>

    </div>
  );
};


// --- SC01: Access Control ---
export const SC01_AccessControl: React.FC = () => {
  const [owner, setOwner] = useState("0xAdmin...8F3a");
  const [isHacked, setIsHacked] = useState(false);
  const [vaultBalance, setVaultBalance] = useState(150.00);
  const [attackerBalance, setAttackerBalance] = useState(0);
  const [txStage, setTxStage] = useState<TxStage>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '0', step: 'DEPLOY', message: 'VulnerableVault deployed. TVL: 150 ETH ($525,000)', type: 'success' }
  ]);

  const attack = () => {
    if(isHacked) return;

    // Step 1: Signing
    setTxStage('signing');
    setLogs(prev => [...prev, { id: '1', step: 'TX_CREATE', message: 'Attacker calls initVault() - no access check found!', type: 'warning' }]);

    setTimeout(() => {
      // Step 2: Broadcasting
      setTxStage('broadcasting');
      setLogs(prev => [...prev, { id: '2', step: 'MEMPOOL', message: 'Transaction pending: 0x7f3a...initVault()', type: 'info' }]);

      setTimeout(() => {
         // Step 3: Mining
         setTxStage('mining');
         setLogs(prev => [...prev, { id: '3', step: 'BLOCK #19847523', message: 'Transaction included in block...', type: 'info' }]);

         setTimeout(() => {
            // Step 4: Executing - Owner change
            setTxStage('executing');
            setOwner("0xBAD...1337");
            setLogs(prev => [...prev, { id: '4', step: 'STORAGE', message: 'owner = msg.sender → 0xBAD...1337', type: 'danger' }]);

            setTimeout(() => {
               // Step 5: Drain funds
               setLogs(prev => [...prev, { id: '5', step: 'EXPLOIT', message: 'Attacker calls withdrawAll() as new owner...', type: 'danger' }]);
               
               setTimeout(() => {
                  setVaultBalance(0);
                  setAttackerBalance(150.00);
                  setIsHacked(true);
                  setTxStage('completed');
                  setLogs(prev => [...prev, { id: '6', step: 'DRAINED', message: '💀 150 ETH ($525,000) stolen in 2 transactions', type: 'danger' }]);
               }, 800);
            }, 1000);
         }, 1500);
      }, 1000);
    }, 800);
  };

  const reset = () => {
    setOwner("0xAdmin...8F3a");
    setIsHacked(false);
    setVaultBalance(150.00);
    setAttackerBalance(0);
    setTxStage('idle');
    setLogs([{ id: '0', step: 'RESET', message: 'Simulation reset. Vault restored.', type: 'info' }]);
  };

  return (
    <CyberDashboard
      logs={logs}
      txStage={txStage}
      instruction="initVault() функц хамгаалалтгүй - дарж үзээрэй."
      customVisual={<VaultVisualizer isLocked={!isHacked} owner={owner} balance={vaultBalance} attackerBalance={attackerBalance} />}
      controls={
        <>
          <button onClick={reset} className="p-3 rounded-lg border border-gray-700 hover:bg-gray-800 text-gray-400">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={attack}
            disabled={isHacked || txStage !== 'idle'}
            className={`
              flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold font-mono text-xs md:text-sm transition-all shadow-lg
              ${isHacked ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20'}
            `}
          >
            {isHacked ? '💀 DRAINED' : '🔓 EXPLOIT'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </>
      }
    />
  );
};

// --- SC03: Logic Error ---
export const SC03_LogicError: React.FC = () => {
  const [userStake] = useState(500);
  const [totalPool] = useState(100000);
  const [rewardRate] = useState(5000);
  const [method, setMethod] = useState<'bad' | 'good'>('bad');
  const [earnedReward, setEarnedReward] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [txStage, setTxStage] = useState<TxStage>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '0', step: 'STAKE', message: `You staked 500 TOKENS in the pool (Total: 100,000)`, type: 'success' }
  ]);

  const calculate = () => {
    setLogs(prev => [...prev]);
    setIsCalculating(true);
    setTxStage('signing');
    setLogs(prev => [...prev, { id: '1', step: 'TX_CREATE', message: 'Calling claimReward()...', type: 'info' }]);

    setTimeout(() => {
       setTxStage('broadcasting');
       setLogs(prev => [...prev, { id: '2', step: 'MEMPOOL', message: 'Transaction broadcasted to network...', type: 'info' }]);

       setTimeout(() => {
          setTxStage('mining');

          setTimeout(() => {
             setTxStage('executing');
             setLogs(prev => [...prev, { id: '3', step: 'EXECUTE', message: 'Calculating reward on-chain...', type: 'warning' }]);

             setTimeout(() => {
                if (method === 'bad') {
                   const badResult = Math.floor(userStake / totalPool) * rewardRate;
                   setLogs(prev => [...prev, { 
                     id: '4', 
                     step: 'INTEGER DIV', 
                     message: `${userStake} / ${totalPool} = 0 (Solidity truncates decimals!)`, 
                     type: 'danger' 
                   }]);

                   setTimeout(() => {
                      setEarnedReward(badResult);
                      setIsCalculating(false);
                      setTxStage('completed');
                      setLogs(prev => [...prev, { 
                        id: '5', 
                        step: 'LOSS', 
                        message: `⚠️ You received 0 instead of ${(userStake * rewardRate / totalPool).toFixed(1)} tokens!`, 
                        type: 'danger' 
                      }]);
                   }, 800);
                } else {
                   const goodResult = Math.floor((userStake * rewardRate) / totalPool);
                   setLogs(prev => [...prev, { 
                     id: '4', 
                     step: 'MULTIPLY', 
                     message: `${userStake} * ${rewardRate} = ${userStake * rewardRate}`, 
                     type: 'success' 
                   }]);

                   setTimeout(() => {
                      setEarnedReward(goodResult);
                      setIsCalculating(false);
                      setTxStage('completed');
                      setLogs(prev => [...prev, { 
                        id: '5', 
                        step: 'SUCCESS', 
                        message: `✓ Correctly received ${goodResult} tokens!`, 
                        type: 'success' 
                      }]);
                   }, 800);
                }
             }, 1000);

          }, 1200);
       }, 800);
    }, 500);
  };

  const reset = () => {
    setEarnedReward(0);
    setIsCalculating(false);
    setTxStage('idle');
    setLogs([{ id: '0', step: 'RESET', message: 'Simulation reset. Ready to claim.', type: 'info' }]);
  };

  return (
    <CyberDashboard
      logs={logs}
      txStage={txStage}
      txType={method === 'bad' ? 'attack' : 'normal'}
      instruction="Алдаатай болон зөв тооцооллыг харьцуул."
      customVisual={
         <StakingVisualizer 
           userStake={userStake} 
           totalPool={totalPool} 
           rewardRate={rewardRate} 
           earnedReward={earnedReward} 
           method={method}
           isCalculating={isCalculating}
         />
      }
      controls={
        <>
          <button onClick={reset} className="p-3 rounded-lg border border-gray-700 hover:bg-gray-800 text-gray-400">
            <RotateCcw className="w-5 h-5" />
          </button>
          <div className="flex bg-black rounded p-1 border border-gray-700">
             <button onClick={() => { setMethod('bad'); setEarnedReward(0); }} className={`px-2 md:px-3 py-1 rounded text-[10px] md:text-xs font-bold ${method === 'bad' ? 'bg-red-900/50 text-red-400' : 'text-gray-500 hover:text-white'}`}>VULNERABLE</button>
             <button onClick={() => { setMethod('good'); setEarnedReward(0); }} className={`px-2 md:px-3 py-1 rounded text-[10px] md:text-xs font-bold ${method === 'good' ? 'bg-green-900/50 text-green-400' : 'text-gray-500 hover:text-white'}`}>SECURE</button>
          </div>
          <button
            onClick={calculate}
            disabled={txStage !== 'idle' && txStage !== 'completed'}
            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 text-white px-4 md:px-6 py-3 rounded-lg font-bold font-mono text-xs md:text-sm shadow-lg shadow-blue-900/20"
          >
            CLAIM REWARD
          </button>
        </>
      }
    />
  );
};

// --- SC05: Reentrancy ---
export const SC05_Reentrancy: React.FC = () => {
  const [vaultBalance, setVaultBalance] = useState(100);
  const [attackerBalance, setAttackerBalance] = useState(0);
  const [userBalance, setUserBalance] = useState(10);
  const [stack, setStack] = useState<string[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '0', step: 'DEPOSIT', message: 'Attacker deposited 10 ETH into VulnerableBank', type: 'info' }
  ]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [txStage, setTxStage] = useState<TxStage>('idle');

  const attack = () => {
    setIsAttacking(true);
    setStack([]);

    setTxStage('signing');
    setLogs(prev => [...prev, { id: '1', step: 'TX_CREATE', message: 'Attacker calls attack() on malicious contract...', type: 'warning' }]);

    setTimeout(() => {
      setTxStage('broadcasting');
      setLogs(prev => [...prev, { id: '2', step: 'MEMPOOL', message: 'Transaction pending in mempool...', type: 'info' }]);
      
      setTimeout(() => {
        setTxStage('mining');
        setLogs(prev => [...prev, { id: '3', step: 'BLOCK', message: 'Transaction included in block #19847524', type: 'info' }]);
        
        setTimeout(() => {
          setTxStage('executing');
          setLogs(prev => [...prev, { id: '4', step: 'EXEC', message: 'AttackerContract.attack() executing...', type: 'warning' }]);
          startExploit();
        }, 1000);
      }, 1000);
    }, 800);
  };

  const startExploit = () => {
    let vault = 100;
    let attacker = 0;
    let depth = 0;
    const withdrawAmount = 10;
    const maxDepth = 10;

    const runStep = () => {
      if (vault <= 0 || depth >= maxDepth) {
        setIsAttacking(false);
        setTxStage('completed');
        setStack(s => [...s, "← Stack unwinds (Gas limit reached)"]);
        setLogs(prev => [...prev, { 
          id: 'end', 
          step: 'DRAINED', 
          message: `💀 Stole ${attacker} ETH from ${maxDepth * withdrawAmount} ETH vault!`, 
          type: 'danger' 
        }]);
        return;
      }

      // 1. Bank.withdraw() called
      setStack(s => [...s, `Bank.withdraw(${withdrawAmount}) [bal: ${vault}]`]);
      setLogs(prev => [...prev, { 
        id: `w${depth}`, 
        step: `CALL #${depth + 1}`, 
        message: `withdraw() → require(bal >= 10) ✓`, 
        type: 'warning' 
      }]);

      setTimeout(() => {
        // 2. ETH transfer triggers fallback
        setStack(s => [...s, `→ SEND ${withdrawAmount} ETH to attacker`]);
        
        setTimeout(() => {
          // 3. Fallback re-enters
          vault -= withdrawAmount;
          attacker += withdrawAmount;
          setVaultBalance(vault);
          setAttackerBalance(attacker);
          
          setStack(s => [...s, `← fallback() RE-ENTERS!`]);
          setLogs(prev => [...prev, { 
            id: `f${depth}`, 
            step: 'RE-ENTRY', 
            message: `fallback() calls withdraw() AGAIN (bal not updated!)`, 
            type: 'danger' 
          }]);
          
          depth++;
          setTimeout(runStep, 600);
        }, 400);
      }, 500);
    };

    runStep();
  };

  const reset = () => {
    setVaultBalance(100);
    setAttackerBalance(0);
    setUserBalance(10);
    setStack([]);
    setIsAttacking(false);
    setTxStage('idle');
    setLogs([{ id: '0', step: 'RESET', message: 'Simulation reset. Vault restored to 100 ETH.', type: 'info' }]);
  };

  return (
    <CyberDashboard
      logs={logs}
      txStage={txStage}
      instruction="withdraw() дуудахад balance шинэчлэгдэхээс өмнө ETH илгээж байна."
      customVisual={<BankVisualizer stack={stack} vaultBalance={vaultBalance} attackerBalance={attackerBalance} userBalance={userBalance} />}
      controls={
        <>
          <button onClick={reset} className="p-3 rounded-lg border border-gray-700 hover:bg-gray-800 text-gray-400">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={attack}
            disabled={isAttacking || vaultBalance <= 0 || txStage !== 'idle'}
            className={`
               flex-1 md:flex-none px-4 md:px-6 py-3 rounded-lg font-bold font-mono text-xs md:text-sm transition-all shadow-lg
               ${isAttacking ? 'bg-purple-800 text-white animate-pulse' : vaultBalance <= 0 ? 'bg-gray-800 text-gray-500' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/20'}
            `}
          >
            {isAttacking ? '🔄 DRAINING...' : vaultBalance <= 0 ? '💀 DRAINED' : '⚡ EXPLOIT'}
          </button>
        </>
      }
    />
  );
};