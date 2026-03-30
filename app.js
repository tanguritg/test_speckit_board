// Utilities
const utils = {
    generateId: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    
    storage: {
        get: (key) => JSON.parse(localStorage.getItem(key)) || [],
        save: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
        add: (key, item) => {
            const items = utils.storage.get(key);
            items.unshift(item); // Newest first
            utils.storage.save(key, items);
            return items;
        }
    },

    maskPII: (text) => {
        if (!text) return '';
        const emailRegex = /([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
        let masked = text.replace(emailRegex, (match, p1, p2) => p1.substring(0, 2) + '***@' + p2);
        const phoneRegex = /(\d{2,3})-(\d{3,4})-(\d{4})/g;
        masked = masked.replace(phoneRegex, '$1-****-$3');
        return masked;
    }
};

const STORAGE_KEYS = {
    COMPLAINTS: 'complaints',
    AI_RESPONSES: 'ai_responses'
};

// DOM Elements
const complaintForm = document.getElementById('complaint-form');
const boardContainer = document.getElementById('board-container');
const processingStatus = document.getElementById('processing-status');

// Functions
function isStaffMode() {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'staff';
}

async function getApiKey() {
    console.log('API 키 확인 중...');
    try {
        const response = await fetch('.env');
        if (response.ok) {
            const text = await response.text();
            // 구글 API 키 형식(AIza...)을 직접 찾아내는 정규식
            const keyMatch = text.match(/AIza[0-9A-Za-z-_]{35}/);
            if (keyMatch) {
                console.log('API 키를 .env 파일에서 성공적으로 감지했습니다.');
                return keyMatch[0];
            }
        }
    } catch (e) {
        console.error('.env 읽기 실패:', e);
    }

    const localKey = localStorage.getItem('GEMINI_API_KEY');
    return localKey ? localKey.trim() : null;
}

async function generateAIResponse(complaint) {
    const apiKey = await getApiKey();
    
    if (!apiKey) {
        console.warn('사용 가능한 API 키가 없습니다. Mock 모드로 전환합니다.');
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: utils.generateId(),
                    complaint_id: complaint.id,
                    content: `안녕하세요, 고객님. (API 키 미설정) 불편을 드려 죄송합니다. "${complaint.title}" 건에 대해 확인 후 조속히 해결해 드리겠습니다.`,
                    model: 'Mock-AI',
                    timestamp: Date.now(),
                    is_error: false
                });
            }, 1000);
        });
    }

    // 요청하신 gemini-3.1-pro-preview 모델 사용 (v1beta 엔드포인트)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${apiKey}`;
    console.log('Gemini API (gemini-3.1-pro-preview) 호출 시도...');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `고객의 컴플레인 제목: ${complaint.title}\n내용: ${complaint.content}\n위 컴플레인에 대해 매우 정중하고 공감하며 해결 중심적인 답변을 한국어로 작성해 주세요.`
                    }]
                }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('API 에러 상세:', data);
            throw new Error(data.error ? data.error.message : `HTTP ${response.status} 에러`);
        }

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiText = data.candidates[0].content.parts[0].text;
            console.log('AI 응답 성공!');
            return {
                id: utils.generateId(),
                complaint_id: complaint.id,
                content: aiText,
                model: 'Gemini 3.1 Pro Preview',
                timestamp: Date.now(),
                is_error: false
            };
        } else {
            throw new Error('API 응답 형식이 올바르지 않습니다.');
        }
    } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
        return {
            id: utils.generateId(),
            complaint_id: complaint.id,
            content: `AI 서비스(Gemini 3.1 Pro) 연동에 실패했습니다.\n사유: ${error.message}`,
            model: 'System-Error',
            timestamp: Date.now(),
            is_error: true
        };
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const author = document.getElementById('author').value;
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    
    const complaint = {
        id: utils.generateId(),
        title: title,
        content: content,
        author_masked: utils.maskPII(author),
        timestamp: Date.now(),
        status: 'pending',
        ai_response_id: null
    };

    complaintForm.classList.add('hidden');
    processingStatus.classList.remove('hidden');

    try {
        const aiResponse = await generateAIResponse(complaint);
        complaint.ai_response_id = aiResponse.id;
        utils.storage.add(STORAGE_KEYS.COMPLAINTS, complaint);
        utils.storage.add(STORAGE_KEYS.AI_RESPONSES, aiResponse);
        complaintForm.reset();
        renderBoard();
    } catch (error) {
        console.error('등록 실패:', error);
    } finally {
        complaintForm.classList.remove('hidden');
        processingStatus.classList.add('hidden');
    }
}

