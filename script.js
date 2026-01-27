/* =========================================
   1. GLOBAL & TAB MANAGEMENT (SPA)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initLotto();
    initMbti();
    initReactionGame();
});

function initTabs() {
    const tabs = ['luck', 'decision', 'ability'];
    
    tabs.forEach(tab => {
        const btn = document.getElementById(`btn-${tab}`);
        btn.addEventListener('click', () => switchTab(tab));
    });
}

function switchTab(activeTab) {
    const tabs = ['luck', 'decision', 'ability'];
    
    // Reset all
    tabs.forEach(tab => {
        document.getElementById(`${tab}-section`).classList.remove('active');
        document.getElementById(`btn-${tab}`).classList.remove(`active-${tab}`);
        // Reset specific UI states if needed
    });

    // Activate target
    document.getElementById(`${activeTab}-section`).classList.add('active');
    document.getElementById(`btn-${activeTab}`).classList.add(`active-${activeTab}`);
}


/* =========================================
   2. LOTTO GENERATOR LOGIC (Luck)
   ========================================= */
function initLotto() {
    const generateBtn = document.getElementById('lotto-gen-btn');
    const saveBtn = document.getElementById('lotto-save-btn');
    if(generateBtn) generateBtn.addEventListener('click', generateLotto);
    if(saveBtn) saveBtn.addEventListener('click', saveLottoHistory);
    
    renderLottoHistory();
}

// Global state for Lotto
let currentLottoNumbers = [];
const LOTTO_STORAGE_KEY = 'dailyPick_lotto_v1';

function generateLotto() {
    const ratio = document.getElementById('odd-even-ratio').value;
    const includeInput = document.getElementById('include-num');
    const excludeInputs = [
        document.getElementById('exclude-1'),
        document.getElementById('exclude-2'),
        document.getElementById('exclude-3')
    ];

    const includeVal = parseInt(includeInput.value);
    const excludeVals = excludeInputs.map(el => parseInt(el.value)).filter(n => !isNaN(n));

    // Validation
    if ((includeVal && (includeVal < 1 || includeVal > 45)) || excludeVals.some(v => v < 1 || v > 45)) {
        alert('번호는 1~45 사이여야 합니다.'); return;
    }
    if (includeVal && excludeVals.includes(includeVal)) {
        alert('고정수가 제외수에 포함되었습니다.'); return;
    }
    if (new Set(excludeVals).size !== excludeVals.length) {
        alert('제외수에 중복이 있습니다.'); return;
    }

    // Logic
    let pool = Array.from({length: 45}, (_, i) => i + 1).filter(n => !excludeVals.includes(n));
    let result = [];

    if (includeVal) {
        result.push(includeVal);
        pool = pool.filter(n => n !== includeVal);
    }

    let needed = 6 - result.length;
    let finalNumbers = [];

    // Ratio Logic
    if (ratio === 'random') {
        finalNumbers = [...result, ...shuffle(pool).slice(0, needed)];
    } else {
        const [targetOdd, targetEven] = ratio.split(':').map(Number);
        const currentOdd = result.filter(n => n % 2 !== 0).length;
        const currentEven = result.filter(n => n % 2 === 0).length;
        
        const needOdd = targetOdd - currentOdd;
        const needEven = targetEven - currentEven;

        if (needOdd < 0 || needEven < 0) {
            alert('고정수 때문에 비율을 맞출 수 없습니다.'); return;
        }
        
        const oddPool = pool.filter(n => n % 2 !== 0);
        const evenPool = pool.filter(n => n % 2 === 0);

        if (oddPool.length < needOdd || evenPool.length < needEven) {
            alert('조건을 만족하는 번호가 없습니다.'); return;
        }

        finalNumbers = [...result, ...shuffle(oddPool).slice(0, needOdd), ...shuffle(evenPool).slice(0, needEven)];
    }

    finalNumbers.sort((a,b) => a-b);
    currentLottoNumbers = finalNumbers;
    renderBalls(finalNumbers);
    document.getElementById('lotto-save-btn').classList.remove('hidden');
}

