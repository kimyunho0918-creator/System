// ==========================================
// 1. 🛠️ [기본 환경 설정 데이터] 🛠️
// ==========================================

const OPERATOR_CODES = {
    '1004': '운영팀1',
    '2004': '운영팀2',
    '3004': '운영팀3',
    '7777': '부장(최고관리자)'
};

// 🌟 각 게임별 점수 지급 단계 커스터마이징 🌟
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
        name: '🎰 슬롯머신', 
        isSlot: true // 슬롯머신은 직접 입력 방식 유지
    }
];

const SHOP_ITEMS = [
    { id: 'item1', name: '🍬 마이쮸', price: 500, stock: 5, sellStatus: 1 },         
    { id: 'item2', name: '🐻 하리보 젤리', price: 800, stock: 3, sellStatus: 1 },        
    { id: 'item3', name: '🧃 탄산 음료수', price: 1500, stock: 2, sellStatus: 1 },        
    { id: 'item4', name: '🍦 아이스크림', price: 3000, stock: 1, sellStatus: 1 },        
    { id: 'item6', name: '🎰 슬롯머신 이용권', price: 0, stock: 3, sellStatus: 1, isVariablePrice: true } 
];


// ==========================================
// 2. 🌟 [전역 변수 및 모달 로직] 🌟
// ==========================================
let currentUser = null;
let localStock = {}; 
let currentGroupedInventory = []; 

function closeCustomModal() {
    document.getElementById('customModal').classList.remove('active');
    document.getElementById('modalInput').value = ''; 
    document.getElementById('modalSliderWrap').style.display = 'none';
}

function customAlert(message, type = 'info') {
    const titles = { error: '⚠️ 오류 발생', success: '✅ 처리 완료', info: '💡 알림' };
    const confirmBtn = document.getElementById('modalConfirmBtn');
    
    document.getElementById('modalTitle').className = 'modal-title ' + type;
    document.getElementById('modalTitle').innerText = titles[type];
    document.getElementById('modalMessage').innerHTML = message;
    
    document.getElementById('modalInput').style.display = 'none';
    document.getElementById('modalCancelBtn').style.display = 'none';
    
    confirmBtn.className = 'modal-btn confirm';
    confirmBtn.onclick = closeCustomModal;
    
    document.getElementById('customModal').classList.add('active');
}

function customConfirm(message, callback) {
    const confirmBtn = document.getElementById('modalConfirmBtn');
    
    document.getElementById('modalTitle').className = 'modal-title info';
    document.getElementById('modalTitle').innerText = '❓ 확인';
    document.getElementById('modalMessage').innerHTML = message;
    
    document.getElementById('modalInput').style.display = 'none';
    document.getElementById('modalCancelBtn').style.display = 'block';
    
    confirmBtn.className = 'modal-btn confirm';
    
    document.getElementById('modalCancelBtn').onclick = () => {
        closeCustomModal();
        if(callback) callback(false);
    };
    confirmBtn.onclick = () => {
        closeCustomModal();
        if(callback) callback(true);
    };
    
    document.getElementById('customModal').classList.add('active');
}

function customPrompt(message, callback, inputType = 'password', placeholder = '비밀번호 입력') {
    const inputElem = document.getElementById('modalInput');
    const confirmBtn = document.getElementById('modalConfirmBtn');
    
    document.getElementById('modalTitle').className = 'modal-title ' + (inputType === 'password' ? 'error' : 'info');
    document.getElementById('modalTitle').innerText = inputType === 'password' ? '🔐 운영자 인증' : '💸 수량/금액 입력';
    document.getElementById('modalMessage').innerHTML = message;
    
    inputElem.type = inputType;
    inputElem.placeholder = placeholder;
    inputElem.style.display = 'block';
    document.getElementById('modalCancelBtn').style.display = 'block';
    
    confirmBtn.className = 'modal-btn confirm ' + (inputType === 'password' ? 'danger' : ''); 
    
    document.getElementById('modalCancelBtn').onclick = () => {
        closeCustomModal();
        if(callback) callback(null);
    };
    confirmBtn.onclick = () => {
        const val = inputElem.value;
        closeCustomModal();
        if(callback) callback(val);
    };
    
    document.getElementById('customModal').classList.add('active');
    setTimeout(() => inputElem.focus(), 100);
}

