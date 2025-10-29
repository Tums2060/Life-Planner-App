// 🌿 Life Planner - Complete Version (Multiuser + Dashboard)

const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

function saveUserData(username, data) {
  localStorage.setItem(`lifePlanner_${username}`, JSON.stringify(data));
}

function loadUserData(username) {
  return JSON.parse(localStorage.getItem(`lifePlanner_${username}`)) || {
    timetable: [],
    goals: [],
    habits: [],
    reminders: []
  };
}

function saveUsers(users) {
  localStorage.setItem("lifePlanner_users", JSON.stringify(users));
}

function loadUsers() {
  return JSON.parse(localStorage.getItem("lifePlanner_users")) || {};
}

// ---------------- AUTH ----------------

function renderLogin() {
  $("#authArea").innerHTML = `
    <div class="card">
      <h2>🌿 Life Planner Login</h2>
      <input id="loginUser" type="text" placeholder="Enter your name" />
      <input id="loginPass" type="password" placeholder="Password" />
      <button class="btn" id="loginBtn">Login</button>
      <p class="small-muted">No account? <a id="goRegister" href="#">Register</a></p>
    </div>
  `;
  $("#goRegister").onclick = renderRegister;
  $("#loginBtn").onclick = handleLogin;
}

function renderRegister() {
  $("#authArea").innerHTML = `
    <div class="card">
      <h2>🪴 Create Account</h2>
      <input id="regUser" type="text" placeholder="Your name" />
      <input id="regPass" type="password" placeholder="Choose a password" />
      <button class="btn" id="registerBtn">Register</button>
      <p class="small-muted">Already have an account? <a id="goLogin" href="#">Login</a></p>
    </div>
  `;
  $("#goLogin").onclick = renderLogin;
  $("#registerBtn").onclick = handleRegister;
}

function handleLogin() {
  const username = $("#loginUser").value.trim();
  const password = $("#loginPass").value.trim();
  const users = loadUsers();

  if (!username || !password) {
    alert("Please fill in all fields.");
    return;
  }

  if (!users[username]) {
    alert("User not found! Please register.");
    return;
  }

  if (users[username].password !== password) {
    alert("Incorrect password!");
    return;
  }

  localStorage.setItem("lifePlanner_activeUser", username);
  loadDashboard(username);
}

function handleRegister() {
  const username = $("#regUser").value.trim();
  const password = $("#regPass").value.trim();
  const users = loadUsers();

  if (!username || !password) {
    alert("Please fill in all fields.");
    return;
  }

  if (users[username]) {
    alert("User already exists!");
    return;
  }

  users[username] = { password };
  saveUsers(users);
  saveUserData(username, { timetable: [], goals: [], habits: [], reminders: [] });
  alert("Registration successful! Please log in.");
  renderLogin();
}

// ---------------- DASHBOARD ----------------

function loadDashboard(username) {
  $("#authArea").classList.add("hidden");
  $("#topNav").classList.remove("hidden");
  $("#sidebar").classList.remove("hidden");

  $("#profileName").textContent = username;
  $("#greetingTitle").textContent = "👋 Hi " + username + ", Welcome to your Life Planner!";

  renderPage("dashboard", username);
  $$("button[data-page]").forEach(btn => {
    btn.onclick = () => renderPage(btn.dataset.page, username);
  });
}

function renderPage(page, username) {
  const content = $("#content");
  const data = loadUserData(username);

  if (page === "dashboard") {
    content.innerHTML = `
      <h2>🌿 Dashboard</h2>
      <div class="card">Welcome back, <b>${username}</b>! <br>Let's stay consistent and achieve your goals today!</div>
    `;
  }

  if (page === "timetable") {
    content.innerHTML = `
      <h2>📅 Timetable</h2>
      <input id="tEvent" placeholder="Add class or event..." />
      <button class="btn" id="addEvent">Add</button>
      <div id="eventList" class="card"></div>
    `;
    const eventList = $("#eventList");
    function render() {
      eventList.innerHTML = data.timetable
        .map((e, i) => `<p>🕓 ${e} <button onclick="removeEvent(${i}, '${username}')">❌</button></p>`)
        .join("");
    }
    render();
    $("#addEvent").onclick = () => {
      const val = $("#tEvent").value.trim();
      if (val) {
        data.timetable.push(val);
        saveUserData(username, data);
        $("#tEvent").value = "";
        render();
      }
    };
  }

  if (page === "goals") {
    content.innerHTML = `
      <h2>🎯 Goals</h2>
      <input id="gGoal" placeholder="Add new goal..." />
      <button class="btn" id="addGoal">Add</button>
      <div id="goalList" class="card"></div>
    `;
    const goalList = $("#goalList");
    function render() {
      goalList.innerHTML = data.goals
        .map((g, i) => `<p>⭐ ${g} <button onclick="removeGoal(${i}, '${username}')">❌</button></p>`)
        .join("");
    }
    render();
    $("#addGoal").onclick = () => {
      const val = $("#gGoal").value.trim();
      if (val) {
        data.goals.push(val);
        saveUserData(username, data);
        $("#gGoal").value = "";
        render();
      }
    };
  }

  if (page === "habits") {
    content.innerHTML = `
      <h2>💪 Habits</h2>
      <input id="hHabit" placeholder="Add new habit..." />
      <button class="btn" id="addHabit">Add</button>
      <div id="habitList" class="card"></div>
    `;
    const habitList = $("#habitList");
    function render() {
      habitList.innerHTML = data.habits
        .map((h, i) => `<p>🔥 ${h} <button onclick="removeHabit(${i}, '${username}')">❌</button></p>`)
        .join("");
    }
    render();
    $("#addHabit").onclick = () => {
      const val = $("#hHabit").value.trim();
      if (val) {
        data.habits.push(val);
        saveUserData(username, data);
        $("#hHabit").value = "";
        render();
      }
    };
  }

  if (page === "reminders") {
    content.innerHTML = `
      <h2>⏰ Reminders</h2>
      <input id="rReminder" placeholder="Add new reminder..." />
      <button class="btn" id="addReminder">Add</button>
      <div id="reminderList" class="card"></div>
    `;
    const reminderList = $("#reminderList");
    function render() {
      reminderList.innerHTML = data.reminders
        .map((r, i) => `<p>🔔 ${r} <button onclick="removeReminder(${i}, '${username}')">❌</button></p>`)
        .join("");
    }
    render();
    $("#addReminder").onclick = () => {
      const val = $("#rReminder").value.trim();
      if (val) {
        data.reminders.push(val);
        saveUserData(username, data);
        $("#rReminder").value = "";
        render();
      }
    };
  }

  $$("button[data-page]").forEach(btn =>
    btn.classList.toggle("active", btn.dataset.page === page)
  );
}

// -------- Remove item functions --------

function removeEvent(i, u) {
  const d = loadUserData(u);
  d.timetable.splice(i, 1);
  saveUserData(u, d);
  renderPage("timetable", u);
}

function removeGoal(i, u) {
  const d = loadUserData(u);
  d.goals.splice(i, 1);
  saveUserData(u, d);
  renderPage("goals", u);
}

function removeHabit(i, u) {
  const d = loadUserData(u);
  d.habits.splice(i, 1);
  saveUserData(u, d);
  renderPage("habits", u);
}

function removeReminder(i, u) {
  const d = loadUserData(u);
  d.reminders.splice(i, 1);
  saveUserData(u, d);
  renderPage("reminders", u);
}

// -------- App start --------
renderLogin();
