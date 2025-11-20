import { translations } from './Translater';

const translateText = (text, targetLanguage) => {
    // Check if the text is a predefined translation key
    if (translations[targetLanguage][text]) {
      return translations[targetLanguage][text];
    }
  
    // If text is not a predefined key, return it as-is
    return text;
  };

export default translateText;
