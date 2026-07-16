// JavaScript for Salary Verification Web Application

// App State
let state = {
    language: 'en',
    employeeName: "พนักงานตัวอย่าง (กะดึก -> กะเช้า)",
    employeeTeam: 'Audit',
    currentUser: null,
    loadedHistoryId: null,
    hasChosenMonth: false,
    adminAuthenticated: false,
    exchangeRate: 35.0,
    baseSalary: 23000,
    isProbation: false,
    isMidMonthStart: false,
    midMonthExtraDays: 0,
    shiftType: 'night', // 'day' or 'night'
    shiftMode: 'night_to_day', // 'pure_day', 'pure_night', 'day_to_night', 'night_to_day'
    dayShiftStartDate: '',
    nightShiftOffDate: '2026-05-20',
    nightShiftTransitionDate: '2026-05-21',
    diligentAllowance: 1550,
    nightShiftAllowanceRate: 10.25,
    attendanceDeductionRate: 0,
    hireDate: '',
    holidays: [
        { date: '', type: 'compulsory' },
        { date: '', type: 'off' },
        { date: '', type: 'off' },
        { date: '', type: 'off' },
        { date: '', type: 'off' }
    ],
    month: '2026-05',
    attendanceLogs: [],
    adjustments: {
        base: { amount: 0, note: "" },
        probation: { amount: 0, note: "" },
        extra: { amount: 0, note: "" },
        unpaid: { amount: 0, note: "" },
        attendance: { amount: 0, note: "" },
        diligent: { amount: 0, note: "" },
        night: { amount: 0, note: "" },
        net: { amount: 0, note: "" }
    },
    payslipData: {
        baseSalary: 0,
        diligent: 0,
        nightShift: 0,
        probationDeduct: 0,
        unpaidDeduct: 0,
        attendanceDeduct: 0,
        extraWorkPay: 0,
        netSalary: 0
    },
    pendingTimesheetFile: null,
    pendingPayslipFile: null,
    timezone: 'Bangkok',
    rulesBefore: {
        dayStart: '08:00',
        dayEnd: '20:00',
        nightStart: '20:00',
        nightEnd: '08:00'
    },
    hasTimeChange: true,
    timeChangeDate: '2026-05-25',
    rulesAfter: {
        dayStart: '09:00',
        dayEnd: '21:00',
        nightStart: '21:00',
        nightEnd: '09:00'
    },
    disputeStatus: 'none', // 'none', 'pending', 'resolved', 'pending_hr'
    adminComment: ''
};// Localization Dictionary
const translationSelectorMap = {
    // Sidebar
    ".sidebar-logo h2": { en: "Salary Check", zh: "薪資核對", th: "ตรวจสอบเงินเดือน" },
    "[data-tab='dashboard']": { en: "<i class='fa-solid fa-chart-pie'></i> Dashboard Summary", zh: "<i class='fa-solid fa-chart-pie'></i> 儀表板摘要", th: "<i class='fa-solid fa-chart-pie'></i> แดชบอร์ดสรุปผล" },
    "[data-tab='config']": { en: "<i class='fa-solid fa-sliders'></i> Calculation Settings", zh: "<i class='fa-solid fa-sliders'></i> 計算設定", th: "<i class='fa-solid fa-sliders'></i> ตั้งค่าการคำนวณ" },
    "[data-tab='attendance']": { en: "<i class='fa-solid fa-calendar-days'></i> Work Schedule", zh: "<i class='fa-solid fa-calendar-days'></i> 工作時間表", th: "<i class='fa-solid fa-calendar-days'></i> ตารางเวลางาน" },
    "[data-tab='payslip-ocr']": { en: "<i class='fa-solid fa-file-invoice-dollar'></i> Upload & Verify", zh: "<i class='fa-solid fa-file-invoice-dollar'></i> 上傳與驗證", th: "<i class='fa-solid fa-file-invoice-dollar'></i> อัปโหลดและตรวจสอบ" },
    "[data-tab='tests']": { en: "<i class='fa-solid fa-vial'></i> Formula Tests", zh: "<i class='fa-solid fa-vial'></i> 公式測試結果", th: "<i class='fa-solid fa-vial'></i> ผลการทดสอบสูตร" },
    "#load-demo-btn": { en: "<i class='fa-solid fa-wand-magic-sparkles'></i> Load Demo Data", zh: "<i class='fa-solid fa-wand-magic-sparkles'></i> 載入測試數據", th: "<i class='fa-solid fa-wand-magic-sparkles'></i> โหลดข้อมูลทดสอบ (Demo)" },
    ".theme-toggle span": { en: "Dark Mode", zh: "深色模式", th: "โหมดมืด" },
    
    // Top bar subtitle
    ".topbar-title p.subtitle": { 
        en: "Automated employee attendance calculation and payslip verification system.", 
        zh: "自動化員工考勤計算與薪資單核對系統。", 
        th: "ระบบคำนวณและตรวจสอบส่วนต่างสลิปเงินเดือนพนักงานโดยอัตโนมัติ" 
    },
    
    // TAB 1: Dashboard Summaries
    "#tab-dashboard .dashboard-grid > div:nth-child(1) h6": { en: "Slip Comparison Result", zh: "薪資單比對結果", th: "ผลการเปรียบเทียบสลิป" },
    "#tab-dashboard .dashboard-grid > div:nth-child(2) h6": { en: "Calculated Actual Salary", zh: "實際計算薪資", th: "ยอดคำนวณจากเวลางานจริง" },
    "#tab-dashboard .dashboard-grid > div:nth-child(2) p": { en: "Net salary after all deductions and allowances", zh: "實發金額已含所有扣款與津貼", th: "เงินเดือนสุทธิหลังจากหักและเพิ่มสิทธิ์ต่างๆ" },
    "#tab-dashboard .dashboard-grid > div:nth-child(3) h6": { en: "Payslip Net Salary", zh: "薪資單實發金額", th: "ยอดเงินตามสลิปเงินเดือน" },
    "#tab-dashboard .dashboard-grid > div:nth-child(3) p": { en: "Net amount extracted from uploaded payslip image", zh: "上傳的薪資單圖片所讀取的實發金額", th: "ยอดเงินสุทธิที่ได้จากรูปสลิปหรือการระบุข้อมูล" },
    "#tab-dashboard .dashboard-grid > div:nth-child(4) h6": { en: "Detected Discrepancy", zh: "檢測到的差異", th: "ส่วนต่างที่พบ" },
    "#tab-dashboard .dashboard-grid > div:nth-child(4) p": { en: "(+ values: overpaid, - values: underpaid)", zh: "(正值表示公司多付，負值表示少付)", th: "ส่วนต่างสุทธิ (ค่าบวก: สลิปได้มากกว่า, ค่าลบ: ได้น้อยกว่า)" },
    
    // TAB 1: Main analysis details
    "#tab-dashboard .col-8 .card-header h3": { en: "<i class='fa-solid fa-magnifying-glass-dollar text-primary'></i> In-depth Comparison Report", zh: "<i class='fa-solid fa-magnifying-glass-dollar text-primary'></i> 深度比對報告", th: "<i class='fa-solid fa-magnifying-glass-dollar text-primary'></i> รายละเอียดการเปรียบเทียบเชิงลึก" },
    "#save-comparison-btn": { en: "<i class='fa-solid fa-floppy-disk'></i> Save Verification Record", zh: "<i class='fa-solid fa-floppy-disk'></i> 儲存驗證記錄", th: "<i class='fa-solid fa-floppy-disk'></i> บันทึกข้อมูลประวัติลงบอร์ด" },
    
    // TAB 1: History Sidebar
    "#tab-dashboard .col-4 .card-header h3": { en: "<i class='fa-solid fa-calendar-check text-success'></i> Summary & Allowances", zh: "<i class='fa-solid fa-calendar-check text-success'></i> 假期與特許摘要", th: "<i class='fa-solid fa-calendar-check text-success'></i> สรุปวันหยุดและสิทธิ์พิเศษ" },
    
    // TAB 2: Config Settings
    "#tab-config .row > div:nth-child(1) .card-header h3": { en: "<i class='fa-solid fa-sliders text-primary'></i> Payroll Configuration", zh: "<i class='fa-solid fa-sliders text-primary'></i> 薪資計算設定", th: "<i class='fa-solid fa-sliders text-primary'></i> ตั้งค่าการตรวจสอบ" },
    "#tab-config label[for='employee-name-input']": { en: "Employee Name:", zh: "員工姓名：", th: "ชื่อ-นามสกุล พนักงานที่ตรวจสอบ:" },
    "#tab-config label[for='base-salary-input']": { en: "Employee Base Salary (THB):", zh: "員工基本薪資 (THB)：", th: "ฐานเงินเดือนพนักงาน (บาท):" },
    "#tab-config label[for='config-hire-date']": { en: "Hire Date:", zh: "入職日期：", th: "วันเริ่มทำงาน (Hire Date):" },
    "#tab-config label[for='config-hire-date'] + small": { en: "*Used for 15% new staff deposit and cash-conversion off-days", zh: "*用於計算 15% 保證金和公休天數折現", th: "ใช้สำหรับการคำนวณหักเงินประกันพนักงานใหม่ 15% และสิทธิ์สะสมวันหยุดเปลี่ยนเป็นเงิน" },
    "#tab-config label[for='probation-checkbox']": { en: "New staff deposit (New staff deposit)", zh: "新員工保證金 (New staff deposit)", th: "พนักงานใหม่ (New staff deposit)" },
    "#tab-config label[for='probation-checkbox'] + small": { en: "*Deduct 15% new staff deposit from base salary for 3 months", zh: "*扣除 15% 新員工保證金，為期 3 個月", th: "หักเงินประกันพนักงานใหม่ 15% จากฐานเงินเดือน เป็นระยะเวลา 3 เดือน" },
    "#tab-config label[for='midmonth-checkbox']": { en: "Mid-month Start Shift Offset (Started mid-month)", zh: "月中入職工作日偏移 (月中開始上班)", th: "พนักงานเริ่มงานไม่เต็มเดือน" },
    "#tab-config label[for='midmonth-checkbox'] + small": { en: "*Automatically forfeits diligent allowance", zh: "*หมดสิทธิ์ได้เบี้ยขยันโดยอัตโนมัติ", th: "หมดสิทธิ์ได้เบี้ยขยันโดยอัตโนมัติ" },
    "#tab-config label[for='midmonth-days']": { en: "Extra days worked in mid-month first period:", zh: "第一階段月中額外工作天數：", th: "จำนวนวันทำงานไม่เต็มเดือนช่วงแรก:" },
    "#tab-config label[for='shift-type-select']": { en: "Employee Work Shift:", zh: "員工工作班次：", th: "กะทำงานของพนักงาน:" },
    "#tab-config label[for='config-day-start-date']": { en: "Day Shift Start Date (e.g. 22nd):", zh: "白班開始日期（例如：22日）：", th: "วันที่เริ่มต้นทำงานกะเช้า:" },
    "#tab-config label[for='config-night-off-date']": { en: "Night Shift Off-Day Date (e.g. 20th):", zh: "夜班休息日日期（例如：20日）：", th: "วันหยุดกะดึกประจำเดือน:" },
    "#tab-config label[for='config-night-transition-date']": { en: "Shift Transition Date (Transition to Day Shift):", zh: "班次轉換日期（轉為白班）：", th: "วันที่เปลี่ยนกะมาเป็นกะเช้าวันแรก:" },
    "#label-day-shift-start-date": { en: "First Day of Night Shift Transition:", zh: "首日轉入夜班日期：", th: "วันที่เริ่มเข้ากะดึกเป็นวันแรก:" },
    "#desc-day-shift-start-date": { en: "*Employee will be on day shift from the 1st and transition to night shift starting from this date.", zh: "*員工將自1日起值白班，自此日期起轉為夜班。", th: "*พนักงานจะเป็นกะเช้าตั้งแต่วันที่ 1 และจะเปลี่ยนเป็นกะดึกตั้งแต่วันที่ระบุเป็นต้นไป" },
    
    // TAB 2: System Settings
    "#tab-config .row > div:nth-child(2) .card-header h3": { en: "<i class='fa-solid fa-gears text-warning'></i> Compensation Constants", zh: "<i class='fa-solid fa-gears text-warning'></i> 補償與考勤常數設定", th: "<i class='fa-solid fa-gears text-warning'></i> ค่าเบี้ยขยันและเบี้ยเลี้ยง (ตั้งค่าระบบ)" },
    "#tab-config label[for='config-diligent-allowance']": { en: "Fixed Diligent Allowance (THB/month):", zh: "固定全勤獎金 (THB/月)：", th: "ค่าเบี้ยขยันคงที่ (บาทต่อเดือน):" },
    "#tab-config label[for='config-nightshift-allowance']": { en: "Night Shift Allowance Rate per Hour (THB/hour) (Fixed):", zh: "夜班津貼每小時費率 (THB/小時) (固定)：", th: "อัตราค่าเบี้ยเลี้ยงกะดึกต่อชั่วโมง (บาท) (ตายตัว):" },
    "#config-nightshift-allowance-desc": { en: "Fixed rate of 10.25 THB/hour calculated from 00:00 to configured team night shift end time (e.g. 8h * 10.25 = 82 THB), independent of clock-out logs.", zh: "固定費率為每小時 10.25 元，從午夜 00:00 計算至設定的夜班下班時間（例如 8 小時 x 10.25 = 82 元），不依據實際打卡下班時間。", th: "อัตราค่าเบี้ยเลี้ยงคงที่ 10.25 บาทต่อชั่วโมง โดยจะคำนวณตั้งแต่เวลา เที่ยงคืน (00:00) ไปจนถึง เวลาเลิกกะดึกของแต่ละทีมตามกฎการตั้งค่า (เช่น กะดึกเลิก 08:00AM = 8 ชั่วโมง x 10.25 = 82 บาท) โดยไม่ขึ้นกับประวัติสแกนออกจริง" },
    "#update-report-btn": { en: "<i class='fa-solid fa-arrows-rotate'></i> Update Report", zh: "<i class='fa-solid fa-arrows-rotate'></i> 更新報告", th: "<i class='fa-solid fa-arrows-rotate'></i> อัปเดตรายงาน" },
    "#tab-config h5.border-bottom": { en: "Attendance Deduction Rates (Fixed)", zh: "考勤扣款率 (固定)", th: "อัตราหักปรับของบันทึกเวลา (Attendance Deduction) (ตายตัว):" },
    "#tab-config label[for='config-incomplete-rate']": { en: "Incomplete Clock-in/out (USD/day):", zh: "打卡不完整 (USD/天)：", th: "สแกนไม่ครบ (Incomplete) (USD/วัน):" },
    "#tab-config label[for='config-late-rate']": { en: "Lateness / Late (USD/time):", zh: "遲到 (USD/次)：", th: "เข้างานสาย (Late) (USD/ครั้ง):" },
    "#tab-config label[for='config-partialday-rate']": { en: "Partial Day / Half-day (THB/day):", zh: "部分工時 / 半天 (THB/天)：", th: "ทำงานบางส่วน (Partialday) (บาท/วัน):" },
    "#tab-config h5.mt-4:not(.border-bottom)": { en: "<i class='fa-solid fa-calendar-check'></i> Monthly Registered Holidays (Max 5)", zh: "<i class='fa-solid fa-calendar-check'></i> 當月登記節假日 (最多 5 天)", th: "วันหยุดประจำเดือนในระบบ (สูงสุด 5 วัน)" },
    "#tab-config h5.mt-4:not(.border-bottom) + small": { en: "*Prevent salary deduction and track off-days", zh: "*避免薪資扣款並追蹤休假天數", th: "ระบุวันที่วันหยุดในระบบ เพื่อใช้ทำเครื่องหมายสถานะไม่หักเงินเดือนอัตโนมัติ และสิทธิ์รับเงินคืน" },
    "#tab-config h5.mt-4.border-top": { en: "Work Shift Rules", zh: "排班規則", th: "กฎระเบียบเวลาเข้าออกงาน (Work Shift Rules)" },
    "#tab-config label[for='config-timezone']": { en: "Payroll Timezone:", zh: "薪資計算時區：", th: "โซนเวลาคำนวณเงินเดือน (Payroll Timezone):" },
    "#clear-settings-btn": { en: "<i class='fa-solid fa-rotate-left mr-2'></i> Clear Configuration", zh: "<i class='fa-solid fa-rotate-left mr-2'></i> 清除設定", th: "<i class='fa-solid fa-rotate-left mr-2'></i> ล้างการตั้งค่า (Clear)" },
    "#save-settings-btn": { en: "<i class='fa-solid fa-floppy-disk mr-2'></i> Save & Calculate", zh: "<i class='fa-solid fa-floppy-disk mr-2'></i> 儲存並計算", th: "<i class='fa-solid fa-floppy-disk mr-2'></i> บันทึกข้อมูลและประมวลผล (Save & Calculate)" },
    
    // TAB 3: Attendance Grid
    "#tab-attendance .card-header h3": { en: "<i class='fa-solid fa-calendar-days text-primary'></i> Work Schedule Details", zh: "<i class='fa-solid fa-calendar-days text-primary'></i> 工作時間表詳情", th: "<i class='fa-solid fa-calendar-days text-primary'></i> รายละเอียดบันทึกเวลาและการทำงาน" },
    "#add-row-btn": { en: "<i class='fa-solid fa-plus'></i> Add Row", zh: "<i class='fa-solid fa-plus'></i> 新增行", th: "<i class='fa-solid fa-plus'></i> เพิ่มแถวข้อมูลวันทำงาน" },
    "#reset-attendance-btn": { en: "<i class='fa-solid fa-rotate-left'></i> Reset All Logs", zh: "<i class='fa-solid fa-rotate-left'></i> 重設所有考勤", th: "<i class='fa-solid fa-rotate-left'></i> ล้างเวลางานทั้งหมด" },
    "#timesheet-upload-zone strong": { en: "Upload Employee Work Log File", zh: "上傳員工考勤打卡文件", th: "อัปโหลดไฟล์บันทึกเวลาทำงานพนักงาน" },
    "#timesheet-upload-zone span.text-muted": { en: "Supports CSV, Excel (.xlsx, .xls), TXT, JSON", zh: "支援 CSV, Excel (.xlsx, .xls), TXT, JSON", th: "รองรับไฟล์ CSV, Excel (.xlsx, .xls), TXT, JSON" },
    "#timesheet-upload-zone button.btn-primary": { en: "<i class='fa-solid fa-folder-open'></i> Select File", zh: "<i class='fa-solid fa-folder-open'></i> 選擇文件", th: "<i class='fa-solid fa-folder-open'></i> เลือกไฟล์เวลางาน" },
    "#clear-timesheet-btn": { en: "<i class='fa-solid fa-trash-can'></i> Clear", zh: "<i class='fa-solid fa-trash-can'></i> 清除", th: "<i class='fa-solid fa-trash-can'></i> ล้างไฟล์" },
    "#download-csv-template": { en: "<i class='fa-solid fa-download'></i> Download CSV Report", zh: "<i class='fa-solid fa-download'></i> 下載 CSV 報表", th: "<i class='fa-solid fa-download'></i> ดาวน์โหลดตารางตรวจสอบ CSV" },
    
    // TAB 4: Upload Payslip
    "#tab-payslip-ocr .col-6:nth-child(1) .card-header h3": { en: "<i class='fa-solid fa-upload text-primary'></i> 1. Upload Payslip Image", zh: "<i class='fa-solid fa-upload text-primary'></i> 1. 上傳薪資單圖片", th: "<i class='fa-solid fa-upload text-primary'></i> 1. อัปโหลดสลิปเงินเดือนพนักงาน" },
    "#payslip-upload-zone h4": { en: "Upload Employee Payslip (Pay Slip)", zh: "上傳員工薪資單 (Pay Slip)", th: "อัปโหลดไฟล์สลิปเงินเดือน (Pay Slip)" },
    "#payslip-upload-zone p": { en: "Supports Images (PNG, JPG, JPEG) and PDF", zh: "支援圖片 (PNG, JPG, JPEG) 與 PDF", th: "รองรับรูปภาพ (.png, .jpg, .jpeg) และ PDF ทุกนามสกุล" },
    "#payslip-upload-zone button.btn-warning": { en: "Select Payslip File", zh: "選擇薪資單文件", th: "เลือกไฟล์สลิปเงินเดือน" },
    "#clear-payslip-file-btn": { en: "<i class='fa-solid fa-trash-can'></i> Clear File", zh: "<i class='fa-solid fa-trash-can'></i> 清除文件", th: "<i class='fa-solid fa-trash-can'></i> ล้างไฟล์" },
    
    // TAB 4: Right simulated payslip data
    "#tab-payslip-ocr .col-6:nth-child(2) .card-header h3": { en: "<i class='fa-solid fa-file-invoice-dollar text-warning'></i> 2. Employee Payslip Data", zh: "<i class='fa-solid fa-file-invoice-dollar text-warning'></i> 2. 員工薪資單數據", th: "<i class='fa-solid fa-file-invoice-dollar text-warning'></i> 2. ข้อมูลจากสลิปเงินเดือนพนักงาน" },
    "#view-payslip-img-btn": { en: "<i class='fa-solid fa-image'></i> Slip Image", zh: "<i class='fa-solid fa-image'></i> 薪資單圖片", th: "<i class='fa-solid fa-image'></i> รูปภาพสลิป" },
    "#view-payslip-mock-btn": { en: "<i class='fa-solid fa-table-list'></i> Simulated Slip", zh: "<i class='fa-solid fa-table-list'></i> 模擬薪資單", th: "<i class='fa-solid fa-table-list'></i> รายการสลิปจำลอง" },
    "#clear-payslip-data-btn": { en: "<i class='fa-solid fa-eraser'></i> Clear Slip Data", zh: "<i class='fa-solid fa-eraser'></i> 清除薪資數據", th: "[ ล้างข้อมูล ]" },
    
    // Simulated Slip fields
    "label[for='payslip-base-salary']": { en: "Base Salary (THB):", zh: "基本薪資 (THB)：", th: "เงินเดือนพื้นฐาน (บาท):" },
    "label[for='payslip-diligent']": { en: "Slip Diligent Allowance (THB):", zh: "薪資單全勤獎金 (THB)：", th: "เบี้ยขยันในสลิป (บาท):" },
    "label[for='payslip-night-allowance']": { en: "Slip Night Shift Allowance (THB):", zh: "薪資單夜班津貼 (THB)：", th: "เบี้ยเลี้ยงกะดึกในสลิป (บาท):" },
    "label[for='payslip-probation']": { en: "New staff deposit (15%):", zh: "新員工保證金 (15%)：", th: "New staff deposit (15%):" },
    "label[for='payslip-unpaid-leave']": { en: "Unpaid Leave (THB):", zh: "事假扣款 (THB)：", th: "Unpaid leave (บาท):" },
    "label[for='payslip-attendance-deduct']": { en: "Attendance Deduct (THB):", zh: "考勤扣款 (THB)：", th: "Attendance Deduct (บาท):" },
    "label[for='payslip-extra-work']": { en: "Mid-month Additions (THB):", zh: "月中入職加薪 (THB)：", th: "บวกเพิ่มวันทำงานไม่เต็มเดือน (บาท):" },
    "label[for='payslip-net-salary']": { en: "Slip Net Salary (THB):", zh: "薪資單實發金額 (THB)：", th: "เงินเดือนสุทธิในสลิปจริง (บาท):" },
    
    // TAB 5: Tests
    "#tab-tests h3": { en: "<i class='fa-solid fa-vial text-primary'></i> Formula Test Results", zh: "<i class='fa-solid fa-vial text-primary'></i> 公式測試結果", th: "<i class='fa-solid fa-vial text-primary'></i> ผลการทดสอบสูตร" },
    "#run-tests-btn": { en: "<i class='fa-solid fa-play'></i> Run All Tests", zh: "<i class='fa-solid fa-play'></i> 開始全部測試", th: "<i class='fa-solid fa-play'></i> เริ่มการทดสอบทั้งหมด" },
    
    // Right sidebar (Card 1)
    ".col-4 .card:nth-child(1) .card-header h3": { en: "<i class='fa-solid fa-calendar-check text-success'></i> Summary & Allowances", zh: "<i class='fa-solid fa-calendar-check text-success'></i> 假期與特許摘要", th: "<i class='fa-solid fa-calendar-check text-success'></i> สรุปวันหยุดและสิทธิ์พิเศษ" },
    ".col-4 .insight-list li:nth-child(1) .insight-label": { en: "Standard Monthly Off Days Limit:", zh: "每月標準公休日限制：", th: "จำนวนวันหยุดประจำ (Off day) ทั้งเดือน:" },
    ".col-4 .insight-list li:nth-child(2) .insight-label": { en: "Actual Off Days Taken:", zh: "實際已休公休天數：", th: "จำนวนวันหยุดประจำที่หยุดจริง (Off day Leave):" },
    ".col-4 .insight-list li:nth-child(3) .insight-label": { en: "Convertible Off Days Accumulated:", zh: "累計可折現公休天數：", th: "วันหยุดประจำสะสมรับเงินคืนได้ (เดือนนี้):" },
    ".col-4 .insight-list li:nth-child(3) small": { en: "*Accumulated for quarterly payout", zh: "*累計並於每季度發放", th: "*สามารถสะสมและรับเงินคืนเป็นรายไตรมาส" },
    ".col-4 .insight-list li:nth-child(4) .insight-label": { en: "Compulsory Holidays in Month:", zh: "當月國定假日天數：", th: "วันหยุดบังคับใช้ (Compulsory Leave) ในเดือน:" },
    ".col-4 .insight-list li:nth-child(5) .insight-label": { en: "Compulsory Holidays Taken:", zh: "已休國定假日天數：", th: "วันหยุดบังคับใช้ที่หยุดจริง:" },
    ".col-4 .insight-list li:nth-child(5) small": { en: "*Paid holiday. Not convertible to cash if untaken.", zh: "*帶薪休假。若未休不可折現。", th: "*ไม่หักเงินเดือน และหากไม่หยุดจะไม่สามารถเปลี่ยนเป็นเงินได้" },
    "#stat-shift-change-container .insight-label": { en: "Shift Change Off Days:", zh: "換班公休天數：", th: "วันหยุดเปลี่ยนกะ (Shift Change Off):" },
    "#stat-shift-change-container small": { en: "*Allowed 1 day for night shift workers. No deduction.", zh: "*限夜班人員1天。不扣薪。", th: "*สำหรับกะดึกย้ายไปกะเช้า 1 วัน ไม่หักเงินเดือน" },
    ".col-4 .insight-list li:nth-child(7) .insight-label": { en: "New staff deposit (15%):", zh: "新員工保證金 (15%)：", th: "เงินประกันพนักงานใหม่ (New staff deposit 15%):" },
    ".col-4 .insight-list li:nth-child(8) .insight-label": { en: "Diligent Allowance Amount:", zh: "全勤獎金金額：", th: "เบี้ยขยัน (Diligent Allowance):" },
    ".col-4 .insight-list li:nth-child(9) .insight-label": { en: "Diligent Eligibility Status:", zh: "全勤獎金發放狀態：", th: "สิทธิ์ได้รับเบี้ยขยัน:" },
    
    // Right sidebar (Card 2)
    ".col-4 .card:nth-child(2) .card-header h3": { en: "<i class='fa-solid fa-clock-rotate-left text-primary'></i> Verification History", zh: "<i class='fa-solid fa-clock-rotate-left text-primary'></i> 驗證歷史記錄", th: "<i class='fa-solid fa-clock-rotate-left text-primary'></i> ประวัติการตรวจสอบ" },
    "#clear-all-history-btn": { en: "Clear All", zh: "清除全部", th: "ล้างทั้งหมด" },

    // Attendance headers (Th)
    "#attendance-table th:nth-child(1)": { en: "No.", zh: "編號", th: "ลำดับ" },
    "#attendance-table th:nth-child(2)": { en: "Date", zh: "日期", th: "วันที่" },
    "#attendance-table th:nth-child(3)": { en: "Shift", zh: "กะที่ทำงาน", th: "กะที่ทำงาน" },
    "#attendance-table th:nth-child(4)": { en: "Clock In", zh: "時間進", th: "เวลาเข้างาน" },
    "#attendance-table th:nth-child(5)": { en: "Clock Out", zh: "時間出", th: "เวลาเลิกงาน" },
    "#attendance-table th:nth-child(6)": { en: "Status", zh: "狀態", th: "สถานะการลงงาน" },
    "#attendance-table th:nth-child(7)": { en: "Holiday Type", zh: "假別", th: "การหยุด/วันหยุด" },
    "#attendance-table th:nth-child(8)": { en: "Late?", zh: "遲到？", th: "เข้าสาย?" },
    "#attendance-table th:nth-child(9)": { en: "Delete", zh: "刪除", th: "ลบ" },

    // Comparison headers (Th)
    "#comparison-table th:nth-child(1)": { en: "Item", zh: "項目", th: "รายการประเมิน" },
    "#comparison-table th:nth-child(2)": { en: "Calculated Value", zh: "計算值 (實際)", th: "ยอดคำนวณจริง (บาท)" },
    "#comparison-table th:nth-child(3)": { en: "Payslip Value", zh: "薪資單值", th: "ยอดในสลิปเงินเดือน (บาท)" },
    "#comparison-table th:nth-child(4)": { en: "Discrepancy", zh: "差額", th: "ส่วนต่างสลิปจริงกับคำนวณ" },
    "#comparison-table th:nth-child(5)": { en: "Status", zh: "狀態", th: "สถานะ" },

    // Team classification selectors
    "#label-employee-team": { en: "Employee Team (Team):", zh: "員工團隊 (Team)：", th: "ทีมพนักงาน (Team):" },
    "#employee-team-select option[value='Audit']": { en: "Audit Team", zh: "審計團隊 (Audit Team)", th: "ทีมออดิท (Audit Team)" },
    "#employee-team-select option[value='CS']": { en: "CS Team", zh: "客服團隊 (CS Team)", th: "ทีม CS (CS Team)" },
    "#label-team-audit-history": { en: "Audit Team (Audit Team)", zh: "審計團隊 (Audit Team)", th: "ทีมออดิท (Audit Team)" },
    "#label-team-cs-history": { en: "CS Team (CS Team)", zh: "客服團隊 (CS Team)", th: "ทีม CS (CS Team)" },

    // Auth gate and change password modal translation selectors
    "#auth-overlay h2": { en: "<i class='fa-solid fa-shield-halved text-primary'></i> Authentication Gate", zh: "<i class='fa-solid fa-shield-halved text-primary'></i> 安全驗證", th: "<i class='fa-solid fa-shield-halved text-primary'></i> ยืนยันตัวตน (Auth Gate)" },
    "#auth-overlay p.text-muted": { en: "Please enter your English name and passcode to proceed", zh: "請輸入您的英文姓名和密碼以繼續", th: "กรุณากรอกชื่อและรหัสผ่านเพื่อเข้าใช้งาน" },
    "#label-login-name": { en: "First & Last Name (English Only):", zh: "英文姓名 (限英文)：", th: "ชื่อ-นามสกุล (ภาษาอังกฤษเท่านั้น):" },
    "#label-login-password": { en: "4-digit Passcode (Default: 0000):", zh: "4位數字密碼 (預設: 0000)：", th: "รหัสผ่าน 4 หลัก (เริ่มต้น 0000):" },
    "#btn-login-submit": { en: "<i class='fa-solid fa-right-to-bracket'></i> Login", zh: "<i class='fa-solid fa-right-to-bracket'></i> 登入 (Login)", th: "<i class='fa-solid fa-right-to-bracket'></i> เข้าสู่ระบบ (Login)" },
    "#change-pw-btn": { en: "<i class='fa-solid fa-key'></i> Change Passcode", zh: "<i class='fa-solid fa-key'></i> 修改密碼", th: "<i class='fa-solid fa-key'></i> เปลี่ยนรหัสผ่าน" },
    "#logout-btn": { en: "<i class='fa-solid fa-right-from-bracket'></i> Logout", zh: "<i class='fa-solid fa-right-from-bracket'></i> 登出", th: "<i class='fa-solid fa-right-from-bracket'></i> ออกจากระบบ" },
    "#change-pw-modal h3": { en: "<i class='fa-solid fa-key text-primary'></i> Change Passcode", zh: "<i class='fa-solid fa-key text-primary'></i> 修改密碼", th: "<i class='fa-solid fa-key text-primary'></i> เปลี่ยนรหัสผ่าน" },
    "#label-new-password": { en: "New 4-digit Passcode:", zh: "新4位數字密碼：", th: "รหัสผ่านใหม่ 4 หลัก:" },
    "#label-confirm-new-password": { en: "Confirm New Passcode:", zh: "確認新密碼：", th: "ยืนยันรหัสผ่านใหม่:" },
    "#btn-save-pw": { en: "<i class='fa-solid fa-floppy-disk'></i> Save New Passcode", zh: "<i class='fa-solid fa-floppy-disk'></i> 儲存新密碼", th: "<i class='fa-solid fa-floppy-disk'></i> บันทึกรหัสผ่านใหม่" },
    "#label-shift-type-select": { en: "Shift Type & Monthly Transition Mode:", zh: "排班類型與當月轉班模式：", th: "ประเภทกะและการเปลี่ยนกะในเดือนนี้:" },
    "#opt-pure-day": { en: "☀️ Pure Day Shift", zh: "☀️ 純กะเช้า (Pure Day Shift)", th: "☀️ กะเช้าล้วน (Pure Day Shift)" },
    "#opt-pure-night": { en: "🌙 Pure Night Shift", zh: "🌙 純กะดึก (Pure Night Shift)", th: "🌙 กะดึกล้วน (Pure Night Shift)" },
    "#opt-day-to-night": { en: "☀️ ➡️ 🌙 Transition: Day to Night Shift", zh: "☀️ ➡️ 🌙 轉班：เช้า ไป ดึก (Day to Night)", th: "☀️ ➡️ 🌙 เปลี่ยนกะ: เช้า ไป ดึก (Day to Night)" },
    "#opt-night-to-day": { en: "🌙 ➡️ ☀️ Transition: Night to Day Shift", zh: "🌙 ➡️ ☀️ 轉班：ดึก ไป เช้า (Night to Day)", th: "🌙 ➡️ ☀️ เปลี่ยนกะ: ดึก ไป เช้า (Night to Day)" }
};

function applyLanguage() {
    const lang = state.language || 'en';
    
    // 1. Set DOM elements using translationSelectorMap
    for (const selector in translationSelectorMap) {
        const el = document.querySelectorAll(selector);
        el.forEach(item => {
            const val = translationSelectorMap[selector][lang] || translationSelectorMap[selector]['en'];
            if (val) item.innerHTML = val;
        });
    }
    
    // 2. Translate current page header page-title
    const pageTitleEl = document.getElementById("page-title");
    if (pageTitleEl) {
        const activeTab = document.querySelector(".nav-item.active");
        if (activeTab) {
            const tabId = activeTab.getAttribute("data-tab");
            if (tabId === 'dashboard') pageTitleEl.innerText = lang === 'th' ? "แดชบอร์ดสรุปผล" : (lang === 'zh' ? "儀表板摘要" : "Dashboard Summary");
            else if (tabId === 'config') pageTitleEl.innerText = lang === 'th' ? "ตั้งค่าการคำนวณ" : (lang === 'zh' ? "計算設定" : "Calculation Settings");
            else if (tabId === 'attendance') pageTitleEl.innerText = lang === 'th' ? "ตารางเวลางาน" : (lang === 'zh' ? "工作時間表" : "Work Schedule");
            else if (tabId === 'payslip-ocr') pageTitleEl.innerText = lang === 'th' ? "อัปโหลดและตรวจสอบ" : (lang === 'zh' ? "上傳與驗證" : "Upload & Verify");
            else if (tabId === 'tests') pageTitleEl.innerText = lang === 'th' ? "ผลการทดสอบสูตร" : (lang === 'zh' ? "公式測試結果" : "Formula Test Results");
        }
    }
    
    // 3. Update status legends
    const legendItems = document.querySelectorAll(".status-legend .legend-item");
    if (legendItems && legendItems.length >= 5) {
        if (lang === 'th') {
            legendItems[0].innerHTML = `<span class="badge bg-success-light text-success">full day</span> ทำงานเต็มวัน`;
            legendItems[1].innerHTML = `<span class="badge bg-primary-light text-primary">on Leave</span> วันหยุดในระบบ (ไม่หักเงิน)`;
            legendItems[2].innerHTML = `<span class="badge bg-purple-light text-purple">absent</span> ขาดงาน (หักเงิน & หักเบี้ยขยัน)`;
            legendItems[3].innerHTML = `<span class="badge bg-warning-light text-warning">partialday</span> ลาครึ่งวัน/ลาแต่มาทำ (ไม่หักเงิน)`;
            legendItems[4].innerHTML = `<span class="badge bg-danger-light text-danger">late (สาย)</span> เข้างานสาย (หักสิทธิ์เบี้ยขยัน/เบี้ยเลี้ยง)`;
        } else if (lang === 'zh') {
            legendItems[0].innerHTML = `<span class="badge bg-success-light text-success">full day</span> 全天工作`;
            legendItems[1].innerHTML = `<span class="badge bg-primary-light text-primary">on Leave</span> 系統公假 (不扣薪)`;
            legendItems[2].innerHTML = `<span class="badge bg-purple-light text-purple">absent</span> 曠工 (扣薪 & 取消全勤獎金)`;
            legendItems[3].innerHTML = `<span class="badge bg-warning-light text-warning">partialday</span> 半天假/補班 (不扣薪)`;
            legendItems[4].innerHTML = `<span class="badge bg-danger-light text-danger">late (遲到)</span> 遲到 (取消全勤/夜班津貼資格)`;
        } else { // en
            legendItems[0].innerHTML = `<span class="badge bg-success-light text-success">full day</span> Full Work Day`;
            legendItems[1].innerHTML = `<span class="badge bg-primary-light text-primary">on Leave</span> Registered Off-Day (No Deduct)`;
            legendItems[2].innerHTML = `<span class="badge bg-purple-light text-purple">absent</span> Absent (Deduct & Forfeit Diligent)`;
            legendItems[3].innerHTML = `<span class="badge bg-warning-light text-warning">partialday</span> Partial Day (No Deduct)`;
            legendItems[4].innerHTML = `<span class="badge bg-danger-light text-danger">late</span> Late Arrival (Forfeit Diligent/Allowance)`;
        }
    }
    
    // 4. Update input placeholders
    const employeeNameInput = document.getElementById("employee-name-input");
    if (employeeNameInput) {
        employeeNameInput.placeholder = lang === 'th' ? "เช่น นายสมชาย ดีใจ" : (lang === 'zh' ? "例如：張小明" : "e.g. John Doe");
    }

    // 5. Translate holiday badges
    const badgeHoliday1 = document.getElementById("badge-holiday-type-1");
    if (badgeHoliday1) {
        badgeHoliday1.innerText = lang === 'th' ? "วันหยุดนักขัตฤกษ์" : (lang === 'zh' ? "國定假日" : "Public Holiday");
    }
    for (let i = 2; i <= 5; i++) {
        const badgeHoliday = document.getElementById(`badge-holiday-type-${i}`);
        if (badgeHoliday) {
            badgeHoliday.innerText = lang === 'th' ? "วันหยุดประจำสัปดาห์" : (lang === 'zh' ? "例假日" : "Weekly Off");
        }
    }
    renderAdditionalHolidaysUI();
}

// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function migrateOldHistory() {
    const oldHistoryKey = 'salary_verification_history';
    const oldHistoryData = localStorage.getItem(oldHistoryKey);
    if (!oldHistoryData) return;

    try {
        const oldHistory = JSON.parse(oldHistoryData);
        if (Array.isArray(oldHistory) && oldHistory.length > 0) {
            console.log(`Starting migration of ${oldHistory.length} old verification records...`);
            
            oldHistory.forEach(record => {
                const empName = record.employeeName;
                if (!empName) return;
                
                const normalizedName = empName.toLowerCase().trim();
                const userKey = `salary_verification_history_${normalizedName}`;
                
                let userHistory = JSON.parse(localStorage.getItem(userKey) || '[]');
                
                const exists = userHistory.some(item => item.employeeName === record.employeeName && item.month === record.month);
                if (!exists) {
                    if (!record.employeeTeam) {
                        record.employeeTeam = 'Audit';
                    }
                    userHistory.push(record);
                    localStorage.setItem(userKey, JSON.stringify(userHistory));
                }
            });
            
            console.log("Migration completed successfully!");
        }
        localStorage.removeItem(oldHistoryKey);
    } catch (e) {
        console.error("Failed to migrate old history records: ", e);
    }
}

// Cloudflare D1 Synchronization Helpers
state.isCloudflare = false;

async function checkCloudflareStatus() {
    try {
        const res = await fetch("/api/setup");
        if (res.ok) {
            const status = await res.json();
            if (status.active) {
                state.isCloudflare = true;
                // Auto create tables if needed
                await fetch("/api/setup", { method: "POST" });
                console.log("Cloudflare D1 Mode is ACTIVE.");
                // Fetch profiles and sync to localStorage
                await syncProfilesFromCloudflare();
                await syncHistoryFromCloudflare();
            }
        }
    } catch (err) {
        console.log("LocalStorage Mode is ACTIVE (API offline).");
    }
}

async function syncProfilesFromCloudflare() {
    if (!state.isCloudflare) return;
    try {
        const res = await fetch("/api/profiles");
        if (res.ok) {
            const serverProfiles = await res.json();
            const localProfiles = JSON.parse(localStorage.getItem('salary_user_profiles') || '{}');
            serverProfiles.forEach(p => {
                localProfiles[p.name.toLowerCase()] = {
                    name: p.name,
                    password: p.passcode,
                    team: p.team,
                    baseSalary: p.baseSalary,
                    isProbation: p.isProbation,
                    isMidmonth: p.isMidmonth,
                    extraDays: p.extraDays,
                    hireDate: p.hireDate
                };
            });
            localStorage.setItem('salary_user_profiles', JSON.stringify(localProfiles));
        }
    } catch(e) {
        console.error("syncProfilesFromCloudflare failed", e);
    }
}

async function saveProfileToCloudflare(profile) {
    if (!state.isCloudflare) return;
    try {
        await fetch("/api/profiles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: profile.name,
                team: profile.team || 'Audit',
                baseSalary: profile.baseSalary || 20000,
                isProbation: profile.isProbation || false,
                isMidmonth: profile.isMidmonth || false,
                extraDays: profile.extraDays || 0,
                passcode: profile.password || '0000',
                hireDate: profile.hireDate || ''
            })
        });
    } catch(e) {
        console.error("saveProfileToCloudflare failed", e);
    }
}

async function syncHistoryFromCloudflare() {
    if (!state.isCloudflare) return;
    try {
        const res = await fetch("/api/history");
        if (res.ok) {
            const serverRecords = await res.json();
            
            // Map server records back into local storage format by storage key
            const grouped = {};
            serverRecords.forEach(r => {
                const auditedName = r.name.trim();
                const key = `salary_verification_history_emp_${auditedName.toLowerCase().replace(/\s+/g, "_")}`;
                if (!grouped[key]) grouped[key] = [];
                
                // Map API record back to local record object structure
                const localRec = {
                    id: r.id,
                    employeeName: r.name,
                    month: r.month,
                    baseSalary: r.baseSalary,
                    nightShiftOffDate: r.nightShiftOffDate,
                    nightShiftTransitionDate: r.nightShiftTransitionDate,
                    nightShiftAllowanceRate: r.nightShiftAllowanceRate,
                    attendanceLogs: r.logs,
                    holidays: r.holidays,
                    rulesBefore: r.rulesBefore,
                    rulesAfter: r.rulesAfter,
                    calcResults: {
                        diligentAllowance: r.diligent,
                        nightShiftAllowance: r.nightShift,
                        newStaffDeposit: r.probationDeduct,
                        unpaidLeaveDeduct: r.unpaidDeduct,
                        attendanceDeduction: r.attendanceDeduct,
                        extraWorkPay: r.extraWorkPay,
                        netSalary: r.netSalary
                    },
                    adminChecked: r.adminChecked,
                    disputeStatus: r.disputeStatus,
                    adminComment: r.adminComment,
                    timestamp: r.updatedAt || new Date().toISOString()
                };
                grouped[key].push(localRec);
            });

            // Write groups back to localStorage
            Object.keys(grouped).forEach(key => {
                localStorage.setItem(key, JSON.stringify(grouped[key]));
            });
        }
    } catch(e) {
        console.error("syncHistoryFromCloudflare failed", e);
    }
}

async function saveRecordToCloudflare(record) {
    if (!state.isCloudflare) return;
    try {
        await fetch("/api/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: `${record.employeeName.toLowerCase().trim()}-${record.month}`,
                name: record.employeeName,
                month: record.month,
                baseSalary: record.baseSalary,
                nightShiftOffDate: record.nightShiftOffDate,
                nightShiftTransitionDate: record.nightShiftTransitionDate,
                nightShiftAllowanceRate: record.nightShiftAllowanceRate,
                diligent: record.calcResults.diligentAllowance,
                nightShift: record.calcResults.nightShiftAllowance,
                probationDeduct: record.calcResults.newStaffDeposit,
                unpaidDeduct: record.calcResults.unpaidLeaveDeduct,
                attendanceDeduct: record.calcResults.attendanceDeduction,
                extraWorkPay: record.calcResults.extraWorkPay,
                netSalary: record.calcResults.netSalary,
                adminChecked: record.adminChecked,
                disputeStatus: record.disputeStatus || 'none',
                adminComment: record.adminComment || '',
                logs: record.attendanceLogs,
                holidays: record.holidays,
                rulesBefore: record.rulesBefore,
                rulesAfter: record.rulesAfter
            })
        });
    } catch(e) {
        console.error("saveRecordToCloudflare failed", e);
    }
}

async function deleteRecordFromCloudflare(recordId) {
    if (!state.isCloudflare) return;
    try {
        await fetch(`/api/history?record_id=${encodeURIComponent(recordId)}`, {
            method: "DELETE"
        });
    } catch(e) {
        console.error("deleteRecordFromCloudflare failed", e);
    }
}

function initApp() {
    // Load persisted language
    state.language = localStorage.getItem('app_language') || 'en';
    const langSelect = document.getElementById("lang-select");
    if (langSelect) {
        langSelect.value = state.language;
    }

    setupTabNavigation();
    setupThemeToggle();
    setupEventListeners();
    setupConfigFormSync();
    generateEmptyMonthLogs(getAttendanceMonth(state.month));
    applyLanguage(); // Apply default language
    
    // Run automated history migration
    migrateOldHistory();
    
    // Auth gate setup
    setupAuth();
    updateSecurityLocks();

    recalculateAndRender();
    renderHistoryList();

    // Check Cloudflare D1 database connection status asynchronously
    checkCloudflareStatus().then(() => {
        recalculateAndRender();
        renderHistoryList();
        renderAdminAuditPanel();
    });
}

function setupAuth() {
    const authOverlay = document.getElementById("auth-overlay");
    const authForm = document.getElementById("auth-form");
    const loginNameInput = document.getElementById("login-name");
    const loginPasswordInput = document.getElementById("login-password");
    const authErrorMsg = document.getElementById("auth-error-msg");
    
    const userSessionContainer = document.getElementById("user-session-container");
    const badgeUsername = document.getElementById("badge-username");
    const changePwBtn = document.getElementById("change-pw-btn");
    const logoutBtn = document.getElementById("logout-btn");
    
    const changePwModal = document.getElementById("change-pw-modal");
    const closeChangePwBtn = document.getElementById("close-change-pw-btn");
    const changePwForm = document.getElementById("change-pw-form");
    const newPasswordInput = document.getElementById("new-password");
    const confirmNewPasswordInput = document.getElementById("confirm-new-password");
    const changePwErrorMsg = document.getElementById("change-pw-error-msg");

    // Load active session from sessionStorage
    const activeUsername = sessionStorage.getItem('active_user_session');
    const activeRole = sessionStorage.getItem('active_user_role') || 'employee';
    if (activeUsername) {
        const profiles = JSON.parse(localStorage.getItem('salary_user_profiles') || '{}');
        const profile = profiles[activeUsername.toLowerCase()];
        if (profile) {
            state.currentUser = {
                ...profile,
                role: activeRole
            };
            if (authOverlay) authOverlay.style.display = "none";
            if (userSessionContainer) {
                userSessionContainer.style.display = "flex";
                badgeUsername.innerHTML = `<i class="fa-solid fa-user-circle"></i> ${profile.name} <span class="badge ${activeRole === 'auditor' ? 'bg-danger text-white' : 'bg-success text-white'}" style="margin-left: 5px; font-size: 0.65rem;">${activeRole === 'auditor' ? 'ผู้ตรวจสอบ' : 'พนักงาน'}</span>`;
            }
            if (profile.password !== "0000") {
                state.employeeName = profile.name;
                const nameInput = document.getElementById("employee-name-input");
                if (nameInput) nameInput.value = profile.name;
                document.getElementById("employee-badge").style.display = "flex";
                document.getElementById("badge-emp-name").innerText = profile.name;
            }
            setTimeout(updateRoleUIVisibility, 50);
        }
    }

    // Handle authentication form submission
    if (authForm) {
        authForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const rawName = loginNameInput.value.trim();
            const passcode = loginPasswordInput.value.trim();
            const normalizedName = rawName.toLowerCase();
            const lang = state.language || 'en';

            // Validation: English characters only for name
            if (!/^[a-zA-Z\s]+$/.test(rawName)) {
                if (authErrorMsg) {
                    authErrorMsg.innerText = lang === 'th' ? "กรุณากรอกชื่อนามสกุลเป็นภาษาอังกฤษเท่านั้น" : 
                                            (lang === 'zh' ? "請只使用英文姓名" : "Please use English characters only for name.");
                    authErrorMsg.style.display = "block";
                }
                return;
            }

            // Validation: 4-digit passcode
            if (!/^\d{4}$/.test(passcode)) {
                if (authErrorMsg) {
                    authErrorMsg.innerText = lang === 'th' ? "รหัสผ่านต้องเป็นตัวเลข 4 หลัก" : 
                                            (lang === 'zh' ? "密碼必須為4位數字" : "Passcode must be a 4-digit number.");
                    authErrorMsg.style.display = "block";
                }
                return;
            }

            const profiles = JSON.parse(localStorage.getItem('salary_user_profiles') || '{}');
            let profile = profiles[normalizedName];

            if (!profile) {
                // Initialize profile with password "0000"
                if (passcode !== "0000") {
                    if (authErrorMsg) {
                        authErrorMsg.innerText = lang === 'th' ? "บัญชีใหม่ต้องเข้าใช้งานด้วยรหัสผ่านเริ่มต้น 0000" : 
                                                (lang === 'zh' ? "新帳戶預設密碼為 0000" : "New accounts must use default passcode 0000.");
                        authErrorMsg.style.display = "block";
                    }
                    return;
                }
                profile = { name: rawName, password: "0000" };
                profiles[normalizedName] = profile;
                localStorage.setItem('salary_user_profiles', JSON.stringify(profiles));
                saveProfileToCloudflare(profile);
            }

            if (profile.password === passcode) {
                // Show the Role Select Modal first
                state.pendingLoginProfile = profile;
                state.pendingLoginRawName = rawName;
                
                const roleSelectModal = document.getElementById("role-select-modal");
                if (roleSelectModal) {
                    roleSelectModal.style.display = "flex";
                }
                
                if (authErrorMsg) authErrorMsg.style.display = "none";
                loginNameInput.value = "";
                loginPasswordInput.value = "";
            } else {
                if (authErrorMsg) {
                    authErrorMsg.innerText = lang === 'th' ? "รหัสผ่านสี่ตัวไม่ถูกต้อง" : 
                                            (lang === 'zh' ? "密碼錯誤" : "Incorrect 4-digit passcode.");
                    authErrorMsg.style.display = "block";
                }
            }
        });
    }

    // Handle Change Password dialog triggers
    if (changePwBtn) {
        changePwBtn.addEventListener("click", () => {
            if (changePwModal) changePwModal.style.display = "flex";
            if (changePwErrorMsg) changePwErrorMsg.style.display = "none";
            if (newPasswordInput) newPasswordInput.value = "";
            if (confirmNewPasswordInput) confirmNewPasswordInput.value = "";
        });
    }

    if (closeChangePwBtn) {
        closeChangePwBtn.addEventListener("click", () => {
            if (changePwModal) changePwModal.style.display = "none";
        });
    }

    if (changePwForm) {
        changePwForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const newPw = newPasswordInput.value.trim();
            const confirmPw = confirmNewPasswordInput.value.trim();
            const lang = state.language || 'en';

            if (!/^\d{4}$/.test(newPw)) {
                if (changePwErrorMsg) {
                    changePwErrorMsg.innerText = lang === 'th' ? "รหัสผ่านต้องเป็นตัวเลข 4 หลัก" : 
                                                (lang === 'zh' ? "密碼必須為4位數字" : "Passcode must be a 4-digit number.");
                    changePwErrorMsg.style.display = "block";
                }
                return;
            }

            if (newPw !== confirmPw) {
                if (changePwErrorMsg) {
                    changePwErrorMsg.innerText = lang === 'th' ? "รหัสผ่านทั้งสองช่องไม่ตรงกัน" : 
                                                (lang === 'zh' ? "密碼輸入不一致" : "Passcodes do not match.");
                    changePwErrorMsg.style.display = "block";
                }
                return;
            }

            if (state.currentUser) {
                const normalizedName = state.currentUser.name.toLowerCase();
                const profiles = JSON.parse(localStorage.getItem('salary_user_profiles') || '{}');
                if (profiles[normalizedName]) {
                    profiles[normalizedName].password = newPw;
                    localStorage.setItem('salary_user_profiles', JSON.stringify(profiles));
                    saveProfileToCloudflare(profiles[normalizedName]);
                    state.currentUser.password = newPw;
                    
                    state.employeeName = state.currentUser.name;
                    const nameInput = document.getElementById("employee-name-input");
                    if (nameInput) nameInput.value = state.currentUser.name;
                    document.getElementById("employee-badge").style.display = "flex";
                    document.getElementById("badge-emp-name").innerText = state.currentUser.name;
                    
                    updateSecurityLocks();
                    
                    if (changePwModal) changePwModal.style.display = "none";
                    alert(lang === 'th' ? "เปลี่ยนรหัสผ่านสำเร็จแล้ว!" : 
                          (lang === 'zh' ? "密碼修改成功！" : "Passcode changed successfully!"));
                }
            }
        });
    }

    // Handle Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            const lang = state.language || 'en';
            const confirmLogout = confirm(lang === 'th' ? "คุณต้องการออกจากระบบใช่หรือไม่?" : 
                                          (lang === 'zh' ? "您確定要登出嗎？" : "Are you sure you want to logout?"));
            if (confirmLogout) {
                sessionStorage.removeItem('active_user_session');
                sessionStorage.removeItem('active_user_role');
                state.currentUser = null;
                state.adminAuthenticated = false;
                if (authOverlay) authOverlay.style.display = "flex";
                if (userSessionContainer) userSessionContainer.style.display = "none";
                
                // Clear active calculation configuration settings silently on logout
                clearConfigSettings(true);
                updateSecurityLocks();
                
                // Reload verification list and recalculate
                renderHistoryList();
                recalculateAndRender();

                // Switch active tab view back to dashboard
                const dashboardTabBtn = document.querySelector(".nav-item[data-tab='dashboard']");
                if (dashboardTabBtn) dashboardTabBtn.click();
            }
        });
    }

    // Role Select Modal Buttons
    const btnRoleEmployee = document.getElementById("btn-role-employee");
    const btnRoleAuditor = document.getElementById("btn-role-auditor");

    if (btnRoleEmployee) {
        btnRoleEmployee.addEventListener("click", () => {
            completeLogin("employee");
        });
    }

    if (btnRoleAuditor) {
        btnRoleAuditor.addEventListener("click", () => {
            completeLogin("auditor");
        });
    }

    function completeLogin(role) {
        const profile = state.pendingLoginProfile;
        const rawName = state.pendingLoginRawName;
        if (!profile) return;
        
        // Authorization check for Auditor role
        if (role === 'auditor') {
            const authorizedAuditors = ['gift', 'cl', 'satang', 'guitar', 'miao', 'enzo', 'david', 'kai'];
            const nameLower = rawName.trim().toLowerCase();
            if (!authorizedAuditors.includes(nameLower)) {
                alert(state.language === 'th' ? 
                    "❌ ขออภัย ชื่อผู้ใช้นี้ไม่ได้รับอนุญาตให้เข้าใช้งานบทบาทผู้ตรวจสอบได้" : 
                    "❌ Sorry, this username is not authorized to access the Auditor role.");
                return;
            }
            
            // SECONDARY PROMPT: Admin Passcode verification
            const adminPass = prompt(state.language === 'th' ? 
                "กรุณากรอกรหัสผ่านผู้ดูแลระบบ (Admin Passcode) เพื่อดำเนินการต่อ:" : 
                "Please enter the admin passcode to proceed:");
            if (adminPass !== 'admin') {
                alert(state.language === 'th' ? 
                    "❌ รหัสผ่านผู้ดูแลระบบไม่ถูกต้อง ไม่สามารถเข้าใช้งานบทบาทผู้ตรวจสอบได้" : 
                    "❌ Incorrect admin passcode. Access denied.");
                return;
            }
            state.adminAuthenticated = true;
        }
        
        state.currentUser = {
            ...profile,
            role: role
        };
        
        sessionStorage.setItem('active_user_session', rawName);
        sessionStorage.setItem('active_user_role', role);
        
        const roleModal = document.getElementById("role-select-modal");
        if (roleModal) roleModal.style.display = "none";
        
        const authOverlay = document.getElementById("auth-overlay");
        const userSessionContainer = document.getElementById("user-session-container");
        const badgeUsername = document.getElementById("badge-username");
        
        if (authOverlay) authOverlay.style.display = "none";
        if (userSessionContainer) {
            userSessionContainer.style.display = "flex";
            badgeUsername.innerHTML = `<i class="fa-solid fa-user-circle"></i> ${profile.name} <span class="badge ${role === 'auditor' ? 'bg-danger text-white' : 'bg-success text-white'}" style="margin-left: 5px; font-size: 0.65rem;">${role === 'auditor' ? 'ผู้ตรวจสอบ' : 'พนักงาน'}</span>`;
        }
        
        if (profile.password !== "0000") {
            state.employeeName = profile.name;
            const nameInput = document.getElementById("employee-name-input");
            if (nameInput) nameInput.value = profile.name;
            document.getElementById("employee-badge").style.display = "flex";
            document.getElementById("badge-emp-name").innerText = profile.name;
        }
        
        updateRoleUIVisibility();
        updateSecurityLocks();
        
        renderHistoryList();
        recalculateAndRender();
        
        // Switch view to results or dashboard tab on successful login
        if (role === 'employee') {
            const resultsTabBtn = document.querySelector(".nav-item[data-tab='employee-results']");
            if (resultsTabBtn) resultsTabBtn.click();
        } else {
            const dashboardTabBtn = document.querySelector(".nav-item[data-tab='dashboard']");
            if (dashboardTabBtn) dashboardTabBtn.click();
        }
    }

    // Forgot Password Link Click Handler
    const forgotPwLink = document.getElementById("forgot-password-link");
    if (forgotPwLink) {
        forgotPwLink.addEventListener("click", (e) => {
            e.preventDefault();
            const lang = state.language || 'en';
            
            const initialChoice = prompt(lang === 'th' ? 
                "กรุณากรอกรหัสผ่านผู้ดูแลระบบ (Admin Passcode) หรือ กดตกลง/เว้นว่างเพื่อยืนยันตัวตนด้วยวันเริ่มงาน:" : 
                "Please enter the Admin Passcode, or press OK/leave blank to verify using hire date:");
            
            if (initialChoice !== null && initialChoice.trim() === 'admin') {
                const targetName = prompt(lang === 'th' ? 
                    "กรุณากรอก ชื่อ-นามสกุล ของบัญชีที่ต้องการรีเซ็ตรหัสผ่าน:" : 
                    "Please enter the username of the account you want to reset password for:");
                if (!targetName) return;
                const normalizedName = targetName.trim().toLowerCase();
                
                const profiles = JSON.parse(localStorage.getItem('salary_user_profiles') || '{}');
                if (!profiles[normalizedName]) {
                    alert(lang === 'th' ? "❌ ไม่พบชื่อบัญชีผู้ใช้นี้ในระบบ" : "❌ Username not found in the system.");
                    return;
                }
                
                const newPass = prompt(lang === 'th' ? 
                    "กรุณากรอกรหัสผ่านใหม่ (ต้องเป็นตัวเลข 4 หลักเท่านั้น):" : 
                    "Please enter your new 4-digit passcode:");
                if (!newPass || !/^\d{4}$/.test(newPass)) {
                    alert(lang === 'th' ? "❌ รหัสผ่านไม่ถูกต้อง" : "❌ Invalid passcode.");
                    return;
                }
                
                profiles[normalizedName].password = newPass;
                localStorage.setItem('salary_user_profiles', JSON.stringify(profiles));
                saveProfileToCloudflare(profiles[normalizedName]);
                alert(lang === 'th' ? 
                    `✅ รีเซ็ตรหัสผ่านของ "${profiles[normalizedName].name}" สำเร็จแล้ว!` : 
                    `✅ Passcode for "${profiles[normalizedName].name}" reset successfully!`);
                return;
            }
            
            const targetName = prompt(lang === 'th' ? 
                "กรุณากรอก ชื่อ-นามสกุล ของบัญชีที่ต้องการรีเซ็ตรหัสผ่าน:" : 
                "Please enter the username of the account you want to reset password for:");
            if (!targetName) return;
            const normalizedName = targetName.trim().toLowerCase();
            
            const profiles = JSON.parse(localStorage.getItem('salary_user_profiles') || '{}');
            if (!profiles[normalizedName]) {
                alert(lang === 'th' ? "❌ ไม่พบชื่อบัญชีผู้ใช้นี้ในระบบ" : "❌ Username not found in the system.");
                return;
            }
            
            const targetProfile = profiles[normalizedName];
            const savedHireDate = targetProfile.hireDate;
            
            if (savedHireDate) {
                const enteredDate = prompt(lang === 'th' ? 
                    `กรุณากรอกวันเริ่มงานของคุณ "${targetProfile.name}" เพื่อยืนยันตัวตน (รูปแบบ ปปปป-ดด-วว เช่น 2026-05-15):` : 
                    `Please enter the hire date of "${targetProfile.name}" to verify identity (Format YYYY-MM-DD e.g. 2026-05-15):`);
                
                if (!enteredDate || enteredDate.trim() !== savedHireDate) {
                    alert(lang === 'th' ? 
                        "❌ วันเริ่มงานไม่ถูกต้อง ไม่สามารถดำเนินการแก้ไขรหัสผ่านได้" : 
                        "❌ Incorrect hire date. Password reset denied.");
                    return;
                }
            } else {
                const adminCode = prompt(lang === 'th' ? 
                    "บัญชีนี้ยังไม่ได้บันทึกวันเริ่มงานในระบบ กรุณากรอกรหัสผ่านผู้ดูแลระบบ (Admin Passcode) เพื่อดำเนินการ:" : 
                    "This account has no hire date recorded. Please enter the admin passcode to verify authority:");
                
                if (adminCode !== 'admin') {
                    alert(lang === 'th' ? "❌ รหัสผ่านผู้ดูแลระบบไม่ถูกต้อง" : "❌ Incorrect admin passcode.");
                    return;
                }
            }
            
            const newPass = prompt(lang === 'th' ? 
                "กรุณากรอกรหัสผ่านใหม่ (ต้องเป็นตัวเลข 4 หลักเท่านั้น):" : 
                "Please enter your new 4-digit passcode:");
            
            if (!newPass || !/^\d{4}$/.test(newPass)) {
                alert(lang === 'th' ? 
                    "❌ รหัสผ่านใหม่ไม่ถูกต้อง (ต้องประกอบด้วยตัวเลข 4 หลักเท่านั้น)" : 
                    "❌ Invalid passcode. It must be exactly 4 digits.");
                return;
            }
            
            profiles[normalizedName].password = newPass;
            localStorage.setItem('salary_user_profiles', JSON.stringify(profiles));
            saveProfileToCloudflare(profiles[normalizedName]);
            
            alert(lang === 'th' ? 
                `✅ รีเซ็ตรหัสผ่านใหม่สี่หลักของบัญชี "${profiles[normalizedName].name}" สำเร็จแล้ว! คุณสามารถใช้รหัสผ่านใหม่ล็อกอินได้ทันที` : 
                `✅ Passcode for account "${profiles[normalizedName].name}" has been successfully reset! You can now log in using the new passcode.`);
        });
    }
}

function updateSecurityLocks() {
    const nameInput = document.getElementById("employee-name-input");
    const hireDateInput = document.getElementById("config-hire-date");
    
    // Check if the current user has changed their password (i.e. not "0000")
    const isLocked = state.currentUser && state.currentUser.password !== "0000";
    
    if (nameInput) {
        nameInput.disabled = isLocked;
        if (isLocked) {
            nameInput.classList.add("bg-dark-3");
            nameInput.title = state.language === 'th' ? "ไม่สามารถแก้ไขชื่อได้เนื่องจากคุณได้เปลี่ยนรหัสผ่านส่วนตัวแล้ว" : "Locked because you have set a personal password.";
        } else {
            nameInput.classList.remove("bg-dark-3");
            nameInput.title = "";
        }
    }
    if (hireDateInput) {
        hireDateInput.disabled = isLocked;
        if (isLocked) {
            hireDateInput.classList.add("bg-dark-3");
            hireDateInput.title = state.language === 'th' ? "ไม่สามารถแก้ไขวันเริ่มงานได้เนื่องจากคุณได้เปลี่ยนรหัสผ่านส่วนตัวแล้ว" : "Locked because you have set a personal password.";
        } else {
            hireDateInput.classList.remove("bg-dark-3");
            hireDateInput.title = "";
        }
    }
}

// 1. Tab Navigation
function setupTabNavigation() {
    const navItems = document.querySelectorAll(".nav-item");
    const tabContents = document.querySelectorAll(".tab-content");
    const pageTitle = document.getElementById("page-title");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const tabId = item.getAttribute("data-tab");
            
            if (tabId === 'admin-audit') {
                if (!state.adminAuthenticated) {
                    const password = prompt(state.language === 'th' ? "กรุณากรอกรหัสผ่านผู้ดูแลระบบเพื่อเข้าถึงเมนูส่งตรวจสอบ (Admin Passcode):" : "Please enter the admin passcode to access submission logs:");
                    if (password !== 'admin') {
                        alert(state.language === 'th' ? "❌ รหัสผ่านผู้ดูแลระบบไม่ถูกต้อง ไม่สามารถเข้าใช้งานหน้านี้ได้" : "❌ Incorrect admin passcode. Access denied.");
                        return;
                    }
                    state.adminAuthenticated = true;
                }
                renderAdminAuditPanel();
            }
            
            if (tabId === 'employee-results') {
                renderEmployeeResultsPanel();
            }
            
            navItems.forEach(nav => nav.classList.remove("active"));
            tabContents.forEach(tab => tab.classList.remove("active"));
            
            item.classList.add("active");
            const targetTab = document.getElementById(`tab-${tabId}`);
            if (targetTab) targetTab.classList.add("active");
            
            // Update Page Title based on language
            const lang = state.language || 'en';
            const titles = {
                th: { dashboard: "แดชบอร์ดสรุปผล", config: "ตั้งค่าการคำนวณ", attendance: "ตารางเวลางาน", payslip: "อัปโหลดและตรวจสอบ", tests: "ผลการทดสอบสูตร", admin: "ส่งตรวจสอบ (Admin)", results: "ผลการตรวจสอบ (Results)" },
                en: { dashboard: "Dashboard Summary", config: "Calculation Settings", attendance: "Work Schedule", payslip: "Upload & Verify", tests: "Formula Test Results", admin: "Submit Audit (Admin)", results: "Audit Results (Results)" },
                zh: { dashboard: "儀表板摘要", config: "計算設定", attendance: "工作時間表", payslip: "上傳與驗證", tests: "公式測試結果", admin: "送交審核 (Admin)", results: "審核結果 (Results)" }
            };
            const titleMap = titles[lang] || titles.en;
            
            if (tabId === 'dashboard') pageTitle.innerText = titleMap.dashboard;
            else if (tabId === 'config') pageTitle.innerText = titleMap.config;
            else if (tabId === 'attendance') pageTitle.innerText = titleMap.attendance;
            else if (tabId === 'payslip-ocr') pageTitle.innerText = titleMap.payslip;
            else if (tabId === 'tests') pageTitle.innerText = titleMap.tests;
            else if (tabId === 'admin-audit') pageTitle.innerText = titleMap.admin;
            else if (tabId === 'employee-results') pageTitle.innerText = titleMap.results;
        });
    });
}

// 2. Theme Toggle (Dark/Light)
function setupThemeToggle() {
    const themeSwitch = document.getElementById("theme-switch");
    themeSwitch.addEventListener("change", () => {
        if (themeSwitch.checked) {
            document.documentElement.removeAttribute("data-theme");
        } else {
            document.documentElement.setAttribute("data-theme", "light");
        }
    });
}

// 3. Setup Configurations sync
function setupConfigFormSync() {
    const employeeNameInput = document.getElementById("employee-name-input");
    const baseSalarySelect = document.getElementById("base-salary-select");
    const customSalaryGroup = document.getElementById("custom-salary-group");
    const customSalaryInput = document.getElementById("custom-salary-input");
    const probationSwitch = document.getElementById("probation-switch");
    const midmonthSwitch = document.getElementById("midmonth-switch");
    const midmonthDaysGroup = document.getElementById("midmonth-days-group");
    const midmonthDaysInput = document.getElementById("midmonth-days-input");
    
    const shiftTypeSelect = document.getElementById("shift-type-select");
    const dayShiftSettings = document.getElementById("day-shift-settings");
    const nightShiftSettings = document.getElementById("night-shift-settings");
    
    const dayShiftStartDateInput = document.getElementById("day-shift-start-date");
    const nightShiftOffDateInput = document.getElementById("night-shift-off-date");
    const nightShiftTransitionDateInput = document.getElementById("night-shift-transition-date");
    const nightshiftAllowanceInput = document.getElementById("config-nightshift-allowance");
    const monthPicker = document.getElementById("month-picker");

    // Sync Employee Name
    employeeNameInput.addEventListener("input", () => {
        state.employeeName = employeeNameInput.value.trim();
        const badge = document.getElementById("employee-badge");
        if (badge) badge.style.display = state.employeeName ? "flex" : "none";
        const badgeEmpName = document.getElementById("badge-emp-name");
        if (badgeEmpName) badgeEmpName.innerText = state.employeeName;
        
        // Dynamically update the sidebar history list to show only this employee's records
        renderHistoryList();
    });

    // Sync Employee Team
    const employeeTeamSelect = document.getElementById("employee-team-select");
    if (employeeTeamSelect) {
        employeeTeamSelect.addEventListener("change", () => {
            state.employeeTeam = employeeTeamSelect.value;
            recalculateAndRender();
        });
    }

    // Populate default dates relative to selected month
    const defaultYearMonth = state.month; // "2026-05"
    dayShiftStartDateInput.value = `${defaultYearMonth}-01`;
    nightShiftOffDateInput.value = state.nightShiftOffDate;
    nightShiftTransitionDateInput.value = state.nightShiftTransitionDate;

    baseSalarySelect.addEventListener("change", () => {
        if (baseSalarySelect.value === "custom") {
            customSalaryGroup.style.display = "block";
            state.baseSalary = parseFloat(customSalaryInput.value) || 0;
        } else {
            customSalaryGroup.style.display = "none";
            state.baseSalary = parseFloat(baseSalarySelect.value);
        }
        recalculateAndRender();
    });

    customSalaryInput.addEventListener("input", () => {
        state.baseSalary = parseFloat(customSalaryInput.value) || 0;
        recalculateAndRender();
    });

    probationSwitch.addEventListener("change", () => {
        state.isProbation = probationSwitch.checked;
        recalculateAndRender();
    });
    
    // Sync Hire Date
    const hireDateInput = document.getElementById("config-hire-date");
    if (hireDateInput) {
        hireDateInput.addEventListener("change", () => {
            state.hireDate = hireDateInput.value;
            
            // Save to active user profile!
            if (state.currentUser) {
                const profiles = JSON.parse(localStorage.getItem('salary_user_profiles') || '{}');
                const normalizedName = state.currentUser.name.toLowerCase();
                if (profiles[normalizedName]) {
                    profiles[normalizedName].hireDate = state.hireDate;
                    localStorage.setItem('salary_user_profiles', JSON.stringify(profiles));
                    saveProfileToCloudflare(profiles[normalizedName]);
                    state.currentUser.hireDate = state.hireDate;
                }
            }
            recalculateAndRender();
        });
    }

    // Sync Exchange Rate
    const exchangeRateInput = document.getElementById("config-exchange-rate");
    if (exchangeRateInput) {
        exchangeRateInput.addEventListener("input", () => {
            state.exchangeRate = parseFloat(exchangeRateInput.value) || 35.0;
            recalculateAndRender();
        });
    }

    // Sync 5 Holidays (Fixed types)
    for (let i = 1; i <= 5; i++) {
        const dateInput = document.getElementById(`config-holiday-date-${i}`);
        if (dateInput) {
            dateInput.addEventListener("change", () => {
                state.holidays[i - 1].date = dateInput.value;
                applyShiftTypeToLogs();
                recalculateAndRender();
            });
        }
    }

    // Add unpaid holiday button listener
    const btnAddUnpaid = document.getElementById("btn-add-unpaid-holiday");
    if (btnAddUnpaid) {
        btnAddUnpaid.addEventListener("click", () => {
            state.holidays.push({ date: "", type: "unpaid" });
            renderAdditionalHolidaysUI();
            applyShiftTypeToLogs();
            recalculateAndRender();
        });
    }

    midmonthSwitch.addEventListener("change", () => {
        state.isMidMonthStart = midmonthSwitch.checked;
        midmonthDaysGroup.style.display = midmonthSwitch.checked ? "block" : "none";
        recalculateAndRender();
    });

    midmonthDaysInput.addEventListener("input", () => {
        state.midMonthExtraDays = parseInt(midmonthDaysInput.value) || 0;
        recalculateAndRender();
    });

    // Shift selection dropdown select handler
    window.updateShiftUIAndState = (mode) => {
        state.shiftMode = mode;
        if (shiftTypeSelect) {
            shiftTypeSelect.value = mode;
        }

        if (mode === 'pure_day') {
            state.shiftType = 'day';
            state.dayShiftStartDate = '';
            if (dayShiftSettings) dayShiftSettings.style.display = "none";
            if (nightShiftSettings) nightShiftSettings.style.display = "none";
            const scc = document.getElementById("stat-shift-change-container");
            if (scc) scc.style.display = "none";
        } else if (mode === 'pure_night') {
            state.shiftType = 'night';
            state.nightShiftTransitionDate = '';
            state.nightShiftOffDate = '';
            if (dayShiftSettings) dayShiftSettings.style.display = "none";
            if (nightShiftSettings) nightShiftSettings.style.display = "none";
            const scc = document.getElementById("stat-shift-change-container");
            if (scc) scc.style.display = "block";
        } else if (mode === 'day_to_night') {
            state.shiftType = 'day';
            state.dayShiftStartDate = dayShiftStartDateInput ? (dayShiftStartDateInput.value || `${state.month}-01`) : '';
            if (dayShiftSettings) dayShiftSettings.style.display = "block";
            if (nightShiftSettings) nightShiftSettings.style.display = "none";
            const scc = document.getElementById("stat-shift-change-container");
            if (scc) scc.style.display = "none";
        } else if (mode === 'night_to_day') {
            state.shiftType = 'night';
            state.nightShiftTransitionDate = nightShiftTransitionDateInput ? (nightShiftTransitionDateInput.value || `${state.month}-21`) : '';
            state.nightShiftOffDate = nightShiftOffDateInput ? (nightShiftOffDateInput.value || `${state.month}-20`) : '';
            if (dayShiftSettings) dayShiftSettings.style.display = "none";
            if (nightShiftSettings) nightShiftSettings.style.display = "block";
            const scc = document.getElementById("stat-shift-change-container");
            if (scc) scc.style.display = "block";
        }
    };

    if (shiftTypeSelect) {
        shiftTypeSelect.addEventListener("change", () => {
            window.updateShiftUIAndState(shiftTypeSelect.value);
            applyShiftTypeToLogs();
            recalculateAndRender();
        });
    }

    dayShiftStartDateInput.addEventListener("change", () => {
        state.dayShiftStartDate = dayShiftStartDateInput.value;
        applyShiftTypeToLogs();
        recalculateAndRender();
    });

    nightShiftOffDateInput.addEventListener("change", () => {
        state.nightShiftOffDate = nightShiftOffDateInput.value;
        applyShiftTypeToLogs();
        recalculateAndRender();
    });

    nightShiftTransitionDateInput.addEventListener("change", () => {
        state.nightShiftTransitionDate = nightShiftTransitionDateInput.value;
        applyShiftTypeToLogs();
        recalculateAndRender();
    });

    nightshiftAllowanceInput.addEventListener("input", () => {
        state.nightShiftAllowanceRate = parseFloat(nightshiftAllowanceInput.value) || 0;
        recalculateAndRender();
    });

    const attendanceDeductInput = document.getElementById("config-attendance-deduction");
    if (attendanceDeductInput) {
        attendanceDeductInput.addEventListener("input", () => {
            state.attendanceDeductionRate = parseFloat(attendanceDeductInput.value) || 0;
            recalculateAndRender();
        });
    }

    // Timezone change
    const timezoneSelect = document.getElementById("config-timezone");
    if (timezoneSelect) {
        timezoneSelect.addEventListener("change", () => {
            state.timezone = timezoneSelect.value;
            applyShiftTypeToLogs();
            recalculateAndRender();
        });
    }

    // Rules Before Change
    const ruleBeforeDayStart = document.getElementById("rule-before-day-start");
    const ruleBeforeDayEnd = document.getElementById("rule-before-day-end");
    const ruleBeforeNightStart = document.getElementById("rule-before-night-start");
    const ruleBeforeNightEnd = document.getElementById("rule-before-night-end");

    const syncRulesBefore = () => {
        state.rulesBefore = {
            dayStart: ruleBeforeDayStart.value,
            dayEnd: ruleBeforeDayEnd.value,
            nightStart: ruleBeforeNightStart.value,
            nightEnd: ruleBeforeNightEnd.value
        };
        applyShiftTypeToLogs();
        recalculateAndRender();
    };

    if (ruleBeforeDayStart) ruleBeforeDayStart.addEventListener("change", syncRulesBefore);
    if (ruleBeforeDayEnd) ruleBeforeDayEnd.addEventListener("change", syncRulesBefore);
    if (ruleBeforeNightStart) ruleBeforeNightStart.addEventListener("change", syncRulesBefore);
    if (ruleBeforeNightEnd) ruleBeforeNightEnd.addEventListener("change", syncRulesBefore);

    // Has Time Change Checkbox
    const hasTimeChangeCheckbox = document.getElementById("config-has-time-change");
    const timeChangeDetailsGroup = document.getElementById("time-change-details-group");
    if (hasTimeChangeCheckbox) {
        hasTimeChangeCheckbox.addEventListener("change", () => {
            state.hasTimeChange = hasTimeChangeCheckbox.checked;
            timeChangeDetailsGroup.style.display = hasTimeChangeCheckbox.checked ? "block" : "none";
            applyShiftTypeToLogs();
            recalculateAndRender();
        });
    }

    // Time Change Cutoff Date
    const timeChangeDateInput = document.getElementById("config-time-change-date");
    if (timeChangeDateInput) {
        timeChangeDateInput.addEventListener("change", () => {
            state.timeChangeDate = timeChangeDateInput.value;
            applyShiftTypeToLogs();
            recalculateAndRender();
        });
    }

    // Rules After Change
    const ruleAfterDayStart = document.getElementById("rule-after-day-start");
    const ruleAfterDayEnd = document.getElementById("rule-after-day-end");
    const ruleAfterNightStart = document.getElementById("rule-after-night-start");
    const ruleAfterNightEnd = document.getElementById("rule-after-night-end");

    const syncRulesAfter = () => {
        state.rulesAfter = {
            dayStart: ruleAfterDayStart.value,
            dayEnd: ruleAfterDayEnd.value,
            nightStart: ruleAfterNightStart.value,
            nightEnd: ruleAfterNightEnd.value
        };
        applyShiftTypeToLogs();
        recalculateAndRender();
    };

    if (ruleAfterDayStart) ruleAfterDayStart.addEventListener("change", syncRulesAfter);
    if (ruleAfterDayEnd) ruleAfterDayEnd.addEventListener("change", syncRulesAfter);
    if (ruleAfterNightStart) ruleAfterNightStart.addEventListener("change", syncRulesAfter);
    if (ruleAfterNightEnd) ruleAfterNightEnd.addEventListener("change", syncRulesAfter);

    monthPicker.addEventListener("change", () => {
        state.month = monthPicker.value;
        const attendanceMonth = getAttendanceMonth(state.month);
        generateEmptyMonthLogs(attendanceMonth);
        // adjust default inputs
        dayShiftStartDateInput.value = `${attendanceMonth}-01`;
        if (state.month === '2026-05') {
            nightShiftOffDateInput.value = '2026-05-20';
            nightShiftTransitionDateInput.value = '2026-05-21';
            state.nightShiftOffDate = '2026-05-20';
            state.nightShiftTransitionDate = '2026-05-21';
            if (timeChangeDateInput) {
                timeChangeDateInput.value = '2026-05-25';
                state.timeChangeDate = '2026-05-25';
            }
        } else {
            nightShiftOffDateInput.value = `${attendanceMonth}-15`;
            nightShiftTransitionDateInput.value = `${attendanceMonth}-16`;
            state.nightShiftOffDate = `${attendanceMonth}-15`;
            state.nightShiftTransitionDate = `${attendanceMonth}-16`;
            if (timeChangeDateInput) {
                timeChangeDateInput.value = `${attendanceMonth}-25`;
                state.timeChangeDate = `${attendanceMonth}-25`;
            }
        }
        applyShiftTypeToLogs();
        recalculateAndRender();
    });

    // Initialize UI select dropdown with default shiftMode
    window.updateShiftUIAndState(state.shiftMode);
}

