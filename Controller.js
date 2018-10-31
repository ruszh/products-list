class Controller { 
    constructor(
        shopSearchView, 
        shopsView, 
        productsView, 
        productSearchView, 
        shopsModel, 
        productsModel,
        authView,
        savedListView
                ) {        
            this.shopsModel = shopsModel;
            this.productsModel = productsModel;

            this.shopSearchView = shopSearchView;
            this.shopsView = shopsView;
            this.productsView = productsView;
            this.productSearchView = productSearchView;
            this.savedListView = savedListView;

            this.authView = authView;
                    
            window.addEventListener('load', () => {                
                this.authView.showSpinner();                 
                authService.verification()                
                            .then(res => {
                                log(res)
                                this.authView.hideSpinner();
                                if(res.user.email && res.user._id) {                        
                                    this.login({
                                        email : res.user.email,
                                        userId: res.user._id
                                    });
                                    return;
                                }
                                this.authView.showRegisterForm();                                    
                            })
                            .catch(err => {
                                log(err);
                                this.authView.showRegisterForm()
                            });                

                
            });
            ee.on('submit', this.onLoginHandler, this);
            ee.on('save-list', this.onSaveListHandler, this);
            ee.on('load-list', this.onLoadListsHandler, this);
            ee.on('select-list', this.onSelectListHandler, this);
            
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

        this.savedListView.render();



    }

    fetchData() {
        return fetch('http://localhost:3003/user/getlists')
                .then(res => res.json())                
    }

    logout() {
        document.getElementById('app-container').style.display = 'none';

        ee.off('search-shopsInput', this.onShopsSearchHandler, this);
        ee.off('search-productsInput', this.onProductsSearchHandler, this);
        
        ee.off('select-shopsInput', this.onSearchShopSelectHandler, this);
        ee.off('select-productsInput', this.onSearchProductSelectHandler, this);
        
        ee.off('select-productsList', this.onProductsSelectHandler, this);
        ee.off('select-shopsList', this.onShopsSelectHandler, this);

        localStorage.removeItem('token');
        this.authView.showRegisterForm();   
        this.authView.authUser = null;    
        this.savedListView.hideButtons();
    }

    login(user) {
        this.fetchData()
            .then(res => {
                this.shopsModel.shops = res.shops;
                this.productsModel.allProducts = res.products;
                this.authView.authUser = user;     

                this.authView.renderLoginUserData();
                this.authView.validForm();
                this.authView.hideRegisterForm();

                this.initialize();
                this.authView.hideSpinner();
            })
            .catch(err => {
                log(err);
            });
        
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
        const productsOfSelectedShops = selectedShops.map(el => el.productsids);
        const selectedProductsList = mergeArrays(productsOfSelectedShops);
        
        
        const result = this.productsModel.getProductsList(selectedProductsList);
        this.renderShops();
        this.renderProducts(result);        
    }    

    //-------------------  Authentication methods ----------------------//
    

    onLoginHandler(data) {
        this.authView.showSpinner();
        authService.signin(data)
                    .then(result => {
                        if(result.success) {
                            log(result)
                            localStorage.setItem('token', result.token);
                            const user = {
                                userId: result.data._id,
                                email: result.data.email
                            }                        
                            this.login(user);                            
                            return;        
                        }
                        this.authView.invalidForm();
                    })
                    .catch(err => console.log(err)); 
    }

    //--------------------------- Saved list methods --------------------------///


    onSaveListHandler(listName) {  
        const listObj = {
            listName,
            list: {
                shops: this.shopsView.selectedItems,
                products: this.productsView.selectedItems
            }
        };
        //log(listObj);
        this.saveList(listObj);
    }

    saveList(list) {
        if(!list) return;
        const userId = this.authView.authUser.userId;
    
        listsService.save(userId, list);
            
    }

    onLoadListsHandler() {
        const userId = this.authView.authUser.userId;
    
        listsService.load(userId)
            .then(res => {
                log(res.lists)
                this.savedListView.savedLists = res.lists;
                this.savedListView.renderLoadedLists(res.lists);            
            })
            .catch(err => log(err))
    }

    onSelectListHandler(selectedList) {
        const query = {
            listId: selectedList, 
            userId: this.authView.authUser.userId
        }
        
        listsService.getList(query)
                    .then(res => {
                        const selectedShops = res.list.shops;
                        const selectedProducts = res.list.products;
                        
                        this.shopsView.selectedItems = [];
                        this.productsView.selectedItems = [];
                        
                        selectedShops.forEach(el => {          

                            this.shopsModel.selectShop(el);
                            this.filterProductsByShops(el);
                        });

                        selectedProducts.forEach(el => {           

                            this.productsView.select(el);
                            this.productsModel.selectProduct(el);

                            this.shopsView.render(this.shopsModel.filterShops(this.productsView.select()));

                            this.renderProducts();
                        });

                    })
                    .catch(err => log(err))
        
        
      
    }

}

