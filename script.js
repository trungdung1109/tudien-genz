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
// KHỐI ĐIỀU KHIỂN HỢP NHẤT CHỐNG XUNG ĐỘT (DÁN THAY THẾ Ở CUỐI FILE SCRIPT.JS)
// =========================================================================

// 1. Hàm đóng gói và hiển thị dữ liệu lên bảng màu mẫu của bạn
function hienThiKetQuaAI(tuWord, noiDungNghia) {
    const aiMockItem = {
        word: tuWord,
        category: "🤖 AI Giải Mã Tự Do",
        standard: "Thuật ngữ mạng mới",
        meaning: noiDungNghia, 
        context: "Ngữ cảnh MXH mới cập nhật",
        advice: "Sử dụng vui vẻ với bạn bè, lưu ý không lạm dụng trong văn bản hành chính.",
        status: "Đã duyệt bởi AI",
        warning_light: "Vàng"
    };
    if (typeof displayWordDetails === 'function') {
        displayWordDetails(aiMockItem);
    }
}

// 2. Tạo một nút bấm mới đè lên sự kiện cũ để chặn hoàn toàn thông báo "Không tìm thấy"
if (searchBtn) {
    // Nhân bản nút để xóa bỏ hoàn toàn tất cả các sự kiện (click event) cũ bám trên nút này
    const newSearchBtn = searchBtn.cloneNode(true);
    searchBtn.parentNode.replaceChild(newSearchBtn, searchBtn);
    
    // Gán lại biến searchBtn bằng nút mới tinh
    searchBtn = newSearchBtn;

    // Thiết lập sự kiện click chuột duy nhất và tối ưu nhất
    searchBtn.addEventListener('click', async () => {
        const query = searchInput.value.trim().toLowerCase();
        if (!currentDictionary) return;
        
        // Bước A: Tìm trong kho 600 từ có sẵn
        const found = currentDictionary.find(item => item.word.toLowerCase() === query);
        
        if (found) {
            // Có từ sẵn -> Gọi hàm hiển thị mượt mà cũ của bạn
            displayWordDetails(found);
        } else if (query !== "") {
            // Bước B: Nếu là từ MỚI -> Bật màn hình chờ AI lập tức
            resultBox.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: #fff;">
                    <div style="border: 4px solid rgba(255,255,255,0.1); border-left-color: #ffee58; border-radius: 50%; width: 35px; height: 35px; animation: hfSpin 1s linear infinite; margin: 0 auto 15px auto;"></div>
                    <p style="font-size: 16px; color: #ffee58;">🔍 Đang kết nối Trợ lý AI để giải mã từ tự do: "<strong>${searchInput.value.trim()}</strong>"...</p>
                    <p style="font-size: 13px; color: #bbb; margin-top: 5px;">Mô hình chuyên dụng đang phân tích ngữ cảnh, vui lòng đợi trong giây lát!</p>
                </div>
                <style>@keyframes hfSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
            `;
            
            // Gọi trực tiếp API Hugging Face (Mô hình Llama 3 siêu tốc, hiểu tiếng Việt cực tốt)
            try {
                const response = await fetch("https://huggingface.co", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        inputs: `<|begin_of_text|><|start_header_id|>user<|end_header_id|>\nBạn là một chuyên gia ngôn ngữ học giải mã từ lóng GenZ Việt Nam. Hãy giải nghĩa chi tiết, phân tích tâm lý ngắn gọn, giải thích bản chất cho từ sau: "${searchInput.value.trim()}". Đưa ra lời khuyên sử dụng văn minh phù hợp học đường và gia đình.<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n`
                    })
                });
                
                const result = await response.json();
                let textAI = "";
                
                // Bóc tách văn bản phản hồi từ API
                if (Array.isArray(result) && result[0] && result[0].generated_text) {
                    textAI = result[0].generated_text;
                } else if (result && result.generated_text) {
                    textAI = result.generated_text;
                }
                
                if (textAI) {
                    const parts = textAI.split("<|start_header_id|>assistant<|end_header_id|>\n");
                    const cauTraLoiCuoi = parts[parts.length - 1].replace("<|eot_id|>", "").trim();
                    hienThiKetQuaAI(searchInput.value.trim(), cauTraLoiCuoi);
                } else {
                    resultBox.innerHTML = `<p style="text-align:center; padding:20px; color:#ff4d4d;">⚠️ Máy chủ AI đang bận, bạn vui lòng bấm "TRA CỨU" lại lần nữa nhé!</p>`;
                }
            } catch (err) {
                resultBox.innerHTML = `<p style="text-align:center; padding:20px; color:#ff4d4d;">⚠️ Không thể kết nối với AI. Vui lòng kiểm tra mạng internet!</p>`;
            }
        }
    });
}
