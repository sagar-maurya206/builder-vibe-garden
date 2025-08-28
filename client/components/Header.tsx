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
    <header className="bg-white border-b border-slate-200 professional-card" style={{ borderRadius: 0, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.08)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
              <Factory className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                {t('header.title')}
              </h1>
              <p className="text-sm text-slate-500 font-medium">Manufacturing Excellence</p>
            </div>
          </Link>

          {/* Navigation and Controls */}
          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            {!isLoginPage && (
              <nav className="hidden md:flex items-center space-x-6">
                <Link
                  to="/admin-login"
                  className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">{t('nav.adminLogin')}</span>
                </Link>
                <Link
                  to="/super-admin-login"
                  className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 font-medium"
                >
                  <Crown className="w-4 h-4" />
                  <span className="text-sm">{t('nav.superAdminLogin')}</span>
                </Link>
              </nav>
            )}

            {/* Language Toggle */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-slate-600 hidden sm:inline font-medium">
                {t('header.language')}:
              </span>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-28 border-slate-300 hover:border-slate-400 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-slate-200">
                  <SelectItem value="en" className="hover:bg-slate-50">
                    <div className="flex items-center space-x-2">
                      <span>🇺🇸</span>
                      <span className="font-medium">EN</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="hi" className="hover:bg-slate-50">
                    <div className="flex items-center space-x-2">
                      <span>🇮🇳</span>
                      <span className="font-medium">हि</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mobile Menu for Login Links */}
            {!isLoginPage && (
              <div className="md:hidden">
                <Select value="" onValueChange={(value) => window.location.href = value}>
                  <SelectTrigger className="w-36 border-slate-300">
                    <LogIn className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Login" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-200">
                    <SelectItem value="/admin-login" className="hover:bg-slate-50">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span className="font-medium">Admin</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="/super-admin-login" className="hover:bg-slate-50">
                      <div className="flex items-center space-x-2">
                        <Crown className="w-4 h-4" />
                        <span className="font-medium">Super Admin</span>
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
