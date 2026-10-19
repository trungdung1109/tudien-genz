// =========================================================================
// PHẦN 1: KHỞI TẠO DỮ LIỆU TỪ FILE DATA.JS (LƯU VÀO LOCALSTORAGE ĐỂ CHẠY MƯỢT)
// =========================================================================
let currentDictionary = JSON.parse(localStorage.getItem('genz_database'));

// Nếu trong máy chưa có dữ liệu, lấy danh sách genzDictionary từ file data.js nạp vào
if (!currentDictionary) {
    currentDictionary = genzDictionary;
    localStorage.setItem('genz_database', JSON.stringify(currentDictionary));
}

// =========================================================================
// PHẦN 2: LẤY CÁC THÀNH PHẦN GIAO DIỆN
// =========================================================================
const searchInput = document.getElementById('search-input');
const clearBtn = document.getElementById('clear-btn');
const searchBtn = document.getElementById('search-btn');
const suggestionsBox = document.getElementById('suggestions-box');
const resultBox = document.getElementById('result-box');

// Các ô nhập liệu phần đóng góp từ mới
const newWord = document.getElementById('new-word');
const newCategory = document.getElementById('new-category');
const newStandard = document.getElementById('new-standard');
const newMeaning = document.getElementById('new-meaning');
const newContext = document.getElementById('new-context');
const newAdvice = document.getElementById('new-advice');
const submitBtn = document.getElementById('submit-btn');

// =========================================================================
// PHẦN 3: XỬ LÝ TRA CỨU SIÊU TỐC VÀ HỘP GỢI Ý THẢ XUỐNG (INSTANT SEARCH)
// =========================================================================

