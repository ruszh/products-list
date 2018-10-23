class ShopsModel {
    constructor() {
        this.shops = [
                {
                    id: 1,
                    name: 'АТБ',                
                    productsIds: [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
                    active: true,
                    selected: false
                },
                {
                    id: 2,
                    name: 'Сильпо',
                    productsIds: [ 1, 2, 3, 5, 6, 7, 8, 9, 10, 11],
                    active: true,
                    selected: false
                },
                {
                    id: 3,
                    name: 'Класс',                
                    productsIds: [ 4, 5, 6, 7, 8, 9, 11],
                    active: true,
                    selected: false
                },
                {
                    id: 4,
                    name: 'Метро',
                    productsIds: [ 1, 2, 3, 4, 5, 7, 8, 9, 10],
                    active: true,
                    selected: false
                }
            ];
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
        const filteredShops = this.shops.filter(el => prod.every(product => el.productsIds.find(i => product === i)));
        
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
        })
    }
}

class ProductsModel {
    constructor() {
        this.allProducts = [
            { id: 1, name: "кофе", active: true, selected: false }, 
            { id: 2, name: "бытовая химия", active: true, selected: false }, 
            { id: 3, name: "шоколад", active: true, selected: false }, 
            { id: 4, name: "овощи", active: true, selected: false }, 
            { id: 5, name: "фрукты", active: true, selected: false },
            { id: 6, name: "товары для дома", active: true, selected: false },
            { id: 7, name: "молоко", active: true, selected: false },
            { id: 8, name: "яйца", active: true, selected: false }, 
            { id: 9, name: "чай", active: true, selected: false },
            { id: 10, name: "мясо", active: true, selected: false }, 
            { id: 11, name: "готовая еда", active: true, selected: false }
        ];
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
        
        return this.allProducts.sort((a, b) => a.selected > b.selected ? -1 : 1)
    }

    getSelectedProducts() {
        return this.allProducts.filter(el => el.selected);
    }
    
}
