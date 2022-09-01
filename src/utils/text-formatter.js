export const capitalizeFirstLetter = (val) => {
  return val ? val.charAt(0).toUpperCase() + val.slice(1) : '';
}

export const isValidURL = (string) => {
  let res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g);
  return (res !== null)
};

export const sendFormatter = (val) => {
  return val.trim().toLowerCase();
}

export const trancateString  = (val, count = 4) => {
  if (!val) return ''
  if (val.length <= count * 2) return val

  return`${val.substr(0, count)}...${val.substr(val.length - count)}`;
}