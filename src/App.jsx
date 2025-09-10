import React, { useEffect, useState, useRef } from "react";
import {
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";
import { useSelector, useAppDispatch } from "./redux/hooks";
import {
  DemoPage, MyPage, SellPage, InventoryPage,
  SellHistoryPage, SellHistoryDetail, AllHistoryPage, BuyPage
} from "./pages";
import { Sidebar } from "./component/Sidebar/Sidebar";
import { ToastStack } from "./ToastStack/ToastStack";
import "./App.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./helpers/fontawesome";


import { useTranslation } from 'react-i18next';
import SellPreviewPage from "./pages/sellPage/SellPreviewPage";

function App() {
  const dispatch = useAppDispatch();
  const toastStackRef = useRef();


  const { t } = useTranslation();

  return (
    <div>
      <HashRouter>
        <div className="app-fluid-container">
          <Sidebar class="sidebar" />
          <ToastStack ref={toastStackRef} id="toast-stack" />

          <div className="app-content">
            <Routes>
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/my-page" element={<MyPage t={t} />} />
              <Route path="/transaction" element={<SellPage />} />
              <Route path="/buy" element={<BuyPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/sell-history" element={<SellHistoryPage />} />
              <Route path="/sell-history/:id" element={<SellHistoryDetail />} />
              <Route path="/all-history" element={<AllHistoryPage />} />
              <Route path="/sell-preview" element={<SellPreviewPage />} />


              <Route path="*" element={<SellPage />} />

              <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
          </div>
        </div>
      </HashRouter>

    </div>
  );
}

export default App;
