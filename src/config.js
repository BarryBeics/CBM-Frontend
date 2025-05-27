export const graphqlEndpoint =
  process.env.NODE_ENV === "production"
    ? "http://134.209.183.65:8080/query"
    : "http://localhost:8080/query";

export const isProd = process.env.NODE_ENV === "production";
export const fixedDevTime = 1743372000;
