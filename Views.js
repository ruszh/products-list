
class ShopsView {
    constructor() {
        this.shopsList = document.getElementById('shopsList');
        this.shopSearchInput = document.getElementById('shopSearchInput');
    }
    render(shops) {
        const shopsList = shops.reduce((els, el) => (els +
            `<li class="list-group-item" data-id="${el.id}">
                <input type='checkbox' class="checkbox"/>
                ${el.name}
            </li>`
        ), '')
        this.shopsList.innerHTML = shopsList;
    }

    selectedShops() {
        const checkboxes = this.shopsList.querySelectorAll('.checkbox');
        const selectedShopsArr = [];

        checkboxes.forEach((el) => {
            if(el.checked) {
                selectedShopsArr.push(+el.parentNode.dataset.id)
            }
        });
        return selectedShopsArr;
    }

    getSearchQuery() {
        return this.shopSearchInput.value;
    }

    removeSelection() {
        const checkboxes = this.shopsList.querySelectorAll('.checkbox');
        checkboxes.forEach(el => el.checked = false);
    }
    
}

class ProductsView {
    constructor() {
        this.productsList = document.getElementById('productsList');
        this.productSearchInput = document.getElementById('productSeachInput');
        this.productSearchDropdown = document.getElementById('productSearchDropdown');
        this.searchMode = false;
    }

    render(products) {
        const productsList = products.reduce((els, el) => (els +
            `<li class="list-group-item" data-name="${el}">
                <input type='checkbox' class="checkbox"/>
                ${el}
            </li>`
        ), '')
        this.productsList.innerHTML = productsList;
    }

    renderSearchResult(result) {
        if(!result.length) return;
        const searchEl = this.productSearchDropdown;
        const searchResult = result.reduce((els, el) => (els + 
            `<a class="dropdown-item" href="#">${el}</a>`), '');
        searchEl.innerHTML = '';

        searchEl.innerHTML = searchResult;
        searchEl.style.display = 'block';        
    }

    hideSearchResult() {
        this.productSearchDropdown.style.display = 'none';        
    }

    selectedProducts() {
        const checkboxes = this.productsList.querySelectorAll('.checkbox');
        const selectedProductsArr = [];

        checkboxes.forEach((el) => {
            if(el.checked === true) {
                selectedProductsArr.push(el.parentNode.dataset.name)
            }
        });

        return selectedProductsArr;
    }

    removeSelection() {
        const checkboxes = this.productsList.querySelectorAll('.checkbox');
        checkboxes.forEach(el => el.checked = false);
    }

    getSearchQuery() {
        return this.productSearchInput.value;
    }

    

}
