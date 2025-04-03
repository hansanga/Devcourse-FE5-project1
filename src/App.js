import Document from "./components/Document.js";
import Sidebar from "./components/Sidebar.js";
import { getDocuments } from "./api.js";

export default function App($app) {
  this.state = {
    sidebar: {},
    document: {},
  };

  const document = new Document({
    $app,
    initialState: this.state.document,
  });

  const sidebar = new Sidebar({
    $app,
    initialState: this.state.sidebar,
  });

  this.setState = (newState) => {
    this.state = newState;
    sidebar.setState(this.state);
    document.setState(this.state);
  };

  const init = async () => {
    this.setState({});
    const sidebar = await getDocuments();
    this.setState({
      ...this.state,
      sidebar,
    });
  };

  init();
}