// 4. Generate Empty logs for the month
function generateEmptyMonthLogs(yearMonth) {
    const [year, month] = yearMonth.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    state.attendanceLogs = [];
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNamesEng = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dateObj = new Date(year, month - 1, day);
        const dayName = dayNames[dateObj.getDay()];
        const monthName = monthNamesEng[month - 1];
        const dateDisplay = `${dayName}, ${day} ${monthName} ${year}`;
        
        let clockIn = state.rulesBefore.dayStart;
        let clockOut = state.rulesBefore.dayEnd;
        
        state.attendanceLogs.push({
            date: dateStr,
            dateDisplay: dateDisplay,
            shift: 'day',
            clockIn: clockIn,
            clockOut: clockOut,
            status: 'full day',
            leaveType: '',
            isLate: false
        });
    }
    applyShiftTypeToLogs();
}

// Apply shift configuration to daily logs
function applyShiftTypeToLogs() {
    // Sync UI inputs directly into state to ensure calculations always use the active values
    const dayShiftStartDateInput = document.getElementById("day-shift-start-date");
    const nightShiftOffDateInput = document.getElementById("night-shift-off-date");
    const nightShiftTransitionDateInput = document.getElementById("night-shift-transition-date");

    if (dayShiftStartDateInput) state.dayShiftStartDate = dayShiftStartDateInput.value;
    if (nightShiftOffDateInput) state.nightShiftOffDate = nightShiftOffDateInput.value;
    if (nightShiftTransitionDateInput) state.nightShiftTransitionDate = nightShiftTransitionDateInput.value;

    // Sync the 5 fixed holidays from the DOM date inputs
    state.holidays[0] = { date: document.getElementById("config-holiday-date-1")?.value || "", type: "compulsory" };
    for (let i = 2; i <= 5; i++) {
        state.holidays[i - 1] = { date: document.getElementById(`config-holiday-date-${i}`)?.value || "", type: "off" };
    }

    // Sync additional unpaid holidays from the DOM inputs
    const additionalContainer = document.getElementById("additional-holidays-container");
    if (additionalContainer) {
        const rows = additionalContainer.querySelectorAll(".additional-holiday-row");
        state.holidays = state.holidays.slice(0, 5);
        rows.forEach(row => {
            const input = row.querySelector(".additional-holiday-date");
            if (input && input.value) {
                state.holidays.push({ date: input.value, type: "unpaid" });
            }
        });
    }

    state.attendanceLogs.forEach(log => {
        const logDateStr = log.date;
        const isAfterCutoff = state.hasTimeChange && state.timeChangeDate && (logDateStr >= state.timeChangeDate);
        const currentRules = isAfterCutoff ? state.rulesAfter : state.rulesBefore;
        const otherRules = isAfterCutoff ? state.rulesBefore : state.rulesAfter;

        // Check if log date matches any of the 5 registered holidays
        const matchedHoliday = state.holidays.find(h => h && h.date === logDateStr);
        if (matchedHoliday && matchedHoliday.type) {
            log.status = 'on Leave';
            log.leaveType = matchedHoliday.type;
            if (!log.isImported) {
                log.clockIn = '';
                log.clockOut = '';
            }
            checkLateness(log);
            return;
        }

        if (state.shiftType === 'day') {
            const transitionDateStr = state.dayShiftStartDate;
            if (transitionDateStr && logDateStr >= transitionDateStr) {
                // transitioned to night shift
                log.shift = 'night';
                if (!log.isImported) {
                    log.clockIn = currentRules.nightStart;
                    log.clockOut = currentRules.nightEnd;
                }
            } else {
                // standard day shift
                log.shift = 'day';
                if (!log.isImported) {
                    log.clockIn = currentRules.dayStart;
                    log.clockOut = currentRules.dayEnd;
                }
            }
        } else if (state.shiftType === 'night') {
            const transitionDateStr = state.nightShiftTransitionDate;
            const offDateStr = state.nightShiftOffDate;

            if (transitionDateStr && logDateStr >= transitionDateStr) {
                // transitioned to day shift
                log.shift = 'day';
                if (!log.isImported) {
                    log.clockIn = currentRules.dayStart;
                    log.clockOut = currentRules.dayEnd;
                }
            } else if (offDateStr && logDateStr === offDateStr) {
                // shift change off day
                log.shift = 'night';
                log.status = 'on Leave';
                log.leaveType = 'shift_change';
                if (!log.isImported) {
                    log.clockIn = '';
                    log.clockOut = '';
                }
            } else {
                // standard night shift
                log.shift = 'night';
                if (!log.isImported) {
                    log.clockIn = currentRules.nightStart;
                    log.clockOut = currentRules.nightEnd;
                }
            }
        }
        
        // Auto check lateness
        checkLateness(log);
    });
}

function getWorkedHours(clockIn, clockOut) {
    if (!clockIn || !clockOut || clockIn === '--:--' || clockOut === '--:--' || clockIn === '' || clockOut === '') return 0;
    
    const parseTime = (timeStr) => {
        let hours = 0;
        let minutes = 0;
        const cleanStr = timeStr.toLowerCase().replace('am','').replace('pm','').trim();
        const parts = cleanStr.split(':').map(Number);
        hours = parts[0] || 0;
        minutes = parts[1] || 0;
        
        if (timeStr.toLowerCase().includes('pm') && hours !== 12) {
            hours += 12;
        } else if (timeStr.toLowerCase().includes('am') && hours === 12) {
            hours = 0;
        }
        return hours * 60 + minutes;
    };
    
    const startMins = parseTime(clockIn);
    const endMins = parseTime(clockOut);
    
    let diff = endMins - startMins;
    if (diff < 0) {
        diff += 24 * 60;
    }
    
    return diff / 60;
}

// 5. Lateness logic according to May 25 boundary
function checkLateness(log) {
    if (log.status !== 'full day' && log.status !== 'partialday' && log.status !== 'incomplete') {
        log.isLate = false;
        return;
    }
    
    if (!log.clockIn) {
        log.isLate = false;
        return;
    }

    const logDateStr = log.date;
    const isAfterCutoff = state.hasTimeChange && state.timeChangeDate && (logDateStr >= state.timeChangeDate);
    const currentRules = isAfterCutoff ? state.rulesAfter : state.rulesBefore;
    
    let [inHours, inMins] = log.clockIn.split(":").map(Number);
    
    // Timezone Offset conversion if log has a timezone column and it differs from state.timezone
    if (log.timezone) {
        let logOffset = 0;
        if (log.timezone.includes('+08') || log.timezone.includes('+8') || log.timezone.includes('GMT+8') || log.timezone.includes('GMT +08')) {
            logOffset = 8;
        } else if (log.timezone.includes('+07') || log.timezone.includes('+7') || log.timezone.includes('GMT+7') || log.timezone.includes('GMT +07')) {
            logOffset = 7;
        }
        
        if (logOffset > 0) {
            const systemOffset = state.timezone === 'Malaysia' ? 8 : 7;
            const diff = systemOffset - logOffset;
            
            if (diff !== 0) {
                inHours += diff;
                if (inHours < 0) inHours += 24;
                if (inHours >= 24) inHours -= 24;
            }
        }
    }
    
    const totalInMins = inHours * 60 + inMins;

    if (log.shift === 'day') {
        const [limitHours, limitMins] = currentRules.dayStart.split(":").map(Number);
        const limitInMins = limitHours * 60 + limitMins;
        log.isLate = totalInMins > (limitInMins + 5);
    } else {
        // Night shift
        const [limitHours, limitMins] = currentRules.nightStart.split(":").map(Number);
        const limitInMins = limitHours * 60 + limitMins;
        
        let checkInMins = totalInMins;
        let checkLimitMins = limitInMins;
        
        if (limitInMins >= 12 * 60 && totalInMins < 12 * 60) {
            checkInMins += 24 * 60;
        }
        
        log.isLate = checkInMins > (checkLimitMins + 5);
    }
}

function getQuarterCarryoverOffDays(employeeName, targetMonth) {
    if (!targetMonth) return 0;
    const parts = targetMonth.split("-").map(Number);
    if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return 0;
    
    const year = parts[0];
    const month = parts[1];
    
    // Determine the quarter's starting month (1, 4, 7, 10)
    const quarterStartMonth = Math.floor((month - 1) / 3) * 3 + 1;
    
    let carryover = 0;
    const historyKey = `salary_verification_history_emp_${employeeName.toLowerCase().replace(/\s+/g, "_")}`;
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    } catch (e) {
        console.error(e);
    }
    
    // Accumulate from quarterStartMonth up to month - 1
    for (let m = quarterStartMonth; m < month; m++) {
        const monthStr = `${year}-${String(m).padStart(2, '0')}`;
        const record = history.find(r => r.month === monthStr);
        if (record) {
            // Count used off days in that month
            const usedOff = record.attendanceLogs ? record.attendanceLogs.filter(log => log.status === 'on Leave' && log.leaveType === 'off').length : 4;
            
            // Standard limit is 4
            carryover = Math.max(0, 4 + carryover - usedOff);
        } else {
            // If no record exists, carryover contribution is 0 (reset carryover from that month)
            carryover = 0;
        }
    }
    return carryover;
}

function calculateSalary(logs, baseSal, isProb, isMidMonth, midMonthDays, shiftType, nightOffDay, nightTransDay, nightRate, attendanceDeductRate = 0, exchRate = null) {
    let daysInMonth = logs.length;
    if (logs && logs.length > 0 && logs[0].date) {
        const parts = logs[0].date.split("-").map(Number);
        if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            daysInMonth = new Date(parts[0], parts[1], 0).getDate();
        }
    }
    const dailyRate = baseSal / daysInMonth;

    // A. Probation deduction -> New staff deposit (15%)
    let newStaffDeposit = 0;
    if (isProb) {
        let shouldDeduct = true;
        
        // If hireDate is set, check the 15% new staff deposit logic
        if (state.hireDate) {
            const [hireYear, hireMonth, hireDay] = state.hireDate.split("-").map(Number);
            const [tsYear, tsMonth] = state.month.split("-").map(Number);
            
            const diffMonths = (tsYear * 12 + tsMonth) - (hireYear * 12 + hireMonth);
            
            if (hireDay === 1) {
                // Start on 1st: Deduct on month 1, 2, 3 (diffMonths = 0, 1, 2)
                if (diffMonths < 0 || diffMonths >= 3) {
                    shouldDeduct = false;
                }
            } else {
                // Start mid-month: Month 1 (partial) is not deducted. Deduct on Month 2, 3, 4 (diffMonths = 1, 2, 3)
                if (diffMonths < 1 || diffMonths > 3) {
                    shouldDeduct = false;
                }
            }
        } else {
            // Fallback: Check if they started mid-month using the manual checkbox
            if (isMidMonth) {
                shouldDeduct = false;
            }
        }
        
        if (shouldDeduct) {
            newStaffDeposit = baseSal * 0.15;
        }
    }
    
    // B. Mid-month start extra days
    const extraWorkPay = isMidMonth ? (baseSal / 30) * midMonthDays : 0;

    // Count Leave types
    let offDaysTaken = 0;
    const offDaysDates = [];
    let compulsoryTaken = 0;
    const compulsoryDates = [];
    let shiftChangeTaken = 0;
    const shiftChangeDates = [];
    let unpaidLeaveTaken = 0;
    const unpaidLeaveDates = [];
    let absentDays = 0;
    const absentDates = [];
    
    let incompleteCount = 0;
    let partialdayCount = 0;
    
    let latesCount = 0;
    let nightShiftsWorked = 0;
    let lateNightShifts = 0;

    logs.forEach(log => {
        const hasNoClock = (!log.clockIn || log.clockIn === '' || log.clockIn === '--:--') && 
                           (!log.clockOut || log.clockOut === '' || log.clockOut === '--:--');

        let leaveCategory = null;
        if (log.status === 'on Leave') {
            const matchedHoliday = state.holidays.find(h => h && h.date === log.date);
            if (matchedHoliday) {
                leaveCategory = matchedHoliday.type;
            } else {
                if (log.leaveType === 'shift_change' || log.leaveType === 'unpaid') {
                    leaveCategory = log.leaveType;
                }
            }
        }

        if (hasNoClock) {
            if (log.status === 'on Leave') {
                if (leaveCategory === 'off') { offDaysTaken++; offDaysDates.push(log.date); }
                else if (leaveCategory === 'compulsory') { compulsoryTaken++; compulsoryDates.push(log.date); }
                else if (leaveCategory === 'shift_change') { shiftChangeTaken++; shiftChangeDates.push(log.date); }
                else if (leaveCategory === 'unpaid') { unpaidLeaveTaken++; unpaidLeaveDates.push(log.date); }
            } else {
                absentDays++;
                absentDates.push(log.date);
            }
        } else {
            if (log.status === 'on Leave') {
                if (leaveCategory === 'off') { offDaysTaken++; offDaysDates.push(log.date); }
                else if (leaveCategory === 'compulsory') { compulsoryTaken++; compulsoryDates.push(log.date); }
                else if (leaveCategory === 'shift_change') { shiftChangeTaken++; shiftChangeDates.push(log.date); }
                else if (leaveCategory === 'unpaid') { unpaidLeaveTaken++; unpaidLeaveDates.push(log.date); }
            } else if (log.status === 'absent') {
                absentDays++;
                absentDates.push(log.date);
            } else if (log.status === 'incomplete') {
                incompleteCount++;
            } else if (log.status === 'partialday') {
                partialdayCount++;
            }
        }

        // check late
        if (log.isLate) {
            latesCount++;
        }

        // Night shift details
        if (log.shift === 'night' && (log.status === 'full day' || log.status === 'partialday')) {
            nightShiftsWorked++;
            if (log.isLate) {
                lateNightShifts++;
            }
        }
    });

    // Limit checks & excess conversion to unpaid leave
    // Query carryover off-days within the quarter for all workers (max standard limit is 4 + carryover)
    const employeeNameStr = state.employeeName || (state.currentUser ? state.currentUser.name : "Guest");
    const carryover = getQuarterCarryoverOffDays(employeeNameStr, state.month);
    const maxOffDays = 4 + carryover;
    
    let excessOffDays = 0;
    const excessOffDates = [];
    if (offDaysTaken > maxOffDays) {
        excessOffDays = offDaysTaken - maxOffDays;
        excessOffDates.push(...offDaysDates.slice(maxOffDays));
    }

    // Max 1 paid Compulsory Leave for all employees
    let excessCompulsory = 0;
    const excessCompulsoryDates = [];
    if (compulsoryTaken > 1) {
        excessCompulsory = compulsoryTaken - 1;
        excessCompulsoryDates.push(...compulsoryDates.slice(1));
    }

    // Max 1 paid Shift Change Off Day (Only for night shift / transitioning night to day workers in Group B)
    const belongsToGroupB = (shiftType === 'night' || shiftType === 'night_to_day');
    let excessShiftChange = 0;
    const excessShiftChangeDates = [];
    if (belongsToGroupB) {
        if (shiftChangeTaken > 1) {
            excessShiftChange = shiftChangeTaken - 1;
            excessShiftChangeDates.push(...shiftChangeDates.slice(1));
        }
    } else {
        // Group A (day, day_to_night) pure day shift doesn't get paid shift change off days
        excessShiftChange = shiftChangeTaken;
        excessShiftChangeDates.push(...shiftChangeDates);
    }

    const unpaidDeductionDetails = [];
    unpaidLeaveDates.forEach(d => unpaidDeductionDetails.push({ date: d, reason: 'unpaid' }));
    absentDates.forEach(d => unpaidDeductionDetails.push({ date: d, reason: 'absent' }));
    excessOffDates.forEach(d => unpaidDeductionDetails.push({ date: d, reason: 'excess_off' }));
    excessCompulsoryDates.forEach(d => unpaidDeductionDetails.push({ date: d, reason: 'excess_compulsory' }));
    excessShiftChangeDates.forEach(d => unpaidDeductionDetails.push({ date: d, reason: 'excess_shift_change' }));

    const unpaidDeductionsCount = unpaidLeaveTaken + absentDays + excessOffDays + excessCompulsory + excessShiftChange;

    // Unpaid salary deductions -> Unpaid leave
    const unpaidLeaveDeduct = dailyRate * unpaidDeductionsCount;

    // Let's count non-waived lates, incompletes, and partialdays
    let incompletePenaltiesCount = 0;
    let penalizedPartialdayCount = 0;
    
    let nonWaivedIncompleteCount = 0;
    let nonWaivedLatesCount = 0;
    let nonWaivedPartialdayCount = 0;

    logs.forEach(log => {
        if (log.isWaived) return; // Skip entirely if waived

        if (log.status === 'incomplete') {
            nonWaivedIncompleteCount++;
            // Penalize only if NOT reported with reason
            if (!log.reportedScanOut) {
                incompletePenaltiesCount++;
            }
        } else if (log.status === 'partialday') {
            const workedHrs = getWorkedHours(log.clockIn, log.clockOut);
            if (workedHrs >= 8.0) {
                nonWaivedPartialdayCount++;
                penalizedPartialdayCount++;
            }
        }

        if (log.isLate) {
            nonWaivedLatesCount++;
        }
    });

    // 1st late is automatically waived, so deduction starts from 2nd day
    const penalizedLatesCount = nonWaivedLatesCount > 1 ? nonWaivedLatesCount - 1 : 0;

    const rateOfUSD = exchRate !== null ? exchRate : (state.exchangeRate || 35.0);

    const incompleteDeduct = incompletePenaltiesCount * 5 * rateOfUSD;
    const lateDeduct = penalizedLatesCount * 5 * rateOfUSD;
    const partialdayDeduct = penalizedPartialdayCount * 0.5 * dailyRate;
    const attendanceDeduction = incompleteDeduct + lateDeduct + partialdayDeduct;

    // C. Diligent Allowance (1550 THB)
    // Forfeited if:
    // - Entry is actually late under Thai timezone (เลท) (even once)
    // - There are unpaid deductions or incomplete/partial shifts
    // - Not a full month worked (เริ่มงานไม่เต็มเดือน)
    const hasUnpaidOrAbsent = unpaidDeductionsCount > 0 || nonWaivedIncompleteCount > 0;
    const isLateOnce = nonWaivedLatesCount > 0; // Actual late (เลท) under GMT+7
    const isNotFullMonth = isMidMonth;
    
    const isEligibleForDiligent = !hasUnpaidOrAbsent && !isLateOnce && !isNotFullMonth;
    const diligentAllowance = isEligibleForDiligent ? 1550 : 0;

    // Diligent Forfeit Reasons
    let diligentReason = "ได้รับปกติ";
    if (!isEligibleForDiligent) {
        const reasons = [];
        if (isLateOnce) reasons.push("เข้างานเลท (สายจริง)");
        if (unpaidDeductionsCount > 0) reasons.push("หยุดงานเกินสิทธิ์/ลากิจไม่รับเงิน");
        if (nonWaivedIncompleteCount > 0) reasons.push("สแกนไม่ครบ (Incomplete)");
        if (nonWaivedPartialdayCount > 0) reasons.push("ทำงานบางส่วน (Partialday)");
        if (isNotFullMonth) reasons.push("ทำงานไม่เต็มเดือน");
        diligentReason = "หมดสิทธิ์เนื่องจาก: " + reasons.join(", ");
    }

    // D. Night Shift Allowance
    // Calculated daily using the active nightEnd rules (from 00:00 to nightEnd) at fixed hourly rate of 10.25 THB/hour, independent of actual clock-out logs.
    let nightShiftAllowance = 0;
    logs.forEach(log => {
        if (log.shift === 'night' && (log.status === 'full day' || log.status === 'partialday')) {
            const logDateStr = log.date;
            const isAfterCutoff = state.hasTimeChange && state.timeChangeDate && (logDateStr >= state.timeChangeDate);
            const currentRules = isAfterCutoff ? state.rulesAfter : state.rulesBefore;
            const nightEndStr = currentRules.nightEnd || '08:00';
            
            const parts = nightEndStr.split(':').map(Number);
            const endHour = (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) ? parts[0] + (parts[1]/60) : 8;
            
            nightShiftAllowance += endHour * 10.25;
        }
    });

    // Remaining Cash-Convertible Off Days
    // Calculated as: Standard monthly limit (4) minus offDaysTaken, capped between 0 and 4
    let remainingOffDaysCash = Math.max(0, 4 - offDaysTaken);
    
    // Note: If they just started mid-month, they have NO cash-convertible off days
    let isNewHireMidMonth = false;
    if (state.hireDate) {
        const [hireYear, hireMonth, hireDay] = state.hireDate.split("-").map(Number);
        const [tsYear, tsMonth] = state.month.split("-").map(Number);
        if (hireYear === tsYear && hireMonth === tsMonth && hireDay > 1) {
            isNewHireMidMonth = true;
        }
    } else {
        if (isMidMonth) {
            isNewHireMidMonth = true;
        }
    }
    
    if (isNewHireMidMonth) {
        remainingOffDaysCash = 0;
    }

    // Net Salary
    const netSalary = baseSal - newStaffDeposit + extraWorkPay - unpaidLeaveDeduct - attendanceDeduction + diligentAllowance + nightShiftAllowance;

    return {
        baseSalary: baseSal,
        newStaffDeposit,
        extraWorkPay,
        unpaidLeaveDeduct,
        unpaidDeductionsCount,
        unpaidDeductionDetails,
        offDaysTaken,
        remainingOffDaysCash,
        carryover,
        allowedOffDays: maxOffDays,
        compulsoryTaken,
        shiftChangeTaken,
        latesCount: penalizedLatesCount,
        incompleteCount: nonWaivedIncompleteCount,
        incompletePenaltiesCount,
        partialdayCount: penalizedPartialdayCount,
        attendanceDeduction,
        nightShiftsWorked,
        lateNightShifts,
        nightShiftAllowance,
        diligentAllowance,
        diligentReason,
        netSalary
    };
}

// Helper to format currency
function formatCurrency(val) {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val);
}

// 7. Update UI and calculation outputs
function recalculateAndRender() {
    let calc;
    if (state.isRecordLocked && state.savedCalcResults) {
        calc = state.savedCalcResults;
    } else {
        applyShiftTypeToLogs();
        calc = calculateSalary(
            state.attendanceLogs,
            state.baseSalary,
            state.isProbation,
            state.isMidMonthStart,
            state.midMonthExtraDays,
            state.shiftType,
            state.nightShiftOffDate,
            state.nightShiftTransitionDate,
            state.nightShiftAllowanceRate,
            state.attendanceDeductionRate,
            state.exchangeRate
        );
    }

    // Update Dashboard Cards
    document.getElementById("calc-net-salary").innerText = formatCurrency(calc.netSalary);
    
    const baseDiff = state.payslipData.netSalary > 0 ? (state.payslipData.netSalary - calc.netSalary) : 0;
    
    // Calculate total expected salary adjustments (excluding summary 'net' key)
    let totalAdjustments = 0;
    Object.keys(state.adjustments || {}).forEach(key => {
        if (key === 'net') return;
        const adj = state.adjustments[key];
        if (adj && adj.amount !== 0) {
            totalAdjustments += adj.amount;
        }
    });
    
    const diff = baseDiff - totalAdjustments;
    const diffEl = document.getElementById("diff-salary");
    const diffDescEl = document.getElementById("diff-salary-desc");
    const lang = state.language || 'en';

    // Update active employee badge in comparison card
    const activeEmpBadge = document.getElementById("active-employee-badge");
    if (activeEmpBadge) {
        const teamText = state.employeeTeam === 'Audit' ? 
            (lang === 'th' ? "ออดิท" : (lang === 'zh' ? "審計" : "Audit")) : 
            (lang === 'th' ? "CS" : (lang === 'zh' ? "客服" : "CS"));
        const nameText = state.employeeName || (lang === 'th' ? "ยังไม่ได้ระบุ" : (lang === 'zh' ? "未指定" : "Not specified"));
        activeEmpBadge.innerText = lang === 'th' ? `ชื่อ: ${nameText} (ทีม: ${teamText})` : 
                                  (lang === 'zh' ? `姓名: ${nameText} (團隊: ${teamText})` : 
                                  `Name: ${nameText} (Team: ${teamText})`);
    }
    
    // Status text mapping
    const statusMap = {
        th: {
            no_diff: "ไม่พบส่วนต่างสลิปเงินเดือน",
            title_ok: "ข้อมูลถูกต้องตรงกัน",
            title_empty: "ยังไม่ได้ตรวจสอบ",
            desc_ok: "เงินเดือนในสลิปตรงกับเวลาทำงานจริง",
            desc_empty: "อัปโหลดข้อมูลหรือคลิกข้อมูลทดสอบเพื่อเริ่มวิเคราะห์",
            title_error: "พบข้อผิดพลาด!",
            desc_error: `ผลการเปรียบเทียบพบส่วนต่าง ${formatCurrency(Math.abs(diff))}`,
            overpaid: "สลิปจ่ายเกินกว่าการทำงานจริง",
            underpaid: "สลิปจ่ายขาดกว่าการทำงานจริง",
            days: "วัน",
            no_prob: "ไม่หัก (พนักงานปกติ)",
            prob_deduct: `หัก 15% (-${formatCurrency(calc.newStaffDeposit)})`
        },
        en: {
            no_diff: "No discrepancy found",
            title_ok: "Match Success",
            title_empty: "Unverified",
            desc_ok: "Payslip matches actual work hours",
            desc_empty: "Upload data or click load demo to analyze",
            title_error: "Discrepancy Found!",
            desc_error: `Difference of ${formatCurrency(Math.abs(diff))} detected`,
            overpaid: "Payslip pays MORE than actual",
            underpaid: "Payslip pays LESS than actual",
            days: "days",
            no_prob: "No deduct (Normal)",
            prob_deduct: `Deduct 15% (-${formatCurrency(calc.newStaffDeposit)})`
        },
        zh: {
            no_diff: "未發現薪資差額",
            title_ok: "比對正確無誤",
            title_empty: "尚未驗證",
            desc_ok: "薪資單金額符合實際考勤打卡紀錄",
            desc_empty: "請上傳考勤及薪資單或點選測試數據進行分析",
            title_error: "發現薪資差異！",
            desc_error: `檢測到差額 ${formatCurrency(Math.abs(diff))}`,
            overpaid: "薪資單溢發 (大於實際金額)",
            underpaid: "薪資單少發 (少於實際金額)",
            days: "天",
            no_prob: "不扣除 (正式員工)",
            prob_deduct: `扣除 15% (-${formatCurrency(calc.newStaffDeposit)})`
        }
    };
    
    const textDict = statusMap[lang] || statusMap.en;

    diffEl.innerText = formatCurrency(diff);
    if (diff === 0) {
        diffEl.className = "h3 mb-0 font-weight-bold";
        diffDescEl.innerText = textDict.no_diff;
        document.getElementById("match-status-title").innerText = state.payslipData.netSalary > 0 ? textDict.title_ok : textDict.title_empty;
        document.getElementById("match-status-desc").innerText = state.payslipData.netSalary > 0 ? textDict.desc_ok : textDict.desc_empty;
        document.getElementById("match-status-icon").className = "fa-solid fa-circle-check text-success";
        document.getElementById("match-status-icon").parentNode.className = "icon-circle bg-success-light";
    } else {
        diffEl.className = "h3 mb-0 font-weight-bold text-danger";
        diffDescEl.innerText = diff > 0 ? textDict.overpaid : textDict.underpaid;
        document.getElementById("match-status-title").innerText = textDict.title_error;
        document.getElementById("match-status-desc").innerText = textDict.desc_error;
        document.getElementById("match-status-icon").className = "fa-solid fa-circle-xmark text-danger";
        document.getElementById("match-status-icon").parentNode.className = "icon-circle bg-danger-light";
    }

    // Update Insights Right sidebar
    const offDaysLimitEl = document.getElementById("stat-off-days-limit");
    if (offDaysLimitEl) {
        offDaysLimitEl.innerText = `4 ${textDict.days}`;
    }
    const offDaysCarryoverEl = document.getElementById("stat-off-days-carryover");
    if (offDaysCarryoverEl) {
        offDaysCarryoverEl.innerText = `${calc.carryover || 0} ${textDict.days}`;
    }
    document.getElementById("stat-off-days-taken").innerText = `${calc.offDaysTaken} ${textDict.days}`;
    document.getElementById("stat-off-days-cash").innerText = `${calc.remainingOffDaysCash} ${textDict.days}`;

    // Update summary off days text in the attendance grid banner
    const offDaysTextEl = document.getElementById("stat-remaining-off-days-text");
    if (offDaysTextEl) {
        let isNewHireMidMonth = false;
        if (state.hireDate) {
            const [hireYear, hireMonth, hireDay] = state.hireDate.split("-").map(Number);
            const [tsYear, tsMonth] = state.month.split("-").map(Number);
            if (hireYear === tsYear && hireMonth === tsMonth && hireDay > 1) {
                isNewHireMidMonth = true;
            }
        } else if (state.isMidMonthStart) {
            isNewHireMidMonth = true;
        }

        if (isNewHireMidMonth) {
            if (lang === 'th') offDaysTextEl.innerText = "0 วัน (ไม่มีสิทธิ์เนื่องจากพนักงานใหม่เริ่มงานไม่เต็มเดือนแรก)";
            else if (lang === 'zh') offDaysTextEl.innerText = "0 天 (無權享受，因新員工入職首月未滿月)";
            else offDaysTextEl.innerText = "0 days (Not eligible - new hire started mid-month)";
            offDaysTextEl.className = "font-bold text-danger";
        } else {
            if (lang === 'th') offDaysTextEl.innerText = `${calc.remainingOffDaysCash} วัน (สะสมเพื่อนำไปแลกเงินภายหลัง - จะยังไม่ได้รับเงินในเดือนนี้)`;
            else if (lang === 'zh') offDaysTextEl.innerText = `${calc.remainingOffDaysCash} 天 (累積以供日後兌現 - 本月不發放此款項)`;
            else offDaysTextEl.innerText = `${calc.remainingOffDaysCash} days (Accumulated for later cash-in - not paid in the current month)`;
            offDaysTextEl.className = "font-bold text-success";
        }
    }
    document.getElementById("stat-compulsory-taken").innerText = `${calc.compulsoryTaken} ${textDict.days}`;
    document.getElementById("stat-shift-change-taken").innerText = `${calc.shiftChangeTaken} / 1 ${textDict.days}`;
    document.getElementById("stat-probation-applied").innerText = calc.newStaffDeposit > 0 ? textDict.prob_deduct : textDict.no_prob;
    document.getElementById("stat-diligent-allowance").innerText = formatCurrency(calc.diligentAllowance);
    
    // Diligent reason localized translation
    let diligentReasonText = calc.diligentReason;
    if (calc.diligentReason === "ได้รับปกติ") {
        diligentReasonText = lang === 'th' ? "ได้รับปกติ" : (lang === 'zh' ? "正常發放" : "Eligible (Normal)");
    } else if (calc.diligentReason.startsWith("สิทธิ์ตกเนื่องจาก: ")) {
        const reasonsStr = calc.diligentReason.replace("สิทธิ์ตกเนื่องจาก: ", "");
        const reasonsList = reasonsStr.split(", ");
        const translatedReasons = reasonsList.map(r => {
            if (r === "สาย") return lang === 'zh' ? "遲到" : "Late";
            if (r === "ขาดงาน/ลากิจ") return lang === 'zh' ? "事假/曠工" : "Unpaid/Absent";
            if (r === "เริ่มงานไม่เต็มเดือน") return lang === 'zh' ? "月中入職" : "Mid-month Start";
            return r;
        });
        diligentReasonText = lang === 'th' ? calc.diligentReason : 
                            (lang === 'zh' ? "取消全勤資格：" + translatedReasons.join("、") : "Forfeited due to: " + translatedReasons.join(", "));
    }
    document.getElementById("stat-diligent-reason").innerText = diligentReasonText;
    
    if (calc.diligentAllowance > 0) {
        document.getElementById("stat-diligent-reason").className = "insight-value text-success";
    } else {
        document.getElementById("stat-diligent-reason").className = "insight-value text-danger text-xs";
    }

    // Show/hide Submit Dispute button
    const submitDisputeBtn = document.getElementById("submit-dispute-btn");
    if (submitDisputeBtn) {
        if (state.isRecordLocked || state.attendanceLogs.length === 0) {
            submitDisputeBtn.classList.add("d-none");
        } else {
            submitDisputeBtn.classList.remove("d-none");
        }
    }

    // Render Dispute Status Banner
    const disputeBanner = document.getElementById("dispute-status-banner");
    const disputeIcon = document.getElementById("dispute-banner-icon");
    const disputeTitle = document.getElementById("dispute-banner-title");
    const disputeDesc = document.getElementById("dispute-banner-desc");
    
    if (disputeBanner && disputeIcon && disputeTitle && disputeDesc) {
        if (state.isRecordLocked && state.disputeStatus && state.disputeStatus !== 'none') {
            disputeBanner.style.display = "block";
            if (state.disputeStatus === 'pending') {
                disputeBanner.className = "alert alert-warning p-3 mb-4";
                disputeBanner.style.borderLeft = "5px solid #ffc107";
                disputeIcon.className = "fa-solid fa-hourglass-half text-warning mr-3";
                disputeTitle.innerText = lang === 'th' ? "รอดำเนินการตรวจสอบ (Pending Auditor Review)" : "Pending Auditor Review";
                disputeDesc.innerText = lang === 'th' ? 
                    "พนักงานได้ส่งคำร้องขอตรวจสอบความถูกต้องของสลิปเงินเดือนนี้แล้ว พร้อมรูปถ่ายหลักฐานประกอบ ขณะนี้ทีมงานตรวจสอบกำลังตรวจสอบรายการของคุณ" : 
                    "The employee has submitted a dispute request with screenshots. Auditors are currently reviewing the evidence.";
            } else if (state.disputeStatus === 'resolved') {
                disputeBanner.className = "alert alert-success p-3 mb-4";
                disputeBanner.style.borderLeft = "5px solid var(--success-color)";
                disputeIcon.className = "fa-solid fa-circle-check text-success mr-3";
                disputeTitle.innerText = lang === 'th' ? "ตรวจสอบสำเร็จ (Audit Completed) ✓" : "Audit Completed ✓";
                
                const commentText = state.adminComment ? ` (${state.adminComment})` : "";
                disputeDesc.innerText = lang === 'th' ? 
                    "ผู้ตรวจสอบได้ดำเนินการตรวจสอบรายการเรียบร้อยแล้ว ข้อมูลการทำงานของพนักงานถูกต้องตรงกัน" + commentText : 
                    "Auditors have completed the audit. The employee's work logs and records match correctly." + commentText;
            } else if (state.disputeStatus === 'pending_hr') {
                disputeBanner.className = "alert alert-danger p-3 mb-4";
                disputeBanner.style.borderLeft = "5px solid #fd7e14";
                disputeIcon.className = "fa-solid fa-triangle-exclamation text-danger mr-3";
                disputeTitle.innerText = lang === 'th' ? "รอดำเนินการแก้ไข (Pending Resolution) ✗" : "Pending Resolution with HR";
                
                const commentText = state.adminComment ? ` (${state.adminComment})` : "";
                disputeDesc.innerText = lang === 'th' ? 
                    "พบความคลาดเคลื่อนในการคำนวณเงินจริง ขณะนี้อยู่ระหว่างการประสานงานแก้ไขข้อผิดพลาดกับฝ่ายบุคคล (HR)" + commentText : 
                    "Discrepancy verified. Currently coordinating error resolution with Human Resources (HR)." + commentText;
            }
        } else {
            disputeBanner.style.display = "none";
        }
    }

    // Render detailed comparison tables & narratives
    renderComparisonTable(calc);
    renderDiscrepancyNarrative(calc, diff, baseDiff);
    renderAttendanceGrid();

    // If payslip netSalary is populated, show mock payslip view
    if (state.payslipData && state.payslipData.netSalary > 0) {
        displayMockPayslipFromData();
    }

    // Show/hide empty state placeholder based on data presence
    checkDashboardVisibility();
}

