import { useLanguage, Language } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Factory, LogIn, Shield, Crown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  const isLoginPage = location.pathname.includes('login');

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Factory className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {t('header.title')}
              </h1>
              <p className="text-xs text-gray-500">Manufacturing Excellence</p>
            </div>
          </Link>

          {/* Navigation and Controls */}
          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            {!isLoginPage && (
              <nav className="hidden md:flex items-center space-x-4">
                <Link
                  to="/admin-login"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">{t('nav.adminLogin')}</span>
                </Link>
                <Link
                  to="/super-admin-login"
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <Crown className="w-4 h-4" />
                  <span className="text-sm">{t('nav.superAdminLogin')}</span>
                </Link>
              </nav>
            )}

            {/* Language Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 hidden sm:inline">
                {t('header.language')}:
              </span>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">
                    <div className="flex items-center space-x-2">
                      <span>🇺🇸</span>
                      <span>EN</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="hi">
                    <div className="flex items-center space-x-2">
                      <span>🇮🇳</span>
                      <span>हि</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mobile Menu for Login Links */}
            {!isLoginPage && (
              <div className="md:hidden">
                <Select value="" onValueChange={(value) => window.location.href = value}>
                  <SelectTrigger className="w-32">
                    <LogIn className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Login" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="/admin-login">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span>Admin</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="/super-admin-login">
                      <div className="flex items-center space-x-2">
                        <Crown className="w-4 h-4" />
                        <span>Super Admin</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