function customSliderPrompt(message, maxCount, callback) {
    const sliderWrap = document.getElementById('modalSliderWrap');
    const slider = document.getElementById('modalSlider');
    const sliderValueDisplay = document.getElementById('modalSliderValue');
    const confirmBtn = document.getElementById('modalConfirmBtn');
    
    document.getElementById('modalTitle').className = 'modal-title info';
    document.getElementById('modalTitle').innerText = '🎚️ 수량 선택';
    document.getElementById('modalMessage').innerHTML = message;
    
    document.getElementById('modalInput').style.display = 'none';
    document.getElementById('modalCancelBtn').style.display = 'block';
    sliderWrap.style.display = 'block';
    
    slider.min = 1;
    slider.max = maxCount;
    slider.value = 1;
    sliderValueDisplay.innerText = '1개';
    
    slider.oninput = function() {
        sliderValueDisplay.innerText = this.value + '개';
    };
    
    confirmBtn.className = 'modal-btn confirm'; 
    
    document.getElementById('modalCancelBtn').onclick = () => {
        closeCustomModal();
        if(callback) callback(null);
    };
    confirmBtn.onclick = () => {
        const val = parseInt(slider.value);
        closeCustomModal();
        if(callback) callback(val);
    };
    
    document.getElementById('customModal').classList.add('active');
}


// ==========================================
// 3. 🌟 [관리자 모드] 🌟
// ==========================================
function openAdminPanel() {
    if (currentUser && currentUser.isAdmin) {
        document.getElementById('adminOverlay').classList.add('active');
    } else {
        customPrompt(`최고 관리자(부장) 전용 메뉴입니다.<br>비밀번호 4자리를 입력하세요.`, (pwd) => {
            if(pwd === null) return;
            if(pwd === '7777') { 
                document.getElementById('adminOverlay').classList.add('active');
            } else {
                customAlert('최고 관리자 권한이 없습니다.', 'error');
            }
        });
    }
}

function closeAdminPanel() {
    document.getElementById('adminOverlay').classList.remove('active');
}

function adminResetUser() {
    customConfirm('현재 기기의 모든 학생 데이터와 보관함을 지우고 완전 초기화하시겠습니까?<br><span style="color:#ff3366; font-size:0.85rem;">(복구 불가능)</span>', (ok) => {
        if(ok) {
            localStorage.removeItem('festivalUser');
            localStorage.removeItem('festivalStock');
            location.reload(); 
        }
    });
}

function adminResetStock() {
    customConfirm('이 기기의 모든 상품 개인 재고를 초기 횟수로 복구하시겠습니까?', (ok) => {
        if(ok) {
            initLocalStock();
            renderShop();
            saveData();
            closeAdminPanel();
            customAlert('재고가 완벽하게 복구되었습니다.', 'success');
        }
    });
}

function adminAdjustPoints() {
    customPrompt('부여할 포인트를 입력하세요.<br><span style="color:#aaa; font-size:0.8rem;">(차감 시 숫자 앞에 - 를 붙이세요)</span>', (val) => {
        if(val === null) return;
        const pts = parseInt(val);
        if(isNaN(pts)) return customAlert('올바른 숫자를 입력해주세요.', 'error');

        currentUser.points += pts;
        saveData();
        updateUI();
        closeAdminPanel();
        customAlert(`성공적으로 <b>${pts}P</b>가 강제 적용되었습니다.`, 'success');
    }, 'number', '포인트 조작');
}


// ==========================================
// 4. 🌟 [로그인 및 계정 시스템] 🌟
// ==========================================
window.onload = () => {
    initGameOptions();
    checkAutoLogin();
};

function checkAutoLogin() {
    const savedUser = localStorage.getItem('festivalUser');
    const savedStock = localStorage.getItem('festivalStock');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        if(savedStock) localStock = JSON.parse(savedStock);
        else initLocalStock();
        
        currentUser.isAdmin = (currentUser.studentId === '30109' && currentUser.name === '김윤호');
        
        document.getElementById('loginOverlay').style.display = 'none';
        renderShop();
        updateUI();
    } else {
        document.getElementById('loginOverlay').style.display = 'flex';
    }
}

function logout() {
    customConfirm('로그아웃 하시겠습니까?<br><span style="color:#aaa; font-size:0.8rem;">(동일한 학번으로 접속 시 데이터는 유지됩니다)</span>', (ok) => {
        if(ok) {
            document.getElementById('loginOverlay').style.display = 'flex';
            document.getElementById('stuId').value = '';
            document.getElementById('stuName').value = '';
        }
    });
}

