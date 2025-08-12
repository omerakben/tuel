// src/index.ts
var cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};
var isServer = typeof window === "undefined";
var isClient = !isServer;
export {
  cn,
  isClient,
  isServer
};
