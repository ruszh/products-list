const log = console.log;

function mergeArrays(arrs) {
    return [...new Set(arrs.reduce((a, b) => [...a, ...b], []))];
}

const sortByName = (a, b) => a.name > b.name ? 1 : -1;
const sortByCheck = (a, b) => a.selected === b.selected ? 0 : b.selected ? 1 : -1;


const ee = new EventEmitter();
const authService = new AuthService();
const listsService = new SavedListsService();
const initService = new InitService();

const productsModel = new ProductsModel();
const shopsModel = new ShopsModel();
``
const shopSearchView = new SearchView('shopsInput');
const productSearchView = new SearchView('productsInput');

const shopsView = new ListView('shopsList');
const productsView = new ListView('productsList');
const authView = new AuthenticationView('login-container');
const savedListView = new SavedListView('savedList');
const paginationView = new PaginationView();

const controller = new Controller(
    shopSearchView,
    shopsView,
    productsView,
    productSearchView,
    shopsModel,
    productsModel,
    authView,
    savedListView,
    paginationView
);

function createRandomLists(num) {
    for(let i = 0; i <  num; i++) {
        const number = Math.ceil(Math.random() * 1000);
        controller.onSaveListHandler(`RandomList#${number}`)
    }
}


