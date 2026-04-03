import React from "react";
import RouteProvider from "./RouteProvider";
import { UserProvider } from "./UserProvider";
import { PrimeReactProvider } from "primereact/api";
import ToastProvider from "./ToastProvider";
import { ConfigProvider } from "./ConfigProvider";

const MainProvider = ({ children, config }) => {
  return (
    <ConfigProvider config={config}>
      <UserProvider>
        <PrimeReactProvider>
          <RouteProvider>
            <ToastProvider>{children}</ToastProvider>
          </RouteProvider>
        </PrimeReactProvider>
      </UserProvider>
    </ConfigProvider>
  );
};

export default MainProvider;
