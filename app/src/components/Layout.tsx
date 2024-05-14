import { ReactElement } from "react";
import { Outlet } from "react-router-dom";

export const Layout = (): ReactElement => (
  <>
    <Outlet />
  </>
);
