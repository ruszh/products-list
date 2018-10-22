function mergeArrays(arrs) {       
    return [...new Set(arrs.reduce((a, b) => [...a, ...b], []))];
}

const log = console.log;

const productsModel = new ProductsModel();
const shopsModel = new ShopsModel();

const shopSearchView = new SearchView('shopsInput');
const productSearchView = new SearchView('productsInput');

const shopsView = new ListView('shopsList');
const productsView = new ListView('productsList');

const controller = new Controller(
    shopSearchView, 
    shopsView, 
    productsView, 
    productSearchView, 
    shopsModel, 
    productsModel
);

controller.initialize();
