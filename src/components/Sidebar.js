import { getDocuments, createDocument } from "../api.js";

export default function Sidebar({ $app, initialState, handleClickDocument }) {
  this.state = initialState;
  this.isFetched = false;

  this.handleClickDocument = handleClickDocument;
  this.$modal = document.querySelector(".modalBg")
  this.$target = document.createElement("div");
  this.$target.className = "sideBar";
  $app.appendChild(this.$target);

  this.template = () => `
    <div class="header">
      <div class="profile">
        <img class="picture" src="/images/profile.png" />
        <div>
          <div class="name">Devcourse</div>
          <div class="description">FE5 1차 팀프로젝트</div>
        </div>
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

  this.renderDocumentTree = (documents) => {
    return documents
      .map(
        (doc) => `
      <li class="document">
        <a class="title" id="${doc.id}">${
          doc.title
        }<img class="add-icon" src="/images/icon_add.png"></a>
        ${
          doc.documents && doc.documents.length > 0
            ? `<ul class="sub none">${this.renderDocumentTree(
                doc.documents
              )}</ul>`
            : ""
        }
      </li>
    `
      )
      .join("");
  };

  this.renderDocuments = () => {
    const documentList = this.$target.querySelector(".documents ul");
    if (!documentList) return;
    documentList.innerHTML = this.renderDocumentTree(this.state);
  };

  this.fetchDocuments = async () => {
    if (this.isFetched) return;
    this.isFetched = true;

    try {
      const documents = await getDocuments();
      this.state = documents;
      this.renderDocuments();
    } catch (error) {
      console.log("문서 목록을 불러오는 데 실패했습니다.", error);
    }
  };


  // 새페이지 생성
  this.fetchData = async () => {
    try {
      const newDocumentData = await createDocument({
        title: "파일 제목",
        parent: null,
      });
      this.state = [...this.state, newDocumentData];
      this.renderDocuments();
    } catch (error) {
      console.error(error);
    }
  };

  // 하위문서 생성
  this.createSubDocument = async (parentDocumentId) => {
    try {
      const newDocumentData = await createDocument({
        title: "하위 문서",
        parent: parentDocumentId,
      });

      const parentDocument = this.state.find(
        (doc) => doc.id === parseInt(parentDocumentId)
      );
      if (parentDocument) {
        parentDocument.documents.push(newDocumentData);
        this.renderDocuments();
      }
    } catch (error) {
      console.error("하위 문서 생성 실패:", error);
    }
  };

  // 검색기능
  this.filter = () => {
    const searchInput = this.$target.querySelector(".search input");
    const documentList = this.$target.querySelector(".documents ul");

    if (!documentList) return;

    const searchTerm = searchInput.value.trim().toLowerCase();
    const links = Array.from(documentList.querySelectorAll("li"));

    links.forEach((link) => {
      const documentLink = link.querySelector("a");
      if (!documentLink) return;

      const pageTitle = documentLink.textContent.toLowerCase();
      link.style.display = pageTitle.includes(searchTerm) ? "" : "none";
    });
  };

  // 하위문서 토글
  this.addEventListeners = () => {
    const documentList = this.$target.querySelector(".documents ul");
    const setting = this.$target.querySelector(".setting");

    documentList.addEventListener("click", async (event) => {
      const parentDocumentId = event.target
        .closest(".document")
        .querySelector(".title").id;

      console.log(parentDocumentId);

      if (event.target.classList.contains("title")) {
        const onList = event.target.parentElement.querySelector(".sub");
        if (onList) {
          onList.classList.toggle("none");
        }
      }

      await handleClickDocument(parentDocumentId);

      if (event.target.classList.contains("add-icon")) {
        this.createSubDocument(parentDocumentId);
      }
    });

    const theme = this.$modal.querySelector(".themeList");
    // 모달 클릭
    setting.addEventListener("click", (event) => {
      console.log("Modal clicked", event);
      this.$modal.classList.toggle("none")
    });

    this.$modal.addEventListener("click", (event) => {
      if (event.target === this.$modal) {
        this.$modal.classList.add("none"); 
      }
    });

    theme.addEventListener("click", (event) => {
      console.log("theme clicked", event);
      const listItems = this.$modal.querySelectorAll(".themeList li");
  
      listItems.forEach(item => {
        item.classList.toggle("none"); 
  });
    });

    const addPage = this.$target.querySelector(".addPage");
    const searchInput = this.$target.querySelector(".search input");

    if (addPage) {
      addPage.addEventListener("click", async () => {
        await this.fetchData();
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", this.filter);
    }

    const info = this.$target.querySelector(".info");
    const tooltip = info?.querySelector("div");

    if (info && tooltip) {
      info.addEventListener("mouseover", () => {
        tooltip.className = "";
      });
      info.addEventListener("mouseout", () => {
        tooltip.className = "none";
      });
    }
  };

  this.setState = (newState) => {
    this.state = newState;
    this.renderDocuments();
  };

  this.render = () => {
    this.$target.innerHTML = this.template();
    this.fetchDocuments();
    this.addEventListeners();
  };

  this.render();

  return {
    setState: this.setState,
  };
}
