document.addEventListener('DOMContentLoaded', () => {
    const categoryIds = [23, 18, 19]; // Array of category IDs
    const first = 10; // Number of products to fetch

    categoryIds.forEach((categoryId) => {
        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query GetProductsByCategory($categoryId: Int!, $first: Int!) {
                        site {
                            search {
                                searchProducts(filters: { categoryEntityId: $categoryId }) {
                                    products(first: $first) {
                                        edges {
                                            node {
                                                id
                                                name
                                                defaultImage {
                                                    url(width: 300)
                                                }
                                                prices {
                                                    price {
                                                        value
                                                        currencyCode
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                `,
                variables: { 
                    categoryId: categoryId, // Pass the current category ID
                    first: first,
                },
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            const products = data.data.site.search.searchProducts.products.edges;
            const productList = document.querySelector('.product-list');
            const categoryTitle = `<h2>Category ID: ${categoryId}</h2>`;
            const productItems = products
                .map(
                    (product) => `
                    <div class="product">
                        <img src="${product.node.defaultImage.url}" alt="${product.node.name}" />
                        <h3>${product.node.name}</h3>
                        <p>${product.node.prices.price.value} ${product.node.prices.price.currencyCode}</p>
                    </div>
                    `
                )
                .join('');
            productList.innerHTML += categoryTitle + productItems;
        })
        .catch((error) => console.error(`❌ Error fetching products for category ${categoryId}:`, error));
    });
});