let resultArr = [];

async function fetchData() {
  const url =
    "https://random-words5.p.rapidapi.com/getMultipleRandom?count=50&minLength=3&maxLength=4";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "ecf9287ab3msh2692a85d4872d36p166937jsn6fe006813282",
      "X-RapidAPI-Host": "random-words5.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    const dataArray = JSON.parse(result);

    resultArr = dataArray
      .filter((word) => word.includes("a"))
      .sort((a, b) => a.length - b.length);

    const wordCount = resultArr.filter((word) => word.length === 3).length;
    console.log(resultArr);
    if (wordCount < 3) {
      await fetchData();
    }
  } catch (error) {
    console.error(error);
  }
}

fetchData();
