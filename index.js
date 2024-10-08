let productListData = undefined;
let filteredProducts = undefined;

let startIndex = 0;
let endIndex = 10;

let product = "";
let filterCategories = [];

let sortByPrice = "";
let searchedText = "";

let showMoreButtonElement = `<div class="text-center showmore"><a href="javascript:void(0)">show more</a></div></div>`;
let loader = [1,2,3,4,5,6,7,8].map(res => {return `<div class="shimmer-loader"></div>`}).join('');

let showMoreContainer = document.getElementById('showmoreContainer');
let productListContainer = document.getElementById('productListContainer');

async function fetchProductList() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        productListData = await response.json();
        filteredProducts = productListData;
        bindResultCount();
        addProductsToContainer(filteredProducts);
    } catch (error) {
        productListContainer.innerHTML = `<p class="word-wrap ml">An error has occurred.</p>`;
        document.getElementById('errorModal').style.display = 'block';
    }
}

function bindResultCount() {
    let resultCount = `<p class="text-nowrap ml">${productListContainer.children.length} Results</p>`;
    let resultCountElem = document.getElementById('resultstxt');
    let mobileResultCountElem = document.getElementById('mobileResultstxt');
    resultCountElem.innerHTML = resultCount;
    mobileResultCountElem.innerHTML = resultCount;
}

productListContainer.innerHTML = loader;
fetchProductList();

function addProductsToContainer(data, loardMore = false) {
    if (!loardMore) product = "";
    for (let i = startIndex; i < (endIndex < data.length ? endIndex : data.length); i++) {
        product = product + `<div class="product" onclick="window.location.href='../../pages/product-details/product-details.html'">
                <img src="${data[i].image}" class="bg-secondary" alt="">
                <p class="product-title"><b>${data[i].title}</b></p>
                <p><b>${'$' + data[i].price}</b></p>
                <div class="heartImg"><img src="../adob-test/images/heart.png" /></div>
            </div>`;
    }
    if (filteredProducts.length > 10) {
        showMoreContainer.innerHTML = showMoreButtonElement;
        document.querySelector('.showmore').addEventListener('click', showMoreProducts);
    }
    if (endIndex >= filteredProducts.length) {
        document.querySelector('.showmore') && document.querySelector('.showmore').remove();
    }
    productListContainer.innerHTML = product;
    bindResultCount();
}

function searchProduct(searchText) {
    searchedText = searchText;
    filterProducts('',false,true);
}

function filterProducts(categoryName, checked, searchFlag=false) {
    startIndex = 0;
    endIndex = 10;
    
    if (checked) {
        filterCategories.push(categoryName);
    } else {
        !searchFlag && filterCategories.splice(filterCategories.indexOf(categoryName), 1);
    }

    filteredProducts = filterCategories.length === 0 
    ? productListData 
    : productListData.filter(productObj => filterCategories.includes(productObj.category));

    if (searchedText) {
        filteredProducts = filteredProducts.filter(product => product.title.toLowerCase().includes(searchedText.toLowerCase()));
    }
    
    sortProducts(sortByPrice);
};

const sortByPriceAsc = (items) => {
    return items.slice().sort((a, b) => a.price - b.price);
};

const sortByPriceDesc = (items) => {
    return items.slice().sort((a, b) => b.price - a.price);
};

function sortProducts(sortType) {
    sortByPrice = sortType;
    startIndex = 0;
    endIndex = 10;
    if (sortType === 'asc') {
        filteredProducts = sortByPriceAsc(filteredProducts);
    } else if (sortType === 'desc') {
        filteredProducts = sortByPriceDesc(filteredProducts);
    }
    addProductsToContainer(filteredProducts);
}

function showMoreProducts() {
    startIndex = endIndex;
    endIndex += 10;
    addProductsToContainer(filteredProducts, true);
}
