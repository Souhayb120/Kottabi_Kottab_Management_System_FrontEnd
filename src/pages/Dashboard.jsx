import React, { useState } from "react";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import Sidebar from "../components/SideBar";
import NavBar from "../components/NavBar";

const Dashboard = ()=>{
    return(
         <>
      <div className="app-layout">
        <Sidebar />
        <div className="main">
          <NavBar />
          <div className="content">
             
          </div>
          <Footer />
        </div>
      </div>
    </>
    )
}
export default Dashboard;