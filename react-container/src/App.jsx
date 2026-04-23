import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    console.log(import.meta.env.VITE_API_URL + "items");
    fetch(`${import.meta.env.VITE_API_URL + "items"}`)
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  return (
    <>
      <section id="center">
        <h2>This is test</h2>
        <ul>
          {items.length > 0 ? (
            items.map((item, key) => <li key={key}>{item.name}</li>)
          ) : (
            <li>No data found</li>
          )}
        </ul>
      </section>
    </>
  );
}

export default App;