function renderBalls(nums) {
    const container = document.getElementById('lotto-result');
    container.innerHTML = '';
    nums.forEach(n => {
        const ball = document.createElement('div');
        ball.className = `lotto-ball ${getBallColor(n)} mr-2 mb-2`;
        ball.textContent = n;
        container.appendChild(ball);
    });
}

function getBallColor(n) {
    if(n<=10) return 'ball-yellow';
    if(n<=20) return 'ball-blue';
    if(n<=30) return 'ball-red';
    if(n<=40) return 'ball-black';
    return 'ball-green';
}

function saveLottoHistory() {
    if(currentLottoNumbers.length === 0) return;
    const history = JSON.parse(localStorage.getItem(LOTTO_STORAGE_KEY) || '[]');
    const now = new Date();
    history.unshift({
        nums: currentLottoNumbers,
        date: `${now.getMonth()+1}.${now.getDate()} ${now.getHours()}:${now.getMinutes()}`
    });
    if(history.length > 20) history.pop();
    localStorage.setItem(LOTTO_STORAGE_KEY, JSON.stringify(history));
    renderLottoHistory();
    document.getElementById('lotto-save-btn').classList.add('hidden');
}

function renderLottoHistory() {
    const list = document.getElementById('lotto-history');
    const history = JSON.parse(localStorage.getItem(LOTTO_STORAGE_KEY) || '[]');
    list.innerHTML = history.length ? '' : '<li class="text-sm text-gray-400">기록 없음</li>';
    history.forEach((item, idx) => {
        const li = document.createElement('li');
        li.className = 'flex justify-between text-sm py-1 border-b border-gray-100';
        li.innerHTML = `<span>${item.nums.join(', ')}</span><span class="text-gray-400 text-xs">${item.date}</span>`;
        list.appendChild(li);
    });
}

