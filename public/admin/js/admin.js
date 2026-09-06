document.addEventListener('DOMContentLoaded', () => {
  //FILTER
  const filterButtons = document.querySelectorAll("[button-status]")
  if(filterButtons.length>0){
    let url = new URL(window.location.href)
    filterButtons.forEach(button=>{
        button.addEventListener("click",()=>{
            const status = button.getAttribute("button-status")
            if(status){
              url.searchParams.set("status", status);
              url.searchParams.set("page",1)
            }
            else{
              url.searchParams.delete("status")
            }
            window.location.href = url;
        })
    })
  }
  //SEARCH
  const formSearch = document.querySelector("#form-search")
  if(formSearch){
    formSearch.addEventListener("submit",(event)=>{
    event.preventDefault();
    //console.log(event.target.elements.keyword.value)
    const value = event.target.elements.keyword.value;
    let url = new URL(window.location.href)
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
  // Select All Checkbox
  const inputCheckAll = document.querySelector("[checkbox-all]")
  if(inputCheckAll){
    const inputsId = document.querySelectorAll("[checkbox-item]")
    inputCheckAll.addEventListener("click",()=>{
        if(inputCheckAll.checked){
        inputsId.forEach(input=>{
            input.checked = true;
        })
        }
        else{
            inputsId.forEach(input=>{
            input.checked = false;
        })
        }
    })
    inputsId.forEach(input=>{
        input.addEventListener("click",()=>{
            const countchecked = document.querySelectorAll("[checkbox-item]:checked").length
            const countInput = document.querySelectorAll("[checkbox-item]").length
            if(countchecked!=countInput){
                inputCheckAll.checked = false;
            }
            else{
                inputCheckAll.checked = true;
            }
        })
    })
}
//CHANGE MULTI
const formChangeMulti = document.querySelector("[form-change-multi]")
if(formChangeMulti){
    formChangeMulti.addEventListener("submit",(event)=>{
        event.preventDefault();
        const typeChange = formChangeMulti.querySelector("[name='type']").value
        if(typeChange == "delete"){
            const isConfirm = confirm("Bạn chắc chắn xóa?")
            if(!isConfirm) return;
        }
        const inputsChecked = document.querySelectorAll("[checkbox-item]:checked")
        if(inputsChecked.length>0){
          const idsChecked = formChangeMulti.querySelector("input[ name='ids']")
          let ids=[];
          inputsChecked.forEach(input=>{
              if(typeChange == "change-position"){
                const newPosition = input.closest("tr").querySelector("input[name='position']").value;
                ids.push(`${input.value}-${newPosition}`)
              }else{
                ids.push(input.value);
              }
          })
          ids = ids.join(",");
          idsChecked.value = ids;
          formChangeMulti.submit();
          
        }else{
            alert("Hãy chọn 1 sản phẩm!")
        }
    })
}

  //SORT
  const sort = document.querySelector("[sort]");
  if(sort){
      const sortSelect = sort.querySelector("[sort-select]");
      let url = new URL(window.location.href);
      sortSelect.addEventListener("change",(event)=>{
          const value = event.target.value;
          const [type,order] = value.split("-");
          url.searchParams.set("sortBy",type);
          url.searchParams.set("sortType",order);
          window.location.href = url; 
      })
    //   const clear = sort.querySelector("[sort-clear]");
    //   clear.addEventListener("click",()=>{
    //       url.searchParams.delete("sortBy");
    //       url.searchParams.delete("sortType");
    //       window.location.href = url;
    //   })
      const sortBy = url.searchParams.get("sortBy");
      const sortType = url.searchParams.get("sortType");
      if(sortBy && sortType){
          const selectedOption = sortSelect.querySelector(`option[value="${sortBy}-${sortType}"]`);
          if(selectedOption){
              selectedOption.selected = true;
          }
      }
  }
// File Upload Preview (Image & Audio) + Drag & Drop
const uploadUploads = document.querySelectorAll("[upload-image]");
if (uploadUploads.length > 0) {
  uploadUploads.forEach((container) => {
    const input = container.querySelector("[upload-image-input]");
    const imagePreview = container.querySelector("[upload-image-preview]");
    const audioPreview = container.querySelector("[upload-audio-preview]");
    const boxPreview = container.querySelector(".box-image");
    const btnRemove = container.querySelector(".btn-remove-image");
    if (input && boxPreview) {
      const updatePreview = (file) => {
        if (file) {
          const objectUrl = URL.createObjectURL(file);

          if (imagePreview) {
            imagePreview.src = objectUrl;
          } else if (audioPreview) {
            audioPreview.src = objectUrl;
            audioPreview.load(); 
          }

          boxPreview.classList.remove("hidden");
        }
      };
      let currentSrc = "";
      if (imagePreview) {
        currentSrc = imagePreview.getAttribute("src") || "";
      } else if (audioPreview) {
        const source = audioPreview.querySelector("source");
        currentSrc = source ? source.getAttribute("src") : "";
      }
      if (!currentSrc || currentSrc === window.location.href) {
        boxPreview.classList.add("hidden");
      }
      input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        updatePreview(file);
      });
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        container.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
      });
      ["dragenter", "dragover"].forEach((eventName) => {
        container.addEventListener(eventName, () => {
          container.classList.add("opacity-60");
        });
      });

      ["dragleave", "drop"].forEach((eventName) => {
        container.addEventListener(eventName, () => {
          container.classList.remove("opacity-60");
        });
      });
      container.addEventListener("drop", (e) => {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(files[0]);
          input.files = dataTransfer.files;
          updatePreview(files[0]);
        }
      });

      if (btnRemove) {
        btnRemove.addEventListener("click", () => {
          input.value = ""; 
          if (imagePreview) {
            imagePreview.src = "";
          } else if (audioPreview) {
            audioPreview.pause();
            audioPreview.src = "";
            const source = audioPreview.querySelector("source");
            if (source) source.src = "";
          }

          boxPreview.classList.add("hidden");
        });
      }
    }
  });
}

 //DELETE MODAL
  window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
    }
  };

  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
    }
  };
  const closeButtons = document.querySelectorAll('[data-modal-close]');
  closeButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const modal = this.closest('.fixed');
      if (modal) {
        modal.classList.add('hidden');
      }
    });
  });
  const deleteButtons = document.querySelectorAll('[data-delete-url]');
  deleteButtons.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const url = this.getAttribute('data-delete-url');
      if (!url) return;
      const form = document.getElementById('delete-form');
      if (form) {
        form.action = url.includes('?') ? `${url}&_method=DELETE` : `${url}?_method=DELETE`;
        window.openModal('delete-confirm');
      }
    });
  });
  
  // Sidebar Active State
  const currentPath = window.location.pathname;
  const sidebarLinks = document.querySelectorAll('.admin-sidebar a');
  sidebarLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (
      href &&
      ((href !== '/admin' && currentPath.startsWith(href)) || (href === '/admin' && currentPath === '/admin'))
    ) {
      link.classList.add('bg-indigo-900', 'text-white');
      link.classList.remove('text-indigo-200', 'hover:bg-indigo-800');
    }
  });
});
