/*
  LibrarySystem Admin Web Version
  - Same static web style as the user-side app
  - Uses localStorage as a temporary frontend database
  - Provides admin login, book management, user management, record management, and database tools
*/

const STORAGE_KEY = "library-system-state-v1";

const fallbackSeedState = {
  users: [
    { userId: "S001", name: "Tom", password: "1234", role: "NORMAL", status: "ACTIVE" },
    { userId: "S002", name: "Amy", password: "1234", role: "VIP", status: "ACTIVE" }
  ],
  books: [
    { bookId: 1, title: "Clean Code", isbn: "1000000001", author: "Robert C. Martin", subject: "Programming", publisher: "Prentice Hall", status: "AVAILABLE" },
    { bookId: 2, title: "Coding Online", isbn: "1000000002", author: "Clive Gifford", subject: "Programming", publisher: "Windmill Books", status: "AVAILABLE" },
    { bookId: 3, title: "Database System Concepts", isbn: "1000000003", author: "Silberschatz", subject: "Database", publisher: "McGraw-Hill", status: "BORROWED" },
    { bookId: 4, title: "Introduction to Algorithms", isbn: "1000000004", author: "CLRS", subject: "Algorithms", publisher: "MIT Press", status: "AVAILABLE" }
  ],
  records: [
    { recordId: 1, userId: "S002", bookId: 3, borrowDate: daysFromToday(-10), dueDate: daysFromToday(-3), returnDate: null, status: "OVERDUE" },
    { recordId: 2, userId: "S001", bookId: 2, borrowDate: "2026-04-20", dueDate: "2026-04-27", returnDate: "2026-04-25", status: "RETURNED" }
  ],
  nextRecordId: 3,
  currentUserId: null,
  lastSearchField: "書名",
  lastSearchKeyword: ""
};

