// src/api.js

const BASE_URL = "https://kdt-api.fe.dev-cos.com";
const USERNAME = "kyeong_rok";

export async function getDocuments() {
  const res = await fetch(`${BASE_URL}/documents`, {
    headers: {
      "x-username": USERNAME,
    },
  });
  if (!res.ok) throw new Error("문서 목록 불러오기 실패");
  return await res.json();
}

export async function getDocument(id) {
  const res = await fetch(`${BASE_URL}/documents/${id}`, {
    headers: {
      "x-username": USERNAME,
    },
  });
  if (!res.ok) throw new Error("문서 불러오기 실패");
  return await res.json();
}

export async function createDocument() {
  const res = await fetch(`${BASE_URL}/documents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-username": USERNAME,
    },
    body: JSON.stringify({
      title: "제목 없음",
      parent: null,
    }),
  });
  if (!res.ok) throw new Error("문서 생성 실패");
  return await res.json();
}

export async function updateDocument(id, data) {
  const res = await fetch(`${BASE_URL}/documents/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-username": USERNAME,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("문서 수정 실패");
  return await res.json();
}
