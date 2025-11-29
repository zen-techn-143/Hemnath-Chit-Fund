import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Button, Collapse, Modal } from "react-bootstrap";
import { BsBoxArrowRight } from "react-icons/bs";
import sidebarConfig from "./menuItems";
import { FiUser } from "react-icons/fi";
import { ClickButton } from "../ClickButton";
import { LuDot } from "react-icons/lu";
import { useLanguage } from '../LanguageContext';
// 💡 New Imports for the Toggle Icon
import { IconButton,Box } from "@mui/material"; 
import SettingsIcon from '@mui/icons-material/Settings';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// 🎚️ Theme/Language Toggle Icons
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import CheckIcon from '@mui/icons-material/Check'; // ADD CheckIcon

const SideBar = ({ onLogout, currentTheme, toggleTheme,setTheme }) => { 
// ----------------------------------------------------
  const [user, setUser] = useState({});
  const [openMenu, setOpenMenu] = useState(
    JSON.parse(localStorage.getItem("openMenu")) || {}
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { currentLanguage, toggleLanguage, t, cacheVersion } = useLanguage();
  // Define the missing state variables
  const [translatedMenu, setTranslatedMenu] = useState(sidebarConfig); // The config is imported at the top
  const [staticT, setStaticT] = useState({ 
    // language: "Language", 
    languageTamil: "தமிழ்", 
    languageEnglish: "English" 
  });

  const themePalettes = [
  { id: 'A', label: 'Regal Gold', color: '#D4AF37' }, // Theme A: Gold
  { id: 'B', label: 'Mint', color: '#426d4d'}, // Theme B: Mint/Teal
  { id: 'C', label: 'RusticRuby', color:  ' #7c755f'},
  { id: 'D', label: 'Deep Emerald', color: '#5f1f1fd1'}
];

  useEffect(() => {
    const translateMenu = async () => {
        const configToTranslate = await Promise.all(sidebarConfig.map(async item => {
            // Translate main item text
            const translatedItem = {
                ...item,
                text: await t(item.text), 
            };
            
            // Translate sub-menu items if they exist
            if (item.subMenu) {
                translatedItem.subMenu = await Promise.all(item.subMenu.map(async subItem => ({
                    ...subItem,
                    text: await t(subItem.text), 
                })));
            }
            return translatedItem;
        }));
        
        // Translate static texts in the menu
        const [langText, langTamil, langEnglish] = await Promise.all([
            t("Language"),
            t("தமிழ்"),
            t("English")
        ]);

        setTranslatedMenu(configToTranslate);
        setStaticT({
            language: langText,
            languageTamil: langTamil,
            languageEnglish: langEnglish
        });
    }

    // Since t() now returns English first and triggers re-render, 
    // for complex structures like the menu, we can switch to an 
    // async approach in useEffect for smoother transition.
    translateMenu();
    
    // This runs on language change AND when a new translation is added to the cache
  }, [currentLanguage, cacheVersion]); // 👈 CRITICAL FIX: DEPENDS ON cacheVersion

  // ✅ EXISTING FUNCTIONS to handle Menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleMenuClick = (menuIndex) => {
    setOpenMenu((prevOpenMenu) => {
      const newOpenMenu = {};
      for (const key in prevOpenMenu) {
        newOpenMenu[key] = false;
      }
      newOpenMenu[menuIndex] = !prevOpenMenu[menuIndex];
      return newOpenMenu;
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    localStorage.setItem("openMenu", JSON.stringify(openMenu));
    
    // 💡 Add language class handling here if needed for CSS translation
    document.body.classList.remove('lang-en', 'lang-ta');
    document.body.classList.add(`lang-${currentLanguage.toLowerCase()}`);

  }, [openMenu, currentLanguage]);

  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();

    localStorage.removeItem("user");

    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleShowLogoutModal = () => setShowLogoutModal(true);
  const handleCloseLogoutModal = () => setShowLogoutModal(false);

  

  return (
    <>
      <div id="sidebar-wrapper" className={isSidebarOpen ? "wrap-remove" : ""}>
        {/* ... (Sidebar menu content remains the same) */}
        <div className="list-group regular">
          <ul>
            <li>
              <div className="user-logo mx-auto py-3">
                <img
                  src={require("./images/logo1.png")}
                  className="img-fluid logo"
                  alt="Sri Krishna Finance"
                />
              </div>
            </li>
            {translatedMenu.map((item, index) => (
              <li key={index}>
                {item.subMenu ? (
                  <>
                    <div
                      className="sub-menu nav-link"
                      onClick={() => handleMenuClick(index)}
                    >
                      <span className="list-icon">{item.icon}</span>
                      <span className="list-text">{item.text}</span> {/* Needs external translation mechanism */}
                      <span
                        className={`list-icon arrow ${
                          openMenu[index] ? "rotate" : ""
                        }`}
                      >
                        <MdOutlineKeyboardArrowRight />
                      </span>
                    </div>
                    <Collapse in={openMenu[index]}>
                      <ul className="submenu-list">
                        {item.subMenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <NavLink
                              to={subItem.path}
                              className="nav-link"
                              onClick={() => {
                                if (window.innerWidth <= 768) {
                                  setIsSidebarOpen(false);
                                }
                              }}
                            >
                              <span className="list-icon">
                                {subItem.icon ? subItem.icon : <LuDot />}{" "}
                              </span>
                              <span className="list-text">{subItem.text}</span> {/* Needs external translation mechanism */}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </Collapse>
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    className="nav-link"
                    onClick={() => {
                      if (window.innerWidth <= 768) {
                        setIsSidebarOpen(false);
                      }
                    }}
                  >
                    <span className="list-icon">{item.icon}</span>
                    <span className="list-text">{item.text}</span> {/* Needs external translation mechanism */}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* ---------------------------------------------------- */}
      {/* HEADER / NAVBAR SECTION */}
      {/* ---------------------------------------------------- */}
      <div className="navbar navbar-expand px-lg-4 header">
        {/* ... (Toggle sidebar buttons remain the same) ... */}
        <div className="d-lg-block d-none">
          <Button
            className="menu-toggle"
            onClick={toggleSidebar}
            id="menu-toggle"
          >
            <span className="navbar-toggler-icon"></span>
          </Button>
        </div>
        <div className="d-block d-lg-none ms-auto">
          <Button
            className="menu-toggle"
            onClick={toggleSidebar}
            id="menu-toggle"
          >
            <span className="navbar-toggler-icon"></span>
          </Button>
        </div>
        <div className="collapse navbar-collapse" id="navbar-list">
          <ul className="navbar-nav ms-auto">
            
            {/* 🛑 NEW: 1. LANGUAGE TOGGLE BUTTON (Moved out of Menu) */}
            {/* <li className="nav-item mx-3">
              <span style={{ marginRight: '8px', fontWeight: 'bold', lineHeight: '30px' }}> */}
                {/* {staticT.language}: */}
              {/* </span>
              <IconButton 
                onClick={toggleLanguage} 
                color="primary"
                title={currentLanguage === 'EN' ? `Switch to Tamil (${staticT.languageTamil})` : `Switch to English (${staticT.languageEnglish})`}
                sx={{ marginTop: '-10px' }}
              >
                {currentLanguage === 'TA' ? (
                  <ToggleOnIcon fontSize="large" /> 
                ) : (
                  <ToggleOffIcon fontSize="large" />
                )}
              </IconButton>
            </li> */}
            <li className="nav-item mx-3">
              <IconButton 
                onClick={handleMenuOpen}
                color="primary" 
                title="Settings"
                sx={{ marginTop: '-10px' }}
              >
                <SettingsIcon fontSize="large" /> 
              </IconButton>
            </li>
            
            {/* Existing User Info */}
            <li className="nav-item mx-3">
              <span className="mx-1">
                <FiUser />
              </span>
              <span className="mx-1"style={{ paddingTop: '10px' }}
              >{user?.name || "Aravind"}</span>
            </li>
            
            {/* Existing Logout Button */}
            <li className="nav-item mx-3">
              <button onClick={handleShowLogoutModal}>
                <span className="list-icon" style={{ paddingTop: '10px' }}>
                  <BsBoxArrowRight />
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <Modal
        show={showLogoutModal}
        onHide={handleCloseLogoutModal}
        centered
        backdrop="static"
      >
        <Modal.Header>
        <Modal.Title>{t("Logout Confirmation")}</Modal.Title>
        </Modal.Header>
        {/* ✅ TRANSLATED MODAL BODY */}
      <Modal.Body>{t("Are you sure you want to logout?")}</Modal.Body>
        <Modal.Footer>
          {/* ✅ TRANSLATED BUTTON LABELS */}
          <ClickButton label={t("Cancel")} onClick={handleCloseLogoutModal} />
          <ClickButton
            label={t("Logout")}
            variant="primary"
            onClick={handleLogout}
          />
        </Modal.Footer>
      </Modal>

      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {/* New title for the Theme Selection section */}
        <MenuItem style={{ cursor: 'default', fontWeight: 'bold' }}>
          {t("Select Theme")}
        </MenuItem>

        {/* 🛑 NEW: RENDER FOUR THEME PALETTES */}
        {themePalettes.map((theme) => (
          <MenuItem 
            key={theme.id}
            onClick={() => {
              setTheme(theme.id); // Call new setTheme function with theme ID
              handleMenuClose();  // Close menu after selection
            }}
            style={{ 
              minWidth: '150px',
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Color Palette Swatch */}
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: theme.color,
                  marginRight: 1.5,
                  border: currentTheme === theme.id ? '2px solid' : '1px solid #ccc',
                  borderColor: currentTheme === theme.id ? 'primary.main' : '#ccc',
                }}
              />
              {t(theme.label)} {/* Translate theme label */}
            </Box>
            
            {/* Checkmark for active theme */}
            {currentTheme === theme.id && (
              <CheckIcon color="primary" fontSize="small" />
            )}
          </MenuItem>
        ))}
        {/* <MenuItem 
          onClick={(e) => e.stopPropagation()} 
          style={{ cursor: 'default', display: 'flex', justifyContent: 'space-between', minWidth: '150px' }}
        >
          {/* ✅ TRANSLATED THEME LABEL */}
          {/* <span style={{ marginRight: '16px', fontWeight: 'bold' }}>{t("Theme")}:</span> */}
          
          {/* <IconButton 
            onClick={toggleTheme} 
            color="primary"
            title={currentTheme === 'A' ? 'Switch to Theme B' : 'Switch to Theme A'}
          >
            {currentTheme === 'B' ? (
              <ToggleOnIcon fontSize="large" /> 
            ) : (
              <ToggleOffIcon fontSize="large" />
            )}
          </IconButton> */}
        {/* </MenuItem>  */}
        
   
        
      </Menu>
    </>
  );
};

export default SideBar;