document.addEventListener("DOMContentLoaded", () => {
  const quoteList = document.getElementById("quote-list");
  const newQuoteForm = document.getElementById("new-quote-form");
  const newQuoteInput = document.getElementById("new-quote");
  const authorInput = document.getElementById("author");
  // Fetch request
  fetch("http://localhost:3000/quotes?_embed=likes")
    .then((response) => response.json())
    .then((quotes) => {
      quotes.forEach((quote) => {
        quote.likesCount = quote.likes ? quote.likes.length : 0;
        renderQuote(quote);
      });
    });

  //Post request
  newQuoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newQuote = {
      quote: newQuoteInput.value,
      author: authorInput.value,
    };

    fetch("http://localhost:3000/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuote),
    })
      .then((response) => response.json())
      .then((quote) => {
        quote.likesCount = 0;
        renderQuote(quote);
      });

    newQuoteForm.reset();
  });

  //display quotes
  function renderQuote(quote) {
    const li = document.createElement("li");
    li.className = "quote-card";
    li.innerHTML = `
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quote.likesCount}</span></button>
        <button class='btn-danger'>Delete</button>
          <button class='btn-edit'>Edit</button>
        <form class='edit-form' style='display: none;'>
          <input type='text' class='edit-quote' value='${quote.quote}'>
          <input type='text' class='edit-author' value='${quote.author}'>
          <button type='submit'>Save</button>
        </form>
      </blockquote>
    `;

    quoteList.appendChild(li);

    // update the likes
    const likeButton = li.querySelector(".btn-success");
    likeButton.addEventListener("click", () => {
      fetch("http://localhost:3000/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId: quote.id }),
      }).then(() => {
        quote.likesCount += 1;
        const likesSpan = likeButton.querySelector("span");
        likesSpan.textContent = quote.likesCount;
      });
    });

    // delete spacific quote
    const deleteButton = li.querySelector(".btn-danger");
    deleteButton.addEventListener("click", () => {
      fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: "DELETE",
      }).then(() => li.remove());
    });

    // edit section
    const editButton = li.querySelector(".btn-edit");
    const editForm = li.querySelector(".edit-form");
    const editQuoteInput = editForm.querySelector(".edit-quote");
    const editAuthorInput = editForm.querySelector(".edit-author");

    editButton.addEventListener("click", () => {
      editForm.style.display =
        editForm.style.display === "none" ? "block" : "none";
    });

    editForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const updatedQuote = {
        quote: editQuoteInput.value,
        author: editAuthorInput.value,
      };

      fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedQuote),
      })
        .then((response) => response.json())
        .then((updated) => {
          quote.quote = updated.quote;
          quote.author = updated.author;
          renderQuote();
        });
    });
  }
});
