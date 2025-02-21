


const cartItems = [
    {
        "id": "4948b255c839464e9d844c84f0dcb264",
        "customerId": "fdb3d2578c604b0084b9f429f88a87ae",
        "productId": "48d9cab656c14f868cf2d7c2cc60ed5e",
        "quantity": 1,
        "Product": {
            "productName": "Harman Kardon Onyx Studio 9",
            "price": 39000,
            "discount": "0.00",
            "image": [
                "/images/productImages/1738872620861-189051364.png",
                "/images/productImages/1738872620863-881651823.webp",
                "/images/productImages/1738872620864-711349178.jpg"
            ],
            "status": "Available",
            "quantity": 3
        }
    },
    {
        "id": "884979240f954fe9a8e3b9c95acf17a6",
        "customerId": "fdb3d2578c604b0084b9f429f88a87ae",
        "productId": "a067862783964f7493048e6575bbe674",
        "quantity": 1,
        "Product": {
            "productName": "Apple iPhone 16",
            "price": 70000,
            "discount": "0.00",
            "image": [
                "/images/productImages/1738870894727-698503663.jpg",
                "/images/productImages/1738870894728-678799091.jpg",
                "/images/productImages/1738870894729-328617369.jpg"
            ],
            "status": "available",
            "quantity": 2
        }
    }
]

const userCartMap = new Map(cartItems.map(item => [item.productId,item]));
const productId = "48d9cab656c14f868cf2d7c2cc60ed5e"
console.log(userCartMap.get(productId).quantity);


// for (const cartItemsof of cartItems) {
//     const {productId,quantity} = cartItemsof

//     console.log('productId::', productId);
//     console.log('quantity::', quantity);
// }
