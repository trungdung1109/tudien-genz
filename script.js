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
// KHỞI TẠO TIỆN ÍCH TRỢ LÝ ẢO GENZ CHUYÊN NGHIỆP (DÁN VÀO CUỐI FILE SCRIPT.JS)
// =========================================================================

(function TichHopWidgetChatbot() {
    // 1. Tạo cấu trúc HTML cho Bong bóng chat và Hộp thoại chat
    const divChatbotContainer = document.createElement('div');
    divChatbotContainer.id = 'tro-ly-genz-widget';
    divChatbotContainer.innerHTML = `
        <!-- Bong bóng Chat tròn nằm góc dưới bên phải -->
        <div id="chatbot-bubble" title="Trợ lý ảo giải mã ngôn ngữ GenZ">
            <span style="font-size: 28px;">🤖</span>
            <div id="chatbot-badge">AI</div>
        </div>

        <!-- Khung cửa sổ chat khi bung ra -->
        <div id="chatbot-window">
            <div id="chatbot-header">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 22px;">🤖</span>
                    <div>
                        <div style="font-weight: bold; font-size: 14px;">Trợ lý ảo GenZ</div>
                        <div style="font-size: 11px; color: #4caf50; display: flex; align-items: center; gap: 4px;">
                            <span style="width: 6px; height: 6px; background: #4caf50; border-radius: 50%; display: inline-block;"></span> Trực tuyến
                        </div>
                    </div>
                </div>
                <button id="chatbot-close-btn">&times;</button>
            </div>
            <div id="chatbot-messages">
                <div class="msg bot">Chào bạn! Mình là Trợ lý ảo giải mã ngôn ngữ GenZ học đường. Bạn có thể gõ bất kỳ từ lóng nào ở đây, mình sẽ tra cứu trong kho 580 từ hoặc tự động dùng AI giải mã sâu kỹ cho bạn! ✨</div>
            </div>
            <div id="chatbot-input-container">
                <input type="text" id="chatbot-input-field" placeholder="Nhập từ lóng GenZ cần giải mã..." autocomplete="off">
                <button id="chatbot-send-btn">👉</button>
            </div>
        </div>

        <!-- Khung CSS tạo phong cách độc lập, không làm hỏng giao diện gốc -->
        <style>
            #tro-ly-genz-widget { font-family: Arial, sans-serif; z-index: 999999; position: fixed; bottom: 20px; right: 20px; }
            #chatbot-bubble { width: 60px; height: 60px; background: linear-gradient(135deg, #ff4d4d, #f44336); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 15px rgba(244,67,54,0.4); transition: transform 0.3s ease; position: relative; }
            #chatbot-bubble:hover { transform: scale(1.1); }
            #chatbot-badge { position: absolute; top: -2px; right: -2px; background: #ffeb3b; color: #000; font-size: 9px; font-weight: bold; padding: 2px 5px; border-radius: 10px; border: 2px solid #fff; }
            #chatbot-window { width: 360px; height: 480px; background: #1a1a24; border: 1px solid #3d3d5c; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.5); display: none; flex-direction: column; overflow: hidden; position: absolute; bottom: 80px; right: 0; transition: all 0.3s ease; }
            #chatbot-header { background: #252538; padding: 12px 16px; color: #fff; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #3d3d5c; }
            #chatbot-close-btn { background: none; border: none; color: #aaa; font-size: 24px; cursor: pointer; }
            #chatbot-close-btn:hover { color: #fff; }
            #chatbot-messages { flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
            .msg { max-width: 85%; padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.5; word-wrap: break-word; white-space: pre-line; }
            .msg.bot { background: #2a2a3a; color: #fff; align-self: flex-start; border-bottom-left-radius: 2px; border: 1px solid #3a3a52; }
            .msg.user { background: #ff4d4d; color: #fff; align-self: flex-end; border-bottom-right-radius: 2px; }
            #chatbot-input-container { padding: 12px; background: #252538; display: flex; gap: 8px; border-top: 1px solid #3d3d5c; }
            #chatbot-input-field { flex: 1; background: #14141f; border: 1px solid #3d3d5c; border-radius: 8px; padding: 10px; color: #fff; font-size: 13px; }
            #chatbot-input-field:focus { outline: none; border-color: #ff4d4d; }
            #chatbot-send-btn { background: #ff4d4d; border: none; color: #fff; padding: 0 16px; border-radius: 8px; cursor: pointer; font-weight: bold; }
            #chatbot-send-btn:hover { background: #e53935; }
            .loading-dots span { animation: blink 1.4s infinite both; font-size: 18px; }
            .loading-dots span:nth-child(2) { animation-delay: .2s; }
            .loading-dots span:nth-child(3) { animation-delay: .4s; }
            @keyframes blink { 0% { opacity: .2; } 20% { opacity: 1; } 100% { opacity: .2; } }
        </style>
    `;
    document.body.appendChild(divChatbotContainer);

    // 2. Lấy các thành phần giao diện của Chatbot
    const bongBongChat = document.getElementById('chatbot-bubble');
    const cuaSoChat = document.getElementById('chatbot-window');
    const nutDongChat = document.getElementById('chatbot-close-btn');
    const oNhapLieu = document.getElementById('chatbot-input-field');
    const nutGuiTin = document.getElementById('chatbot-send-btn');
    const khungTinNhan = document.getElementById('chatbot-messages');

    // 3. Logic Đóng / Mở khung chat
    bongBongChat.addEventListener('click', () => {
        cuaSoChat.style.display = cuaSoChat.style.display === 'flex' ? 'none' : 'flex';
        if (cuaSoChat.style.display === 'flex') oNhapLieu.focus();
    });
    nutDongChat.addEventListener('click', () => { cuaSoChat.style.display = 'none'; });

    // 4. Hàm chèn tin nhắn vào khung thoại
    function themTinNhanMoi(text, sender) {
        const divMsg = document.createElement('div');
        divMsg.className = `msg ${sender}`;
        divMsg.innerHTML = text;
        khungTinNhan.appendChild(divMsg);
        khungTinNhan.scrollTop = khungTinNhan.scrollHeight;
        return divMsg;
    }

    // 5. Hàm xử lý gửi tin nhắn chính và phân tích từ vựng
    async function xuLyGuiTin() {
        const text = oNhapLieu.value.trim();
        if (!text) return;

        themTinNhanMoi(text, 'user');
        oNhapLieu.value = '';

        // Hiển thị bong bóng ba chấm chờ AI xử lý
        const divLoading = themTinNhanMoi('<div class="loading-dots">Đang giải mã<span>.</span><span>.</span><span>.</span></div>', 'bot');

        const query = text.toLowerCase().trim();
        let tuCoSan = null;

        // Tra cứu nhanh trong kho 580 từ có sẵn của bạn
        if (typeof currentDictionary !== 'undefined') {
            tuCoSan = currentDictionary.find(item => item.word.toLowerCase() === query);
        }

        if (tuCoSan) {
            // Trường hợp 1: Có sẵn từ trong hệ thống
            divLoading.remove();
            const phanHoiCucBo = `📌 **Từ khóa:** ${tuCoSan.word}\n📖 **Ý nghĩa:** ${tuCoSan.meaning}\n💡 **Bối cảnh:** ${tuCoSan.context || 'Thuật ngữ phổ biến của giới trẻ.'}\n🏫 **Lời khuyên học đường:** ${tuCoSan.advice || 'Sử dụng đúng ngữ cảnh văn minh.'}`;
            themTinNhanMoi(phanHoiCucBo, 'bot');
            return;
        }

        // Trường hợp 2: Từ mới hoàn toàn gõ tự do -> Gọi bộ não AI Llama 3 xử lý siêu tốc
        try {
            const response = await fetch("https://huggingface.co", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    inputs: `<|begin_of_text|><|start_header_id|>user<|end_header_id|>\nBạn là một trợ lý ảo chuyên giải mã tiếng lóng GenZ Việt Nam một cách khoa học, hài hước, phân tích tâm lý sâu sắc và có tính giáo dục văn minh học đường. Hãy giải nghĩa chi tiết, chỉ ra bản chất và đưa ra lời khuyên sử dụng cho từ/câu sau: "${text}".<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n`
                })
            });

            const result = await response.json();
            divLoading.remove();

            let textAI = "";
            if (Array.isArray(result) && result[0] && result[0].generated_text) textAI = result[0].generated_text;
            else if (result && result.generated_text) textAI = result.generated_text;

            if (textAI) {
                const parts = textAI.split("<|start_header_id|>assistant<|end_header_id|>\n");
                const cauTraLoiAI = parts[parts.length - 1].replace("<|eot_id|>", "").trim();
                themTinNhanMoi(cauTraLoiAI, 'bot');
            } else {
                themTinNhanMoi("⚠️ Máy chủ AI phản hồi rỗng, bạn thử lại từ khác xem sao nhé!", 'bot');
            }
        } catch (err) {
            divLoading.remove();
            themTinNhanMoi("⚠️ Cổng AI đang bận xử lý, bạn vui lòng gửi lại từ này một lần nữa nhé!", 'bot');
        }
    }

    // Sự kiện bấm nút gửi hoặc gõ Enter
    nutGuiTin.addEventListener('click', xuLyGuiTin);
    oNhapLieu.addEventListener('keypress', (e) => { if (e.key === 'Enter') xuLyGuiTin(); });
})();
