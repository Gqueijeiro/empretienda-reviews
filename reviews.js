// reviews.js

async function fetchReviews() {
  try {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/1VkrVoNVKMhNAEwsmh7jvXcfhV7vQa-EAirdOSIgpFT8/gviz/tq?tqx=out:csv";
    const response = await fetch(sheetUrl);
    const text = await response.text();

    // Parsear CSV
    const rows = text.split("\n").map(r => r.split(","));
    const headers = rows.shift().map(h => h.trim().toLowerCase());

    const reviews = rows.map(row => {
      let review = {};
      headers.forEach((h, i) => review[h] = row[i]?.trim());
      return review;
    });

    injectReviews(reviews);

  } catch (e) {
    console.error("Error cargando reseñas:", e);
  }
}

function injectReviews(reviews) {
  // Detectar si es home (no hay h1 de producto) o producto
  const productTitle = document.querySelector("h1")?.innerText?.trim();
  const container = document.createElement("div");
  container.style.margin = "20px 0";
  container.innerHTML = "<h2>Reseñas</h2>";

  let toShow = reviews;

  if (productTitle) {
    // Página de producto
    toShow = reviews.filter(r =>
      r.producto && r.producto.toLowerCase() === productTitle.toLowerCase()
    );
    if (toShow.length === 0) {
      container.innerHTML += "<p>Este producto todavía no tiene reseñas.</p>";
    }
  }

  toShow.forEach(r => {
    container.innerHTML += formatReview(r);
  });

  // Insertar automáticamente al final del contenido
  const main = document.querySelector("main") || document.body;
  main.appendChild(container);
}

function formatReview(r) {
  const stars = "⭐".repeat(parseInt(r.estrellas || 0));
  return `
    <div style="border:1px solid #ddd; border-radius:10px; padding:10px; margin:10px 0; background:#fafafa;">
      <p><strong>${r.cliente || "Cliente anónimo"}</strong></p>
      <p>${stars}</p>
      <p>${r.comentario || ""}</p>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", fetchReviews);
