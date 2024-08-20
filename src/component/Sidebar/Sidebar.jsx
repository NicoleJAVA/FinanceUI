import "./Sidebar.scss";
import { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import avatar from '../../../src/img/avatar.png';
import ThemeToggle from "../ThemeToggle/ThemeToggle";

export const Sidebar = () => {


    const [activeKey, setActiveKey] = useState('#demo');

    const handleSelect = (selectedKey) => {
        setActiveKey(selectedKey);
    };



    return (
        <div className="sidebar-container">
            <div class="avatar-container">
                <img src={avatar} alt="Avatar" class="avatar" />
            </div>
            <ThemeToggle />
            <Nav className="mr-auto flex-column mt-4" activeKey={activeKey} onSelect={handleSelect}>
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
                    <Nav.Link as={NavLink} to="/transaction" isActive={() => activeKey === '/transaction'} onClick={() => handleSelect('/transaction')}>
                        <div className="selected-bar"></div>
                        Transaction
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="sidebar-item">
                    <Nav.Link as={NavLink} to="/inventory" isActive={() => activeKey === '/inventory'} onClick={() => handleSelect('/inventory')}>
                        <div className="selected-bar"></div>
                        Inventory
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
