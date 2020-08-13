
const postRequest = (url, data) => {
    return fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then()
    .catch((error) => console.log(error));
}

const getRequest = (url) => {
  return fetch(url)
    // .then((resp) => resp.json())
    .catch((error) => console.log(error));
};

const getTitle = (userScore) => {
  return fetch("/titles")
    .then((resp) => resp.json())
    .then((data) => {
      let i;
      for (i = 0; i < data.length - 1; ++i) {
        let minScore = data[i].minscore;
        let nextScore = data[i + 1].minscore;
        let name = data[i].name;
        let score = parseInt(userScore);
        if (score >= minScore && score < nextScore) {
          console.log(name);
          return name;
        }
      }
    });
};

export {getRequest, getTitle, postRequest}
