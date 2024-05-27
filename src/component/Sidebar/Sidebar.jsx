import "./Sidebar.scss";
import { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';



export const Sidebar = () => {


    const [activeKey, setActiveKey] = useState('#demo');

    const handleSelect = (selectedKey) => {
        setActiveKey(selectedKey);
    };



    return (
        <div className="sidebar-container">

            <Nav className="mr-auto flex-column" activeKey={activeKey} onSelect={handleSelect}>
                <Nav.Item className="sidebar-item">
                    <Nav.Link as={NavLink} to="/demo" isActive={() => activeKey === '/demo'} onClick={() => handleSelect('/demo')}>
                        <div className="selected-bar"></div>
                        Demo
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="sidebar-item">
                    <Nav.Link as={NavLink} to="/my-page" isActive={() => activeKey === '/my-page'} onClick={() => handleSelect('/my-page')}>
                        <div className="selected-bar"></div>
                        My Page
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="sidebar-item">
                    <Nav.Link as={NavLink} to="/another-link" isActive={() => activeKey === '/another-link'} onClick={() => handleSelect('/another-link')}>
                        <div className="selected-bar"></div>
                        Another Link
                    </Nav.Link>
                </Nav.Item>
            </Nav>

        </div>

    );
}
