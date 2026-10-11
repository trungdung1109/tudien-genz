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
function displayWordDetails(item) {
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
