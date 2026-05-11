// ==========================================
// 🛠️ [기본 설정 구역] 🛠️
// ==========================================

const OPERATOR_CODES = {
    '1004': '운영팀1',
    '2004': '운영팀2',
    '3004': '운영팀3',
    '7777': '부장(최고관리자)'
};

const GAMES = [
    { id: 'game1', name: '⌨️ 가게 운영 시뮬레이션 with 커리어 엑스포' },
    { id: 'game2', name: '💡 역전 재판 with 인플루언스' },
    { id: 'game3', name: '🎯 모의 주식' },
    { id: 'game4', name: '🏃 미니 올림픽' },
    { id: 'game_slot', name: '🎰 슬롯머신', isSlot: true }
];

// 🌟 상품 설정 (슬롯머신 재고 3회 제한 적용) 🌟
const SHOP_ITEMS = [
    { id: 'item1', name: '🍬 마이쮸', price: 500, stock: 5, sellStatus: 1 },         
    { id: 'item2', name: '🐻 하리보 젤리', price: 800, stock: 3, sellStatus: 1 },        
    { id: 'item3', name: '🧃 탄산 음료수', price: 1500, stock: 2, sellStatus: 1 },        
    { id: 'item4', name: '🍦 아이스크림', price: 3000, stock: 1, sellStatus: 1 },        
    { id: 'item6', name: '🎰 슬롯머신 이용권', price: 0, stock: 3, sellStatus: 1, isVariablePrice: true } 
];