function updateComplaintStatus(complaintId, status) {
    const complaints = utils.storage.get(STORAGE_KEYS.COMPLAINTS);
    const index = complaints.findIndex(c => c.id === complaintId);
    if (index !== -1) {
        complaints[index].status = status;
        utils.storage.save(STORAGE_KEYS.COMPLAINTS, complaints);
        renderBoard();
    }
}

function editAIResponse(responseId, newContent) {
    const responses = utils.storage.get(STORAGE_KEYS.AI_RESPONSES);
    const index = responses.findIndex(r => r.id === responseId);
    if (index !== -1) {
        responses[index].content = newContent;
        responses[index].model += ' (수정됨)';
        utils.storage.save(STORAGE_KEYS.AI_RESPONSES, responses);
        renderBoard();
    }
}

function renderBoard() {
    const complaints = utils.storage.get(STORAGE_KEYS.COMPLAINTS);
    const aiResponses = utils.storage.get(STORAGE_KEYS.AI_RESPONSES);
    const staffMode = isStaffMode();
    boardContainer.innerHTML = '';
    
    if (complaints.length === 0) {
        boardContainer.innerHTML = '<p class="empty-msg">등록된 컴플레인이 없습니다.</p>';
        return;
    }

    if (staffMode) {
        const staffHeader = document.createElement('div');
        staffHeader.className = 'staff-badge';
        staffHeader.innerText = '관리자 모드 활성화됨';
        boardContainer.appendChild(staffHeader);
    }

    complaints.forEach(complaint => {
        const response = aiResponses.find(r => r.id === complaint.ai_response_id);
        const card = document.createElement('div');
        card.className = 'card complaint-card';
        const date = new Date(complaint.timestamp).toLocaleString();
        
        card.innerHTML = `
            <div class="complaint-header">
                <h3>${staffMode ? complaint.title : utils.maskPII(complaint.title)} 
                    <span class="status-tag status-${complaint.status}">${complaint.status === 'pending' ? '대기중' : '검토완료'}</span>
                </h3>
                <span class="meta">${complaint.author_masked} | ${date}</span>
            </div>
            <div class="complaint-body">
                <p>${staffMode ? complaint.content : utils.maskPII(complaint.content)}</p>
            </div>
            ${response ? `
                <div class="ai-response ${response.is_error ? 'error' : ''}">
                    <span class="badge">AI 자동 응답</span>
                    <p id="response-text-${response.id}">${response.content}</p>
                    <span class="meta-small">Model: ${response.model}</span>
                    ${staffMode ? `
                        <div class="staff-controls">
                            <button class="btn btn-secondary btn-small" onclick="const newText = prompt('답변 수정:', document.getElementById('response-text-${response.id}').innerText); if(newText) window.editAIResponse('${response.id}', newText)">수정</button>
                            ${complaint.status === 'pending' ? `<button class="btn btn-success btn-small" onclick="window.updateComplaintStatus('${complaint.id}', 'reviewed')">완료</button>` : ''}
                        </div>
                    ` : ''}
                </div>
            ` : ''}
        `;
        boardContainer.appendChild(card);
    });
}

window.updateComplaintStatus = updateComplaintStatus;
window.editAIResponse = editAIResponse;
complaintForm.addEventListener('submit', handleFormSubmit);
renderBoard();
console.log('앱 초기화 완료');
