import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="bg-gray-800 p-4 shadow-lg">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-white">CONTROL TRADING</div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:text-gray-400 text-white">Home</Link>
          </li>
          <li>
            <Link to="/licenses" className="hover:text-gray-400 text-white">Licencias Enbolsa</Link>
          </li>
          <li>
            <Link to="/trading-station" className="hover:text-gray-400 text-white">Trading Station</Link>
          </li>
          <li>
            <Link to="/products" className="hover:text-gray-400 text-white">Productos Enbolsa</Link>
          </li>
          <li>
            <Link to="/support" className="hover:text-gray-400 text-white">Servicio Técnico</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;