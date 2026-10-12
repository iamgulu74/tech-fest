export type Language = 'en' | 'hi';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    'nav.medqueue': 'MedQueue',
    'nav.learn': 'Learn',
    'nav.premium': 'Premium',

    // Hero
    'hero.badge': 'Intelligent Healthcare Academy',
    'hero.title_1': 'Master Your ',
    'hero.title_highlight': 'Well-being',
    'hero.title_2': '.',
    'hero.subtitle': 'Verified medical intelligence for the digital age. Explore 500+ categories curated by world-class healthcare professionals.',
    'hero.search_placeholder': 'Symptoms, diseases, or wellness tips...',

    // Trial Banner
    'trial.badge': 'Instant Access',
    'trial.waitlist': 'Waitlist Depleted',
    'trial.title_1': 'Start Your ',
    'trial.title_highlight': '7-Day Free',
    'trial.title_2': ' Trial',
    'trial.desc': 'Unlock the elite library, certification courses, and verified medical intelligence. No commitment required.',
    'trial.cta': 'Unlock Premium Portal',
    'trial.plans': 'View All Plans',

    // Tabs
    'tabs.all': 'All Modules',
    'tabs.premium': 'Premium Only',
    'tabs.courses': 'Certifications',
    'tabs.restricted': 'Access Restricted',

    // Categories
    'cat.diseases': 'Diseases',
    'cat.diseases.count': '',
    'cat.diseases.desc': 'Detailed guides on Diabetes, Heart Disease, Cancer, and more.',
    'cat.treatments': 'Treatments',
    'cat.treatments.count': '',
    'cat.treatments.desc': 'Understand medications, surgeries, and diagnostic procedures.',
    'cat.wellness': 'Wellness',
    'cat.wellness.count': 'Free Access',
    'cat.wellness.desc': 'Nutrition, physical exercise, mental health protocols & personalized diet plans',
    'cat.firstaid': 'First Aid',
    'cat.firstaid.count': 'Instant Help',
    'cat.firstaid.desc': 'Emergency response guides — CPR, bleeding, choking & more',
    'cat.courses': 'Courses',
    'cat.courses.count': 'Certifications',
    'cat.courses.desc': 'Structured learning paths with verified certification.',
    'cat.childhealth': 'Child Health',
    'cat.childhealth.count': 'Care Guides',
    'cat.childhealth.desc': 'Vaccination schedules, growth tracking, and child nutrition.',

    'cat.index_size': 'Index Size',
    'cat.vip_active': 'VIP Active',
    'cat.premium_badge': 'Premium',
    'cat.unlock': 'Unlock with Trial',
    'cat.explore': 'Explore Module',
    'cat.request_access': 'Request Access',

    // AI Section
    'ai.title': 'Neural Health Assistant',
    'ai.limit': '2 Daily Questions Left',
    'ai.desc': 'State-of-the-art medical reasoning engine. Get instant, verified answers about symptoms, medication interactions, and wellness protocols.',
    'ai.q1': 'What are the early indicators of type 2 diabetes?',
    'ai.q2': 'Explain the side effects of Metformin',
    'ai.q3': 'How to improve REM sleep naturally?',
    'ai.q4': 'Heart attack vs. Heartburn: Key differences',
    'ai.accuracy': 'Knowledge Accuracy',
    'ai.cta': 'Query Neural Engine',

    // Expert Section
    'expert.badge': 'Quality Assurance',
    'expert.title_1': 'Verified by the ',
    'expert.title_highlight': 'Medical Council',

    // Video Section
    'video.title': 'Healthcare Feed',
    'video.library': 'Show Library',
    'video.enrolled': '12K Enrolled',

    // News Section
    'news.title': 'India Health News',
    'news.feed': 'Pulse Feed',
    'news.alert': 'Critical Alert',
    'news.headline': 'Dengue Outbreak: Northern Corridor Red Zone',
    'news.headline_desc': 'Health ministry issues level 4 emergency protocols as diagnostic hubs report exponential growth in positive cases across the sector.',
    'news.subscribe': 'Subscribe to India Health News Feed',

    // Footer
    'footer.copyright': '© 2026 AI Health Hub • Certified Medical Education',
    'footer.governance': 'Governance',
    'footer.ethics': 'Ethics Panel',
    'footer.sources': 'Verified Sources',
    'footer.privacy': 'Data Privacy',
    'pricing.trial': 'Trial Explorer',
    'pricing.individual': 'Individual',
    'pricing.family': 'Family',
    'pricing.plus': 'Plus',
    'pricing.free': 'Free',
    'pricing.month': '/month',
    'pricing.week': 'for 7 days',
    'pricing.start_trial': 'Start 7-Day Trial',
    'pricing.popular': 'Most Popular',
    'pricing.title': 'Invest in Your Health',
    'pricing.subtitle': 'Choose a plan that fits your needs. Every plan starts with a 7-Day Free Trial.',
    'pricing.back': 'Back to Learn Hub',
    'pricing.check': 'No charge for 7 days • Cancel anytime',
    'pricing.feat_library': 'Full Health Library Access',
    'pricing.feat_ai': 'Unlimited AI Assistant Queries',
    'pricing.feat_protocols': 'Verified Care Protocols'
  },

  hi: {
    // Nav
    'nav.medqueue': 'मेडक्यू',
    'nav.learn': 'सीखें',
    'nav.premium': 'प्रीमियम',

    // Hero
    'hero.badge': 'इंटेलिजेंट हेल्थकेयर अकादमी',
    'hero.title_1': 'अपनी ',
    'hero.title_highlight': 'सेहत',
    'hero.title_2': ' में महारत हासिल करें।',
    'hero.subtitle': 'डिजिटल युग के लिए सत्यापित चिकित्सा ज्ञान। विश्व-स्तरीय स्वास्थ्य पेशेवरों द्वारा क्यूरेट की गई 500+ श्रेणियां खोजें।',
    'hero.search_placeholder': 'लक्षण, बीमारियाँ, या स्वास्थ्य सुझाव...',

    // Trial Banner
    'trial.badge': 'तुरंत एक्सेस',
    'trial.waitlist': 'वेटलिस्ट समाप्त',
    'trial.title_1': 'अपना ',
    'trial.title_highlight': '7-दिन मुफ़्त',
    'trial.title_2': ' ट्रायल शुरू करें',
    'trial.desc': 'एलीट लाइब्रेरी, सर्टिफिकेशन कोर्स और सत्यापित चिकित्सा ज्ञान अनलॉक करें। कोई प्रतिबद्धता नहीं।',
    'trial.cta': 'प्रीमियम पोर्टल अनलॉक करें',
    'trial.plans': 'सभी प्लान देखें',

    // Tabs
    'tabs.all': 'सभी मॉड्यूल',
    'tabs.premium': 'केवल प्रीमियम',
    'tabs.courses': 'प्रमाणन',
    'tabs.restricted': 'एक्सेस प्रतिबंधित',

    // Categories
    'cat.diseases': 'बीमारियाँ',
    'cat.diseases.count': '',
    'cat.diseases.desc': 'मधुमेह, हृदय रोग, कैंसर और अन्य पर विस्तृत गाइड।',
    'cat.treatments': 'उपचार',
    'cat.treatments.count': '',
    'cat.treatments.desc': 'दवाइयों, सर्जरी और नैदानिक प्रक्रियाओं को समझें।',
    'cat.wellness': 'स्वास्थ्य',
    'cat.wellness.count': 'मुफ़्त एक्सेस',
    'cat.wellness.desc': 'पोषण, शारीरिक व्यायाम और मानसिक स्वास्थ्य प्रोटोकॉल।',
    'cat.firstaid': 'प्राथमिक चिकित्सा',
    'cat.firstaid.count': 'तुरंत सहायता',
    'cat.firstaid.desc': 'CPR, रक्तस्राव और दम घुटने के लिए आपातकालीन प्रतिक्रिया गाइड।',
    'cat.courses': 'पाठ्यक्रम',
    'cat.courses.count': 'प्रमाणन',
    'cat.courses.desc': 'सत्यापित प्रमाणन के साथ संरचित सीखने के मार्ग।',
    'cat.childhealth': 'बाल स्वास्थ्य',
    'cat.childhealth.count': 'देखभाल गाइड',
    'cat.childhealth.desc': 'टीकाकरण शेड्यूल, विकास ट्रैकिंग और बाल पोषण।',

    'cat.index_size': 'इंडेक्स आकार',
    'cat.vip_active': 'VIP सक्रिय',
    'cat.premium_badge': 'प्रीमियम',
    'cat.unlock': 'ट्रायल से अनलॉक करें',
    'cat.explore': 'मॉड्यूल खोलें',
    'cat.request_access': 'एक्सेस अनुरोध करें',

    // AI Section
    'ai.title': 'न्यूरल हेल्थ असिस्टेंट',
    'ai.limit': '2 दैनिक प्रश्न शेष',
    'ai.desc': 'अत्याधुनिक चिकित्सा तर्क इंजन। लक्षणों, दवा इंटरैक्शन और स्वास्थ्य प्रोटोकॉल के बारे में तुरंत सत्यापित उत्तर प्राप्त करें।',
    'ai.q1': 'टाइप 2 मधुमेह के शुरुआती संकेत क्या हैं?',
    'ai.q2': 'मेटफॉर्मिन के दुष्प्रभाव बताएं',
    'ai.q3': 'REM नींद स्वाभाविक रूप से कैसे सुधारें?',
    'ai.q4': 'हार्ट अटैक बनाम सीने में जलन: मुख्य अंतर',
    'ai.accuracy': 'ज्ञान सटीकता',
    'ai.cta': 'न्यूरल इंजन से पूछें',

    // Expert Section
    'expert.badge': 'गुणवत्ता आश्वासन',
    'expert.title_1': '',
    'expert.title_highlight': 'चिकित्सा परिषद',

    // Video Section
    'video.title': 'हेल्थकेयर फ़ीड',
    'video.library': 'लाइब्रेरी दिखाएं',
    'video.enrolled': '12K नामांकित',

    // News Section
    'news.title': 'भारत स्वास्थ्य समाचार',
    'news.feed': 'पल्स फीड',
    'news.alert': 'गंभीर अलर्ट',
    'news.headline': 'डेंगू प्रकोप: उत्तरी कॉरिडोर रेड ज़ोन',
    'news.headline_desc': 'स्वास्थ्य मंत्रालय ने लेवल 4 आपातकालीन प्रोटोकॉल जारी किए क्योंकि डायग्नोस्टिक हब्स ने पॉजिटिव केसों में तीव्र वृद्धि की रिपोर्ट की।',
    'news.subscribe': 'भारत स्वास्थ्य समाचार फीड सब्सक्राइब करें',

    // Footer
    'footer.copyright': '© 2026 AI हेल्थ हब • प्रमाणित चिकित्सा शिक्षा',
    'footer.governance': 'शासन',
    'footer.ethics': 'नैतिकता पैनल',
    'footer.sources': 'सत्यापित स्रोत',
    'footer.privacy': 'डेटा गोपनीयता',
    'pricing.trial': 'ट्रायल एक्सप्लोरर',
    'pricing.individual': 'व्यक्तिगत',
    'pricing.family': 'फैमिली',
    'pricing.plus': 'प्लस',
    'pricing.free': 'मुफ़्त',
    'pricing.month': '/माह',
    'pricing.week': '7 दिनों के लिए',
    'pricing.start_trial': '7-दिन का ट्रायल शुरू करें',
    'pricing.popular': 'सबसे लोकप्रिय',
    'pricing.title': 'अपने स्वास्थ्य में निवेश करें',
    'pricing.subtitle': 'वह प्लान चुनें जो आपकी ज़रूरतों के हिसाब से हो। हर प्लान 7-दिन के मुफ़्त ट्रायल के साथ शुरू होता है।',
    'pricing.back': 'लर्न हब पर वापस जाएं',
    'pricing.check': '7 दिनों के लिए कोई शुल्क नहीं • कभी भी रद्द करें',
    'pricing.feat_library': 'पूर्ण स्वास्थ्य पुस्तकालय एक्सेस',
    'pricing.feat_ai': 'असीमित AI सहायक प्रश्न',
    'pricing.feat_protocols': 'सत्यापित देखभाल प्रोटोकॉल'
  }
};
