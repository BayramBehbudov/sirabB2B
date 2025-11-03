export const setCookie = (key, value, expiresAt) => {
  document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(
    JSON.stringify(value)
  )};expires=${new Date(expiresAt).toUTCString()};path=/`;
};


export const getCookie = (key) => {
  const nameEQ = encodeURIComponent(key) + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        return JSON.parse(decodeURIComponent(c.substring(nameEQ.length)));
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

export const deleteCookie = (key) => {
  document.cookie = `${encodeURIComponent(
    key
  )}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};
