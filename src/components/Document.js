export default function Document({ $app, initialState }) {
  this.state = initialState;

  this.$target = document.createElement("div");
  this.$target.className = "editor";
  $app.appendChild(this.$target);

  this.template = () => {
    let temp = `
        <div class="header">
          <div class="pageTree"></div>
          <button clss="pageDelete">삭제</button>
        </div>
        <div class="content"></div>
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
