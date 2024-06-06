let works = [];
let categories = [];
//get work from server
function getWorks() {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((json) => {
      works = json;
      clearGallery();
      displayGallery(works);
    });
}
getWorks();

/*fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((json) => {
    works = json;
    clearGallery();
    displayGallery(works);
  });*/
  // get category fro server
fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((json) => {
    categories = json;
    addFilter(categories);
  });
let gallery = document.querySelector(".gallery");
function clearGallery() {
  gallery.innerHTML = "";
}

function clearModalGallery() {
  let modalGalleryPlayed = document.getElementById("modal-gallery");
  modalGalleryPlayed.innerHTML = "";
}

//function to create button called filterName
function createButton(filterName) {
  let filter = document.getElementById("filterContainer");
  let section = document.getElementById("portfolio");
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

// create filter for each category and handeling the click event 
function addFilter(categories) {
  if (token) {
    login.classList.add("hidden");
    filterAll.classList.add("hidden");
  } else {
    for (let i = 0; i < categories.length; i++) {
      
      createButton(categories[i].name);
      filterSelected[i + 1].addEventListener("click", function () {
        let categoryName = categories[i].name;
        filterActive[0].classList.remove("active");
        filterSelected[i + 1].classList.add("active");
        clearGallery();
        // filter work by category
        let filteredCategory = works.filter((works) => {
          return works.category.name == categoryName;
        });
        displayGallery(filteredCategory);
      });
    }
    logout.classList.add("hidden");
    modifyButton.classList.add("hidden");
    modifyIcon.classList.add("hidden");
  }
}
// handelling the selection of filter All 
let firstFilterSelected = document.getElementById("selected");
firstFilterSelected.addEventListener("click", function () {
  filterActive[0].classList.remove("active");
  firstFilterSelected.classList.add("active");
  clearGallery();
  displayGallery(works);
});

//display work gotten from server
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
}

logout.addEventListener("click", function () {
  window.localStorage.removeItem("Token");
  window.location.reload();
});

let isGalleryPlayed = false;
let modalGalleryImage = document.getElementById("modal-gallery");


function modalGallery(works) {
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
      div.remove();
      document.getElementById("image-" + imageId).remove();
     
     //delete work from server
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

function openFirstModal(e) {
  e.preventDefault();
  const target = document.getElementById("modal1");
  target.style.display = "flex";
  if (isGalleryPlayed == false) {
    modalGallery(works);
  }
  modal = target;
  modal.addEventListener("click", closeModal);
  modal
    .querySelector(".modal-wrapper")
    .addEventListener("click", stopPropagation);
  document.removeEventListener("click", openFirstModal);
}
function closeModal(e) {
  e.preventDefault();
  modal.style.display = "none";
  modal = null;
  document.removeEventListener("click", closeModal);
}
//handel closing by the X that close both modals and the roll back that close just the second modal 
function closeSecondModal(e, isCloseModal) {
  e.preventDefault();
  modal2.style.display = "none";
  modal2 = null;
  document.removeEventListener("click", closeSecondModal);
  if (!isCloseModal) {
    document.getElementById("modify").click();
  }

}
// stop closing modal when click inside 
function stopPropagation(e) {
  e.stopPropagation();
}


let isCategorySelectPlayed = false;
let categorySelect = document.getElementById("selectCategory");
let inputTitle = document.getElementById('title');
// make confirmation button disabled if one or more element are missed 
function enableBtn() {
  const title = document.getElementById("title").value;
  const select = document.getElementById("selectCategory");
  const categoryId = select.options[select.selectedIndex].value;
  const image = document.querySelector("input[type=file]").files[0]
  if (title != '' && categoryId != '' && image != undefined) {
    document.getElementById('confirmSend').classList.remove('disabled-btn');
    document.getElementById('confirmSend').removeAttribute('disabled');
  }
}
//when there is a change in the form call the function enableBtn
categorySelect.onchange = enableBtn;
inputTitle.oninput = enableBtn;


function openSecondModal(e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.display = "flex";

  modal2 = target;
  if (isCategorySelectPlayed == false) {
    for (var i = 0; i < categories.length; i++) {
      let option = document.createElement("option");
      option.value = categories[i].id;
      option.text = categories[i].name;
      option.className = "category";

      categorySelect.appendChild(option);
    }
  }
  isCategorySelectPlayed = true;
  closeModal(e);
}

document.getElementById("modify").addEventListener("click", openFirstModal);
document.getElementById("closeModalIcon").addEventListener("click", closeModal);
//"true" define that the seconde modal is closed
document
  .getElementById("closeSecondModalIcon")
  .addEventListener("click", function (e) {
    closeSecondModal(e, true)
  });

document
  .getElementById("addPictureButton")
  .addEventListener("click", openSecondModal);
imagePreview = document.getElementById("imagePreview");
browsePictures = document.getElementById("browsePictures");
pictureIcon = document.getElementById("pictureIcon");
imageSize = document.getElementById("imageSize");

document
  .getElementById("reopenFirstModal")
  .addEventListener("click", function (e) {
    closeSecondModal(e, false)
  });

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
  imagePreview.style.display = "flex";
  browsePictures.style.display = "none";
  pictureIcon.style.display = "none";
  imageSize.style.display = "none";
}

document.getElementById("confirmSend").addEventListener("click", function () {
  const formData = new FormData();
  const title = document.getElementById("title").value;
  const select = document.getElementById("selectCategory");
  const image = document.querySelector("input[type=file]").files[0];
  const categoryId = select.options[select.selectedIndex].value;
  if (title != '' && categoryId != '' && image != undefined) {
    formData.append("image", image);
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
          pictureIcon.style.display = "flex";
          imageSize.style.display = "flex";
          res.json().then((json) => {
            works.push(json);
            document.getElementById("modify").click()
            clearModalGallery();
            modalGallery(works);
            clearGallery();
            displayGallery(works);
          });
        }
      })
      .catch((err) => {
        console.log("caught it!", err);
      });
  } else {
    alert('some inputs are empty');
    document.getElementById('confirmSend').classList.add('disabled-btn');
    document.getElementById('confirmSend').setAttribute('disabled', '');
  }

});
