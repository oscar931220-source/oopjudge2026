
/*
  LibrarySystem Web Version

  This file handles:
  1. In-browser state management
  2. User-side page rendering
  3. Register / login / search / borrow / return functions
  4. Demo data for the current project stage

  Current scope:
  - user-side functions only
  - static web version
  - localStorage as temporary storage

*/

const STORAGE_KEY = "library-system-state-v1";

/* Demo data used before real backend integration */
const seedState = {
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
    {
      recordId: 1,
      userId: "S002",
      bookId: 3,
      borrowDate: daysFromToday(-10),
      dueDate: daysFromToday(-3),
      returnDate: null,
      status: "OVERDUE"
    },
    {
      recordId: 2,
      userId: "S001",
      bookId: 2,
      borrowDate: "2026-04-20",
      dueDate: "2026-04-27",
      returnDate: "2026-04-25",
      status: "RETURNED"
    }
  ],
  nextRecordId: 3,
  currentUserId: null,
  lastSearchField: "書名",
  lastSearchKeyword: ""
};

/** Returns a date string offset from today. */
function daysFromToday(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return formatDate(d);
}

/** Formats a Date object as YYYY-MM-DD. */
function formatDate(date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Returns today's date as a formatted string. */
function todayStr() {
  return formatDate(new Date());
}

/** Loads app state from localStorage or falls back to seed data. */
function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedState));
    return structuredClone(seedState);
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedState));
    return structuredClone(seedState);
  }
}

/** Saves the current app state to localStorage. */
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/** Ensure the app always starts in a logged-out state when the page is opened. */
let state = loadState();

state.currentUserId = null;
state.currentAdminId = null;
if (!state.admins) {
  state.admins = [
    { adminId: "A001", name: "Admin", password: "admin123", role: "ADMIN", status: "ACTIVE" }
  ];
}
saveState();

/** Returns the currently logged-in user object. */
function currentUser() {
  return state.users.find(user => user.userId === state.currentUserId) || null;
}

/** Finds one book by its book ID. */
function findBook(bookId) {
  return state.books.find(book => book.bookId === bookId) || null;
}

/** Updates overdue borrowing records based on today's date. */
function updateOverdue() {
  const today = todayStr();

  state.records.forEach(record => {
    if (!record.returnDate && record.dueDate < today) {
      record.status = "OVERDUE";
    }
  });

  saveState();
}

/** Converts an internal status value into a Chinese label. */
function statusLabel(status) {
  switch (status) {
    case "AVAILABLE":
      return "可外借";
    case "BORROWED":
      return "借閱中";
    case "REMOVED":
      return "已下架";
    case "BORROWING":
      return "借閱中";
    case "OVERDUE":
      return "逾期";
    case "RETURNED":
      return "已歸還";
    default:
      return status;
  }
}

/** Maps a status value to a CSS class name. */
function statusClass(status) {
  return {
    AVAILABLE: "available",
    BORROWED: "borrowed",
    REMOVED: "removed",
    BORROWING: "borrowing",
    OVERDUE: "overdue",
    RETURNED: "returned"
  }[status] || "";
}

/** Searches books by one selected field and keyword. */
function searchBooks(field, keyword) {
  const key = (keyword || "").trim().toLowerCase();

  if (!key) {
    return [...state.books];
  }

  return state.books.filter(book => {
    switch (field) {
      case "作者":
        return book.author.toLowerCase().includes(key);
      case "主題":
        return book.subject.toLowerCase().includes(key);
      case "ISBN":
        return book.isbn.toLowerCase().includes(key);
      default:
        return book.title.toLowerCase().includes(key);
    }
  });
}

/** Checks whether the borrowing days are valid for the user's role. */
function isDaysAllowed(role, days) {
  if (role === "VIP") {
    return [30, 60, 90].includes(days);
  }

  return [30, 60].includes(days);
}

/** Returns the shared top navigation bar HTML. */
function topbar(showBackHome = true, showLogout = false) {
  const user = currentUser();

  return `
    <div class="topbar">
      <div class="topbar-left">
        ${showBackHome ? `<button class="btn" data-action="home">回首頁</button>` : ``}
      </div>
      <div class="topbar-right">
        ${user ? `<span>目前登入者：${escapeHtml(user.name)}（${escapeHtml(user.role)}）</span>` : ``}
        ${showLogout ? `<button class="btn" data-action="logout">登出</button>` : ``}
      </div>
    </div>
  `;
}