function login() {
    const id = document.getElementById('stuId').value.trim();
    const name = document.getElementById('stuName').value.trim();
    if(!id || !name) return customAlert('학번과 이름을 모두 입력해주세요.', 'error');

    const isAdminAccount = (id === '30109' && name === '김윤호');
    const savedUser = localStorage.getItem('festivalUser');
    const savedStock = localStorage.getItem('festivalStock');
    
    if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.studentId === id) {
            currentUser = parsedUser;
            currentUser.name = name; 
            currentUser.isAdmin = isAdminAccount; 
            if(!currentUser.inventory) currentUser.inventory = []; 
            if(savedStock) localStock = JSON.parse(savedStock);
            else initLocalStock();
            
            finishLogin();
        } else {
            customConfirm(`이전에 로그인한 기록([${parsedUser.studentId}] ${parsedUser.name})이 있습니다.<br><br><span style="color:#ff3366;">새로운 학번으로 로그인하면 기존 포인트와 보관함이 모두 삭제됩니다.</span><br>진행하시겠습니까?`, (ok) => {
                if(ok) {
                    currentUser = { studentId: id, name: name, points: 0, inventory: [], isAdmin: isAdminAccount };
                    initLocalStock();
                    finishLogin();
                }
            });
        }
    } else {
        currentUser = { studentId: id, name: name, points: 0, inventory: [], isAdmin: isAdminAccount };
        initLocalStock();
        finishLogin();
    }
}

function finishLogin() {
    saveData();
    renderShop(); 
    document.getElementById('loginOverlay').style.display = 'none';
    updateUI();
}

function initLocalStock() {
    localStock = {};
    SHOP_ITEMS.forEach(item => {
        if(item.stock !== null) localStock[item.id] = item.stock;
    });
    localStorage.setItem('festivalStock', JSON.stringify(localStock));
}

function saveData() {
    localStorage.setItem('festivalUser', JSON.stringify(currentUser));
    localStorage.setItem('festivalStock', JSON.stringify(localStock));
    updateUI();
}

function updateUI() {
    const adminBadge = currentUser.isAdmin ? ' <span style="color:#ff3366; font-size:0.7em;">(최고관리자)</span>' : '';
    document.getElementById('userNameDisplay').innerHTML = `[${currentUser.studentId}] ${currentUser.name}${adminBadge}`;
    document.getElementById('pointDisplay').innerText = currentUser.points;
    document.getElementById('shopPointDisplay').innerText = currentUser.points;
    document.getElementById('adminBtn').style.display = currentUser.isAdmin ? 'block' : 'none';
    renderInventory(); 
}

function switchTab(tabName) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById('view-' + tabName).classList.add('active');
    document.getElementById('nav-' + tabName).classList.add('active');
    document.getElementById('gameAuthInput').value = '';
}


// ==========================================
// 5. 🎮 [게임 점수 부여 시스템 - 커스텀 패치] 🎮
// ==========================================
function initGameOptions() {
    const gameSelect = document.getElementById('gameSelect');
    GAMES.forEach(game => {
        let opt = document.createElement('option');
        opt.value = game.id;
        opt.innerText = game.name;
        gameSelect.appendChild(opt);
    });
    updateTierOptions();
}

function updateTierOptions() {
    const gameId = document.getElementById('gameSelect').value;
    const game = GAMES.find(g => g.id === gameId);
    const tierSelect = document.getElementById('tierSelect');
    const slotWrap = document.getElementById('slotPointInputWrap');
    const slotInput = document.getElementById('slotPointInput');

    tierSelect.innerHTML = '';

    if (game && game.isSlot) {
        tierSelect.style.display = 'none';
        slotWrap.style.display = 'block';
        slotInput.value = '';
    } else if (game && game.tiers) {
        // config에서 설정한 게임별 전용 단계 옵션을 불러옵니다.
        tierSelect.style.display = 'block';
        slotWrap.style.display = 'none';
        
        game.tiers.forEach(tier => {
            let opt = document.createElement('option');
            opt.value = tier.points;
            opt.innerText = `${tier.name} (+ ${tier.points}P)`;
            tierSelect.appendChild(opt);
        });
    } else {
        // 만약 tiers 정보가 없을 때를 대비한 기본 1~10단계
        tierSelect.style.display = 'block';
        slotWrap.style.display = 'none';
        for(let i = 1; i <= 10; i++) {
            let points = i * 100;
            let opt = document.createElement('option');
            opt.value = points;
            opt.innerText = i + '단계 성공 (+ ' + points + 'P)';
            tierSelect.appendChild(opt);
        }
    }
}

