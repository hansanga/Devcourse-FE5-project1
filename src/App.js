import Document from "./components/Document.js";
import Sidebar from "./components/Sidebar.js";
import {
  getDocuments,
  updateDocument,
  deleteDocument,
  getDocument,
} from "./api.js";

export default function App($app) {
  this.state = {
    sidebar: {},
    document: {},
    parentDocumentId: "",
  };

  const document = new Document({
    $app,
    initialState: this.state.document,
    handleDelete: async (id) => {
      const response = await deleteDocument(id);
      console.log(response);

      const documents = await getDocumentsList();
      this.setState({
        ...this.state,
        sidebar: documents,
        document: {},
      });
    },
    handleSave: async (title, content) => {
      const params = {};
      if (title) params.title = title;
      if (content) params.content = content;
      await updateDocument(this.state.document.id, params);
      // const documents = await getDocuments();
      // this.setState({
      //   ...this.state,
      //   sidebar: documents,
      // });
    },
  });

  const getDocumentsList = async () => {
    const response = await getDocuments();
    return response;
  };

  // 페이지 클릭 하면 해당 데이터 가져와서 this.state.document에 저장
  const sidebar = new Sidebar({
    $app,
    initialState: this.state.sidebar,
    handleClickDocument: async (id) => {
      history.pushState(null, null, `/documents/${id}`);
      const document = await getDocument(id);
      this.setState({
        ...this.state,
        document,
        parentDocumentId: id ? id : "",
      });
    },
  });

  this.setState = (newState) => {
    this.state = newState;
    if (this.state.parentDocumentId || !this.state.document.id) {
      document.setState(this.state.document);
    } else {
      sidebar.setState(this.state.sidebar);
    }
  };

  window.addEventListener("popstate", async () => {
    const path = window.location.pathname;
    const id = path.split("/")[2];
    let document = {};
    if (id) {
      document = await getDocument(id);
    }
    this.setState({
      ...this.state,
      document: document ? document : {},
      parentDocumentId: id ? id : "",
    });
  });

  const init = async () => {
    const docuemtnsData = await getDocumentsList();
    const id = window.location.pathname.split("/")[2];
    let document = {};
    if (id) {
      document = await getDocument(id);
    }
    this.setState({
      ...this.state,
      sidebar: docuemtnsData,
      document: document ? document : {},
      parentDocumentId: id ? id : "",
    });
  };

  init();
}
