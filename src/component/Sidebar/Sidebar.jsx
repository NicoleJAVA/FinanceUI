import "./Sidebar.scss";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import avatar from "../../../src/img/avatar.png";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import ThemeToggleVar from "../ThemeToggleVar/ThemeToggleVar";

export const Sidebar = () => {
    const [activeKey, setActiveKey] = useState("#demo");

    const handleSelect = (selectedKey) => {
        setActiveKey(selectedKey);
    };

    // 定義選單項目
    const navItems = [
        { path: "/demo", label: "Demo", subtitle: "測試" },
        { path: "/my-page", label: "My Page", subtitle: "測試" },
        { path: "/transaction", label: "Transaction", subtitle: "測試" },
        { path: "/inventory", label: "Inventory", subtitle: "測試" },
        { path: "/history", label: "History", subtitle: "測試" },
        { path: "/another-link", label: "Another Link", subtitle: "測試" },
    ];

    return (
        <div className="sidebar-container">
            {/* <div className="avatar-container">
                <img src={avatar} alt="Avatar" className="avatar" />
            </div>
            <ThemeToggle /> */}
            <ThemeToggleVar />
            <Nav
                className="mr-auto flex-column mt-4"
                activeKey={activeKey}
                onSelect={handleSelect}
            >
                {navItems.map((item) => (
                    <Nav.Item key={item.path} className="sidebar-item">
                        <Nav.Link
                            as={NavLink}
                            to={item.path}
                            onClick={() => handleSelect(item.path)}
                            className="sidebar-link"
                        >
                            <div className="selected-bar"></div>
                            <div className="sidebar-link-right-container">
                                <div className="sidebar-item-label-container">
                                    {item.label}
                                </div>
                                <div className="sidebar-item-subtitle">
                                    {item.subtitle}
                                </div>
                            </div>

                        </Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>
        </div>
    );
};

// import "./Sidebar.scss";  // todo dele
// import { useState, useEffect } from "react";
// import { NavLink } from 'react-router-dom';
// import { Nav } from 'react-bootstrap';
// import avatar from '../../../src/img/avatar.png';
// import ThemeToggle from "../ThemeToggle/ThemeToggle";

// export const Sidebar = () => {


//     const [activeKey, setActiveKey] = useState('#demo');

//     const handleSelect = (selectedKey) => {
//         setActiveKey(selectedKey);
//     };



//     return (
//         <div className="sidebar-container">
//             <div class="avatar-container">
//                 <img src={avatar} alt="Avatar" class="avatar" />
//             </div>
//             <ThemeToggle />
//             <Nav className="mr-auto flex-column mt-4" activeKey={activeKey} onSelect={handleSelect}>
//                 <Nav.Item className="sidebar-item">
//                     <Nav.Link as={NavLink} to="/demo" isActive={() => activeKey === '/demo'} onClick={() => handleSelect('/demo')}>
//                         <div className="selected-bar"></div>
//                         Demo
//                     </Nav.Link>
//                 </Nav.Item>
//                 <Nav.Item className="sidebar-item">
//                     <Nav.Link as={NavLink} to="/my-page" isActive={() => activeKey === '/my-page'} onClick={() => handleSelect('/my-page')}>
//                         <div className="selected-bar"></div>
//                         My Page
//                     </Nav.Link>
//                 </Nav.Item>
//                 <Nav.Item className="sidebar-item">
//                     <Nav.Link as={NavLink} to="/transaction" isActive={() => activeKey === '/transaction'} onClick={() => handleSelect('/transaction')}>
//                         <div className="selected-bar"></div>
//                         Transaction
//                     </Nav.Link>
//                 </Nav.Item>
//                 <Nav.Item className="sidebar-item">
//                     <Nav.Link as={NavLink} to="/inventory" isActive={() => activeKey === '/inventory'} onClick={() => handleSelect('/inventory')}>
//                         <div className="selected-bar"></div>
//                         Inventory
//                     </Nav.Link>
//                 </Nav.Item>
//                 <Nav.Item className="sidebar-item">
//                     <Nav.Link as={NavLink} to="/history" isActive={() => activeKey === '/inventory'} onClick={() => handleSelect('/history')}>
//                         <div className="selected-bar"></div>
//                         History
//                     </Nav.Link>
//                 </Nav.Item>
//                 <Nav.Item className="sidebar-item">
//                     <Nav.Link as={NavLink} to="/another-link" isActive={() => activeKey === '/another-link'} onClick={() => handleSelect('/another-link')}>
//                         <div className="selected-bar"></div>
//                         Another Link
//                     </Nav.Link>
//                 </Nav.Item>
//             </Nav>

//         </div>

//     );
// }