/** Returns the shared page layout HTML. */
function layout({ title, body, showBackHome = true, showLogout = false, message = "" }) {
  return `
    <div class="page">
      ${topbar(showBackHome, showLogout)}
      ${message ? `<div class="message">${message}</div>` : ``}
      <div class="page-body">
        ${title ? `<h1 class="page-title">${title}</h1>` : ``}
        ${body}
      </div>
    </div>
  `;
}

/** Renders the landing page. */
function renderStartPage() {
  app.innerHTML = layout({
    title: "圖書館借還書系統",
    showBackHome: false,
    body: `
      <div class="hero-grid">
        <button class="big-card-btn" data-action="goto-auth">一般使用者</button>
        <button class="big-card-btn" data-action="goto-admin">管理者</button>
      </div>
    `
  });
}

/** Renders the register or login page. */
function renderAuthPage(mode = "register", message = "") {
  app.innerHTML = layout({
    showBackHome: true,
    title: "",
    message,
    body: `
      <div class="card auth-card">
        <div class="tab-row">
          <button class="tab-btn ${mode === "register" ? "active" : ""}" data-action="switch-auth" data-mode="register">使用者註冊</button>
          <button class="tab-btn ${mode === "login" ? "active" : ""}" data-action="switch-auth" data-mode="login">登入</button>
        </div>
        <form id="authForm">
          <div class="form-row">
            <label>學號</label>
            <input class="input" name="userId" required />
          </div>
          ${mode === "register" ? `
            <div class="form-row">
              <label>姓名</label>
              <input class="input" name="name" required />
            </div>
          ` : ``}
          <div class="form-row">
            <label>密碼</label>
            <input class="input" name="password" type="password" required />
          </div>
          ${mode === "register" ? `
            <div class="form-row">
              <label>權限</label>
              <div class="radio-row">
                <label><input type="radio" name="role" value="NORMAL" checked /> NORMAL</label>
                <label><input type="radio" name="role" value="VIP" /> VIP</label>
              </div>
            </div>
          ` : ``}
          <div class="center-row">
            <button class="btn primary" type="submit">${mode === "register" ? "註冊" : "登入"}</button>
          </div>
        </form>
      </div>
    `
  });

  document.getElementById("authForm").onsubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const userId = (formData.get("userId") || "").toString().trim();
    const password = (formData.get("password") || "").toString().trim();
    const name = (formData.get("name") || "").toString().trim();

    if (mode === "register") {
      const role = (formData.get("role") || "NORMAL").toString();

      if (state.users.some(user => user.userId.toLowerCase() === userId.toLowerCase())) {
        renderAuthPage("register", "該學號已存在。");
        return;
      }

      state.users.push({
        userId,
        name,
        password,
        role,
        status: "ACTIVE"
      });

      saveState();
      renderAuthPage("login", "註冊成功，請登入。");
      return;
    }

    const user = state.users.find(item =>
      item.userId.toLowerCase() === userId.toLowerCase() &&
      item.password === password &&
      item.status === "ACTIVE"
    );

    if (!user) {
      renderAuthPage("login", "登入失敗：帳號不存在、密碼錯誤，或帳號已被停權。");
      return;
    }

    state.currentUserId = user.userId;
    saveState();
    renderHomePage();
  };
}

/** Renders the user home page. */
function renderHomePage() {
  app.innerHTML = layout({
    title: "使用者首頁",
    showBackHome: true,
    showLogout: true,
    body: `
      <div class="hero-grid">
        <button class="big-card-btn" data-action="goto-search">館藏查詢</button>
        <button class="big-card-btn" data-action="goto-records">個人借閱紀錄</button>
      </div>
    `
  });
}

