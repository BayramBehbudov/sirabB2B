import { Toast } from "primereact/toast";
import React, { useRef, useEffect, Fragment } from "react";

let toastRef = null;

const setToastRef = (ref) => {
  toastRef = ref;
};

export const showToast = ({
  severity = "info", // "success" | "warn" | "error"
  summary = "",
  detail = "",
  life = 3000,
}) => {
  toastRef?.show({ severity, summary, detail, life });
};

const ToastProvider = ({ children }) => {
  const ref = useRef(null);

  useEffect(() => {
    setToastRef(ref.current);
  }, []);

  return (
    <Fragment>
      <Toast ref={ref} />
      {children}
    </Fragment>
  );
};
export default ToastProvider;
