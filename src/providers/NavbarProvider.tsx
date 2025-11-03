"use client";

import React, { useState, createContext } from 'react';

type NavbarContextState = {
  middleNavbar: React.ReactNode;
  setMiddleNavbar: (content: React.ReactNode) => void;
  endNavbar: React.ReactNode;
  setEndNavbar: (content: React.ReactNode) => void;
  showNavbar?: boolean;
  setShowNavbar?: (show: boolean) => void;
}

const NavbarContext = createContext<NavbarContextState>({
  middleNavbar: <></>,
  setMiddleNavbar: () => {},
  endNavbar: <></>,
  setEndNavbar: () => {},
  showNavbar: true,
  setShowNavbar: () => {},
});

export const useNavbar = () => React.useContext(NavbarContext);

export function NavbarProvider({ children }: { children: React.ReactNode }) {
  const [middleNavbar, setMiddleNavbar] = useState<React.ReactNode>(<></>);
  const [endNavbar, setEndNavbar] = useState<React.ReactNode>(<></>);
  const [showNavbar, setShowNavbar] = useState<boolean>(true);

  return (
    <NavbarContext.Provider value={{ middleNavbar, setMiddleNavbar, endNavbar, setEndNavbar, showNavbar, setShowNavbar }}>
      {children}
    </NavbarContext.Provider>
  );
}