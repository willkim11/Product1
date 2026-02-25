

function getLang() {
    return document.documentElement.lang === 'en' ? 'en' : 'ko';
}

/* --- I18N RESOURCES --- */
const RESOURCES = {
    ko: {
        lotto: {
            wait: '번호 생성 대기중...',
            rangeError: '번호는 1~45 사이여야 합니다.',
            includeError: '고정수가 제외수에 포함되었습니다.',
            duplicateError: '제외수에 중복이 있습니다.',
            ratioError: '고정수 때문에 비율을 맞출 수 없습니다.',
            emptyError: '조건을 만족하는 번호가 없습니다.',
            historyEmpty: '기록 없음'
        },
        game: {
            ready: '<p>초록색이 되면 클릭하세요!</p>',
            now: '<p>지금 클릭!!!</p>',
            tooEarly: '<p>너무 빨라요! 성급하시네요.</p><div class="text-sm mt-2 font-normal">다시 클릭해서 시작</div>',
            result: (diff) => `<p>${diff}ms</p><div class="text-sm mt-2 font-normal">한 번 더 하려면 클릭</div>`,
            ranks: {
                pro: '프로게이머 수준 (상위 1%)',
                fast: '매우 빠름 (상위 10%)',
                avg: '평균 이상',
                training: '훈련이 필요합니다'
            },
            stats: (diff, avg, count, rank) => `
                <div class="space-y-1">
                    <p>현재 기록: <span class="font-bold text-orange-600">${diff}ms</span></p>
                    <p>평균 기록(${count}회): <span class="font-bold text-gray-800">${avg}ms</span></p>
                    <p class="text-sm text-gray-500 mt-2">당신의 등급은: <span class="font-bold text-orange-500">${rank}</span></p>
                </div>
            `
        },
        mbti: {
            alert: 'MBTI를 선택해주세요!',
            foodTitle: (mbti) => `🍱 ${mbti}를 위한 추천 메뉴`,
            tripTitle: (mbti) => `✈️ ${mbti}를 위한 여행지`
        }
    },
    en: {
        lotto: {
            wait: 'Waiting for numbers...',
            rangeError: 'Numbers must be between 1 and 45.',
            includeError: 'Fixed number is in excluded numbers.',
            duplicateError: 'Excluded numbers contain duplicates.',
            ratioError: 'Cannot match ratio due to fixed number.',
            emptyError: 'No numbers satisfy the conditions.',
            historyEmpty: 'No history'
        },
        game: {
            ready: '<p>Click when it turns green!</p>',
            now: '<p>CLICK NOW!!!</p>',
            tooEarly: '<p>Too early! Too hasty.</p><div class="text-sm mt-2 font-normal">Click to restart</div>',
            result: (diff) => `<p>${diff}ms</p><div class="text-sm mt-2 font-normal">Click to retry</div>`,
            ranks: {
                pro: 'Pro Gamer Level (Top 1%)',
                fast: 'Very Fast (Top 10%)',
                avg: 'Above Average',
                training: 'Training Needed'
            },
            stats: (diff, avg, count, rank) => `
                <div class="space-y-1">
                    <p>Current: <span class="font-bold text-orange-600">${diff}ms</span></p>
                    <p>Average(${count} tries): <span class="font-bold text-gray-800">${avg}ms</span></p>
                    <p class="text-sm text-gray-500 mt-2">Your Rank: <span class="font-bold text-orange-500">${rank}</span></p>
                </div>
            `
        },
        mbti: {
            alert: 'Please select your MBTI!',
            foodTitle: (mbti) => `🍱 Food for ${mbti}`,
            tripTitle: (mbti) => `✈️ Trip for ${mbti}`
        }
    }
};

