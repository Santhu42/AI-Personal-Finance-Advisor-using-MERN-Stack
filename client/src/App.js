import Login from "./Login";
import Register from "./Register";
import Transactions from "./Transactions";

function App() {
  const token = localStorage.getItem("token");

  return (
    <div style={{ padding: "40px" }}>
      <h1>AI Personal Finance Advisor</h1>

      {token ? (
        <>
          <h2>Logged in successfully 🎉</h2>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
          >
            Logout
          </button>

          <hr />
          <Transactions />
        </>
      ) : (
        <>
          <Register />
          <hr />
          <Login />
        </>
      )}
    </div>
  );
}

export default App;
