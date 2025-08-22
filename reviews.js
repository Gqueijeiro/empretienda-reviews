// reviews.js

async function fetchReviews() {
  try {
    // ⚠️ IMPORTANTE: este link es el de tu sheet publicado en CSV
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

    renderGlobalReviews(reviews);
    renderProductReviews(reviews);

  } catch (e) {
    console.error("Error cargando reseñas:", e);
  }
}

// Render reseñas globales
function renderGlobalReviews(reviews) {
  const container = document.getElementById("reviews-global");
  if (!container) return;

  container.innerHTML = reviews.map(r => formatReview(r)).join("");
}

// Render reseñas por producto
function renderProductReviews(reviews) {
  const container = document.getElementById("reviews-producto");
  if (!container) return;

  // Buscar nombre de producto en la página (Empretienda lo suele poner en <h1>)
  const productTitle = document.querySelector("h1")?.innerText?.trim();
  if (!productTitle) return;

  const filtered = reviews.filter(r =>
    r.producto && r.producto.toLowerCase() === productTitle.toLowerCase()
  );

  container.innerHTML = filtered.length
    ? filtered.map(r => formatReview(r)).join("")
    : "<p>Este producto todavía no tiene reseñas.</p>";
}

// Generar HTML de cada reseña
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

// Ejecutar al cargar
document.addEventListener("DOMContentLoaded", fetchReviews);