function giveGamePoints() {
    const gameId = document.getElementById('gameSelect').value;
    const game = GAMES.find(g => g.id === gameId);
    const authCode = document.getElementById('gameAuthInput').value;

    if(!authCode) return customAlert('운영자 비밀번호를 입력하세요.', 'error');
    if(!OPERATOR_CODES[authCode]) return customAlert('관리자 비밀번호가 틀렸습니다.', 'error');

    let points;
    if (game && game.isSlot) {
        const slotVal = parseInt(document.getElementById('slotPointInput').value);
        if (isNaN(slotVal) || slotVal <= 0) return customAlert('지급할 포인트를 올바르게 입력해주세요.', 'error');
        if (slotVal > 5000) return customAlert('슬롯머신 최대 지급 포인트는 <b>5,000P</b>입니다.', 'error');
        points = slotVal;
    } else {
        points = parseInt(document.getElementById('tierSelect').value);
    }

    currentUser.points += points;
    saveData();
    customAlert(`성공적으로 <b>${points}P</b>가 지급되었습니다!`, 'success');
    switchTab('home');
}


// ==========================================
// 6. 🛒 [상점 시스템] 🛒
// ==========================================
function renderShop() {
    const list = document.getElementById('shopList');
    list.innerHTML = '';

    SHOP_ITEMS.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'shop-item';
        
        const currentStock = localStock[item.id];
        const isOutOfStock = (item.sellStatus === 0) || (currentStock !== undefined && currentStock <= 0);

        if(isOutOfStock) itemDiv.classList.add('sold-out');

        let infoHtml = `<div class="shop-item-info">`;
        infoHtml += `<div class="item-name">${item.name}</div>`;
        
        if (item.isVariablePrice) infoHtml += `<div class="price variable">자율 충전 + 수수료(10%)</div>`;
        else infoHtml += `<div class="price">${item.price} P</div>`;

        if (currentStock !== undefined && item.sellStatus === 1) {
            const stockClass = currentStock <= 1 ? 'stock-info low' : 'stock-info';
            infoHtml += `<div class="${stockClass}">남은 수량: ${currentStock}개</div>`;
        } else if (item.stock === null && item.sellStatus === 1) {
            infoHtml += `<div class="stock-info">무제한 구매 가능</div>`;
        }
        infoHtml += `</div>`; 

        let actionHtml = `<div>`;
        if(isOutOfStock) actionHtml += `<div class="sold-out-badge">품절</div>`;
        else actionHtml += `<button class="btn-buy" onclick="buyItem('${item.id}')">구매</button>`;
        actionHtml += `</div>`;

        itemDiv.innerHTML = infoHtml + actionHtml;
        list.appendChild(itemDiv);
    });
}

function buyItem(itemId) {
    const item = SHOP_ITEMS.find(i => i.id === itemId);

    if (item.isVariablePrice) {
        customPrompt(
            `<b>[${item.name}]</b><br>게임에 투입할 포인트를 입력하세요.<br><span style="color:#aaa; font-size:0.8rem;">(입력하신 금액의 10%가 수수료로 추가 차감됩니다)</span>`, 
            (val) => {
                if (val === null) return;
                const betAmount = parseInt(val);
                if (isNaN(betAmount) || betAmount <= 0) return customAlert('올바른 금액(숫자)을 입력해주세요.', 'error');

                const fee = Math.round(betAmount * 0.1); 
                const totalCost = betAmount + fee; 

                if (currentUser.points < totalCost) return customAlert(`포인트가 부족합니다!<br><span style="color:#aaa; font-size:0.85rem;">(보유: ${currentUser.points}P / 총 필요: ${totalCost}P)</span>`, 'error');

                customConfirm(
                    `<b>[${item.name}]</b><br>충전 포인트: ${betAmount}P<br>수수료(10%): ${fee}P<br>
                    <hr style="border:0; border-top:1px dashed #555; margin:15px 0;">
                    총 결제 금액: <span style="color:#ff3366;">${totalCost}P</span><br><br>결제하시겠습니까?`, 
                    (isConfirmed) => {
                        if(isConfirmed) processPurchase(item, totalCost, `${item.name} <span style="color:#00ff88; font-size:0.9em;">(${betAmount}P)</span>`, 1);
                    }
                );
            }, 'number', '포인트 입력'
        );
        return;
    }

    if(currentUser.points < item.price) {
        return customAlert(`포인트가 부족합니다!<br><span style="color:#aaa; font-size:0.85rem;">(현재 보유: ${currentUser.points}P / 필요: ${item.price}P)</span>`, 'error');
    }

    let maxAffordable = Math.floor(currentUser.points / item.price);
    let currentStock = localStock[item.id] !== undefined ? localStock[item.id] : Infinity;
    let maxCanBuy = Math.min(maxAffordable, currentStock);

    if (maxCanBuy <= 0) return customAlert('구매할 수 없습니다.', 'error');

    if (maxCanBuy === 1) {
        customConfirm(`<b>[${item.name}]</b><br>상품을 구매하시겠습니까?<br><span style="color:#ff3366;">-${item.price}P</span>`, (isConfirmed) => {
            if(isConfirmed) processPurchase(item, item.price, item.name, 1);
        });
    } else {
        customSliderPrompt(`<b>[${item.name}]</b><br>몇 개를 구매하시겠습니까?<br><span style="color:#aaa; font-size:0.8rem;">(개당 ${item.price}P / 최대 구매 가능: ${maxCanBuy}개)</span>`, maxCanBuy, (qty) => {
            if(qty === null) return;
            const totalCost = item.price * qty;
            
            setTimeout(() => {
                customConfirm(`<b>[${item.name}] x ${qty}개</b><br>총 결제 금액: <span style="color:#ff3366;">${totalCost}P</span><br><br>결제하시겠습니까?`, (isConfirmed) => {
                    if(isConfirmed) processPurchase(item, totalCost, item.name, qty);
                });
            }, 400);
        });
    }
}

