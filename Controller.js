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

    // toggleActive(arr, items) {

    // }

    renderProducts(products) {               
        if(!products) {
            this.productsView.render(this.productsModel.getProductsList());
            return;
        }
        const selectedProductsIds = this.productsView.select();

        //check if some products selected, but not contain in selected shops
        if(selectedProductsIds.length) {            
            const selectedProducts = this.productsModel.getProductsList(selectedProductsIds);
            
            selectedProducts.forEach(el => {
                if(!products.filter(e => e.id == el.id).length) {
                    el.active = false;
                    products.unshift(el);
                } else {
                    el.active = true;
                }
            });
        }

        if(!this.shopsView.select().length) this.productsModel.activeAll();
        
        this.productsView.render(products);
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

    //--------------------  Search methods  -------------------------//
    onProductsSearchHandler(e) {
        const allProducts = this.productsModel.getProductsList();
        const query = e.target.value.toLowerCase();

        if(!query.trim()) {
            this.productSearchView.hideSearchList();
            return;
        };

        this.productSearchView.renderSearchList(allProducts.filter(el => el.name.toLowerCase().indexOf(query)!== -1));        
    }

    onSearchProductSelectedHandler(e) {
        const elId = +e.target.dataset.id;
        
        this.productsView.select(elId);
        this.productsModel.selectProduct(elId);

        this.shopsView.render(this.shopsModel.filterShops(this.productsView.select()));

        this.renderProducts();
        this.productSearchView.hideSearchList();
    }

    onSearchShopSelectedHandler(e) {
        const id = +e.target.dataset.id;

        this.shopsModel.selectShop(id);

        
        this.filterProductsByShops(id);
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

    //-------------------  List methods  ---------------------//

    //filtered shops by selected products
    onProductsSelectHandler(e) {    
        const id = +e.target.parentNode.dataset.id; 

        this.productsView.select(id);
        this.productsModel.selectProduct(id);
        
        const shops = this.shopsModel.filterShops(this.productsView.select());
        
        this.shopsView.render(shops);
        this.renderProducts();
    }

    onShopsSelectHandler(e) {
        const id = +e.target.parentNode.dataset.id;

        this.shopsModel.selectShop(id);

        this.renderShops();
        this.filterProductsByShops(id);
    }  
    
    filterProductsByShops(shopId) {
        this.shopsView.select(shopId);

        const selectedShops = this.shopsModel.getShopsList(this.shopsView.select());
        const productsOfSelectedShops = selectedShops.map(el => el.productsIds);
        const selectedProductsList = mergeArrays(productsOfSelectedShops);
        
        
        const result = this.productsModel.getProductsList(selectedProductsList);
        this.renderShops();
        this.renderProducts(result);        
    }    
}

