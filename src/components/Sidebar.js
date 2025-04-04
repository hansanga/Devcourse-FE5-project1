import { getDocuments, createDocument } from "../api.js";
import infoTooltip from "./info_tooltip.js"; 


export default function Sidebar({ $app, initialState }) {
  let state = initialState;
  let isFetched = false;

  const $target = document.querySelector(".documents");
  // $target.className = "sideBar";
  // $app.appendChild($target);

  
  const renderDocumentTree = (documents) => {
    return documents.map(doc => `
      <li class="document">
        <a class="title" id="${doc.id}">${doc.title}<img class="add-icon" src="./images/icon_add.png"></a>
        ${doc.documents && doc.documents.length > 0 ? `<ul class="sub">${renderDocumentTree(doc.documents)}</ul>` : ""}
      </li>
    `).join("");
  };
  

  const renderDocuments = () => {
    const documentList = $target.querySelector("ul");
    if (!documentList) return;
    documentList.innerHTML = renderDocumentTree(state);
  };

  async function fetchDocuments() {
    if (isFetched) return; 
    isFetched = true; 

    try {
      const documents = await getDocuments();
      state = documents;
      renderDocuments();
    } catch (error) {
      console.log("문서 목록을 불러오는 데 실패했습니다.", error);
    }
  }

  $target.addEventListener("click", (event) => {
    if (event.target.classList.contains("title")) {
      const onList = event.target.nextElementSibling;
      if (onList) {
        onList.classList.toggle("none");
      }
    }

    if (event.target.classList.contains("add-icon")) {
      const parentDocumentId = event.target.closest('.document').querySelector('.title').id;
      createSubDocument(parentDocumentId); 
    }
  });

  // 페이지 생성
  const fetchData = async () => {
    try {
      const newDocumentData = await createDocument({
        title: "파일 제목",
        parent: null,
      });
      state = [...state, newDocumentData];

      const newDocument = document.createElement("li");
      newDocument.classList.add("document");
      const documentLink = document.createElement("a");
      documentLink.classList.add("title");
      documentLink.href = `./documents/${newDocumentData .id}`;
      documentLink.textContent = newDocumentData.title;
      newDocument.appendChild(documentLink);

      const documentList = $target.querySelector("ul");
      if (documentList) {
        documentList.appendChild(newDocument);
      }
      renderDocuments();
    } catch (error) {
      console.error(error);
    }
  };

  // 페이지 검색
  const filter = () => {
    const searchInput = document.querySelector(".search input");
    const documentList = document.querySelector(".documents ul");

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

  //하위문서 생성
  const createSubDocument = async (parentDocumentId) => {
    try {
      const newDocumentData = await createDocument({
        title: "하위 문서",
        parent: parentDocumentId,  
      });
  
      const parentDocument = state.find(doc => doc.id === parseInt(parentDocumentId));
      if (parentDocument) {
        parentDocument.documents.push(newDocumentData);
        renderDocuments();
      }
      
    } catch (error) {
      console.error("하위 문서 생성 실패:", error);
    }
  };
  
  

  const render = () => {
    fetchDocuments();

    const addPage = document.querySelector(".addPage");
    const searchInput = document.querySelector(".search input");

    if (addPage) {
      addPage.addEventListener("click", async () => {
        await fetchData();
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", filter);
    }
    infoTooltip();
  };

  const setState = (newState) => {
    state = newState;
    renderDocuments();
  };

  render();
  

  return { setState };
}