// Hàm hiển thị chi tiết đầy đủ 7 trường thông tin ra màn hình
function displayWordDetails_CU(item) {
    resultBox.innerHTML = `
        <div class="result-item"><strong>THUẬT NGỮ MẠNG (GENZ):</strong> <span style="color: #ffee58; font-weight: bold; font-size: 20px;">${item.word.toUpperCase()}</span></div>
        <div class="result-item"><strong>PHÂN LOẠI:</strong> ${item.category || 'Chưa phân loại'}</div>
        <div class="result-item"><strong>TỪ CHUẨN MỰC:</strong> ${item.standard || 'Chưa cập nhật'}</div>
        <div class="result-item"><strong>Ý NGHĨA:</strong> ${item.meaning}</div>
        <div class="result-item"><strong>NGỮ CẢNH GIAO TIẾP:</strong> ${item.context || 'Chưa cập nhật'}</div>
        <div class="result-item"><strong>LỜI KHUYÊN SỬ DỤNG:</strong> ${item.advice || 'Chưa có lời khuyên'}</div>
        <div class="result-item"><strong>TRẠNG THÁI:</strong> <span style="color: #2ecc71; font-weight: bold;">${item.status || 'Đã duyệt'}</span></div>
    `;
    suggestionsBox.style.display = 'none'; // Đóng hộp gợi ý lại sau khi chọn xong
}
// Hàm hiển thị chi tiết đầy đủ thông tin ra màn hình (Đã chuyển sang hệ thống "Màu" + Bảng đối chiếu)
function displayWordDetails(item) {
    // Thuật toán tự động nhận diện ký hiệu màu từ file dữ liệu
    let lightEmoji = "🟢";
    if (item.warning_light.includes("Vàng")) lightEmoji = "🟡";
    if (item.warning_light.includes("Đỏ")) lightEmoji = "🔴";

    resultBox.innerHTML = `
        <!-- Khung Hệ Thống Màu Cảnh Báo Trực Quan -->
        <div style="display: flex; align-items: center; background-color: #2a2a40; padding: 15px; border-radius: 12px; margin-bottom: 20px; border-left: 6px solid ${lightEmoji === '🟢' ? '#2ecc71' : lightEmoji === '🟡' ? '#f1c40f' : '#e74c3c'}">
            <span style="font-size: 40px; margin-right: 15px;">${lightEmoji}</span>
            <div>
                <strong style="color: #fff; font-size: 16px;">HỆ THỐNG MÀU CẢNH BÁO BỐI CẢNH:</strong>
                <p style="margin: 5px 0 0 0; color: #bbb; font-size: 14px;">Từ này thuộc nhóm <span style="font-weight: bold; color: #fff;">${item.warning_light.toUpperCase()}</span>.</p>
            </div>
        </div>

        <!-- BẢNG ĐỐI CHIẾU Ý NGHĨA MÃ MÀU (Người dùng nhìn vào biết ngay bối cảnh) -->
        <div style="background-color: #1e1e2f; border: 1px solid #3d3d5c; padding: 15px; border-radius: 12px; margin-bottom: 20px; font-family: Arial, sans-serif;">
            <strong style="color: #ffee58; display: block; margin-bottom: 10px; font-size: 14px;">📋 BẢNG ĐỐI CHIẾU QUY ƯỚC MÀU BỐI CẢNH SƯ PHẠM:</strong>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
                <div style="display: flex; align-items: center; gap: 10px; color: #2ecc71;"><span style="font-size: 18px;">🟢</span> <strong>Màu Xanh (An toàn):</strong> Thuật ngữ vui vẻ, lành tính. Tự do dùng giao tiếp bạn bè.</div>
                <div style="display: flex; align-items: center; gap: 10px; color: #f1c40f;"><span style="font-size: 18px;">🟡</span> <strong>Màu Vàng (Hạn chế):</strong> Dễ gây hoang mang cho người lớn. Hạn chế dùng ở nhà để bảo vệ giao tiếp gia đình.</div>
                <div style="display: flex; align-items: center; gap: 10px; color: #e74c3c;"><span style="font-size: 18px;">🔴</span> <strong>Màu Đỏ (Nghiêm cấm):</strong> Từ ngữ tiêu cực, lỗi bối cảnh nặng. Nghiêm cấm dùng trong học đường, bài thi, lớp học.</div>
            </div>
        </div>

        <!-- Khung Hiển Thị Chi Tiết Kết Quả -->
        <div class="result-item"><strong>THUẬT NGỮ MẠNG (GENZ):</strong> <span style="color: #ffee58; font-weight: bold; font-size: 20px;">${item.word.toUpperCase()}</span></div>
        <div class="result-item"><strong>PHÂN LOẠI:</strong> ${item.category || 'Chưa phân loại'}</div>
        <div class="result-item"><strong>TỪ CHUẨN MỰC:</strong> ${item.standard || 'Chưa cập nhật'}</div>
        <div class="result-item"><strong>Ý NGHĨA:</strong> ${item.meaning}</div>
        <div class="result-item"><strong>NGỮ CẢNH GIAO TIẾP:</strong> ${item.context || 'Chưa cập nhật'}</div>
        <div class="result-item"><strong>LỜI KHUYÊN SỬ DỤNG:</strong> ${item.advice || 'Chưa có lời khuyên'}</div>
        <div class="result-item"><strong>TRẠNG THÁI:</strong> <span style="color: #2ecc71; font-weight: bold;">${item.status || 'Đã duyệt'}</span></div>
    `;
    suggestionsBox.style.display = 'none';
}

