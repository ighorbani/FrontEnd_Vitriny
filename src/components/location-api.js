export const search = (params) => {
  return fetch(`https://map.ir/search/v2/`, {
    method: "POST",
    headers: {
      "x-api-key": process.env.REACT_APP_MAP_API_URL,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
};
