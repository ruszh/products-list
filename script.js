
function mergeArrays(arrs) {       
    return [...new Set(arrs.reduce((a, b) => [...a, ...b], []))];
}

const shopsModel = new ShopsModel();
const productsModel = new ProductsModel();

const shopsView = new ShopsView();
const productsView = new ProductsView();

const controller = new Controller(shopsView, productsView, shopsModel, productsModel);

const productsList = document.getElementById('productsList');
const shopsList = document.getElementById('shopsList');

const shopSearchInput = document.getElementById('shopSearchInput');
const productSearchInput = document.getElementById('productSeachInput');
const productSearchDropdown = document.getElementById('productSearchDropdown');


productSearchDropdown.addEventListener('click', (e) => {
    const value = e.target.innerText;

    controller.addProductToRenderList(value);
    controller.hideProductsSearchResult();
    productSearchInput.value = ''; 
})


shopSearchInput.addEventListener('keydown', () => {
    controller.searchByShops();
});

productSearchInput.addEventListener('keydown', _.debounce(
    () => controller.searchByProducts(), 1000, { leading: false, trailing: true }
));



productSearchInput.addEventListener('blur', () => {    
    setTimeout(() => controller.hideProductsSearchResult(), 500)
});

productsList.addEventListener('change', () => {
    controller.renderShopsList();
    controller.removeShopsSelection();
});

shopsList.addEventListener('change', () => {
    controller.renderSelectedProductsList();
    controller.removeProductsSelection();
});



controller.renderShopsList();
controller.renderProductsList();
