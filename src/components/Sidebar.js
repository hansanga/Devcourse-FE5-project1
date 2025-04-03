import { getDocuments } from "../api.js";

export default function Sidebar({ $app, initialState }) {
  let state = initialState;

  const $target = document.createElement("div");
  $target.className = "sideBar";
  $app.appendChild($target);

  const renderDocuments = () => {
    const $documentList = $target.querySelector(".documents ul"); 
    if (!$documentList) return; 

    $documentList.innerHTML = state.length > 0
      ? state.map(doc => `<li class="document-item">${doc.title}</li>`).join("")
      : "";
  };

  async function fetchDocuments() {  
    try {
      const documents = await getDocuments();
      setState(documents);
      renderDocuments();
    } catch (error) {
      console.log("문서 목록을 불러오는 데 실패했습니다.", error);
    }
  }
  
  const template = () => `
     <div class="sideBar">
            <div class="header">
                <div class="profile">
                    <img class="picture">
                    <div class="name">Devcourse</div>
                    <div class="description">FE5 1차 팀프로젝트</div>
                </div>
                <button class="setting"></button>
            </div>
            <form class="search">
                <img>
                <input type="text" placeholder="검색">
            </form>
            <div class="documents">
                <ul></ul> 
            </div>
            <div class="footer">
                <button class="addPage"><img>페이지 추가</button>
                <img class="info">
            </div>
        </div>
  `;

  const render = () => {
    $target.innerHTML = template();
    fetchDocuments();
  };
  
  
  const setState = (newState) => {
    state = newState;
    render();
  };

  render();

  return { setState };
}

