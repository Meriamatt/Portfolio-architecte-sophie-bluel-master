let works = [];
let categories = [];
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


//function to create button called filterName
function createButton(filterName){
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



 let filterSelected = document.getElementsByClassName ("filter");
  let filterActive = document.getElementsByClassName ("active");
  let token = window.localStorage.getItem("Token");
  let login = document.getElementById("login");
  let logout = document.getElementById("logout"); 
  let filterAll = document.getElementById("selected");
  let modifyIcon = document.getElementById("modifyIcon");
  let modifyButton = document.getElementById("modify");
function addFilter(categories) {

  if (token){
login.classList.add("display");
filterAll.classList.add("display");
  }
  else {
for (let i = 0; i < categories.length; i++){
// instance of filterName with the value of categories name from the table categories
 createButton(categories[i].name);
 console.log(filterSelected);
       filterSelected[i+1].addEventListener("click", function() {
             console.log("click", categories[i].name);
             let categorieName = categories[i].name;
             filterActive[0].classList.remove ("active");
             filterSelected[i+1].classList.add ("active");
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
 let firstFilterSelected = document.getElementById ("selected");
 firstFilterSelected.addEventListener("click", function() {
  
              console.log("click", firstFilterSelected);
              filterActive[0].classList.remove ("active");
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
    gallery.appendChild(div);
    div.append(image);
    div.append(figcaption);
  }
}

function clearLocalStorage() {
        window.localStorage.removeItem("Token")
        /*window.location.replace("index.html")*/
    }

logout.addEventListener("click", function(){
window.localStorage.removeItem("Token")
window.location.reload
}

);
