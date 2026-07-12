// =========================================================================
// 1. 🛠️ 환경 설정 (비밀번호와 관리자 이름, 게임 종류, 상점 아이템)
// =========================================================================

// 비밀번호와 관리자 이름 매칭 (기록에 남을 이름)
const OPERATOR_CODES = {
    '1004': '1학년 운영팀',
    '2004': '2학년 운영팀',
    '0918': '김윤호',
    '3117': '유하준',
    '0929': '민준원',
    '0813': '권대영',
    '2222': 'ㅁㅁㅁ',
    '3333': 'ㅂㅂㅂ'
};

// 각 게임 부스별 점수/단계 설정
const GAMES = [
    { 
        id: 'game1', 
        name: '⌨️ 가게 운영 시뮬레이션',
        tiers: [
            { name: '💀 빚더미 파산', points: 100 }, 
            { name: '😥 눈물의 폐업', points: 300 }, 
            { name: '💼 훌륭한 방어전', points: 500 }, 
            { name: '🌟 골목 상권의 지배자', points: 1000 }, 
            { name: '🔥 프랜차이즈 대표', points: 1500 }, 
            { name: '👑 장사의 신', points: 2000 }
        ]
    },
    { 
        id: 'game2', 
        name: '💡 역전 재판',
        tiers: [
            { name: '패소 (참가상)', points: 50 },
            { name: '일부 승소', points: 200 },
            { name: '완벽한 무죄 판결', points: 500 }
        ]
    },
    { 
        id: 'game3', 
        name: '🎯 모의 주식',
        tiers: [
            { name: '💀 한강 지망생', points: 100},
            { name: '💼 본전 개미', points: 300 },
            { name: '🌟 성공한 투자자', points: 500 },
            { name: '🔥 워렌 버핏', points: 1000 },
            { name: '👑 주식의 신', points: 3000 }
        ]
    },
    { 
        id: 'game4', 
        name: '🏃 미니 올림픽',
        tiers: [
            { name: '참가상', points: 50 },
            { name: '동메달', points: 200 },
            { name: '은메달', points: 400 },
            { name: '금메달', points: 700 },
            { name: '올림픽 신기록', points: 1000 }
        ]
    },
    { 
        id: 'game_slot', 
        name: '🎰 슬롯머신 (자율입력)', 
        isSlot: true 
    }
];

const SHOP_ITEMS = [
    { id: 'item1', name: '🍬 마이쮸', price: 1000, stock: 5, sellStatus: 1 },                
    { id: 'item3', name: '🧃 탄산 음료수', price: 3000, stock: 2, sellStatus: 1 },        
    { id: 'item4', name: '🍦 아이스크림', price: 7000, stock: 1, sellStatus: 1 },        
    // 슬롯머신 숨김 처리 (isHidden: true)
    { id: 'item6', name: '🎰 슬롯머신 이용권', price: 0, stock: 3, sellStatus: 1, isVariablePrice: true, isHidden: true } 
];

// 🌟 히든 상점 (슬롯머신) 해제용 글로벌 변수 설정 🌟
let isSlotUnlocked = localStorage.getItem('isSlotUnlocked') === 'true';
const SECRET_UNLOCK_CODE = "1336";
