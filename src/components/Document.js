// src/components/Document.js
import { getDocument, getDocuments, updateDocument } from "../api.js";

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
    const title = this.$target.querySelector(".titleInput")?.value;
    const content = this.$target.querySelector(".contentInput")?.value;

    const updated = {
      id: this.state.id,
      title,
      content,
    };

    onSave?.(updated);
  }, 800);

  const buildPath = (documents, targetId) => {
    const path = [];

    const findPath = (list, id) => {
      for (const doc of list) {
        if (doc.id === id) {
          path.unshift(doc.title || "제목 없음");
          return true;
        }
        if (doc.documents?.length && findPath(doc.documents, id)) {
          path.unshift(doc.title || "제목 없음");
          return true;
        }
      }
      return false;
    };

    findPath(documents, targetId);
    return path.join(" > ");
  };

  const renderChildren = (children) => {
    if (!children || children.length === 0) return "";
    return `
      <div class="childDocs">
        <h4>하위 페이지</h4>
        <ul>
          ${children
            .map(
              (child) => `
                <li>
                  <a href="#/documents/${child.id}">
                    📄 ${child.title || "제목 없음"}
                  </a>
                </li>
              `
            )
            .join("")}
        </ul>
      </div>
    `;
  };

  const deleteDocument = async (id) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await fetch(`https://kdt-api.fe.dev-cos.com/documents/${id}`, {
        method: "DELETE",
        headers: { "x-username": "kyeong_rok" },
      });
      alert("삭제되었습니다.");
      location.hash = "/";
    } catch (e) {
      console.error("삭제 실패", e);
    }
  };

  this.template = () => {
    return `
      <div class="header">
        <div class="pageTree">경로 표시 중...</div>
        <button class="pageDelete">삭제</button>
      </div>
      <div class="content">
        <input class="titleInput" placeholder="제목을 입력하세요" value="${this.state.title || ""}" />
        <textarea class="contentInput" placeholder="내용을 입력하세요...">${this.state.content || ""}</textarea>
      </div>
      <div class="children"></div>
    `;
  };

  this.render = async () => {
    this.$target.innerHTML = this.template();

    const $title = this.$target.querySelector(".titleInput");
    const $content = this.$target.querySelector(".contentInput");
    const $delete = this.$target.querySelector(".pageDelete");
    const $pageTree = this.$target.querySelector(".pageTree");
    const $children = this.$target.querySelector(".children");

    $title?.addEventListener("input", saveDocument);
    $content?.addEventListener("input", saveDocument);

    if (this.state.id) {
      const allDocs = await getDocuments();
      const path = buildPath(allDocs, this.state.id);
      $pageTree.textContent = path;

      if (this.state.documents) {
        $children.innerHTML = renderChildren(this.state.documents);
      }

      $delete?.addEventListener("click", () => deleteDocument(this.state.id));
    }
  };

  this.setState = (nextState) => {
    this.state = { ...this.state, ...nextState };
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
