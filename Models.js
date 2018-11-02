class ShopsModel {
    constructor() {
        this.shops = [];
    }

    //return shops by id or all shops
    getShopsList(idsArr) { 
        if(idsArr) return this.shops.filter(el => idsArr.indexOf(el.id) !== -1)
        return this.shops;
    }

    //filtered shops array by products, select, and return arr of shops with selected
    filterShops(prod) {
        if(!prod.length) {
            this.shops = this.shops.map(el => {                
                el.active = true;
                return el;
            });
            return this.shops;
        }

        const filteredShops = this.shops.filter(el => prod.every(product => el.productsids.find(i => product === i)));
        
        this.shops = this.shops.map(el => {
            if(filteredShops.indexOf(el) === -1) {                
                el.active = false;
                return el;
            }
            el.active = true;
            return el;
        });
        return this.shops;
    }
    
    selectShop(shopId) {
        this.shops.forEach(el => {
            if(el.id === +shopId) {
                el.selected = !el.selected;
                return;
            }
        });
    }
    removeSelection() {
        if(!this.shops.length) return;
        this.shops.forEach(el => el.selected = false)
    }
}

class ProductsModel {
    constructor() {
        this.allProducts = [];
    }

    getProductsList(idsArr) {
        if(idsArr && idsArr.length > 0) {
            return this.allProducts.filter(el => idsArr.indexOf(el.id) !== -1);
        };
        return this.allProducts;
    }

    activeAll() {
        this.allProducts.forEach(el => el.active = true)
    }

    selectProduct(prodId) {        
        this.allProducts.forEach(el => {
            if(el.id === +prodId) {                
                el.selected = !el.selected;
                return;
            }
        });

    }

    getSelectedProducts() {
        return this.allProducts.filter(el => el.selected);
    }
    removeSelection() {
        if(!this.allProducts.length) return;
        this.allProducts.forEach(el => el.selected = false)
    }
    
}

