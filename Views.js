class ShopsInput {
    constructor(targetId) {
        this.inputContainer = document.getElementById(targetId);
        this.searchResultContainer = document.createElement('div');
        this.inputElement = document.createElement('input');

        this.onSearch = null;
    }

    render() {
        this.inputElement.type = "text";
        this.inputElement.className = "form-control search-input";
        this.inputElement.placeholder = "Search by shop";

        // this.inputElement.addEventListener('keydown', _.debounce(
        //     (e) => console.log(this.onSearch), 1000, { leading: false, trailing: true }
        // ));

        this.inputElement.addEventListener('keydown', (e) => this.onSearch(e));

        this.inputContainer.appendChild(this.inputElement);
    }

    renderSearchList(arr) {
        this.searchResultContainer.innerHTML = '';
        this.searchResultContainer.className = 'dropdown-menu search-dropdown';

        arr.forEach(el => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.innerText = el.name;

            this.searchResultContainer.appendChild(item);
        });

        this.searchResultContainer.style.display = 'block';
        this.inputContainer.appendChild(this.searchResultContainer);
    }

    

    hideSearchList() {
        this.searchResultContainer.innerHTML = '';
        this.searchResultContainer.style.display = 'none';
    }
}

// class ShopsView {
//     constructor() {
//         this.shopsList = document.getElementById('shopsList');
//         this.shopSearchInput = document.getElementById('shopSearchInput');
//         this.shopSearchDropdown = document.getElementById('shopSearchDropdown');

//         this.shopSearchDropdown.addEventListener('click', (e) => {
//             const shopName = e.target.innerText;
        
//             controller.addShopToRenderList(shopName);
//             controller.hideShopSearchResult();
//             shopSearchInput.value = '';
//         })
//         this.shopSearchInput.addEventListener('keydown', _.debounce(
//             () => controller.searchByShops(), 1000, { leading: false, trailing: true }
//         ));
        
        
        
//         this.shopsList.addEventListener('change', () => {
//             controller.renderSelectedProductsList();
//             controller.removeProductsSelection();
//         });
        
//     }
//     render(shops) {
//         const shopsList = shops.reduce((els, el) => (els +
//             `<li class="list-group-item" data-id="${el.id}">
//                 <input type='checkbox' class="checkbox"/>
//                 ${el.name}
//             </li>`
//         ), '')
//         this.shopsList.innerHTML = shopsList;
//     }

//     renderSearchResult(result) {
//         if(!result.length) return;
//         const searchEl = this.shopSearchDropdown;
//         const searchResult = result.reduce((els, el) => (els + 
//             `<a class="dropdown-item" href="#">${el.name}</a>`), '');
//         searchEl.innerHTML = '';

//         searchEl.innerHTML = searchResult;
//         searchEl.style.display = 'block';
//     }

//     hideSearchResult() {
//         this.shopSearchDropdown.style.display = 'none';        
//     }

//     selectedShops() {
//         const checkboxes = this.shopsList.querySelectorAll('.checkbox');
//         const selectedShopsArr = [];

//         checkboxes.forEach((el) => {
//             if(el.checked) {
//                 selectedShopsArr.push(+el.parentNode.dataset.id)
//             }
//         });
//         return selectedShopsArr;
//     }

//     getSearchQuery() {
//         return this.shopSearchInput.value;
//     }

//     removeSelection() {
//         const checkboxes = this.shopsList.querySelectorAll('.checkbox');
//         checkboxes.forEach(el => el.checked = false);
//     }
// }

// class ProductsView {
//     constructor() {
//         this.productsList = document.getElementById('productsList');
//         this.productSearchInput = document.getElementById('productSeachInput');
//         this.productSearchDropdown = document.getElementById('productSearchDropdown');
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
//         })
        
        
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