function shuffle(arr) {
    for(let i=arr.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}


/* =========================================
   3. MBTI RECOMMENDER (Decision)
   ========================================= */
// Simple data structure for example
const MBTI_DATA = {
    "INTJ": { food: "효율적이고 깔끔한 '서브웨이 샌드위치'", foodDesc: "시간 낭비 없이 영양 밸런스를 맞출 수 있는 완벽한 전략적 선택입니다.", trip: "조용한 사색의 도시, '교토'", tripDesc: "복잡한 인파를 피해 고즈넉한 사원에서 계획적인 여행을 즐겨보세요." },
    "INTP": { food: "독특한 퓨전 요리 '로제 찜닭'", foodDesc: "기존의 맛을 비트 꼬아놓은 창의적인 메뉴가 호기심을 자극합니다.", trip: "신비로운 고대 유적 '이집트'", tripDesc: "끊임없는 지적 탐구를 충족시켜줄 역사적인 장소입니다." },
    "ENTJ": { food: "고급진 스테이크 코스", foodDesc: "성공의 맛! 확실한 퀄리티가 보장된 식당에서 에너지를 충전하세요.", trip: "화려한 마천루 '뉴욕'", tripDesc: "세상의 중심에서 야망을 키울 수 있는 다이내믹한 도시입니다." },
    "ENTP": { food: "매일 바뀌는 '오마카세'", foodDesc: "예측 불가능한 메뉴 구성이 지루할 틈을 주지 않습니다.", trip: "배낭 하나 메고 '인도'", tripDesc: "어디로 튈지 모르는 스펙타클한 모험이 기다리고 있습니다." },
    
    "INFJ": { food: "따뜻한 '나베/샤브샤브'", foodDesc: "소중한 사람들과 깊은 대화를 나누며 먹기 좋은 힐링 푸드입니다.", trip: "평화로운 숲속 '오로라 여행'", tripDesc: "영적인 영감을 받을 수 있는 신비로운 자연 속으로 떠나세요." },
    "INFP": { food: "예쁜 디저트 카페의 '수플레 팬케이크'", foodDesc: "맛보다는 감성! 보기만 해도 몽글몽글해지는 메뉴입니다.", trip: "동화 속 마을 '체코 프라하'", tripDesc: "낭만적인 거리에서 나만의 소설을 써내려가 보세요." },
    "ENFJ": { food: "함께 나눠 먹는 '패밀리 레스토랑 플래터'", foodDesc: "모두가 행복해하는 모습을 볼 때 가장 맛있는 법입니다.", trip: "활기찬 축제의 도시 '바르셀로나'", tripDesc: "사람들과 어울리며 열정을 불태울 수 있는 곳입니다." },
    "ENFP": { food: "요즘 핫한 줄 서는 '마라탕'", foodDesc: "자극적이고 트렌디한 맛! 친구들과 인증샷은 필수입니다.", trip: "액티비티 천국 '보라카이'", tripDesc: "패러세일링부터 파티까지, 심심할 틈이 없는 낙원입니다." },
    
    "ISTJ": { food: "든든한 '국밥' 또는 '한정식'", foodDesc: "검증된 맛과 영양, 가성비까지 챙긴 합리적인 선택입니다.", trip: "역사가 살아있는 '경주'", tripDesc: "계획대로 착착 진행될 수 있는 정갈하고 교육적인 여행지입니다." },
    "ISFJ": { food: "집밥 느낌의 '백반'", foodDesc: "자극적이지 않고 속이 편안한, 정성이 담긴 밥상이 최고입니다.", trip: "편안한 휴양지 '다낭'", tripDesc: "가족이나 연인을 챙기며 안전하게 쉴 수 있는 곳입니다." },
    "ESTJ": { food: "빠르고 든든한 '햄버거 세트'", foodDesc: "바쁜 일정 속에서도 효율적으로 허기를 채울 수 있습니다.", trip: "쇼핑과 관광의 메카 '홍콩'", tripDesc: "체계적인 인프라 속에서 알찬 일정을 소화할 수 있습니다." },
    "ESFJ": { food: "유명한 브런치 카페의 '에그 베네딕트'", foodDesc: "친한 친구들과 수다 떨기에 최적화된 분위기 맛집입니다.", trip: "모두가 좋아하는 '제주도'", tripDesc: "호불호 없이 누구나 즐길 수 있는 검증된 핫플레이스입니다." },
    
    "ISTP": { food: "혼자 먹기 편한 '라멘'", foodDesc: "귀찮게 말 걸지 않는 1인 식당에서 오로지 맛에만 집중하세요.", trip: "대자연의 캠핑 '몽골'", tripDesc: "도구 몇 개만 챙겨서 떠나는 본능적이고 자유로운 여행입니다." },
    "ISFP": { food: "플레이팅이 예쁜 '파스타'", foodDesc: "눈으로 먼저 먹는 예술적인 한 끼가 침대에 누워있던 당신을 깨웁니다.", trip: "예술의 도시 '파리'", tripDesc: "발길 닿는 대로 걷기만 해도 영감이 떠오르는 낭만의 도시입니다." },
    "ESTP": { food: "자극적인 '매운 갈비찜'", foodDesc: "화끈한 맛! 스트레스를 한방에 날려버리는 짜릿함이 필요합니다.", trip: "카지노와 쇼핑 '라스베가스'", tripDesc: "오늘만 사는 것처럼 즐길 수 있는 화려한 불야성입니다." },
    "ESFP": { food: "시끌벅적한 '삼겹살에 소주'", foodDesc: "분위기에 취하고 맛에 취하는, 파티 같은 식사가 딱입니다.", trip: "열정의 해변 '마이애미'", tripDesc: "새로운 사람들과 어울리며 춤추고 놀 수 있는 최고의 휴가지입니다." }
};

function initMbti() {
    document.getElementById('mbti-btn').addEventListener('click', recommendMbti);
}

function recommendMbti() {
    const mbti = document.getElementById('mbti-select').value;
    const category = document.getElementById('mbti-category').value;
    const resultArea = document.getElementById('mbti-result');
    
    if (!mbti) { alert("MBTI를 선택해주세요!"); return; }

    const data = MBTI_DATA[mbti] || MBTI_DATA['ENTP']; // default fallback
    let title, desc;

    if (category === 'food') {
        title = `🍱 ${mbti}를 위한 추천 메뉴`;
        desc = `<strong class="text-xl text-purple-600 block mb-2">${data.food}</strong>${data.foodDesc}`;
    } else {
        title = `✈️ ${mbti}를 위한 여행지`;
        desc = `<strong class="text-xl text-purple-600 block mb-2">${data.trip}</strong>${data.tripDesc}`;
    }

    resultArea.innerHTML = `
        <h3 class="font-bold text-gray-700 mb-2">${title}</h3>
        <p class="text-gray-600">${desc}</p>
    `;
    resultArea.classList.remove('hidden');
    resultArea.classList.add('animate-pulse');
    setTimeout(()=> resultArea.classList.remove('animate-pulse'), 500);
}


/* =========================================
   4. REACTION GAME (Ability)
   ========================================= */
let gameState = 'waiting'; // waiting | ready | now | finished
let timeoutId = null;
let startTime = 0;
let reactionHistory = [];

const screen = document.getElementById('reaction-screen');
const resultText = document.getElementById('reaction-result');

function initReactionGame() {
    if(screen) screen.addEventListener('mousedown', handleScreenClick);
}

function handleScreenClick() {
    switch (gameState) {
        case 'waiting': // Start game
            startGame();
            break;
        case 'ready': // Clicked too early
            endGameTooEarly();
            break;
        case 'now': // Success
            endGameSuccess();
            break;
        case 'finished': // Restart
            resetGame();
            startGame();
            break;
    }
}

function startGame() {
    gameState = 'ready';
    screen.className = 'w-full h-64 rounded-xl flex flex-col justify-center items-center text-white font-bold text-xl mb-4 ready';
    screen.innerHTML = '<p>초록색이 되면 클릭하세요!</p>';
    resultText.classList.add('hidden');
    
    const randomTime = Math.floor(Math.random() * 2000) + 1000; // 1~3s
    timeoutId = setTimeout(() => {
        gameState = 'now';
        screen.className = 'w-full h-64 rounded-xl flex flex-col justify-center items-center text-white font-bold text-xl mb-4 now';
        screen.innerHTML = '<p>지금 클릭!!!</p>';
        startTime = new Date().getTime();
    }, randomTime);
}

function endGameTooEarly() {
    clearTimeout(timeoutId);
    gameState = 'waiting';
    screen.className = 'w-full h-64 rounded-xl flex flex-col justify-center items-center text-white font-bold text-xl mb-4 bg-orange-500';
    screen.innerHTML = '<p>너무 빨라요! 성급하시네요.</p><div class="text-sm mt-2 font-normal">다시 클릭해서 시작</div>';
}

function endGameSuccess() {
    const endTime = new Date().getTime();
    const diff = endTime - startTime;
    reactionHistory.push(diff);
    
    gameState = 'finished';
    screen.className = 'w-full h-64 rounded-xl flex flex-col justify-center items-center text-white font-bold text-xl mb-4 waiting';
    screen.innerHTML = `<p>${diff}ms</p><div class="text-sm mt-2 font-normal">한 번 더 하려면 클릭</div>`;
    
    // Stats
    const avg = Math.floor(reactionHistory.reduce((a,b)=>a+b, 0) / reactionHistory.length);
    let rank = '';
    if (avg < 200) rank = '프로게이머 수준 (상위 1%)';
    else if (avg < 300) rank = '매우 빠름 (상위 10%)';
    else if (avg < 400) rank = '평균 이상';
    else rank = '훈련이 필요합니다';

    resultText.innerHTML = `
        <div class="space-y-1">
            <p>현재 기록: <span class="font-bold text-orange-600">${diff}ms</span></p>
            <p>평균 기록(${reactionHistory.length}회): <span class="font-bold text-gray-800">${avg}ms</span></p>
            <p class="text-sm text-gray-500 mt-2">당신의 등급은: <span class="font-bold text-orange-500">${rank}</span></p>
        </div>
    `;
    resultText.classList.remove('hidden');
}

function resetGame() {
    // Only resets state for loop, history persists within session
}
