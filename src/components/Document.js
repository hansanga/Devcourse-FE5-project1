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
          <h1 class="documentTitle" contenteditable="true" placeholder="새 페이지 제목을 입력해주세요."></h1>
          <div class="documentContent" contenteditable="true" placeholder="내용을 입력해주세요."></div>
        </div>
        <div id="block-menu" class="hidden">
          <div data-type="text">텍스트</div>
          <div data-type="heading">제목</div>
          <div data-type="list">리스트</div>
          <div data-type="code">코드블록</div>
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

    const content = this.$target.querySelector(".content");
    const title = this.$target.querySelector(".documentTitle");
    const blockMenu = this.$target.querySelector("#block-menu");
    title.focus();
    let isComposing = false;

    // 한글 등 조합 시작될 때
    content.addEventListener("compositionstart", () => {
      isComposing = true;
    });

    // 조합 끝날 때
    content.addEventListener("compositionend", () => {
      isComposing = false;
    });

    blockMenu.addEventListener("click", (e) => {
      const type = e.target.dataset.type;
      if (!type) return;

      let block;
      let li;
      switch (type) {
        case "heading":
          block = document.createElement("h1");
          block.innerHTML = "제목";
          break;
        case "list":
          block = document.createElement("ul");
          li = document.createElement("li");
          li.className = "documentContent";
          li.contentEditable = true;
          li.textContent = "리스트";

          block.appendChild(li);
          break;
        case "code":
          block = document.createElement("pre");
          block.innerHTML = "<code>// 코드 작성</code>";
          break;
        default:
          block = document.createElement("div");
          break;
      }
      block.className = "documentContent";
      if (!li) block.contentEditable = true;

      content.appendChild(block);
      block.focus();
    });

    title.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const nextTarget = document.querySelector(".documentContent");
        if (nextTarget) {
          focusAtEnd(nextTarget);
        } else if (!isComposing) {
          handleEnter(title);
        }
      }
    });
    title.addEventListener("input", (e) => {
      e.preventDefault();
      if (e.target.innerText.trim() === "") {
        e.target.textContent = "";
        return;
      }
      this.handleSave({
        title: e.target.innerText,
      });
    });

    content.addEventListener("input", (e) => {
      const target = e.target;
      if (target.classList.contains("documentContent")) {
        e.preventDefault();
        this.handleSave({
          title: target.innerText,
        });
      }
    });

    content.addEventListener("keydown", (e) => {
      const target = e.target;
      if (target.innerText.trim() === "" && e.key === "Backspace") {
        target.remove();
        const prevTarget = document.querySelectorAll(".documentContent");
        if (prevTarget.length > 0) {
          focusAtEnd(prevTarget[prevTarget.length - 1]);
        } else {
          focusAtEnd(title);
        }
        return;
      }

      if (
        target.classList.contains("documentContent") &&
        e.key === "Enter" &&
        !isComposing &&
        !e.shiftKey // Shift+Enter는 줄바꿈 허용
      ) {
        e.preventDefault();
        handleEnter(target);
      }
    });
  };

  function focusAtEnd(element) {
    element.focus();

    // 텍스트 노드가 있는지 확인
    const range = document.createRange();
    const selection = window.getSelection();

    // 만약 텍스트 노드가 없다면 dummy로 하나 넣기
    if (!element.firstChild) {
      element.appendChild(document.createTextNode(""));
    }

    range.setStart(element.firstChild, element.firstChild.length); // 텍스트 끝으로
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);
  }

  const handleEnter = (currentElement) => {
    const tag = currentElement.tagName;
    // 리스트(li) 내부에서 Enter
    if (tag === "LI") {
      const parentList = currentElement.closest("ul, ol");

      if (!parentList) return;

      // 1. 빈 li일 경우 → 리스트 탈출
      if (currentElement.innerText.trim() === "") {
        const newBlock = document.createElement("div");
        newBlock.className = "documentContent";
        newBlock.contentEditable = true;
        newBlock.setAttribute("data-placeholder", "내용을 입력해주세요.");

        parentList.insertAdjacentElement("afterend", newBlock);
        currentElement.remove(); // 빈 li 제거
        focusAtEnd(newBlock);
        return;
      }

      // 2. 일반 li일 경우 → 새로운 li 추가
      const newLi = document.createElement("li");
      newLi.className = "documentContent";
      newLi.contentEditable = true;
      newLi.textContent = "";

      currentElement.insertAdjacentElement("afterend", newLi);
      focusAtEnd(newLi);
      return;
    }

    const newElement = document.createElement("div");
    newElement.className = "documentContent";
    newElement.contentEditable = "true";
    newElement.placeholder = "내용을 입력해주세요.";

    // 현재 요소 다음에 insert
    currentElement.insertAdjacentElement("afterend", newElement);
    newElement.focus();
  };

  this.setState = (newState) => {
    this.state = newState;
    this.render();
  };

  this.render();
}
