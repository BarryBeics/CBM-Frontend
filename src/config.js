export const graphqlEndpoint =
  process.env.NODE_ENV === "production"
    ? "https://api.scalpelhound.com/query"
    : "http://localhost:8080/query";

export const isProd = process.env.NODE_ENV === "production";
export const fixedDevTime = 1743372000;
