function mergeArrays(arrs) {       
    return [...new Set(arrs.reduce((a, b) => [...a, ...b], []))];
}

const sortByName = (a, b) => a.name > b.name ? 1 : -1;
const sortByCheck = (a, b) => a.selected === b.selected ? 0 : b.selected ? 1 : -1;


const log = console.log;

const ee = new EventEmitter();

const productsModel = new ProductsModel();
const shopsModel = new ShopsModel();
const authModel = new AuthenticationModel();

const shopSearchView = new SearchView('shopsInput');
const productSearchView = new SearchView('productsInput');

const shopsView = new ListView('shopsList');
const productsView = new ListView('productsList');
const authView = new AuthenticationView('login-container');

const controller = new Controller(
    shopSearchView, 
    shopsView, 
    productsView, 
    productSearchView, 
    shopsModel, 
    productsModel,
    authView,
    authModel
);


