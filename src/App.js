import Document from "./components/Document.js";
import Sidebar from "./components/Sidebar.js";
import { getDocuments, updateDocument, deleteDocument } from "./api.js";

export default function App($app) {
  this.state = {
    sidebar: {},
    document: {},
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
      const response = await updateDocument(this.state.document.id, params);
      //
      console.log(response);
      // this.setState({
      //   ...this.state,
      //   document: response,
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
  });

  this.setState = (newState) => {
    this.state = newState;
    sidebar.setState(this.state.sidebar);
    document.setState(this.state.document);
  };

  window.addEventListener("popstate", async () => {
    // TODO
    // 링크에 따른 데이터 불러와서 저장 해야함
    // 현재 페이지 주소 가져오기
    // 현재 페이지 주소에 따른 데이터 가져오기
    // this.setState에 저장
  });

  const init = async () => {
    const docuemtnsData = await getDocumentsList();
    this.setState({
      ...this.state,
      sidebar: docuemtnsData,
    });
  };

  init();
}
