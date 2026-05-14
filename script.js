// =========================================================================
// 🌟 글로벌 변수 및 모달(팝업) 시스템
// =========================================================================
let currentUser = null;
let localStock = {}; 
let currentGroupedInventory = []; 

// 엔터키 지원 함수
function handleLoginEnter(e) {
    if (e.key === 'Enter') login();
}
function handleGamePointEnter(e) {
    if (e.key === 'Enter') giveGamePoints();
}

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
    
    // 모달창 엔터키 지원
    inputElem.onkeypress = (e) => {
        if(e.key === 'Enter') confirmBtn.click();
    };
    
    document.getElementById('modalCancelBtn').onclick = () => {
        inputElem.onkeypress = null;
        closeCustomModal();
        if(callback) callback(null);
    };
    confirmBtn.onclick = () => {
        const val = inputElem.value;
        inputElem.onkeypress = null;
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

// =========================================================================
// 🌟 로그인, 로그아웃 및 상태 관리
// =========================================================================
window.onload = () => {
    // 앱이 정상적으로 로딩되면 실행
    if(document.getElementById('loginOverlay')) {
        initGameOptions();
        checkAutoLogin();
    }
};

function checkAutoLogin() {
    const savedUser = localStorage.getItem('festivalUser');
    const savedStock = localStorage.getItem('festivalStock');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        if(!currentUser.logs) currentUser.logs = []; 
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
            currentUser = null; 
            switchTab('home');
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
            if(!currentUser.logs) currentUser.logs = [];
            if(savedStock) localStock = JSON.parse(savedStock);
            else initLocalStock();
            
            finishLogin();
        } else {
            customConfirm(`이전에 로그인한 기록([${parsedUser.studentId}] ${parsedUser.name})이 있습니다.<br><br><span style="color:#ff3366;">새로운 학번으로 로그인하면 기존 포인트와 보관함이 모두 삭제됩니다.</span><br>진행하시겠습니까?`, (ok) => {
                if(ok) {
                    currentUser = { studentId: id, name: name, points: 0, inventory: [], logs: [], isAdmin: isAdminAccount };
                    initLocalStock();
                    finishLogin();
                }
            });
        }
    } else {
        currentUser = { studentId: id, name: name, points: 0, inventory: [], logs: [], isAdmin: isAdminAccount };
        initLocalStock();
        finishLogin();
    }
}

function finishLogin() {
    saveData();
    renderShop(); 
    document.getElementById('loginOverlay').style.display = 'none';
    switchTab('home'); 
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
    if(!currentUser) return; 
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
    
    if (tabName === 'logs') {
        renderLogs();
    }
}

// =========================================================================
// 🎮 게임 점수 부여 및 기록
// =========================================================================
function initGameOptions() {
    const gameSelect = document.getElementById('gameSelect');
    if(!gameSelect) return;
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
        tierSelect.style.display = 'block';
        slotWrap.style.display = 'none';
        
        game.tiers.forEach(tier => {
            let opt = document.createElement('option');
            opt.value = tier.points;
            opt.innerText = `${tier.name} (+ ${tier.points}P)`;
            tierSelect.appendChild(opt);
        });
    }
}

function giveGamePoints() {
    const gameId = document.getElementById('gameSelect').value;
    if(!gameId) return customAlert('게임을 선택해주세요.', 'error');
    const game = GAMES.find(g => g.id === gameId);
    const authCode = document.getElementById('gameAuthInput').value;

    if(!authCode) return customAlert('운영자 비밀번호를 입력하세요.', 'error');
    
    const adminName = OPERATOR_CODES[authCode];
    if(!adminName) return customAlert('관리자 비밀번호가 틀렸습니다.', 'error');

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
    
    currentUser.logs = currentUser.logs || [];
    currentUser.logs.push({
        type: '점수 획득',
        admin: adminName,
        detail: `${game.name} - ${points}P 지급`,
        time: new Date().toLocaleString()
    });

    saveData();
    document.getElementById('gameAuthInput').value = '';
    
    customAlert(`<b>${adminName}</b> 승인 완료!<br><b>${points}P</b>가 지급되었습니다!`, 'success');
    switchTab('home');
}

