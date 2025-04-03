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

  this.template = () => {
    let temp = `
        <div class="header">
          <div class="pageTree">새 페이지 / 하위 페이지 1</div>
          <button id="pageDelete"><span class="material-symbols-outlined">delete</span></button>
        </div>
        <div class="content">
          <div class="documentTitle" contenteditable="true" placeholder="새 페이지 제목을 입력해주세요."></div>
          <div class="documentContent" contenteditable="true" placeholder="내용을 입력해주세요."></div>
        </div>
    `;
    return temp;
  };

  this.render = () => {
    this.$target.innerHTML = this.template();

    this.$target.querySelector("#pageDelete").addEventListener("click", (e) => {
      e.preventDefault();
      this.handleDelete(); // id 값 추가
    });

    this.$target
      .querySelector(".documentContent")
      .addEventListener("input", (e) => {
        e.preventDefault();
        this.handleSave({
          content: e.target.innerText,
        });
      });

    this.$target
      .querySelector(".documentTitle")
      .addEventListener("input", (e) => {
        e.preventDefault();
        this.handleSave({
          title: e.target.innerText,
        });
      });
  };

  this.setState = (newState) => {
    this.state = newState;
    this.render();
  };

  this.render();
}