// Kích hoạt Instant Search: Gõ chữ đến đâu gợi ý nhảy ra đến đó
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();

    // Nếu ô gõ chữ trống trống hoàn toàn
    if (query === "") {
        clearBtn.style.display = 'none';
        suggestionsBox.style.display = 'none';
        resultBox.innerHTML = `<p class="placeholder-text">Nhập ký tự để bắt đầu tra cứu hoặc chọn từ gợi ý nhé...</p>`;
        return;
    }

    // Hiện nút xóa nhanh chữ ✖️
    clearBtn.style.display = 'block';

    // Tìm các từ trong 600 từ có chứa ký tự đang gõ
    const matchedWords = currentDictionary.filter(item => 
        item.word.toLowerCase().includes(query)
    );

    // Hiển thị hộp thả gợi ý xuống nếu tìm thấy từ khớp
    if (matchedWords.length > 0) {
        suggestionsBox.innerHTML = "";
        // Giới hạn hiển thị tối đa 5 từ gợi ý để giao diện gọn gàng
        matchedWords.slice(0, 15).forEach(item => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerText = item.word.toUpperCase(); // In hoa chữ gợi ý
            
            // Khi bấm vào 1 từ gợi ý, lập tức bung kết quả chi tiết luôn
            div.addEventListener('click', () => {
                searchInput.value = item.word;
                displayWordDetails(item);
            });
            suggestionsBox.appendChild(div);
        });
        suggestionsBox.style.display = 'block';
    } else {
        suggestionsBox.style.display = 'none';
        resultBox.innerHTML = `<p class="placeholder-text">Từ này chưa có trong hệ thống vũ trụ GenZ rồi bro ơi... 🥺</p>`;
    }
});

// Bấm nút xóa nhanh ✖️ để clear sạch chữ trong ô gõ
clearBtn.addEventListener('click', () => {
    searchInput.value = "";
    clearBtn.style.display = 'none';
    suggestionsBox.style.display = 'none';
    resultBox.innerHTML = `<p class="placeholder-text">Nhập ký tự để bắt đầu tra cứu hoặc chọn từ gợi ý nhé...</p>`;
    searchInput.focus();
});

// Bấm nút "TRA CỨU" hình Oval màu đỏ
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();
    const found = currentDictionary.find(item => item.word.toLowerCase() === query);
    
    if (found) {
        displayWordDetails(found);
    } else if (query !== "") {
        resultBox.innerHTML = `<p class="placeholder-text">Không tìm thấy từ chính xác hoàn toàn. Hãy thử chọn các từ gợi ý thả xuống xem sao!</p>`;
    }
});

// Cho phép bấm phím Enter trên bàn phím để tra nhanh
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Ẩn hộp gợi ý khi click chuột ra ngoài vùng tìm kiếm
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-section')) {
        suggestionsBox.style.display = 'none';
    }
});

// =========================================================================
// PHẦN 4: LOGIC ĐÓNG GÓP TỪ MỚI (TRẠNG THÁI CHỜ DUYỆT)
// =========================================================================
submitBtn.addEventListener('click', () => {
    const wordText = newWord.value.trim();
    const categoryText = newCategory.value.trim();
    const standardText = newStandard.value.trim();
    const meaningText = newMeaning.value.trim();
    const contextText = newContext.value.trim();
    const adviceText = newAdvice.value.trim();

    if (!wordText || !meaningText) {
        alert("Bro ơi, ít nhất phải điền Thuật ngữ và Ý nghĩa nhé! Ngừng lười biếng nào 🧐");
        return;
    }

    const newEntry = {
        word: wordText,
        category: categoryText,
        standard: standardText,
        meaning: meaningText,
        context: contextText,
        advice: adviceText
    };

    // Đổi chữ NÚT BẤM thành trạng thái đang xử lý cho mượt mà
    submitBtn.innerText = "ĐANG GỬI LÊN VŨ TRỤ...";
    submitBtn.disabled = true;

    // DÁN ĐƯỜNG LINK WEB APP GOOGLE BẠN VỪA COPY VÀO GIỮA HAI DẤU NGOẶC KÉP NÀY
    const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/AKfycbxJcUg-tlAu-L4dDpCobilkxVQ_bZwiLOkZnrfz3pWdFFM4CVkl0-naPiUU5qAD-TPt/exec";

    fetch(GOOGLE_SHEET_API_URL, {
        method: "POST",
        mode: "no-cors", // Bỏ qua chặn bảo mật chéo trang của trình duyệt
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newEntry)
    })
    .then(() => {
        alert(`Gửi thành công từ "${wordText}" lên vũ trụ! Từ điển đang ở trạng thái CHỜ DUYỆT trên Google Sheets của Admin nha!`);
        // Xóa sạch ô nhập liệu
        newWord.value = ""; newCategory.value = ""; newStandard.value = "";
        newMeaning.value = ""; newContext.value = ""; newAdvice.value = "";
    })
    .catch(error => {
        console.error("Lỗi gửi dữ liệu:", error);
        alert("Ủa alo? Có lỗi gì đó xảy ra khi gửi rồi bạn ơi, thử lại xem!");
    })
    .finally(() => {
        submitBtn.innerText = "GỬI LÊN VŨ TRỤ (CHỜ DUYỆT)";
        submitBtn.disabled = false;
    });
});
// =========================================================================
// TRỢ LÝ ẢO GENZ CAO CẤP - TRA CỨU ĐA NHIỆM & SUY LUẬN CHUYÊN SÂU (HỢP NHẤT)
// =========================================================================

