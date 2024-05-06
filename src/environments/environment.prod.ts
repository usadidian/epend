export const environment = {
    production: true,
    appName: "eSamsatAdvance",
    appVersion: "V.1.0",
    appDevelopBy: "AMANDATA",
    appDevelopByDesc: "...",
    appDevelopByLogoPath: "assets/layout/images/logo.png",
    appCopyrightYear: "2023",
    appCopyrightBy: "Provinsi Maluku Utara",
    appCopyrightByLogoPath: "assets/layout/images/logo-owner.png",
    appCopyrightByDesc: "assets/layout/images/logo-owner.png",
    appBackendUrl: "http://localhost:5200/",
  
    userInfoLocalStorage: "userInfo",
    userInfo: {
        userName: localStorage.hasOwnProperty("userInfo")
            ? JSON.parse(localStorage.getItem("userInfo"))["nama_user"]
            : "user_unknown",
        userAvatar: localStorage.hasOwnProperty("userInfo")
            ? JSON.parse(localStorage.getItem("userInfo"))["Avatar"]
            : "assets/layout/images/avatar.png",
    },
    firebaseConfig: {
        apiKey: "AIzaSyD74UZw5-HtjWegBvTa9u55wYJ_Wrkg7uI",
        authDomain: "epad2021-441f3.firebaseapp.com",
        projectId: "epad2021-441f3",
        storageBucket: "epad2021-441f3.appspot.com",
        messagingSenderId: "831760010355",
        appId: "1:831760010355:web:e287e4804f6ccd8a9b2e06",
    },
};
