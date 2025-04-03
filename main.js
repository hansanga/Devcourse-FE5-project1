let documentId = window.location.pathname.split("/")[2];

// 잘못된 경로일 경우 기본 문서로 이동
if (!documentId || isNaN(documentId)) {
  documentId = "1";
  history.replaceState({}, "", `/documents/${documentId}`);
}

// debounce: 입력 후 일정 시간 후 저장
function debounce(callback, delay = 1000) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
}

// 문서 불러오기
async function loadDocument(id) {
  try {
    const res = await fetch(`https://kdt-api.fe.dev-cos.com/documents/${id}`, {
      headers: {
        "x-username": "kyeong_rok"
      }
    });

    if (!res.ok) throw new Error("문서 없음");

    const data = await res.json();
    document.querySelector("#document-title").value = data.title || "";
    document.querySelector("#document-content").value = data.content || "";
  } catch (e) {
    console.error("문서 불러오기 실패", e);
  }
}

// 문서 저장
const saveDocument = debounce(async () => {
  const title = document.querySelector("#document-title").value;
  const content = document.querySelector("#document-content").value;

  try {
    const res = await fetch(`https://kdt-api.fe.dev-cos.com/documents/${documentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-username": "kyeong_rok"
      },
      body: JSON.stringify({ title, content })
    });

    console.log("💾 저장 완료!");
  } catch (e) {
    console.error("저장 실패:", e);
  }
}, 1000);

// 새 문서 생성 후 이동
async function createDocument() {
  try {
    const res = await fetch("https://kdt-api.fe.dev-cos.com/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-username": "kyeong_rok"
      },
      body: JSON.stringify({
        title: "새 문서",
        parent: null
      })
    });

    const data = await res.json();
    const newId = data.id;

    history.pushState({}, "", `/documents/${newId}`);
    window.location.reload();
  } catch (e) {
    console.error("문서 생성 실패!", e);
  }
}

// 이벤트 연결
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#document-title").addEventListener("input", saveDocument);
  document.querySelector("#document-content").addEventListener("input", saveDocument);
  document.querySelector("#create-document-btn").addEventListener("click", createDocument);

  loadDocument(documentId);
});
