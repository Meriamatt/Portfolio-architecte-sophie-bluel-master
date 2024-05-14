const apiUserUrl = "http://localhost:5678/api/users/login";



  let submit= document.getElementById("submit");
  let email = document.getElementById("email");
  let password = document.getElementById("password");

  // Build formData object.
  let formData = new FormData();
  formData.append('email', email.value);
  formData.append('password', password.value );

submit.addEventListener("click",function(event) {
    event.preventDefault();
    fetch(apiUserUrl, {
      method: "POST",
      body:JSON.stringify ({
        email: email.value,
        password: password.value,
        
      }),
      headers: {
          'Accept': 'application/json, text/plain, */*',
             'Content-Type': 'application/json'
        }
     
    })
      .then((response) => response.json())
      .then((json) => {
       if (json.error){
        alert("Nom d'utilisateur ou mot de passe érroné");
       }
       else {
        console.log(json);
        window.localStorage.setItem("Token", json.token);
        window.location.replace("index.html");
       }
      });
}
)

