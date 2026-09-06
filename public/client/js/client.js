document.addEventListener('DOMContentLoaded', () => {
    //SEARCH
  const formSearch = document.querySelector("#form-search")
  if(formSearch){
    formSearch.addEventListener("submit",(event)=>{
    event.preventDefault();
    //console.log(event.target.elements.keyword.value)
    const value = event.target.elements.keyword.value;
    let url = new URL(window.location.href)
    url.searchParams.delete("keyword")
    if(value){
        url.searchParams.set("keyword",value)
        url.searchParams.set("page",1)
    }
    else{
        url.searchParams.delete("keyword")
    }
    window.location.href = url
    event.target.elements.keyword.value = ""
  })
  }

  //PAGINATION
  const buttonsPage = document.querySelectorAll(".page-link")
  if(buttonsPage){
    let url = new URL(window.location.href)
    buttonsPage.forEach(button =>{
        button.addEventListener("click",()=>{
            const buttonPage = button.getAttribute("button-page")

                url.searchParams.set("page",buttonPage)

            
            window.location.href = url;
        })
    })
  }
});