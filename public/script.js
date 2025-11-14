// 🔹 Supabase 연결
const SUPABASE_URL = "https://ajmlcukwdqzjzbnbxbqz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqbWxjdWt3ZHF6anpibmJ4YnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzQ3NTUsImV4cCI6MjA3ODcxMDc1NX0.4xF-B1p0Sk9Qvm6wQ7reFQc-qV4BxxWYVges44lI164";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let ws;

// 🔹 회원가입
async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  document.getElementById("authMsg").innerText = error ? error.message : "회원가입 성공!";
}

// 🔹 로그인
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    document.getElementById("authMsg").innerText = error.message;
  } else {
    document.getElementById("auth").style.display = "none";
    document.getElementById("app").style.display = "block";
    initWebSocket();
  }
}

// 🔹 WebSocket 초기화
function initWebSocket() {
  const protocol = location.protocol === "https:" ? "wss" : "ws";
  ws = new WebSocket(`${protocol}://${location.host}`);

  ws.onmessage = (event) => {
    const messages = document.getElementById("messages");
    messages.innerHTML += `<div>${event.data}</div>`;
    messages.scrollTop = messages.scrollHeight;
  };

  ws.onclose = () => {
    const messages = document.getElementById("messages");
    messages.innerHTML += `<div>서버와 연결이 끊겼습니다.</div>`;
  };
}

// 🔹 메모 전송
function sendMemo() {
  const memo = document.getElementById("memo").value;
  if (memo && ws) ws.send(memo);
  document.getElementById("memo").value = "";
}


