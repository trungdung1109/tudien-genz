// File này hoạt động độc lập, chỉ xử lý nút đóng góp, không chạm vào bộ tra cứu!
document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById('submit-btn');
    const newWord = document.getElementById('new-word');
    const newCategory = document.getElementById('new-category');
    const newStandard = document.getElementById('new-standard');
    const newMeaning = document.getElementById('new-meaning');
    const newContext = document.getElementById('new-context');
    const newAdvice = document.getElementById('new-advice');

    if (!submitBtn) return; // Nếu không tìm thấy nút bấm thì dừng lại luôn

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

        // Định dạng dữ liệu biểu mẫu
        const formData = new URLSearchParams();
        formData.append('word', wordText);
        formData.append('category', categoryText);
        formData.append('standard', standardText);
        formData.append('meaning', meaningText);
        formData.append('context', contextText);
        formData.append('advice', adviceText);

        submitBtn.innerText = "ĐANG GỬI LÊN VŨ TRỤ...";
        submitBtn.disabled = true;

        // Đường link API đã được bảo trì chuẩn chỉnh của bạn
        const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/AKfycbwTnsbJq7KxySzZCQb9E7rhLcuqerJvVAqEws9gHMe6BZg74g69D7PCVwkA90U7BYzX/exec";

        fetch(GOOGLE_SHEET_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString()
        })
        .then(() => {
            alert(`Gửi thành công từ "${wordText}" lên vũ trụ! Hãy kiểm tra dòng 355 trên Google Sheets xem chữ đã nhảy về chưa nhé! ✨`);
            newWord.value = ""; newCategory.value = ""; newStandard.value = "";
            newMeaning.value = ""; newContext.value = ""; newAdvice.value = "";
        })
        .catch(error => {
            console.error("Lỗi:", error);
            alert("Có lỗi xảy ra, nhưng bạn cứ check thử Google Sheets xem chữ vào chưa nhé!");
        })
        .finally(() => {
            submitBtn.innerText = "GỬI LÊN VŨ TRỤ (CHỜ DUYỆT)";
            submitBtn.disabled = false;
        });
    });
});