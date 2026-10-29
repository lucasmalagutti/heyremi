const url = new URL(location.href);
const movieId = url.searchParams.get("id");
const movieTitle = url.searchParams.get("title");

const APILINK = `http://localhost:8000/api/v1/reviews/`;

const main = document.getElementById("section");
const title = document.getElementById("title");
const reviewForm = document.getElementById("reviewForm");
const reviewFormMessage = document.getElementById("reviewFormMessage");

title.innerText = movieTitle;

returnReviews(APILINK);

function returnReviews(url) {
  fetch(url + "movie/" + movieId)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Unable to load reviews (${res.status})`);
      }
      return res.json();
    })
    .then((data) => {
      const container = document.createElement("div");
      container.className = "container-fluid overflow-hidden";

      const row = document.createElement("div");
      row.className = "row align-items-start gy-5";

      data.forEach((review) => {
        const col = document.createElement("div");
        col.className = "col col-lg-3 col-md-4 col-sm-6";

        col.innerHTML = `
          <div class="card text-bg-dark p-2" id="${review._id}">
            <div class="card-body">
              <p><strong>Review: </strong>${review.review}</p>
              <p><strong>User: </strong>${review.user}</p>
              <p><a href="#" class="link-dark" onclick="editReview('${review._id}', '${review.review}',
              '${review.user}')">✏️​</a> <a href="#" class="link-dark" onclick="deleteReview('${review._id}')">🗑️​</a></p>
            </div>
          </div>
        `;

        row.appendChild(col);
      });

      container.appendChild(row);
      main.appendChild(container);
    });
}

reviewForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const user = document.getElementById("reviewUser").value.trim();
  const review = document.getElementById("reviewText").value.trim();

  if (!movieId || !user || !review) {
    reviewFormMessage.textContent = "Fill user and review fields.";
    return;
  }

  try {
    const response = await fetch(APILINK + "new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user, review, movieId }),
    });

    if (!response.ok) {
      throw new Error(`Unable to save review (${response.status})`);
    }

    reviewForm.reset();
    reviewFormMessage.textContent = "Review published.";
    location.reload();
  } catch (error) {
    reviewFormMessage.textContent = error.message;
  }
});

function editReview(id, review, user) {
  const element = document.getElementById(id);
  const reviewInputId = "review" + id;
  const userInputId = "user" + id;

  element.innerHTML = `
              <p><strong>Review: </strong>
              <input class="form-control" type="text" id="${reviewInputId}" value="${review}">
              </p>
              <p><strong>User: </strong>
              <input class="form-control" type="text" id="${userInputId}" value="${user}">
              </p>
              <p>
              <a href="#" class="link-dark" onclick="saveReview('${reviewInputId}', '${userInputId}',
              '${id}')">💾​​</a></p>
  `;
}

function saveReview(reviewInputId, userInputId, id = "") {
  const review = document.getElementById(reviewInputId).value;
  const user = document.getElementById(userInputId).value;
  if (id) {
    fetch(APILINK + id, {
      method: "PUT",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user, review: review }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        location.reload();
      });
  } else {
    fetch(APILINK + "new", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user, review: review, movieId: movieId }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        location.reload();
      });
  }
}

function deleteReview(id) {
  fetch(APILINK + id, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      location.reload();
    });
}
