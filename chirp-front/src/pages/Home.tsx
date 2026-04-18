import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <h1>Главная</h1>
      <nav>
        <Link to="/about" className="text-blue-500 underline">Перейти о нас</Link>
      </nav>
    </div>
  )
}

export default Home;