// =========================================================================
// 🛒 상점 & 🎒 보관함 시스템
// =========================================================================
function renderShop() {
    const list = document.getElementById('shopList');
    if(!list) return;
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

function renderInventory() {
    const list = document.getElementById('inventoryList');
    if(!list) return;
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
            const adminName = OPERATOR_CODES[pwd];
            if(!adminName) return customAlert('관리자 비밀번호가 틀렸습니다.', 'error');
            
            const idx = currentUser.inventory.findIndex(i => i.name === name);
            if(idx > -1) currentUser.inventory.splice(idx, 1);
            
            currentUser.logs = currentUser.logs || [];
            currentUser.logs.push({
                type: '상품 사용',
                admin: adminName,
                detail: `${name} x1개 사용 승인`,
                time: new Date().toLocaleString()
            });

            saveData();
            customAlert(`<b>${adminName}</b> 승인으로 사용 처리되었습니다.`, 'success');
        });
    } else {
        customSliderPrompt(`보유 수량: <b>${maxCount}개</b><br><br>사용할 수량을 스크롤하여 선택하세요.`, maxCount, (qty) => {
            if(qty === null) return;
            
            setTimeout(() => {
                customPrompt(`<b>${qty}개</b> 사용 처리합니다.<br>운영자 비밀번호 4자리를 입력하세요.`, (pwd) => {
                    if(pwd === null) return;
                    const adminName = OPERATOR_CODES[pwd];
                    if(!adminName) return customAlert('관리자 비밀번호가 틀렸습니다.', 'error');
                    
                    for(let i = 0; i < qty; i++) {
                        const idx = currentUser.inventory.findIndex(item => item.name === name);
                        if(idx > -1) currentUser.inventory.splice(idx, 1);
                    }
                    
                    currentUser.logs = currentUser.logs || [];
                    currentUser.logs.push({
                        type: '상품 사용',
                        admin: adminName,
                        detail: `${name} x${qty}개 사용 승인`,
                        time: new Date().toLocaleString()
                    });

                    saveData();
                    customAlert(`<b>${adminName}</b> 승인으로 총 ${qty}개가 처리되었습니다.`, 'success');
                });
            }, 400); 
        });
    }
}

// =========================================================================
// 📜 활동 로그 렌더링
// =========================================================================
function renderLogs() {
    const list = document.getElementById('logList');
    if(!list) return;
    list.innerHTML = '';
    
    if(!currentUser.logs || currentUser.logs.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:#777; margin-top:20px;">기록이 없습니다.</p>';
        return;
    }

    [...currentUser.logs].reverse().forEach(log => {
        const logDiv = document.createElement('div');
        logDiv.className = 'inv-item'; 
        logDiv.style.flexDirection = 'column';
        logDiv.style.alignItems = 'flex-start';
        logDiv.style.gap = '5px';
        
        logDiv.innerHTML = `
            <div style="display:flex; justify-content:space-between; width:100%;">
                <span style="color:var(--neon-cyan); font-weight:bold;">[${log.type}]</span>
                <span style="color:#888; font-size:0.75rem;">${log.time}</span>
            </div>
            <div style="color:#eee; font-size:0.95rem;">${log.detail}</div>
            <div style="color:var(--neon-green); font-size:0.85rem; font-weight:bold;">승인 관리자: ${log.admin}</div>
        `;
        list.appendChild(logDiv);
    });
}

// =========================================================================
// 🛠️ 최고 관리자 패널
// =========================================================================
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
    customConfirm('현재 기기의 데이터와 보관함을 지우고 완전 초기화하시겠습니까?<br><span style="color:#ff3366; font-size:0.85rem;">(복구 불가능)</span>', (ok) => {
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

        currentUser.logs = currentUser.logs || [];
        currentUser.logs.push({
            type: '강제 조작',
            admin: '부장(최고관리자)',
            detail: `포인트 ${pts}P 강제 적용`,
            time: new Date().toLocaleString()
        });

        saveData();
        closeAdminPanel();
        customAlert(`성공적으로 <b>${pts}P</b>가 강제 적용되었습니다.`, 'success');
    }, 'number', '포인트 조작');
}