function processPurchase(item, deductPoints, displayName, qty = 1) {
    currentUser.points -= deductPoints;
    if (localStock[item.id] !== undefined) localStock[item.id] -= qty;

    for (let i = 0; i < qty; i++) {
        currentUser.inventory.push({ id: item.id, name: displayName, boughtAt: Date.now() });
    }

    saveData();
    renderShop(); 
    customAlert(`구매 성공! (${qty}개)<br>보관함에서 확인해주세요.`, 'success');
    switchTab('inv');
}


// ==========================================
// 7. 🎒 [보관함 시스템] 🎒
// ==========================================
function renderInventory() {
    const list = document.getElementById('inventoryList');
    list.innerHTML = '';

    if(currentUser.inventory.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:#777; margin-top:20px;">보관함이 비어있습니다.</p>';
        return;
    }

    currentGroupedInventory = [];
    currentUser.inventory.forEach((item) => {
        const existing = currentGroupedInventory.find(g => g.name === item.name);
        if(existing) existing.count++;
        else currentGroupedInventory.push({ name: item.name, count: 1 });
    });

    currentGroupedInventory.forEach((group, groupIndex) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inv-item';
        itemDiv.innerHTML = `
            <div class="inv-item-name">
                ${group.name} 
                <span style="color:var(--neon-cyan); margin-left:8px; font-size:1.1em;">x ${group.count}</span>
            </div>
            <button class="btn-use" onclick="useGroupItem(${groupIndex})">사용</button>
        `;
        list.appendChild(itemDiv);
    });
}

function useGroupItem(groupIndex) {
    const group = currentGroupedInventory[groupIndex];
    const name = group.name;
    const maxCount = group.count;

    if (maxCount === 1) {
        customPrompt(`해당 상품(1개)을 사용 처리합니다.<br>운영자 비밀번호 4자리를 입력하세요.`, (pwd) => {
            if(pwd === null) return;
            if(!OPERATOR_CODES[pwd]) return customAlert('관리자 비밀번호가 틀렸습니다.', 'error');
            
            const idx = currentUser.inventory.findIndex(i => i.name === name);
            if(idx > -1) currentUser.inventory.splice(idx, 1);
            
            saveData();
            customAlert('정상 처리되었습니다.', 'success');
        });
    } else {
        customSliderPrompt(`보유 수량: <b>${maxCount}개</b><br><br>사용할 수량을 스크롤하여 선택하세요.`, maxCount, (qty) => {
            if(qty === null) return;
            
            setTimeout(() => {
                customPrompt(`<b>${qty}개</b> 사용 처리합니다.<br>운영자 비밀번호 4자리를 입력하세요.`, (pwd) => {
                    if(pwd === null) return;
                    if(!OPERATOR_CODES[pwd]) return customAlert('관리자 비밀번호가 틀렸습니다.', 'error');
                    
                    for(let i = 0; i < qty; i++) {
                        const idx = currentUser.inventory.findIndex(item => item.name === name);
                        if(idx > -1) currentUser.inventory.splice(idx, 1);
                    }
                    
                    saveData();
                    customAlert(`총 ${qty}개가 정상 처리되었습니다.`, 'success');
                });
            }, 400); 
        });
    }
}