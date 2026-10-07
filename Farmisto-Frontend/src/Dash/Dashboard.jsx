import React from "react";
import SideNav from "./SideNav";
import Maindash from "./Maindash";

const Dashboard = () => {
  return (
    <div className="flex w-screen h-screen bg-cream overflow-hidden scrollbar-none">
      <SideNav />
      <Maindash />
    </div>
  );
};

export default Dashboard;
