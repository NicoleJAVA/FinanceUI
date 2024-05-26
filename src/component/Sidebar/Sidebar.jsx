import "./Sidebar.scss";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';

import { Navbar, Nav } from 'react-bootstrap';


const DEMO = "demo";
const GUIDE = "guide";

export const Sidebar = () => {
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState(DEMO);

    const location = useLocation();

    useEffect(() => {
        switch (location.pathname) {

            case '/demo':
                setCurrentTab(DEMO);
                break;

            default:
                break;
        }

    }, [location]);

    const OnClickDemo = () => {
        setCurrentTab(DEMO);
        navigate("/demo");
    };




    return (
        <div className="sidebar-container">

            <Nav className="mr-auto flex-column" >
                <Nav.Item className="sidebar-item" >
                    <Nav.Link href="#demo" active>
                        <div class="selected-bar"></div>

                        Demo
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="sidebar-item">
                    <Nav.Link href="#my-page">
                        <div class="selected-bar"></div>
                        My Page</Nav.Link>
                </Nav.Item>
                <Nav.Item className="sidebar-item">
                    <Nav.Link href="#another-link">
                        <div class="selected-bar"></div>
                        Another Link</Nav.Link>
                </Nav.Item>
            </Nav>

        </div>

    );
}


// <Navbar expand="lg">
// <Navbar.Brand href="#home">Navbar</Navbar.Brand>
// <Navbar.Toggle aria-controls="basic-navbar-nav" />
// <Navbar.Collapse id="basic-navbar-nav">
//     <Nav className="mr-auto flex-column" >
//         <Nav.Item>
//             <Nav.Link href="#home">Home</Nav.Link>
//         </Nav.Item>
//         <Nav.Item>
//             <Nav.Link href="#link">Link</Nav.Link>
//         </Nav.Item>
//         <Nav.Item>
//             <Nav.Link href="#another-link">Another Link</Nav.Link>
//         </Nav.Item>
//     </Nav>
// </Navbar.Collapse>
// </Navbar>