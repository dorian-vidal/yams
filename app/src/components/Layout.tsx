import { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

export const Layout = (): ReactElement => (
  <>
    <Header />

    <Outlet />
  </>
);
