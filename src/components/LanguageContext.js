
import React, { 
    createContext, 
    useContext, 
    useState, 
    useEffect, 
    useCallback, 
    useMemo 
} from 'react';

const LanguageContext = createContext();
export const useLanguage = () => useContext(LanguageContext);

const translationCache = new Map();

// HARDCODED FIX: Manually set the correct translation 
translationCache.set("Clear", "நீக்கு");

const fetchTamilTranslation = async (text) => {
    if (!text || typeof text !== 'string') return '';
    const trimmedText = text.trim();
    if (translationCache.has(trimmedText)) {
        return translationCache.get(trimmedText);
    }

    try {
        const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ta&dt=t&q=${encodeURIComponent(trimmedText)}`
        );
        const result = await response.json();
        const translatedText = result[0][0][0];
        translationCache.set(trimmedText, translatedText);
        return translatedText;
    } catch (error) {
        console.error("Error in translation API for:", trimmedText, error);
        return trimmedText;
    }
};


export const LanguageProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        return localStorage.getItem("appLanguage") === "TA" ? "TA" : "EN";
    });
    
    const [cacheVersion, setCacheVersion] = useState(0); 
    
    const toggleLanguage = () => {
        translationCache.clear();
        setCurrentLanguage(prevLang => prevLang === "EN" ? "TA" : "EN");
    };

  
    const t = useCallback((englishText) => {
        const trimmedText = englishText.trim();
        
        if (currentLanguage === 'EN' || !trimmedText) {
            return englishText; 
        }

        if (translationCache.has(trimmedText)) {
            return translationCache.get(trimmedText); 
        }
        
         fetchTamilTranslation(trimmedText)
            .then(() => {
                setCacheVersion(prev => prev + 1);
            })
            .catch(() => {});
     
        return englishText; 
    }, [currentLanguage]);


    useEffect(() => {
        localStorage.setItem("appLanguage", currentLanguage);
        document.body.classList.remove('lang-en', 'lang-ta');
        document.body.classList.add(`lang-${currentLanguage.toLowerCase()}`);
    }, [currentLanguage]);

    // Memoize the context value including cacheVersion for updates
    const value = useMemo(() => ({
        currentLanguage,
        toggleLanguage,
        t,
        cacheVersion
    }), [currentLanguage, toggleLanguage, t, cacheVersion]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
