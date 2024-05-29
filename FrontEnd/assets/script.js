let works = [];
let categories = [];
function getWorks() {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((json) => {
      works = json;
      clearGalery();
      displayGallery(works);

      console.log(works);
    });
}
getWorks();

const reponse = fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((json) => {
    works = json;
    clearGalery();
    displayGallery(works);
  });
const response = fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((json) => {
    categories = json;
    addFilter(categories);
    console.log(categories);
  });
let gallery = document.querySelector(".gallery");
function clearGalery() {
  gallery.innerHTML = "";
}

function clearmodalGalery() {
  let modalGalleryPlayed = document.getElementById("modal-gallery");
  modalGalleryPlayed.innerHTML = "";
  console.log("gallery played")
}

//function to create button called filterName
function createButton(filterName) {
  let filter = document.getElementById("filterContainer");
  let section = document.getElementById("portfolio");
  console.log(filter);
  let button = document.createElement("button");
  button.innerText = filterName;
  button.className = "filter";
  filter.appendChild(button);
  section.appendChild(filter);
  section.insertBefore(filter, gallery);
}

let filterSelected = document.getElementsByClassName("filter");
let filterActive = document.getElementsByClassName("active");
let token = window.localStorage.getItem("Token");
let login = document.getElementById("login");
let logout = document.getElementById("logout");
let filterAll = document.getElementById("selected");
let modifyIcon = document.getElementById("modifyIcon");
let modifyButton = document.getElementById("modify");
function addFilter(categories) {
  if (token) {
    login.classList.add("display");
    filterAll.classList.add("display");
  } else {
    for (let i = 0; i < categories.length; i++) {
      // instance of filterName with the value of categories name from the table categories
      createButton(categories[i].name);
      console.log(filterSelected);
      filterSelected[i + 1].addEventListener("click", function () {
        console.log("click", categories[i].name);
        let categorieName = categories[i].name;
        filterActive[0].classList.remove("active");
        filterSelected[i + 1].classList.add("active");
        clearGalery();
        let filteredCategorie = works.filter((works) => {
          return works.category.name == categorieName;
        });
        displayGallery(filteredCategorie);
      });
    }
    logout.classList.add("display");
    modifyButton.classList.add("display");
    modifyIcon.classList.add("display");
  }
}
let firstFilterSelected = document.getElementById("selected");
firstFilterSelected.addEventListener("click", function () {
  console.log("click", firstFilterSelected);
  filterActive[0].classList.remove("active");
  firstFilterSelected.classList.add("active");
  console.log(filterActive);
  clearGalery();
  displayGallery(works);
});

function displayGallery(works) {
  for (let i = 0; i < works.length; i++) {
    let image = document.createElement("img");
    let figcaption = document.createElement("figcaption");
    image.src = works[i].imageUrl;
    figcaption = works[i].title;
    let div = document.createElement("div");
    div.id = "image-" + works[i].id;
    gallery.appendChild(div);
    div.append(image);
    div.append(figcaption);
  }
}

function clearLocalStorage() {
  window.localStorage.removeItem("Token");
  /*window.location.replace("index.html")*/
}

logout.addEventListener("click", function () {
  window.localStorage.removeItem("Token");
  window.location.reload();
});

let isGalleryPlayed = false;
let modalGalleryImage = document.getElementById("modal-gallery");
console.log(modalGalleryImage);

function modalGalery(works) {
  console.log(works);
  for (let i = 0; i < works.length; i++) {
    let image = document.createElement("img");
    image.src = works[i].imageUrl;
    let div = document.createElement("div");
    let icon = document.createElement("i");
    let imageId = works[i].id;
    icon.classList.add("fa-solid");
    icon.classList.add("fa-trash-can");
    icon.classList.add("iconPosition");
    icon.addEventListener("click", function () {
      console.log(imageId);
      div.remove();
      document.getElementById("image-" + imageId).remove();
      console.log(works);
      const element = document.getElementById("image-" + imageId);

      fetch("http://localhost:5678/api/works/" + imageId, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
    });
    div.classList.add("divPosition");
    modalGalleryImage.appendChild(div);
    div.append(image);
    div.append(icon);
  }
  isGalleryPlayed = true;
}
let modal = null;
let modal2 = null;

function openFirstModal() {
  //e.preventDefault();
  const target = document.getElementById("modal1");
  console.log(target);
  target.style.display = "flex";
  if (isGalleryPlayed == false) {
    modalGalery(works);
  }
  modal = target;
  modal.addEventListener("click", closeModal);
  modal
    .querySelector(".modal-wrapper")
    .addEventListener("click", stopPropagation);
}
function closeModal(e) {
  e.preventDefault();
  modal.style.display = "none";
  modal = null;
}

function closeSecondModal(e) {
  e.preventDefault();
  modal2.style.display = "none";
  modal2 = null;
}
function stopPropagation(e) {
  e.stopPropagation();
}
let iscategorySelectPlayed = false;
let categorySelect = document.getElementById("selectCategory");
function openSecondModal(e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.display = "flex";
  
  modal2 = target;
  if (iscategorySelectPlayed == false) {
    for (var i = 0; i < categories.length; i++) {
      let option = document.createElement("option");
      option.value = categories[i].id;
      option.text = categories[i].name;
      option.className = "category";

      categorySelect.appendChild(option);
    }
  }
  iscategorySelectPlayed = true;
  closeModal(e);
}

document.getElementById("modify").addEventListener("click", openFirstModal);
document.querySelector(".fa-xmark").addEventListener("click", closeModal);
document
  .getElementById("closeSecondModalIcon")
  .addEventListener("click", closeSecondModal);

document
  .getElementById("addPictureButton")
  .addEventListener("click", openSecondModal);
imagePreview = document.getElementById("imagePreview");
browsePictures = document.getElementById("browsePictures");
pictureIcone = document.getElementById("pictureIcone");
imageSize = document.getElementById("imageSize");

function previewFile() {
  var preview = imagePreview;
  var file = document.querySelector("input[type=file]").files[0];
  var reader = new FileReader();

  reader.onloadend = function () {
    preview.src = reader.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
  }
  console.log(file);
  console.log(preview);
  imagePreview.style.display = "flex";
  browsePictures.style.display = "none";
  pictureIcone.style.display = "none";
  imageSize.style.display = "none";
}

document.getElementById("confirmSend").addEventListener("click", function () {
  const formData = new FormData();
  const title = document.getElementById("title").value;
  const select = document.getElementById("selectCategory");

  const categoryName = select.options[select.selectedIndex].name;
  const categoryId = select.options[select.selectedIndex].value;
  formData.append("image", document.querySelector("input[type=file]").files[0]);
  formData.append("title", title);
  formData.append("category", categoryId);
  fetch("http://localhost:5678/api/works/", {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
    body: formData,
  })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw new Error(text);
        });
      } else {
        modal2.style.display = "none";
        modal2 = null;
        document.getElementsByTagName("form")[0].reset();
        imagePreview.style.display = "none";
        browsePictures.style.display = "flex";
        pictureIcone.style.display = "flex";
        imageSize.style.display = "flex";
        console.log(works);
        res.json().then((json) => {
          works.push(json);
          openFirstModal();
          clearmodalGalery();
          modalGalery(works);
        });
        console.log(works);
      }
    })
    .catch((err) => {
      console.log("caught it!", err);
    });
});
