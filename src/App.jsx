import React, { useState, useEffect, useMemo } from 'react';
import { 
  Heart, Battery, Sun, Wind, 
  Sparkles, X, RefreshCw, BookOpen, History, 
  LogOut, Meh, Home, Cloud, Lock, Key,
  Gift, Snowflake, Bell, TreePine, Star, Moon, Compass,
  HeartCrack, Timer
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

// 注意：已移除所有 Firebase 相關引用，改用 LocalStorage 儲存資料

// ==========================================
// 🎄 聖誕夜深色主題
// ==========================================

const THEME = {
  colors: {
    bg: "bg-[#0B1120]", 
    bgGradient: "bg-gradient-to-b from-[#0B1120] via-[#162032] to-[#0B1120]",
    cardGlass: "bg-[#162032]/95 backdrop-blur-xl border border-[#334155]",
    textMain: "text-[#F8FAFC]", 
    textSub: "text-[#94A3B8]", 
    primary: "bg-[#7F1D1D]", 
    button: "bg-gradient-to-r from-[#B45309] to-[#D97706] text-white shadow-[0_0_20px_rgba(217,119,6,0.2)]",
  }
};

// ==========================================
// 🎅 資料庫 (靜態內容)
// ==========================================

const MOODS = [
  { label: "平靜如雪", score: 85, icon: <Snowflake className="w-5 h-5 text-sky-200" /> },
  { label: "溫暖像火爐", score: 95, icon: <Sun className="w-5 h-5 text-orange-300" /> },
  { label: "充滿禮物", score: 90, icon: <Gift className="w-5 h-5 text-red-400" /> },
  { label: "清醒像馴鹿", score: 80, icon: <Bell className="w-5 h-5 text-yellow-400" /> },
  { label: "薑餅人碎了", score: 25, icon: <HeartCrack className="w-5 h-5 text-red-400" /> }, 
  { label: "忙著送禮", score: 45, icon: <Timer className="w-5 h-5 text-purple-400" /> }, 
  { label: "暴風雪中", score: 30, icon: <Wind className="w-5 h-5 text-blue-300" /> }, 
  { label: "沒電的燈泡", score: 20, icon: <Battery className="w-5 h-5 text-red-300" /> }, 
  { label: "無感雪人", score: 60, icon: <Meh className="w-5 h-5 text-gray-400" /> }, 
  { label: "期待佳節", score: 92, icon: <Sparkles className="w-5 h-5 text-yellow-200" /> }, 
];

const CARD_DATABASE = [
  { category: "聖誕老人的智慧", title: "穩如雪橇", message: "當思緒像暴風雪般飛舞，身體是你唯一的錨。", action: "用力踩踏地板三下，像滿載禮物的雪橇著陸一樣穩固。" },
  { category: "聖誕老人的智慧", title: "熱可可呼吸", message: "想像手裡捧著一杯熱可可，用溫度融化內心的冰河。", action: "深吸氣聞香氣，緩慢吹氣冷卻它 (4-7-8呼吸法)。" },
  { category: "聖誕老人的智慧", title: "冬眠片刻", message: "即使是忙碌的聖誕夜，大自然也需要休眠。", action: "閉眼30秒，想像自己是冬眠的熊，外面的風雪與你無關。" },
  { category: "聖誕老人的智慧", title: "雪花觸覺", message: "焦慮時，回到感官是最好的煞車。", action: "找一個冰涼的物體（杯子或桌面），專注感受它15秒的溫度。" },
  { category: "聖誕老人的智慧", title: "煙囪通道", message: "深呼吸是讓新鮮空氣進入心房的煙囪。", action: "把手放在肚子上，感受呼吸像聖誕老人進出煙囪一樣順暢。" },
  { category: "聖誕老人的智慧", title: "雪球重量", message: "壓力有時像滾雪球，越滾越大，需要停下來敲碎。", action: "雙手握拳用力像捏雪球5秒，然後瞬間放鬆。" },
  { category: "聖誕老人的智慧", title: "鈴聲專注", message: "聽覺能幫助我們從解離的狀態回到當下。", action: "安靜下來，試著找出環境中3個微小的聲音，就像聽遠方的鈴聲。" },
  { category: "聖誕老人的智慧", title: "打包清單", message: "大腦超載時，寫下來就是一種卸貨。", action: "拿出紙筆，把你現在擔心的三件事寫下來，折起來放進口袋。" },
  { category: "聖誕老人的智慧", title: "平安夜的靜", message: "在喧囂的個案工作中，安靜本身就是一種療癒。", action: "給自己一分鐘的「絕對靜音時刻」，不說話、不滑手機。" },
  { category: "聖誕老人的智慧", title: "融冰時刻", message: "緊繃的肩膀像結冰的屋簷。", action: "聳肩到耳朵，堅持5秒，然後像冰柱融化一樣重重落下。" },

  { category: "馴鹿的能量", title: "紅鼻子訊號", message: "情緒像魯道夫的紅鼻子，那是發光的警訊，不是缺點。", action: "摸摸心口，對現在的情緒說：「我看見你了，謝謝你的提醒。」" },
  { category: "馴鹿的能量", title: "飛越屋頂", message: "當現實太壓迫，我們可以選擇心靈的暫時抽離。", action: "想像你正坐著雪橇升空，看著地面的煩惱變得很小很小。" },
  { category: "馴鹿的能量", title: "卸下貨物", message: "雪橇太重是飛不起來的，你不需要背負所有人的命運。", action: "寫下一件今天可以「暫時不處理」的事，把它丟進雪地裡。" },
  { category: "馴鹿的能量", title: "暴風雪導航", message: "在情緒風暴中，不要急著趕路，停下來也是一種前進。", action: "告訴自己：「我現在很混亂，這很正常，我會等風雪變小。」" },
  { category: "馴鹿的能量", title: "領頭鹿的勇氣", message: "承認脆弱，是社工最強大的領導力。", action: "允許自己今天可以不那麼堅強，對自己說：「今天辛苦了。」" },
  { category: "馴鹿的能量", title: "團隊陣型", message: "馴鹿不會獨自飛行，你也不該獨自承擔。", action: "想出一個可以支援你的夥伴名字，傳個訊息給他（甚至只是貼圖）。" },
  { category: "馴鹿的能量", title: "蹄聲節奏", message: "混亂中，找回自己的節奏。", action: "用手指輕敲桌面，創造一個穩定的節拍，持續30秒。" },
  { category: "馴鹿的能量", title: "迷霧降落", message: "當前方看不清時，安全降落比硬飛重要。", action: "如果覺得撐不住，給自己五分鐘的「廁所暫停時間」。" },
  { category: "馴鹿的能量", title: "能量補給", message: "馴鹿也需要紅蘿蔔。", action: "現在就去喝一杯水，把它當作魔法藥水喝下去。" },
  { category: "馴鹿的能量", title: "脫韁時刻", message: "下班後，解開工作的韁繩。", action: "做一個全身甩動的動作（像狗甩水一樣），把工作氣場甩掉。" },

  { category: "薑餅人的防護", title: "糖霜結界", message: "你的善良需要保護色，才不會在系統中碎掉。", action: "想像周圍有一圈金色的光圈，別人的負能量會被彈開。" },
  { category: "薑餅人的防護", title: "不是你的禮物", message: "有些責任是別人的包裹，你不需要幫忙拆開。", action: "默念：「我把個案的生命責任交還給他自己，我只負責陪伴。」" },
  { category: "薑餅人的防護", title: "脫下紅袍", message: "下班了，你不是聖誕老人，你是你自己。", action: "進家門前做一個「拍掉雪花」的動作，象徵把工作留在門外。" },
  { category: "薑餅人的防護", title: "烤箱溫度", message: "不過度涉入，是為了不讓自己烤焦。", action: "檢視最近是否對某個個案「過度用力」？試著後退一步。" },
  { category: "薑餅人的防護", title: "堅硬與酥脆", message: "我們可以柔軟，但不能沒有骨氣。", action: "練習一句溫和堅定的拒絕：「我現在無法答應，因為我要確保品質。」" },
  { category: "薑餅人的防護", title: "誰在屋裡", message: "你的心靈小屋，有權決定誰能進來。", action: "想像把討厭的人事物請出門外，並鎖上厚厚的橡木門。" },
  { category: "薑餅人的防護", title: "模具形狀", message: "不要讓機構或社會期待，把你壓成不像你的樣子。", action: "寫下你這週做過的一件「很像你自己」的事。" },
  { category: "薑餅人的防護", title: "破碎也美味", message: "就算斷了一隻手，薑餅人依然是完整的薑餅人。", action: "接納今天工作中犯的一個小錯，那不損害你的價值。" },
  { category: "薑餅人的防護", title: "別吃毒蘋果", message: "不是所有人的回饋都要吞下去。", action: "區分哪些批評是「有毒的」，想像把它們吐出來。" },
  { category: "薑餅人的防護", title: "冷卻時間", message: "剛出爐的情緒太燙，別急著處理。", action: "遇到衝突時，告訴對方：「我需要想一下，十分鐘後回覆你。」" },

  { category: "暖爐邊的慈悲", title: "給自己的禮物", message: "你總是送禮物給別人，今天輪到你了。", action: "問自己：現在立刻可以給自己的一個小獎勵是什麼？" },
  { category: "暖爐邊的慈悲", title: "不完美的樹", message: "聖誕樹有點歪歪的也沒關係，依然很美。", action: "對自己說：「我今天已經做得夠好了，Done is better than perfect。」" },
  { category: "暖爐邊的慈悲", title: "擁抱雪人", message: "心裡的冰冷需要溫暖的擁抱，而不是指責。", action: "雙手交叉擁抱自己，輕拍肩膀，像安撫一個受傷的孩子。" },
  { category: "暖爐邊的慈悲", title: "煤炭的轉化", message: "今天的挫折（煤炭），是為了燃燒明天的溫暖。", action: "把今天的一個「失敗」，重新定義為「學習」。" },
  { category: "暖爐邊的慈悲", title: "柴火添加", message: "職業倦怠是因為燒光了，卻忘了加柴。", action: "列出三個能讓你「回血」的活動，週末選一個做。" },
  { category: "暖爐邊的慈悲", title: "襪子裡的驚喜", message: "快樂藏在微小的事物中。", action: "回想今天發生的一件微小好事（例如好喝的咖啡）。" },
  { category: "暖爐邊的慈悲", title: "解開纏線", message: "創傷就像打結的聖誕燈，用力拉會斷，要慢慢解。", action: "對自己混亂的思緒多一點耐心，慢慢來。" },
  { category: "暖爐邊的慈悲", title: "允許不快樂", message: "聖誕節不一定要快樂，允許悲傷存在也是一種慈悲。", action: "如果你想哭，就給自己5分鐘盡情流淚的時間。" },
  { category: "暖爐邊的慈悲", title: "毛毯堡壘", message: "有時候，躲起來是為了生存。", action: "今晚早點上床，把自己捲進棉被裡，享受被包覆的安全感。" },
  { category: "暖爐邊的慈悲", title: "燭光晚餐", message: "儀式感能把日子過成詩。", action: "今晚吃飯時，不看手機，專心品嚐每一口食物。" },

  { category: "北極星的指引", title: "點亮燭光", message: "黑暗中，微光就能照亮路。你就是那道光。", action: "肯定自己：「因為我在，某個人的世界少了一點黑暗。」" },
  { category: "北極星的指引", title: "相信奇蹟", message: "改變通常在不經意間發生，種子在雪地下發芽。", action: "深呼吸，告訴自己：「所有的努力都在發酵中，只是我還沒看見。」" },
  { category: "北極星的指引", title: "精靈的工藝", message: "你的專業就像精靈的工藝，是獨一無二的魔法。", action: "回想一個你曾經成功幫助個案的時刻。" },
  { category: "北極星的指引", title: "星光導航", message: "不忘初衷，但允許路線修正。", action: "問自己：「我當初為什麼想做社工？」找回那個核心價值。" },
  { category: "北極星的指引", title: "禮物交換", message: "助人是雙向的，個案也教會了我們許多。", action: "想一個你從個案身上學到的特質（如：堅韌）。" },
  { category: "北極星的指引", title: "老人的名單", message: "你記得很多人的故事，這是一種見證的榮耀。", action: "感謝自己承載了這麼多生命故事，你是靈魂的守護者。" },
  { category: "北極星的指引", title: "雪地足跡", message: "凡走過必留下痕跡，你的付出不會白費。", action: "看著鏡子裡的自己，說一聲：「謝謝你一直沒有放棄。」" },
  { category: "北極星的指引", title: "樹頂星", message: "把眼光放遠，痛苦只是過程。", action: "想像五年後的自己回頭看現在，會給自己什麼建議？" },
  { category: "北極星的指引", title: "午夜鐘聲", message: "每一天都是新的開始，舊的已過。", action: "做一個深呼吸，想像把今天的疲憊隨著氣息吐出，歸零。" },
  { category: "北極星的指引", title: "愛的傳遞", message: "你給出的溫暖，會以意想不到的方式回到你身邊。", action: "傳一個感謝的訊息給一位同事或督導。" }
];

export default function ChristmasSocialWorkerApp() {
  // App State
  const [nickname, setNickname] = useState('');
  const [tempNickname, setTempNickname] = useState('');
  const [screen, setScreen] = useState('login'); 
  const [selectedMood, setSelectedMood] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Styles
  const styles = THEME.colors;

  // --- Initialization (Local Storage Check) ---
  useEffect(() => {
    // 檢查 LocalStorage 是否有舊的登入資訊
    const storedNick = localStorage.getItem('sw_app_nickname');
    if (storedNick) {
      setNickname(storedNick);
      setScreen('welcome');
    }
  }, []);

  // --- Shared Logic ---

  const handleLogin = (e) => {
    e.preventDefault();
    if (!tempNickname.trim()) return;
    setNickname(tempNickname.trim());
    localStorage.setItem('sw_app_nickname', tempNickname.trim());
    setScreen('welcome');
  };

  const handleLogout = () => {
    setNickname('');
    setTempNickname('');
    localStorage.removeItem('sw_app_nickname');
    setScreen('login');
  };

  const drawCard = () => {
    const randomIdx = Math.floor(Math.random() * CARD_DATABASE.length);
    const card = CARD_DATABASE[randomIdx];
    setCurrentCard(card);
    setScreen('reveal');
    setIsFlipped(false);
    setTimeout(() => setIsFlipped(true), 100); 
    
    // Save to Local Storage instead of Firestore
    if (selectedMood) {
      const newLog = {
        id: Date.now().toString(), // 簡單的 ID
        nickname: nickname,
        moodLabel: selectedMood.label,
        moodScore: selectedMood.score,
        cardTitle: card.title,
        cardCategory: card.category,
        timestamp: new Date().toISOString() // 儲存為 ISO 字串
      };

      try {
        const existingLogs = JSON.parse(localStorage.getItem('sw_mood_logs') || '[]');
        const updatedLogs = [...existingLogs, newLog];
        localStorage.setItem('sw_mood_logs', JSON.stringify(updatedLogs));
      } catch (e) {
        console.error("Local storage save error", e);
      }
    }
  };

  // --- Visual Components ---

  const GlobalStyles = () => (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;700;900&display=swap');
      .font-serif-tc { font-family: 'Noto Serif TC', serif; }
    `}</style>
  );

  const SnowEffect = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
       {[...Array(30)].map((_, i) => (
         <div key={i} className="absolute text-white/30 animate-pulse" 
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 5}s`,
              fontSize: `${10 + Math.random() * 20}px`
            }}>
           ❄
         </div>
       ))}
    </div>
  );

  // --- Screens ---

  const LoginScreen = () => (
    <div className={`min-h-screen ${styles.bgGradient} flex flex-col items-center justify-center p-6 relative overflow-hidden font-serif-tc`}>
      <SnowEffect />
      
      <div className="absolute top-10 right-10 opacity-20">
        <Moon className="w-24 h-24 text-yellow-100" />
      </div>

      <div className="max-w-md w-full relative z-10 animate-fade-in">
        <div className={`p-10 rounded-[24px] shadow-2xl ${styles.cardGlass} relative overflow-hidden`}>
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-yellow-500/10 blur-3xl rounded-full"></div>
          
          <div className="text-center relative z-10">
            <div className="flex justify-center mb-6">
               <div className="relative">
                 <div className="w-20 h-20 bg-[#162032] rounded-full flex items-center justify-center border border-[#B45309] shadow-[0_0_20px_rgba(180,83,9,0.2)]">
                    <TreePine className="w-10 h-10 text-[#D97706]" />
                 </div>
               </div>
            </div>
            <h2 className={`text-2xl tracking-widest ${styles.textMain} font-bold text-shadow-sm`}>聖誕心靈小屋</h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#D97706] to-transparent mx-auto my-4"></div>
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
