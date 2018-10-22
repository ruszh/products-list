class Controller { 
    constructor(shopSearchView, shopsView, productsView, productSearchView, shopsModel, productsModel) {
        this.shopsModel = shopsModel;
        this.productsModel = productsModel;

        this.shopSearchView = shopSearchView;
        this.shopsView = shopsView;
        this.productsView = productsView;
        this.productSearchView = productSearchView;
    }

    
    renderShops() {
        this.shopsView.render(this.shopsModel.getShopsList());
    }

    renderProducts() {
        this.productsView.render(this.productsModel.getProductsList());
    }

    initialize() {
        this.shopSearchView.onSearch = this.onShopsSearchHandler.bind(this);
        this.productSearchView.onSearch = this.onProductsSearchHandler.bind(this);

        this.shopsView.onSelected = this.onShopsSelectHandler.bind(this);
        this.productsView.onSelected = this.onProductsSelectHandler.bind(this);

        this.shopSearchView.selectedItem = this.onSearchShopSelectedHandler.bind(this);
        this.productSearchView.selectedItem = this.onSearchProductSelectedHandler.bind(this);

        this.renderShops();
        this.renderProducts();

        this.shopSearchView.render();
        this.productSearchView.render();
    }

    onProductsSearchHandler(e) {
        const allProducts = this.productsModel.getAllProducts();
        const query = e.target.value.toLowerCase();

        if(!query.trim()) {
            this.productSearchView.hideSearchList();
            return;
        };

        this.productSearchView.renderSearchList(allProducts.filter(el => el.name.toLowerCase().indexOf(query)!== -1));        
    }

    onSearchProductSelectedHandler(e) {
        const elId = +e.target.dataset.id;
        this.productsModel.addToSelectedArr(elId);
        
        this.productsView.select(elId);
        this.productSearchView.hideSearchList();
    }
    
    onProductsSelectHandler() {        
        const shops = this.shopsModel.selectShops(this.productsView.selectedItems());
        
        this.shopsView.render(shops);
    }
    
    onSearchShopSelectedHandler(e) {
        this.shopsView.select(+e.target.dataset.id);
        this.shopSearchView.hideSearchList();
    }
    
    onShopsSearchHandler(e) {
        const allShops = this.shopsModel.getShopsList();
        const query = e.target.value.toLowerCase();

        if(!query.trim()) {
            this.shopSearchView.hideSearchList();
            return;
        };
        this.shopSearchView.renderSearchList(allShops.filter(el => el.name.toLowerCase().indexOf(query)!== -1));      
    }

    onShopsSelectHandler() {
        const selectedShops = this.shopsModel.getShopsList(this.shopsView.selectedItems());
        const productsOfSelectedShops = selectedShops.map(el => el.productsIds);
        const selectedProductsList = mergeArrays(productsOfSelectedShops);
        this.productsModel.setSelectedArr(this.productsModel.getProductsList(selectedProductsList)); 
        
        this.productsModel.setSelectMode(true);
        
        if(!this.shopsView.selectedItems().length) {            
            this.productsModel.setSelectMode(false);
            this.productsModel.setSelectedArr([]);
            this.productsView.render(this.productsModel.getProductsList());
            log('render from all products');
            return;
        }
        log('render from selected products')
        
        this.productsView.render(this.productsModel.getProductsList());
    }
    
}




//--------------------old code------------------------------------//

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
