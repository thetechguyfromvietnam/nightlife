/**
 * Google Apps Script để nhận dữ liệu booking và ghi vào Google Sheet
 * 
 * HƯỚNG DẪN SETUP:
 * 1. Mở Google Sheets và tạo một sheet mới (hoặc dùng sheet có sẵn)
 * 2. Vào Extensions > Apps Script
 * 3. Xóa code mặc định và paste code này vào
 * 4. Thay đổi SPREADSHEET_ID và SHEET_NAME ở dưới
 * 5. Lưu project (File > Save)
 * 6. Deploy > New deployment
 * 7. Chọn type: Web app
 * 8. Execute as: Me
 * 9. Who has access: Anyone
 * 10. Click Deploy
 * 11. Copy Web App URL và paste vào file .env với key VITE_GOOGLE_SCRIPT_URL
 */

// THAY ĐỔI CÁC GIÁ TRỊ NÀY:
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE' // Lấy từ URL của Google Sheet
const SHEET_NAME = 'Data Khách Hàng Booking Bar' // Tên của sheet tab

function doPost(e) {
  try {
    // Kiểm tra SPREADSHEET_ID
    if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: 'SPREADSHEET_ID chưa được cấu hình. Vui lòng thay đổi trong Google Apps Script.' 
      }))
        .setMimeType(ContentService.MimeType.JSON)
    }
    
    // Parse JSON data từ request
    let data
    try {
      data = JSON.parse(e.postData.contents)
    } catch (parseError) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: 'Lỗi parse JSON: ' + parseError.toString() 
      }))
        .setMimeType(ContentService.MimeType.JSON)
    }
    
    // Mở Google Sheet
    let spreadsheet
    try {
      spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
    } catch (openError) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: 'Không thể mở Google Sheet. Kiểm tra SPREADSHEET_ID: ' + openError.toString() 
      }))
        .setMimeType(ContentService.MimeType.JSON)
    }
    
    // Tìm hoặc tạo sheet
    let sheet = spreadsheet.getSheetByName(SHEET_NAME)
    
    // Nếu sheet chưa tồn tại, tạo mới
    if (!sheet) {
      try {
        sheet = spreadsheet.insertSheet(SHEET_NAME)
        setupHeaders(sheet)
      } catch (createError) {
        return ContentService.createTextOutput(JSON.stringify({ 
          success: false, 
          error: 'Không thể tạo sheet mới: ' + createError.toString() 
        }))
          .setMimeType(ContentService.MimeType.JSON)
      }
    }
    
    // Kiểm tra xem header đã có chưa, nếu chưa thì tạo
    if (sheet.getLastRow() === 0) {
      setupHeaders(sheet)
    }
    
    // Format phone number - clean và đảm bảo format đúng
    let formattedPhone = ''
    if (data.fullPhone) {
      // Sử dụng fullPhone nếu có, loại bỏ khoảng trắng thừa
      formattedPhone = data.fullPhone.toString().replace(/\s+/g, ' ').trim()
    } else if (data.phoneCountryCode && data.phoneNumber) {
      // Ghép country code và phone number, loại bỏ khoảng trắng thừa
      const cleanCode = data.phoneCountryCode.toString().trim()
      const cleanNumber = data.phoneNumber.toString().replace(/[\s\-\(\)\.]/g, '').trim()
      formattedPhone = cleanCode + cleanNumber
    } else if (data.phoneCountryCode) {
      formattedPhone = data.phoneCountryCode.toString().trim()
    } else if (data.phoneNumber) {
      formattedPhone = data.phoneNumber.toString().replace(/[\s\-\(\)\.]/g, '').trim()
    }
    
    // Chuẩn bị dữ liệu để ghi vào sheet
    const rowData = [
      data.timestamp || new Date().toISOString(),
      (data.customerName || '').toString().trim(),
      formattedPhone,
      (data.city || '').toString().trim(),
      (data.date || '').toString().trim(),
      data.groupSize || '',
      (data.musicFocus || '').toString().trim(),
      data.barsCount || 0,
      (data.barsList || '').toString().trim(),
      (data.language || 'en').toString().trim(),
    ]
    
    // Ghi dữ liệu vào sheet
    try {
      sheet.appendRow(rowData)
    } catch (appendError) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: 'Không thể ghi dữ liệu vào sheet: ' + appendError.toString() 
      }))
        .setMimeType(ContentService.MimeType.JSON)
    }
    
    // Trả về response thành công
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      message: 'Data saved successfully',
      rowNumber: sheet.getLastRow()
    }))
      .setMimeType(ContentService.MimeType.JSON)
      
  } catch (error) {
    // Trả về lỗi nếu có
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: 'Lỗi không xác định: ' + error.toString(),
      stack: error.stack
    }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

// Hàm tạo header cho sheet
function setupHeaders(sheet) {
  const headers = [
    'Timestamp',
    'Customer Name',
    'Phone Number',
    'City',
    'Date',
    'Group Size',
    'Music Focus',
    'Bars Count',
    'Bars List',
    'Language',
  ]
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length)
  headerRange.setFontWeight('bold')
  headerRange.setBackground('#4285f4')
  headerRange.setFontColor('#ffffff')
  
  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i)
  }
}

// Hàm test để kiểm tra kết nối (optional)
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ 
    success: true, 
    message: 'Google Apps Script is working!' 
  }))
    .setMimeType(ContentService.MimeType.JSON)
}

