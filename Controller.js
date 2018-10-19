
// class Controller {
//     constructor(shopsView, productsView, shopsModel, productsModel) {
//         this.shopsView = shopsView;
//         this.productsView = productsView;
//         this.shopsModel = shopsModel;
//         this.productsModel = productsModel;        
//     }

//     renderShopsList(fromRenderList) {        
//         if(!fromRenderList) {
//             let products = this.productsView.selectedProducts();
//             let shopsList = this.shopsModel.getShopsList(products);

//             this.shopsModel.setShopsToRender(shopsList);
//         }        

//         this.shopsView.render(this.shopsModel.getShopsToRender());            

//     }

//     searchByShops() {
//         const query = this.shopsView.getSearchQuery().toLowerCase();
//         if(!query.trim()) {
//             this.renderShopsList();
//             return;
//         };
//         const shopsList = this.shopsModel.getShopsList(); 
//         const filteredShops = shopsList.filter(el => el.name.toLowerCase().indexOf(query) !== -1);
       
//         this.shopsView.renderSearchResult(filteredShops);
//     }

//     addShopToRenderList(shopName) {
//         if(this.shopsModel.getShopsToRender().filter(el => el.name === shopName).length > 0) return;
//         const shop = this.shopsModel.getShopsList().find(el => el.name === shopName);

//         this.shopsModel.addShopToRender(shop);
//         this.renderShopsList(true);
//     }

//     hideShopSearchResult() {
//         this.shopsView.hideSearchResult();
//     }

//     selectedShops() {
//         const selectedShopsIds = this.shopsView.selectedShops();
//         const shopsList = this.shopsModel.getShopsList();
//         const selectedShopsArr = shopsList.filter(shop => selectedShopsIds.some(id => Number(id) === Number(shop.id)))

//         return selectedShopsArr;
//     }

//     renderProductsList() {
//         if(!this.selectedShops().length && !this.productsModel.getProductsToRender().length) {
//             const allProductsList = this.productsModel.getProductsList();
//             this.productsModel.setProductsToRender(allProductsList);
//         }

//         this.productsView.render(this.productsModel.getProductsToRender());
      
//     }

//     addProductToRenderList(product) {
//         this.productsModel.addProductToRender(product);
//         this.renderProductsList();
//     }

//     renderSelectedProductsList() {
//         const selectedShopsProductsArr = this.selectedShops().map(el => el.products);
//         const selectedProductsList = mergeArrays(selectedShopsProductsArr);

//         this.productsModel.setProductsToRender(selectedProductsList);
//         this.renderProductsList();

//         return selectedProductsList;
//     }
    
//     removeShopsSelection() {
//         this.shopsView.removeSelection();
//     }

//     removeProductsSelection() {
//         this.productsView.removeSelection();
//     }

//     hideProductsSearchResult() {
//         this.productsView.hideSearchResult();
//     }

//     addProductToRenderList(product) {
//         const productsList = this.productsModel.getProductsToRender();
//         if(productsList.indexOf(product) !== -1) return;

//         this.productsModel.addProductToRender(product);
//         this.renderProductsList();
//     }

//     searchByProducts() {        
//         const query = this.productsView.getSearchQuery().toLowerCase();

//         const productsList = this.productsModel.getProductsList();
//         const searchResult = productsList.filter(el => el.toLowerCase().indexOf(query) !== -1);

//         if(!query) return;
//         this.productsView.renderSearchResult(searchResult);                     
//     }

// }

class Controller { 
    constructor(shopsInputView, shopsModel) {
        this.shopsInputView = shopsInputView;
        this.shopsModel = shopsModel;
    }

    renderShopsInput() {
        this.shopsInputView.render()
    }

    initilize() {
        this.shopsInputView.onSearch = this.onSearchHandler.bind(this)
    }

    onSearchHandler(e) {
        const allShops = this.shopsModel.getShopsList();
        const query = e.target.value.toLowerCase();

        if(!query.trim()) return;
        this.shopsInputView.renderSearchList(allShops.filter(el => el.name.toLowerCase().indexOf(query)!== -1));
    }

    renderSearchList(res) {
        this.shopsInputView.renderSearchList(res);
    }
}