const MBTI_DATA = {
    ko: {
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
    },
    en: {
        "INTJ": { food: "Efficient 'Subway Sandwich'", foodDesc: "A perfect strategic choice for nutritional balance without wasting time.", trip: "City of Quiet Contemplation, 'Kyoto'", tripDesc: "Enjoy a planned trip in a serene temple avoiding crowds." },
        "INTP": { food: "Unique Fusion 'Rose Braised Chicken'", foodDesc: "Creative menu with a twist stimulates your curiosity.", trip: "Mysterious Ancient Ruins 'Egypt'", tripDesc: "A historical place that satisfies endless intellectual curiosity." },
        "ENTJ": { food: "Premium Steak Course", foodDesc: "Taste of Success! Recharge energy at a restaurant with guaranteed quality.", trip: "Glorious Skyscrapers 'New York'", tripDesc: "A dynamic city where you can grow your ambition at the center of the world." },
        "ENTP": { food: "Daily Changing 'Omakase'", foodDesc: "Unpredictable menu composition keeps you from getting bored.", trip: "Backpacking in 'India'", tripDesc: "A spectacular adventure awaits where you never know what happens next." },
        "INFJ": { food: "Warm 'Nabe/Shabu-shabu'", foodDesc: "Healing food great for deep conversations with precious people.", trip: "Peaceful Forest 'Aurora Trip'", tripDesc: "Leave for mysterious nature where you can get spiritual inspiration." },
        "INFP": { food: "Pretty Dessert Cafe 'Souffle Pancake'", foodDesc: "Vibe over taste! A menu that makes you feel soft just by looking.", trip: "Fairytale Village 'Prague, Czech'", tripDesc: "Write your own novel in the romantic streets." },
        "ENFJ": { food: "Shared 'Family Restaurant Platter'", foodDesc: "It tastes best when everyone is happy together.", trip: "City of Festivals 'Barcelona'", tripDesc: "A place where you can burn your passion while mingling with people." },
        "ENFP": { food: "Trendy Queuing 'Malatang'", foodDesc: "Stimulating and trendy taste! A selfie with friends is a must.", trip: "Activity Heaven 'Boracay'", tripDesc: "A paradise with no time to be bored, from parasailing to parties." },
        "ISTJ": { food: "Hearty 'Gukbap' or 'Hanjeongsik'", foodDesc: "A rational choice with verified taste, nutrition, and cost-effectiveness.", trip: "History Alive 'Gyeongju'", tripDesc: "A neat and educational destination where things can proceed as planned." },
        "ISFJ": { food: "Home-style 'Baekban'", foodDesc: "Comfortable meal with sincerity, not stimulating, is the best.", trip: "Relaxing Resort 'Da Nang'", tripDesc: "A place where you can safely rest while taking care of family or lovers." },
        "ESTJ": { food: "Quick and Hearty 'Hamburger Set'", foodDesc: "Efficiently fill your hunger even in a busy schedule.", trip: "Mecca of Shopping 'Hong Kong'", tripDesc: "Digest a fruitful schedule within a systematic infrastructure." },
        "ESFJ": { food: "Famous Brunch Cafe 'Eggs Benedict'", foodDesc: "An atmosphere restaurant optimized for chatting with close friends.", trip: "Everyone's Favorite 'Jeju Island'", tripDesc: "A verified hot place that anyone can enjoy without likes or dislikes." },
        "ISTP": { food: "Solo Dining 'Ramen'", foodDesc: "Focus solely on taste in a solo restaurant where no one bothers you.", trip: "Nature Camping 'Mongolia'", tripDesc: "Instinctive and free travel with just a few tools." },
        "ISFP": { food: "Artistic Plating 'Pasta'", foodDesc: "An artistic meal you eat with your eyes first wakes you up from bed.", trip: "City of Arts 'Paris'", tripDesc: "Romantic city where inspiration comes just by walking wherever your feet take you." },
        "ESTP": { food: "Spicy 'Galbijjim'", foodDesc: "Fiery taste! You need a thrill to blow away stress at once.", trip: "Casino and Shopping 'Las Vegas'", tripDesc: "A splendid sleepless city where you can enjoy like there's no tomorrow." },
        "ESFP": { food: "Bustling 'Pork Belly & Soju'", foodDesc: "A party-like meal where you get drunk on atmosphere and taste is perfect.", trip: "Passionate Beach 'Miami'", tripDesc: "The best vacation spot where you can dance and play with new people." }
    }
};

/* --- DARK MODE TOGGLE --- */
function initDarkMode() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // 1. Initial Check
    const isDark = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
        document.documentElement.classList.add('dark');
        if(themeToggleBtn) themeToggleBtn.innerText = '☀️';
    } else {
        document.documentElement.classList.remove('dark');
        if(themeToggleBtn) themeToggleBtn.innerText = '🌙';
    }

    // 2. Event Listener
    if(themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.theme = 'light';
                themeToggleBtn.innerText = '🌙';
            } else {
                document.documentElement.classList.add('dark');
                localStorage.theme = 'dark';
                themeToggleBtn.innerText = '☀️';
            }
        });
    }
}


