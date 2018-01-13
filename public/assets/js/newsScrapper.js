$(document).ready(function() {
  console.log("loaded");
  $('.searchArticle').on("click", ()=>{
    console.log("clicked");
    fetch("/api/search", {
				method : 'GET'
			}).then(response => response.json()).then(data =>{
        console.log(data);
      });
  });
});
