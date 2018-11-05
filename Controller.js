class Controller { 
    constructor(
        shopSearchView, 
        shopsView, 
        productsView, 
        productSearchView, 
        shopsModel, 
        productsModel,
        authView,
        savedListView,
        paginationView
                ) {        
            this.shopsModel = shopsModel;
            this.productsModel = productsModel;

            this.shopSearchView = shopSearchView;
            this.shopsView = shopsView;
            this.productsView = productsView;
            this.productSearchView = productSearchView;
            this.savedListView = savedListView;
            this.paginationView = paginationView;

            this.sortBy = 'listName';


            this.authView = authView;
                    
            window.addEventListener('load', async () => {                
                this.authView.showSpinner(); 
                try {
                    const verification = await authService.verification();    
                    
                    if(verification.user.email && verification.user._id) {
                        this.authView.hideSpinner();
                        return this.login({
                            email : verification.user.email,
                            userId: verification.user._id
                        })
                    }
                    this.authView.showRegisterForm();
                }  catch(err) {
                    log(err);
                    this.authView.hideSpinner();
                    this.authView.showRegisterForm()
                }            
            });
            ee.on('submit', this.onLoginHandler, this);
            ee.on('save-list', this.onSaveListHandler, this);
            ee.on('load-list', this.onLoadListsHandler, this);
            ee.on('select-list', this.onSelectListHandler, this);
            ee.on('sort', this.sortHandler, this);
            ee.on('select-page', this.onLoadListsHandler, this);
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
        this.removeAllSelections();
        this.productsModel.allProducts = [];
        this.shopsModel.shops = [];
        this.savedListView.savedLists = [];
        
    }
    

    async login(user) {
        const data = await initService.fetchData();

        if(data) {
            this.shopsModel.shops = data.shops;
            this.productsModel.allProducts = data.products;
            this.authView.authUser = user;     

            this.authView.renderLoginUserData();
            this.authView.validForm();
            this.authView.hideRegisterForm();

            this.initialize();
            this.authView.hideSpinner();
            return;
        }
        log('Login error');
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
                if(!products.some(e => e.id == el.id)) {
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

        this.productSearchView.renderSearchList(
                allProducts.filter(
                    el => el.name.toLowerCase().indexOf(query)!== -1
                    )
                );        
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

    removeAllSelections() {
        this.productsView.selectedItems = [];
        this.shopsView.selectedItems = [];
        this.shopsModel.removeSelection();
        this.productsModel.removeSelection();
    }


    //-------------------  Authentication methods ----------------------//
    

    async onLoginHandler(data) {
        this.authView.showSpinner();
        
        const result = await authService.signin(data);
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
        log(result)
        this.authView.invalidForm();
        
    }

    //--------------------------- Saved list methods --------------------------///


    onSaveListHandler(listName) {  
        if(!listName) return;
        const userId = this.authView.authUser.userId;
        
        const listObj = {
            userId,
            listName,
            list: {
                shops: this.shopsView.selectedItems,
                products: this.productsView.selectedItems
            },
            date: Date.now()
        };
        this.saveList(listObj);
    }

    async saveList(listObj) {
        if(!listObj) return;

        const result = await listsService.save(listObj);
        if(result.fail) {
            this.savedListView.isInvalid();
            return;
        }
        log(result);
        this.savedListView.isValid();
    }

    

    async onLoadListsHandler(page) {
        const userId = this.authView.authUser.userId;
        
        if(!page) {
            const page = 1;
        }
        try {
            const result = await listsService.load(userId, page, this.sortBy);
            log(result);
            this.savedListView.page = Number(result.current);
            this.savedListView.savedLists = result.lists;
            this.savedListView.renderLoadedLists(result.lists);
            this.paginationView.render(result.pages, this.savedListView.page)
        } catch (err) {
            console.error(err)
        }
    }

    async onSelectListHandler(listId) {       
        try {
            const result = await listsService.getList(listId);
            this.removeAllSelections();
            const selectedShops = result.list.shops;
            const selectedProducts = result.list.products;
            
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

        } catch (err) {
            log(err);
        }        
    }

    sortHandler(value) {        
        this.sortList(value.toLowerCase());
    }
    
    sortList(by) {
        // const list = this.savedListView.savedLists;
        switch(by) {
            case 'name':    
                this.sortBy = 'listName';     
                this.onLoadListsHandler(this.savedListView.page);     
                // this.savedListView.renderLoadedLists(list.sort(
                //     (a, b) => a.listName.toLowerCase() > b.listName.toLowerCase()
                //     ));
                break;
            case 'date':
                this.sortBy = 'date';
                this.onLoadListsHandler(this.savedListView.page);
                // this.savedListView.renderLoadedLists(list.sort(
                //     (a, b) => new Date(a.date) - new Date(b.date)
                //     ));
                break;
            default: 
                return;
        }
    }

    

}

