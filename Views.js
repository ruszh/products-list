class SearchView {
    constructor(targetId) {
        this.inputContainer = document.getElementById(targetId);
        this.searchResultContainer = document.createElement('div');
        this.inputElement = document.createElement('input');

        this.inputElement.addEventListener('keydown', (e) => this.onSearch(e));
        this.searchResultContainer.addEventListener('click', (e) => this.selectedItem(e));

        this.onSearch = null;
        this.selectedItem = null;
        
    }

    render() {
        this.inputElement.type = "text";
        this.inputElement.className = "form-control search-input";
        this.inputElement.placeholder = "Search";
        // this.inputElement.addEventListener('keydown', _.debounce(
        //     (e) => console.log(this.onSearch), 1000, { leading: false, trailing: true }
        // ));

        
        this.inputContainer.appendChild(this.inputElement);
    }

    renderSearchList(arr) {
        if(!arr.length) return;
        this.searchResultContainer.innerHTML = '';
        this.searchResultContainer.className = 'dropdown-menu search-dropdown';

        arr.forEach(el => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.innerText = el.name;
            item.dataset.id = el.id;

            this.searchResultContainer.appendChild(item);
        });

        
        this.searchResultContainer.style.display = 'block';
        this.inputContainer.appendChild(this.searchResultContainer);
        
    }
    
    hideSearchList() {
        this.searchResultContainer.innerHTML = '';
        this.inputElement.value = '';
        this.searchResultContainer.style.display = 'none';
    }
}

class ListView {
    constructor(targetId) {
        this.listContainer = document.getElementById(targetId);       

        this.onSelected = null;
        this.selectedItems = [];

        // this.onToggle = null;  
        
        // this.shopSearchInput.addEventListener('keydown', _.debounce(
        //     () => controller.searchByShops(), 1000, { leading: false, trailing: true }
        // ));                 
        
        
    }

    render(arr) {
        this.listContainer.innerHTML = '';

        const ul = document.createElement('ul'); 
        
        // const btn = document.createElement('button');
        // btn.className = 'btn';
        // btn.innerText = 'Toggle all';
        // btn.onclick = this.toggleAll.bind(this);        
        // this.listContainer.appendChild(btn);

        ul.className = 'list-group';
        
        arr.forEach(el => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');

            checkbox.type = 'checkbox';
            checkbox.className = 'checkbox';
            li.className = 'list-group-item';

            if(!el.selected) li.classList.add("not-selected");
            if(this.selectedItems.indexOf(el.id) !== -1) checkbox.checked = true;
            li.dataset.id = el.id;

            checkbox.addEventListener('change', (e) => this.onSelected(e));

            li.appendChild(checkbox);
            li.appendChild(document.createTextNode(el.name));

            ul.appendChild(li);
        });

        this.listContainer.appendChild(ul);
    }

    // toggleAll() {
    //     const checkboxes = this.listContainer.querySelectorAll('.checkbox');
    //     let notSelected = 0;    
    //     checkboxes.forEach(el => {
    //         if(!el.checked) notSelected++;
    //     });
    //     checkboxes.forEach(el => {
    //         if(notSelected > 0) {
    //             el.checked = true;
    //         } else {
    //             el.checked = false;
    //         }
    //     });
    // }

    select(id) {
        // const checkboxes = this.listContainer.querySelectorAll('.checkbox');
        // checkboxes.forEach(el => {
        //     if(+el.parentNode.dataset.id === id) el.checked = true;
        // });
        const selected = this.selectedItems;   
        if(selected.indexOf(id) !== -1) {
            selected.splice(selected.indexOf(id), 1);  
            return;
        } 
        selected.push(id);
        return selected;

    }

    selectedItems() {
        const checkboxes = this.listContainer.querySelectorAll('.checkbox');
        
        checkboxes.forEach((el) => {
            if(el.checked) {
                this.selectedItems.push(+el.parentNode.dataset.id)
            }
        });
        return selectedItemsArr;
    }
}




//-------------------------Old code------------------------------------------------


// class ProductsView {
//     constructor() {
//         this.productsList = document.getElementById('productsList');
        
//         this.searchMode = false;

//         this.productSearchInput.addEventListener('blur', () => {    
//             setTimeout(() => controller.hideProductsSearchResult(), 500)
//         });
        
//         this.productsList.addEventListener('change', () => {
//             controller.renderShopsList();
//             controller.removeShopsSelection();
//         });

//         this.productSearchInput.addEventListener('keydown', _.debounce(
//             () => controller.searchByProducts(), 1000, { leading: false, trailing: true }
//         ));
        
//         this.productSearchDropdown.addEventListener('click', (e) => {
//             const productName = e.target.innerText;
        
//             controller.addProductToRenderList(productName);
//             controller.hideProductsSearchResult();
//             productSearchInput.value = '';
//         });
        
//     }

//     render(products) {
//         const productsList = products.reduce((els, el) => (els +
//             `<li class="list-group-item" data-name="${el}">
//                 <input type='checkbox' class="checkbox"/>
//                 ${el}
//             </li>`
//         ), '')
//         this.productsList.innerHTML = productsList;
//     }

//     renderSearchResult(result) {
//         if(!result.length) return;
//         const searchEl = this.productSearchDropdown;
//         const searchResult = result.reduce((els, el) => (els + 
//             `<a class="dropdown-item" href="#">${el}</a>`), '');
//         searchEl.innerHTML = '';

//         searchEl.innerHTML = searchResult;
//         searchEl.style.display = 'block';        
//     }

//     hideSearchResult() {
//         this.productSearchDropdown.style.display = 'none';        
//     }

//     selectedProducts() {
//         const checkboxes = this.productsList.querySelectorAll('.checkbox');
//         const selectedProductsArr = [];

//         checkboxes.forEach((el) => {
//             if(el.checked) {
//                 selectedProductsArr.push(el.parentNode.dataset.name)
//             }
//         });

//         return selectedProductsArr;
//     }

//     removeSelection() {
//         const checkboxes = this.productsList.querySelectorAll('.checkbox');
//         checkboxes.forEach(el => el.checked = false);
//     }

//     getSearchQuery() {
//         return this.productSearchInput.value;
//     }
// }
