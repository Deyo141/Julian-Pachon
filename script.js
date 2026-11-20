document.getElementById("anio").textContent = new Date().getFullYear();

// Tema claro/oscuro
const raiz = document.documentElement;
const guardado = localStorage.getItem("tema");
if (guardado) raiz.dataset.tema = guardado;
else if (matchMedia("(prefers-color-scheme: dark)").matches) raiz.dataset.tema = "oscuro";
document.getElementById("tema").addEventListener("click", () => {
  const nuevo = raiz.dataset.tema === "oscuro" ? "claro" : "oscuro";
  raiz.dataset.tema = nuevo;
  localStorage.setItem("tema", nuevo);
});

// Título del hero: el ancho de la letra sigue al cursor
const nombre = document.getElementById("nombre");
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  addEventListener("pointermove", (e) => {
    nombre.style.fontVariationSettings = `"wdth" ${(75 + (e.clientX / innerWidth) * 25).toFixed(1)}`;
  });
}

// Lector de posts: un post a la vez
const posts = [...document.querySelectorAll(".post")];
const indice = document.getElementById("indice");
let actual = posts[0].id;

posts.forEach((p, i) => {
  const b = document.createElement("button");
  b.textContent = `Post ${i + 1}: ${p.querySelector("h3").textContent}`;
  b.dataset.id = p.id;
  b.addEventListener("click", () => mostrar(p.id, true));
  indice.append(b);
});

function mostrar(id, subir) {
  actual = id;
  posts.forEach((p) => (p.hidden = p.id !== id));
  indice.querySelectorAll("button").forEach((b) =>
    b.setAttribute("aria-current", b.dataset.id === id));
  pintarComentarios();
  if (subir) document.getElementById("posts").scrollIntoView();
}

// Comentarios (se guardan solo en este navegador)
const lista = document.getElementById("lista-com");
const form = document.getElementById("form-com");
const leer = () => {
  try { return JSON.parse(localStorage.getItem("com-" + actual)) || []; } catch { return []; }
};

function pintarComentarios() {
  lista.innerHTML = "";
  const cs = leer();
  if (!cs.length) {
    const li = document.createElement("li");
    li.className = "vacio";
    li.textContent = "No comments yet. Be the first to answer.";
    lista.append(li);
  }
  cs.forEach((c) => {
    const li = document.createElement("li");
    const b = document.createElement("b");
    b.textContent = c.autor;
    li.append(b, c.texto);
    lista.append(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll("input, textarea").forEach((c) => {
    const v = c.value.trim().length > 0;
    c.classList.toggle("error", !v);
    if (!v) ok = false;
  });
  if (!ok) return;
  const cs = leer();
  cs.push({ autor: form.autor.value.trim(), texto: form.texto.value.trim() });
  try { localStorage.setItem("com-" + actual, JSON.stringify(cs)); } catch {}
  form.reset();
  pintarComentarios();
});

mostrar(actual, false);