
class Controller {
    constructor(shopsView, productsView, shopsModel, productsModel) {
        this.shopsView = shopsView;
        this.productsView = productsView;
        this.shopsModel = shopsModel;
        this.productsModel = productsModel;
    }

    renderShopsList() {
        let products = this.productsView.selectedProducts();
        if(products.length) {
            let shopsList = this.shopsModel.getShopsList(products);
            this.shopsView.render(shopsList);
            return shopsList;
        }
        let shopsList = this.shopsModel.getShopsList();
        this.shopsView.render(shopsList);
        return shopsList;
    }

    renderProductsList() {
        if(!this.selectedShops().length && !this.productsModel.getProductsToRender().length) {
            const allProductsList = this.productsModel.getProductsList();
            this.productsModel.setProductsToRender(allProductsList);
        }

        this.productsView.render(this.productsModel.getProductsToRender());
        
    }

    addProductToRenderList(product) {
        this.productsModel.addProductToRender(product);
        this.renderProductsList();
    }

    renderSelectedProductsList() {
        const selectedShopsProductsArr = this.selectedShops().map(el => el.products);
        const selectedProductsList = mergeArrays(selectedShopsProductsArr);

        this.productsModel.setProductsToRender(selectedProductsList);
        this.renderProductsList();

        return selectedProductsList;
    }

    selectedShops() {
        const selectedShopsIds = this.shopsView.selectedShops();
        const shopsList = this.shopsModel.getShopsList();
        const selectedShopsArr = shopsList.filter(shop => selectedShopsIds.some(id => Number(id) === Number(shop.id)))

        return selectedShopsArr;
    }

    removeShopsSelection() {
        this.shopsView.removeSelection();
    }

    removeProductsSelection() {
        this.productsView.removeSelection();
    }

    searchByShops() {
        const query = this.shopsView.getSearchQuery().toLowerCase();
        if(!query.trim()) {
            controller.renderShopsList();
            return;
        };
        const shopsList = this.renderShopsList();
        
        this.shopsView.render(shopsList.filter(el => el.name.toLowerCase().indexOf(query) !== -1))        
    }

    hideProductsSearchResult() {
        this.productsView.hideSearchResult();
    }

    addProductToRenderList(product) {
        const productsList = this.productsModel.getProductsToRender();
        if(productsList.indexOf(product) !== -1) return;

        this.productsModel.addProductToRender(product);
        this.renderProductsList();
    }

    searchByProducts() {

        setTimeout(() => {
            const query = this.productsView.getSearchQuery().toLowerCase();

            const productsList = this.productsModel.getProductsList();
            const searchResult = productsList.filter(el => el.toLowerCase().indexOf(query) !== -1);

            if(!query) return;
            this.productsView.renderSearchResult(searchResult);
        }, 500)
        
             
    }

}