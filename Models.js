class ShopsModel {
    constructor() {
        this.shops = [
                {
                    id: 1,
                    name: 'АТБ',                
                    products: ["кофе", "бытовая химия", "шоколад", "овощи", "фрукты", "товары для дома", "молоко", "яйца", "чай" ]
                },
                {
                    id: 2,
                    name: 'Сильпо',
                    products: ["кофе", "бытовая химия", "шоколад", "фрукты", "товары для дома", "молоко", "яйца", "чай", "мясо", "готовая еда"]
                },
                {
                    id: 3,
                    name: 'Класс',                
                    products: ["овощи", "фрукты", "товары для дома", "молоко", "яйца", "чай", "готовая еда"]
                },
                {
                    id: 4,
                    name: 'Метро',
                    products: ["кофе", "бытовая химия", "шоколад", "овощи", "фрукты", "молоко", "яйца", "чай", "мясо"]
                }
            ];
        }

    getShopsList(hasProducts) { 
        if (hasProducts) {
            return this.shops.filter(el => hasProducts.every(product => el.products.find(i => product === i)));
        }
        return this.shops;
    }
}

class ProductsModel {
    constructor() {
        this.allProducts = ["кофе", "бытовая химия", "шоколад", "овощи", "фрукты", "товары для дома", "молоко", "яйца", "чай", "мясо", "готовая еда"]
        this.productsToRender = [];
    }

    getProductsList() {
        return this.allProducts;
    }

    getProductsToRender() {
        return this.productsToRender;
    }

    addProductToRender(product) {
        this.productsToRender.push(product);
    }

    setProductsToRender(products) {
        this.productsToRender = [...products];
    }

}
