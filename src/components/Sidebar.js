export default function Sidebar({ $app, initialState }) {
  this.state = initialState;

  this.$target = document.createElement("div");
  this.$target.className = "sideBar";
  $app.appendChild(this.$target);

  this.template = () => {
    let temp = `
        <div class="header">
          <div class="profile">
            <img class="picture" src="./images/profile.png" />
            <div class="name">Devcourse</div>
            <div class="description">FE5 1차 팀프로젝트</div>
          </div>
          <button class="setting"></button>
        </div>

        <form class="search">
          <input type="text" placeholder="검색" />
        </form>

        <div class="documents">
          <ul></ul>
        </div>

        <div class="footer">
          <button class="addPage">페이지 추가</button>
          <div class="info">
            <div class="none">
              2025.04.03 ~ 2025.04.04 / Team 1 <br />
              강하영, 구민지, 권유정, 박상윤, 주경록, 한상아
            </div>
          </div>
        </div>
    `;
    return temp;
  };

  this.render = () => {
    this.$target.innerHTML = this.template();

    const info = document.querySelector(".info");
    const tooltip = document.querySelector(".info div");

    info.addEventListener("mouseover", () => {
      tooltip.className = "";
    });
    info.addEventListener("mouseout", () => {
      tooltip.className = "none";
    });
  };

  this.setState = (newState) => {
    this.state = newState;
    this.render();
  };

  this.render();
}
