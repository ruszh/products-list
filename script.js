
function contains(where, what) {
    for(let i = 0; i < what.length; i++) {
        if(where.indexOf(what[i]) == -1) return false;
    }
    return true;
}

function mergeArrays(...arrs) {
    const arr = [].concat.apply([], [...arrs]);
    
    return [...new Set([].concat(arr))]
    
}

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
            return this.shops.filter(el => contains(el.products, hasProducts));
        }
        return this.shops;
    }

    getShopsById(arr) {
        const shopsList = arr.map(el => {
            return this.shops.find(e => e.id === +el)
        });

        return shopsList;
    }
    
}

class ProductsModel {
    constructor() {
        this.allProducts = ["кофе", "бытовая химия", "шоколад", "овощи", "фрукты", "товары для дома", "молоко", "яйца", "чай", "мясо", "готовая еда"]
    }

    getProductsList() {
        return this.allProducts;
    }
}

class ShopsView {
    constructor() {
        this.shopsList = document.getElementById('shopsList');
    }
    render(shops) {
        const shopsList = shops.reduce((els, el) => (els +
            `<li class="list-group-item" data-id="${el.id}">
                <input type='checkbox' class="checkbox"/>
                ${el.name}
            </li>`
        ), '')
        this.shopsList.innerHTML = shopsList;
    }

    selectedShops() {
        const checkboxes = this.shopsList.querySelectorAll('.checkbox');
        const selectedShopsArr = [];

        checkboxes.forEach((el) => {
            if(el.checked === true) {
                selectedShopsArr.push(+el.parentNode.dataset.id)
            }
        });
        return selectedShopsArr;
    }
    
}

class ProductsView {
    constructor() {
        this.productsList = document.getElementById('productsList');
    }

    render(products) {
        const productsList = products.reduce((els, el) => (els +
            `<li class="list-group-item" data-name="${el}">
                <input type='checkbox' class="checkbox"/>
                ${el}
            </li>`
        ), '')
        this.productsList.innerHTML = productsList;
    }

    selectedProducts() {
        const checkboxes = this.productsList.querySelectorAll('.checkbox');
        const selectedProductsArr = [];

        checkboxes.forEach((el) => {
            if(el.checked === true) {
                selectedProductsArr.push(el.parentNode.dataset.name)
            }
        });

        return selectedProductsArr;
    }

}

class Controller {
    constructor(shopsView, productsView, shopsModel, productsModel) {
        this.shopsView = shopsView;
        this.productsView = productsView;
        this.shopsModel = shopsModel;
        this.productsModel = productsModel;        
    }

    renderShopsList() {
        let products = this.productsView.selectedProducts();        
        if(products.length > 0) {
            let shopsList = this.shopsModel.getShopsList(products);
            this.shopsView.render(shopsList);
            return;
        }
        let shopsList = this.shopsModel.getShopsList();
        this.shopsView.render(shopsList);
    }

    renderProductsList(productsArr) {
        if(productsArr && this.selectedShops().length !== 0) {
            this.productsView.render(productsArr); 
        } else {
            const productsList = this.productsModel.getProductsList();
            this.productsView.render(productsList);
        }
        
    }

    renderSelectedProductsList() {
        const selectedShopsProductsArr = this.selectedShops().map(el => el.products);
        const mergeProductsArr = mergeArrays(...selectedShopsProductsArr);

        this.renderProductsList(mergeArrays(mergeProductsArr));
    }

    selectedShops() {
        const selectedShops = this.shopsView.selectedShops();
        const selectedShopsArr = this.shopsModel.getShopsById(selectedShops);

        return selectedShopsArr;
    }
}


const shopsModel = new ShopsModel();
const productsModel = new ProductsModel();

const shopsView = new ShopsView();
const productsView = new ProductsView();

const controller = new Controller(shopsView, productsView, shopsModel, productsModel);

const productsList = document.getElementById('productsList');
const shopsList = document.getElementById('shopsList');

productsList.addEventListener('change', () => {
    controller.renderShopsList();
});

shopsList.addEventListener('change', () => {
    controller.renderSelectedProductsList();
})

controller.renderShopsList();
controller.renderProductsList();