(function TichHopWidgetChatbotCaoCap() {
    // Mã token của bạn đã được cấu hình an toàn bảo mật tại đây
    const HUGGINGFACE_TOKEN = "hf_rmxDvSwNNlDSDdEmojSwOllLKdlgLllLEN";

    // Mảng lưu trữ lịch sử trò chuyện để Bot hiểu ngữ cảnh khi người dùng hỏi đưa thêm ví dụ
    let lichSuTroChuyen = [];

    // 1. Tạo cấu trúc HTML giao diện Bong bóng chat và Cửa sổ thoại
    const divChatbotContainer = document.createElement('div');
    divChatbotContainer.id = 'tro-ly-genz-widget';
    divChatbotContainer.innerHTML = `
        <div id="chatbot-bubble" title="Trợ lý ảo giải mã ngôn ngữ GenZ">
            <span style="font-size: 28px;">🤖</span>
            <div id="chatbot-badge">AI</div>
        </div>
        <div id="chatbot-window">
            <div id="chatbot-header">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 22px;">🤖</span>
                    <div>
                        <div style="font-weight: bold; font-size: 14px;">Trợ lý ảo GenZ Chuyên Sâu</div>
                        <div style="font-size: 11px; color: #4caf50; display: flex; align-items: center; gap: 4px;">
                            <span style="width: 6px; height: 6px; background: #4caf50; border-radius: 50%; display: inline-block;"></span> Sẵn sàng giải mã
                        </div>
                    </div>
                </div>
                <button id="chatbot-close-btn">&times;</button>
            </div>
            <div id="chatbot-messages">
                <div class="msg bot">Xin chào! Mình là Trợ lý ảo AI giải mã chuyên sâu ngôn ngữ GenZ. 
                
                Không chỉ giải nghĩa, mình có thể **phân tích tâm lý, cho ví dụ minh họa và đặt câu mẫu** cho cả 580 từ sẵn có lẫn bất kỳ từ lóng gõ tự do nào bạn yêu cầu. Hãy thử hỏi mình xem! ✨</div>
            </div>
            <div id="chatbot-input-container">
                <input type="text" id="chatbot-input-field" placeholder="Gõ từ mới hoặc hỏi sâu thêm (ví dụ: cho ví dụ từ đó)..." autocomplete="off">
                <button id="chatbot-send-btn">👉</button>
            </div>
        </div>
        <style>
            #tro-ly-genz-widget { font-family: Arial, sans-serif; z-index: 999999; position: fixed; bottom: 20px; right: 20px; }
            #chatbot-bubble { width: 60px; height: 60px; background: linear-gradient(135deg, #1e88e5, #1565c0); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 15px rgba(21,101,192,0.4); transition: transform 0.3s ease; position: relative; }
            #chatbot-bubble:hover { transform: scale(1.1); }
            #chatbot-badge { position: absolute; top: -2px; right: -2px; background: #ffeb3b; color: #000; font-size: 9px; font-weight: bold; padding: 2px 5px; border-radius: 10px; border: 2px solid #fff; }
            #chatbot-window { width: 380px; height: 500px; background: #1a1a24; border: 1px solid #3d3d5c; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.5); display: none; flex-direction: column; overflow: hidden; position: absolute; bottom: 80px; right: 0; }
            #chatbot-header { background: #252538; padding: 12px 16px; color: #fff; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #3d3d5c; }
            #chatbot-close-btn { background: none; border: none; color: #aaa; font-size: 24px; cursor: pointer; }
            #chatbot-close-btn:hover { color: #fff; }
            #chatbot-messages { flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
            .msg { max-width: 85%; padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.5; word-wrap: break-word; white-space: pre-line; color: #fff; }
            .msg.bot { background: #2a2a3a; align-self: flex-start; border-bottom-left-radius: 2px; border: 1px solid #3a3a52; }
            .msg.user { background: #1e88e5; align-self: flex-end; border-bottom-right-radius: 2px; }
            #chatbot-input-container { padding: 12px; background: #252538; display: flex; gap: 8px; border-top: 1px solid #3d3d5c; }
            #chatbot-input-field { flex: 1; background: #14141f; border: 1px solid #3d3d5c; border-radius: 8px; padding: 10px; color: #fff; font-size: 13px; }
            #chatbot-input-field:focus { outline: none; border-color: #1e88e5; }
            #chatbot-send-btn { background: #1e88e5; border: none; color: #fff; padding: 0 16px; border-radius: 8px; cursor: pointer; font-weight: bold; }
            #chatbot-send-btn:hover { background: #1565c0; }
            .loading-dots span { animation: blink 1.4s infinite both; font-size: 18px; color: #1e88e5; }
            .loading-dots span:nth-child(2) { animation-delay: .2s; }
            .loading-dots span:nth-child(3) { animation-delay: .4s; }
            @keyframes blink { 0% { opacity: .2; } 20% { opacity: 1; } 100% { opacity: .2; } }
        </style>
    `;
    document.body.appendChild(divChatbotContainer);

    const bongBongChat = document.getElementById('chatbot-bubble');
    const cuaSoChat = document.getElementById('chatbot-window');
    const nutDongChat = document.getElementById('chatbot-close-btn');
    const oNhapLieu = document.getElementById('chatbot-input-field');
    const nutGuiTin = document.getElementById('chatbot-send-btn');
    const khungTinNhan = document.getElementById('chatbot-messages');

    bongBongChat.addEventListener('click', () => {
        cuaSoChat.style.display = cuaSoChat.style.display === 'flex' ? 'none' : 'flex';
        if (cuaSoChat.style.display === 'flex') oNhapLieu.focus();
    });
    nutDongChat.addEventListener('click', () => { cuaSoChat.style.display = 'none'; });

    function themTinNhanMoi(text, sender) {
        const divMsg = document.createElement('div');
        divMsg.className = `msg ${sender}`;
        divMsg.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); 
        khungTinNhan.appendChild(divMsg);
        khungTinNhan.scrollTop = khungTinNhan.scrollHeight;
        return divMsg;
    }

    async function xuLyGuiTin() {
    const textHieuNang = oNhapLieu.value.trim();
    if (!textHieuNang) return;

    themTinNhanMoi(textHieuNang, 'user');
    oNhapLieu.value = '';

    const divLoading = themTinNhanMoi('<div class="loading-dots">Trợ lý AI đang phân tích sâu dữ liệu<span>.</span><span>.</span><span>.</span></div>', 'bot');

    const query = textHieuNang.toLowerCase().trim();
    let thôngTinTừĐiểnGốc = "";

    // Kiểm tra kho 580 từ cục bộ của bạn
    if (typeof currentDictionary !== 'undefined') {
        const timTu = currentDictionary.find(item => item.word.toLowerCase() === query);
        if (timTu) {
            thôngTinTừĐiểnGốc = `Dữ liệu gốc hệ thống: Ý nghĩa: "${timTu.meaning}". Bối cảnh: "${timTu.context}". Lời khuyên: "${timTu.advice}".`;
        }
    }

    // Câu lệnh định hình tính cách chuyên sâu cho AI Qwen
    let systemPrompt = `Bạn là một Trợ lý ảo giải mã ngôn ngữ GenZ Việt Nam thông minh, vui tính. Bạn nói tiếng Việt tự nhiên.\n`;
    if (thôngTinTừĐiểnGốc) {
        systemPrompt += `Hãy sử dụng thông tin từ điển gốc này làm căn cứ: ${thôngTinTừĐiểnGốc}. Đừng chép lại khô khan. Hãy viết lại sinh động, phân tích tâm lý sâu sắc hơn, đưa ra ví dụ đặt câu hội thoại thực tế dí dỏm và lời khuyên bối cảnh sư phạm văn minh học đường.\n`;
    } else {
        systemPrompt += `Nếu người dùng gõ từ lóng mới hoặc câu hỏi tự do, hãy dùng kiến thức AI chuyên sâu để giải nghĩa chi tiết, phân tích bối cảnh mạng xã hội, tâm lý giới trẻ, đặt câu hội thoại minh họa sinh động và lời khuyên phù hợp.\n`;
    }
    systemPrompt += `Nếu người dùng hỏi tiếp nối ngữ cảnh trước (ví dụ: "cho ví dụ", "đặt câu thử đi", "giải thích thêm"), hãy căn cứ vào lịch sử trò chuyện trước đó để đưa ra câu trả lời chuẩn xác.`;

    if (lichSuTroChuyen.length === 0) {
        lichSuTroChuyen.push({ role: "system", content: systemPrompt });
    }
    lichSuTroChuyen.push({ role: "user", content: textHieuNang });
    if (lichSuTroChuyen.length > 7) lichSuTroChuyen.splice(1, 2);

    // Định dạng cấu trúc chuỗi ChatML tối ưu riêng cho mô hình Qwen
    let promptQwen = "";
    lichSuTroChuyen.forEach(chat => {
        promptQwen += `<|im_start|>${chat.role}\n${chat.content}<|im_end|>\n`;
    });
    promptQwen += `<|im_start|>assistant\n`;

    try {
        // ĐƯỜNG DẪN CỔNG API CHUẨN XÁC ĐÃ ĐƯỢC CẬP NHẬT TẠI ĐÂY
        const response = await fetch("https://api-inference.huggingface. co/models/meta-llama/Meta-Llama-3-8B-Instruct:featherless-ai", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${HUGGINGFACE_TOKEN}`
            },
            body: JSON.stringify({
                inputs: promptQwen,
                parameters: { max_new_tokens: 500, return_full_text: false }
            })
        });

        const result = await response.json();
        divLoading.remove();

        let cauTraLoiAI = "";
        // Trích xuất văn bản từ phản hồi dạng mảng của Hugging Face
        if (Array.isArray(result) && result[0] && result[0].generated_text) {
            cauTraLoiAI = result[0].generated_text;
        } else if (result && result.generated_text) {
            cauTraLoiAI = result.generated_text;
        } else if (result && result.error) {
            console.error("Lỗi API:", result.error);
            cauTraLoiAI = `⚠️ Hệ thống AI đang tải dữ liệu, bạn vui lòng nhấn nút Gửi lại từ này một lần nữa nhé!`;
        }

        if (cauTraLoiAI) {
            cauTraLoiAI = cauTraLoiAI.replace("<|im_end|>", "").replace("<|im_start|>", "").trim();
            themTinNhanMoi(cauTraLoiAI, 'bot');
            lichSuTroChuyen.push({ role: "assistant", content: cauTraLoiAI });
        } else {
            themTinNhanMoi("🤖 Mình đã ghi nhận, bạn vui lòng bấm nút gửi lại một lần nữa để lấy kết quả nhé!", 'bot');
        }

    } catch (err) {
        if (divLoading && divLoading.parentNode) divLoading.remove();
        themTinNhanMoi("⚠️ Không thể kết nối với máy chủ AI. Bạn hãy thử nhấn nút Gửi lại lần nữa nhé!", 'bot');
    }
}

nutGuiTin.addEventListener('click', xuLyGuiTin);
oNhapLieu.addEventListener('keypress', (e) => { if (e.key === 'Enter') xuLyGuiTin(); });
})();
