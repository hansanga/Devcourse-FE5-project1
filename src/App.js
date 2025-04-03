// ✅ App.js
import Document from "./components/Document.js";
import Sidebar from "./components/Sidebar.js";
import { getDocuments, getDocument, updateDocument, createDocument } from "./api.js";

export default function App($app) {
  this.state = {
    sidebar: {
      documents: [],
    },
    document: {},
  };

  const sidebar = new Sidebar({
    $app,
    initialState: this.state.sidebar,

    // ✅ 새 문서 생성 후 사이드바 갱신 + 페이지 이동
    onAdd: async () => {
      try {
        const newDoc = await createDocument();
        if (newDoc?.id) {
          const documents = await getDocuments();
          this.setState({
            ...this.state,
            sidebar: { documents },
          });
          location.hash = `#/documents/${newDoc.id}`;
        }
      } catch (e) {
        console.error("❌ 문서 생성 실패:", e);
      }
    },
  });

  const document = new Document({
    $app,
    initialState: this.state.document,

    // ✅ 저장 후 사이드바 제목 갱신
    onSave: async (updated) => {
      try {
        await updateDocument(updated.id, updated);
        const documents = await getDocuments();
        this.setState({
          ...this.state,
          document: updated, // 입력한 내용을 유지하기 위해 상태도 갱신
          sidebar: { documents },
        });
      } catch (e) {
        console.error("❌ 저장 실패:", e);
      }
    },
  });

  this.setState = (newState) => {
    this.state = newState;
    sidebar.setState(this.state.sidebar);
    document.setState(this.state.document);
  };

  const route = async () => {
    const id = window.location.hash.split("/")[2];
    if (id) {
      try {
        const doc = await getDocument(id);
        this.setState({
          ...this.state,
          document: doc,
        });
      } catch (e) {
        console.error("❌ 문서 로드 실패:", e);
      }
    }
  };

  window.addEventListener("hashchange", route);

  const init = async () => {
    try {
      const documents = await getDocuments();
      this.setState({
        sidebar: { documents },
        document: {},
      });
      route();
    } catch (e) {
      console.error("❌ 초기화 실패:", e);
    }
  };

  init();
}
