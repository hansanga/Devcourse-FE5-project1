// src/components/Sidebar.js
import { createDocument, getDocuments } from "../api.js";

export default function Sidebar({ $app, initialState, onAdd }) {
  this.state = initialState;

  this.$target = document.createElement("div");
  this.$target.className = "sideBar";
  $app.appendChild(this.$target);

  this.template = () => {
    // ✅ 루트 문서만 필터링
    const rootDocuments = this.state.documents?.filter(doc => doc.parent === null) || [];

    const documentList = rootDocuments
      .sort((a, b) => a.title.localeCompare(b.title))
      .map(
        (doc) => `
          <li>
            <a href="#/documents/${doc.id}">${doc.title || "제목 없음"}</a>
          </li>`
      )
      .join("");

    return `
      <div class="header">
        <div class="profile">
          <img class="picture" />
          <div class="name">Devcourse</div>
          <div class="description">FE5 1차 팀프로젝트</div>
        </div>
        <button class="setting" aria-label="설정 버튼">
          <i class="fa-solid fa-gear"></i>
        </button>
      </div>

      <form class="search">
        <input type="text" placeholder="검색" />
      </form>

      <div class="documents">
        <ul>${documentList}</ul>
      </div>

      <div class="footer">
        <button class="addPage">
          <i class="fa-solid fa-plus"></i> 페이지 추가
        </button>
        <div class="info">
          <i class="fa-solid fa-circle-question"></i>
        </div>
      </div>
    `;
  };

  this.render = () => {
    this.$target.innerHTML = this.template();
    this.setEvent();
  };

  this.setEvent = () => {
    const $addBtn = this.$target.querySelector(".addPage");
    $addBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      if (onAdd) onAdd();
    });
  };

  this.setState = (nextState) => {
    this.state = {
      ...this.state,
      documents: nextState.documents || [],
    };
    this.render();
  };

  this.render();
}
