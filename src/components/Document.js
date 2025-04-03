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
          <div data-type="heading1">제목1</div>
          <div data-type="heading2">제목2</div>
          <div data-type="heading3">제목3</div>
          <div data-type="list">글머리 기호 목록</div>
          <div data-type="numberList">숫자 목록</div>
          <div data-type="checkList">체크박스 목록</div>
          <div data-type="horizontalRule">구분선</div>
          <div data-type="pageLink">페이지 링크</div>
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

      let block, li, checkbox, checkText, link;
      switch (type) {
        case "heading1":
          block = document.createElement("h1");
          block.innerHTML = "제목1";
          break;
        case "heading2":
          block = document.createElement("h2");
          block.innerHTML = "제목2";
          break;
        case "heading3":
          block = document.createElement("h3");
          block.innerHTML = "제목3";
          break;
        case "list":
          block = document.createElement("ul");
          li = document.createElement("li");
          li.className = "documentContent";
          li.contentEditable = true;
          li.textContent = "리스트";

          block.appendChild(li);
          break;
        case "numberList":
          block = document.createElement("ol");
          li = document.createElement("li");
          li.className = "documentContent";
          li.contentEditable = true;
          li.textContent = "리스트";
          block.appendChild(li);
          break;
        case "checkList":
          block = document.createElement("div");
          block.className = "checkListItem";

          checkbox = document.createElement("input");
          checkbox.type = "checkbox";

          checkText = document.createElement("div");
          checkText.className = "documentContent";
          checkText.contentEditable = true;

          block.appendChild(checkbox);
          block.appendChild(checkText);
          break;
        case "horizontalRule":
          block = document.createElement("hr");
          break;
        case "pageLink":
          block = document.createElement("div");
          block.className = "";

          link = document.createElement("a");
          link.href = "#";
          link.textContent = "개발중";
          block.appendChild(link);
          break;
        default:
          block = document.createElement("div");
          break;
      }
      block.classList.add("documentContent");
      if (!li && type !== "checkList" && type !== "horizontalRule")
        block.contentEditable = true;

      content.appendChild(block);
      if (type === "horizontalRule" || type === "pageLink") {
        handleEnter(block);
      } else if (type === "checkList") {
        checkText.focus();
      } else focusAtEnd(block);
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
      // 방향키 위 아래 처리
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = target.previousElementSibling;
        if (prev) {
          focusAtEnd(prev);
        } else focusAtEnd(title);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = target.nextElementSibling;
        if (next) {
          focusAtEnd(next);
        } else focusAtEnd(title);
        return;
      }

      // 체크박스 블록에서 Backspace 처리
      if (
        target.classList.contains("documentContent") &&
        target.parentElement.classList.contains("checkListItem") &&
        target.innerText.trim() === "" &&
        e.key === "Backspace"
      ) {
        e.preventDefault();
        const wrapper = target.parentElement;
        const prev =
          wrapper.previousElementSibling?.querySelector(".documentContent") ||
          title;
        wrapper.remove();
        focusAtEnd(prev);
        return;
      }

      // 일반 블록에서 Backspace 처리
      if (
        target.classList.contains("documentContent") &&
        !target.parentElement.classList.contains("checkListItem") &&
        target.innerText.trim() === "" &&
        e.key === "Backspace"
      ) {
        e.preventDefault();
        const prevTarget = target.previousElementSibling;
        target.remove();
        if (prevTarget?.classList?.contains("documentContent")) {
          focusAtEnd(prevTarget);
        } else {
          focusAtEnd(title);
        }
        return;
      }

      // 체크박스에서 Enter 줄 추가 or 종료
      if (
        target.classList.contains("documentContent") &&
        target.parentElement.classList.contains("checkListItem") &&
        e.key === "Enter" &&
        !isComposing &&
        !e.shiftKey
      ) {
        e.preventDefault();

        if (target.innerText.trim() === "") {
          const newDiv = document.createElement("div");
          newDiv.className = "documentContent";
          newDiv.contentEditable = true;
          newDiv.setAttribute("data-placeholder", "내용을 입력해주세요.");

          target.parentElement.remove();
          content.appendChild(newDiv);

          focusAtEnd(newDiv);
        } else {
          const newCheck = document.createElement("div");
          newCheck.className = "checkListItem documentContent";

          const newCheckbox = document.createElement("input");
          newCheckbox.type = "checkbox";

          const newText = document.createElement("div");
          newText.className = "documentContent";
          newText.contentEditable = true;

          newCheck.appendChild(newCheckbox);
          newCheck.appendChild(newText);

          target.parentElement.appendChild(newCheck);
          focusAtEnd(newText);
        }
        return;
      }

      // 일반 블록에서 Enter 처리
      if (
        target.classList.contains("documentContent") &&
        e.key === "Enter" &&
        !isComposing &&
        !e.shiftKey
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