const TAROT_DATA = [
    { id: 0, image: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg", name_ko: "0. 광대 (The Fool)", name_en: "0. The Fool", desc_ko: { upright: "새로운 시작, 모험, 순수함, 자유로운 영혼\n\n두려움 없이 새로운 여정을 떠날 준비가 되셨나요? 무한한 가능성이 당신 앞에 열려 있습니다.", reversed: "경솔함, 무모함, 위험 감수\n\n준비 없는 시작은 위험할 수 있습니다. 발밑의 절벽을 조심하세요." }, desc_en: { upright: "New beginnings, adventure, innocence, free spirit\n\nAre you ready to embark on a new journey without fear? Infinite possibilities lie before you.", reversed: "Recklessness, risk-taking, inconsideration\n\nAn unprepared start can be dangerous. Watch out for the cliff beneath your feet." } },
    { id: 1, image: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg", name_ko: "1. 마법사 (The Magician)", name_en: "1. The Magician", desc_ko: { upright: "창조력, 의지력, 능수능란함\n\n당신은 목표를 이룰 모든 도구를 가지고 있습니다. 이제 행동으로 옮길 때입니다.", reversed: "재능의 낭비, 속임수, 소통 부재\n\n자신의 능력을 믿지 못하거나, 잘못된 방향으로 쓰고 있지는 않나요?" }, desc_en: { upright: "Creativity, willpower, skill\n\nYou have all the tools to achieve your goals. It's time to take action.", reversed: "Wasted talent, deception, lack of communication\n\nAre you doubting your abilities or using them in the wrong direction?" } },
    { id: 2, image: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg", name_ko: "2. 여사제 (The High Priestess)", name_en: "2. The High Priestess", desc_ko: { upright: "직관, 무의식, 지혜, 신비\n\n당신의 내면의 목소리에 귀를 기울이세요. 답은 이미 당신 안에 있습니다.", reversed: "비밀, 억압된 감정, 얕은 지식\n\n자신의 감정을 무시하지 마세요. 드러나지 않은 진실이 있을 수 있습니다." }, desc_en: { upright: "Intuition, unconscious, wisdom, mystery\n\nListen to your inner voice. The answer is already within you.", reversed: "Secrets, repressed emotions, superficial knowledge\n\nDo not ignore your emotions. There may be hidden truths." } },
    { id: 3, image: "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg", name_ko: "3. 여황제 (The Empress)", name_en: "3. The Empress", desc_ko: { upright: "풍요, 모성애, 자연, 예술\n\n창조적인 에너지가 넘치는 시기입니다. 당신의 아이디어를 현실로 풍성하게 피워내세요.", reversed: "의존, 사치, 게으름\n\n편안함에 안주하여 성장을 멈추지 않도록 주의하세요." }, desc_en: { upright: "Abundance, maternal love, nature, art\n\nA time full of creative energy. Blossom your ideas into reality abundantly.", reversed: "Dependence, luxury, laziness\n\nBe careful not to stop growing by settling for comfort." } },
    { id: 4, image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg", name_ko: "4. 황제 (The Emperor)", name_en: "4. The Emperor", desc_ko: { upright: "권위, 구조, 통제, 아버지\n\n확실한 계획과 규율이 성공을 가져옵니다. 상황을 주도적으로 이끌어 가세요.", reversed: "지배, 고집, 규율 부족\n\n너무 권위적이거나 반대로 통제력을 잃지 않았는지 점검해보세요." }, desc_en: { upright: "Authority, structure, control, father figure\n\nClear plans and discipline bring success. Lead the situation proactively.", reversed: "Domination, stubbornness, lack of discipline\n\nCheck if you are being too authoritative or, conversely, losing control." } },
    { id: 5, image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg", name_ko: "5. 교황 (The Hierophant)", name_en: "5. The Hierophant", desc_ko: { upright: "전통, 가르침, 신념, 사회적 규범\n\n전통적인 방식이나 멘토의 조언을 따르는 것이 도움이 될 수 있습니다.", reversed: "반항, 독창성, 새로운 믿음\n\n기존의 틀을 깨고 자신만의 길을 찾아야 할 때일지도 모릅니다." }, desc_en: { upright: "Tradition, teaching, belief, social norms\n\nFollowing traditional ways or advice from a mentor might be helpful.", reversed: "Rebellion, distinctiveness, new beliefs\n\nIt might be time to break the mold and find your own path." } },
    { id: 6, image: "https://upload.wikimedia.org/wikipedia/commons/3/3a/RWS_Tarot_06_Lovers.jpg", name_ko: "6. 연인 (The Lovers)", name_en: "6. The Lovers", desc_ko: { upright: "사랑, 조화, 선택, 가치관의 일치\n\n중요한 선택의 기로에 서 있습니다. 당신의 마음이 진정으로 원하는 것을 따르세요.", reversed: "불화, 잘못된 선택, 유혹\n\n순간의 감정에 휩쓸려 잘못된 결정을 내리지 않도록 주의하세요." }, desc_en: { upright: "Love, harmony, choices, alignment of values\n\nYou are at a crossroads of an important choice. Follow what your heart truly desires.", reversed: "Disharmony, wrong choices, temptation\n\nBe careful not to make wrong decisions swept by momentary emotions." } },
    { id: 7, image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg", name_ko: "7. 전차 (The Chariot)", name_en: "7. The Chariot", desc_ko: { upright: "성공, 의지력, 행동, 승리\n\n망설이지 말고 목표를 향해 돌진하세요. 장애물을 극복하고 승리할 것입니다.", reversed: "통제 불능, 패배, 방향 상실\n\n너무 급하게 서두르지 마세요. 속도를 조절하고 방향을 재설정해야 합니다." }, desc_en: { upright: "Success, willpower, action, victory\n\nDo not hesitate and charge towards your goal. You will overcome obstacles and win.", reversed: "Lack of control, defeat, loss of direction\n\nDo not rush too much. You need to adjust your speed and reset your direction." } },
    { id: 8, image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg", name_ko: "8. 힘 (Strength)", name_en: "8. Strength", desc_ko: { upright: "용기, 인내, 동정심, 내면의 힘\n\n부드러움이 강함을 이깁니다. 인내심을 가지고 상황을 다스리세요.", reversed: "자기 의심, 유약함, 본능에 굴복\n\n자신감을 잃지 마세요. 당신은 생각보다 강한 사람입니다." }, desc_en: { upright: "Courage, patience, compassion, inner strength\n\nSoftness overcomes strength. Control the situation with patience.", reversed: "Self-doubt, weakness, succumbing to instincts\n\nDo not lose confidence. You are stronger than you think." } },
    { id: 9, image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg", name_ko: "9. 은둔자 (The Hermit)", name_en: "9. The Hermit", desc_ko: { upright: "성찰, 고독, 내면의 탐구, 인도\n\n잠시 멈춰 서서 자신을 돌아보는 시간이 필요합니다. 답은 내 안에 있습니다.", reversed: "고립, 외로움, 현실 도피\n\n너무 세상과 담을 쌓지 마세요. 다른 사람들의 도움을 받아들이는 것도 용기입니다." }, desc_en: { upright: "Reflection, solitude, inner exploration, guidance\n\nYou need time to pause and reflect on yourself. The answer is within.", reversed: "Isolation, loneliness, escapism\n\nDo not build a wall against the world perfectly. Accepting help from others is also courage." } },
    { id: 10, image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg", name_ko: "10. 운명의 수레바퀴 (Wheel of Fortune)", name_en: "10. Wheel of Fortune", desc_ko: { upright: "변화, 행운, 운명적인 전환점\n\n삶의 흐름이 바뀌고 있습니다. 다가오는 변화를 긍정적으로 받아들이세요.", reversed: "불운, 저항, 통제 불가능한 상황\n\n변화에 저항하기보다 유연하게 대처하는 지혜가 필요합니다." }, desc_en: { upright: "Change, good luck, fateful turning point\n\nThe flow of life is changing. Accept the coming changes positively.", reversed: "Bad luck, resistance, uncontrollable situation\n\nWisdom to cope flexibly rather than resisting change is needed." } },
    { id: 11, image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg", name_ko: "11. 정의 (Justice)", name_en: "11. Justice", desc_ko: { upright: "공정함, 진실, 인과응보, 균형\n\n모든 일에는 원인과 결과가 있습니다. 객관적이고 이성적인 판단이 필요한 때입니다.", reversed: "불공정, 편견, 회피\n\n자신의 책임을 회피하지 마세요. 진실을 마주해야 해결책이 보입니다." }, desc_en: { upright: "Fairness, truth, cause and effect, balance\n\nThere is a cause and effect in everything. It is time for objective and rational judgment.", reversed: "Unfairness, prejudice, avoidance\n\nDo not evade your responsibility. You must face the truth to see the solution." } },
    { id: 12, image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg", name_ko: "12. 매달린 사람 (The Hanged Man)", name_en: "12. The Hanged Man", desc_ko: { upright: "희생, 새로운 관점, 정지, 기다림\n\n지금은 멈춰야 할 때입니다. 한 걸음 물러서서 세상을 다르게 바라보세요.", reversed: "무의미한 희생, 고집, 정체\n\n변화하지 않으려는 고집이 당신을 묶어두고 있을 수 있습니다." }, desc_en: { upright: "Sacrifice, new perspective, suspension, waiting\n\nIt is time to stop. Step back and look at the world differently.", reversed: "Meaningless sacrifice, stubbornness, stagnation\n\nStubbornness not to change might be holding you back." } },
    { id: 13, image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg", name_ko: "13. 죽음 (Death)", name_en: "13. Death", desc_ko: { upright: "종결, 새로운 시작, 변화, 이별\n\n끝은 곧 새로운 시작입니다. 낡은 것을 버려야 새 것이 들어올 자리가 생깁니다.", reversed: "변화에 대한 저항, 미련, 정체\n\n과거에 얽매이지 마세요. 놓아주어야 할 때입니다." }, desc_en: { upright: "End, new beginning, transformation, parting\n\nThe end is a new beginning. You must discard the old to make room for the new.", reversed: "Resistance to change, attachment, stagnation\n\nDo not be tied to the past. It is time to let go." } },
    { id: 14, image: "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg", name_ko: "14. 절제 (Temperance)", name_en: "14. Temperance", desc_ko: { upright: "균형, 조화, 인내, 중용\n\n극단적인 선택을 피하고 균형을 찾으세요. 조화로운 타협이 최선입니다.", reversed: "불균형, 과도함, 성급함\n\n지나침은 모자람만 못합니다. 욕심을 내려놓고 평정심을 찾으세요." }, desc_en: { upright: "Balance, harmony, patience, moderation\n\nAvoid extreme choices and find balance. Harmonious compromise is the best.", reversed: "Imbalance, excess, impatience\n\nToo much is worse than too little. Let go of greed and find composure." } },
    { id: 15, image: "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg", name_ko: "15. 악마 (The Devil)", name_en: "15. The Devil", desc_ko: { upright: "중독, 속박, 욕망, 유혹\n\n자신을 옭아매는 건강하지 못한 집착이나 유혹에서 벗어나야 합니다.", reversed: "해방, 속박에서 벗어남, 자각\n\n드디어 쇠사슬을 끊을 힘이 생겼습니다. 자유를 향해 나아가세요." }, desc_en: { upright: "Addiction, bondage, desire, temptation\n\nYou need to break free from unhealthy obsessions or temptations that bind you.", reversed: "Liberation, breaking free, realization\n\nYou finally have the strength to break the chains. Move towards freedom." } },
    { id: 16, image: "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg", name_ko: "16. 탑 (The Tower)", name_en: "16. The Tower", desc_ko: { upright: "갑작스런 변화, 붕괴, 재난, 깨달음\n\n견고해 보이던 것이 무너질 수 있습니다. 하지만 이는 더 튼튼한 기초를 쌓을 기회입니다.", reversed: "재난 모면, 두려움, 변화 거부\n\n피할 수 없는 변화를 억지로 막으려 하지 마세요. 받아들이는 것이 덜 고통스럽습니다." }, desc_en: { upright: "Sudden change, collapse, disaster, awakening\n\nWhat seemed solid might collapse. But this is an opportunity to build a stronger foundation.", reversed: "Averting disaster, fear, resisting change\n\nDo not try to force a stop to inevitable changes. Accepting it is less painful." } },
    { id: 17, image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg", name_ko: "17. 별 (The Star)", name_en: "17. The Star", desc_ko: { upright: "희망, 영감, 평온, 치유\n\n어두운 밤하늘에 별이 떴습니다. 희망을 잃지 않는다면 꿈은 이루어집니다.", reversed: "절망, 실망, 믿음 부족\n\n스스로를 믿지 못하고 있군요. 긍정적인 마음을 되찾으세요." }, desc_en: { upright: "Hope, inspiration, serenity, healing\n\nA star has risen in the dark night sky. Dreams come true if you don't lose hope.", reversed: "Despair, disappointment, lack of faith\n\nYou are not believing in yourself. Regain a positive mind." } },
    { id: 18, image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg", name_ko: "18. 달 (The Moon)", name_en: "18. The Moon", desc_ko: { upright: "불안, 환상, 무의식, 혼란\n\n앞이 잘 보이지 않는 시기입니다. 겉모습에 속지 말고 직관을 믿으세요.", reversed: "혼란 해소, 진실이 드러남, 공포 극복\n\n안개가 걷히고 진실이 드러나기 시작합니다. 막연한 두려움에서 벗어날 수 있습니다." }, desc_en: { upright: "Anxiety, illusion, subconscious, confusion\n\nA time when things are unclear. Do not be deceived by appearances and trust your intuition.", reversed: "Clarity, truth revealed, overcoming fear\n\nThe fog is lifting and the truth begins to reveal itself. You can escape vague fears." } },
    { id: 19, image: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg", name_ko: "19. 태양 (The Sun)", name_en: "19. The Sun", desc_ko: { upright: "성공, 기쁨, 활력, 긍정\n\n모든 것이 밝게 빛나는 최고의 시기입니다. 당신의 성공을 즐기세요!", reversed: "일시적 우울, 성공 지연\n\n구름이 잠시 태양을 가렸을 뿐입니다. 곧 다시 밝아질 것입니다." }, desc_en: { upright: "Success, joy, vitality, positivity\n\nThe best time when everything shines brightly. Enjoy your success!", reversed: "Temporary depression, delayed success\n\nClouds have only briefly covered the sun. It will brighten up again soon." } },
    { id: 20, image: "https://upload.wikimedia.org/wikipedia/commons/d/d0/RWS_Tarot_20_Judgement.jpg", name_ko: "20. 심판 (Judgement)", name_en: "20. Judgement", desc_ko: { upright: "부활, 각성, 결과, 새로운 소명\n\n과거의 노력에 대한 보상을 받을 때입니다. 중요한 결단이 필요합니다.", reversed: "후회, 주저함, 자기 비판\n\n과거에 얽매여 앞으로 나아가지 못하고 있습니다. 털어내고 일어나세요." }, desc_en: { upright: "Rebirth, awakening, outcome, inner calling\n\nIt is time to be rewarded for past efforts. An important decision is needed.", reversed: "Regret, hesitation, self-criticism\n\nYou are tied to the past and cannot move forward. Shake it off and stand up." } },
    { id: 21, image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg", name_ko: "21. 세계 (The World)", name_en: "21. The World", desc_ko: { upright: "완성, 성취, 조화, 해피엔딩\n\n하나의 여정이 성공적으로 끝났습니다. 완벽한 조화와 만족을 누리세요.", reversed: "미완성, 지연, 부족함\n\n목표에 거의 도달했지만 조금 부족합니다. 마지막 한 조각을 찾아야 합니다." }, desc_en: { upright: "Completion, accomplishment, harmony, happy ending\n\nOne journey has ended successfully. Enjoy perfect harmony and satisfaction.", reversed: "Incompletion, delay, lack\n\nYou almost reached the goal but something is missing. You need to find the last piece." } }
];

/* =========================================
   1. GLOBAL & TAB MANAGEMENT (SPA)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initLotto();
    initMbti();
    initReactionGame();
    initDarkMode();
    initTarot();
});

function initTabs() {
    const tabs = ['luck', 'decision', 'ability', 'tarot'];
    
    tabs.forEach(tab => {
        const btn = document.getElementById(`btn-${tab}`);
        if(btn) btn.addEventListener('click', () => switchTab(tab));
    });
}

function switchTab(activeTab) {
    const tabs = ['luck', 'decision', 'ability', 'tarot'];
    
    // Reset all
    tabs.forEach(tab => {
        const sec = document.getElementById(`${tab}-section`);
        const btn = document.getElementById(`btn-${tab}`);
        if(sec) sec.classList.remove('active');
        if(btn) btn.classList.remove(`active-${tab}`);
    });

    // Activate target
    const targetSec = document.getElementById(`${activeTab}-section`);
    const targetBtn = document.getElementById(`btn-${activeTab}`);
    if(targetSec) targetSec.classList.add('active');
    if(targetBtn) targetBtn.classList.add(`active-${activeTab}`);
}

/* =========================================
   5. TAROT LOGIC
   ========================================= */
function initTarot() {
    const btn = document.getElementById('tarot-draw-btn');
    if(btn) btn.addEventListener('click', drawCard);
}

function drawCard() {
    const cardEl = document.getElementById('tarot-card');
    const imageEl = document.getElementById('tarot-image');
    const nameEl = document.getElementById('tarot-name');
    const resultArea = document.getElementById('tarot-result');
    const drawBtn = document.getElementById('tarot-draw-btn');
    
    if(!cardEl || !imageEl) return;

    // Reset State
    resultArea.classList.add('hidden');
    cardEl.classList.remove('flipped');
    drawBtn.disabled = true;
    
    // Random Selection
    const cardIndex = Math.floor(Math.random() * TAROT_DATA.length);
    const isReversed = Math.random() < 0.3; // 30% chance of reversed
    const cardData = TAROT_DATA[cardIndex];

    // Wait for flip back animation if it was already flipped (optional optimization)
    // For now, we just update content after a short delay to simulate "shuffling/drawing"
    
    setTimeout(() => {
        // Prepare content
        const lang = getLang();
        const orientationText = isReversed ? 
            (lang === 'ko' ? '역방향 (Reversed)' : 'Reversed') : 
            (lang === 'ko' ? '정방향 (Upright)' : 'Upright');
        
        const orientationClass = isReversed ? 'rotate-180 mb-2' : ''; // CSS class for image rotation if needed
        
        // Update DOM
        imageEl.src = cardData.image;
        imageEl.style.transform = isReversed ? 'rotate(180deg)' : 'rotate(0deg)'; // Rotate image for reversed
        
        if (lang === 'ko') {
            nameEl.textContent = cardData.name_ko;
            document.getElementById('tarot-desc').textContent = isReversed ? cardData.desc_ko.reversed : cardData.desc_ko.upright;
            document.getElementById('tarot-orientation').textContent = orientationText;
        } else {
            nameEl.textContent = cardData.name_en;
            document.getElementById('tarot-desc').textContent = isReversed ? cardData.desc_en.reversed : cardData.desc_en.upright;
            document.getElementById('tarot-orientation').textContent = orientationText;
        }

        // Color badge for orientation
        const badge = document.getElementById('tarot-orientation');
        if (badge) {
            badge.className = isReversed 
                ? 'text-xs font-bold px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 shadow-sm' 
                : 'text-xs font-bold px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 shadow-sm';
        }

        // Trigger Flip
        cardEl.classList.add('flipped');
        
        // Show result after animation
        setTimeout(() => {
            resultArea.classList.remove('hidden');
            resultArea.classList.add('animate-fadeIn');
            drawBtn.disabled = false;
            const shareContainer = document.getElementById('tarot-share-container');
            if(shareContainer) { shareContainer.classList.remove('hidden'); shareContainer.classList.add('flex'); }
        }, 600); // Sync with CSS transition
    }, 200);
}


/* =========================================
   2. LOTTO GENERATOR LOGIC (Luck)
   ========================================= */
function initLotto() {
    const generateBtn = document.getElementById('lotto-gen-btn');
    const saveBtn = document.getElementById('lotto-save-btn');
    const clearBtn = document.getElementById('lotto-clear-btn');
    if(generateBtn) generateBtn.addEventListener('click', generateLotto);
    if(saveBtn) saveBtn.addEventListener('click', saveLottoHistory);
    if(clearBtn) clearBtn.addEventListener('click', clearLottoHistory);
    
    renderLottoHistory();
}

function clearLottoHistory() {
    const lang = getLang();
    if(!confirm(lang === 'ko' ? '모든 기록을 삭제하시겠습니까?' : 'Clear all history?')) return;
    
    localStorage.removeItem(LOTTO_STORAGE_KEY);
    renderLottoHistory();
}

// Global state for Lotto
let currentLottoNumbers = [];
const LOTTO_STORAGE_KEY = 'dailyPick_lotto_v1';

function generateLotto() {
    const lang = getLang();
    const R = RESOURCES[lang].lotto;

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
        alert(R.rangeError); return;
    }
    if (includeVal && excludeVals.includes(includeVal)) {
        alert(R.includeError); return;
    }
    if (new Set(excludeVals).size !== excludeVals.length) {
        alert(R.duplicateError); return;
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
            alert(R.ratioError); return;
        }
        
        const oddPool = pool.filter(n => n % 2 !== 0);
        const evenPool = pool.filter(n => n % 2 === 0);

        if (oddPool.length < needOdd || evenPool.length < needEven) {
            alert(R.emptyError); return;
        }

        finalNumbers = [...result, ...shuffle(oddPool).slice(0, needOdd), ...shuffle(evenPool).slice(0, needEven)];
    }

    finalNumbers.sort((a,b) => a-b);
    currentLottoNumbers = finalNumbers;
    renderBalls(finalNumbers);
    document.getElementById('lotto-save-btn').classList.remove('hidden');
    const shareContainer = document.getElementById('lotto-share-container');
    if(shareContainer) { shareContainer.classList.remove('hidden'); shareContainer.classList.add('flex'); }
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
    const lang = getLang();
    const R = RESOURCES[lang].lotto;
    const list = document.getElementById('lotto-history');
    if(!list) return;

    const history = JSON.parse(localStorage.getItem(LOTTO_STORAGE_KEY) || '[]');
    list.innerHTML = history.length ? '' : `<li class="text-sm text-gray-400">${R.historyEmpty}</li>`;
    history.forEach((item, idx) => {
        const li = document.createElement('li');
        li.className = 'flex justify-between text-sm py-1 border-b border-gray-100 dark:border-gray-700 dark:text-gray-300';
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

function initMbti() {
    const btn = document.getElementById('mbti-btn');
    if(btn) btn.addEventListener('click', recommendMbti);
}

function recommendMbti() {
    const lang = getLang();
    const R = RESOURCES[lang].mbti;
    const DATA = MBTI_DATA[lang];

    const mbti = document.getElementById('mbti-select').value;
    const category = document.getElementById('mbti-category').value;
    const resultArea = document.getElementById('mbti-result');
    
    if (!mbti) { alert(R.alert); return; }

    const data = DATA[mbti] || DATA['ENTP']; // default fallback
    let title, desc;

    if (category === 'food') {
        title = R.foodTitle(mbti);
        desc = `<strong class="text-xl text-purple-600 block mb-2">${data.food}</strong>${data.foodDesc}`;
    } else {
        title = R.tripTitle(mbti);
        desc = `<strong class="text-xl text-purple-600 block mb-2">${data.trip}</strong>${data.tripDesc}`;
    }

    resultArea.innerHTML = `
        <h3 class="font-bold text-gray-700 dark:text-gray-200 mb-2">${title}</h3>
        <p class="text-gray-600 dark:text-gray-400">${desc}</p>
    `;
    resultArea.classList.remove('hidden');
    resultArea.classList.add('animate-pulse');
    setTimeout(()=> resultArea.classList.remove('animate-pulse'), 500);
    const mbtiShareContainer = document.getElementById('mbti-share-container');
    if(mbtiShareContainer) { mbtiShareContainer.classList.remove('hidden'); mbtiShareContainer.classList.add('flex'); }
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
    const lang = getLang();
    const R = RESOURCES[lang].game;

    gameState = 'ready';
    screen.className = 'w-full h-64 rounded-xl flex flex-col justify-center items-center text-white font-bold text-xl mb-4 ready';
    screen.innerHTML = R.ready;
    if(resultText) resultText.classList.add('hidden');
    
    const randomTime = Math.floor(Math.random() * 2000) + 1000; // 1~3s
    timeoutId = setTimeout(() => {
        gameState = 'now';
        screen.className = 'w-full h-64 rounded-xl flex flex-col justify-center items-center text-white font-bold text-xl mb-4 now';
        screen.innerHTML = R.now;
        startTime = new Date().getTime();
    }, randomTime);
}

function endGameTooEarly() {
    const lang = getLang();
    const R = RESOURCES[lang].game;

    clearTimeout(timeoutId);
    gameState = 'waiting';
    screen.className = 'w-full h-64 rounded-xl flex flex-col justify-center items-center text-white font-bold text-xl mb-4 bg-orange-500';
    screen.innerHTML = R.tooEarly;
}

function endGameSuccess() {
    const lang = getLang();
    const R = RESOURCES[lang].game;

    const endTime = new Date().getTime();
    const diff = endTime - startTime;
    reactionHistory.push(diff);
    
    gameState = 'finished';
    screen.className = 'w-full h-64 rounded-xl flex flex-col justify-center items-center text-white font-bold text-xl mb-4 waiting';
    screen.innerHTML = R.result(diff);
    
    // Stats
    const avg = Math.floor(reactionHistory.reduce((a,b)=>a+b, 0) / reactionHistory.length);
    let rank = '';
    if (avg < 200) rank = R.ranks.pro;
    else if (avg < 300) rank = R.ranks.fast;
    else if (avg < 400) rank = R.ranks.avg;
    else rank = R.ranks.training;

    if(resultText) {
        resultText.innerHTML = R.stats(diff, avg, reactionHistory.length, rank);
        resultText.classList.remove('hidden');
    }
    const rShareContainer = document.getElementById('reaction-share-container');
    if(rShareContainer) { rShareContainer.classList.remove('hidden'); rShareContainer.classList.add('flex'); }
}

function resetGame() {
    // Only resets state for loop, history persists within session
}

/* =========================================
   6. SOCIAL SHARE FUNCTIONALITY
   ========================================= */

function getLang() {
    return document.documentElement.lang || 'ko';
}

// Kakao SDK Init Placeholder
if (typeof Kakao !== 'undefined' && !Kakao.isInitialized()) {
    Kakao.init('c089c8172def97eb00c07217cae17495'); // placeholder key
}

function shareKakao(title, text, urlPath) {
    const shareUrl = window.location.origin + urlPath;
    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: title,
                description: text,
                imageUrl: window.location.origin + '/assets/og-image.png',
                link: {
                    mobileWebUrl: shareUrl,
                    webUrl: shareUrl,
                },
            },
            buttons: [
                {
                    title: getLang() === 'ko' ? '결과 확인하기' : 'Check Results',
                    link: {
                        mobileWebUrl: shareUrl,
                        webUrl: shareUrl,
                    },
                },
            ],
        });
    } else {
        alert(getLang() === 'ko' ? '카카오톡 공유 기능이 준비되지 않았습니다.' : 'Kakao Share feature is not ready.');
    }
}

function shareTwitter(title, text, urlPath) {
    const shareUrl = window.location.origin + urlPath;
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title + '\n' + text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(intentUrl, '_blank', 'width=550,height=400');
}

function copyLink(title, text, urlPath) {
    const shareUrl = window.location.origin + urlPath;
    navigator.clipboard.writeText(`${title}\n${text}\n${shareUrl}`).then(() => {
        const lang = getLang();
        alert(lang === 'ko' ? '링크가 복사되었습니다!' : 'Link copied!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        const lang = getLang();
        alert(lang === 'ko' ? '링크 복사에 실패했습니다.' : 'Failed to copy link.');
    });
}

function bindShareButtons(prefix, getShareContent) {
    const kakaoBtn = document.getElementById(`${prefix}-share-kakao`);
    const twitterBtn = document.getElementById(`${prefix}-share-twitter`);
    const linkBtn = document.getElementById(`${prefix}-share-link`);

    if (kakaoBtn) kakaoBtn.addEventListener('click', () => {
        const c = getShareContent(); shareKakao(c.title, c.text, c.path);
    });
    if (twitterBtn) twitterBtn.addEventListener('click', () => {
        const c = getShareContent(); shareTwitter(c.title, c.text, c.path);
    });
    if (linkBtn) linkBtn.addEventListener('click', () => {
        const c = getShareContent(); copyLink(c.title, c.text, c.path);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Lotto Share
    bindShareButtons('lotto', () => {
        const lang = getLang();
        const title = lang === 'ko' ? '나의 행운의 로또 번호 ✨' : 'My Lucky Lotto Numbers ✨';
        const text = lang === 'ko' 
            ? `제가 방금 뽑은 로또 번호는 [${currentLottoNumbers.join(', ')}] 입니다! 통계 기반으로 여러분의 번호도 뽑아보세요.`
            : `My lucky numbers are [${currentLottoNumbers.join(', ')}]! Try generating yours using statistics.`;
        return { title, text, path: '/lotto.html' };
    });

    // MBTI Share
    bindShareButtons('mbti', () => {
        const lang = getLang();
        const mbti = document.getElementById('mbti-select').value;
        const title = lang === 'ko' ? `${mbti} 맞춤 추천 결과 🧭` : `${mbti} Recommendation Result 🧭`;
        const text = lang === 'ko' 
            ? `제 MBTI(${mbti})에 딱 맞는 결과를 추천받았어요! 여러분의 선택도 AI에게 맡겨보세요.`
            : `I got a recommendation perfectly matching my MBTI(${mbti})! Leave your decisions to our AI.`;
        return { title, text, path: '/mbti-food.html' };
    });

    // Tarot Share
    bindShareButtons('tarot', () => {
        const lang = getLang();
        const cardNameEl = document.getElementById('tarot-name');
        const cardName = cardNameEl ? cardNameEl.textContent : '';
        const title = lang === 'ko' ? `오늘 나의 타로 카드: ${cardName} 🔮` : `My Tarot Card Today: ${cardName} 🔮`;
        const text = lang === 'ko'
            ? `오늘 저의 타로 점괘는 '${cardName}' 입니다! 지금 바로 여러분의 운명을 무료로 확인해보세요.`
            : `My tarot reading today is '${cardName}'! Check your destiny for free now.`;
        return { title, text, path: '/tarot.html' };
    });

    // Reaction Share
    bindShareButtons('reaction', () => {
        const lang = getLang();
        const avg = reactionHistory.length ? Math.floor(reactionHistory.reduce((a,b)=>a+b, 0) / reactionHistory.length) : 0;
        const title = lang === 'ko' ? `나의 반응속도 테스트 결과 ⚡` : `My Reaction Speed Test Result ⚡`;
        const text = lang === 'ko'
            ? `제 반응속도는 평균 ${avg}ms 입니다! 상위 1% 프로게이머 수준에 도전해보시겠어요?`
            : `My average reaction time is ${avg}ms! Can you beat the top 1% pro gamer level?`;
        return { title, text, path: '/reaction-test.html' };
    });
});

