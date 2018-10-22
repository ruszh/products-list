class ShopsModel {
    constructor() {
        this.shops = [
                {
                    id: 1,
                    name: 'АТБ',                
                    productsIds: [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
                    selected: true
                },
                {
                    id: 2,
                    name: 'Сильпо',
                    productsIds: [ 1, 2, 3, 5, 6, 7, 8, 9, 10, 11],
                    selected: true
                },
                {
                    id: 3,
                    name: 'Класс',                
                    productsIds: [ 4, 5, 6, 7, 8, 9, 11],
                    selected: true
                },
                {
                    id: 4,
                    name: 'Метро',
                    productsIds: [ 1, 2, 3, 4, 5, 7, 8, 9, 10],
                    selected: true
                }
            ];
    }

    getShopsList(idsArr) { 
        if(idsArr) return this.shops.filter(el => idsArr.indexOf(el.id) !== -1)
        return this.shops;
    }

    selectShops(prod) {
        const filteredShops = this.shops.filter(el => prod.every(product => el.productsIds.find(i => product === i)));
        this.shops = this.shops.map(el => {
            if(filteredShops.indexOf(el) === -1) {
                el.selected = false;
                return el;
            }
            el.selected = true;
            return el;
        });
        return this.shops;
    }
}

class ProductsModel {
    constructor() {
        this.allProducts = [
            { id: 1, name: "кофе", selected: true }, 
            { id: 2, name: "бытовая химия", selected: true }, 
            { id: 3, name: "шоколад", selected: true }, 
            { id: 4, name: "овощи", selected: true }, 
            { id: 5, name: "фрукты", selected: true },
            { id: 6, name: "товары для дома", selected: true },
            { id: 7, name: "молоко", selected: true },
            { id: 8, name: "яйца", selected: true }, 
            { id: 9, name: "чай", selected: true },
            { id: 10, name: "мясо", selected: true }, 
            { id: 11, name: "готовая еда", selected: true }
        ];
        this.selectMode = false;
        this.selectedArr = [];
    }

    getAllProducts() {
        return this.allProducts;
    }

    getProductsList(idsArr) {
        if(idsArr && idsArr.length > 0) {
            return this.allProducts.filter(el => idsArr.indexOf(el.id) !== -1);
        };
        if(this.selectMode) return this.selectedArr;
        return this.allProducts;
    }

    addToSelectedArr(element) {
        if(typeof element == 'number') {
            this.selectedArr.push(this.allProducts.find(el => el.id === element));
            return;
        }
        this.selectedArr.push(element);
    }

    setSelectedArr(arr) {
        this.selectedArr = [...arr];
    }

    setSelectMode(value) {
        this.selectMode = value;
    }
    
}
