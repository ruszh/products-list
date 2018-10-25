class Controller { 
    constructor(
        shopSearchView, 
        shopsView, 
        productsView, 
        productSearchView, 
        shopsModel, 
        productsModel,
        authView,
        authModel
                ) {
        
            this.shopsModel = shopsModel;
            this.productsModel = productsModel;
            this.authModel = authModel;

            this.shopSearchView = shopSearchView;
            this.shopsView = shopsView;
            this.productsView = productsView;
            this.productSearchView = productSearchView;

            this.authView = authView;

            ee.on('submit', this.onLoginHandler, this);

    }

    initialize() {  
        
        document.querySelector('#app-container').style.display = '';
        
        ee.on('search-shopsInput', this.onShopsSearchHandler, this);
        ee.on('search-productsInput', this.onProductsSearchHandler, this);
        
        ee.on('select-shopsInput', this.onSearchShopSelectHandler, this);
        ee.on('select-productsInput', this.onSearchProductSelectHandler, this);
        
        ee.on('select-productsList', this.onProductsSelectHandler, this);
        ee.on('select-shopsList', this.onShopsSelectHandler, this);

        ee.on('logout', this.logout, this);

        this.renderShops();
        this.renderProducts();

        this.shopSearchView.render();
        this.productSearchView.render();

        this.authView.renderLoginUserData();

    }

    logout() {
        document.getElementById('app-container').style.display = 'none';

        ee.off('search-shopsInput', this.onShopsSearchHandler, this);
        ee.off('search-productsInput', this.onProductsSearchHandler, this);
        
        ee.off('select-shopsInput', this.onSearchShopSelectHandler, this);
        ee.off('select-productsInput', this.onSearchProductSelectHandler, this);
        
        ee.off('select-productsList', this.onProductsSelectHandler, this);
        ee.off('select-shopsList', this.onShopsSelectHandler, this);

        this.authView.showRegisterForm();
        
    }

    renderShops() {
        this.shopsView.render(this.shopsModel.getShopsList());
    }
    
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



    //--------------------  Search methods  -------------------------//
    onProductsSearchHandler(query) {
        const allProducts = this.productsModel.getProductsList();
        
        if(!query.trim()) {
            this.productSearchView.hideSearchList();
            return;
        };

        this.productSearchView.renderSearchList(allProducts.filter(el => el.name.toLowerCase().indexOf(query)!== -1));        
    }

    onShopsSearchHandler(query) {
        const allShops = this.shopsModel.getShopsList();
       
        if(!query.trim()) {
            this.shopSearchView.hideSearchList();
            return;
        };
        this.shopSearchView.renderSearchList(allShops.filter(el => el.name.toLowerCase().indexOf(query)!== -1));      
    }

    onSearchProductSelectHandler(id) {        
        this.productsView.select(id);
        this.productsModel.selectProduct(id);

        this.shopsView.render(this.shopsModel.filterShops(this.productsView.select()));

        this.renderProducts();
        this.productSearchView.hideSearchList();
    }

    onSearchShopSelectHandler(id) {
        
        this.shopsModel.selectShop(id);
        
        this.filterProductsByShops(id);
        this.shopSearchView.hideSearchList();
    }    
    

    //-------------------  List methods  ---------------------//

    //filtered shops by selected products
    onProductsSelectHandler(id) {
        this.productsView.select(id);
        this.productsModel.selectProduct(id);

        
        const shops = this.shopsModel.filterShops(this.productsView.select());
        
        this.shopsView.render(shops);
        this.renderProducts();
    }

    onShopsSelectHandler(id) {
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

    //-------------------  Authentication methoods ----------------------//
    
    onLoginHandler(data) {
        this.authModel.checkUser(data)
            .then(result => {
                log(result)
                if(result.success) {
                    this.authView.validForm();
                    this.authView.hideRegisterForm();
                    this.initialize();
                    
                    return;        
                }
                this.authView.invalidForm();
            })    
            .catch(err => console.log(err)); 
    }

}

