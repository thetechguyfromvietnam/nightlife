# Hướng dẫn tích hợp Google Sheets

Khi khách hàng nhấn nút "Build Itinerary", dữ liệu booking sẽ tự động được gửi vào Google Sheets.

## Các bước thiết lập:

### Bước 1: Tạo Google Sheet
1. Mở [Google Sheets](https://sheets.google.com)
2. Tạo một sheet mới hoặc sử dụng sheet có sẵn
3. Copy **Spreadsheet ID** từ URL (phần giữa `/d/` và `/edit`)
   - Ví dụ: `https://docs.google.com/spreadsheets/d/ABC123XYZ/edit`
   - Spreadsheet ID là: `ABC123XYZ`

### Bước 2: Tạo Google Apps Script
1. Trong Google Sheet, vào **Extensions** > **Apps Script**
2. Xóa code mặc định
3. Copy toàn bộ code từ file `google-apps-script.js` và paste vào
4. Thay đổi 2 giá trị sau:
   ```javascript
   const SPREADSHEET_ID = 'ABC123XYZ' // Thay bằng Spreadsheet ID của bạn
   const SHEET_NAME = 'Bookings' // Tên sheet tab (có thể đổi tên khác)
   ```
5. Lưu project: **File** > **Save** (hoặc Ctrl+S)
6. Đặt tên project (ví dụ: "Nightlife Booking Handler")

### Bước 3: Deploy Web App
1. Click **Deploy** > **New deployment**
2. Click biểu tượng bánh răng ⚙️ bên cạnh "Select type"
3. Chọn **Web app**
4. Điền thông tin:
   - **Description**: "Nightlife Booking Handler" (tùy chọn)
   - **Execute as**: **Me** (your-email@gmail.com)
   - **Who has access**: **Anyone** (quan trọng!)
5. Click **Deploy**
6. Lần đầu tiên sẽ yêu cầu **Authorize access**:
   - Click **Authorize access**
   - Chọn tài khoản Google của bạn
   - Click **Advanced** > **Go to [project name] (unsafe)**
   - Click **Allow**
7. Copy **Web App URL** (sẽ có dạng: `https://script.google.com/macros/s/ABC.../exec`)

### Bước 4: Cấu hình trong project
1. Tạo file `.env` trong thư mục gốc của project (nếu chưa có)
2. Thêm dòng sau vào file `.env`:
   ```
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
   (Thay `YOUR_SCRIPT_ID` bằng URL bạn đã copy ở bước 3)
3. Lưu file `.env`
4. **Khởi động lại** dev server nếu đang chạy:
   ```bash
   npm run dev
   ```

### Bước 5: Test
1. Mở website và điền form booking
2. Nhấn nút "Build Itinerary"
3. Kiểm tra Google Sheet - dữ liệu sẽ xuất hiện trong sheet "Bookings"

## Cấu trúc dữ liệu trong Google Sheet

Sheet sẽ có các cột sau:
- **Timestamp**: Thời gian gửi booking
- **Customer Name**: Tên khách hàng
- **Phone Number**: Số điện thoại (đầy đủ với mã quốc gia)
- **City**: Thành phố
- **Date**: Ngày booking (đã format)
- **Group Size**: Số lượng khách
- **Music Focus**: Dòng nhạc đã chọn
- **Bars Count**: Số lượng bar/club đã chọn
- **Bars List**: Danh sách bar/club và giờ đến
- **Language**: Ngôn ngữ (en/vi)

## Lưu ý

- Nếu không cấu hình `VITE_GOOGLE_SCRIPT_URL`, hệ thống vẫn hoạt động bình thường nhưng không gửi dữ liệu vào Google Sheets (chỉ gửi WhatsApp)
- Dữ liệu sẽ được ghi vào sheet ngay khi khách nhấn "Build Itinerary"
- Mỗi booking sẽ tạo một dòng mới trong sheet

## Troubleshooting

**Lỗi: "Google Sheets URL not configured"**
- Kiểm tra file `.env` đã có `VITE_GOOGLE_SCRIPT_URL` chưa
- Đảm bảo đã khởi động lại dev server sau khi thêm biến môi trường

**Dữ liệu không xuất hiện trong Google Sheet**
- Kiểm tra Spreadsheet ID trong Google Apps Script có đúng không
- Kiểm tra quyền truy cập Web App đã set là "Anyone" chưa
- Kiểm tra Console trong browser (F12) xem có lỗi gì không

**Lỗi authorization**
- Đảm bảo đã authorize đầy đủ khi deploy
- Có thể cần deploy lại và authorize lại

