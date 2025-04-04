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
    ${
      this.state.id
        ? `
        <div class="header">
          <div class="pageTree">새 페이지 / 하위 페이지 1</div>
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

  this.render = () => {
    this.$target.innerHTML = this.template();

    if (!this.state.id) return;

    // 페이지 삭제
    this.$target.querySelector("#deletePage").addEventListener("click", (e) => {
      e.preventDefault();
      this.handleDelete(this.state.id);
    });

    // 필요한 데이터 선언
    const content = this.$target.querySelector(".content");
    const contentList = this.$target.querySelector(".documentContentList");
    const title = this.$target.querySelector(".documentTitle");
    const blockMenu = this.$target.querySelector("#block-menu");
    const addBlockBtn = this.$target.querySelector(".add-block-btn");

    // 템플릿 추가 버튼 클릭시 이벤트
    addBlockBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      blockMenu.style.top = `${e.clientY}px`;
      blockMenu.style.left = `${e.clientX}px`;
      if (blockMenu.classList.contains("hidden")) {
        blockMenu.classList.remove("hidden");
      } else {
        blockMenu.classList.add("hidden");
      }
    });

    // 템플릿 추가 버튼 클릭시 아무런 행동 없이 밖의 영역 클릭시 메뉴 닫기
    content.addEventListener("click", (e) => {
      e.preventDefault();
      blockMenu.classList.add("hidden");
    });

    // 초기 포커스
    title.focus();
    // 한글 등 조합 여부
    let isComposing = false;

    // 한글 등 조합 시작될 때
    content.addEventListener("compositionstart", () => {
      isComposing = true;
    });

    // 조합 끝날 때
    content.addEventListener("compositionend", () => {
      isComposing = false;
    });

    // 템플릿 추가
    blockMenu.addEventListener("click", (e) => {
      const type = e.target.dataset.type;
      if (!type) return;
      if (type === "horizontalRule" || type === "pageLink") return;

      let block, li, checkbox, checkText;
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
          block = document.createElement("a");
          block.href = "#";
          block.textContent = "페이지 링크";
          break;
        default:
          block = document.createElement("div");
          break;
      }
      block.classList.add("documentContent");
      if (
        !li &&
        type !== "checkList" &&
        type !== "pageLink" &&
        type !== "horizontalRule"
      )
        block.contentEditable = true;

      contentList.appendChild(block);
      if (type === "checkList") {
        checkText.focus();
      } else focusAtEnd(block);
      blockMenu.classList.add("hidden");
    });

    // 제목에서 enter 누르면 다음 항목으로 이동
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

    // 제목 수정 시 저장
    title.addEventListener("input", (e) => {
      e.preventDefault();
      if (e.target.innerText.trim() === "") {
        e.target.textContent = "";
        return;
      }
      this.handleSave(e.target.innerText, null);
    });

    // 내용 수정 시 저장
    content.addEventListener("input", (e) => {
      const target = e.target;
      if (target.classList.contains("documentContent")) {
        e.preventDefault();
        const contentList = content.querySelector(".documentContentList");
        this.handleSave(null, contentList.innerHTML);
      }
    });

    // 내용 수정 시 각 키에 따른 이벤트
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

          contentList.appendChild(newCheck);
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

  // 포커스 이동시 텍스트의 맨 끝으로 이동을 위한 함수
  function focusAtEnd(element) {
    element.focus();

    // 텍스트 노드가 있는지 확인
    const range = document.createRange();
    const selection = window.getSelection();

    // 만약 텍스트 노드가 없다면 dummy로 하나 추가
    if (!element.firstChild) {
      element.appendChild(document.createTextNode(""));
    }

    range.setStart(element.firstChild, element.firstChild.length); // 텍스트 끝으로
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);
  }

  // 블록에서 Enter 클릭시 처리할 함수
  const handleEnter = (currentElement) => {
    const tag = currentElement.tagName;
    // 리스트(li) 내부에서 Enter
    if (tag === "LI") {
      const parentList = currentElement.closest("ul, ol");

      if (!parentList) return;

      // 빈 li일 경우 리스트 탈출
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

      // 일반 li일 경우 새로운 li 추가
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
