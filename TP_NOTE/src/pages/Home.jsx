import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <main className="home">
      <h1>TP Noté React</h1>
      <div className="exercises">
        <Link to="/meteo" className="exercise-btn">
          Page météo :
        </Link>
      </div>
    </main>
  );
}

export default Home;
