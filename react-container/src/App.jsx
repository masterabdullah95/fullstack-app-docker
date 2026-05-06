import { useEffect, useState } from "react";
import "./App.css";
import { CheckCircle, Loader, AlertCircle } from "lucide-react";

function App() {
  const [items, setItems] = useState([]);
  const [msg, setmsg] = useState("No msg found from server");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    console.log(apiUrl);

    Promise.all([
      fetch(`${apiUrl}/items`).then((res) => res.json()),
      fetch(apiUrl).then((res) => res.json()),
    ])
      .then(([itemsData, msgData]) => {
        setItems(itemsData);
        setmsg(msgData.msg);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch data from server");
        setLoading(false);
      });
  }, []);

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="header-title">
            <h1>DataHub</h1>
            <p className="subtitle">
              Basic Blueprint of Fullstack web app using express + react +
              mongodb + docker
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <section id="center" className="content-section">
          {/* Server Message Card */}
          <div className="card message-card">
            <div className="card-header">
              <div className="header-icon success">
                <CheckCircle size={20} />
              </div>
              <h2>Server Message</h2>
            </div>
            <div className="card-content">
              <p className="message-text">{msg}</p>
            </div>
          </div>

          {/* Items Card */}
          <div className="card items-card">
            <div className="card-header">
              <div className="header-icon primary">
                <CheckCircle size={20} />
              </div>
              <div className="header-info">
                <h2>Items from MongoDB</h2>
                {items.length > 0 && (
                  <span className="badge">{items.length} items</span>
                )}
              </div>
            </div>
            <div className="card-content">
              {loading ? (
                <div className="state loading-state">
                  <Loader className="spinner" size={32} />
                  <p>Loading items...</p>
                </div>
              ) : error ? (
                <div className="state error-state">
                  <AlertCircle size={32} />
                  <p>{error}</p>
                </div>
              ) : items.length > 0 ? (
                <ul className="items-list">
                  {items.map((item, key) => (
                    <li key={key} className="item-row">
                      <span className="item-icon">
                        <CheckCircle size={18} />
                      </span>
                      <span className="item-name">{item.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="state empty-state">
                  <AlertCircle size={32} />
                  <p>No data found</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>&copy; 2024 DataHub. Built with React + Express + MongoDB</p>
      </footer>
    </div>
  );
}

export default App;
