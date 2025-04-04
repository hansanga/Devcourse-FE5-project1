// src/components/Sidebar.js
import { createDocument, getDocuments } from "../api.js";

export default function Sidebar({ $app, initialState, onAdd }) {
  this.state = initialState;

  this.$target = document.createElement("div");
  this.$target.className = "sideBar";
  $app.appendChild(this.$target);

  this.template = () => {
    const docs = this.state.documents || [];
    const listItems = docs
      .filter(doc => doc.parent === null)
      .map(doc => `<li><a href="#/documents/${doc.id}">${doc.title || "제목 없음"}</a></li>`)
      .join("");

    return `
      <div class="header">
        <div class="profile">
          <img class="picture" />
          <div class="name">Devcourse</div>
          <div class="description">FE5 1차 팀프로젝트</div>
        </div>
        <button class="setting">설정</button>
      </div>

      <form class="search">
        <input type="text" placeholder="검색" />
      </form>

      <div class="documents">
        <ul>
          ${listItems || "<li>문서가 없습니다.</li>"}
        </ul>
      </div>

      <div class="footer">
        <button class="addPage"><img />페이지 추가</button>
        <div class="info">?</div>
      </div>
    `;
  };

  this.render = () => {
    this.$target.innerHTML = this.template();
    this.setEvent();
  };

  this.setEvent = () => {
    const $addBtn = this.$target.querySelector(".addPage");
    if ($addBtn) {
      $addBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        if (onAdd) await onAdd();
      });
    }
  };

  this.setState = (newState) => {
    this.state = newState;
    this.render();
  };

  this.render();
}
