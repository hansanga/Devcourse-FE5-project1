export default function Sidebar({ $app, initialState }) {
  this.state = initialState;

  this.$target = document.createElement("div");
  this.$target.className = "sideBar";
  $app.appendChild(this.$target);

  this.template = () => {
    let temp = `
      <div class="sideBar">
        <div class="header">
          <div class="profile">
            <img class="picture" />
            <div class="name">Devcourse</div>
            <div class="description">FE5 1차 팀프로젝트</div>
          </div>
          <button class="setting">설정</button>
        </div>
        <form class="search">
          <img />
          <input type="text" placeholder="검색" />
        </form>
        <div class="documents">
          페이지가 없어요. 아래 페이지 추가 버튼을 눌러 페이지를 추가해주세요.
        </div>
        <div class="footer">
          <button class="addPage"><img />페이지 추가</button>
          <div class="info">?</div>
        </div>
      </div>
    `;
    return temp;
  };

  this.render = () => {
    this.$target.innerHTML = this.template();
  };

  this.setState = (newState) => {
    this.state = newState;
    this.render();
  };

  this.render();
}
