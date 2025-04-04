// src/App.js
import Document from "./components/Document.js";
import Sidebar from "./components/Sidebar.js";
import {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
} from "./api.js";

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

    // ➕ 버튼 눌렀을 때
    onAdd: async () => {
      try {
        const newDoc = await createDocument(); // 새 문서 생성
        location.hash = `#/documents/${newDoc.id}`; // 이동
        const docs = await getDocuments();
        this.setState({
          ...this.state,
          sidebar: { documents: docs },
        });
      } catch (e) {
        console.error("문서 생성 실패:", e);
      }
    },
  });

  const document = new Document({
    $app,
    initialState: this.state.document,

    // 저장 이벤트 발생 시
    onSave: async (updated) => {
      try {
        await updateDocument(updated.id, {
          title: updated.title,
          content: updated.content,
        });
        const docs = await getDocuments();
        this.setState({
          ...this.state,
          sidebar: { documents: docs },
          document: updated,
        });
      } catch (e) {
        console.error("문서 저장 실패:", e);
      }
    },
  });

  this.setState = (nextState) => {
    this.state = nextState;
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
        console.error("문서 불러오기 실패:", e);
      }
    } else {
      this.setState({
        ...this.state,
        document: {},
      });
    }
  };

  window.addEventListener("hashchange", route);

  const init = async () => {
    const docs = await getDocuments();
    this.setState({
      sidebar: { documents: docs },
      document: {},
    });

    route(); // URL에 id 있으면 불러오기
  };

  init();
}
