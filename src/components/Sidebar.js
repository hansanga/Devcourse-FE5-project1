export default function Sidebar({ $app, initialState }) {
  this.state = initialState;

  this.render = () => {};

  this.setState = (newState) => {
    this.state = newState;
    this.render();
  };

  this.render();
}
