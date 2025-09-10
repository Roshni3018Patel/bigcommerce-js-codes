console.log("Gitt");
let dealCategoryIds = [23, 18, 19];
function getData(dealCategoryIds) {
  // Build dynamic GraphQL query to get first 5 products of each category
  let categoriesQuery = dealCategoryIds
    .map((id, index) => `
      category${index}: search {
        searchProducts(filters: { categoryEntityIds: [${id}] }) {
          products(first: 5) {
            edges {
              node {
                entityId
                name
                path
                sku
                brand {
                  name
                }
                defaultImage {
                  url(width: 500)
                  altText
                }
                prices {
                  price {
                    formatted
                  }
                }
              }
            }
          }
        }
      }
    `)
    .join("\n");
  const query = `
    {
      site {
        ${categoriesQuery}
      }
    }
  `;
  // Perform AJAX call
  fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer {{settings.storefront_api.token}}'
    },
    body: JSON.stringify({ query })
  })
  .then(response => response.json())
  .then(data => {
    console.log('GraphQL Response===:', data);
  })
  .catch(error => {
    console.error('GraphQL Error:', error);
  });
}
// Call the function
getData(dealCategoryIds);
