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
        name: '🔨 학교 강화하기',
        tiers: [
            { name: '1강 ~ 5강', points: 100 },
            { name: '6강 ~ 10강', points: 500 },
            { name: '11강 ~ 15강', points: 1500 },
            { name: '16강', points: 2000},
            { name: '17강', points: 3000},
            { name: '18강', points: 4000},
            { name: '19강', points: 5000},
            { name: '20강', points: 10000}
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
        name: '❄️ 얼불춤 🔥',
        tiers: [
            { name: '참가상', points: 50 },
            { name: '동메달', points: 200 },
            { name: '은메달', points: 400 },
            { name: '금메달', points: 700 },
            { name: '올림픽 신기록', points: 1000 }
        ]
    },
    { 
        id: 'game5', 
        name: '🌛 여기가 안방이야?!',
        tiers: [
            { name: '참가상', points: 50 },
            { name: '동메달', points: 200 },
            { name: '은메달', points: 400 },
            { name: '금메달', points: 700 },
            { name: '올림픽 신기록', points: 1000 }
        ]
    },
    // 👇 수정한 부분: ID 중복(game4)을 game6으로 해결하고, 자율입력을 명시했습니다.
    { 
        id: 'game6', 
        name: '🏢 타워 디펜스 (자율입력)', 
        isSlot: true 
    },
    { 
        id: 'game_slot', 
        name: '🎰 슬롯머신 (자율입력)', 
        isSlot: true 
    }
];

const SHOP_ITEMS = [
    { id: 'item1', name: '🍬 마이쮸', price: 1000, stock: 5, sellStatus: 1 },                
    { id: 'item2', name: '🧃 음료수',price:3000, stock: 1, sellStatus: 1},
    { id: 'item3', name: '🍦 아이스크림', price: 6000, stock: 1, sellStatus: 1 },        
    { id: 'item4', name: '🥤 탄산 음료수', price: 9000 , stock: 1, sellStatus: 1 },
    
    // 슬롯머신 숨김 처리 (isHidden: true)
    { id: 'item6', name: '🎰 슬롯머신 이용권', price: 0, stock: 3, sellStatus: 1, isVariablePrice: true, isHidden: true } 
];

// 🌟 히든 상점 (슬롯머신) 해제용 글로벌 변수 설정 🌟
let isSlotUnlocked = localStorage.getItem('isSlotUnlocked') === 'true';
const SECRET_UNLOCK_CODE = "1336";
