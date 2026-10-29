const APILINK = "/api/v1/movies";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "/api/v1/movies/search?query=";

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("searchInput");

returnMovies(`${APILINK}?page=1`);

function returnMovies(url) {
  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Unable to load movies (${res.status})`);
      }
      return res.json();
    })
    .then((data) => {
      const container = document.createElement("div");
      container.className = "container-fluid overflow-hidden";

      const row = document.createElement("div");
      row.className = "row align-items-start gy-5";

      data.results.forEach((element) => {
        const col = document.createElement("div");
        col.className = "col col-lg-3 col-md-4 col-sm-6";

        col.innerHTML = `
          <div class="card text-bg-dark p-2">
            <img
              src="${IMG_PATH + element.poster_path}"
              class="card-img-top"
              alt="${element.title}"
              id = "image"
            >


            <div class="card-body">
              <h5 class="card-title" id="title">${element.title}<br>
              <a class="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href="movie.html?id=${element.id}&title=${encodeURIComponent(element.title)}">
  reviews
</a>
              </h5>
            </div>
          </div>
        `;

        row.appendChild(col);
      });

      container.appendChild(row);
      main.appendChild(container);
    });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  main.innerHTML = "";

  const searchTerm = search.value;

  if (searchTerm) {
    returnMovies(SEARCHAPI + searchTerm);
    search.value = "";
  }
});
