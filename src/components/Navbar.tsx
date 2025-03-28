import { Link, useLocation } from "react-router-dom";
import { Home, BookPlus, ShoppingBag, LayoutDashboard, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tradingStationVersions = [
    { version: "2.6", idProduct: 125, path: "/trading-station/2.6" },
    { version: "2.7", idProduct: 170, path: "/trading-station/2.7" },
    { version: "2.8", idProduct: 177, path: "/trading-station/2.8" },
  ];

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/licenses", label: "Licencias Enbolsa", icon: BookPlus },
    { to: "/products", label: "Productos Enbolsa", icon: ShoppingBag },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 mb-16 ${
        scrolled 
          ? 'bg-gray-800/90 backdrop-blur-lg shadow-lg' 
          : 'bg-gray-800/70'
      }`}
    >
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hover:from-blue-500 hover:via-purple-600 hover:to-pink-600 transition-all duration-300">
                CONTROL TRADING
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <ul className="flex space-x-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ease-in-out
                      ${isActive 
                        ? 'bg-blue-600/20 text-blue-400 shadow-lg shadow-blue-500/20' 
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      }
                      group relative overflow-hidden`}
                  >
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                    
                    {/* Content */}
                    <div className="flex items-center space-x-2 relative z-10">
                      <Icon className={`w-4 h-4 transition-transform duration-200 ${
                        isActive ? 'scale-110' : 'group-hover:scale-110'
                      }`}/>
                      <span className="font-medium">{label}</span>
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"/>
                    )}
                  </Link>
                </li>
              );
            })}

            {/* Trading Station Dropdown */}
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname.includes('/trading-station')
                    ? 'bg-blue-600/20 text-blue-400 shadow-lg shadow-blue-500/20'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                } group relative overflow-hidden`}>
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                  
                  {/* Content */}
                  <div className="flex items-center space-x-2 relative z-10">
                    <LayoutDashboard className={`w-4 h-4 transition-transform duration-200 ${
                      location.pathname.includes('/trading-station') ? 'scale-110' : 'group-hover:scale-110'
                    }`} />
                    <span className="font-medium">Trading Station</span>
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border border-gray-700">
                  {tradingStationVersions.map((version) => (
                    <DropdownMenuItem key={version.idProduct}>
                      <Link
                        to={version.path}
                        className="flex items-center px-2 py-1 w-full text-gray-300 hover:text-white"
                      >
                        Trading Station {version.version}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;