            <p className={`${styles.textSub} text-sm font-light tracking-wide`}>
              獻給社工的深夜禮物
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6 mt-8 relative z-10">
            <div>
              <input
                type="text"
                placeholder="請輸入您的代號"
                className={`w-full bg-[#0B1120]/50 border border-[#334155] rounded-xl p-4 text-center ${styles.textMain} placeholder-slate-500 focus:outline-none focus:border-[#D97706] transition-colors`}
                value={tempNickname}
                onChange={(e) => setTempNickname(e.target.value)}
              />
            </div>
            <button type="submit" disabled={!tempNickname.trim()} className={`w-full py-3.5 font-bold text-sm tracking-widest uppercase rounded-xl transform transition-all hover:scale-[1.02] active:scale-100 ${styles.button}`}>
              開啟大門
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const WelcomeScreen = () => (
    <div className={`min-h-screen ${styles.bgGradient} flex flex-col items-center justify-center p-6 relative font-serif-tc`}>
      <SnowEffect />
      <div className="absolute top-6 right-6 flex gap-3 z-10">
        <button onClick={() => setScreen('history')} className={`p-2.5 bg-[#162032] text-[#94A3B8] rounded-full hover:text-white hover:bg-[#334155] transition-all border border-[#334155]`} title="個人紀錄"><History className="w-4 h-4" /></button>
        <button onClick={handleLogout} className={`px-4 py-2 bg-[#162032] text-[#94A3B8] rounded-full hover:text-white hover:bg-[#334155] transition-all border border-[#334155] flex items-center gap-2 text-xs font-bold tracking-wider`} title="回到首頁">
          <LogOut className="w-3 h-3" /> 登出
        </button>
      </div>

      <div className="max-w-md w-full text-center space-y-8 animate-fade-in relative z-0">
        <div className="w-24 h-24 mx-auto bg-[#162032] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-[#334155] relative group">
           <TreePine className="w-10 h-10 text-[#059669] group-hover:text-[#10B981] transition-colors" />
           <div className="absolute top-0 right-0 bg-[#991B1B] w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#0B1120] text-[10px]">🔔</div>
        </div>
        
        <div>
           <h1 className={`text-3xl font-bold ${styles.textMain} mb-4 tracking-wide text-shadow-md`}>晚安，{nickname}</h1>
           <div className="bg-[#162032]/80 backdrop-blur-sm p-4 rounded-xl border border-[#334155]/50 inline-block">
             <p className={`text-base ${styles.textSub} leading-relaxed font-light`}>
               外面的世界很喧囂，<br/>
               但這裡永遠為你留一盞燈。
             </p>
           </div>
        </div>
        
        <button onClick={() => setScreen('checkin')} className={`w-full max-w-xs mx-auto py-4 text-sm font-bold tracking-widest uppercase rounded-xl transform hover:scale-105 transition-all ${styles.button} flex items-center justify-center gap-3`}>
          <Gift className="w-5 h-5 animate-pulse" /> 拆開禮物
        </button>
      </div>
    </div>
  );

  const CheckinScreen = () => (
    <div className={`min-h-screen ${styles.bgGradient} flex flex-col items-center justify-center p-4 font-serif-tc`}>
      <SnowEffect />
      <div className="max-w-xl w-full relative z-10">
        <h2 className={`text-xl font-bold ${styles.textMain} mb-2 text-center text-shadow-sm`}>今晚的心情顏色？</h2>
        <p className={`${styles.textSub} mb-8 text-center text-sm font-light`}>誠實面對狀態，就是對自己最大的慈悲。</p>
        
        <div className="grid grid-cols-2 gap-3">
          {MOODS.map((mood, idx) => (
            <button key={idx} onClick={() => { setSelectedMood(mood); setScreen('deck'); }} className={`flex items-center p-4 bg-[#162032]/80 backdrop-blur-md rounded-xl border border-[#334155] hover:border-[#D97706] hover:bg-[#1E293B] transition-all group relative overflow-hidden`}>
              <div className="mr-3 p-1.5 bg-[#0B1120] rounded-full">{mood.icon}</div>
              <span className={`font-medium ${styles.textMain} text-sm relative z-10`}>{mood.label}</span>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-5 text-4xl group-hover:opacity-10 transition-opacity text-white">❄️</div>
            </button>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <button onClick={() => setScreen('welcome')} className={`${styles.textSub} hover:text-white text-xs tracking-wider`}>返回休息</button>
        </div>
      </div>
    </div>
  );

  const DeckScreen = () => (
    <div className={`min-h-screen ${styles.bgGradient} flex flex-col items-center justify-center p-6 overflow-hidden relative font-serif-tc`}>
      <SnowEffect />
      <div className="max-w-md w-full text-center space-y-8 z-10">
        <div className="animate-fade-in-up">
          <div className="inline-block px-3 py-1 rounded-full bg-[#334155]/80 backdrop-blur-sm border border-[#475569] text-[#94A3B8] text-[12px] tracking-widest uppercase mb-3">收到一則訊息</div>
          <h3 className={`text-xl ${styles.textMain} font-bold flex items-center justify-center gap-2 text-shadow-sm`}>
            {selectedMood?.icon} {selectedMood?.label}
          </h3>
        </div>
        
        <div className="relative h-96 flex items-center justify-center py-8 perspective-1000">
          <div onClick={drawCard} className={`relative w-64 h-80 cursor-pointer transform hover:-translate-y-2 transition-all duration-700 group`}>
            
            {/* 卡片背面 - 針葉樹設計 */}
            <div className={`absolute inset-0 bg-[#0F172A] rounded-lg shadow-[0_0_40px_rgba(217,119,6,0.15)] flex flex-col items-center justify-center border border-[#1E293B] overflow-hidden`}>
                
                <div className="absolute inset-2 border border-[#94A3B8]/20 rounded-md"></div>
                <div className="absolute inset-3 border border-[#94A3B8]/10 rounded-sm"></div>

                {/* 中央核心圖案：針葉樹 */}
                <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
                   <div className="relative">
                      {/* TreePine 並加上金色質感 */}
                      <TreePine className="w-24 h-24 text-[#D97706] fill-current opacity-90 animate-pulse filter drop-shadow-[0_0_10px_rgba(217,119,6,0.5)]" />
                   </div>
                   <div className="text-center">
                      <p className="text-[#94A3B8] text-[10px] tracking-[0.3em] uppercase mb-2">Social Worker's</p>
                      <p className="text-[#F1F5F9] text-lg font-serif tracking-[0.2em]">GUIDANCE</p>
                   </div>
                </div>
                
                <div className="absolute bottom-8 w-full text-center text-[#D97706] tracking-[0.2em] z-10 text-xs font-bold opacity-80 group-hover:opacity-100 transition-opacity">
                  TAP TO REVEAL
                </div>
                
                <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-[#D97706]/10 to-transparent"></div>
            </div>
          </div>
        </div>
        <p className={`${styles.textSub} text-xs tracking-widest animate-pulse opacity-60`}>正在為您調配心靈處方...</p>
      </div>
    </div>
  );

  const RevealScreen = () => {
    // 按鈕狀態獨立控制
    const [showButtons, setShowButtons] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => setShowButtons(true), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
    <div className={`min-h-screen ${styles.bg} flex flex-col items-center justify-center p-4 relative font-serif-tc`} key={currentCard?.title}>
      <SnowEffect />
      <div className="absolute top-4 right-4 z-20">
         <button onClick={handleLogout} className="bg-[#162032]/80 backdrop-blur-sm px-4 py-2 rounded-full text-xs text-[#94A3B8] hover:text-white border border-[#334155] shadow-lg flex items-center gap-1 transition-all">
           <Home className="w-3 h-3" /> 
         </button>
      </div>

      <div className="perspective-1000 w-full max-w-sm h-[550px] cursor-pointer z-10" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`relative w-full h-full duration-1000 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Back Side (針葉樹) */}
          <div className={`absolute w-full h-full backface-hidden rounded-[16px] shadow-2xl overflow-hidden bg-[#0F172A] flex items-center justify-center border border-[#1E293B]`}>
             <div className="absolute inset-0 flex items-center justify-center opacity-10">
               <TreePine className="w-64 h-64 text-white" />
             </div>
             <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
                <TreePine className="w-24 h-24 text-[#D97706] fill-current opacity-90 filter drop-shadow-[0_0_10px_rgba(217,119,6,0.5)]" />
             </div>
          </div>

          {/* Front Side (卡片內容) */}
          <div className={`absolute w-full h-full backface-hidden rotate-y-180 bg-[#162032] overflow-hidden flex flex-col rounded-[16px] shadow-[0_0_40px_rgba(217,119,6,0.1)] border border-[#D97706]/30 relative`}>
             
             <div className="absolute inset-2 border border-[#D97706]/20 rounded-[12px] pointer-events-none"></div>

             <div className="relative z-10 flex flex-col h-full justify-between p-4">
                
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-6">
                  <div className="text-[#D97706] text-xl font-bold tracking-[0.1em] uppercase opacity-100 flex items-center gap-2 mb-2 drop-shadow-sm">
                    <Star className="w-5 h-5 fill-current" /> {currentCard.category} <Star className="w-5 h-5 fill-current" />
                  </div>
                  
                  <h2 className={`text-4xl font-bold text-[#F8FAFC] leading-tight drop-shadow-md my-2`}>{currentCard.title}</h2>
                  
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#D97706] to-transparent opacity-50"></div>
                  
                  <p className={`text-[#CBD5E1] leading-loose text-lg font-medium px-2`}>
                    {currentCard.message}
                  </p>
                </div>
                
                <div className={`p-5 mx-2 mb-4 rounded-xl bg-[#0B1120]/60 border border-[#334155] relative backdrop-blur-sm`}>
                  <div className="flex items-start space-x-3 mt-1">
                    <div className="flex-1 text-left ml-2">
                      <p className={`text-xs text-[#D97706] font-bold uppercase mb-2 flex items-center gap-1 tracking-wider`}>
                        <Sparkles className="w-3 h-3" /> 微行動
                      </p>
                      <p className={`text-[#94A3B8] text-sm font-medium`}>{currentCard.action}</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <div className={`mt-6 space-y-3 w-full max-w-sm transition-opacity duration-1000 z-10 ${showButtons ? 'opacity-100' : 'opacity-0'}`}>
        <button onClick={drawCard} className={`w-full py-3.5 rounded-xl bg-[#162032] text-[#94A3B8] font-bold border border-[#334155] hover:border-[#D97706] hover:text-[#D97706] transition-all flex items-center justify-center gap-2 shadow-lg text-sm tracking-wider`}>
          <RefreshCw className="w-4 h-4" />
          <span>再抽一張</span>
        </button>
        <button onClick={() => setScreen('welcome')} className={`w-full py-3.5 rounded-xl ${styles.button} font-bold transition-all flex items-center justify-center gap-2 text-sm tracking-wider`}>
          <Heart className="w-4 h-4 fill-current" />
          <span>收下祝福</span>
        </button>
      </div>
    </div>
  );
  };

  const WorkerHistoryScreen = () => {
    const [myLogs, setMyLogs] = useState([]);

    useEffect(() => {
      // Load from Local Storage
      try {
        const storedLogs = JSON.parse(localStorage.getItem('sw_mood_logs') || '[]');
        const userLogs = storedLogs
          .filter(l => l.nickname === nickname)
          .map(l => ({ ...l, timestamp: new Date(l.timestamp) })) // Convert ISO string back to Date
          .sort((a, b) => b.timestamp - a.timestamp);
        setMyLogs(userLogs);
      } catch (e) {
        console.error("Error loading logs", e);
      }
    }, [nickname]);

    const myChartData = myLogs.slice(0, 15).reverse().map(l => ({
      date: l.timestamp.toLocaleDateString(undefined, {month:'numeric', day:'numeric'}), 
      score: l.moodScore
    }));

    return (
      <div className={`min-h-screen ${styles.bg} flex flex-col p-6 font-serif-tc`}>
        <div className="max-w-4xl w-full mx-auto space-y-6">
          <div className="flex justify-between items-center mb-6 border-b border-[#334155] pb-4">
            <h2 className={`text-xl font-bold ${styles.textMain} flex items-center gap-2`}><BookOpen className="w-5 h-5 text-[#D97706]" /> 覺察足跡 (本機紀錄)</h2>
            <div className="flex gap-2">
                <button onClick={() => setScreen('welcome')} className={`${styles.textSub} hover:text-white text-xs`}>返回</button>
            </div>
          </div>
          {myLogs.length > 0 && (
            <div className={`p-6 rounded-xl shadow-lg h-64 bg-[#162032] border border-[#334155]`}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={myChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                  <Line type="monotone" dataKey="score" stroke="#D97706" strokeWidth={2} dot={{ fill: "#162032", stroke: "#D97706", strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {myLogs.length === 0 && (
            <div className="text-center text-slate-500 py-10">
              尚未有紀錄，快去抽張卡片吧！
            </div>
          )}
          <div className="space-y-3">
             {myLogs.map(log => (
               <div key={log.id} className={`p-4 rounded-lg shadow-sm flex justify-between items-center bg-[#162032]/50 border border-[#334155] hover:bg-[#162032] transition-colors`}>
                  <div>
                    <span className={`font-bold text-[#F8FAFC] tracking-wide`}>{log.moodLabel}</span>
                    <span className={`text-[10px] text-[#64748B] ml-2`}>{log.timestamp.toLocaleDateString()}</span>
                    <p className={`text-xs text-[#D97706] mt-1 flex items-center gap-1 font-light`}><Gift className="w-3 h-3"/> {log.cardTitle}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <GlobalStyles />
      {screen === 'login' && <LoginScreen />}
      {screen === 'welcome' && <WelcomeScreen />}
      {screen === 'checkin' && <CheckinScreen />}
      {screen === 'deck' && <DeckScreen />}
      {screen === 'reveal' && <RevealScreen />}
      {screen === 'history' && <WorkerHistoryScreen />}
    </>
  );
}

