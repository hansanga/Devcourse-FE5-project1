// src/components/Document.js
import { getDocument } from "../api.js";

const getDocumentIdFromHash = () => {
  const hash = window.location.hash;
  const matches = hash.match(/\/documents\/(\d+)/);
  return matches ? matches[1] : null;
};

export default function Document({ $app, initialState, onSave }) {
  this.state = initialState;

  this.$target = document.createElement("div");
  this.$target.className = "editor";
  $app.appendChild(this.$target);

  const debounce = (callback, delay = 1000) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => callback(...args), delay);
    };
  };

  const saveDocument = debounce(() => {
    const title = this.$target.querySelector(".titleInput").value;
    const content = this.$target.querySelector(".contentInput").value;

    const updated = {
      id: this.state.id,
      title,
      content,
    };

    console.log("💾 저장 시도 중:", updated);
    
    onSave?.(updated);
  }, 1000);

  this.template = () => {
    return `
      <div class="header">
        <div class="pageTree">${this.state.title || ""}</div>
        <button class="pageDelete" aria-label="삭제 버튼"></button>
      </div>
      <div class="content">
        <input 
          class="titleInput" 
          placeholder="제목을 입력하세요" 
          value="${this.state.title || ""}" 
        />
        <textarea 
          class="contentInput" 
          placeholder="내용을 입력하세요...">${this.state.content || ""}</textarea>
      </div>
    `;
  };

  this.render = () => {
    this.$target.innerHTML = this.template();

    const $title = this.$target.querySelector(".titleInput");
    const $content = this.$target.querySelector(".contentInput");

    if ($title && $content) {
      $title.addEventListener("input", saveDocument);
      $content.addEventListener("input", saveDocument);
    }
  };

  this.setState = (newState) => {
    this.state = newState;
    this.render();
  };

  const loadDocument = async (id) => {
    if (!id) return;
    try {
      const doc = await getDocument(id);
      this.setState(doc);
    } catch (e) {
      console.error("문서 불러오기 실패", e);
    }
  };

  const init = () => {
    loadDocument(getDocumentIdFromHash());
    window.addEventListener("hashchange", () => {
      loadDocument(getDocumentIdFromHash());
    });
  };

  init();
}
