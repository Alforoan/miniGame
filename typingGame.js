let wordCount = 500;
const url = `https://random-word-api.vercel.app/api?words=${wordCount}`;

fetch(url)
  .then((data) => data.json())
  .then((data) => {
    const filteredData = data.filter((word) => {
      return word.length < 7;
    });
    return filteredData;
  })
  .then((filteredData) => {
    console.log(filteredData);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
