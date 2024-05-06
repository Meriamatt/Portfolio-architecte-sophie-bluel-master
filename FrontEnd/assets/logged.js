let works = [];
let gallery = document.querySelector(".gallery");
const reponse = fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((json) => {
    works = json;
    displayGallery(works);
  });


function displayGallery(works) {
  for (let i = 0; i < works.length; i++) {
    let image = document.createElement("img");
    let figcaption = document.createElement("figcaption");
    image.src = works[i].imageUrl;
    figcaption = works[i].title;
    let div = document.createElement("div");
    gallery.appendChild(div);
    div.append(image);
    div.append(figcaption);
  }
}
