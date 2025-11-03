import React, { useState } from "react";
// import { useOutletContext } from "react-router-dom";

export const tableStaticProps = {
  paginator: true,
  lazy: true,
  rows: 10,
  selectionMode: "checkbox",
  rowsPerPageOptions: [10, 20, 25, 50, 75, 100],
  paginatorTemplate:
    "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport",
  currentPageReportTemplate: `Cəm: {totalRecords}`,
  emptyMessage: "Mövcud məlumat yoxdur",
  stripedRows: true,
};

// standart parametrlər
const DataTableContainer = ({ children }) => {
  // const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // const { isSidebarOpen } = useOutletContext();

  // React.useEffect(() => {
  //   const handleResize = () => setWindowWidth(window.innerWidth);
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  // const sidebarWidth = isSidebarOpen ? 270 : 76;
  // const maxWidth = windowWidth - sidebarWidth;

  const style = {
    flex: 1,
    overflowY: "auto",
    overflowX: "auto",
    // width: "100%",
    // maxWidth: `${maxWidth}px`,
    fontSize: "12px",
    transition: "max-width 0.2s",
  };

  return <div style={style}>{children}</div>;
};

export default DataTableContainer;
