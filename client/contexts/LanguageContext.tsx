import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// Translation dictionary
const translations = {
  en: {
    // Header
    "header.title": "JBM Kaizen System",
    "header.language": "Language",

    // Form Labels
    "form.title": "Submit Kaizen Idea",
    "form.operatorName": "Operator Name",
    "form.operatorName.placeholder": "Enter your full name",
    "form.department": "Department",
    "form.department.placeholder": "Select your department",
    "form.plant": "Plant",
    "form.plant.placeholder": "Select your plant",
    "form.kaizenTitle": "Title of Kaizen",
    "form.kaizenTitle.placeholder": "Brief title of your improvement idea",
    "form.description": "Description of Idea",
    "form.description.placeholder":
      "Detailed description of your improvement idea",
    "form.expectedBenefits": "Expected Benefits",
    "form.expectedBenefits.placeholder": "Describe the expected benefits",
    "form.financialImpact": "Estimated Financial Impact (₹)",
    "form.financialImpact.placeholder": "Enter amount in rupees",
    "form.uploadImage": "Upload Image (Optional)",
    "form.uploadImage.hint":
      "Maximum 3MB, images will be compressed automatically",

    // Buttons
    "button.submit": "Submit Kaizen",
    "button.clear": "Clear Form",
    "button.login": "Login",

    // Success Messages
    "success.title": "Form Submitted Successfully!",
    "success.message": "Your Kaizen idea has been submitted.",
    "success.referenceId": "Your reference ID:",

    // Login
    "login.admin.title": "Admin Login",
    "login.superAdmin.title": "Super Admin Login",
    "login.username": "Username",
    "login.username.placeholder": "Enter your username",
    "login.password": "Password",
    "login.password.placeholder": "Enter your password",

    // Navigation
    "nav.adminLogin": "Admin Login",
    "nav.superAdminLogin": "Super Admin Login",
    "nav.home": "Home",

    // Departments
    "dept.production": "Production",
    "dept.quality": "Quality",
    "dept.maintenance": "Maintenance",
    "dept.engineering": "Engineering",
    "dept.hr": "Human Resources",
    "dept.finance": "Finance",

    // Plants
    "plant.pune": "Pune",
    "plant.aurangabad": "Aurangabad",
    "plant.nashik": "Nashik",
    "plant.chennai": "Chennai",
  },
  hi: {
    // Header
    "header.title": "जेबीएम काइज़न सिस्टम",
    "header.language": "भाषा",

    // Form Labels
    "form.title": "काइज़न आइडिया जमा करें",
    "form.operatorName": "ऑपरेटर का नाम",
    "form.operatorName.placeholder": "अपना पूरा नाम दर्ज करें",
    "form.department": "विभाग",
    "form.department.placeholder": "अपना विभाग चु��ें",
    "form.plant": "प्लांट",
    "form.plant.placeholder": "अपना प्लांट चुनें",
    "form.kaizenTitle": "काइज़न का शीर्षक",
    "form.kaizenTitle.placeholder": "अपने सुधार विचार का संक्षिप्त शीर्षक",
    "form.description": "विचार का विवरण",
    "form.description.placeholder": "अपने सुधार विचार का विस्तृत विवरण",
    "form.expectedBenefits": "अपेक्षित लाभ",
    "form.expectedBenefits.placeholder": "अपेक्षित लाभों का वर्णन करें",
    "form.financialImpact": "अनुमानित वित्तीय प्रभाव (₹)",
    "form.financialImpact.placeholder": "रुपये में राशि दर्ज करें",
    "form.uploadImage": "छवि अपलोड करें (वैकल्पिक)",
    "form.uploadImage.hint":
      "अधिकतम 3MB, छवियां स्वचालित रूप से संकुचित हो जाएंगी",

    // Buttons
    "button.submit": "काइज़न जमा करें",
    "button.clear": "फॉर्म साफ़ ���रें",
    "button.login": "लॉगिन",

    // Success Messages
    "success.title": "फॉर्म सफलतापूर्वक जमा हुआ!",
    "success.message": "आपका काइज़न विचार जमा हो गया है।",
    "success.referenceId": "आपका संदर्भ आईडी:",

    // Login
    "login.admin.title": "एडमिन लॉगिन",
    "login.superAdmin.title": "सुपर एडमिन लॉगिन",
    "login.username": "उपयोगकर्ता नाम",
    "login.username.placeholder": "अपना उपयोगकर्ता नाम दर्ज करें",
    "login.password": "पासवर्ड",
    "login.password.placeholder": "अपना पासवर्ड दर्ज करें",

    // Navigation
    "nav.adminLogin": "एडमिन लॉगिन",
    "nav.superAdminLogin": "सुपर एडमिन लॉगिन",
    "nav.home": "होम",

    // Departments
    "dept.production": "उत्पादन",
    "dept.quality": "गुणवत्ता",
    "dept.maintenance": "रखरखाव",
    "dept.engineering": "इंजीनियरिंग",
    "dept.hr": "मानव संसाधन",
    "dept.finance": "वित्त",

    // Plants
    "plant.pune": "पुणे",
    "plant.aurangabad": "औरंगाबाद",
    "plant.nashik": "नासिक",
    "plant.chennai": "चेन्नई",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
