// export const toComaSeparate = (val) => String(val).replace(/(.)(?=(.{3})+$)/g,"$1,")
// export const toComaSeparate = (val) => {
//   return String(val).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
// }

export const toComaSeparate = val => {
  let parts = String(val).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

export const toNumber = (val) => {
  return Number(val.replace(/,/g, ""))
}
