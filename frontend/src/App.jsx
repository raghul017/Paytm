function App() {

  function handleOnClick() {
    alert("Paytm button clicked");
  }
  return (
    <div>
      <h1>Paytm</h1>
      <button onClick={
        handleOnClick
      }>Pay</button>
    </div>
  );
}

export default App;
