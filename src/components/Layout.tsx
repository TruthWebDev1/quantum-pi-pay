
import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ChevronRight, Home, PlusCircle, BarChart3, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showBackButton = false,
  title
}) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-40 md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu size={24} />
      </Button>
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out z-30",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-6">
          <div className="flex items-center mb-8">
            <div className="h-8 w-8 bg-pi-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <h1 className="text-xl font-bold ml-2 text-gray-900">QuantumPay</h1>
          </div>
          
          <nav className="space-y-1">
            <NavLink to="/dashboard" isActive={isActive("/dashboard")}>
              <Home size={20} className="mr-3" />
              Dashboard
            </NavLink>
            
            <NavLink to="/create-payment" isActive={isActive("/create-payment")}>
              <PlusCircle size={20} className="mr-3" />
              Create Payment
            </NavLink>
            
            <NavLink to="/payment-history" isActive={isActive("/payment-history")}>
              <BarChart3 size={20} className="mr-3" />
              Payment History
            </NavLink>
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="font-medium text-sm text-gray-700">JD</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">user@example.com</p>
            </div>
          </div>
          
          <Link to="/" className="mt-4 flex items-center text-sm text-gray-600 hover:text-gray-900 w-full py-2">
            <LogOut size={18} className="mr-3" /> 
            Sign Out
          </Link>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-200">
        {/* Page header */}
        {(showBackButton || title) && (
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.history.back()}
                className="mr-4"
              >
                <ArrowLeft size={20} />
              </Button>
            )}
            {title && (
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            )}
          </header>
        )}
        
        {/* Page content */}
        <main className="p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} QuantumPay
            </p>
            <div className="flex items-center">
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                Built with Pi SDK
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  children: ReactNode;
  isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, isActive }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors",
        isActive
          ? "bg-pi-purple text-white"
          : "text-gray-700 hover:bg-gray-100"
      )}
    >
      {children}
      {isActive && <ChevronRight size={18} className="ml-auto" />}
    </Link>
  );
};

export default Layout;