/** Renders the book search page. */
function renderSearchPage(field = state.lastSearchField, keyword = state.lastSearchKeyword) {
  state.lastSearchField = field;
  state.lastSearchKeyword = keyword;
  saveState();

  const books = searchBooks(field, keyword);

  app.innerHTML = layout({
    title: "館藏查詢",
    showBackHome: true,
    showLogout: true,
    body: `
      <div class="toolbar">
        <label>查詢欄位</label>
        <select id="searchField" class="select" style="width:140px">
          ${["書名", "作者", "主題", "ISBN"].map(item => `
            <option value="${item}" ${item === field ? "selected" : ""}>${item}</option>
          `).join("")}
        </select>
        <label>關鍵字</label>
        <input id="searchKeyword" class="input" style="width:260px" value="${escapeAttr(keyword)}" />
        <button class="btn primary" data-action="do-search">查詢</button>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>書名</th>
              <th>作者</th>
              <th>主題</th>
              <th>ISBN</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            ${books.map(book => `
              <tr data-action="open-book" data-book-id="${book.bookId}">
                <td>${escapeHtml(book.title)}</td>
                <td>${escapeHtml(book.author)}</td>
                <td>${escapeHtml(book.subject)}</td>
                <td>${escapeHtml(book.isbn)}</td>
                <td><span class="badge ${statusClass(book.status)}">${statusLabel(book.status)}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `
  });
}

/** Renders the detail page for one selected book. */
function renderBookDetailPage(bookId, message = "") {
  const book = findBook(bookId);

  if (!book) {
    renderSearchPage(state.lastSearchField, state.lastSearchKeyword);
    return;
  }

  const user = currentUser();
  const dayOptions = user?.role === "VIP" ? [30, 60, 90] : [30, 60];

  app.innerHTML = layout({
    title: "書本資訊 / 借書",
    showBackHome: true,
    showLogout: true,
    message,
    body: `
      <div class="card">
        <div class="info-grid">
          <div class="info-item"><strong>書名：</strong>${escapeHtml(book.title)}</div>
          <div class="info-item"><strong>ISBN：</strong>${escapeHtml(book.isbn)}</div>
          <div class="info-item"><strong>作者：</strong>${escapeHtml(book.author)}</div>
          <div class="info-item"><strong>主題：</strong>${escapeHtml(book.subject)}</div>
          <div class="info-item"><strong>出版者：</strong>${escapeHtml(book.publisher)}</div>
          <div class="info-item"><strong>狀態：</strong><span class="badge ${statusClass(book.status)}">${statusLabel(book.status)}</span></div>
        </div>
      </div>

      <div class="action-row">
        <button class="btn" data-action="back-search">回到館藏查詢</button>
        <button class="btn" data-action="view-history" data-book-id="${book.bookId}">查看書籍借閱紀錄</button>
      </div>

      <div class="card" style="padding: 18px 20px;">
        <div class="borrow-row">
          <label for="borrowDays"><strong>選擇借閱期限</strong></label>
          <select id="borrowDays" class="select" style="width:140px">
            ${dayOptions.map(day => `<option value="${day}">${day}</option>`).join("")}
          </select>
          <button class="btn primary" data-action="borrow-book" data-book-id="${book.bookId}" ${book.status !== "AVAILABLE" ? "disabled" : ""}>
            借書
          </button>
        </div>
      </div>
    `
  });
}

/** Renders the current user's borrowing record page. */
function renderRecordsPage(message = "") {
  updateOverdue();

  const user = currentUser();
  const records = state.records.filter(record => record.userId === user.userId);

  app.innerHTML = layout({
    title: "個人借閱紀錄",
    showBackHome: true,
    showLogout: true,
    message,
    body: `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>書名</th>
              <th>ISBN</th>
              <th>狀態</th>
              <th>借閱日</th>
              <th>歸還日</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${records.map(record => {
              const book = findBook(record.bookId);
              const active = record.status === "BORROWING" || record.status === "OVERDUE";

              return `
                <tr class="no-click">
                  <td>${escapeHtml(book?.title || "-")}</td>
                  <td>${escapeHtml(book?.isbn || "-")}</td>
                  <td><span class="badge ${statusClass(record.status)}">${statusLabel(record.status)}</span></td>
                  <td>${escapeHtml(record.borrowDate)}</td>
                  <td>${escapeHtml(record.returnDate || "-")}</td>
                  <td>${active ? `<button class="btn" data-action="return-book" data-book-id="${record.bookId}">還書</button>` : "-"}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `
  });
}

/** Handles borrowing one book for the current user. */
function borrowBook(bookId, days) {
  const user = currentUser();
  const book = findBook(bookId);

  if (!user || !book || book.status !== "AVAILABLE" || !isDaysAllowed(user.role, days)) {
    renderBookDetailPage(bookId, "借書失敗。");
    return;
  }

  const today = todayStr();

  state.records.push({
    recordId: state.nextRecordId++,
    userId: user.userId,
    bookId,
    borrowDate: today,
    dueDate: addDays(today, days),
    returnDate: null,
    status: "BORROWING"
  });

  book.status = "BORROWED";
  saveState();
  renderBookDetailPage(bookId, `借書成功。到期日：${addDays(today, days)}`);
}

/** Returns a new date string after adding a number of days. */
function addDays(dateStr, days) {
  const date = new Date(dateStr + "T00:00:00");
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

/** Handles returning one borrowed book for the current user. */
function returnBook(bookId) {
  const user = currentUser();

  const record = state.records.find(item =>
    item.bookId === bookId &&
    item.userId === user.userId &&
    (item.status === "BORROWING" || item.status === "OVERDUE")
  );

  if (!record) {
    renderRecordsPage("還書失敗。");
    return;
  }

  record.returnDate = todayStr();
  record.status = "RETURNED";

  const book = findBook(bookId);
  if (book) {
    book.status = "AVAILABLE";
  }

  saveState();
  renderRecordsPage("還書成功。");
}

/** Opens the borrowing history dialog for one book. */
function openHistory(bookId) {
  updateOverdue();

  const history = state.records.filter(record => record.bookId === bookId);
  const historyContent = document.getElementById("historyContent");

  historyContent.innerHTML = history.length
    ? history.map(record => `
        <div class="history-item">
          <div><strong>借閱者：</strong>${escapeHtml(record.userId)}</div>
          <div><strong>借閱日：</strong>${escapeHtml(record.borrowDate)}</div>
          <div><strong>到期日：</strong>${escapeHtml(record.dueDate)}</div>
          <div><strong>歸還日：</strong>${escapeHtml(record.returnDate || "-")}</div>
          <div><strong>狀態：</strong><span class="badge ${statusClass(record.status)}">${statusLabel(record.status)}</span></div>
        </div>
      `).join("")
    : `<div class="history-item">目前沒有借閱紀錄。</div>`;

  document.getElementById("historyDialog").showModal();
}

/** Escapes HTML special characters before rendering text. */
function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Escapes text before inserting it into an HTML attribute. */
function escapeAttr(str) {
  return escapeHtml(str);
}

const app = document.getElementById("app");

document.getElementById("closeHistoryBtn").onclick = () => {
  document.getElementById("historyDialog").close();
};

document.addEventListener("click", event => {
  const target = event.target.closest("[data-action]");
  if (!target) return;

  const action = target.dataset.action;

  if (action === "home") {
    currentUser() ? renderHomePage() : renderStartPage();
  } else if (action === "goto-auth") {
    renderAuthPage("register");
  } else if (action === "goto-admin") {
    window.location.href = "admin.html";
  } else if (action === "switch-auth") {
    renderAuthPage(target.dataset.mode);
  } else if (action === "logout") {
    state.currentUserId = null;
    saveState();
    renderAuthPage("login");
  } else if (action === "goto-search") {
    renderSearchPage();
  } else if (action === "goto-records") {
    renderRecordsPage();
  } else if (action === "do-search") {
    const field = document.getElementById("searchField").value;
    const keyword = document.getElementById("searchKeyword").value;
    renderSearchPage(field, keyword);
  } else if (action === "open-book") {
    renderBookDetailPage(Number(target.dataset.bookId));
  } else if (action === "back-search") {
    renderSearchPage(state.lastSearchField, state.lastSearchKeyword);
  } else if (action === "view-history") {
    openHistory(Number(target.dataset.bookId));
  } else if (action === "borrow-book") {
    const days = Number(document.getElementById("borrowDays").value);
    borrowBook(Number(target.dataset.bookId), days);
  } else if (action === "return-book") {
    returnBook(Number(target.dataset.bookId));
  }
});

renderStartPage();