// src/components/Document.js
import { getDocument, getDocuments, updateDocument } from "../api.js";

const getDocumentIdFromHash = () => {
  const hash = window.location.hash;
  const matches = hash.match(/\/documents\/(\d+)/);
  return matches ? matches[1] : null;
};

export default function Document({
  $app,
  initialState,
  handleDelete,
  handleSave,
}) {
  this.state = initialState;

  this.handleDelete = handleDelete;
  this.handleSave = handleSave;

  this.$target = document.createElement("div");
  this.$target.className = "editor";
  $app.appendChild(this.$target);

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
    return path.join(" / ");
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

  this.template = () => {
    let temp = `
    ${
      this.state.id
        ? `
        <div class="header">
          <div class="pageTree">경로 로딩 중...</div>
          <button id="deletePage" class="deletePage"></button>
        </div>
        <div class="default">
          <div class="content">`
        : `<div class="default">
          <div class="content center">`
    }`;

    if (this.state.id) {
      temp += `
          <h1 class="documentTitle" contenteditable="true" placeholder="새 페이지 제목을 입력해주세요.">${
            this.state.title || ""
          }</h1>
          <button class="add-block-btn">+</button>
          <div class="documentContentList">
          ${
            this.state.content ||
            `<div class="documentContent" contenteditable="true" placeholder="내용을 입력해주세요."></div>`
          }
          </div>
        </div>
        <div class="docs none">
          <div class="header">
            <span class="pageTree"></span>
            <button class="deletePage"></button>
          </div>
          <div class="content"></div>
        </div>
        </div>
        <div id="block-menu" class="hidden">
          <div data-type="text">텍스트</div>
          <div data-type="heading1">제목1</div>
          <div data-type="heading2">제목2</div>
          <div data-type="heading3">제목3</div>
          <div data-type="list">글머리 기호 목록</div>
          <div data-type="numberList">숫자 목록</div>
          <div data-type="checkList">체크박스 목록</div>
          <div data-type="horizontalRule" disabled>구분선</div>
          <div data-type="pageLink" disabled>페이지 링크</div>
        </div>
        <div class="children"></div>
      `;
    } else {
      temp += `
        <h3>
          선택된 페이지가 없습니다.<br />
          왼쪽 페이지 추가 버튼 또는 생성된 페이지를 눌러 페이지를 선택해주세요.
        </h3>
      `;
    }
    return temp;
  };

  this.render = async () => {
    this.$target.innerHTML = this.template();

    if (!this.state.id) return;

    const $pageTree = this.$target.querySelector(".pageTree");
    const $children = this.$target.querySelector(".children");

    try {
      const allDocs = await getDocuments();
      const path = buildPath(allDocs, this.state.id);
      if ($pageTree) $pageTree.textContent = path;
      if (this.state.documents?.length) {
        $children.innerHTML = renderChildren(this.state.documents);
      }
    } catch (e) {
      console.error("경로/하위 문서 로딩 실패", e);
    }

    // 기존 렌더 로직 호출
    this._renderEditor();
  };

  this._renderEditor = () => {
    const content = this.$target.querySelector(".content");
    const contentList = this.$target.querySelector(".documentContentList");
    const title = this.$target.querySelector(".documentTitle");
    const blockMenu = this.$target.querySelector("#block-menu");
    const addBlockBtn = this.$target.querySelector(".add-block-btn");

    if (!content || !title || !addBlockBtn || !blockMenu || !contentList) return;

    this.$target.querySelector("#deletePage")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.handleDelete(this.state.id);
    });

    addBlockBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      blockMenu.style.top = `${e.clientY}px`;
      blockMenu.style.left = `${e.clientX}px`;
      blockMenu.classList.toggle("hidden");
    });

    content.addEventListener("click", () => {
      blockMenu.classList.add("hidden");
    });

    title.focus();
    let isComposing = false;

    content.addEventListener("compositionstart", () => {
      isComposing = true;
    });
    content.addEventListener("compositionend", () => {
      isComposing = false;
    });

    blockMenu.addEventListener("click", (e) => {
      const type = e.target.dataset.type;
      if (!type || type === "horizontalRule" || type === "pageLink") return;
      let block = document.createElement("div");

      switch (type) {
        case "heading1":
          block = document.createElement("h2");
          block.innerHTML = "제목1";
          break;
        case "heading2":
          block = document.createElement("h3");
          block.innerHTML = "제목2";
          break;
        case "heading3":
          block = document.createElement("h4");
          block.innerHTML = "제목3";
          break;
        case "list":
          block = document.createElement("ul");
          const li = document.createElement("li");
          li.className = "documentContent";
          li.contentEditable = true;
          li.textContent = "리스트";
          block.appendChild(li);
          break;
        case "numberList":
          block = document.createElement("ol");
          const numLi = document.createElement("li");
          numLi.className = "documentContent";
          numLi.contentEditable = true;
          numLi.textContent = "리스트";
          block.appendChild(numLi);
          break;
        case "checkList":
          block = document.createElement("div");
          block.className = "checkListItem";
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          const checkText = document.createElement("div");
          checkText.className = "documentContent";
          checkText.contentEditable = true;
          block.appendChild(checkbox);
          block.appendChild(checkText);
          break;
        default:
          block.className = "documentContent";
          block.contentEditable = true;
          block.textContent = "";
      }

      contentList.appendChild(block);
      focusAtEnd(block);
      blockMenu.classList.add("hidden");
    });

    title.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const next = document.querySelector(".documentContent");
        if (next) focusAtEnd(next);
      }
    });

    title.addEventListener("input", (e) => {
      this.handleSave(e.target.innerText, null);
    });

    content.addEventListener("input", (e) => {
      const target = e.target;
      if (target.classList.contains("documentContent")) {
        const contentList = content.querySelector(".documentContentList");
        this.handleSave(null, contentList.innerHTML);
      }
    });
  };

  const focusAtEnd = (el) => {
    el.focus();
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  this.setState = (newState) => {
    this.state = newState;
    this.render();
  };

  this.render();
}
