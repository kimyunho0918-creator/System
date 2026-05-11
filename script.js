// ==========================================
// 🛠️ 환경 설정 및 관리자 데이터
// ==========================================

const OPERATOR_CODES = {
    '1004': '운영팀1',
    '2004': '운영팀2',
    '3004': '운영팀3',
    '7777': '부장(최고관리자)'
};

// 🌟 각 게임 부스별 점수/단계 설정 데이터 🌟
const GAMES = [
    { 
        id: 'game1', 
        name: '⌨️ 가게 운영 시뮬레이션 with 커리어 엑스포',
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
        name: '💡 역전 재판 with 인플루언스',
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
            { name: '상장폐지 (참가상)', points: 50 },
            { name: '원금 방어', points: 150 },
            { name: '수익 달성', points: 300 },
            { name: '상한가 (떡상)', points: 600 }
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

// 상점 아이템 및 재고 설정
const SHOP_ITEMS = [
    { id: 'item1', name: '🍬 마이쮸', price: 500, stock: 5, sellStatus: 1 },         
    { id: 'item2', name: '🐻 하리보 젤리', price: 800, stock: 3, sellStatus: 1 },        
    { id: 'item3', name: '🧃 탄산 음료수', price: 1500, stock: 2, sellStatus: 1 },        
    { id: 'item4', name: '🍦 아이스크림', price: 3000, stock: 1, sellStatus: 1 },        
    { id: 'item6', name: '🎰 슬롯머신 이용권', price: 0, stock: 3, sellStatus: 1, isVariablePrice: true } 
];
