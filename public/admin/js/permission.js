//Update permissions
const tablePermission = document.querySelector("[table-permissions]")
if(tablePermission) {
    const button = document.querySelector("[button-submit]");
    button.addEventListener("click",()=>{
        let permissions = [];
        const rows = tablePermission.querySelectorAll("[data-name]");
        rows.forEach(row=>{
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");
            if(name === "id"){
                inputs.forEach(input=>{
                    const id = input.value;
                    permissions.push({
                        id: id,
                        permissions: []
                    })
                })
            }
            else{
                inputs.forEach((input,index)=>{
                    const checked = input.checked;
                    if(checked){
                        permissions[index].permissions.push(name)
                    }
                })
            }
        })
        const form = document.querySelector("[form-update-permissions]");
        if(form){
            const inputSubmit = form.querySelector("[input-submit]");
            inputSubmit.value = JSON.stringify(permissions);
            form.submit();
        }
    })
}
//Default permissions
const data = document.querySelector("[input-records]").value;
const records= JSON.parse(data);
records.forEach((record,index)=>{
    const permissions = record.permissions;
    permissions.forEach(permission=>{
        const row = tablePermission.querySelector(`[data-name="${permission}"]`);
        if(row){
            const input = row.querySelectorAll("input")[index];
            if(input){
                input.checked = true;
            }
        }
    })
})
//Select all permissions
const inputCheckAll = document.querySelectorAll("[checkbox-select-all]");
if (inputCheckAll) {
    inputCheckAll.forEach((input, index) => {
        input.addEventListener("click", () => {
            const rows = tablePermission.querySelectorAll("[data-name]");
            rows.forEach(row => {
                const item = row.querySelectorAll("input[type='checkbox']")[index];
                if (item) {
                    item.checked = input.checked;
                }
            });
        });
        const rows = tablePermission.querySelectorAll("[data-name]");
        rows.forEach(row => {
            const item = row.querySelectorAll("input[type='checkbox']")[index];
            if (item) {
                item.addEventListener("click", () => {
                    let countChecked = 0;
                    let totalItems = 0;
                    const allRows = tablePermission.querySelectorAll("[data-name]");
                    allRows.forEach(r => {
                        const checkbox = r.querySelectorAll("input[type='checkbox']")[index];
                        if (checkbox) {
                            totalItems++;
                            if (checkbox.checked) {
                                countChecked++; 
                            }
                        }
                    });
                    if (countChecked === totalItems) {
                        input.checked = true;
                    } else {
                        input.checked = false;
                    }
                });
            }
        });
    });
}