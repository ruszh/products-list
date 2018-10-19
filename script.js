
function mergeArrays(arrs) {       
    return [...new Set(arrs.reduce((a, b) => [...a, ...b], []))];
}

const shopsModel = new ShopsModel();
// const productsModel = new ProductsModel();

// const shopsView = new ShopsView();
// const productsView = new ProductsView();

const shopsInputView = new ShopsInput('shopsInput')



const controller = new Controller(shopsInputView, shopsModel);

controller.renderShopsInput();
controller.initilize();
controller.renderSearchList(shopsModel.getShopsList());
// controller.renderShopsList();
// controller.renderProductsList();
