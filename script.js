
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




