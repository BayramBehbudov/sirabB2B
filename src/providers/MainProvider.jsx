import React from "react";
import RouteProvider from "./RouteProvider";
import { UserProvider } from "./UserProvider";
import { PrimeReactProvider } from "primereact/api";
import ToastProvider from "./ToastProvider";

const MainProvider = ({ children }) => {
  return (
    <UserProvider>
      <PrimeReactProvider>
        <RouteProvider>
          <ToastProvider>{children}</ToastProvider>
        </RouteProvider>
      </PrimeReactProvider>
    </UserProvider>
  );
};

export default MainProvider;
