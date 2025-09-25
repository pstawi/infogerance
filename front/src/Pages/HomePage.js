import Sidebar from "../components/Sidebar";

export default function HomePage() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 24 }}>
        <h1>accueil</h1>
      </div>
    </div>
  );
}