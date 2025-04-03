import Document from "./components/Document.js";
import Sidebar from "./components/Sidebar.js";
import { getDocuments, updateDocument, deleteDocument } from "./api.js";

export default function App($app) {
  this.state = {
    sidebar: {},
    document: {
      id: 149904,
      title: "test",
      createdAt: "2025-04-03T00:44:17.225Z",
      updatedAt: "2025-04-03T17:59:35.464Z",
      content:
        '\n          \n              <div class="documentContent" contenteditable="true" placeholder="내용을 입력해주세요.">ddddd</div><div class="documentContent" contenteditable="true">ㅇㅇㅇㅇ</div><div class="documentContent" contenteditable="true">ㅁㄴㅇㅁㄴㅇ</div><div class="documentContent" contenteditable="true"></div>\n            \n          <h1 class="documentContent" contenteditable="true">제목1</h1><div class="documentContent" contenteditable="true"></div><ul class="documentContent"><li class="documentContent" contenteditable="true">리스트</li></ul><ol class="documentContent"><li class="documentContent" contenteditable="true">리스트</li></ol><div class="checkListItem documentContent"><input type="checkbox"><div class="documentContent" contenteditable="true">ㅇ</div></div><hr class="documentContent" style="border: none;">',
      documents: [],
    },
  };

  const document = new Document({
    $app,
    initialState: this.state.document,
    handleDelete: async (id) => {
      await deleteDocument(id);
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

  const sidebar = new Sidebar({
    $app,
    initialState: this.state.sidebar,
  });

  this.setState = (newState) => {
    this.state = newState;
    sidebar.setState(this.state.sidebar);
    document.setState(this.state.document);
  };

  const init = async () => {
    const docuemtnsData = await getDocumentsList();
    this.setState({
      ...this.state,
      sidebar: docuemtnsData,
    });
  };

  init();
}