function daysFromToday(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return formatDate(d);
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function todayStr() { return formatDate(new Date()); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  let data;

  if (!raw) {
    data = clone(fallbackSeedState);
  } else {
    try { data = JSON.parse(raw); }
    catch { data = clone(fallbackSeedState); }
  }

  normalizeDatabase(data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function normalizeDatabase(data) {
  data.users ||= [];
  data.books ||= [];
  data.records ||= [];
  data.admins ||= [
    { adminId: "A001", name: "Admin", password: "admin123", role: "ADMIN", status: "ACTIVE" }
  ];
  data.currentUserId = null;
  data.currentAdminId ||= null;
  data.nextBookId ||= Math.max(0, ...data.books.map(book => Number(book.bookId) || 0)) + 1;
  data.nextRecordId ||= Math.max(0, ...data.records.map(record => Number(record.recordId) || 0)) + 1;
}

let state = loadState();
const app = document.getElementById("app");

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function currentAdmin() {
  return state.admins.find(admin => admin.adminId === state.currentAdminId) || null;
}

function findBook(bookId) {
  return state.books.find(book => Number(book.bookId) === Number(bookId)) || null;
}

function findUser(userId) {
  return state.users.find(user => user.userId === userId) || null;
}

function updateOverdue() {
  const today = todayStr();
  state.records.forEach(record => {
    if (!record.returnDate && record.dueDate < today) {
      record.status = "OVERDUE";
    }
  });
  saveState();
}

function statusLabel(status) {
  return {
    AVAILABLE: "可外借",
    BORROWED: "借閱中",
    REMOVED: "已下架",
    BORROWING: "借閱中",
    OVERDUE: "逾期",
    RETURNED: "已歸還",
    ACTIVE: "啟用",
    SUSPENDED: "停權",
    NORMAL: "一般",
    VIP: "VIP",
    ADMIN: "管理者"
  }[status] || status;
}

function statusClass(status) {
  return {
    AVAILABLE: "available",
    BORROWED: "borrowed",
    REMOVED: "removed",
    BORROWING: "borrowing",
    OVERDUE: "overdue",
    RETURNED: "returned",
    ACTIVE: "available",
    SUSPENDED: "removed",
    VIP: "borrowing",
    ADMIN: "borrowing"
  }[status] || "";
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
function escapeAttr(str) { return escapeHtml(str); }

function topbar(showHome = true, showLogout = false) {
  const admin = currentAdmin();
  return `
    <div class="topbar">
      <div class="topbar-left">
        ${showHome ? `<button class="btn" data-action="admin-home">回後台首頁</button>` : `<button class="btn" data-action="front-home">回前台</button>`}
      </div>
      <div class="topbar-right">
        ${admin ? `<span>管理者：${escapeHtml(admin.name)}</span>` : ``}
        ${showLogout ? `<button class="btn" data-action="admin-logout">登出</button>` : ``}
      </div>
    </div>
  `;
}

function layout({ title, body, showHome = true, showLogout = false, message = "" }) {
  return `
    <div class="page">
      ${topbar(showHome, showLogout)}
      ${message ? `<div class="message">${message}</div>` : ``}
      <div class="page-body">
        ${title ? `<h1 class="page-title">${title}</h1>` : ``}
        ${body}
      </div>
    </div>
  `;
}

function renderAdminLogin(message = "") {
  app.innerHTML = layout({
    showHome: false,
    title: "管理者登入",
    message,
    body: `
      <div class="card auth-card">
        <form id="adminLoginForm">
          <div class="form-row">
            <label>管理者帳號</label>
            <input class="input" name="adminId" required />
          </div>
          <div class="form-row">
            <label>密碼</label>
            <input class="input" name="password" type="password" required />
          </div>
          <div class="center-row">
            <button class="btn primary" type="submit">登入</button>
          </div>
          <p class="small-text" style="text-align:center">測試帳號：A001 / admin123</p>
        </form>
      </div>
    `
  });

  document.getElementById("adminLoginForm").onsubmit = event => {
    event.preventDefault();
    const fd = new FormData(event.target);
    const adminId = fd.get("adminId").toString().trim();
    const password = fd.get("password").toString().trim();
    const admin = state.admins.find(item =>
      item.adminId.toLowerCase() === adminId.toLowerCase() &&
      item.password === password &&
      item.status === "ACTIVE"
    );

    if (!admin) {
      renderAdminLogin("登入失敗：帳號不存在、密碼錯誤，或帳號未啟用。");
      return;
    }

    state.currentAdminId = admin.adminId;
    saveState();
    renderAdminHome();
  };
}

function renderAdminHome(message = "") {
  if (!currentAdmin()) { renderAdminLogin(); return; }
  updateOverdue();
  const activeUsers = state.users.filter(user => user.status === "ACTIVE").length;
  const availableBooks = state.books.filter(book => book.status === "AVAILABLE").length;
  const activeRecords = state.records.filter(record => record.status === "BORROWING" || record.status === "OVERDUE").length;
  const overdue = state.records.filter(record => record.status === "OVERDUE").length;

  app.innerHTML = layout({
    title: "管理者後台",
    showHome: false,
    showLogout: true,
    message,
    body: `
      <div class="stat-grid">
        <div class="card stat-card"><div>啟用使用者</div><div class="stat-number">${activeUsers}</div></div>
        <div class="card stat-card"><div>可借書籍</div><div class="stat-number">${availableBooks}</div></div>
        <div class="card stat-card"><div>借閱中紀錄</div><div class="stat-number">${activeRecords}</div></div>
        <div class="card stat-card"><div>逾期紀錄</div><div class="stat-number">${overdue}</div></div>
      </div>
      <div class="hero-grid">
        <button class="big-card-btn" data-action="admin-books">書籍管理</button>
        <button class="big-card-btn" data-action="admin-users">使用者管理</button>
        <button class="big-card-btn" data-action="admin-records">借還紀錄管理</button>
        <button class="big-card-btn" data-action="admin-database">資料庫管理</button>
      </div>
    `
  });
}

function adminBookResults() {
  const key = (state.lastAdminBookKeyword || "").trim().toLowerCase();
  if (!key) return [...state.books];
  return state.books.filter(book =>
    String(book.bookId).includes(key) ||
    book.title.toLowerCase().includes(key) ||
    book.author.toLowerCase().includes(key) ||
    book.subject.toLowerCase().includes(key) ||
    book.isbn.toLowerCase().includes(key)
  );
}

function renderAdminBooks(message = "") {
  if (!currentAdmin()) { renderAdminLogin(); return; }
  const books = adminBookResults();
  app.innerHTML = layout({
    title: "書籍管理",
    showLogout: true,
    message,
    body: `
      <div class="toolbar">
        <label>關鍵字</label>
        <input id="adminBookKeyword" class="input" style="width:280px" value="${escapeAttr(state.lastAdminBookKeyword || "")}" placeholder="書名、作者、主題、ISBN 或編號" />
        <button class="btn primary" data-action="admin-book-search">查詢</button>
        <button class="btn primary" data-action="admin-add-book">新增書籍</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>編號</th><th>書名</th><th>作者</th><th>主題</th><th>ISBN</th><th>狀態</th><th>操作</th></tr>
          </thead>
          <tbody>
            ${books.map(book => `
              <tr class="no-click">
                <td>${book.bookId}</td>
                <td>${escapeHtml(book.title)}</td>
                <td>${escapeHtml(book.author)}</td>
                <td>${escapeHtml(book.subject)}</td>
                <td>${escapeHtml(book.isbn)}</td>
                <td><span class="badge ${statusClass(book.status)}">${statusLabel(book.status)}</span></td>
                <td>
                  <div class="admin-actions">
                    ${book.status !== "REMOVED"
                      ? `<button class="btn" data-action="admin-remove-book" data-book-id="${book.bookId}">下架</button>`
                      : `<button class="btn" data-action="admin-restore-book" data-book-id="${book.bookId}">恢復</button>`}
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `
  });
}

function renderAdminUsers(message = "") {
  if (!currentAdmin()) { renderAdminLogin(); return; }
  app.innerHTML = layout({
    title: "使用者管理",
    showLogout: true,
    message,
    body: `
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>學號</th><th>姓名</th><th>權限</th><th>狀態</th><th>未歸還數</th><th>操作</th></tr>
          </thead>
          <tbody>
            ${state.users.map(user => {
              const activeCount = state.records.filter(record => record.userId === user.userId && (record.status === "BORROWING" || record.status === "OVERDUE")).length;
              return `
                <tr class="no-click">
                  <td>${escapeHtml(user.userId)}</td>
                  <td>${escapeHtml(user.name)}</td>
                  <td><span class="badge ${statusClass(user.role)}">${statusLabel(user.role)}</span></td>
                  <td><span class="badge ${statusClass(user.status)}">${statusLabel(user.status)}</span></td>
                  <td>${activeCount}</td>
                  <td>
                    <div class="admin-actions">
                      ${user.status === "ACTIVE"
                        ? `<button class="btn" data-action="admin-suspend-user" data-user-id="${escapeAttr(user.userId)}">停權</button>`
                        : `<button class="btn" data-action="admin-restore-user" data-user-id="${escapeAttr(user.userId)}">復權</button>`}
                    </div>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `
  });
}

function renderAdminRecords(message = "") {
  if (!currentAdmin()) { renderAdminLogin(); return; }
  updateOverdue();
  const filter = state.lastAdminRecordFilter || "全部";
  const records = state.records.filter(record => filter === "全部" || record.status === filter);

  app.innerHTML = layout({
    title: "借還紀錄管理",
    showLogout: true,
    message,
    body: `
      <div class="toolbar">
        <label>狀態篩選</label>
        <select id="adminRecordFilter" class="select" style="width:150px">
          ${["全部", "BORROWING", "OVERDUE", "RETURNED"].map(item => `<option value="${item}" ${item === filter ? "selected" : ""}>${item === "全部" ? "全部" : statusLabel(item)}</option>`).join("")}
        </select>
        <button class="btn primary" data-action="admin-record-filter">篩選</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>紀錄</th><th>學號</th><th>姓名</th><th>書名</th><th>借閱日</th><th>到期日</th><th>歸還日</th><th>狀態</th></tr>
          </thead>
          <tbody>
            ${records.map(record => {
              const user = findUser(record.userId);
              const book = findBook(record.bookId);
              return `
                <tr class="no-click">
                  <td>${record.recordId}</td>
                  <td>${escapeHtml(record.userId)}</td>
                  <td>${escapeHtml(user?.name || "-")}</td>
                  <td>${escapeHtml(book?.title || "-")}</td>
                  <td>${escapeHtml(record.borrowDate)}</td>
                  <td>${escapeHtml(record.dueDate)}</td>
                  <td>${escapeHtml(record.returnDate || "-")}</td>
                  <td><span class="badge ${statusClass(record.status)}">${statusLabel(record.status)}</span></td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `
  });
}

function renderDatabasePage(message = "") {
  if (!currentAdmin()) { renderAdminLogin(); return; }
  const size = new Blob([JSON.stringify(state)]).size;
  app.innerHTML = layout({
    title: "資料庫管理",
    showLogout: true,
    message,
    body: `
      <div class="card" style="padding:20px;margin-bottom:20px">
        <h2 style="margin-top:0">localStorage 暫存資料庫</h2>
        <p>目前靜態網頁版本使用瀏覽器 <strong>localStorage</strong> 當作暫時資料庫。</p>
        <p class="small-text">Storage Key：${escapeHtml(STORAGE_KEY)}</p>
        <p class="small-text">資料大小：約 ${size} bytes</p>
      </div>
      <div class="stat-grid">
        <div class="card stat-card"><div>管理者</div><div class="stat-number">${state.admins.length}</div></div>
        <div class="card stat-card"><div>使用者</div><div class="stat-number">${state.users.length}</div></div>
        <div class="card stat-card"><div>書籍</div><div class="stat-number">${state.books.length}</div></div>
        <div class="card stat-card"><div>借還紀錄</div><div class="stat-number">${state.records.length}</div></div>
      </div>
      <div class="action-row">
        <button class="btn primary" data-action="export-db">匯出資料庫 JSON</button>
        <button class="btn" data-action="reset-db">重設示範資料</button>
      </div>
    `
  });
}

function addBookByPrompt() {
  const title = prompt("請輸入書名");
  if (!title) return;
  const author = prompt("請輸入作者") || "";
  const subject = prompt("請輸入主題") || "";
  const isbn = prompt("請輸入 ISBN") || "";
  const publisher = prompt("請輸入出版社") || "";
  state.books.push({ bookId: state.nextBookId++, title, isbn, author, subject, publisher, status: "AVAILABLE" });
  saveState();
  renderAdminBooks("新增書籍成功。");
}

function exportDatabase() {
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "library-system-database.json";
  a.click();
  URL.revokeObjectURL(url);
}

document.addEventListener("click", event => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;

  if (action === "front-home") window.location.href = "index.html";
  else if (action === "admin-home") renderAdminHome();
  else if (action === "admin-logout") { state.currentAdminId = null; saveState(); renderAdminLogin("已登出。"); }
  else if (action === "admin-books") renderAdminBooks();
  else if (action === "admin-users") renderAdminUsers();
  else if (action === "admin-records") renderAdminRecords();
  else if (action === "admin-database") renderDatabasePage();
  else if (action === "admin-book-search") { state.lastAdminBookKeyword = document.getElementById("adminBookKeyword").value; saveState(); renderAdminBooks(); }
  else if (action === "admin-add-book") addBookByPrompt();
  else if (action === "admin-remove-book") {
    const book = findBook(target.dataset.bookId);
    if (book && confirm(`確定下架「${book.title}」嗎？`)) { book.status = "REMOVED"; saveState(); renderAdminBooks("書籍已下架。"); }
  }
  else if (action === "admin-restore-book") {
    const book = findBook(target.dataset.bookId);
    if (book) {
      const active = state.records.some(record => Number(record.bookId) === Number(book.bookId) && !record.returnDate);
      book.status = active ? "BORROWED" : "AVAILABLE";
      saveState();
      renderAdminBooks("書籍已恢復。");
    }
  }
  else if (action === "admin-suspend-user") {
    const user = findUser(target.dataset.userId);
    if (user && confirm(`確定停權 ${user.name} 嗎？`)) { user.status = "SUSPENDED"; saveState(); renderAdminUsers("使用者已停權。"); }
  }
  else if (action === "admin-restore-user") {
    const user = findUser(target.dataset.userId);
    if (user) { user.status = "ACTIVE"; saveState(); renderAdminUsers("使用者已復權。"); }
  }
  else if (action === "admin-record-filter") { state.lastAdminRecordFilter = document.getElementById("adminRecordFilter").value; saveState(); renderAdminRecords(); }
  else if (action === "export-db") exportDatabase();
  else if (action === "reset-db") {
    if (confirm("確定要重設所有示範資料嗎？")) {
      state = clone(fallbackSeedState);
      normalizeDatabase(state);
      state.currentAdminId = "A001";
      saveState();
      renderDatabasePage("資料庫已重設。");
    }
  }
});

currentAdmin() ? renderAdminHome() : renderAdminLogin();