function renderComparisonTable(calc) {
    const tbody = document.getElementById("comparison-table-body");
    tbody.innerHTML = "";
    const lang = state.language || 'en';

    const names = {
        th: {
            base: "ฐานเงินเดือน (Salary)",
            probation: "New staff deposit (หักเงินประกันพนักงานใหม่)",
            extra: "บวกเงินทำงานไม่เต็มเดือน (Extra Days)",
            unpaid: "Unpaid leave (หักลางาน/ขาดงานเกินสิทธิ์)",
            attendance: "Attendance Deduction (หักเข้างานสาย)",
            diligent: "เบี้ยขยันคงที่ (Diligent)",
            night: "เบี้ยเลี้ยงกะดึก (Night Shift)",
            net: "ยอดรับสุทธิ (Net Total)",
            deduct: "หัก",
            match: "ตรงกัน",
            mismatch: "ไม่ตรงกัน"
        },
        en: {
            base: "Base Salary",
            probation: "New staff deposit (15% probation)",
            extra: "Mid-month Additions (Extra Days)",
            unpaid: "Unpaid leave (Absent/excess leaves)",
            attendance: "Attendance Deduction (Lates/incomplete)",
            diligent: "Diligent Allowance",
            night: "Night Shift Allowance",
            net: "Net Salary",
            deduct: "Deduct",
            match: "Match",
            mismatch: "Mismatch"
        },
        zh: {
            base: "基本薪資 (Salary)",
            probation: "新員工保證金 (New staff deposit)",
            extra: "月中入職加薪 (Extra Days)",
            unpaid: "事假扣款 (Unpaid leave)",
            attendance: "考勤扣款 (Attendance Deduction)",
            diligent: "固定全勤獎金 (Diligent)",
            night: "夜班津貼 (Night Shift)",
            net: "實發金額 (Net Salary)",
            deduct: "扣",
            match: "吻合",
            mismatch: "不吻合"
        }
    };
    
    const dict = names[lang] || names.en;

    const items = [
        { name: dict.base, calcVal: calc.baseSalary, slipVal: state.payslipData.baseSalary, key: "base" },
        { name: dict.probation, calcVal: -calc.newStaffDeposit, slipVal: -state.payslipData.probationDeduct, key: "probation" },
        { name: dict.extra, calcVal: calc.extraWorkPay, slipVal: state.payslipData.extraWorkPay, key: "extra" },
        { name: dict.unpaid, calcVal: -calc.unpaidLeaveDeduct, slipVal: -state.payslipData.unpaidDeduct, key: "unpaid" },
        { name: dict.attendance, calcVal: -calc.attendanceDeduction, slipVal: -state.payslipData.attendanceDeduct, key: "attendance" },
        { name: dict.diligent, calcVal: calc.diligentAllowance, slipVal: state.payslipData.diligent, key: "diligent" },
        { name: dict.night, calcVal: calc.nightShiftAllowance, slipVal: state.payslipData.nightShift, key: "night" },
        { name: dict.net, calcVal: calc.netSalary, slipVal: state.payslipData.netSalary, key: "net" }
    ];

    let sumAdjustedCalc = 0;
    
    // First pass: calculate sum of adjusted expected values for net salary (excluding 'net' key)
    items.forEach(item => {
        if (item.key === 'net') return;
        const adj = state.adjustments[item.key] || { amount: 0, note: "" };
        const adjustedCalcVal = item.calcVal + adj.amount;
        sumAdjustedCalc += adjustedCalcVal;
    });

    items.forEach(item => {
        const adj = state.adjustments[item.key] || { amount: 0, note: "" };
        
        let adjustedCalcVal;
        if (item.key === 'net') {
            adjustedCalcVal = sumAdjustedCalc;
        } else {
            adjustedCalcVal = item.calcVal + adj.amount;
        }
        
        const adjustedDiff = item.slipVal - adjustedCalcVal;
        const isMatch = Math.abs(adjustedDiff) < 0.01;
        const row = document.createElement("tr");

        // Translations for UI elements
        const uiText = {
            th: { add: "เพิ่มยอด", reduce: "ลดยอด", clear: "ล้าง", addNote: "เพิ่มหมายเหตุ" },
            en: { add: "Add", reduce: "Reduce", clear: "Clear", addNote: "Add Note" },
            zh: { add: "增加", reduce: "減少", clear: "清除", addNote: "添加備註" }
        };
        const langText = uiText[lang] || uiText.en;

        let calcValHTML = `<div>${formatCurrency(Math.abs(adjustedCalcVal))} ${adjustedCalcVal < 0 ? `<span class="text-danger">(${dict.deduct})</span>` : ''}</div>`;
        if (item.key !== 'net' && adj.amount !== 0) {
            calcValHTML += `<div class="text-xs text-muted" style="font-weight: normal; margin-top: 2px;">(เดิม: ${formatCurrency(Math.abs(item.calcVal))} ปรับปรุง: ${adj.amount > 0 ? '+' : ''}${formatCurrency(adj.amount)})</div>`;
        }

        let diffHTML = `<div class="${isMatch ? 'text-success' : 'text-danger font-bold'}">${isMatch ? '฿0.00' : formatCurrency(adjustedDiff)}</div>`;

        let adjustHTML = '';
        let noteHTML = '';
        
        if (item.key === 'net') {
            adjustHTML = `<div class="text-xs text-muted">-</div>`;
            noteHTML = `<div class="text-xs text-muted">-</div>`;
        } else {
            const isNoteEmpty = !adj.note || adj.note.trim() === "";
            adjustHTML = `
                <div class="flex-row justify-center gap-1">
                    <button class="btn btn-success btn-xs py-1 px-2" style="font-size: 0.75rem; ${isNoteEmpty ? 'opacity: 0.55; cursor: not-allowed;' : ''}" onclick="openAdjustModal('${item.key}', 'add')">
                        <i class="fa-solid fa-plus text-xs"></i> ${langText.add}
                    </button>
                    <button class="btn btn-danger btn-xs py-1 px-2" style="font-size: 0.75rem; ${isNoteEmpty ? 'opacity: 0.55; cursor: not-allowed;' : ''}" onclick="openAdjustModal('${item.key}', 'reduce')">
                        <i class="fa-solid fa-minus text-xs"></i> ${langText.reduce}
                    </button>
                    ${adj.amount !== 0 ? `
                        <button class="btn btn-secondary btn-xs py-1 px-2" style="font-size: 0.75rem;" onclick="clearAdjustment('${item.key}')" title="ล้างค่าปรับปรุง">
                            <i class="fa-solid fa-rotate-left text-xs"></i> ${langText.clear}
                        </button>
                    ` : ''}
                </div>
            `;

            if (adj.note) {
                noteHTML = `
                    <div class="flex-row items-center justify-between gap-1 text-left" style="font-size: 0.85rem; max-width: 250px; margin: 0 auto; word-break: break-all;">
                        <span class="text-muted" style="font-style: italic;">${adj.note}</span>
                        <div class="flex-row gap-2" style="flex-shrink: 0;">
                            <i class="fa-solid fa-pen-to-square text-primary cursor-pointer text-xs" onclick="openNoteModal('${item.key}')" title="แก้ไข"></i>
                            <i class="fa-solid fa-trash text-danger cursor-pointer text-xs" onclick="clearNote('${item.key}')" title="ลบ"></i>
                        </div>
                    </div>
                `;
            } else {
                noteHTML = `
                    <button class="btn btn-secondary btn-xs" style="font-size: 0.75rem;" onclick="openNoteModal('${item.key}')">
                        <i class="fa-solid fa-comment-medical"></i> ${langText.addNote}
                    </button>
                `;
            }
        }

        row.innerHTML = `
            <td class="text-left font-semibold">${item.name}</td>
            <td>${calcValHTML}</td>
            <td>${formatCurrency(Math.abs(item.slipVal))} ${item.slipVal < 0 ? `<span class="text-danger">(${dict.deduct})</span>` : ''}</td>
            <td>${diffHTML}</td>
            <td>${adjustHTML}</td>
            <td>${noteHTML}</td>
            <td>
                ${isMatch ? 
                    `<span class="badge bg-success-light text-success"><i class="fa-solid fa-check"></i> ${dict.match}</span>` : 
                    `<span class="badge bg-danger-light text-danger"><i class="fa-solid fa-triangle-exclamation"></i> ${dict.mismatch}</span>`}
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderDiscrepancyNarrative(calc, diff, baseDiff) {
    const container = document.getElementById("discrepancy-narrative-box");
    container.innerHTML = "";
    const lang = state.language || 'en';

    if (state.payslipData.netSalary === 0) {
        if (lang === 'th') {
            container.innerHTML = `
                <div class="alert alert-info">
                    <h4><i class="fa-solid fa-circle-info"></i> คำแนะนำ</h4>
                    <p>ระบบยังไม่มีข้อมูลสำหรับเปรียบเทียบ คุณสามารถทำได้โดย:</p>
                    <ul>
                        <li>กดปุ่ม <strong>"โหลดข้อมูลทดสอบ (Demo)"</strong> มุมซ้ายล่างเพื่อดูหน้าตัวอย่างทันที</li>
                        <li>หรือเปิดแท็บ <strong>"อัปโหลดและตรวจสอบ"</strong> เพื่ออัปโหลดไฟล์เวลางานและสลิปเงินเดือนพนักงานจริง</li>
                    </ul>
                </div>
            `;
        } else if (lang === 'zh') {
            container.innerHTML = `
                <div class="alert alert-info">
                    <h4><i class="fa-solid fa-circle-info"></i> 提示</h4>
                    <p>系統目前無可用比對的數據。您可以：</p>
                    <ul>
                        <li>點擊左下角 <strong>「載入測試數據 (Demo)」</strong> 按鈕以快速預覽範例</li>
                        <li>或在 <strong>「上傳與驗證」</strong> 標籤頁中，上傳員工考勤打卡文件與薪資單</li>
                    </ul>
                </div>
            `;
        } else { // en
            container.innerHTML = `
                <div class="alert alert-info">
                    <h4><i class="fa-solid fa-circle-info"></i> Guide</h4>
                    <p>There is no comparison data available. You can:</p>
                    <ul>
                        <li>Click the <strong>"Load Demo Data"</strong> button in the bottom-left corner to load sample records.</li>
                        <li>Or go to the <strong>"Upload & Verify"</strong> tab to upload your timesheet and payslip files.</li>
                    </ul>
                </div>
            `;
        }
        return;
    }

    const reasonLabels = {
        th: {
            unpaid: "ลากิจ/ลาไม่รับค่าจ้าง",
            absent: "ขาดงาน",
            excess_off: "หยุดประจำสัปดาห์เกินสิทธิ์",
            excess_compulsory: "หยุดนักขัตฤกษ์เกินสิทธิ์",
            excess_shift_change: "วันหยุดเปลี่ยนกะเกินสิทธิ์/ไม่มีสิทธิ์"
        },
        en: {
            unpaid: "Unpaid Leave",
            absent: "Absent",
            excess_off: "Excess Weekly Off",
            excess_compulsory: "Excess Compulsory Leave",
            excess_shift_change: "Excess Shift Change Off"
        },
        zh: {
            unpaid: "無薪事病假",
            absent: "曠工",
            excess_off: "超出公休上限",
            excess_compulsory: "超出國定假日上限",
            excess_shift_change: "超出轉班公休上限"
        }
    };

    let unpaidDetailsText = "";
    if (calc.unpaidDeductionDetails && calc.unpaidDeductionDetails.length > 0) {
        const labels = reasonLabels[lang] || reasonLabels.en;
        const detailsList = calc.unpaidDeductionDetails.map(d => {
            const dayNum = parseInt(d.date.split("-")[2]);
            return `${dayNum} (${labels[d.reason]})`;
        });
        if (lang === 'th') {
            unpaidDetailsText = ` (ได้แก่ วันที่: ${detailsList.join(", ")})`;
        } else if (lang === 'zh') {
            unpaidDetailsText = `（即日期：${detailsList.join("、")}）`;
        } else {
            unpaidDetailsText = ` (specifically on: ${detailsList.join(", ")})`;
        }
    }

    if (Math.abs(diff) < 0.01) {
        if (Math.abs(baseDiff || 0) > 0.01) {
            // Render user adjustment details with notes!
            let adjustmentsListHTML = "";
            Object.keys(state.adjustments || {}).forEach(key => {
                const adj = state.adjustments[key];
                if (adj && adj.amount !== 0) {
                    const itemName = getRowItemName(key);
                    adjustmentsListHTML += `<li><strong>${itemName}:</strong> ปรับปรุงยอด ${adj.amount > 0 ? '+' : ''}${formatCurrency(adj.amount)} (${adj.note || 'ไม่มีหมายเหตุ'})</li>`;
                }
            });

            if (lang === 'th') {
                container.innerHTML = `
                    <div class="alert alert-success border-success" style="background-color: #f0fdf4; border-color: #bbf7d0; color: #166534;">
                        <h4 class="font-bold mb-2 text-success" style="font-size: 1.1rem;"><i class="fa-solid fa-circle-check"></i> ยอดเปรียบเทียบตรงกันแล้ว (ปรับปรุงเสร็จสิ้น)</h4>
                        <p class="mb-2 text-sm text-success-dark">ส่วนต่างสลิปเงินเดือนกับประวัติเวลา ได้รับการปรับยอดตามรายการปรับปรุงและเหตุผลในหมายเหตุดังต่อไปนี้:</p>
                        <ul class="pl-4 text-xs mt-2" style="list-style-type: disc; line-height: 1.6;">
                            ${adjustmentsListHTML}
                        </ul>
                        <div class="mt-3 pt-2 border-top border-success text-xs">
                            <strong>ผลลัพธ์:</strong> ยอดส่วนต่างสุทธิถูกปรับปรุงจนไม่มีส่วนต่างคงเหลือ (฿0.00) ตรงกันทุกรายการ
                        </div>
                    </div>
                `;
            } else if (lang === 'zh') {
                container.innerHTML = `
                    <div class="alert alert-success border-success" style="background-color: #f0fdf4; border-color: #bbf7d0; color: #166534;">
                        <h4 class="font-bold mb-2 text-success" style="font-size: 1.1rem;"><i class="fa-solid fa-circle-check"></i> 薪資比對已調整一致 (Adjustments Match)</h4>
                        <p class="mb-2 text-sm text-success-dark">原檢測到的薪資差異已根據以下調整項目與備註原因進行調整：</p>
                        <ul class="pl-4 text-xs mt-2" style="list-style-type: disc; line-height: 1.6;">
                            ${adjustmentsListHTML}
                        </ul>
                    </div>
                `;
            } else { // en
                container.innerHTML = `
                    <div class="alert alert-success border-success" style="background-color: #f0fdf4; border-color: #bbf7d0; color: #166534;">
                        <h4 class="font-bold mb-2 text-success" style="font-size: 1.1rem;"><i class="fa-solid fa-circle-check"></i> Discrepancies Resolved via Adjustments</h4>
                        <p class="mb-2 text-sm text-success-dark">The original payslip discrepancies have been resolved using the following adjustments and notes:</p>
                        <ul class="pl-4 text-xs mt-2" style="list-style-type: disc; line-height: 1.6;">
                            ${adjustmentsListHTML}
                        </ul>
                    </div>
                `;
            }
            return;
        }

        if (lang === 'th') {
            container.innerHTML = `
                <div class="alert alert-success">
                    <h4><i class="fa-solid fa-circle-check"></i> ยอดคำนวณถูกต้องตรงกันทั้งหมด</h4>
                    <p>ระบบได้ทำการเปรียบเทียบเวลางานในระบบ HR sys team กับเอกสารสลิปเงินเดือนพนักงานเรียบร้อยแล้ว ไม่พบข้อผิดพลาดหรือส่วนต่างใดๆ ยอดจ่ายในสลิปตรงตามเกณฑ์ของบริษัททุกรายการ</p>
                </div>
            `;
        } else if (lang === 'zh') {
            container.innerHTML = `
                <div class="alert alert-success">
                    <h4><i class="fa-solid fa-circle-check"></i> 薪資計算結果完全一致</h4>
                    <p>系統已比對考勤打卡記錄與員工薪資單，未發現任何薪資誤差或差異。薪資單上的實發金額完全符合公司發放標準。</p>
                </div>
            `;
        } else { // en
            container.innerHTML = `
                <div class="alert alert-success">
                    <h4><i class="fa-solid fa-circle-check"></i> Calculations Match Perfectly</h4>
                    <p>The system verified the employee's work schedule against the uploaded payslip. No discrepancies or errors were detected. All payments in the payslip conform to company policies.</p>
                </div>
            `;
        }
        return;
    }

    // Detail mismatch reasons
    let listHTML = "";
    
    if (lang === 'th') {
        if (Math.abs(calc.baseSalary - state.payslipData.baseSalary) > 0.01) {
            listHTML += `<li><strong>ฐานเงินเดือนไม่ตรงกัน:</strong> ยอดจากประวัติคือ ${formatCurrency(calc.baseSalary)} แต่ในสลิประบุเป็น ${formatCurrency(state.payslipData.baseSalary)} (ส่วนต่าง ${formatCurrency(state.payslipData.baseSalary - calc.baseSalary)})</li>`;
        }
        if (Math.abs(calc.newStaffDeposit - state.payslipData.probationDeduct) > 0.01) {
            listHTML += `<li><strong>เงินประกันพนักงานใหม่ (New staff deposit 15%):</strong> คำนวณจริงควรหัก ${formatCurrency(calc.newStaffDeposit)} แต่ในสลิปหัก ${formatCurrency(state.payslipData.probationDeduct)}</li>`;
        }
        if (Math.abs(calc.extraWorkPay - state.payslipData.extraWorkPay) > 0.01) {
            listHTML += `<li><strong>เงินบวกพิเศษวันทำงานไม่เต็มเดือน:</strong> คำนวณจริงคือ ${formatCurrency(calc.extraWorkPay)} แต่ในสลิประบุเป็น ${formatCurrency(state.payslipData.extraWorkPay)}</li>`;
        }
        if (Math.abs(calc.unpaidLeaveDeduct - state.payslipData.unpaidDeduct) > 0.01) {
            listHTML += `<li><strong>เงินหัก Unpaid leave:</strong> มีวันหยุดเกินสิทธิ์/ลากิจไม่ได้รับค่าจ้างสะสม ${calc.unpaidDeductionsCount} วัน${unpaidDetailsText} ยอดหักควรเป็น ${formatCurrency(calc.unpaidLeaveDeduct)} แต่ในสลิปหัก ${formatCurrency(state.payslipData.unpaidDeduct)}</li>`;
        }
        if (Math.abs(calc.attendanceDeduction - state.payslipData.attendanceDeduct) > 0.01) {
            listHTML += `<li><strong>เงินหักเข้าสาย/สแกนไม่ครบ (Attendance Deduction):</strong> ยอดหักจริงควรเป็น ${formatCurrency(calc.attendanceDeduction)} (เข้างานสายที่ปรับเงิน ${calc.latesCount} ครั้ง x $5 USD [${formatCurrency(5 * (state.exchangeRate || 35.0))}], สแกนไม่ครบที่ปรับเงิน ${calc.incompletePenaltiesCount} ครั้ง x $5 USD [${formatCurrency(5 * (state.exchangeRate || 35.0))}], ทำงานบางส่วน ${calc.partialdayCount} วัน x ฿150) แต่ในสลิปหัก ${formatCurrency(state.payslipData.attendanceDeduct)}</li>`;
        }
        if (Math.abs(calc.diligentAllowance - state.payslipData.diligent) > 0.01) {
            if (calc.diligentAllowance === 0 && state.payslipData.diligent > 0) {
                listHTML += `<li><strong>การจ่ายเบี้ยขยันผิดเกณฑ์ (Overpaid Diligent):</strong> พนักงานไม่มีสิทธิ์ได้รับเบี้ยขยันเนื่องจาก <strong>"${calc.diligentReason}"</strong> แต่ในสลิปกลับยังได้รับเบี้ยขยันจำนวน ${formatCurrency(state.payslipData.diligent)}</li>`;
            } else if (calc.diligentAllowance > 0 && state.payslipData.diligent === 0) {
                listHTML += `<li><strong>พนักงานไม่ได้รับเบี้ยขยัน (Underpaid Diligent):</strong> พนักงานมีสิทธิ์ได้รับเบี้ยขยัน 1,550 บาทเนื่องจากไม่มีประวัติสายหรือลากิจ แต่ในสลิปกลับไม่ได้ระบุการจ่าย</li>`;
            } else {
                listHTML += `<li><strong>ยอดเบี้ยขยันระบุไม่ตรง:</strong> คำนวณได้ ${formatCurrency(calc.diligentAllowance)} แต่ในสลิประบุ ${formatCurrency(state.payslipData.diligent)}</li>`;
            }
        }
        if (Math.abs(calc.nightShiftAllowance - state.payslipData.nightShift) > 0.01) {
            listHTML += `<li><strong>เบี้ยเลี้ยงกะดึก:</strong> พนักงานทำงานกะดึกจริง ${calc.nightShiftsWorked} วัน สมควรได้รับเบี้ยเลี้ยงรวม ${formatCurrency(calc.nightShiftAllowance)} (ตามเกณฑ์ชั่วโมงจากเที่ยงคืนถึงเวลาเลิกกะดึก อัตรา ฿10.25/ชม.) แต่ในสลิปจ่ายมา ${formatCurrency(state.payslipData.nightShift)}</li>`;
        }
        
        container.innerHTML = `
            <div class="alert alert-danger">
                <h4><i class="fa-solid fa-circle-xmark"></i> รายงานความคลาดเคลื่อนและสาเหตุ</h4>
                <p class="mb-2">จากการตรวจสอบ พบความผิดพลาดในการออกสลิปเงินเดือนของพนักงานดังต่อไปนี้:</p>
                <ul class="pl-4">${listHTML}</ul>
                <div class="mt-3 pt-2 border-top">
                    <strong>สรุปผลต่างสุทธิ:</strong> สลิปเงินเดือนมีค่าคลาดเคลื่อนสุทธิอยู่ที่ <span class="font-bold">${formatCurrency(Math.abs(diff))}</span> (${diff > 0 ? 'บริษัทจ่ายเงินเกินกว่าจริง' : 'พนักงานได้รับเงินขาดจากจริง'})
                </div>
            </div>
        `;
    } else if (lang === 'zh') {
        if (Math.abs(calc.baseSalary - state.payslipData.baseSalary) > 0.01) {
            listHTML += `<li><strong>基本薪資不符：</strong> 歷史設定值為 ${formatCurrency(calc.baseSalary)}，但薪資單上為 ${formatCurrency(state.payslipData.baseSalary)}（差額 ${formatCurrency(state.payslipData.baseSalary - calc.baseSalary)}）</li>`;
        }
        if (Math.abs(calc.newStaffDeposit - state.payslipData.probationDeduct) > 0.01) {
            listHTML += `<li><strong>新員工保證金 (15%)：</strong> 實際應扣 ${formatCurrency(calc.newStaffDeposit)}，但薪資單扣除 ${formatCurrency(state.payslipData.probationDeduct)}</li>`;
        }
        if (Math.abs(calc.extraWorkPay - state.payslipData.extraWorkPay) > 0.01) {
            listHTML += `<li><strong>月中入職補貼：</strong> 實際應付 ${formatCurrency(calc.extraWorkPay)}，但薪資單上為 ${formatCurrency(state.payslipData.extraWorkPay)}</li>`;
        }
        if (Math.abs(calc.unpaidLeaveDeduct - state.payslipData.unpaidDeduct) > 0.01) {
            listHTML += `<li><strong>事假扣款 (Unpaid leave)：</strong> 累計事假或超出公休上限天數共 ${calc.unpaidDeductionsCount} 天${unpaidDetailsText}，應扣 ${formatCurrency(calc.unpaidLeaveDeduct)}，但薪資單扣除 ${formatCurrency(state.payslipData.unpaidDeduct)}</li>`;
        }
        if (Math.abs(calc.attendanceDeduction - state.payslipData.attendanceDeduct) > 0.01) {
            listHTML += `<li><strong>考勤扣款 (遲到/不完整)：</strong> 實際應扣 ${formatCurrency(calc.attendanceDeduction)}（遲到計罰 ${calc.latesCount} 次 x $5 USD [${formatCurrency(5 * (state.exchangeRate || 35.0))}]，未完整打卡計罰 ${calc.incompletePenaltiesCount} 次 x $5 USD [${formatCurrency(5 * (state.exchangeRate || 35.0))}]，部分工時 ${calc.partialdayCount} 天 x ฿150），但薪資單扣除 ${formatCurrency(state.payslipData.attendanceDeduct)}</li>`;
        }
        if (Math.abs(calc.diligentAllowance - state.payslipData.diligent) > 0.01) {
            if (calc.diligentAllowance === 0 && state.payslipData.diligent > 0) {
                listHTML += `<li><strong>異常發放全勤獎金 (Overpaid)：</strong> 員工無權獲得全勤獎金（原因："${calc.diligentReason}"），但薪資單仍發放了 ${formatCurrency(state.payslipData.diligent)}</li>`;
            } else if (calc.diligentAllowance > 0 && state.payslipData.diligent === 0) {
                listHTML += `<li><strong>員工未收到全勤獎金 (Underpaid)：</strong> 員工符合全勤發放標準（無遲到或事假），但薪資單未發放 1,550 元</li>`;
            } else {
                listHTML += `<li><strong>全勤獎金金額不符：</strong> 計算值為 ${formatCurrency(calc.diligentAllowance)}，但薪資單上為 ${formatCurrency(state.payslipData.diligent)}</li>`;
            }
        }
        if (Math.abs(calc.nightShiftAllowance - state.payslipData.nightShift) > 0.01) {
            listHTML += `<li><strong>夜班津貼：</strong> 員工實際值夜班 ${calc.nightShiftsWorked} 天，應得津貼共 ${formatCurrency(calc.nightShiftAllowance)}（依團隊設定，自午夜起至下班時間止，以每小時 10.25 元計），但薪資單發放 ${formatCurrency(state.payslipData.nightShift)}</li>`;
        }
        
        container.innerHTML = `
            <div class="alert alert-danger">
                <h4><i class="fa-solid fa-circle-xmark"></i> 薪資差異分析報告</h4>
                <p class="mb-2">核對完畢，發現以下薪資單發放錯誤項目：</p>
                <ul class="pl-4">${listHTML}</ul>
                <div class="mt-3 pt-2 border-top">
                    <strong>淨額差異總計：</strong> 薪資單實發金額與實際計算值之差額為 <span class="font-bold">${formatCurrency(Math.abs(diff))}</span> (${diff > 0 ? '公司多付' : '員工少得'})
                </div>
            </div>
        `;
    } else { // en
        if (Math.abs(calc.baseSalary - state.payslipData.baseSalary) > 0.01) {
            listHTML += `<li><strong>Base Salary Mismatch:</strong> Expected ${formatCurrency(calc.baseSalary)} from profile, but payslip states ${formatCurrency(state.payslipData.baseSalary)} (Difference: ${formatCurrency(state.payslipData.baseSalary - calc.baseSalary)})</li>`;
        }
        if (Math.abs(calc.newStaffDeposit - state.payslipData.probationDeduct) > 0.01) {
            listHTML += `<li><strong>New Staff Deposit (15%):</strong> Expected deduction of ${formatCurrency(calc.newStaffDeposit)}, but payslip deducted ${formatCurrency(state.payslipData.probationDeduct)}</li>`;
        }
        if (Math.abs(calc.extraWorkPay - state.payslipData.extraWorkPay) > 0.01) {
            listHTML += `<li><strong>Mid-month Additions:</strong> Expected extra pay of ${formatCurrency(calc.extraWorkPay)}, but payslip has ${formatCurrency(state.payslipData.extraWorkPay)}</li>`;
        }
        if (Math.abs(calc.unpaidLeaveDeduct - state.payslipData.unpaidDeduct) > 0.01) {
            listHTML += `<li><strong>Unpaid Leave Deductions:</strong> Expected deduction of ${formatCurrency(calc.unpaidLeaveDeduct)} for ${calc.unpaidDeductionsCount} unpaid/excess off days${unpaidDetailsText}, but payslip deducted ${formatCurrency(state.payslipData.unpaidDeduct)}</li>`;
        }
        if (Math.abs(calc.attendanceDeduction - state.payslipData.attendanceDeduct) > 0.01) {
            listHTML += `<li><strong>Attendance Deductions (Lates/Incomplete):</strong> Expected deduction of ${formatCurrency(calc.attendanceDeduction)} (Penalized lates: ${calc.latesCount} times x $5 USD [${formatCurrency(5 * (state.exchangeRate || 35.0))}], Penalized incompletes: ${calc.incompletePenaltiesCount} times x $5 USD [${formatCurrency(5 * (state.exchangeRate || 35.0))}], Partial days: ${calc.partialdayCount} days x ฿150), but payslip deducted ${formatCurrency(state.payslipData.attendanceDeduct)}</li>`;
        }
        if (Math.abs(calc.diligentAllowance - state.payslipData.diligent) > 0.01) {
            if (calc.diligentAllowance === 0 && state.payslipData.diligent > 0) {
                listHTML += `<li><strong>Diligent Allowance Overpaid:</strong> Employee is not eligible due to "${calc.diligentReason}", but payslip paid ${formatCurrency(state.payslipData.diligent)}</li>`;
            } else if (calc.diligentAllowance > 0 && state.payslipData.diligent === 0) {
                listHTML += `<li><strong>Diligent Allowance Underpaid:</strong> Employee is eligible for 1,550 THB (no lates/absents), but payslip did not pay it</li>`;
            } else {
                listHTML += `<li><strong>Diligent Allowance Mismatch:</strong> Calculated ${formatCurrency(calc.diligentAllowance)}, but payslip has ${formatCurrency(state.payslipData.diligent)}</li>`;
            }
        }
        if (Math.abs(calc.nightShiftAllowance - state.payslipData.nightShift) > 0.01) {
            listHTML += `<li><strong>Night Shift Allowance:</strong> Expected ${calc.nightShiftsWorked} night shift days (Total: ${formatCurrency(calc.nightShiftAllowance)} calculated from midnight to shift end time at 10.25 THB/hour), but payslip covered ${formatCurrency(state.payslipData.nightShift)}</li>`;
        }
        
        container.innerHTML = `
            <div class="alert alert-danger">
                <h4><i class="fa-solid fa-circle-xmark"></i> Discrepancy & Analysis Report</h4>
                <p class="mb-2">Discrepancy detected in the payroll slip for the following items:</p>
                <ul class="pl-4">${listHTML}</ul>
                <div class="mt-3 pt-2 border-top">
                    <strong>Net Discrepancy:</strong> The payslip deviates by <span class="font-bold">${formatCurrency(Math.abs(diff))}</span> (${diff > 0 ? 'Overpaid by employer' : 'Underpaid to employee'})
                </div>
            </div>
        `;
    }
}

// 8. Render Attendance Logs Grid
function renderAttendanceGrid() {
    const tbody = document.getElementById("attendance-table-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    // Do not show the daily schedule list until a month has been explicitly selected or loaded
    if (!state.hasChosenMonth) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-5 text-muted">
                    <i class="fa-solid fa-calendar-day mb-2" style="font-size: 2.2rem; opacity: 0.4;"></i><br>
                    ${state.language === 'th' ? 'กรุณาเลือกเดือนที่ต้องการดูข้อมูลตารางการทำงาน' : 'Please select a month to view the work schedule'}
                </td>
            </tr>
        `;
        return;
    }

    let activeIncompleteScans = 0;
    let activeLateCount = 0;

    state.attendanceLogs.forEach((log, index) => {
        const tr = document.createElement("tr");
        if (log.isLate) tr.classList.add("bg-danger-light");

        // Format Date Thai
        const [year, month, day] = log.date.split("-");
        const dateThai = log.dateDisplay || `${day}/${month}/${parseInt(year) + 543}`;

        // Calculate daily adjustments (plus/minus)
        let additions = [];
        let deductions = [];
        let addTotal = 0;
        let deductTotal = 0;

        // 1. Check Night Shift Allowance (Calculated daily from 00:00 to nightEnd config at 10.25/hour)
        if (log.shift === 'night' && (log.status === 'full day' || log.status === 'partialday')) {
            const isAfterCutoff = state.hasTimeChange && state.timeChangeDate && (log.date >= state.timeChangeDate);
            const currentRules = isAfterCutoff ? state.rulesAfter : state.rulesBefore;
            const nightEndStr = currentRules.nightEnd || '08:00';
            const parts = nightEndStr.split(':').map(Number);
            const endHour = (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) ? parts[0] + (parts[1]/60) : 8;
            const dailyNightAllowance = endHour * 10.25;
            
            addTotal += dailyNightAllowance;
            additions.push(state.language === 'th' ? `เบี้ยเลี้ยงกะดึก +฿${dailyNightAllowance.toFixed(2)}` : `Night shift +฿${dailyNightAllowance.toFixed(2)}`);
        }

        let daysInMonth = state.attendanceLogs.length;
        if (state.attendanceLogs && state.attendanceLogs.length > 0 && state.attendanceLogs[0].date) {
            const parts = state.attendanceLogs[0].date.split("-").map(Number);
            if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                daysInMonth = new Date(parts[0], parts[1], 0).getDate();
            }
        }
        const dailyRate = (state.baseSalary || 20000) / daysInMonth;
        const usdRate = state.exchangeRate || 35.00;

        if (log.status === 'incomplete') {
            if (log.isWaived) {
                deductions.push(state.language === 'th' ? 'สแกนไม่ครบ (ยกเว้น/Waived)' : 'Incomplete (Waived)');
            } else if (log.reportedScanOut) {
                deductions.push(state.language === 'th' ? 'สแกนไม่ครบ (แจ้งสาเหตุแล้ว)' : 'Incomplete (Reported)');
            } else {
                const cost = 5 * usdRate;
                deductTotal += cost;
                deductions.push(state.language === 'th' ? `สแกนไม่ครบ ฿${cost.toFixed(2)} ($5)` : `Incomplete ฿${cost.toFixed(2)} ($5)`);
            }
        } else if (log.status === 'partialday') {
            const workedHrs = getWorkedHours(log.clockIn, log.clockOut);
            if (workedHrs >= 8.0) {
                if (log.isWaived) {
                    deductions.push(state.language === 'th' ? 'ทำงานบางส่วน (ยกเว้น/Waived)' : 'Partial Day (Waived)');
                } else {
                    const cost = 0.5 * dailyRate;
                    deductTotal += cost;
                    deductions.push(state.language === 'th' ? `ทำงานบางส่วน -฿${cost.toFixed(2)} (50%)` : `Partial Day -฿${cost.toFixed(2)} (50%)`);
                }
            }
        } else if (log.status === 'absent') {
            if (log.isWaived) {
                deductions.push(state.language === 'th' ? 'ขาดงาน (ยกเว้น/Waived)' : 'Absent (Waived)');
            } else {
                const cost = dailyRate;
                deductTotal += cost;
                deductions.push(state.language === 'th' ? `ขาดงาน -฿${cost.toFixed(2)}` : `Absent -฿${cost.toFixed(2)}`);
            }
        } else if (log.status === 'on Leave' && log.leaveType === 'unpaid') {
            if (log.isWaived) {
                deductions.push(state.language === 'th' ? 'ลากิจไม่รับเงิน (ยกเว้น/Waived)' : 'Unpaid Leave (Waived)');
            } else {
                const cost = dailyRate;
                deductTotal += cost;
                deductions.push(state.language === 'th' ? `ลากิจไม่รับเงิน -฿${cost.toFixed(2)}` : `Unpaid Leave -฿${cost.toFixed(2)}`);
            }
        }
        
        if (log.isLate) {
            if (log.isWaived) {
                deductions.push(state.language === 'th' ? 'สาย (ยกเว้น/Waived)' : 'Late (Waived)');
            } else {
                activeLateCount++;
                if (activeLateCount === 1) {
                    deductions.push(state.language === 'th' ? 'สาย (ยกเว้นครั้งแรก)' : 'Late (1st Free)');
                } else {
                    const cost = 5 * usdRate;
                    deductTotal += cost;
                    deductions.push(state.language === 'th' ? `สาย ฿${cost.toFixed(2)} ($5)` : `Late ฿${cost.toFixed(2)} ($5)`);
                }
            }
        }

        let deductHTML = '';
        let lineDetails = [];

        if (addTotal > 0) {
            deductHTML += `<span class="text-success font-bold">+฿${addTotal}</span> `;
            additions.forEach(reason => {
                lineDetails.push(`<span class="text-success" style="font-size: 0.7rem; line-height: 1.1;">${reason}</span>`);
            });
        }
        if (deductTotal > 0) {
            deductHTML += `<span class="text-danger font-bold">-฿${deductTotal}</span>`;
            deductions.forEach(reason => {
                lineDetails.push(`<span class="text-danger" style="font-size: 0.7rem; line-height: 1.1;">${reason}</span>`);
            });
        } else if (deductions.length > 0) {
            // E.g. day 1 exempt
            deductions.forEach(reason => {
                lineDetails.push(`<span class="text-success" style="font-size: 0.7rem; line-height: 1.1;">${reason}</span>`);
            });
        }

        if (deductHTML === '') {
            if (lineDetails.length > 0) {
                deductHTML = `<span class="text-muted">-</span><br><span style="display: block; line-height: 1.1;">${lineDetails.join('<br>')}</span>`;
            } else {
                deductHTML = '<span class="text-muted">-</span>';
            }
        } else {
            deductHTML = `${deductHTML}<br><span style="display: block; line-height: 1.1;">${lineDetails.join('<br>')}</span>`;
        }

        const locked = state.isRecordLocked;
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${dateThai}</td>
            <td>
                <select class="form-control form-control-sm cell-shift" data-index="${index}" ${locked ? 'disabled' : ''}>
                    <option value="day" ${log.shift === 'day' ? 'selected' : ''}>เช้า (Day)</option>
                    <option value="night" ${log.shift === 'night' ? 'selected' : ''}>ดึก (Night)</option>
                </select>
            </td>
            <td>
                <input type="time" class="form-control form-control-sm cell-time-in" value="${log.clockIn || ''}" data-index="${index}" ${locked ? 'disabled' : ''}>
            </td>
            <td>
                <input type="time" class="form-control form-control-sm cell-time-out" value="${log.clockOut || ''}" data-index="${index}" ${locked ? 'disabled' : ''}>
            </td>
            <td>
                <select class="form-control form-control-sm cell-status" data-index="${index}" ${locked ? 'disabled' : ''}>
                    <option value="full day" ${log.status === 'full day' ? 'selected' : ''}>full day (เต็มวัน)</option>
                    <option value="on Leave" ${log.status === 'on Leave' ? 'selected' : ''}>on Leave (หยุดงาน)</option>
                    <option value="absent" ${log.status === 'absent' ? 'selected' : ''}>absent (ขาดงาน)</option>
                    <option value="partialday" ${log.status === 'partialday' ? 'selected' : ''}>partialday (ครึ่งวัน)</option>
                    <option value="incomplete" ${log.status === 'incomplete' ? 'selected' : ''}>incomplete (สแกนไม่ครบ)</option>
                </select>
            </td>
            <td>
                <select class="form-control form-control-sm cell-leave-type" data-index="${index}" ${log.status !== 'on Leave' || locked ? 'disabled' : ''}>
                    <option value="" ${log.leaveType === '' ? 'selected' : ''}>-- ไม่ระบุประเภทวันหยุด --</option>
                    <option value="off" ${log.leaveType === 'off' ? 'selected' : ''}>วันหยุดประจำ (Off day)</option>
                    <option value="compulsory" ${log.leaveType === 'compulsory' ? 'selected' : ''}>วันหยุดบังคับ (Compulsory)</option>
                    <option value="shift_change" ${log.leaveType === 'shift_change' ? 'selected' : ''}>วันหยุดเปลี่ยนกะ (Shift Change)</option>
                    <option value="unpaid" ${log.leaveType === 'unpaid' ? 'selected' : ''}>ลากิจไม่รับเงิน (Unpaid Leave)</option>
                </select>
            </td>
            <td>
                ${log.isLate ? 
                    '<span class="badge bg-danger text-white"><i class="fa-solid fa-clock"></i> สาย</span>' : 
                    '<span class="badge bg-success text-white"><i class="fa-solid fa-check"></i> ทัน</span>'}
            </td>
            <td>
                ${deductHTML}
            </td>
            <td>
                <div class="d-flex flex-column align-items-center gap-1 justify-content-center">
                    ${log.status === 'incomplete' ? `
                        <label class="d-flex align-items-center gap-1 mb-0 text-xs" style="cursor:${locked ? 'default' : 'pointer'}; font-size: 0.7rem;">
                            <input type="checkbox" class="cell-reported-checkbox" data-index="${index}" ${log.reportedScanOut ? 'checked' : ''} ${locked ? 'disabled' : ''}>
                            <span>${state.language === 'th' ? 'แจ้งสาเหตุแล้ว' : 'Reported'}</span>
                        </label>
                    ` : ''}
                    
                    ${(log.status === 'incomplete' || log.status === 'partialday' || log.isLate || log.status === 'absent' || (log.status === 'on Leave' && log.leaveType === 'unpaid')) ? `
                        ${log.disputeImg ? `
                            <div class="dispute-thumb-container d-flex align-items-center gap-1">
                                <img src="${log.disputeImg}" class="dispute-thumbnail" style="width: 28px; height: 28px; border-radius: 4px; object-fit: cover; cursor: pointer; border: 1px solid var(--border-color);" onclick="window.zoomDisputeImage('${log.disputeImg}', '${log.date}')">
                                ${!locked ? `
                                    <button class="btn btn-link text-danger p-0" onclick="window.deleteDisputeImage(${index})" style="line-height:1; font-size: 0.9rem;" title="${state.language === 'th' ? 'ลบรูปภาพ' : 'Remove Image'}">
                                        <i class="fa-solid fa-circle-xmark"></i>
                                    </button>
                                ` : ''}
                            </div>
                        ` : `
                            ${!locked ? `
                                <input type="file" accept="image/*" class="cell-dispute-file d-none" id="dispute-file-${index}" data-index="${index}">
                                <label for="dispute-file-${index}" class="btn btn-xs btn-outline-secondary" style="font-size: 0.65rem; padding: 2px 5px; margin: 0; cursor: pointer;">
                                    <i class="fa-solid fa-camera"></i> ${state.language === 'th' ? 'แนบหลักฐาน' : 'Proof'}
                                </label>
                            ` : '<span class="text-muted text-xs">-</span>'}
                        `}
                    ` : '<span class="text-muted text-xs">-</span>'}
                </div>
            </td>
            <td>
                <div class="d-flex align-items-center justify-content-center gap-2">
                    <input type="checkbox" class="cell-waive-checkbox" data-index="${index}" ${log.isWaived ? 'checked' : ''} ${locked ? 'disabled' : ''} style="transform: scale(1.1); cursor: pointer;">
                    ${!locked ? `
                        <button class="btn btn-outline-info btn-xs cell-recalc-btn" data-index="${index}" title="${state.language === 'th' ? 'ประมวลผลใหม่' : 'Recalculate'}" style="padding: 1px 4px; font-size: 0.7rem; border-radius: 3px;">
                            <i class="fa-solid fa-arrows-rotate text-xs"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
            <td>
                <button class="btn btn-outline-danger btn-sm delete-row-btn" data-index="${index}" ${locked ? 'disabled' : ''}>
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Add inline grid cell listeners
    attachGridEventListeners();
}

function attachGridEventListeners() {
    const table = document.getElementById("attendance-table");

    // Shift select change
    table.querySelectorAll(".cell-shift").forEach(select => {
        select.addEventListener("change", (e) => {
            const idx = parseInt(e.target.getAttribute("data-index"));
            state.attendanceLogs[idx].shift = e.target.value;
            state.attendanceLogs[idx].isImported = true;
            checkLateness(state.attendanceLogs[idx]);
            recalculateAndRender();
        });
    });

    // Time-In change
    table.querySelectorAll(".cell-time-in").forEach(input => {
        input.addEventListener("change", (e) => {
            const idx = parseInt(e.target.getAttribute("data-index"));
            state.attendanceLogs[idx].clockIn = e.target.value;
            state.attendanceLogs[idx].isImported = true;
            checkLateness(state.attendanceLogs[idx]);
            recalculateAndRender();
        });
    });

    // Time-Out change
    table.querySelectorAll(".cell-time-out").forEach(input => {
        input.addEventListener("change", (e) => {
            const idx = parseInt(e.target.getAttribute("data-index"));
            state.attendanceLogs[idx].clockOut = e.target.value;
            state.attendanceLogs[idx].isImported = true;
            recalculateAndRender();
        });
    });

    // Status change (updates leave type inputs status)
    table.querySelectorAll(".cell-status").forEach(select => {
        select.addEventListener("change", (e) => {
            const idx = parseInt(e.target.getAttribute("data-index"));
            const val = e.target.value;
            state.attendanceLogs[idx].status = val;
            state.attendanceLogs[idx].isImported = true;
            
            const leaveTypeSelect = table.querySelector(`.cell-leave-type[data-index="${idx}"]`);
            if (val === 'on Leave') {
                leaveTypeSelect.disabled = false;
                // auto set default leave type
                if (state.attendanceLogs[idx].leaveType === '') {
                    state.attendanceLogs[idx].leaveType = 'off';
                    leaveTypeSelect.value = 'off';
                }
                state.attendanceLogs[idx].clockIn = '';
                state.attendanceLogs[idx].clockOut = '';
            } else {
                leaveTypeSelect.disabled = true;
                state.attendanceLogs[idx].leaveType = '';
                leaveTypeSelect.value = '';
                
                // restore default hours
                const isAfterCutoff = state.hasTimeChange && state.timeChangeDate && (state.attendanceLogs[idx].date >= state.timeChangeDate);
                const currentRules = isAfterCutoff ? state.rulesAfter : state.rulesBefore;
                if (state.attendanceLogs[idx].shift === 'day') {
                    state.attendanceLogs[idx].clockIn = currentRules.dayStart;
                    state.attendanceLogs[idx].clockOut = currentRules.dayEnd;
                } else {
                    state.attendanceLogs[idx].clockIn = currentRules.nightStart;
                    state.attendanceLogs[idx].clockOut = currentRules.nightEnd;
                }
            }
            checkLateness(state.attendanceLogs[idx]);
            recalculateAndRender();
        });
    });

    // Leave type change
    table.querySelectorAll(".cell-leave-type").forEach(select => {
        select.addEventListener("change", (e) => {
            const idx = parseInt(e.target.getAttribute("data-index"));
            state.attendanceLogs[idx].leaveType = e.target.value;
            state.attendanceLogs[idx].isImported = true;
            recalculateAndRender();
        });
    });

    // Waive checkbox change
    table.querySelectorAll(".cell-waive-checkbox").forEach(checkbox => {
        checkbox.addEventListener("change", (e) => {
            const idx = parseInt(e.target.getAttribute("data-index"));
            state.attendanceLogs[idx].isWaived = e.target.checked;
            recalculateAndRender();
        });
    });

    // Waive row recalculate button click
    table.querySelectorAll(".cell-recalc-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = parseInt(e.currentTarget.getAttribute("data-index"));
            recalculateAndRender();
            alert(state.language === 'th' ? `ประมวลผลข้อมูลของวันที่ ${state.attendanceLogs[idx].dateDisplay || state.attendanceLogs[idx].date} ใหม่เรียบร้อยแล้ว!` : 
                  `Recalculated log for ${state.attendanceLogs[idx].dateDisplay || state.attendanceLogs[idx].date}!`);
        });
    });

    // Delete row
    table.querySelectorAll(".delete-row-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = parseInt(e.currentTarget.getAttribute("data-index"));
            state.attendanceLogs.splice(idx, 1);
            recalculateAndRender();
        });
    });

    // Reported checkbox change
    table.querySelectorAll(".cell-reported-checkbox").forEach(checkbox => {
        checkbox.addEventListener("change", (e) => {
            const idx = parseInt(e.target.getAttribute("data-index"));
            state.attendanceLogs[idx].reportedScanOut = e.target.checked;
            recalculateAndRender();
        });
    });

    // Dispute file change (screenshot uploader)
    table.querySelectorAll(".cell-dispute-file").forEach(input => {
        input.addEventListener("change", (e) => {
            const idx = parseInt(e.target.getAttribute("data-index"));
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement("canvas");
                    const max_size = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > max_size) {
                            height *= max_size / width;
                            width = max_size;
                        }
                    } else {
                        if (height > max_size) {
                            width *= max_size / height;
                            height = max_size;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
                    state.attendanceLogs[idx].disputeImg = dataUrl;
                    
                    recalculateAndRender();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    });
}

// 9. Attach event listeners for uploads, exports, tests and demo loading
function setupEventListeners() {
    const langSelect = document.getElementById("lang-select");
    if (langSelect) {
        langSelect.value = state.language || 'en';
        langSelect.addEventListener("change", (e) => {
            state.language = e.target.value;
            localStorage.setItem('app_language', state.language);
            applyLanguage();
            recalculateAndRender();
            renderHistoryList();
        });
    }

    const addRowBtn = document.getElementById("add-row-btn");
    const resetAttendanceBtn = document.getElementById("reset-attendance-btn");
    const loadDemoBtn = document.getElementById("load-demo-btn");
    const runTestsBtn = document.getElementById("run-tests-btn");
    const exportReportBtn = document.getElementById("export-report-btn");
    
    const timesheetFileInput = document.getElementById("timesheet-file-input");
    const payslipFileInput = document.getElementById("payslip-file-input");
    
    // Toggle view listeners for payslip image vs mock
    const btnShowPayslipFile = document.getElementById("btn-show-payslip-file");
    const btnShowPayslipMock = document.getElementById("btn-show-payslip-mock");
    const previewContainer = document.getElementById("payslip-preview-container");
    const mockContainer = document.getElementById("payslip-mock-container");

    if (btnShowPayslipFile && btnShowPayslipMock && previewContainer && mockContainer) {
        btnShowPayslipFile.addEventListener("click", () => {
            btnShowPayslipFile.classList.add("active");
            btnShowPayslipMock.classList.remove("active");
            previewContainer.classList.remove("d-none");
            mockContainer.classList.add("d-none");
        });

        btnShowPayslipMock.addEventListener("click", () => {
            btnShowPayslipMock.classList.add("active");
            btnShowPayslipFile.classList.remove("active");
            mockContainer.classList.remove("d-none");
            previewContainer.classList.add("d-none");
        });
    }

    // Add generic new day log
    addRowBtn.addEventListener("click", () => {
        const days = state.attendanceLogs.length;
        const [year, month] = state.month.split("-").map(Number);
        
        let newDateStr = "";
        if (days === 0) {
            newDateStr = `${year}-${String(month).padStart(2, '0')}-01`;
        } else {
            const lastDate = new Date(state.attendanceLogs[days - 1].date);
            lastDate.setDate(lastDate.getDate() + 1);
            newDateStr = lastDate.toISOString().split("T")[0];
        }

        state.attendanceLogs.push({
            date: newDateStr,
            shift: state.shiftType,
            clockIn: state.shiftType === 'day' ? '08:00' : '20:00',
            clockOut: state.shiftType === 'day' ? '20:00' : '08:00',
            status: 'full day',
            leaveType: '',
            isLate: false
        });

        applyShiftTypeToLogs();
        recalculateAndRender();
        
        // Scroll to bottom
        setTimeout(() => {
            const tableDiv = document.querySelector("#attendance-table").parentNode;
            tableDiv.scrollTop = tableDiv.scrollHeight;
        }, 100);
    });

    resetAttendanceBtn.addEventListener("click", () => {
        if (confirm("คุณต้องการล้างข้อมูลบันทึกเวลางานทั้งหมดใช่หรือไม่?")) {
            state.attendanceLogs = [];
            recalculateAndRender();
        }
    });

    // Loading Demo data
    loadDemoBtn.addEventListener("click", () => {
        loadDemoData();
    });

    // Run Calculation Test Suite
    runTestsBtn.addEventListener("click", () => {
        runTestSuite();
    });

    // Print / Export report
    exportReportBtn.addEventListener("click", () => {
        exportSummaryReport();
    });

    // Save and clear verification history listeners
    const saveHistoryBtn = document.getElementById("save-history-btn");
    const clearAllHistoryBtn = document.getElementById("clear-all-history-btn");
    const updateReportBtn = document.getElementById("update-report-btn");

    if (saveHistoryBtn) {
        saveHistoryBtn.addEventListener("click", () => {
            saveToHistory();
        });
    }

    if (updateReportBtn) {
        updateReportBtn.addEventListener("click", () => {
            if (!state.loadedHistoryId) return;
            
            // Recalculate using current configuration and logs
            const calc = calculateSalary(
                state.attendanceLogs,
                state.baseSalary,
                state.isProbation,
                state.isMidMonthStart,
                state.midMonthExtraDays,
                state.shiftType,
                state.nightShiftOffDate,
                state.nightShiftTransitionDate,
                state.nightShiftAllowanceRate,
                state.attendanceDeductionRate,
                state.exchangeRate
            );
            
            const key = getHistoryStorageKey();
            let history = JSON.parse(localStorage.getItem(key) || '[]');
            
            const idx = history.findIndex(item => item.id === state.loadedHistoryId);
            if (idx !== -1) {
                history[idx].employeeTeam = state.employeeTeam;
                history[idx].baseSalary = state.baseSalary;
                history[idx].isProbation = state.isProbation;
                history[idx].isMidMonthStart = state.isMidMonthStart;
                history[idx].midMonthExtraDays = state.midMonthExtraDays;
                history[idx].shiftType = state.shiftType;
                history[idx].shiftMode = state.shiftMode;
                history[idx].nightShiftOffDate = state.nightShiftOffDate;
                history[idx].nightShiftTransitionDate = state.nightShiftTransitionDate;
                history[idx].nightShiftAllowanceRate = state.nightShiftAllowanceRate;
                history[idx].attendanceDeductionRate = state.attendanceDeductionRate;
                history[idx].hireDate = state.hireDate;
                history[idx].holidays = state.holidays;
                history[idx].timezone = state.timezone;
                history[idx].rulesBefore = state.rulesBefore;
                history[idx].hasTimeChange = state.hasTimeChange;
                history[idx].timeChangeDate = state.timeChangeDate;
                history[idx].rulesAfter = state.rulesAfter;
                history[idx].exchangeRate = state.exchangeRate;
                history[idx].disputeStatus = state.disputeStatus || 'none';
                history[idx].adminComment = state.adminComment || '';
                
                // Save recalculated payslipData and calcResults
                history[idx].payslipData = state.payslipData;
                history[idx].calcResults = calc;
                history[idx].authorPasscode = state.currentUser ? state.currentUser.password : (history[idx].authorPasscode || '0000');
                history[idx].authorName = state.currentUser ? state.currentUser.name : (history[idx].authorName || 'Guest');
                if (history[idx].adminChecked === undefined) {
                    history[idx].adminChecked = false;
                }
                
                localStorage.setItem(key, JSON.stringify(history));
                saveRecordToCloudflare(history[idx]);
                
                recalculateAndRender();
                renderHistoryList();
                
                alert(`อัปเดตรายงานประวัติของ "${state.employeeName}" สำเร็จ!`);
            }
        });
    }

    const submitDisputeBtn = document.getElementById("submit-dispute-btn");
    if (submitDisputeBtn) {
        submitDisputeBtn.addEventListener("click", () => {
            if (!state.employeeName || state.employeeName.trim() === "") {
                alert("กรุณากรอกชื่อ-นามสกุลพนักงานก่อนส่งคำร้องตรวจสอบ");
                return;
            }
            
            const hasDispute = state.attendanceLogs.some(log => log.reportedScanOut || log.disputeImg);
            if (!hasDispute) {
                alert("ไม่พบรายการขอยกเลิกหรือรูปหลักฐานประกอบในตารางเวลางาน กรุณาทำเครื่องหมายหรือแนบภาพหลักฐานก่อนส่งคำร้อง");
                return;
            }

            if (confirm("ยืนยันส่งคำร้องตรวจสอบความถูกต้องพร้อมหลักฐานประกอบใช่หรือไม่?")) {
                state.disputeStatus = 'pending';
                saveToHistory();
            }
        });
    }

    if (clearAllHistoryBtn) {
        clearAllHistoryBtn.addEventListener("click", () => {
            clearAllHistory();
        });
    }

    const saveSettingsBtn = document.getElementById("save-settings-btn");
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener("click", () => {
            saveToHistory();
            const dashboardNav = document.querySelector(".nav-item[data-tab='dashboard']");
            if (dashboardNav) {
                dashboardNav.click();
            }
        });
    }

    const clearSettingsBtn = document.getElementById("clear-settings-btn");
    if (clearSettingsBtn) {
        clearSettingsBtn.addEventListener("click", () => {
            clearConfigSettings();
        });
    }

    // File inputs handlers
    timesheetFileInput.addEventListener("change", (e) => {
        state.isRecordLocked = false;
        state.savedCalcResults = null;
        setSettingsPanelDisabled(false);
        const banner = document.getElementById("lock-banner");
        if (banner) banner.style.display = "none";
        const unlockBtn = document.getElementById("unlock-report-btn");
        if (unlockBtn) unlockBtn.style.display = "none";
        handleTimesheetUpload(e);
    });

    payslipFileInput.addEventListener("change", (e) => {
        state.isRecordLocked = false;
        state.savedCalcResults = null;
        setSettingsPanelDisabled(false);
        const banner = document.getElementById("lock-banner");
        if (banner) banner.style.display = "none";
        const unlockBtn = document.getElementById("unlock-report-btn");
        if (unlockBtn) unlockBtn.style.display = "none";
        handlePayslipUpload(e);
    });

    // Clear individual file selections listeners
    const clearTimesheetBtn = document.getElementById("clear-timesheet-btn");
    const clearPayslipFileBtn = document.getElementById("clear-payslip-file-btn");
    const clearPayslipDataBtn = document.getElementById("clear-payslip-data-btn");
    const modalCancelBtn = document.getElementById("modal-cancel-btn");
    const modalProcessBtn = document.getElementById("modal-process-btn");

    if (clearTimesheetBtn) {
        clearTimesheetBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            clearTimesheetFile();
        });
    }

    if (clearPayslipFileBtn) {
        clearPayslipFileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            clearPayslipFile();
        });
    }

    if (clearPayslipDataBtn) {
        clearPayslipDataBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            clearPayslipData();
        });
    }

    if (modalCancelBtn) {
        modalCancelBtn.addEventListener("click", () => {
            cancelPendingUploads();
        });
    }

    if (modalProcessBtn) {
        modalProcessBtn.addEventListener("click", () => {
            executeVerification();
        });
    }

    // Drag-and-drop uploads
    const timesheetDropZone = document.getElementById("timesheet-upload-zone");
    const payslipDropZone = document.getElementById("payslip-upload-zone");

    if (timesheetDropZone) setupDragAndDrop(timesheetDropZone, timesheetFileInput);
    if (payslipDropZone) setupDragAndDrop(payslipDropZone, payslipFileInput);

    // Sync payslip manual inputs back to calculation comparison
    const form = document.getElementById("payslip-form");
    if (form) {
        form.querySelectorAll("input").forEach(input => {
            input.addEventListener("input", () => {
                state.payslipData.baseSalary = parseFloat(document.getElementById("slip-base-salary").value) || 0;
                state.payslipData.diligent = parseFloat(document.getElementById("slip-diligent").value) || 0;
                state.payslipData.nightShift = parseFloat(document.getElementById("slip-nightshift").value) || 0;
                state.payslipData.probationDeduct = parseFloat(document.getElementById("slip-probation-deduct").value) || 0;
                state.payslipData.unpaidDeduct = parseFloat(document.getElementById("slip-unpaid-deduct").value) || 0;
                state.payslipData.attendanceDeduct = parseFloat(document.getElementById("slip-attendance-deduct").value) || 0;
                state.payslipData.extraWorkPay = parseFloat(document.getElementById("slip-extra-work-pay").value) || 0;
                state.payslipData.netSalary = parseFloat(document.getElementById("slip-net-salary-input").value) || 0;
                recalculateAndRender();
            });
        });
    }

    // Generate CSV template link
    const downloadCsvTemplateLink = document.getElementById("download-csv-template");
    if (downloadCsvTemplateLink) {
        downloadCsvTemplateLink.addEventListener("click", (e) => {
            e.preventDefault();
            downloadCSVTemplate();
        });
    }

    // Modal close & save listeners
    const adjustModal = document.getElementById("adjust-amount-modal");
    const closeAdjustBtn = document.getElementById("close-adjust-modal-btn");
    const adjustCancelBtn = document.getElementById("adjust-modal-cancel-btn");
    const adjustSaveBtn = document.getElementById("adjust-modal-save-btn");
    const adjustAmountInput = document.getElementById("adjust-modal-amount");

    const hideAdjustModal = () => {
        if (adjustModal) adjustModal.style.display = "none";
        if (adjustAmountInput) adjustAmountInput.value = "";
    };

    if (closeAdjustBtn) closeAdjustBtn.addEventListener("click", hideAdjustModal);
    if (adjustCancelBtn) adjustCancelBtn.addEventListener("click", hideAdjustModal);
    if (adjustSaveBtn) {
        adjustSaveBtn.addEventListener("click", () => {
            const rawVal = adjustAmountInput.value.trim();
            if (rawVal === "") {
                alert(state.language === 'th' ? "กรุณากรอกจำนวนเงิน" : "Please enter an amount.");
                return;
            }
            const amt = parseFloat(rawVal);
            if (isNaN(amt) || amt < 0) {
                alert(state.language === 'th' ? "กรุณากรอกจำนวนเงินที่ถูกต้อง (มากกว่าหรือเท่ากับ 0)" : "Please enter a valid amount (>= 0).");
                return;
            }
            const finalAmt = window.activeAdjustType === 'reduce' ? -amt : amt;
            if (!state.adjustments[window.activeAdjustKey]) {
                state.adjustments[window.activeAdjustKey] = { amount: 0, note: "" };
            }
            state.adjustments[window.activeAdjustKey].amount = finalAmt;
            hideAdjustModal();
            recalculateAndRender();
        });
    }

    const noteModal = document.getElementById("edit-note-modal");
    const closeNoteBtn = document.getElementById("close-note-modal-btn");
    const noteCancelBtn = document.getElementById("note-modal-cancel-btn");
    const noteSaveBtn = document.getElementById("note-modal-save-btn");
    const noteTextInput = document.getElementById("note-modal-text");

    const hideNoteModal = () => {
        if (noteModal) noteModal.style.display = "none";
        if (noteTextInput) noteTextInput.value = "";
    };

    if (closeNoteBtn) closeNoteBtn.addEventListener("click", hideNoteModal);
    if (noteCancelBtn) noteCancelBtn.addEventListener("click", hideNoteModal);
    if (noteSaveBtn) {
        noteSaveBtn.addEventListener("click", () => {
            const val = noteTextInput.value.trim();
            if (!state.adjustments[window.activeNoteKey]) {
                state.adjustments[window.activeNoteKey] = { amount: 0, note: "" };
            }
            state.adjustments[window.activeNoteKey].note = val;
            if (val === "") {
                state.adjustments[window.activeNoteKey].amount = 0;
            }
            hideNoteModal();
            recalculateAndRender();
        });
    }
}

function setupDragAndDrop(zone, input) {
    ['dragenter', 'dragover'].forEach(eventName => {
        zone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            zone.classList.add('bg-primary-light');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        zone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            zone.classList.remove('bg-primary-light');
        }, false);
    });

    zone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            input.files = files;
            // dispatch change event manually
            const event = new Event('change');
            input.dispatchEvent(event);
        }
    }, false);

    zone.addEventListener('click', () => {
        input.click();
    });
}

// 10. Load Demo Data
function loadDemoData() {
    showLoader("กำลังประมวลผลข้อมูลสาธิต...");

    // Setup Config panel states
    state.employeeName = "สมเกียรติ ยอดขยัน";
    document.getElementById("employee-name-input").value = "สมเกียรติ ยอดขยัน";
    document.getElementById("badge-emp-name").innerText = "สมเกียรติ ยอดขยัน";

    state.month = "2026-05";
    document.getElementById("month-picker").value = "2026-05";
    
    state.baseSalary = 23000;
    document.getElementById("base-salary-select").value = "23000";
    document.getElementById("custom-salary-group").style.display = "none";
    
    state.isProbation = false;
    document.getElementById("probation-switch").checked = false;
    
    state.isMidMonthStart = false;
    document.getElementById("midmonth-switch").checked = false;
    document.getElementById("midmonth-days-group").style.display = "none";
    
    window.updateShiftUIAndState("night_to_day");
    
    state.nightShiftOffDate = "2026-05-20";
    state.nightShiftTransitionDate = "2026-05-21";
    document.getElementById("night-shift-off-date").value = "2026-05-20";
    document.getElementById("night-shift-transition-date").value = "2026-05-21";
    
    state.nightShiftAllowanceRate = 10.25;
    document.getElementById("config-nightshift-allowance").value = 10.25;
    
    document.getElementById("employee-badge").style.display = "flex";
    document.getElementById("stat-shift-change-container").style.display = "block";

    // Generate specific logs for May 2026
    const daysInMay = 31;
    state.attendanceLogs = [];
    
    for (let day = 1; day <= daysInMay; day++) {
        const dateStr = `2026-05-${String(day).padStart(2, '0')}`;
        
        let shift = 'night';
        let clockIn = '20:00';
        let clockOut = '08:00';
        let status = 'full day';
        let leaveType = '';
        let isLate = false;

        // Transitions logic
        if (day >= 21) {
            // transitioned to Day Shift
            shift = 'day';
            if (day >= 25) {
                // start time adjust
                clockIn = '09:00';
                clockOut = '21:00';
            } else {
                clockIn = '08:00';
                clockOut = '20:00';
            }
        }

        // Special days
        if (day === 4) {
            // regular Off Day taken as Leave
            status = 'on Leave';
            leaveType = 'off';
            clockIn = '';
            clockOut = '';
        } else if (day === 10) {
            // Late check-in on night shift
            clockIn = '20:15'; 
            isLate = true;
        } else if (day === 15) {
            // absent day
            status = 'absent';
            clockIn = '';
            clockOut = '';
        } else if (day === 20) {
            // Shift change off day
            status = 'on Leave';
            leaveType = 'shift_change';
            clockIn = '';
            clockOut = '';
        } else if (day === 26) {
            // Late check-in on day shift (new hours, starts 09:00)
            clockIn = '09:05';
            isLate = true;
        } else if (day === 27) {
            // Compulsory Leave day
            status = 'on Leave';
            leaveType = 'compulsory';
            clockIn = '';
            clockOut = '';
        }

        const dateObj = new Date(2026, 4, day); // May 2026
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = dayNames[dateObj.getDay()];
        const dateDisplay = `${dayName}, ${day} May 2026`;

        state.attendanceLogs.push({
            date: dateStr,
            dateDisplay: dateDisplay,
            shift,
            clockIn,
            clockOut,
            status,
            leaveType,
            isLate,
            isImported: true
        });
    }

    // Set Mock Payslip data (Simulate an incorrect payslip with mismatches)
    state.payslipData = {
        baseSalary: 23000,
        diligent: 1550,       // ERROR: gave diligent allowance although late and absent!
        nightShift: 1800,     // ERROR: paid 18 shifts, but should only get 16 shifts (17 worked - 1 late)
        probationDeduct: 0,
        unpaidDeduct: 0,      // ERROR: didn't deduct salary for the absent day!
        attendanceDeduct: 0,
        extraWorkPay: 0,
        netSalary: 26350      // Total: 23000 + 1550 + 1800
    };

    // Update Forms text
    document.getElementById("slip-base-salary").value = 23000;
    document.getElementById("slip-diligent").value = 1550;
    document.getElementById("slip-nightshift").value = 1800;
    document.getElementById("slip-probation-deduct").value = 0;
    document.getElementById("slip-unpaid-deduct").value = 0;
    
    const slipAttendanceDeductInput = document.getElementById("slip-attendance-deduct");
    if (slipAttendanceDeductInput) {
        slipAttendanceDeductInput.value = 0;
    }
    
    document.getElementById("slip-extra-work-pay").value = 0;
    document.getElementById("slip-net-salary-input").value = 26350;

    // Display image mockup (fake payslip drawing or notice)
    displayDemoPayslipImage();

    // Recalculate
    setTimeout(() => {
        hideLoader();
        recalculateAndRender();
        
        // Show success alert
        const activeNav = document.querySelector(".nav-item[data-tab='dashboard']");
        activeNav.click();
    }, 600);
}

function displayDemoPayslipImage() {
    const container = document.getElementById("payslip-preview-container");
    container.innerHTML = "";
    
    const payslipDiv = document.createElement("div");
    payslipDiv.className = "demo-payslip-canvas p-4 border rounded text-left bg-white text-dark font-sans shadow-lg";
    payslipDiv.style.width = "100%";
    payslipDiv.style.maxWidth = "650px";
    payslipDiv.style.fontFamily = "Prompt, sans-serif";
    payslipDiv.style.fontSize = "0.85rem";
    payslipDiv.style.color = "#333";
    payslipDiv.style.borderTop = "8px solid #6366f1";
    
    payslipDiv.innerHTML = `
        <div class="text-center font-bold border-bottom pb-2 mb-3">
            <h4 style="margin:0; font-size:1.15rem; color:#6366f1;">บริษัท ตัวอย่าง จำกัด (มหาชน)</h4>
            <span style="font-size:0.75rem; color:#666;">สลิปใบเสร็จรับเงินเดือนประจำเดือน พฤษภาคม 2569</span>
        </div>
        <div class="row mb-3" style="display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap;">
            <div><strong>รหัสพนักงาน:</strong> EMP2026-99</div>
            <div><strong>ชื่อ:</strong> สมเกียรติ ยอดขยัน</div>
        </div>
        
        <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
            <!-- Left Side: Earnings -->
            <div style="flex: 1; min-width: 280px; display: flex; flex-direction: column;">
                <table style="width:100%; border-collapse:collapse; flex-grow: 1;" border="1" cellpadding="6" bordercolor="#eee">
                    <thead>
                        <tr bgcolor="#f9f9f9">
                            <th align="left">รายได้ (Earnings)</th>
                            <th align="right">จำนวนเงิน (บาท)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>เงินเดือนพื้นฐาน (Salary)</td>
                            <td align="right">23,000.00</td>
                        </tr>
                        <tr>
                            <td>เบี้ยขยันคงที่ (Diligent Allowance)</td>
                            <td align="right">1,550.00</td>
                        </tr>
                        <tr>
                            <td>เบี้ยเลี้ยงทำงานกะดึก (Night Shift Allowance)</td>
                            <td align="right">1,800.00</td>
                        </tr>
                        <tr bgcolor="#f9f9f9" style="font-weight: bold; border-top: 2px solid #ddd;">
                            <td><strong>รวมรายได้พึงประเมิน</strong></td>
                            <td align="right"><strong>26,350.00</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Right Side: Deductions -->
            <div style="flex: 1; min-width: 280px; display: flex; flex-direction: column;">
                <table style="width:100%; border-collapse:collapse; flex-grow: 1;" border="1" cellpadding="6" bordercolor="#eee">
                    <thead>
                        <tr bgcolor="#f9f9f9">
                            <th align="left">รายการหัก (Deductions)</th>
                            <th align="right">จำนวนเงิน (บาท)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>หัก Unpaid leave</td>
                            <td align="right">0.00</td>
                        </tr>
                        <tr>
                            <td>New staff deposit (15%)</td>
                            <td align="right">0.00</td>
                        </tr>
                        <tr>
                            <td>Attendance Deduction (หักเข้างานสาย)</td>
                            <td align="right">0.00</td>
                        </tr>
                        <tr bgcolor="#f9f9f9" style="font-weight: bold; border-top: 2px solid #ddd;">
                            <td><strong>รวมรายการหัก</strong></td>
                            <td align="right"><strong>0.00</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Bottom Section -->
        <div class="border-top pt-3" style="display: flex; justify-content: space-between; align-items: flex-start; font-size:0.85rem;">
            <!-- Bottom Left: Transfer to (Total) -->
            <div style="display: flex; flex-direction: column; gap: 4px; border: 1px solid #10b981; border-radius: 6px; padding: 8px 12px; background-color: #f0fdf4; min-width: 200px;">
                <div style="font-weight: bold; color: #15803d; border-bottom: 1px solid #bbf7d0; padding-bottom: 2px; margin-bottom: 2px;">
                    โอนเข้าบัญชี (Transfer to)
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-weight: bold; color: #166534; font-size: 0.95rem;">
                    <span>Total:</span>
                    <span>฿26,350.00</span>
                </div>
            </div>
            
            <div style="text-align: right; font-size: 0.75rem; color: #666; padding-top: 10px;">
                <strong>แผนกบัญชีและการเงิน</strong><br>
                <span style="font-size: 0.65rem; color: #999;">อนุมัติจ่ายทางอิเล็กทรอนิกส์</span>
            </div>
        </div>
    `;
    container.appendChild(payslipDiv);
    document.getElementById("ocr-status-badge").innerText = "จำลองข้อมูลสำเร็จ";
    document.getElementById("ocr-status-badge").className = "badge bg-success-light text-success";
}

// 11. Timesheet Upload parser (.csv, .xlsx, .xls, .txt, .json)
function handleTimesheetUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    state.pendingTimesheetFile = file;
    document.getElementById("timesheet-file-name").innerText = file.name;
    document.getElementById("clear-timesheet-btn").classList.remove("d-none");

    // Parse immediately!
    executeTimesheetParse(file);
}

function executeTimesheetParse(file) {
    showLoader("กำลังประมวลผลไฟล์บันทึกเวลางาน...");

    const reader = new FileReader();
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'xlsx' || ext === 'xls') {
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
            parseExcelOrCsvGrid(jsonData);
        };
        reader.readAsArrayBuffer(file);
    } else if (ext === 'csv' || ext === 'txt') {
        reader.onload = function(e) {
            const text = e.target.result;
            const lines = text.split('\n').map(line => line.split(/[,;\t]/).map(cell => cell.trim()));
            parseExcelOrCsvGrid(lines);
        };
        reader.readAsText(file);
    } else if (ext === 'json') {
        reader.onload = function(e) {
            try {
                const logs = JSON.parse(e.target.result);
                if (Array.isArray(logs)) {
                    logs.forEach(log => log.isImported = true);
                    state.attendanceLogs = logs;
                    applyShiftTypeToLogs();
                    recalculateAndRender();
                    alert("อัปโหลดไฟล์เวลางานรูปแบบ JSON สำเร็จ!");
                } else {
                    alert("โครงสร้างไฟล์ JSON เวลางานไม่ถูกต้อง");
                }
            } catch(err) {
                alert("ไฟล์ JSON มีข้อผิดพลาดในไวยากรณ์: " + err.message);
            }
            hideLoader();
        };
        reader.readAsText(file);
    }
}

// Parse any date string format safely into YYYY-MM-DD
function parseDateStringToYMD(rawDate, yearMonthDefault = '2026-05') {
    if (!rawDate) return '';
    rawDate = String(rawDate).trim();

    // 1. Try standard YYYY-MM-DD
    const ymdMatch = rawDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (ymdMatch) {
        return `${ymdMatch[1]}-${ymdMatch[2].padStart(2, '0')}-${ymdMatch[3].padStart(2, '0')}`;
    }

    // 2. Try native JS Date parsing first (for standards without slashes to avoid locale mixing)
    try {
        if (rawDate.length > 8 && !rawDate.includes('/') && !rawDate.includes('-') && !rawDate.includes('.')) {
            const parsedDate = new Date(rawDate);
            if (!isNaN(parsedDate.getTime())) {
                const y = parsedDate.getFullYear();
                const m = String(parsedDate.getMonth() + 1).padStart(2, '0');
                const d = String(parsedDate.getDate()).padStart(2, '0');
                return `${y}-${m}-${d}`;
            }
        }
    } catch(e) {}

    // 3. Robust tokenization to parse English/Thai locale formatted dates
    let cleanDate = rawDate.toLowerCase();
    
    // Normalize Thai month abbreviations with dot to no-dot for easy splitting
    const thaiMonthsList = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    thaiMonthsList.forEach(m => {
        const noDot = m.replace(/\./g, '');
        cleanDate = cleanDate.replace(m, noDot);
    });

    // Split into tokens by common separators
    const tokens = cleanDate.split(/[\s,/\-\.]+/).filter(t => t.trim() !== '');

    let day = null;
    let month = null;
    let year = null;

    const monthsEng = {
        jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
        jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
        january: '01', february: '02', march: '03', april: '04', june: '06',
        july: '07', august: '08', september: '09', october: '10', november: '11', december: '12',
        'มค': '01', 'กพ': '02', 'มีค': '03', 'เมย': '04', 'พค': '05', 'มิย': '06',
        'กค': '07', 'สค': '08', 'กย': '09', 'ตค': '10', 'พย': '11', 'ธค': '12',
        'มกราคม': '01', 'กุมภาพันธ์': '02', 'มีนาคม': '03', 'เมษายน': '04', 'พฤษภาคม': '05', 'มิถุนายน': '06',
        'กรกฎาคม': '07', 'สิงหาคม': '08', 'กันยายน': '09', 'ตุลาคม': '10', 'พฤศจิกายน': '11', 'ธันวาคม': '12'
    };

    // Find month name
    tokens.forEach(token => {
        if (monthsEng[token]) {
            month = monthsEng[token];
        }
    });

    // Find year (4 digits)
    tokens.forEach(token => {
        if (/^\d{4}$/.test(token)) {
            let y = parseInt(token);
            if (y > 2400) y -= 543; // Buddhist Era to Christian Era
            year = y;
        }
    });

    // Find numeric day and month
    const numbers = tokens.filter(token => /^\d{1,2}$/.test(token)).map(Number);

    if (numbers.length > 0) {
        if (year && month) {
            // If year and month are known, the first number is the day
            day = numbers[0];
        } else if (numbers.length >= 2) {
            // E.g. ["31", "05", "2026"] or ["31", "05", "26"]
            if (!year) {
                const lastToken = tokens[tokens.length - 1];
                if (/^\d{2}$/.test(lastToken)) {
                    let y = parseInt(lastToken);
                    year = y < 50 ? 2000 + y : 1900 + y;
                }
            }
            day = numbers[0];
            month = String(numbers[1]).padStart(2, '0');
        } else if (numbers.length === 1) {
            day = numbers[0];
        }
    }

    if (!year) {
        year = yearMonthDefault.split('-')[0];
    }
    if (!month) {
        month = yearMonthDefault.split('-')[1];
    }
    if (!day) {
        return rawDate; // Fallback
    }

    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Parse grid arrays from CSV/Excel
function parseExcelOrCsvGrid(grid) {
    if (!grid || grid.length <= 1) {
        alert("ไม่พบข้อมูลบันทึกเวลาทำงานในไฟล์");
        hideLoader();
        return;
    }

    // Try to match headers to find columns
    const headers = grid[0].map(h => String(h).trim().toLowerCase());
    
    // Default column mappings in Thai or English
    let dateIdx = headers.findIndex(h => h.includes('date') || h.includes('วัน') || h.includes('วันที่'));
    let shiftIdx = headers.findIndex(h => h.includes('shift') || h.includes('กะ'));
    let timeInIdx = headers.findIndex(h => h.includes('in') || h.includes('เข้า'));
    let timeOutIdx = headers.findIndex(h => h.includes('out') || h.includes('ออก'));
    let statusIdx = headers.findIndex(h => h.includes('status') || h.includes('สถานะ'));
    let leaveTypeIdx = headers.findIndex(h => h.includes('leave') || h.includes('หยุด') || h.includes('ประเภท'));

    // Fallbacks if headers not detected
    if (grid[0].length >= 10) {
        dateIdx = 0;
        shiftIdx = 1;
        timeInIdx = 2;
        timeOutIdx = 3;
        statusIdx = 9;
        leaveTypeIdx = -1;
    } else {
        if (dateIdx === -1) dateIdx = 0;
        if (shiftIdx === -1) shiftIdx = 1;
        if (timeInIdx === -1) timeInIdx = 2;
        if (timeOutIdx === -1) timeOutIdx = 3;
        if (statusIdx === -1) statusIdx = 4;
        if (leaveTypeIdx === -1) leaveTypeIdx = 5;
    }

    // Detect if the first row is actually a header row or a data row
    let startRow = 1;
    if (grid[0] && grid[0].length > 0) {
        const testRowStr = grid[0].map(val => String(val || '').toLowerCase()).join(" ");
        const hasHeaderKeyword = testRowStr.includes('date') || 
                                 testRowStr.includes('วัน') || 
                                 testRowStr.includes('วันที่') || 
                                 testRowStr.includes('กะ') || 
                                 testRowStr.includes('shift') || 
                                 testRowStr.includes('เวลาเข้า') || 
                                 testRowStr.includes('clock in');
        if (!hasHeaderKeyword) {
            startRow = 0; // No headers in the first row, start loop from 0!
        }
    }

    const newLogs = [];
    for (let r = startRow; r < grid.length; r++) {
        const row = grid[r];
        if (!row || row.length === 0 || !row[dateIdx]) continue;

        let rawDate = String(row[dateIdx]).trim();
        rawDate = parseDateStringToYMD(rawDate, state.month);

        let shift = 'day';
        const rawShift = String(row[shiftIdx] || '').trim().toLowerCase();
        if (rawShift.includes('night') || rawShift.includes('ดึก') || rawShift.includes('ค่ำ')) {
            shift = 'night';
        }

        let rawClockIn = String(row[timeInIdx] || '').trim();
        let rawClockOut = String(row[timeOutIdx] || '').trim();

        let clockIn = '';
        let clockOut = '';
        let isLate = false;

        const timeRegex = /(\d{1,2}):(\d{2})(?::(\d{2}))?/;
        const matchIn = rawClockIn.match(timeRegex);
        if (matchIn) {
            const h = matchIn[1].padStart(2, '0');
            const m = matchIn[2];
            clockIn = `${h}:${m}`;
        }

        const matchOut = rawClockOut.match(timeRegex);
        if (matchOut) {
            const h = matchOut[1].padStart(2, '0');
            const m = matchOut[2];
            clockOut = `${h}:${m}`;
        }

        if (rawClockIn.toLowerCase().includes('late') || rawClockIn.includes('สาย')) {
            isLate = true;
        }

        let status = 'full day';
        const rawStatus = String(row[statusIdx] || '').trim().toLowerCase();
        if (rawStatus.includes('leave') || rawStatus.includes('หยุด') || rawStatus.includes('off') || rawStatus.includes('onleave') || rawStatus.includes('offday')) {
            status = 'on Leave';
        } else if (rawStatus.includes('absent') || rawStatus.includes('ขาด')) {
            status = 'absent';
        } else if (rawStatus.includes('partial') || rawStatus.includes('ครึ่ง')) {
            status = 'partialday';
        } else if (rawStatus.includes('incomplete')) {
            status = 'incomplete';
        }

        let leaveType = '';
        if (status === 'on Leave') {
            leaveType = 'off';
        }
        if (leaveTypeIdx !== -1) {
            const rawLeave = String(row[leaveTypeIdx] || '').trim().toLowerCase();
            if (rawLeave.includes('off') || rawLeave.includes('ประจำ')) leaveType = 'off';
            else if (rawLeave.includes('compulsory') || rawLeave.includes('บังคับ')) leaveType = 'compulsory';
            else if (rawLeave.includes('shift') || rawLeave.includes('เปลี่ยนกะ')) leaveType = 'shift_change';
            else if (rawLeave.includes('unpaid') || rawLeave.includes('กิจ')) leaveType = 'unpaid';
        }

        // Find timezone in row cells
        let timezone = '';
        for (let c = 0; c < row.length; c++) {
            const val = String(row[c] || '');
            if (val.includes('GMT') || val.includes('+07') || val.includes('+08')) {
                timezone = val.trim();
                break;
            }
        }

        let rawDateOriginal = row[dateIdx];
        let dateDisplay = '';
        if (rawDateOriginal instanceof Date) {
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const monthNamesEng = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const dayName = dayNames[rawDateOriginal.getDay()];
            const monthName = monthNamesEng[rawDateOriginal.getMonth()];
            dateDisplay = `${dayName}, ${rawDateOriginal.getDate()} ${monthName} ${rawDateOriginal.getFullYear()}`;
        } else {
            dateDisplay = String(rawDateOriginal || '').trim();
        }

        newLogs.push({
            date: rawDate,
            dateDisplay: dateDisplay,
            shift,
            clockIn,
            clockOut,
            status,
            leaveType,
            timezone,
            isLate: isLate,
            isImported: true
        });
    }

    if (newLogs.length > 0) {
        // Sort chronologically (ascending date order: Day 1 to Day 31)
        newLogs.sort((a, b) => a.date.localeCompare(b.date));
        state.attendanceLogs = newLogs;
        state.hasChosenMonth = true;
        
        // Auto extract month from first log (this is the attendance month)
        const dateSample = newLogs[0].date;
        const matched = dateSample.match(/^(\d{4}-\d{2})/);
        if (matched) {
            const attendanceMonth = matched[1];
            state.month = getPayslipMonth(attendanceMonth); // Payslip month is 1 month after attendance logs month
            document.getElementById("month-picker").value = state.month;
        }

        applyShiftTypeToLogs();
        recalculateAndRender();
        
        // Auto switch tab to attendance grid
        const attendanceNav = document.querySelector(".nav-item[data-tab='attendance']");
        if (attendanceNav) {
            attendanceNav.click();
        }
        
        alert(`นำเข้าประวัติบันทึกเวลางานสำเร็จ จำนวน ${newLogs.length} วัน!`);
    } else {
        alert("ไม่พบรูปแบบที่สามารถนำเข้าได้ในไฟล์เวลางาน");
    }
    hideLoader();
}

// Download dynamic CSV Template or active audit report
function downloadCSVTemplate() {
    const lang = state.language || 'en';
    
    if (!state.hasChosenMonth || !state.attendanceLogs || state.attendanceLogs.length === 0) {
        // Download blank template
        const csvContent = 
            "วันที่ (Date),กะ (Shift),เวลาเข้า (Clock In),เวลาออก (Clock Out),สถานะการลงงาน (Status),ประเภทวันหยุด (Leave Type)\n" +
            "2026-05-01,night,20:00,08:00,full day,\n" +
            "2026-05-02,night,19:55,08:00,full day,\n" +
            "2026-05-03,night,20:00,08:00,full day,\n" +
            "2026-05-04,night,,,on Leave,off\n" +
            "2026-05-05,night,20:00,08:00,full day,\n" +
            "2026-05-10,night,20:15,08:00,full day,*(เข้างานสาย)\n" +
            "2026-05-15,night,,,absent,\n" +
            "2026-05-20,night,,,on Leave,shift_change\n" +
            "2026-05-21,day,08:00,20:00,full day,*(เริ่มเข้ากะเช้าวันแรก)\n" +
            "2026-05-25,day,09:00,21:00,full day,*(เริ่มเวลาทำงานใหม่)\n" +
            "2026-05-26,day,09:05,21:00,full day,*(เข้างานสายใหม่)\n" +
            "2026-05-27,day,,,on Leave,compulsory";
            
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `attendance_template_${state.month}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
    }

    // Export current audit table records to CSV!
    const headers = [
        lang === 'th' ? "ลำดับ" : "No.",
        lang === 'th' ? "วันที่" : "Date",
        lang === 'th' ? "กะการทำงาน" : "Shift",
        lang === 'th' ? "เวลาเข้า" : "Clock In",
        lang === 'th' ? "เวลาออก" : "Clock Out",
        lang === 'th' ? "สถานะ" : "Status",
        lang === 'th' ? "ประเภทวันหยุด" : "Leave Type",
        lang === 'th' ? "การเข้าสาย" : "Lateness",
        lang === 'th' ? "รายการเพิ่ม/หักเงิน" : "Additions/Deductions"
    ];

    let rows = [headers.join(",")];
    let activeLateCount = 0;

    state.attendanceLogs.forEach((log, index) => {
        const [year, month, day] = log.date.split("-");
        const dateThai = log.dateDisplay || `${day}/${month}/${parseInt(year) + 543}`;
        const shiftStr = log.shift === 'night' ? (lang === 'th' ? "ดึก (Night)" : "Night") : (lang === 'th' ? "เช้า (Day)" : "Day");
        const clockInStr = log.clockIn || "";
        const clockOutStr = log.clockOut || "";
        const statusStr = log.status || "";
        
        let leaveTypeStr = "";
        if (log.status === 'on Leave') {
            if (log.leaveType === 'off') leaveTypeStr = lang === 'th' ? "วันหยุดประจำ (Off day)" : "Off day";
            else if (log.leaveType === 'compulsory') leaveTypeStr = lang === 'th' ? "วันหยุดบังคับ (Compulsory)" : "Compulsory";
            else if (log.leaveType === 'shift_change') leaveTypeStr = lang === 'th' ? "วันหยุดเปลี่ยนกะ (Shift Change)" : "Shift Change";
            else if (log.leaveType === 'unpaid') leaveTypeStr = lang === 'th' ? "ลากิจไม่รับเงิน (Unpaid Leave)" : "Unpaid Leave";
        }

        const latenessStr = log.isLate ? (lang === 'th' ? "สาย" : "Late") : (lang === 'th' ? "ทัน" : "On Time");

        // Calculate daily adjustments for CSV
        let additions = [];
        let deductions = [];
        let addTotal = 0;
        let deductTotal = 0;

        if (log.shift === 'night' && (log.status === 'full day' || log.status === 'partialday')) {
            const isAfterCutoff = state.hasTimeChange && state.timeChangeDate && (log.date >= state.timeChangeDate);
            const currentRules = isAfterCutoff ? state.rulesAfter : state.rulesBefore;
            const nightEndStr = currentRules.nightEnd || '08:00';
            const parts = nightEndStr.split(':').map(Number);
            const endHour = (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) ? parts[0] + (parts[1]/60) : 8;
            const dailyNightAllowance = endHour * 10.25;
            addTotal += dailyNightAllowance;
            additions.push(`เบี้ยเลี้ยงกะดึก +฿${dailyNightAllowance.toFixed(2)}`);
        }

        let daysInMonth = state.attendanceLogs.length;
        if (state.attendanceLogs && state.attendanceLogs.length > 0 && state.attendanceLogs[0].date) {
            const parts = state.attendanceLogs[0].date.split("-").map(Number);
            if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                daysInMonth = new Date(parts[0], parts[1], 0).getDate();
            }
        }
        const dailyRate = (state.baseSalary || 20000) / daysInMonth;
        const usdRate = state.exchangeRate || 35.00;

        if (log.status === 'incomplete') {
            if (log.isWaived) {
                deductions.push('สแกนไม่ครบ (ยกเว้น)');
            } else if (log.reportedScanOut) {
                deductions.push('สแกนไม่ครบ (แจ้งสาเหตุแล้ว)');
            } else {
                const cost = 5 * usdRate;
                deductTotal += cost;
                deductions.push(`สแกนไม่ครบ -฿${cost.toFixed(2)}`);
            }
        } else if (log.status === 'partialday') {
            const workedHrs = getWorkedHours(log.clockIn, log.clockOut);
            if (workedHrs >= 8.0) {
                if (log.isWaived) {
                    deductions.push('ทำงานบางส่วน (ยกเว้น)');
                } else {
                    const cost = 0.5 * dailyRate;
                    deductTotal += cost;
                    deductions.push(`ทำงานบางส่วน -฿${cost.toFixed(2)}`);
                }
            }
        } else if (log.status === 'absent') {
            if (log.isWaived) {
                deductions.push('ขาดงาน (ยกเว้น)');
            } else {
                const cost = dailyRate;
                deductTotal += cost;
                deductions.push(`ขาดงาน -฿${cost.toFixed(2)}`);
            }
        } else if (log.status === 'on Leave' && log.leaveType === 'unpaid') {
            if (log.isWaived) {
                deductions.push('ลากิจไม่รับเงิน (ยกเว้น)');
            } else {
                const cost = dailyRate;
                deductTotal += cost;
                deductions.push(`ลากิจไม่รับเงิน -฿${cost.toFixed(2)}`);
            }
        }
        
        if (log.isLate) {
            if (log.isWaived) {
                deductions.push('สาย (ยกเว้น)');
            } else {
                activeLateCount++;
                if (activeLateCount === 1) {
                    deductions.push('สาย (ยกเว้นครั้งแรก)');
                } else {
                    const cost = 5 * usdRate;
                    deductTotal += cost;
                    deductions.push(`สาย -฿${cost.toFixed(2)}`);
                }
            }
        }

        let summaryParts = [];
        if (addTotal > 0) {
            summaryParts.push(`+฿${addTotal.toFixed(2)} (${additions.join(" / ")})`);
        }
        if (deductTotal > 0) {
            summaryParts.push(`-฿${deductTotal.toFixed(2)} (${deductions.join(" / ")})`);
        } else if (deductions.length > 0) {
            summaryParts.push(`${deductions.join(" / ")}`);
        }

        const adjustmentStr = summaryParts.join(" | ");

        // Escape fields to avoid CSV breakages
        const csvRow = [
            index + 1,
            `"${dateThai}"`,
            `"${shiftStr}"`,
            `"${clockInStr}"`,
            `"${clockOutStr}"`,
            `"${statusStr}"`,
            `"${leaveTypeStr}"`,
            `"${latenessStr}"`,
            `"${adjustmentStr.replace(/"/g, '""')}"`
        ];

        rows.push(csvRow.join(","));
    });

    const csvContent = rows.join("\n");
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    const safeName = (state.employeeName || "employee").toLowerCase().replace(/\s+/g, "_");
    link.setAttribute("download", `attendance_audit_${safeName}_${state.month}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 12. Payslip Image/PDF Upload & OCR processing
function handlePayslipUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    state.pendingPayslipFile = file;
    document.getElementById("payslip-file-name").innerText = file.name;
    document.getElementById("clear-payslip-file-btn").classList.remove("d-none");

    // Parse immediately!
    executePayslipParse(file);
}

function executePayslipParse(file) {
    showLoader("กำลังประมวลผลไฟล์สลิปเงินเดือน...");

    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'pdf') {
        processPdfPayslip(file);
    } else if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
        processExcelOrCsvPayslip(file);
    } else if (ext === 'docx') {
        processDocxPayslip(file);
    } else {
        processImagePayslip(file);
    }
}

// Modal and Clear Actions
function checkPendingUploads() {
    if (state.pendingTimesheetFile && state.pendingPayslipFile) {
        document.getElementById("modal-timesheet-name").innerText = state.pendingTimesheetFile.name;
        document.getElementById("modal-payslip-name").innerText = state.pendingPayslipFile.name;
        document.getElementById("upload-status-modal").style.display = "flex";
    }
}

function cancelPendingUploads() {
    state.pendingTimesheetFile = null;
    state.pendingPayslipFile = null;

    document.getElementById("timesheet-file-input").value = "";
    document.getElementById("payslip-file-input").value = "";

    document.getElementById("timesheet-file-name").innerText = "ยังไม่ได้เลือกไฟล์";
    document.getElementById("payslip-file-name").innerText = "ยังไม่ได้เลือกไฟล์";

    document.getElementById("clear-timesheet-btn").classList.add("d-none");
    document.getElementById("clear-payslip-file-btn").classList.add("d-none");

    document.getElementById("upload-status-modal").style.display = "none";
}

function clearTimesheetFile() {
    state.pendingTimesheetFile = null;
    document.getElementById("timesheet-file-input").value = "";
    document.getElementById("timesheet-file-name").innerText = "ยังไม่ได้เลือกไฟล์";
    document.getElementById("clear-timesheet-btn").classList.add("d-none");
    
    // Clear attendance logs and refresh grid
    state.attendanceLogs = [];
    recalculateAndRender();
}

function clearPayslipFile() {
    state.pendingPayslipFile = null;
    document.getElementById("payslip-file-input").value = "";
    document.getElementById("payslip-file-name").innerText = "ยังไม่ได้เลือกไฟล์";
    document.getElementById("clear-payslip-file-btn").classList.add("d-none");
    resetPayslipPreview();
}

function resetPayslipPreview() {
    const placeholder = document.getElementById("payslip-preview-placeholder");
    const imgPreview = document.getElementById("payslip-image-preview");
    const pdfCanvas = document.getElementById("pdf-canvas");
    const filePreview = document.getElementById("payslip-file-preview");
    
    if (placeholder) placeholder.style.display = "block";
    if (imgPreview) {
        imgPreview.src = "";
        imgPreview.style.display = "none";
    }
    if (pdfCanvas) {
        pdfCanvas.style.display = "none";
        const ctx = pdfCanvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
    }
    if (filePreview) {
        filePreview.style.display = "none";
        filePreview.innerHTML = "";
    }
}

function clearPayslipData() {
    // Reset state payslipData values to 0
    state.payslipData = {
        baseSalary: 0,
        diligent: 0,
        nightShift: 0,
        probationDeduct: 0,
        unpaidDeduct: 0,
        attendanceDeduct: 0,
        extraWorkPay: 0,
        netSalary: 0
    };
    
    // Clear the form fields
    const baseSalInput = document.getElementById("slip-base-salary");
    if (baseSalInput) baseSalInput.value = 0;
    const diligentInput = document.getElementById("slip-diligent");
    if (diligentInput) diligentInput.value = 0;
    const nightShiftInput = document.getElementById("slip-nightshift");
    if (nightShiftInput) nightShiftInput.value = 0;
    const probationInput = document.getElementById("slip-probation-deduct");
    if (probationInput) probationInput.value = 0;
    const unpaidInput = document.getElementById("slip-unpaid-deduct");
    if (unpaidInput) unpaidInput.value = 0;
    const attendanceInput = document.getElementById("slip-attendance-deduct");
    if (attendanceInput) attendanceInput.value = 0;
    const extraInput = document.getElementById("slip-extra-work-pay");
    if (extraInput) extraInput.value = 0;
    const netInput = document.getElementById("slip-net-salary-input");
    if (netInput) netInput.value = 0;
    
    // Reset status badge
    const badge = document.getElementById("ocr-status-badge");
    if (badge) {
        badge.innerText = "ยังไม่มีการประมวลผล";
        badge.className = "badge bg-info-light text-info";
    }
    
    // Hide toggle buttons
    const toggleGroup = document.getElementById("payslip-view-toggle-group");
    if (toggleGroup) {
        toggleGroup.style.display = "none";
    }
    
    // Reset toggle active classes
    const btnShowFile = document.getElementById("btn-show-payslip-file");
    const btnShowMock = document.getElementById("btn-show-payslip-mock");
    if (btnShowFile) btnShowFile.classList.add("active");
    if (btnShowMock) btnShowMock.classList.remove("active");
    
    // Clear preview containers
    const container = document.getElementById("payslip-preview-container");
    if (container) {
        container.classList.remove("d-none");
        container.innerHTML = `
            <i class="fa-regular fa-image fa-3x text-muted mb-2"></i>
            <p class="text-muted text-xs">แสดงรูปสลิปเงินเดือนที่นี่เมื่ออัปโหลด</p>
            <img id="payslip-image-preview" src="" alt="สลิปเงินเดือน" style="display:none; max-width: 100%; max-height: 350px; object-fit: contain;">
            <canvas id="pdf-canvas" style="display:none; max-width: 100%; max-height: 350px;"></canvas>
        `;
    }
    
    const mockContainer = document.getElementById("payslip-mock-container");
    if (mockContainer) {
        mockContainer.classList.add("d-none");
        mockContainer.innerHTML = "";
    }
    
    // Hide clear button for payslip file input
    const clearFileBtn = document.getElementById("clear-payslip-file-btn");
    if (clearFileBtn) clearFileBtn.classList.add("d-none");
    
    // Reset file input name label
    const fileNameLabel = document.getElementById("payslip-file-name");
    if (fileNameLabel) fileNameLabel.innerText = "ยังไม่ได้เลือกไฟล์";
    
    // Reset file input value
    const fileInput = document.getElementById("payslip-file-input");
    if (fileInput) fileInput.value = "";
    
    recalculateAndRender();
}

function executeVerification() {
    // Hide Modal
    document.getElementById("upload-status-modal").style.display = "none";

    if (state.pendingTimesheetFile) {
        executeTimesheetParse(state.pendingTimesheetFile);
    }
    if (state.pendingPayslipFile) {
        executePayslipParse(state.pendingPayslipFile);
    }
}

function processExcelOrCsvPayslip(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            let extractedText = "";
            workbook.SheetNames.forEach(sheetName => {
                const worksheet = workbook.Sheets[sheetName];
                const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
                rows.forEach(row => {
                    if (Array.isArray(row)) {
                        extractedText += row.filter(val => val !== null && val !== undefined).join(" ") + "\n";
                    }
                });
            });
            
            if (extractedText.trim().length > 10) {
                parsePayslipText(extractedText);
                document.getElementById("ocr-status-badge").innerText = "ดึงข้อมูลจาก Excel/CSV สำเร็จ";
                document.getElementById("ocr-status-badge").className = "badge bg-success-light text-success";
                
                // Show file preview
                const placeholder = document.getElementById("payslip-preview-placeholder");
                if (placeholder) placeholder.style.display = "none";
                document.getElementById("payslip-image-preview").style.display = "none";
                document.getElementById("pdf-canvas").style.display = "none";
                
                const filePreview = document.getElementById("payslip-file-preview");
                if (filePreview) {
                    filePreview.style.display = "block";
                    filePreview.innerHTML = `
                        <div class="py-4">
                            <i class="fa-solid fa-file-excel fa-4x text-success mb-2"></i>
                            <p class="font-bold text-sm text-success">โหลดไฟล์ Excel/CSV เรียบร้อยแล้ว</p>
                            <small class="text-muted text-xs d-block mt-1">${file.name}</small>
                        </div>
                    `;
                }
                
                hideLoader();
                recalculateAndRender();
            } else {
                throw new Error("ไม่มีข้อมูลตัวอักษรในไฟล์ Excel/CSV");
            }
        } catch (err) {
            alert("เกิดข้อผิดพลาดในการอ่านไฟล์ Excel/CSV: " + err.message);
            hideLoader();
        }
    };
    reader.readAsArrayBuffer(file);
}

function processDocxPayslip(file) {
    if (typeof mammoth === 'undefined') {
        alert("ระบบอ่านไฟล์ Word ไม่พร้อมใช้งาน กรุณาลองใหม่อีกครั้ง");
        hideLoader();
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        mammoth.extractRawText({ arrayBuffer: arrayBuffer })
            .then(function(result) {
                const text = result.value;
                if (text.trim().length > 10) {
                    parsePayslipText(text);
                    document.getElementById("ocr-status-badge").innerText = "ดึงข้อมูลจาก Word (Docx) สำเร็จ";
                    document.getElementById("ocr-status-badge").className = "badge bg-success-light text-success";
                    
                    // Show file preview
                    const placeholder = document.getElementById("payslip-preview-placeholder");
                    if (placeholder) placeholder.style.display = "none";
                    document.getElementById("payslip-image-preview").style.display = "none";
                    document.getElementById("pdf-canvas").style.display = "none";
                    
                    const filePreview = document.getElementById("payslip-file-preview");
                    if (filePreview) {
                        filePreview.style.display = "block";
                        filePreview.innerHTML = `
                            <div class="py-4">
                                <i class="fa-solid fa-file-word fa-4x text-primary mb-2"></i>
                                <p class="font-bold text-sm text-primary">โหลดไฟล์ Word (Docx) เรียบร้อยแล้ว</p>
                                <small class="text-muted text-xs d-block mt-1">${file.name}</small>
                            </div>
                        `;
                    }
                    
                    hideLoader();
                    recalculateAndRender();
                } else {
                    throw new Error("ไม่มีข้อมูลตัวอักษรในไฟล์ Word");
                }
            })
            .catch(function(err) {
                alert("เกิดข้อผิดพลาดในการอ่านไฟล์ Word: " + err.message);
                hideLoader();
            });
    };
    reader.readAsArrayBuffer(file);
}

// PDF text extractor & render page to canvas
function processPdfPayslip(file) {
    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
    }
    const reader = new FileReader();
    reader.onload = function() {
        const typedarray = new Uint8Array(this.result);
        pdfjsLib.getDocument(typedarray).promise.then(pdf => {
            // Get first page
            pdf.getPage(1).then(page => {
                const canvas = document.getElementById("pdf-canvas");
                const ctx = canvas.getContext("2d");
                const viewport = page.getViewport({ scale: 1.5 });
                
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                
                // Show PDF canvas
                canvas.style.display = "block";
                document.getElementById("payslip-image-preview").style.display = "none";
                const filePreview = document.getElementById("payslip-file-preview");
                if (filePreview) filePreview.style.display = "none";
                const placeholder = document.getElementById("payslip-preview-placeholder");
                if (placeholder) placeholder.style.display = "none";

                const renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                };
                
                page.render(renderContext).promise.then(() => {
                    // Try to extract text natively from PDF structure (very fast and accurate)
                    page.getTextContent().then(textContent => {
                        const pdfText = textContent.items.map(item => item.str).join(" ");
                        if (pdfText.trim().length > 10) {
                            parsePayslipText(pdfText);
                            document.getElementById("ocr-status-badge").innerText = "ดึงข้อมูลจาก PDF สำเร็จ";
                            document.getElementById("ocr-status-badge").className = "badge bg-success-light text-success";
                            hideLoader();
                            recalculateAndRender();
                        } else {
                            // Empty text layer: fallback to OCR on canvas image
                            runImageOcr(canvas);
                        }
                    });
                });
            });
        }).catch(err => {
            alert("เกิดข้อผิดพลาดในการอ่านไฟล์ PDF: " + err.message);
            hideLoader();
        });
    };
    reader.readAsArrayBuffer(file);
}

// Image previewer & run OCR
function processImagePayslip(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const imgEl = document.getElementById("payslip-image-preview");
        imgEl.src = e.target.result;
        imgEl.style.display = "block";
        document.getElementById("pdf-canvas").style.display = "none";
        const filePreview = document.getElementById("payslip-file-preview");
        if (filePreview) filePreview.style.display = "none";
        const placeholder = document.getElementById("payslip-preview-placeholder");
        if (placeholder) placeholder.style.display = "none";
        
        runImageOcr(imgEl);
    };
    reader.readAsDataURL(file);
}

let ocrWorker = null;

// Run Tesseract OCR on Image/Canvas element
async function runImageOcr(mediaSource) {
    const lang = state.language || 'en';
    const msgInit = lang === 'th' ? "กำลังเตรียมความพร้อมของระบบสแกนสลิป (ในครั้งแรกอาจใช้เวลา 5-10 วินาที)..." : 
                    (lang === 'zh' ? "正在準備掃描系統 (首次加載可能需要 5-10 秒)..." : 
                    "Preparing the OCR scanning engine (first-time load may take 5-10 seconds)...");
    
    showLoader(msgInit);
    
    try {
        if (!ocrWorker) {
            ocrWorker = await Tesseract.createWorker('tha+eng', 1, {
                logger: m => {
                    if (m.status === 'recognizing') {
                        const scanMsg = lang === 'th' ? `ระบบ OCR กำลังสแกนรูปสลิป... (${Math.round(m.progress * 100)}%)` : 
                                        (lang === 'zh' ? `OCR 正在掃描薪資單... (${Math.round(m.progress * 100)}%)` : 
                                        `OCR is scanning the payslip... (${Math.round(m.progress * 100)}%)`);
                        showLoader(scanMsg);
                    }
                }
            });
        }
        
        const scanStartMsg = lang === 'th' ? "กำลังประมวลผลการสแกนรูปสลิปและสกัดตัวอักษร..." : 
                             (lang === 'zh' ? "正在進行字元掃描與文字提取..." : 
                             "Scanning characters and extracting text from the payslip...");
        showLoader(scanStartMsg);
        
        const { data: { text } } = await ocrWorker.recognize(mediaSource);
        
        parsePayslipText(text);
        
        const successBadge = document.getElementById("ocr-status-badge");
        if (successBadge) {
            successBadge.innerText = lang === 'th' ? "สแกนภาพสำเร็จ" : (lang === 'zh' ? "掃描成功" : "Scan Success");
            successBadge.className = "badge bg-success-light text-success";
        }
        hideLoader();
        recalculateAndRender();
    } catch (err) {
        console.error("Tesseract OCR Error: ", err);
        const errMsg = lang === 'th' ? "ระบบ OCR สแกนรูปภาพขัดข้อง: " + err.message + "\nคุณสามารถกรอกข้อมูลเงินเดือนในสลิปด้วยตนเองได้" : 
                       (lang === 'zh' ? "OCR 掃描發生錯誤: " + err.message + "\n您可以手動輸入薪資單數據。" : 
                       "OCR scan encountered an error: " + err.message + "\nYou can fill in your payslip data manually.");
        alert(errMsg);
        
        const errorBadge = document.getElementById("ocr-status-badge");
        if (errorBadge) {
            errorBadge.innerText = lang === 'th' ? "สแกนล้มเหลว (กรอกด้วยมือ)" : (lang === 'zh' ? "掃描失敗 (手動輸入)" : "Scan Failed (Manual Input)");
            errorBadge.className = "badge bg-danger-light text-danger";
        }
        hideLoader();
    }
}

// Parser for OCR text
function parsePayslipText(text) {
    console.log("OCR Result Text:\n", text);
    
    // Clean text
    const cleanText = text.replace(/,/g, '');
    
    // Parse name and employee code
    const nameMatch = cleanText.match(/(?:name|ชื่อ)\s+([a-zA-Zก-๙\s\-]+)(?=\s+(?:gender|เพศ|payroll|employee|no|position|department|\(|\d))/i);
    if (nameMatch) {
        state.employeeName = nameMatch[1].trim();
        document.getElementById("employee-name-input").value = state.employeeName;
        document.getElementById("badge-emp-name").innerText = state.employeeName;
    }

    const empNoMatch = cleanText.match(/(?:employee no\.|emp no\.|รหัสพนักงาน)\D*([a-zA-Z\d\-]+)/i);
    if (empNoMatch) {
        state.employeeNo = empNoMatch[1].trim();
    } else {
        state.employeeNo = '';
    }
    
    // regex pattern matching numbers near key words
    const baseSalaryMatch = cleanText.match(/(?:salary|เงินเดือน|พื้นฐาน)\D*(\d+(?:\.\d{2})?)/i);
    const diligentMatch = cleanText.match(/(?:diligent|เบี้ยขยัน)\D*(\d+(?:\.\d{2})?)/i);
    const nightShiftMatch = cleanText.match(/(?:night|กะดึก|เบี้ยเลี้ยงกะ|เบี้ยเลี้ยง|midnight)\D*(\d+(?:\.\d{2})?)/i);
    const probationDeductMatch = cleanText.match(/(?:probation|ทดลองงาน|หักทดลอง|deposit|staff deposit)\D*(\d+(?:\.\d{2})?)/i);
    const unpaidDeductMatch = cleanText.match(/(?:unpaid|absent|หักขาดงาน|หักลางาน|หักวัน|unpaid leave)\D*(\d+(?:\.\d{2})?)/i);
    const attendanceDeductMatch = cleanText.match(/(?:attendance deduction|late deduct|หักสาย|หักเข้างานสาย|หักเข้าสาย)\D*(\d+(?:\.\d{2})?)/i);
    const extraWorkMatch = cleanText.match(/(?:extra|บวกเพิ่ม|ไม่เต็มเดือน)\D*(\d+(?:\.\d{2})?)/i);
    const netSalaryMatch = cleanText.match(/(?:net|สุทธิ|รับสุทธิ|ยอดโอน|โอน|transfer\s+to)\D*(\d+(?:\.\d{2})?)/i);

    state.payslipData.baseSalary = baseSalaryMatch ? parseFloat(baseSalaryMatch[1]) : 0;
    document.getElementById("slip-base-salary").value = state.payslipData.baseSalary;

    state.payslipData.diligent = diligentMatch ? parseFloat(diligentMatch[1]) : 0;
    document.getElementById("slip-diligent").value = state.payslipData.diligent;

    state.payslipData.nightShift = nightShiftMatch ? parseFloat(nightShiftMatch[1]) : 0;
    document.getElementById("slip-nightshift").value = state.payslipData.nightShift;

    state.payslipData.probationDeduct = probationDeductMatch ? parseFloat(probationDeductMatch[1]) : 0;
    document.getElementById("slip-probation-deduct").value = state.payslipData.probationDeduct;

    state.payslipData.unpaidDeduct = unpaidDeductMatch ? parseFloat(unpaidDeductMatch[1]) : 0;
    document.getElementById("slip-unpaid-deduct").value = state.payslipData.unpaidDeduct;

    state.payslipData.attendanceDeduct = attendanceDeductMatch ? parseFloat(attendanceDeductMatch[1]) : 0;
    document.getElementById("slip-attendance-deduct").value = state.payslipData.attendanceDeduct;

    state.payslipData.extraWorkPay = extraWorkMatch ? parseFloat(extraWorkMatch[1]) : 0;
    document.getElementById("slip-extra-work-pay").value = state.payslipData.extraWorkPay;

    state.payslipData.netSalary = netSalaryMatch ? parseFloat(netSalaryMatch[1]) : 0;
    document.getElementById("slip-net-salary-input").value = state.payslipData.netSalary;
}

// 13. Calculation Test Suite Run
function runTestSuite() {
    const testCases = [
        {
            id: 1,
            desc: "กรณีที่ 1: พนักงานปกติ กะเช้า ทำงานเต็มเดือน ไม่เคยสาย ไม่เคยหยุด/ลากิจ",
            setup: {
                baseSalary: 20000,
                isProbation: false,
                isMidMonthStart: false,
                midMonthExtraDays: 0,
                shiftType: 'day',
                logs: Array.from({length: 31}, (_, i) => ({
                    date: `2026-05-${String(i+1).padStart(2, '0')}`,
                    shift: 'day',
                    clockIn: '08:00',
                    clockOut: '20:00',
                    status: 'full day',
                    leaveType: '',
                    isLate: false
                }))
            },
            expected: {
                newStaffDeposit: 0,
                extraWorkPay: 0,
                unpaidLeaveDeduct: 0,
                diligentAllowance: 1550,
                nightShiftAllowance: 0,
                remainingOffDaysCash: 4,
                netSalary: 21550 // 20000 + 1550
            }
        },
        {
            id: 2,
            desc: "กรณีที่ 2: พนักงานใหม่ทดลองงาน (หัก 15%) และเริ่มงานไม่เต็มเดือน มีวันทำงานเพิ่ม 5 วัน",
            setup: {
                baseSalary: 23000,
                isProbation: true,
                isMidMonthStart: true,
                midMonthExtraDays: 5,
                shiftType: 'day',
                logs: Array.from({length: 31}, (_, i) => ({
                    date: `2026-05-${String(i+1).padStart(2, '0')}`,
                    shift: 'day',
                    clockIn: '08:00',
                    clockOut: '20:00',
                    status: 'full day',
                    leaveType: '',
                    isLate: false
                }))
            },
            expected: {
                newStaffDeposit: 3450, // 23000 * 0.15
                extraWorkPay: 3833.33, // (23000 / 30) * 5
                unpaidLeaveDeduct: 0,
                diligentAllowance: 0, // เริ่มงานไม่เต็มเดือน อดเบี้ยขยันทันที
                nightShiftAllowance: 0,
                netSalary: 23383.33 // 23000 - 3450 + 3833.33
            }
        },
        {
            id: 3,
            desc: "กรณีที่ 3: พนักงานกะดึก เข้างานสาย 1 วัน ขาดงาน 1 วัน ลากิจไม่ได้รับเงิน 1 วัน",
            setup: {
                baseSalary: 25000,
                isProbation: false,
                isMidMonthStart: false,
                midMonthExtraDays: 0,
                shiftType: 'night',
                logs: Array.from({length: 31}, (_, i) => {
                    const day = i + 1;
                    let clockIn = '20:00';
                    let status = 'full day';
                    let leaveType = '';
                    let isLate = false;
                    
                    if (day === 10) { clockIn = '20:15'; isLate = true; } // late
                    else if (day === 15) { status = 'absent'; clockIn = ''; } // absent
                    else if (day === 20) { status = 'on Leave'; leaveType = 'unpaid'; clockIn = ''; } // unpaid leave
                    
                    return {
                        date: `2026-05-${String(day).padStart(2, '0')}`,
                        shift: 'night',
                        clockIn,
                        clockOut: '08:00',
                        status,
                        leaveType,
                        isLate
                    };
                })
            },
            expected: {
                unpaidLeaveDeduct: 1612.90, // (25000 / 31) * 2 = 1612.90
                diligentAllowance: 0, // สาย ขาด ลา หมดสิทธิ์เบี้ยขยัน
                nightShiftAllowance: 2378, // worked 29 night shifts. 29 * 8 * 10.25 = 2378
                netSalary: 25765.10 // 25000 - 1612.90 + 2378 = 25765.10 (1st late waived)
            }
        },
        {
            id: 4,
            desc: "กรณีที่ 4: พนักงานกะดึกย้ายไปกะเช้า มีวันหยุดเปลี่ยนกะ 1 วัน ใช้วันหยุดประจำไป 2 วัน",
            setup: {
                baseSalary: 18000,
                isProbation: false,
                isMidMonthStart: false,
                midMonthExtraDays: 0,
                shiftType: 'night',
                logs: Array.from({length: 31}, (_, i) => {
                    const day = i + 1;
                    let shift = 'night';
                    let clockIn = '20:00';
                    let clockOut = '08:00';
                    let status = 'full day';
                    let leaveType = '';

                    if (day >= 21) {
                        shift = 'day';
                        clockIn = '08:00';
                        clockOut = '20:00';
                    } else if (day === 20) {
                        status = 'on Leave';
                        leaveType = 'shift_change';
                        clockIn = '';
                        clockOut = '';
                    } else if (day === 4 || day === 5) {
                        status = 'on Leave';
                        leaveType = 'off';
                        clockIn = '';
                        clockOut = '';
                    }

                    return {
                        date: `2026-05-${String(day).padStart(2, '0')}`,
                        shift,
                        clockIn,
                        clockOut,
                        status,
                        leaveType,
                        isLate: false
                    };
                })
            },
            expected: {
                unpaidLeaveDeduct: 0,
                diligentAllowance: 1550, // ไม่มีสายหรือลากิจผิดกฎ ได้เบี้ยขยัน
                remainingOffDaysCash: 2, // 4 - 2 offdays = 2
                netSalary: 20944 // 18000 + 1550 + 17 shifts * 8 * 10.25 = 18000 + 1550 + 1394 = 20944
            }
        },
        {
            id: 5,
            desc: "กรณีที่ 5: พนักงานกะเช้า เข้าสายในเวลาใหม่หลังวันที่ 25 พฤษภาคม (สายหลัง 09:00)",
            setup: {
                baseSalary: 30000,
                isProbation: false,
                isMidMonthStart: false,
                midMonthExtraDays: 0,
                shiftType: 'day',
                logs: Array.from({length: 31}, (_, i) => {
                    const day = i + 1;
                    let clockIn = '08:00';
                    let isLate = false;

                    if (day >= 25) {
                        clockIn = '09:00';
                    }
                    
                    if (day === 26) {
                        clockIn = '09:05'; // LATE!
                        isLate = true;
                    }

                    return {
                        date: `2026-05-${String(day).padStart(2, '0')}`,
                        shift: 'day',
                        clockIn,
                        clockOut: day >= 25 ? '21:00' : '20:00',
                        status: 'full day',
                        leaveType: '',
                        isLate
                    };
                })
            },
            expected: {
                unpaidLeaveDeduct: 0,
                diligentAllowance: 0, // สายในกะเช้าวันที่ 26 พค. ทำให้โดนตัดเบี้ยขยันทันที
                netSalary: 30000 // 30000 (1st late waived, no deduction)
            }
        }
    ];

    const tbody = document.getElementById("test-suite-body");
    tbody.innerHTML = "";

    testCases.forEach(tc => {
        const actual = calculateSalary(
            tc.setup.logs,
            tc.setup.baseSalary,
            tc.setup.isProbation,
            tc.setup.isMidMonthStart,
            tc.setup.midMonthExtraDays,
            tc.setup.shiftType,
            '2026-05-20',
            '2026-05-21',
            12.5, // 100 per shift / 8 hours after midnight = 12.5 per hour
            0,
            35.0 // exchangeRate = 35.0
        );

        // Check if matching expectations
        let success = true;
        let reasons = [];

        for (const key in tc.expected) {
            const expectVal = tc.expected[key];
            const actualVal = actual[key];
            
            // Allow small float tolerance
            if (Math.abs(expectVal - actualVal) > 1.0) {
                success = false;
                reasons.push(`${key}: คาดหวัง ${expectVal} แต่คำนวณได้ ${actualVal}`);
            }
        }

        const tr = document.createElement("tr");
        tr.className = success ? "bg-success-light" : "bg-danger-light";

        tr.innerHTML = `
            <td>${tc.id}</td>
            <td class="text-left">
                <strong>${tc.desc}</strong>
                <p class="text-xs text-muted mt-1">ตั้งค่า: เงินเดือน ${formatCurrency(tc.setup.baseSalary)}, Probation: ${tc.setup.isProbation ? 'ใช่' : 'ไม่ใช่'}, เริ่มไม่เต็มเดือน: ${tc.setup.isMidMonthStart ? 'ใช่' : 'ไม่ใช่'}</p>
            </td>
            <td class="text-left text-xs">
                ${Object.keys(tc.expected).map(k => `${k}: ${k.includes('Salary') || k.includes('Pay') || k.includes('Deduct') || k.includes('Allowance') || k.includes('Deposit') || k.includes('Deduction') ? formatCurrency(tc.expected[k]) : tc.expected[k]}`).join("<br>")}
            </td>
            <td class="text-left text-xs">
                ${Object.keys(tc.expected).map(k => `${k}: ${k.includes('Salary') || k.includes('Pay') || k.includes('Deduct') || k.includes('Allowance') || k.includes('Deposit') || k.includes('Deduction') ? formatCurrency(actual[k]) : actual[k]}`).join("<br>")}
                ${!success ? `<div class="text-danger mt-1 font-bold">ต่าง: ${reasons.join(", ")}</div>` : ''}
            </td>
            <td>
                ${success ? 
                    '<span class="badge bg-success text-white"><i class="fa-solid fa-circle-check"></i> ผ่าน (Pass)</span>' : 
                    '<span class="badge bg-danger text-white"><i class="fa-solid fa-circle-xmark"></i> ตก (Fail)</span>'}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 14. Export Summary HTML Report
function exportSummaryReport() {
    const calc = calculateSalary(
        state.attendanceLogs,
        state.baseSalary,
        state.isProbation,
        state.isMidMonthStart,
        state.midMonthExtraDays,
        state.shiftType,
        state.nightShiftOffDate,
        state.nightShiftTransitionDate,
        state.nightShiftAllowanceRate,
        state.attendanceDeductionRate,
        state.exchangeRate
    );

    const diff = state.payslipData.netSalary > 0 ? (state.payslipData.netSalary - calc.netSalary) : 0;
    
    // Print styling and content
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>รายงานผลการตรวจสอบสลิปเงินเดือนพนักงาน</title>
            <style>
                body { font-family: 'Sarabun', sans-serif; color: #333; padding: 40px; }
                h1 { color: #6366f1; text-align: center; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
                .meta-table, .comparison-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .meta-table td { padding: 8px; border: none; }
                .comparison-table th, .comparison-table td { padding: 12px; border: 1px solid #ddd; text-align: center; }
                .comparison-table th { background-color: #f3f4f6; }
                .text-left { text-align: left; }
                .text-danger { color: #ef4444; }
                .text-success { color: #10b981; }
                .alert-box { border-radius: 8px; padding: 15px; margin: 20px 0; border: 1px solid transparent; }
                .alert-danger { background-color: #fef2f2; border-color: #fca5a5; color: #991b1b; }
                .alert-success { background-color: #ecfdf5; border-color: #a7f3d0; color: #065f46; }
                .footer { text-align: center; margin-top: 50px; font-size: 0.8rem; color: #666; }
            </style>
        </head>
        <body>
            <h1>รายงานผลการเปรียบเทียบและตรวจสอบสลิปเงินเดือน</h1>
            
            <table class="meta-table">
                <tr>
                    <td><strong>ชื่อพนักงาน:</strong> ${state.employeeName}</td>
                    <td><strong>รอบการคำนวณเงินเดือน:</strong> ${state.month}</td>
                </tr>
                <tr>
                    <td><strong>กะการทำงานเริ่มต้น:</strong> ${state.shiftType === 'day' ? 'กะเช้า (Day Shift)' : 'กะดึก (Night Shift)'}</td>
                    <td><strong>เงินประกันพนักงานใหม่:</strong> ${state.isProbation ? 'หัก 15% (New staff deposit)' : 'ไม่หัก'}</td>
                </tr>
            </table>

            <h3>ตารางการเปรียบเทียบส่วนต่าง</h3>
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th class="text-left">รายการ</th>
                        <th>ยอดคำนวณจากเวลางานจริง</th>
                        <th>ยอดตามสลิปเงินเดือน</th>
                        <th>ส่วนต่าง</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="text-left">ฐานเงินเดือนพนักงาน</td>
                        <td>${formatCurrency(calc.baseSalary)}</td>
                        <td>${formatCurrency(state.payslipData.baseSalary)}</td>
                        <td class="${calc.baseSalary === state.payslipData.baseSalary ? '' : 'text-danger'}">${formatCurrency(state.payslipData.baseSalary - calc.baseSalary)}</td>
                    </tr>
                    <tr>
                        <td class="text-left">เงินประกันพนักงานใหม่ (New staff deposit 15%)</td>
                        <td>-${formatCurrency(calc.newStaffDeposit)}</td>
                        <td>-${formatCurrency(state.payslipData.probationDeduct)}</td>
                        <td class="${calc.newStaffDeposit === state.payslipData.probationDeduct ? '' : 'text-danger'}">${formatCurrency(state.payslipData.probationDeduct - calc.newStaffDeposit)}</td>
                    </tr>
                    <tr>
                        <td class="text-left">บวกเพิ่มวันทำงานไม่เต็มเดือน</td>
                        <td>${formatCurrency(calc.extraWorkPay)}</td>
                        <td>${formatCurrency(state.payslipData.extraWorkPay)}</td>
                        <td class="${calc.extraWorkPay === state.payslipData.extraWorkPay ? '' : 'text-danger'}">${formatCurrency(state.payslipData.extraWorkPay - calc.extraWorkPay)}</td>
                    </tr>
                    <tr>
                        <td class="text-left">หักเงิน Unpaid leave</td>
                        <td>-${formatCurrency(calc.unpaidLeaveDeduct)}</td>
                        <td>-${formatCurrency(state.payslipData.unpaidDeduct)}</td>
                        <td class="${calc.unpaidLeaveDeduct === state.payslipData.unpaidDeduct ? '' : 'text-danger'}">${formatCurrency(calc.unpaidDeduct - calc.unpaidLeaveDeduct)}</td>
                    </tr>
                    <tr>
                        <td class="text-left">หักเงินเข้าสาย (Attendance Deduction)</td>
                        <td>-${formatCurrency(calc.attendanceDeduction)}</td>
                        <td>-${formatCurrency(state.payslipData.attendanceDeduct)}</td>
                        <td class="${calc.attendanceDeduction === state.payslipData.attendanceDeduct ? '' : 'text-danger'}">${formatCurrency(state.payslipData.attendanceDeduct - calc.attendanceDeduction)}</td>
                    </tr>
                    <tr>
                        <td class="text-left">เบี้ยขยันคงที่</td>
                        <td>${formatCurrency(calc.diligentAllowance)}</td>
                        <td>${formatCurrency(state.payslipData.diligent)}</td>
                        <td class="${calc.diligentAllowance === state.payslipData.diligent ? '' : 'text-danger'}">${formatCurrency(state.payslipData.diligent - calc.diligentAllowance)}</td>
                    </tr>
                    <tr>
                        <td class="text-left">เบี้ยเลี้ยงกะดึก</td>
                        <td>${formatCurrency(calc.nightShiftAllowance)}</td>
                        <td>${formatCurrency(state.payslipData.nightShift)}</td>
                        <td class="${calc.nightShiftAllowance === state.payslipData.nightShift ? '' : 'text-danger'}">${formatCurrency(state.payslipData.nightShift - calc.nightShiftAllowance)}</td>
                    </tr>
                    <tr style="font-weight: bold; background-color: #f9fafb;">
                        <td class="text-left">ยอดรับสุทธิรวม</td>
                        <td>${formatCurrency(calc.netSalary)}</td>
                        <td>${formatCurrency(state.payslipData.netSalary)}</td>
                        <td class="${Math.abs(diff) < 0.01 ? 'text-success' : 'text-danger'}">${formatCurrency(diff)}</td>
                    </tr>
                </tbody>
            </table>

            <h3>ผลการวิเคราะห์</h3>
            ${Math.abs(diff) < 0.01 ? `
                <div class="alert-box alert-success">
                    <strong>การตรวจสอบผ่าน:</strong> ข้อมูลถูกต้องตรงกันทั้งหมด ไม่พบส่วนต่างในสลิปเงินเดือน
                </div>
            ` : `
                <div class="alert-box alert-danger">
                    <strong>พบความคลาดเคลื่อน:</strong> ตรวจพบส่วนต่างสุทธิ ${formatCurrency(Math.abs(diff))} (${diff > 0 ? 'จ่ายเงินเกินพนักงาน' : 'จ่ายเงินพนักงานขาด'})
                    <br><br>
                    <strong>รายละเอียดความผิดพลาด:</strong>
                    <ul>
                        ${calc.baseSalary !== state.payslipData.baseSalary ? `<li>ฐานเงินเดือนไม่ตรงกัน</li>` : ''}
                        ${calc.newStaffDeposit !== state.payslipData.probationDeduct ? `<li>เงินประกันพนักงานใหม่ (New staff deposit 15%) ไม่ถูกต้อง</li>` : ''}
                        ${calc.unpaidLeaveDeduct !== state.payslipData.unpaidDeduct ? `<li>หัก Unpaid leave ไม่ถูกต้องตามจำนวนวันที่หยุดเกินสิทธิ์จริง (ขาด/หยุดเกิน ${calc.unpaidDeductionsCount} วัน)</li>` : ''}
                        ${calc.attendanceDeduction !== state.payslipData.attendanceDeduct ? `<li>หักเงินเข้างานสาย/สายไม่ครบ (Attendance Deduction) ไม่ถูกต้อง (คำนวณจริง: ${formatCurrency(calc.attendanceDeduction)})</li>` : ''}
                        ${calc.diligentAllowance !== state.payslipData.diligent ? `<li>ความคลาดเคลื่อนเบี้ยขยัน (พนักงานมีรายละเอียดสิทธิ์เบี้ยขยัน: ${calc.diligentReason})</li>` : ''}
                        ${calc.nightShiftAllowance !== state.payslipData.nightShift ? `<li>จำนวนรอบจ่ายเบี้ยเลี้ยงกะดึกไม่ตรงกัน</li>` : ''}
                    </ul>
                </div>
            `}

            <h3>สรุปข้อมูลการเข้างานเพิ่มเติม</h3>
            <ul>
                <li>จำนวนวันหยุดประจำ Off Day ที่ได้สะสมเปลี่ยนเป็นเงิน: <strong>${calc.remainingOffDaysCash} วัน</strong></li>
                <li>จำนวนการเข้างานสาย: <strong>${calc.latesCount} ครั้ง</strong></li>
                <li>จำนวนวันสแกนไม่ครบ (Incomplete): <strong>${calc.incompleteCount} วัน</strong></li>
            </ul>

            <div class="footer">
                รายงานนี้สร้างโดยระบบตรวจสอบสลิปเงินเดือนพนักงานอัตโนมัติ ณ วันที่ ${new Date().toLocaleDateString('th-TH')}
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function showLoader(text = "กำลังประมวลผล...") {
    const overlay = document.getElementById("loading-overlay");
    const textEl = document.getElementById("loading-text");
    if (textEl) textEl.innerText = text;
    if (overlay) overlay.style.display = "flex";
}

function hideLoader() {
    const overlay = document.getElementById("loading-overlay");
    if (overlay) overlay.style.display = "none";
}

function getHistoryStorageKey() {
    const auditedName = (state.employeeName || "").trim();
    if (auditedName) {
        return `salary_verification_history_emp_${auditedName.toLowerCase().replace(/\s+/g, "_")}`;
    }
    if (state.currentUser && state.currentUser.name) {
        return `salary_verification_history_user_${state.currentUser.name.toLowerCase().replace(/\s+/g, "_")}`;
    }
    return 'salary_verification_history_guest';
}

function saveToHistory() {
    if (!state.employeeName || state.employeeName.trim() === "") {
        alert("กรุณากรอกชื่อ-นามสกุลพนักงานที่ต้องการตรวจสอบ");
        return;
    }
    
    const calc = calculateSalary(
        state.attendanceLogs,
        state.baseSalary,
        state.isProbation,
        state.isMidMonthStart,
        state.midMonthExtraDays,
        state.shiftType,
        state.nightShiftOffDate,
        state.nightShiftTransitionDate,
        state.nightShiftAllowanceRate,
        state.attendanceDeductionRate,
        state.exchangeRate
    );

    const record = {
        id: Date.now().toString(),
        employeeName: state.employeeName,
        month: state.month,
        exchangeRate: state.exchangeRate,
        baseSalary: state.baseSalary,
        isProbation: state.isProbation,
        isMidMonthStart: state.isMidMonthStart,
        midMonthExtraDays: state.midMonthExtraDays,
        shiftType: state.shiftType,
        shiftMode: state.shiftMode,
        nightShiftOffDate: state.nightShiftOffDate,
        nightShiftTransitionDate: state.nightShiftTransitionDate,
        nightShiftAllowanceRate: state.nightShiftAllowanceRate,
        attendanceDeductionRate: state.attendanceDeductionRate,
        attendanceLogs: state.attendanceLogs,
        payslipData: state.payslipData,
        calcResults: calc,
        authorPasscode: state.currentUser ? state.currentUser.password : '0000',
        authorName: state.currentUser ? state.currentUser.name : 'Guest',
        adminChecked: false,
        timestamp: new Date().toISOString(),
        timezone: state.timezone,
        rulesBefore: state.rulesBefore,
        hasTimeChange: state.hasTimeChange,
        timeChangeDate: state.timeChangeDate,
        rulesAfter: state.rulesAfter,
        hireDate: state.hireDate,
        holidays: state.holidays,
        adjustments: state.adjustments,
        disputeStatus: state.disputeStatus || 'none',
        adminComment: state.adminComment || ''
    };

    const key = getHistoryStorageKey();
    let history = JSON.parse(localStorage.getItem(key) || '[]');
    // Remove duplicate entries for same employee and same month cycle
    history = history.filter(item => !(item.employeeName === record.employeeName && item.month === record.month));
    history.unshift(record); // Add to the top of the history list
    localStorage.setItem(key, JSON.stringify(history));
    saveRecordToCloudflare(record);
    
    renderHistoryList();
    alert(`บันทึกข้อมูลการตรวจสอบของ "${record.employeeName}" รอบเดือน "${record.month}" เรียบร้อยแล้ว!`);
}

function clearConfigSettings(silent = false) {
    // Reset state parameters back to default
    state.loadedHistoryId = null;
    state.hasChosenMonth = false;
    state.isRecordLocked = false;
    state.savedCalcResults = null;
    setSettingsPanelDisabled(false);
    
    const banner = document.getElementById("lock-banner");
    if (banner) banner.style.display = "none";
    const unlockBtn = document.getElementById("unlock-report-btn");
    if (unlockBtn) unlockBtn.style.display = "none";
    const updateBtn = document.getElementById("update-report-btn");
    if (updateBtn) updateBtn.style.display = "none";

    state.employeeTeam = 'Audit';
    state.baseSalary = 18000;
    state.isProbation = false;
    state.isMidMonthStart = false;
    state.midMonthExtraDays = 0;
    state.shiftType = 'day';
    state.dayShiftStartDate = '';
    state.nightShiftOffDate = '';
    state.nightShiftTransitionDate = '';
    state.diligentAllowance = 1550;
    state.nightShiftAllowanceRate = 10.25;
    state.attendanceDeductionRate = 0;
    state.exchangeRate = 35.0;
    state.month = '2026-05';
    state.attendanceLogs = [];
    state.adjustments = {
        base: { amount: 0, note: "" },
        probation: { amount: 0, note: "" },
        extra: { amount: 0, note: "" },
        unpaid: { amount: 0, note: "" },
        attendance: { amount: 0, note: "" },
        diligent: { amount: 0, note: "" },
        night: { amount: 0, note: "" },
        net: { amount: 0, note: "" }
    };
    state.payslipData = {
        baseSalary: 0,
        diligent: 0,
        nightShift: 0,
        probationDeduct: 0,
        unpaidDeduct: 0,
        attendanceDeduct: 0,
        extraWorkPay: 0,
        netSalary: 0
    };
    state.pendingTimesheetFile = null;
    state.pendingPayslipFile = null;
    state.timezone = 'Bangkok';
    state.hasTimeChange = false;
    state.timeChangeDate = '';
    state.holidays = Array.from({length: 5}, () => ({ date: '', type: '' }));

    // Update Form Inputs in DOM
    const teamSelect = document.getElementById("employee-team-select");
    if (teamSelect) teamSelect.value = 'Audit';
    document.getElementById("base-salary-select").value = "18000";
    document.getElementById("custom-salary-group").style.display = "none";
    document.getElementById("probation-switch").checked = false;
    document.getElementById("midmonth-switch").checked = false;
    document.getElementById("midmonth-days-group").style.display = "none";
    document.getElementById("midmonth-days-input").value = 0;
    
    // Reset shift buttons
    window.updateShiftUIAndState("pure_day"); 
    document.getElementById("day-shift-start-date").value = "";
    document.getElementById("night-shift-off-date").value = "";
    document.getElementById("night-shift-transition-date").value = "";
    
    // System values
    document.getElementById("config-diligent").value = 1550;
    document.getElementById("config-nightshift-allowance").value = 10.25;
    document.getElementById("config-incomplete-rate").value = 5;
    const lateRateInput = document.getElementById("config-late-rate");
    if (lateRateInput) lateRateInput.value = 5;
    
    // Timezone
    document.getElementById("config-timezone").value = "Bangkok";
    document.getElementById("config-has-time-change").checked = false;
    document.getElementById("time-change-details-group").style.display = "none";
    document.getElementById("config-time-change-date").value = "";
    
    const exchangeRateInput = document.getElementById("config-exchange-rate");
    if (exchangeRateInput) exchangeRateInput.value = 35.00;

    // Reset file upload names & hide clear buttons
    document.getElementById("timesheet-file-name").innerText = "ยังไม่ได้เลือกไฟล์";
    document.getElementById("payslip-file-name").innerText = "ยังไม่ได้เลือกไฟล์";
    document.getElementById("clear-timesheet-btn").classList.add("d-none");
    document.getElementById("clear-payslip-btn").classList.add("d-none");
    document.getElementById("timesheet-file-input").value = "";
    document.getElementById("payslip-file-input").value = "";
    resetPayslipPreview();
    document.getElementById("ocr-status-badge").innerText = "ยังไม่มีการประมวลผล";
    document.getElementById("ocr-status-badge").className = "badge bg-info-light text-info";
    
    // Reset holiday inputs in UI
    for (let i = 1; i <= 5; i++) {
        const dateInput = document.getElementById(`config-holiday-date-${i}`);
        if (dateInput) dateInput.value = "";
    }
    state.holidays = [
        { date: '', type: 'compulsory' },
        { date: '', type: 'off' },
        { date: '', type: 'off' },
        { date: '', type: 'off' },
        { date: '', type: 'off' }
    ];
    renderAdditionalHolidaysUI();
    
    // Regenerate empty logs
    generateEmptyMonthLogs(getAttendanceMonth(state.month));
    recalculateAndRender();

    // Reset Test Suite tab UI back to initial state
    const testSuiteBody = document.getElementById("test-suite-body");
    if (testSuiteBody) {
        testSuiteBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4 text-muted">คลิกปุ่ม <strong>"เริ่มการทดสอบทั้งหมด"</strong> เพื่อรันผลการตรวจสอบสูตร</td>
            </tr>
        `;
    }
    
    if (!silent) {
        alert("ล้างการตั้งค่าและข้อมูลของรอบคำนวณปัจจุบันเรียบร้อยแล้ว!");
    }
}

function displayMockPayslipFromData() {
    const container = document.getElementById("payslip-mock-container");
    if (!container) return;
    container.innerHTML = "";
    
    const lang = state.language || 'en';
    const payslipDiv = document.createElement("div");
    payslipDiv.className = "demo-payslip-canvas p-4 border rounded text-left bg-white text-dark font-sans shadow-lg";
    payslipDiv.style.width = "100%";
    payslipDiv.style.maxWidth = "650px";
    payslipDiv.style.fontFamily = "Prompt, sans-serif";
    payslipDiv.style.fontSize = "0.85rem";
    payslipDiv.style.color = "#333";
    payslipDiv.style.borderTop = "8px solid #6366f1";
    
    const monthName = getLocalizedMonthYear(state.month, lang);

    const txtMap = {
        th: {
            company: "บริษัท ตัวอย่าง จำกัด (มหาชน)",
            subtitle: `สลิปใบเสร็จรับเงินเดือนประจำเดือน ${monthName}`,
            empId: "รหัสพนักงาน:",
            name: "ชื่อ:",
            earnings: "รายได้ (Earnings)",
            amt: "จำนวนเงิน (บาท)",
            salary: "เงินเดือนพื้นฐาน (Salary)",
            diligent: "เบี้ยขยันคงที่ (Diligent Allowance)",
            night: "เบี้ยเลี้ยงทำงานกะดึก (Night Shift Allowance)",
            extra: "บวกเพิ่มวันทำงานไม่เต็มเดือน",
            totalEarn: "รวมรายได้พึงประเมิน",
            deductions: "รายการหัก (Deductions)",
            unpaid: "หัก Unpaid leave",
            probation: "New staff deposit (15%)",
            attendance: "Attendance Deduction (หักเข้างานสาย)",
            totalDeduct: "รวมรายการหัก",
            transfer: "โอนเข้าบัญชี (Transfer to)",
            dept: "แผนกบัญชีและการเงิน",
            approved: "อนุมัติจ่ายทางอิレクトทรอนิกส์",
            status: "จำลองข้อมูลสำเร็จ"
        },
        en: {
            company: "Sample Co., Ltd.",
            subtitle: `Salary Slip Receipt for ${monthName}`,
            empId: "Employee ID:",
            name: "Name:",
            earnings: "Earnings",
            amt: "Amount (THB)",
            salary: "Base Salary (Salary)",
            diligent: "Diligent Allowance",
            night: "Night Shift Allowance",
            extra: "Mid-month Additions",
            totalEarn: "Gross Earnings",
            deductions: "Deductions",
            unpaid: "Unpaid Leave Deduction",
            probation: "New staff deposit (15%)",
            attendance: "Attendance Deduction (Lates)",
            totalDeduct: "Total Deductions",
            transfer: "Transfer to Account",
            dept: "Finance & Payroll Department",
            approved: "Approved Electronically",
            status: "Simulation Successful"
        },
        zh: {
            company: "示例股份有限公司",
            subtitle: `薪資單 收據 月份：${monthName}`,
            empId: "員工編號：",
            name: "姓名：",
            earnings: "收入項目 (Earnings)",
            amt: "金額 (THB)",
            salary: "基本薪資 (Salary)",
            diligent: "固定全勤獎金 (Diligent Allowance)",
            night: "夜班津貼 (Night Shift Allowance)",
            extra: "月中入職加薪",
            totalEarn: "總收入",
            deductions: "扣款項目 (Deductions)",
            unpaid: "事假扣款 (Unpaid leave)",
            probation: "新員工保證金 (New staff deposit 15%)",
            attendance: "考勤扣款 (遲到/未完打卡)",
            totalDeduct: "總扣除額",
            transfer: "銀行轉帳 (Transfer to)",
            dept: "財務與會計部",
            approved: "電子核准付款",
            status: "模擬數據成功"
        }
    };
    
    const dict = txtMap[lang] || txtMap.en;

    payslipDiv.innerHTML = `
        <div class="text-center font-bold border-bottom pb-2 mb-3">
            <h4 style="margin:0; font-size:1.15rem; color:#6366f1;">${dict.company}</h4>
            <span style="font-size:0.75rem; color:#666;">${dict.subtitle}</span>
        </div>
        <div class="row mb-3" style="display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap;">
            <div><strong>${dict.empId}</strong> ${state.employeeNo || ('EMP-' + (state.employeeName.hashCode ? Math.abs(state.employeeName.hashCode()) % 1000 : '99'))}</div>
            <div><strong>${dict.name}</strong> ${state.employeeName}</div>
        </div>
        
        <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
            <!-- Left Side: Earnings -->
            <div style="flex: 1; min-width: 280px; display: flex; flex-direction: column;">
                <table style="width:100%; border-collapse:collapse; flex-grow: 1;" border="1" cellpadding="6" bordercolor="#eee">
                    <thead>
                        <tr bgcolor="#f9f9f9">
                            <th align="left">${dict.earnings}</th>
                            <th align="right">${dict.amt}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${dict.salary}</td>
                            <td align="right">${state.payslipData.baseSalary.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>${dict.diligent}</td>
                            <td align="right">${state.payslipData.diligent.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>${dict.night}</td>
                            <td align="right">${state.payslipData.nightShift.toFixed(2)}</td>
                        </tr>
                        ${state.payslipData.extraWorkPay > 0 ? `
                        <tr>
                            <td>${dict.extra}</td>
                            <td align="right">${state.payslipData.extraWorkPay.toFixed(2)}</td>
                        </tr>` : ''}
                        <tr bgcolor="#f9f9f9" style="font-weight: bold; border-top: 2px solid #ddd;">
                            <td><strong>${dict.totalEarn}</strong></td>
                            <td align="right"><strong>${(state.payslipData.baseSalary + state.payslipData.diligent + state.payslipData.nightShift + state.payslipData.extraWorkPay).toFixed(2)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Right Side: Deductions -->
            <div style="flex: 1; min-width: 280px; display: flex; flex-direction: column;">
                <table style="width:100%; border-collapse:collapse; flex-grow: 1;" border="1" cellpadding="6" bordercolor="#eee">
                    <thead>
                        <tr bgcolor="#f9f9f9">
                            <th align="left">${dict.deductions}</th>
                            <th align="right">${dict.amt}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${dict.unpaid}</td>
                            <td align="right">${state.payslipData.unpaidDeduct.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>${dict.probation}</td>
                            <td align="right">${state.payslipData.probationDeduct.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>${dict.attendance}</td>
                            <td align="right">${(state.payslipData.attendanceDeduct || 0).toFixed(2)}</td>
                        </tr>
                        <!-- Spacer row if extraWorkPay is loaded on the left to align tables -->
                        ${state.payslipData.extraWorkPay > 0 ? `
                        <tr style="visibility: hidden;">
                            <td>Spacer</td>
                            <td align="right">0.00</td>
                        </tr>` : ''}
                        <tr bgcolor="#f9f9f9" style="font-weight: bold; border-top: 2px solid #ddd;">
                            <td><strong>${dict.totalDeduct}</strong></td>
                            <td align="right"><strong>${(state.payslipData.unpaidDeduct + state.payslipData.probationDeduct + (state.payslipData.attendanceDeduct || 0)).toFixed(2)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Bottom Section -->
        <div class="border-top pt-3" style="display: flex; justify-content: space-between; align-items: flex-start; font-size:0.85rem;">
            <!-- Bottom Left: Transfer to (Total) -->
            <div style="display: flex; flex-direction: column; gap: 4px; border: 1px solid #10b981; border-radius: 6px; padding: 8px 12px; background-color: #f0fdf4; min-width: 200px;">
                <div style="font-weight: bold; color: #15803d; border-bottom: 1px solid #bbf7d0; padding-bottom: 2px; margin-bottom: 2px;">
                    ${dict.transfer}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-weight: bold; color: #166534; font-size: 0.95rem;">
                    <span>Total:</span>
                    <span>${formatCurrency(state.payslipData.netSalary)}</span>
                </div>
            </div>
            
            <div style="text-align: right; font-size: 0.75rem; color: #666; padding-top: 10px;">
                <strong>${dict.dept}</strong><br>
                <span style="font-size: 0.65rem; color: #999;">${dict.approved}</span>
            </div>
        </div>
    `;
    container.appendChild(payslipDiv);
    
    // Automatically display the toggle buttons
    const toggleGroup = document.getElementById("payslip-view-toggle-group");
    if (toggleGroup) {
        toggleGroup.style.display = "flex";
    }
    
    // Auto switch to show mock payslip
    const btnShowMock = document.getElementById("btn-show-payslip-mock");
    if (btnShowMock) {
        btnShowMock.click();
    }
    
    document.getElementById("ocr-status-badge").innerText = dict.status;
    document.getElementById("ocr-status-badge").className = "badge bg-success-light text-success";
}

function getLocalizedMonthYear(monthStr, lang) {
    if (!monthStr) return "";
    const [year, month] = monthStr.split("-");
    const monthsTh = {
        "01": "มกราคม", "02": "กุมภาพันธ์", "03": "มีนาคม", "04": "เมษายน",
        "05": "พฤษภาคม", "06": "มิถุนายน", "07": "กรกฎาคม", "08": "สิงหาคม",
        "09": "กันยายน", "10": "ตุลาคม", "11": "พฤศจิกายน", "12": "ธันวาคม"
    };
    const monthsEn = {
        "01": "January", "02": "February", "03": "March", "04": "April",
        "05": "May", "06": "June", "07": "July", "08": "August",
        "09": "September", "10": "October", "11": "November", "12": "December"
    };
    const monthsZh = {
        "01": "1月", "02": "2月", "03": "3月", "04": "4月",
        "05": "5月", "06": "6月", "07": "7月", "08": "8月",
        "09": "9月", "10": "10月", "11": "11月", "12": "12月"
    };
    
    if (lang === 'th') {
        return (monthsTh[month] || month) + " " + (parseInt(year) + 543);
    } else if (lang === 'zh') {
        return year + "年" + (monthsZh[month] || month);
    } else {
        return (monthsEn[month] || month) + " " + year;
    }
}

function renderHistoryList() {
    const listAuditEl = document.getElementById("history-records-list-audit");
    const listCsEl = document.getElementById("history-records-list-cs");
    
    // Fallback for diagnostic tests or old pages
    const listEl = document.getElementById("history-records-list");
    
    const lang = state.language || 'en';
    const history = JSON.parse(localStorage.getItem(getHistoryStorageKey()) || '[]');
    
    const textMap = {
        th: { 
            empty: "ไม่มีประวัติการตรวจสอบที่บันทึกไว้", 
            emptyAudit: "ไม่มีประวัติการตรวจสอบของทีมออดิท",
            emptyCs: "ไม่มีประวัติการตรวจสอบของทีม CS",
            period: "รอบสลิป: ", 
            ok: "ยอดตรงกัน", 
            diff: "ส่วนต่าง ", 
            delete: "ลบข้อมูล" 
        },
        en: { 
            empty: "No saved verification history", 
            emptyAudit: "No history for Audit Team",
            emptyCs: "No history for CS Team",
            period: "Period: ", 
            ok: "Match", 
            diff: "Diff ", 
            delete: "Delete" 
        },
        zh: { 
            empty: "沒有已儲存的驗證紀錄", 
            emptyAudit: "沒有審計團隊的驗證紀錄",
            emptyCs: "沒有客服團隊的驗證紀錄",
            period: "薪資單周期: ", 
            ok: "金額吻合", 
            diff: "差額 ", 
            delete: "刪除" 
        }
    };
    const dict = textMap[lang] || textMap.en;

    if (listEl) {
        listEl.innerHTML = "";
        if (history.length === 0) {
            listEl.innerHTML = `<div class="text-center py-4 text-muted text-xs">${dict.empty}</div>`;
        }
    }
    
    if (listAuditEl) listAuditEl.innerHTML = "";
    if (listCsEl) listCsEl.innerHTML = "";

    let auditCount = 0;
    let csCount = 0;

    history.forEach(record => {
        const itemEl = document.createElement("div");
        itemEl.className = "history-item";
        
        // Calculate status and salary comparison for the item display
        const calc = calculateSalary(
            record.attendanceLogs,
            record.baseSalary,
            record.isProbation,
            record.isMidMonthStart,
            record.midMonthExtraDays,
            record.shiftType,
            record.nightShiftOffDate,
            record.nightShiftTransitionDate,
            record.nightShiftAllowanceRate,
            record.attendanceDeductionRate || 0,
            record.exchangeRate || 35.0
        );
        const diff = record.payslipData.netSalary > 0 ? (record.payslipData.netSalary - calc.netSalary) : 0;
        const isMatch = Math.abs(diff) < 0.01;

        const monthName = getLocalizedMonthYear(record.month, lang);

        itemEl.innerHTML = `
            <div class="history-item-details" onclick="loadFromHistory('${record.id}')">
                <span class="history-item-name"><i class="fa-solid fa-user text-xs mr-1 text-primary"></i> ${record.employeeName}</span>
                <span class="history-item-meta">${dict.period}${monthName}</span>
                <span class="badge ${isMatch ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}" style="width: fit-content; margin-top:4px; font-size:10px;">
                    ${isMatch ? dict.ok : dict.diff + formatCurrency(Math.abs(diff))}
                </span>
            </div>
            <div class="history-item-actions">
                <div class="history-item-salary text-success font-bold" onclick="loadFromHistory('${record.id}')">
                    ${formatCurrency(calc.netSalary)}
                </div>
                <button class="btn btn-outline-danger btn-xs" onclick="deleteFromHistory('${record.id}')" title="${dict.delete}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        
        const recordTeam = record.employeeTeam || 'Audit';
        if (recordTeam === 'CS') {
            if (listCsEl) {
                listCsEl.appendChild(itemEl);
                csCount++;
            } else if (listEl) {
                listEl.appendChild(itemEl);
            }
        } else {
            if (listAuditEl) {
                listAuditEl.appendChild(itemEl);
                auditCount++;
            } else if (listEl) {
                listEl.appendChild(itemEl);
            }
        }
    });

    if (listAuditEl && auditCount === 0) {
        listAuditEl.innerHTML = `<div class="text-center py-3 text-muted text-xs">${dict.emptyAudit}</div>`;
    }
    if (listCsEl && csCount === 0) {
        listCsEl.innerHTML = `<div class="text-center py-3 text-muted text-xs">${dict.emptyCs}</div>`;
    }
}

function loadFromHistory(id) {
    const history = JSON.parse(localStorage.getItem(getHistoryStorageKey()) || '[]');
    const record = history.find(item => item.id === id);
    if (!record) return;

    state.loadedHistoryId = id;
    state.hasChosenMonth = true;
    
    // Set locked status and load saved calcResults
    if (!record.calcResults) {
        // Fallback for older saved history items
        record.calcResults = calculateSalary(
            record.attendanceLogs,
            record.baseSalary,
            record.isProbation,
            record.isMidMonthStart,
            record.midMonthExtraDays,
            record.shiftType,
            record.nightShiftOffDate,
            record.nightShiftTransitionDate,
            record.nightShiftAllowanceRate,
            record.attendanceDeductionRate || 0,
            record.exchangeRate || 35.0
        );
    }
    state.savedCalcResults = record.calcResults;
    state.isRecordLocked = true;
    
    // Disable inputs to prevent alteration
    setSettingsPanelDisabled(true);
    
    // Show lock banner
    const banner = document.getElementById("lock-banner");
    if (banner) banner.style.display = "flex";
    
    // Show unlock button, hide update button initially (must unlock first)
    const unlockBtn = document.getElementById("unlock-report-btn");
    if (unlockBtn) unlockBtn.style.display = "inline-block";
    const updateBtn = document.getElementById("update-report-btn");
    if (updateBtn) updateBtn.style.display = "none";

    // Restore state
    state.employeeName = record.employeeName;
    state.month = record.month;
    state.baseSalary = record.baseSalary;
    state.exchangeRate = record.exchangeRate || 35.0;
    state.isProbation = record.isProbation;
    state.isMidMonthStart = record.isMidMonthStart;
    state.midMonthExtraDays = record.midMonthExtraDays;
    state.shiftType = record.shiftType;
    state.nightShiftOffDate = record.nightShiftOffDate;
    state.nightShiftTransitionDate = record.nightShiftTransitionDate;
    state.nightShiftAllowanceRate = record.nightShiftAllowanceRate;
    state.attendanceDeductionRate = record.attendanceDeductionRate || 0;
    state.attendanceLogs = record.attendanceLogs;
    state.payslipData = record.payslipData;
    state.hireDate = record.hireDate || '';
    state.employeeTeam = record.employeeTeam || 'Audit';
    state.holidays = record.holidays || Array.from({length: 5}, () => ({ date: '', type: '' }));
    state.timezone = record.timezone || 'Bangkok';
    state.rulesBefore = record.rulesBefore || { dayStart: '08:00', dayEnd: '20:00', nightStart: '20:00', nightEnd: '08:00' };
    state.hasTimeChange = record.hasTimeChange !== undefined ? record.hasTimeChange : true;
    state.timeChangeDate = record.timeChangeDate || `${state.month}-25`;
    state.rulesAfter = record.rulesAfter || { dayStart: '09:00', dayEnd: '21:00', nightStart: '21:00', nightEnd: '09:00' };
    state.adjustments = record.adjustments || {
        base: { amount: 0, note: "" },
        probation: { amount: 0, note: "" },
        extra: { amount: 0, note: "" },
        unpaid: { amount: 0, note: "" },
        attendance: { amount: 0, note: "" },
        diligent: { amount: 0, note: "" },
        night: { amount: 0, note: "" },
        net: { amount: 0, note: "" }
    };
    state.disputeStatus = record.disputeStatus || 'none';
    state.adminComment = record.adminComment || '';

    // Update form elements in UI
    document.getElementById("employee-name-input").value = state.employeeName;
    const teamSelect = document.getElementById("employee-team-select");
    if (teamSelect) teamSelect.value = state.employeeTeam;
    document.getElementById("month-picker").value = state.month;
    
    const hireDateInput = document.getElementById("config-hire-date");
    if (hireDateInput) hireDateInput.value = state.hireDate;
    
    const exchangeRateInput = document.getElementById("config-exchange-rate");
    if (exchangeRateInput) exchangeRateInput.value = state.exchangeRate;
    
    for (let i = 1; i <= 5; i++) {
        const dateInput = document.getElementById(`config-holiday-date-${i}`);
        const savedHoliday = state.holidays[i - 1] || { date: '', type: '' };
        if (dateInput) dateInput.value = savedHoliday.date || "";
    }
    renderAdditionalHolidaysUI();
    
    // Sync Base salary select or custom input
    const baseSelect = document.getElementById("base-salary-select");
    const salaryOpts = ["18000", "20000", "23000", "25000", "2000", "30000"];
    if (salaryOpts.includes(state.baseSalary.toString())) {
        baseSelect.value = state.baseSalary.toString();
        document.getElementById("custom-salary-group").style.display = "none";
    } else {
        baseSelect.value = "custom";
        document.getElementById("custom-salary-input").value = state.baseSalary;
        document.getElementById("custom-salary-group").style.display = "block";
    }

    document.getElementById("probation-switch").checked = state.isProbation;
    document.getElementById("midmonth-switch").checked = state.isMidMonthStart;
    
    const midDaysGroup = document.getElementById("midmonth-days-group");
    if (state.isMidMonthStart) {
        midDaysGroup.style.display = "block";
        document.getElementById("midmonth-days-input").value = state.midMonthExtraDays;
    } else {
        midDaysGroup.style.display = "none";
    }

    // Sync shift selector
    let mode = record.shiftMode;
    if (!mode) {
        // Fallback for older saved history records
        if (state.shiftType === 'day') {
            mode = record.dayShiftStartDate ? 'day_to_night' : 'pure_day';
        } else {
            mode = record.nightShiftTransitionDate ? 'night_to_day' : 'pure_night';
        }
    }
    
    // Dates must be set before calling window.updateShiftUIAndState
    document.getElementById("day-shift-start-date").value = record.dayShiftStartDate || `${state.month}-01`;
    document.getElementById("night-shift-off-date").value = state.nightShiftOffDate || '';
    document.getElementById("night-shift-transition-date").value = state.nightShiftTransitionDate || '';
    document.getElementById("config-nightshift-allowance").value = state.nightShiftAllowanceRate;

    window.updateShiftUIAndState(mode);

    const attendanceDeductInput = document.getElementById("config-attendance-deduction");
    if (attendanceDeductInput) {
        attendanceDeductInput.value = state.attendanceDeductionRate;
    }

    // Restore interactive shift rules in UI
    document.getElementById("config-timezone").value = state.timezone;
    document.getElementById("rule-before-day-start").value = state.rulesBefore.dayStart;
    document.getElementById("rule-before-day-end").value = state.rulesBefore.dayEnd;
    document.getElementById("rule-before-night-start").value = state.rulesBefore.nightStart;
    document.getElementById("rule-before-night-end").value = state.rulesBefore.nightEnd;
    
    const hasChangeCb = document.getElementById("config-has-time-change");
    hasChangeCb.checked = state.hasTimeChange;
    document.getElementById("time-change-details-group").style.display = state.hasTimeChange ? "block" : "none";
    document.getElementById("config-time-change-date").value = state.timeChangeDate;
    
    document.getElementById("rule-after-day-start").value = state.rulesAfter.dayStart;
    document.getElementById("rule-after-day-end").value = state.rulesAfter.dayEnd;
    document.getElementById("rule-after-night-start").value = state.rulesAfter.nightStart;
    document.getElementById("rule-after-night-end").value = state.rulesAfter.nightEnd;

    // Sync payslip fields
    document.getElementById("slip-base-salary").value = state.payslipData.baseSalary;
    document.getElementById("slip-diligent").value = state.payslipData.diligent;
    document.getElementById("slip-nightshift").value = state.payslipData.nightShift;
    document.getElementById("slip-probation-deduct").value = state.payslipData.probationDeduct;
    document.getElementById("slip-unpaid-deduct").value = state.payslipData.unpaidDeduct;

    const slipAttendanceDeductInput = document.getElementById("slip-attendance-deduct");
    if (slipAttendanceDeductInput) {
        slipAttendanceDeductInput.value = state.payslipData.attendanceDeduct || 0;
    }

    document.getElementById("slip-extra-work-pay").value = state.payslipData.extraWorkPay;
    document.getElementById("slip-net-salary-input").value = state.payslipData.netSalary;

    // Employee badge in header
    document.getElementById("employee-badge").style.display = "flex";
    document.getElementById("badge-emp-name").innerText = state.employeeName;

    // If payslip netSalary is populated, show mock payslip view
    if (state.payslipData.netSalary > 0) {
        displayMockPayslipFromData();
    } else {
        resetPayslipPreview();
        document.getElementById("ocr-status-badge").innerText = "ยังไม่มีการประมวลผล";
        document.getElementById("ocr-status-badge").className = "badge bg-info-light text-info";
    }

    // Update file name indicators to show history was loaded
    const tsLabel = document.getElementById("timesheet-file-name");
    if (tsLabel) tsLabel.innerText = state.language === 'th' ? "โหลดบันทึกเวลางานจากรายงานส่งตรวจแล้ว" : "Work log loaded from submitted report";
    
    const psLabel = document.getElementById("payslip-file-name");
    if (psLabel) psLabel.innerText = state.language === 'th' ? "โหลดสลิปเงินเดือนจากรายงานส่งตรวจแล้ว" : "Payslip loaded from submitted report";

    recalculateAndRender();
    
    const isAuditor = state.currentUser && state.currentUser.role === 'auditor';
    if (isAuditor) {
        alert(`📂 โหลดรายงานส่งตรวจสอบของพนักงาน "${state.employeeName}" รอบเดือน "${state.month}" เรียบร้อยแล้ว!\n\nคุณสามารถคลิกแถบเมนูด้านซ้ายเพื่อตรวจสอบข้อมูลของพนักงานได้ทันที:\n1. 🏠 แดชบอร์ดสรุปผล: เพื่อดูรายงานเปรียบเทียบเชิงลึกและค่าส่วนต่าง\n2. ⚙️ ตั้งค่าการคำนวณ: เพื่อตรวจสอบพารามิเตอร์ที่พนักงานตั้งค่าไว้ (เช่น วันเริ่มงาน, รูปแบบกะ, อัตราค่าจ้าง)\n3. 📅 ตารางเวลางาน: เพื่อตรวจสอบตารางบันทึกเวลาทำงานรายวันของพนักงาน\n4. 💵 อัปโหลดและตรวจสอบ: เพื่อตรวจสอบภาพรวมของสลิปเงินเดือนที่สแกนเข้าระบบ`);
    } else {
        alert(`โหลดประวัติการตรวจสอบของ "${state.employeeName}" รอบเดือน "${state.month}" เรียบร้อยแล้ว!`);
    }
}

function displayMockPayslipFromData() {
    const container = document.getElementById("payslip-mock-container");
    if (!container) return;
    container.innerHTML = "";
    
    const payslipDiv = document.createElement("div");
    payslipDiv.className = "demo-payslip-canvas p-4 border rounded text-left bg-white text-dark font-sans shadow-lg";
    payslipDiv.style.width = "100%";
    payslipDiv.style.maxWidth = "650px";
    payslipDiv.style.fontFamily = "Prompt, sans-serif";
    payslipDiv.style.fontSize = "0.85rem";
    payslipDiv.style.color = "#333";
    payslipDiv.style.borderTop = "8px solid #6366f1";
    
    const [year, month] = state.month.split("-");
    const monthThai = getThaiMonthName(month) + " " + (parseInt(year) + 543);

    payslipDiv.innerHTML = `
        <div class="text-center font-bold border-bottom pb-2 mb-3">
            <h4 style="margin:0; font-size:1.15rem; color:#6366f1;">บริษัท ตัวอย่าง จำกัด (มหาชน)</h4>
            <span style="font-size:0.75rem; color:#666;">สลิปใบเสร็จรับเงินเดือนประจำเดือน ${monthThai}</span>
        </div>
        <div class="row mb-3" style="display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap;">
            <div><strong>รหัสพนักงาน:</strong> ${state.employeeNo || ('EMP-' + (state.employeeName.hashCode ? Math.abs(state.employeeName.hashCode()) % 1000 : '99'))}</div>
            <div><strong>ชื่อ:</strong> ${state.employeeName}</div>
        </div>
        
        <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
            <!-- Left Side: Earnings -->
            <div style="flex: 1; min-width: 280px; display: flex; flex-direction: column;">
                <table style="width:100%; border-collapse:collapse; flex-grow: 1;" border="1" cellpadding="6" bordercolor="#eee">
                    <thead>
                        <tr bgcolor="#f9f9f9">
                            <th align="left">รายได้ (Earnings)</th>
                            <th align="right">จำนวนเงิน (บาท)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>เงินเดือนพื้นฐาน (Salary)</td>
                            <td align="right">${state.payslipData.baseSalary.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>เบี้ยขยันคงที่ (Diligent Allowance)</td>
                            <td align="right">${state.payslipData.diligent.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>เบี้ยเลี้ยงทำงานกะดึก (Night Shift Allowance)</td>
                            <td align="right">${state.payslipData.nightShift.toFixed(2)}</td>
                        </tr>
                        ${state.payslipData.extraWorkPay > 0 ? `
                        <tr>
                            <td>บวกเพิ่มวันทำงานไม่เต็มเดือน</td>
                            <td align="right">${state.payslipData.extraWorkPay.toFixed(2)}</td>
                        </tr>` : ''}
                        <tr bgcolor="#f9f9f9" style="font-weight: bold; border-top: 2px solid #ddd;">
                            <td><strong>รวมรายได้พึงประเมิน</strong></td>
                            <td align="right"><strong>${(state.payslipData.baseSalary + state.payslipData.diligent + state.payslipData.nightShift + state.payslipData.extraWorkPay).toFixed(2)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Right Side: Deductions -->
            <div style="flex: 1; min-width: 280px; display: flex; flex-direction: column;">
                <table style="width:100%; border-collapse:collapse; flex-grow: 1;" border="1" cellpadding="6" bordercolor="#eee">
                    <thead>
                        <tr bgcolor="#f9f9f9">
                            <th align="left">รายการหัก (Deductions)</th>
                            <th align="right">จำนวนเงิน (บาท)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>หัก Unpaid leave</td>
                            <td align="right">${state.payslipData.unpaidDeduct.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>New staff deposit (15%)</td>
                            <td align="right">${state.payslipData.probationDeduct.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Attendance Deduction (หักเข้างานสาย)</td>
                            <td align="right">${(state.payslipData.attendanceDeduct || 0).toFixed(2)}</td>
                        </tr>
                        <!-- Spacer row if extraWorkPay is loaded on the left to align tables -->
                        ${state.payslipData.extraWorkPay > 0 ? `
                        <tr style="visibility: hidden;">
                            <td>Spacer</td>
                            <td align="right">0.00</td>
                        </tr>` : ''}
                        <tr bgcolor="#f9f9f9" style="font-weight: bold; border-top: 2px solid #ddd;">
                            <td><strong>รวมรายการหัก</strong></td>
                            <td align="right"><strong>${(state.payslipData.unpaidDeduct + state.payslipData.probationDeduct + (state.payslipData.attendanceDeduct || 0)).toFixed(2)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Bottom Section -->
        <div class="border-top pt-3" style="display: flex; justify-content: space-between; align-items: flex-start; font-size:0.85rem;">
            <!-- Bottom Left: Transfer to (Total) -->
            <div style="display: flex; flex-direction: column; gap: 4px; border: 1px solid #10b981; border-radius: 6px; padding: 8px 12px; background-color: #f0fdf4; min-width: 200px;">
                <div style="font-weight: bold; color: #15803d; border-bottom: 1px solid #bbf7d0; padding-bottom: 2px; margin-bottom: 2px;">
                    โอนเข้าบัญชี (Transfer to)
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-weight: bold; color: #166534; font-size: 0.95rem;">
                    <span>Total:</span>
                    <span>${formatCurrency(state.payslipData.netSalary)}</span>
                </div>
            </div>
            
            <div style="text-align: right; font-size: 0.75rem; color: #666; padding-top: 10px;">
                <strong>แผนกบัญชีและการเงิน</strong><br>
                <span style="font-size: 0.65rem; color: #999;">อนุมัติจ่ายทางอิเล็กทรอนิกส์</span>
            </div>
        </div>
    `;
    container.appendChild(payslipDiv);
    
    // Automatically display the toggle buttons
    const toggleGroup = document.getElementById("payslip-view-toggle-group");
    if (toggleGroup) {
        toggleGroup.style.display = "flex";
    }
    
    // Auto switch to show mock payslip
    const btnShowMock = document.getElementById("btn-show-payslip-mock");
    if (btnShowMock) {
        btnShowMock.click();
    }
    
    document.getElementById("ocr-status-badge").innerText = "จำลองข้อมูลสำเร็จ";
    document.getElementById("ocr-status-badge").className = "badge bg-success-light text-success";
}

// simple hashing helper for fake IDs
String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function deleteFromHistory(id) {
    if (!confirm("คุณต้องการลบรายการตรวจสอบนี้ออกจากประวัติใช่หรือไม่?")) return;
    
    const key = getHistoryStorageKey();
    let history = JSON.parse(localStorage.getItem(key) || '[]');
    const record = history.find(item => item.id === id);
    let recordId = id;
    if (record) {
        recordId = `${record.employeeName.toLowerCase().trim()}-${record.month}`;
    }
    history = history.filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(history));
    deleteRecordFromCloudflare(recordId);
    
    renderHistoryList();
}

function clearAllHistory() {
    if (!confirm("คุณต้องการล้างประวัติการตรวจสอบทั้งหมดใช่หรือไม่? (การดำเนินการนี้ไม่สามารถย้อนกลับได้)")) return;
    localStorage.removeItem(getHistoryStorageKey());
    renderHistoryList();
}

// Global modal management helpers
function getRowItemName(key) {
    const lang = state.language || 'en';
    const names = {
        th: {
            base: "ฐานเงินเดือน (Salary)",
            probation: "New staff deposit (หักเงินประกันพนักงานใหม่)",
            extra: "บวกเงินทำงานไม่เต็มเดือน (Extra Days)",
            unpaid: "Unpaid leave (หักลางาน/ขาดงานเกินสิทธิ์)",
            attendance: "Attendance Deduction (หักเข้างานสาย)",
            diligent: "เบี้ยขยันคงที่ (Diligent)",
            night: "เบี้ยเลี้ยงกะดึก (Night Shift)",
            net: "ยอดรับสุทธิ (Net Total)"
        },
        en: {
            base: "Base Salary",
            probation: "New staff deposit (15% probation)",
            extra: "Mid-month Additions (Extra Days)",
            unpaid: "Unpaid leave (Absent/excess leaves)",
            attendance: "Attendance Deduction (Lates/incomplete)",
            diligent: "Diligent Allowance",
            night: "Night Shift Allowance",
            net: "Net Salary"
        },
        zh: {
            base: "基本薪資 (Salary)",
            probation: "新員工保證金 (New staff deposit)",
            extra: "月中入職加薪 (Extra Days)",
            unpaid: "事假扣款 (Unpaid leave)",
            attendance: "考勤扣款 (Attendance Deduction)",
            diligent: "固定全勤獎金 (Diligent)",
            night: "夜班津貼 (Night Shift)",
            net: "實發金額 (Net Salary)"
        }
    };
    return (names[lang] || names.en)[key] || key;
}

window.openAdjustModal = function(key, type) {
    const adj = state.adjustments[key] || { amount: 0, note: "" };
    if (!adj.note || adj.note.trim() === "") {
        alert(state.language === 'th' ? "กรุณาเพิ่มหมายเหตุในคอลัมน์หมายเหตุให้เรียบร้อยก่อน จึงจะทำการเพิ่มหรือลดยอดเงินได้" : "Please add a note in the note column first before adjusting the amount.");
        return;
    }
    window.activeAdjustKey = key;
    window.activeAdjustType = type;
    
    const itemName = getRowItemName(key);
    document.getElementById("adjust-modal-item-name").value = itemName;
    
    const adjustTypeLabel = type === 'add' ? 
        (state.language === 'th' ? "เพิ่มยอดเงิน (+)" : (state.language === 'zh' ? "增加金額 (+)" : "Add Amount (+)")) : 
        (state.language === 'th' ? "ลดยอดเงิน (-)" : (state.language === 'zh' ? "減少金額 (-)" : "Reduce Amount (-)"));
    document.getElementById("adjust-modal-type-name").value = adjustTypeLabel;
    
    const currentAmt = Math.abs(adj.amount || 0);
    document.getElementById("adjust-modal-amount").value = currentAmt > 0 ? currentAmt : "";
    
    document.getElementById("adjust-amount-modal").style.display = "flex";
};

window.clearAdjustment = function(key) {
    if (!state.adjustments[key]) {
        state.adjustments[key] = { amount: 0, note: "" };
    }
    state.adjustments[key].amount = 0;
    recalculateAndRender();
};

window.openNoteModal = function(key) {
    window.activeNoteKey = key;
    const adj = state.adjustments[key] || { amount: 0, note: "" };
    
    const itemName = getRowItemName(key);
    document.getElementById("note-modal-item-name").value = itemName;
    document.getElementById("note-modal-text").value = adj.note || "";
    
    document.getElementById("edit-note-modal").style.display = "flex";
};

window.clearNote = function(key) {
    if (!state.adjustments[key]) {
        state.adjustments[key] = { amount: 0, note: "" };
    }
    state.adjustments[key].note = "";
    state.adjustments[key].amount = 0; // Automatically clear adjustment when note is deleted
    recalculateAndRender();
};

function renderAdditionalHolidaysUI() {
    const container = document.getElementById("additional-holidays-container");
    if (!container) return;
    
    container.innerHTML = "";
    
    const lang = state.language || 'en';
    const badgeText = lang === 'th' ? "วันหยุดหักเงิน (Unpaid)" : (lang === 'zh' ? "無薪假 (Unpaid)" : "Unpaid Leave");
    
    // Additional holidays start at index 5
    const additionalHolidays = state.holidays.slice(5);
    additionalHolidays.forEach((holiday, relativeIndex) => {
        const index = 5 + relativeIndex;
        const row = document.createElement("div");
        row.className = "row mb-2 align-center additional-holiday-row";
        row.dataset.index = index;
        
        row.innerHTML = `
            <div class="col-7">
                <input type="date" class="form-control form-control-sm additional-holiday-date" value="${holiday.date || ''}">
            </div>
            <div class="col-5 flex-row align-center justify-between gap-2">
                <span class="badge bg-danger text-white py-1 px-2 text-center" style="font-size:0.75rem; flex-grow: 1;">${badgeText}</span>
                <button type="button" class="btn btn-outline-danger btn-xs btn-remove-additional-holiday" style="padding: 2px 6px;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        
        // Date input listener
        const dateInput = row.querySelector(".additional-holiday-date");
        dateInput.addEventListener("change", () => {
            state.holidays[index].date = dateInput.value;
            applyShiftTypeToLogs();
            recalculateAndRender();
        });
        
        // Remove button listener
        const removeBtn = row.querySelector(".btn-remove-additional-holiday");
        removeBtn.addEventListener("click", () => {
            state.holidays.splice(index, 1);
            // Re-render UI
            renderAdditionalHolidaysUI();
            applyShiftTypeToLogs();
            recalculateAndRender();
        });
        
        container.appendChild(row);
    });
}

// 11. Lock / Unlock / Visibility Helpers for Dashboard
function checkDashboardVisibility() {
    const hasTimesheet = state.attendanceLogs && state.attendanceLogs.some(log => log.isImported);
    const hasPayslip = state.payslipData && (state.payslipData.netSalary > 0 || state.payslipData.baseSalary > 0);
    const hasLoadedHistory = state.loadedHistoryId !== null;
    
    const showDashboard = hasTimesheet || hasPayslip || hasLoadedHistory;
    
    const placeholder = document.getElementById("dashboard-placeholder");
    const content = document.getElementById("dashboard-content-wrapper");
    
    if (placeholder && content) {
        if (showDashboard) {
            placeholder.style.display = "none";
            content.style.display = "block";
        } else {
            placeholder.style.display = "block";
            content.style.display = "none";
        }
    }
}

function setSettingsPanelDisabled(disabled) {
    const container = document.getElementById("tab-config");
    if (container) {
        const inputs = container.querySelectorAll("input, select, textarea, button");
        inputs.forEach(el => {
            el.disabled = disabled;
        });
    }
    const timesheetInput = document.getElementById("timesheet-file-input");
    const payslipInput = document.getElementById("payslip-file-input");
    if (timesheetInput) timesheetInput.disabled = disabled;
    if (payslipInput) payslipInput.disabled = disabled;
}

window.unlockLoadedReport = function() {
    const pw = prompt(state.language === 'th' ? "กรุณากรอกรหัสผ่านของคุณเพื่อปลดล็อกการแก้ไขรายงาน:" : "Please enter your passcode to unlock report editing:");
    if (pw === null) return;
    
    if (pw === 'admin' || (state.currentUser && pw === state.currentUser.password)) {
        state.isRecordLocked = false;
        
        // Update DOM lock indicators
        const banner = document.getElementById("lock-banner");
        if (banner) banner.style.display = "none";
        
        setSettingsPanelDisabled(false);
        
        const updateBtn = document.getElementById("update-report-btn");
        if (updateBtn) updateBtn.style.display = "inline-block";
        const unlockBtn = document.getElementById("unlock-report-btn");
        if (unlockBtn) unlockBtn.style.display = "none";
        
        applyShiftTypeToLogs();
        recalculateAndRender();
        
        alert(state.language === 'th' ? "🔓 ปลดล็อกรายงานสำเร็จแล้ว คุณสามารถแก้ไขข้อมูลและคำนวณใหม่ได้แล้วครับ" : "🔓 Report unlocked successfully. You can now modify the settings and recalculate.");
    } else {
        alert(state.language === 'th' ? "❌ รหัสผ่านไม่ถูกต้อง ไม่สามารถแก้ไขข้อมูลได้" : "❌ Incorrect passcode. Cannot unlock report.");
    }
};

function renderAdminAuditPanel() {
    const tbody = document.getElementById("admin-audit-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const list = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("salary_verification_history_emp_")) {
            try {
                const records = JSON.parse(localStorage.getItem(key) || '[]');
                if (Array.isArray(records)) {
                    records.forEach(rec => {
                        list.push({
                            storageKey: key,
                            ...rec
                        });
                    });
                }
            } catch (e) {
                console.error("Failed to parse history key:", key, e);
            }
        }
    }

    // Sort by timestamp descending
    list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-4 text-muted">
                    <i class="fa-solid fa-folder-open mb-2" style="font-size: 2rem; opacity: 0.5;"></i><br>
                    ยังไม่มีข้อมูลรายงานผลการตรวจสอบพนักงานส่งเข้ามา
                </td>
            </tr>
        `;
        return;
    }

    list.forEach((rec, idx) => {
        const calc = rec.calcResults || { netSalary: 0 };
        const payslipNet = rec.payslipData ? rec.payslipData.netSalary : 0;
        const diff = payslipNet > 0 ? (payslipNet - calc.netSalary) : 0;
        const isMatch = Math.abs(diff) < 0.01;

        const statusHTML = isMatch ? 
            `<span class="badge bg-success-light text-success"><i class="fa-solid fa-check"></i> ตรงกัน (Match)</span>` : 
            `<span class="badge bg-danger-light text-danger"><i class="fa-solid fa-triangle-exclamation"></i> ไม่ตรงกัน (Mismatch)</span>`;

        const tr = document.createElement("tr");
        
        // Row background colors and left border based on disputeStatus
        if (rec.disputeStatus === 'resolved') {
            tr.setAttribute("style", "background-color: rgba(25, 135, 84, 0.04); border-left: 4px solid var(--success-color);");
        } else if (rec.disputeStatus === 'pending_hr') {
            tr.setAttribute("style", "background-color: rgba(253, 126, 20, 0.06); border-left: 4px solid #fd7e14;");
        } else {
            tr.setAttribute("style", "background-color: rgba(220, 53, 69, 0.04); border-left: 4px solid var(--danger-color);");
        }

        const authorPass = rec.authorPasscode || "00ff";
        
        // Format timestamp
        let dateStr = "ไม่มีวันที่";
        if (rec.timestamp) {
            try {
                dateStr = new Date(rec.timestamp).toLocaleString(state.language === 'th' ? 'th-TH' : 'en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } catch (e) {
                console.error(e);
            }
        }
        const auditor = rec.authorName || "Guest";

        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td class="text-left" style="font-size: 0.8rem; line-height: 1.4;">
                <span class="d-block font-bold"><i class="fa-solid fa-calendar text-muted"></i> ${dateStr}</span>
                <span class="d-block text-muted text-xs"><i class="fa-solid fa-user-circle"></i> โดย: ${auditor}</span>
            </td>
            <td class="text-left font-semibold">${rec.employeeName}</td>
            <td>${rec.month}</td>
            <td><code style="font-size: 0.95rem; font-weight: bold; color: var(--danger-color);">${authorPass}</code></td>
            <td>${formatCurrency(calc.netSalary)}</td>
            <td>${formatCurrency(payslipNet)}</td>
            <td>${statusHTML}</td>
            <td class="text-left">
                <div class="mb-2">
                    <textarea class="form-control form-control-sm admin-comment-input" style="width: 100%; min-height: 50px; font-size: 0.8rem; resize: vertical;" placeholder="กรอกข้อความแจ้งความผิดพลาดหรือคอมเม้นท์...">${rec.adminComment || ""}</textarea>
                </div>
                <div class="flex-column gap-1.5">
                    <div class="flex-row gap-1 justify-between mb-2">
                        <button class="btn btn-success btn-xs" onclick="saveAdminComment('${rec.storageKey}', '${rec.id}', this)">
                            <i class="fa-solid fa-save"></i> บันทึกคอมเม้นท์
                        </button>
                        <div class="flex-row gap-1">
                            <button class="btn btn-primary btn-xs" onclick="adminLoadRecord('${rec.id}')">
                                <i class="fa-solid fa-folder-open"></i> เปิดดู
                            </button>
                            <button class="btn btn-danger btn-xs" onclick="adminDeleteRecord('${rec.storageKey}', '${rec.id}')">
                                <i class="fa-solid fa-trash"></i> ลบ
                            </button>
                        </div>
                    </div>
                    <!-- Audit Status Selector -->
                    <div class="flex-column gap-1 p-1.5 text-left" style="background-color: var(--card-bg); border: 1px solid var(--border-color); border-radius: 6px; box-shadow: var(--shadow-sm);">
                        <label class="text-xs mb-1 font-bold text-muted d-block" style="font-size: 0.7rem;">สถานะการตรวจสอบ:</label>
                        <select class="form-control form-control-sm admin-dispute-status-select" onchange="window.updateAdminDisputeStatus('${rec.storageKey}', '${rec.id}', this.value)" style="font-size: 0.75rem; font-weight: bold; cursor: pointer;">
                            <option value="pending" ${rec.disputeStatus === 'pending' || !rec.disputeStatus || rec.disputeStatus === 'none' ? 'selected' : ''}>รอดำเนินการ (Pending Review)</option>
                            <option value="resolved" ${rec.disputeStatus === 'resolved' ? 'selected' : ''}>ตรวจสอบสำเร็จ (Audit Completed) ✓</option>
                            <option value="pending_hr" ${rec.disputeStatus === 'pending_hr' ? 'selected' : ''}>รอดำเนินการแก้ไข (Pending Resolution)</option>
                        </select>
                    </div>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.updateAdminDisputeStatus = function(storageKey, recordId, newStatus) {
    try {
        const records = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const idx = records.findIndex(rec => rec.id === recordId);
        if (idx !== -1) {
            records[idx].disputeStatus = newStatus;
            records[idx].adminChecked = (newStatus === 'resolved');
            localStorage.setItem(storageKey, JSON.stringify(records));
            saveRecordToCloudflare(records[idx]);
            
            // Sync with current state if loaded
            if (state.loadedHistoryId === recordId) {
                state.disputeStatus = newStatus;
                recalculateAndRender();
            }
            
            renderAdminAuditPanel();
            alert(state.language === 'th' ? "อัปเดตสถานะการตรวจสอบเรียบร้อยแล้ว!" : "Audit status updated successfully!");
        }
    } catch (e) {
        console.error(e);
        alert("เกิดข้อผิดพลาดในการเปลี่ยนสถานะการตรวจสอบ");
    }
};

window.saveAdminComment = function(storageKey, recordId, btnEl) {
    const row = btnEl.closest("tr");
    const commentInput = row.querySelector(".admin-comment-input");
    const commentText = commentInput ? commentInput.value.trim() : "";

    try {
        const records = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const idx = records.findIndex(rec => rec.id === recordId);
        if (idx !== -1) {
            records[idx].adminComment = commentText;
            localStorage.setItem(storageKey, JSON.stringify(records));
            saveRecordToCloudflare(records[idx]);
            alert("บันทึกความคิดเห็นของผู้ดูแลระบบ (Admin Comment) เรียบร้อยแล้วครับ!");
        } else {
            alert("ไม่พบข้อมูลรายงานที่ต้องการอัปเดต");
        }
    } catch (e) {
        console.error(e);
        alert("เกิดข้อผิดพลาดในการบันทึกคอมเม้นท์");
    }
};

window.adminLoadRecord = function(recordId) {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("salary_verification_history_emp_")) {
            try {
                const records = JSON.parse(localStorage.getItem(key) || '[]');
                const found = records.find(rec => rec.id === recordId);
                if (found) {
                    loadFromHistory(recordId);
                    const dashboardTabBtn = document.querySelector(".nav-item[data-tab='dashboard']");
                    if (dashboardTabBtn) dashboardTabBtn.click();
                    return;
                }
            } catch (e) {
                console.error(e);
            }
        }
    }
    alert("ไม่พบรายงานที่เลือกในฐานข้อมูล");
};

window.adminDeleteRecord = function(storageKey, recordId) {
    if (!confirm(state.language === 'th' ? "คุณแน่ใจหรือไม่ว่าต้องการลบรายงานการตรวจสอบนี้อย่างถาวร?" : "Are you sure you want to delete this record permanently?")) {
        return;
    }

    try {
        let records = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const record = records.find(rec => rec.id === recordId);
        let cloudflareRecordId = recordId;
        if (record) {
            cloudflareRecordId = `${record.employeeName.toLowerCase().trim()}-${record.month}`;
        }
        records = records.filter(rec => rec.id !== recordId);
        if (records.length === 0) {
            localStorage.removeItem(storageKey);
        } else {
            localStorage.setItem(storageKey, JSON.stringify(records));
        }
        deleteRecordFromCloudflare(cloudflareRecordId);
        alert(state.language === 'th' ? "ลบข้อมูลสำเร็จ!" : "Record deleted successfully!");
        renderAdminAuditPanel();
    } catch (e) {
        console.error(e);
        alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
};

function getAttendanceMonth(payslipMonth) {
    if (!payslipMonth) return "";
    const [year, month] = payslipMonth.split("-").map(Number);
    const date = new Date(year, month - 2, 1);
    const prevYear = date.getFullYear();
    const prevMonth = String(date.getMonth() + 1).padStart(2, '0');
    return `${prevYear}-${prevMonth}`;
}

function getPayslipMonth(attendanceMonth) {
    if (!attendanceMonth) return "";
    const [year, month] = attendanceMonth.split("-").map(Number);
    const date = new Date(year, month, 1);
    const nextYear = date.getFullYear();
    const nextMonth = String(date.getMonth() + 1).padStart(2, '0');
    return `${nextYear}-${nextMonth}`;
}

function updateRoleUIVisibility() {
    const role = state.currentUser ? state.currentUser.role : sessionStorage.getItem('active_user_role') || 'employee';
    
    const adminTabBtn = document.getElementById("tab-btn-admin-audit");
    const employeeResultsTabBtn = document.getElementById("tab-btn-employee-results");
    const testsTabBtn = document.getElementById("tab-btn-tests");
    
    if (role === 'auditor') {
        if (adminTabBtn) adminTabBtn.style.display = "flex";
        if (testsTabBtn) testsTabBtn.style.display = "flex";
        if (employeeResultsTabBtn) employeeResultsTabBtn.style.display = "none";
    } else {
        if (adminTabBtn) adminTabBtn.style.display = "none";
        if (testsTabBtn) testsTabBtn.style.display = "none";
        if (employeeResultsTabBtn) employeeResultsTabBtn.style.display = "flex";
    }
}

function renderEmployeeResultsPanel() {
    const tbody = document.getElementById("employee-results-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const employeeName = state.employeeName || (state.currentUser ? state.currentUser.name : "");
    if (!employeeName || employeeName.trim() === "") {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4 text-muted">
                    กรุณากรอกชื่อพนักงานด้านซ้ายเพื่อดูผลการตรวจสอบ
                </td>
            </tr>
        `;
        return;
    }

    const key = `salary_verification_history_emp_${employeeName.toLowerCase().replace(/\s+/g, "_")}`;
    let records = [];
    try {
        records = JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
        console.error(e);
    }

    // Filter only checked records (adminChecked === true)
    const checkedRecords = records.filter(rec => rec.adminChecked === true);

    if (checkedRecords.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4 text-muted">
                    <i class="fa-solid fa-clipboard-question mb-2" style="font-size: 2rem; opacity: 0.5;"></i><br>
                    ยังไม่มีรายงานการตรวจสอบที่ตรวจเสร็จสิ้นโดยทีมตรวจสอบ
                </td>
            </tr>
        `;
        return;
    }

    // Sort by timestamp descending
    checkedRecords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    checkedRecords.forEach((rec, idx) => {
        const calc = rec.calcResults || { netSalary: 0 };
        const payslipNet = rec.payslipData ? rec.payslipData.netSalary : 0;
        const diff = payslipNet > 0 ? (payslipNet - calc.netSalary) : 0;
        const isMatch = Math.abs(diff) < 0.01;

        const statusHTML = isMatch ? 
            `<span class="badge bg-success-light text-success"><i class="fa-solid fa-check"></i> ตรงกัน (Match)</span>` : 
            `<span class="badge bg-danger-light text-danger"><i class="fa-solid fa-triangle-exclamation"></i> ไม่ตรงกัน (Mismatch)</span>`;

        let dateStr = "ไม่มีวันที่";
        if (rec.timestamp) {
            try {
                dateStr = new Date(rec.timestamp).toLocaleString(state.language === 'th' ? 'th-TH' : 'en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } catch (e) {
                console.error(e);
            }
        }
        const auditor = rec.authorName || "Auditor";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td>${dateStr}</td>
            <td><i class="fa-solid fa-user-shield text-xs mr-1 text-danger"></i> ${auditor}</td>
            <td class="font-semibold">${rec.month}</td>
            <td>${formatCurrency(calc.netSalary)}</td>
            <td>${formatCurrency(payslipNet)}</td>
            <td>${statusHTML}</td>
            <td class="text-left font-semibold" style="color: var(--text-main); font-size: 0.85rem; max-width: 250px; word-break: break-all;">
                ${rec.adminComment ? `<i class="fa-solid fa-comment-dots text-primary mr-1"></i> ${rec.adminComment}` : `<span class="text-muted italic">ไม่มีคอมเม้นท์เพิ่มเติม</span>`}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.deleteDisputeImage = function(index) {
    if (confirm(state.language === 'th' ? "คุณแน่ใจหรือไม่ที่จะลบรูปภาพหลักฐานนี้?" : "Are you sure you want to delete this dispute proof?")) {
        if (state.attendanceLogs[index]) {
            state.attendanceLogs[index].disputeImg = undefined;
            recalculateAndRender();
        }
    }
};

window.zoomDisputeImage = function(imgSrc, date) {
    const modal = document.getElementById("dispute-zoom-modal");
    const modalImg = document.getElementById("dispute-zoom-img");
    const title = document.getElementById("dispute-zoom-title");
    
    if (modal && modalImg) {
        modalImg.src = imgSrc;
        if (title) {
            title.innerText = state.language === 'th' ? `หลักฐานความผิดพลาดของระบบ วันที่ ${date}` : `System Error Dispute Proof for ${date}`;
        }
        modal.style.display = "flex";
    }
};

window.closeDisputeZoom = function() {
    const modal = document.getElementById("dispute-zoom-modal");
    if (modal) modal.style.display = "none";
};
