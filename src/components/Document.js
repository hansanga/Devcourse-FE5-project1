export default function Document({ $app, initialState }) {
  this.state = initialState;

  this.$target = document.createElement("div");
  this.$target.className = "document";
  $app.appendChild(this.$target);

  this.template = () => {
    let temp = `
    <div class="document-header">
      <div class="document-header-title">
        <span>제목</span>
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
