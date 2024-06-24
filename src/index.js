document.addEventListener("DOMContentLoaded", () => {
  const quoteList = document.getElementById("quote-list");
  const newQuoteForm = document.getElementById("new-quote-form");
  const newQuote = document.getElementById("new-quote");
  const author = document.getElementById("author");
  // Fetch request
  fetch("http://localhost:3000/quotes?_embed=likes")
    .then((response) => response.json())
    .then((quotes) => {
      quotes.forEach((quote) => {
        quote.likesCount = quote.likes ? quote.likes.length : 0;
        renderQuote(quote);
      });
    });

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
      </blockquote>
    `;

    quoteList.appendChild(li);

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
  }
});
