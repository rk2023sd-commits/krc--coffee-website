const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const products = [
    // --- COFFEE (10 items) ---
    {
        name: 'Classic Espresso',
        description: 'Strong and concentrated coffee brewed by forcing a small amount of nearly boiling water through finely-ground coffee beans.',
        price: 150,
        category: 'Coffee',
        image: 'https://loremflickr.com/500/500/espresso,cup?random=1',
        stock: 50,
        isBestSeller: true,
        averageRating: 4.8,
        numReviews: 12
    },
    {
        name: 'Cappuccino Supreme',
        description: 'A perfect balance of espresso, steamed milk, and foam.',
        price: 200,
        category: 'Coffee',
        image: 'https://loremflickr.com/500/500/cappuccino,latte?random=2',
        stock: 40,
        isBestSeller: true,
        averageRating: 4.7,
        numReviews: 15
    },
    {
        name: 'Latte Macchiato',
        description: 'Steamed milk stained with a shot of espresso.',
        price: 220,
        category: 'Coffee',
        image: 'https://loremflickr.com/500/500/latte,coffee?random=3',
        stock: 35,
        isBestSeller: false,
        averageRating: 4.5,
        numReviews: 8
    },
    {
        name: 'Americano Bold',
        description: 'Diluted espresso with hot water, giving it a similar strength to, but different flavor from, traditionally brewed coffee.',
        price: 160,
        category: 'Coffee',
        image: 'https://loremflickr.com/500/500/blackcoffee,cup?random=4',
        stock: 60,
        isBestSeller: false,
        averageRating: 4.2,
        numReviews: 5
    },
    {
        name: 'Mocha Madness',
        description: 'A chocolate-flavoured variant of a caffè latte.',
        price: 240,
        category: 'Coffee',
        image: 'https://loremflickr.com/500/500/mocha,chocolate?random=5',
        stock: 25,
        isBestSeller: true,
        averageRating: 4.9,
        numReviews: 20
    },
    {
        name: 'Hazelnut Brew',
        description: 'Rich coffee with a nutty hazelnut flavor.',
        price: 230,
        category: 'Coffee',
        image: 'https://loremflickr.com/500/500/hazelnut,coffee?random=6',
        stock: 30,
        isBestSeller: false,
        averageRating: 4.6,
        numReviews: 10
    },
    {
        name: 'Vanilla Bean Coffee',
        description: 'Smooth coffee infused with sweet vanilla bean.',
        price: 230,
        category: 'Coffee',
        image: 'https://loremflickr.com/500/500/vanilla,latte?random=7',
        stock: 30,
        isBestSeller: false,
        averageRating: 4.5,
        numReviews: 9
    },
    {
        name: 'Caramel Drizzle Latte',
        description: 'Coffee topped with caramel sauce and steamed milk.',
        price: 250,
        category: 'Coffee',
        image: 'https://loremflickr.com/500/500/caramel,coffee?random=8',
        stock: 20,
        isBestSeller: true,
        averageRating: 4.8,
        numReviews: 18
    },
    {
        name: 'Irish Cream Coffee',
        description: 'Coffee with a hint of non-alcoholic Irish cream flavor.',
        price: 260,
        category: 'Coffee',
        image: 'https://loremflickr.com/500/500/irish,coffee?random=9',
        stock: 15,
        isBestSeller: false,
        averageRating: 4.4,
        numReviews: 6
    },
    {
        name: 'Turkish Delight Coffee',
        description: 'Traditional unfiltered coffee with a distinct aroma.',
        price: 180,
        category: 'Coffee',
        image: 'https://loremflickr.com/500/500/turkish,coffee?random=10',
        stock: 45,
        isBestSeller: false,
        averageRating: 4.3,
        numReviews: 7
    },

    // --- COLD COFFEE (10 items) ---
    {
        name: 'Classic Iced Frappe',
        description: 'A foam-covered iced coffee drink made from instant coffee.',
        price: 190,
        category: 'Cold Coffee',
        image: 'https://loremflickr.com/500/500/frappe,drink?random=11',
        stock: 50,
        isBestSeller: true,
        averageRating: 4.7,
        numReviews: 14
    },
    {
        name: 'Cold Brew Classic',
        description: 'Coffee brewed with room temperature or cold water over a 12 to 24-hour period.',
        price: 210,
        category: 'Cold Coffee',
        image: 'https://loremflickr.com/500/500/coldbrew,ice?random=12',
        stock: 40,
        isBestSeller: false,
        averageRating: 4.6,
        numReviews: 11
    },
    {
        name: 'Vanilla Iced Latte',
        description: 'Espresso mixed with cold milk and vanilla syrup.',
        price: 230,
        category: 'Cold Coffee',
        image: 'https://loremflickr.com/500/500/icedlatte,glass?random=13',
        stock: 35,
        isBestSeller: true,
        averageRating: 4.8,
        numReviews: 19
    },
    {
        name: 'Caramel Frappuccino',
        description: 'Ice blended with coffee and caramel syrup, topped with whipped cream.',
        price: 250,
        category: 'Cold Coffee',
        image: 'https://loremflickr.com/500/500/frappuccino,caramel?random=14',
        stock: 30,
        isBestSeller: false,
        averageRating: 4.5,
        numReviews: 8
    },
    {
        name: 'Chocolate Cookie Shake',
        description: 'Coffee blended with chocolate cookies and milk.',
        price: 260,
        category: 'Cold Coffee',
        image: 'https://loremflickr.com/500/500/chocolate,milkshake?random=15',
        stock: 25,
        isBestSeller: false,
        averageRating: 4.9,
        numReviews: 22
    },
    {
        name: 'Hazelnut Cold Coffee',
        description: 'Chilled coffee with a nutty hazelnut twist.',
        price: 220,
        category: 'Cold Coffee',
        image: 'https://loremflickr.com/500/500/icedcoffee,glass?random=16',
        stock: 40,
        isBestSeller: false,
        averageRating: 4.4,
        numReviews: 6
    },
    {
        name: 'Minty Mocha Cold Brew',
        description: 'Cold brew with a refreshing hint of mint and chocolate.',
        price: 240,
        category: 'Cold Coffee',
        image: 'https://loremflickr.com/500/500/icedmocha,mint?random=17',
        stock: 20,
        isBestSeller: false,
        averageRating: 4.3,
        numReviews: 5
    },
    {
        name: 'Iced Americano',
        description: 'Espresso shot topped with cold water and ice.',
        price: 170,
        category: 'Cold Coffee',
        image: 'https://loremflickr.com/500/500/icedamericano?random=18',
        stock: 50,
        isBestSeller: false,
        averageRating: 4.1,
        numReviews: 4
    },
    {
        name: 'Berry Blast Cold Coffee',
        description: 'Unique blend of coffee with berry flavors.',
        price: 270,
        category: 'Cold Coffee',
        image: 'https://loremflickr.com/500/500/berry,smoothie?random=19',
        stock: 15,
        isBestSeller: false,
        averageRating: 4.2,
        numReviews: 3
    },
    {
        name: 'Nitro Cold Brew',
        description: 'Cold brew coffee infused with nitrogen gas.',
        price: 280,
        category: 'Cold Coffee',
        image: 'https://loremflickr.com/500/500/nitrocoffee?random=20',
        stock: 10,
        isBestSeller: true,
        averageRating: 4.9,
        numReviews: 12
    },

    // --- SNACKS (10 items) ---
    {
        name: 'Butter Croissant',
        description: 'Flaky, buttery, and authentic French pastry.',
        price: 120,
        category: 'Snacks',
        image: 'https://loremflickr.com/500/500/croissant,pastry?random=21',
        stock: 60,
        isBestSeller: true,
        averageRating: 4.8,
        numReviews: 25
    },
    {
        name: 'Chocolate Muffin',
        description: 'Moist and rich chocolate muffin with choc chips.',
        price: 100,
        category: 'Snacks',
        image: 'https://loremflickr.com/500/500/chocolate,muffin?random=22',
        stock: 50,
        isBestSeller: false,
        averageRating: 4.7,
        numReviews: 18
    },
    {
        name: 'Blueberry Scone',
        description: 'Traditional scone packed with fresh blueberries.',
        price: 110,
        category: 'Snacks',
        image: 'https://loremflickr.com/500/500/scone,blueberry?random=23',
        stock: 40,
        isBestSeller: false,
        averageRating: 4.5,
        numReviews: 10
    },
    {
        name: 'Cheese Bagel',
        description: 'Freshly baked bagel topped with melted cheese.',
        price: 130,
        category: 'Snacks',
        image: 'https://loremflickr.com/500/500/bagel,bread?random=24',
        stock: 35,
        isBestSeller: false,
        averageRating: 4.4,
        numReviews: 8
    },
    {
        name: 'Pesto Sandwich',
        description: 'Grilled sandwich with basil pesto and mozzarella.',
        price: 180,
        category: 'Snacks',
        image: 'https://loremflickr.com/500/500/sandwich,food?random=25',
        stock: 30,
        isBestSeller: true,
        averageRating: 4.7,
        numReviews: 20
    },
    {
        name: 'Chicken Puff',
        description: 'Golden puff pastry filled with spiced chicken.',
        price: 90,
        category: 'Snacks',
        image: 'https://loremflickr.com/500/500/pastry,puff?random=26',
        stock: 50,
        isBestSeller: false,
        averageRating: 4.6,
        numReviews: 15
    },
    {
        name: 'Veggie Wrap',
        description: 'Tortilla wrap filled with fresh vegetables and mayo.',
        price: 160,
        category: 'Snacks',
        image: 'https://loremflickr.com/500/500/vegetable,wrap?random=27',
        stock: 35,
        isBestSeller: false,
        averageRating: 4.3,
        numReviews: 7
    },
    {
        name: 'Cinnamon Roll',
        description: 'Sweet bread roll filled with cinnamon and sugar.',
        price: 140,
        category: 'Snacks',
        image: 'https://loremflickr.com/500/500/cinnamonroll,pastry?random=28',
        stock: 40,
        isBestSeller: true,
        averageRating: 4.9,
        numReviews: 30
    },
    {
        name: 'Chocolate Chip Cookie',
        description: 'Classic chewy cookie with semi-sweet chocolate chips.',
        price: 80,
        category: 'Snacks',
        image: 'https://loremflickr.com/500/500/cookie,chocolate?random=29',
        stock: 100,
        isBestSeller: true,
        averageRating: 4.8,
        numReviews: 40
    },
    {
        name: 'Banana Bread Slice',
        description: 'Moist banana bread slice, perfect with coffee.',
        price: 90,
        category: 'Snacks',
        image: 'https://loremflickr.com/500/500/cake,slice?random=30',
        stock: 45,
        isBestSeller: false,
        averageRating: 4.5,
        numReviews: 12
    },

    // --- COMBOS (10 items) ---
    {
        name: 'Morning Kickstart',
        description: 'Classic Espresso served with a fresh Butter Croissant.',
        price: 250,
        category: 'Combos',
        image: 'https://loremflickr.com/500/500/breakfast,coffee?random=31',
        stock: 30,
        isBestSeller: true,
        averageRating: 4.9,
        numReviews: 15
    },
    {
        name: 'Sweet Treat Combo',
        description: 'Iced Frappe paired with a rich Chocolate Muffin.',
        price: 270,
        category: 'Combos',
        image: 'https://loremflickr.com/500/500/cake,coffee?random=32',
        stock: 25,
        isBestSeller: false,
        averageRating: 4.7,
        numReviews: 10
    },
    {
        name: 'Lunch Duo',
        description: 'Pesto Sandwich served with a refreshing Iced Americano.',
        price: 330,
        category: 'Combos',
        image: 'https://loremflickr.com/500/500/lunch,meal?random=33',
        stock: 20,
        isBestSeller: false,
        averageRating: 4.6,
        numReviews: 8
    },
    {
        name: 'Classic Pair',
        description: 'Cappuccino Supreme with two Chocolate Chip Cookies.',
        price: 260,
        category: 'Combos',
        image: 'https://loremflickr.com/500/500/cookies,cup?random=34',
        stock: 30,
        isBestSeller: true,
        averageRating: 4.8,
        numReviews: 12
    },
    {
        name: 'Healthy Choice',
        description: 'Veggie Wrap served with a bottle of water.',
        price: 180,
        category: 'Combos',
        image: 'https://loremflickr.com/500/500/wrap,sandwich?random=35',
        stock: 25,
        isBestSeller: false,
        averageRating: 4.3,
        numReviews: 5
    },
    {
        name: 'Chocolate Lovers',
        description: 'Mocha Madness combined with a slice of Chocolate Cake.',
        price: 350,
        category: 'Combos',
        image: 'https://loremflickr.com/500/500/chocolate,cake?random=36',
        stock: 15,
        isBestSeller: true,
        averageRating: 5.0,
        numReviews: 18
    },
    {
        name: 'Friends Combo',
        description: '2 Cappuccinos and 2 Chicken Puffs.',
        price: 550,
        category: 'Combos',
        image: 'https://loremflickr.com/500/500/brunch,food?random=37',
        stock: 10,
        isBestSeller: false,
        averageRating: 4.7,
        numReviews: 11
    },
    {
        name: 'Study Buddy',
        description: 'Large Americano with a Cheese Bagel.',
        price: 280,
        category: 'Combos',
        image: 'https://loremflickr.com/500/500/cafe,table?random=38',
        stock: 30,
        isBestSeller: false,
        averageRating: 4.5,
        numReviews: 9
    },
    {
        name: 'Weekend Brunch',
        description: 'Latte Macchiato with a Blueberry Scone.',
        price: 310,
        category: 'Combos',
        image: 'https://loremflickr.com/500/500/breakfast,spread?random=39',
        stock: 20,
        isBestSeller: false,
        averageRating: 4.6,
        numReviews: 7
    },
    {
        name: 'Evening Snack',
        description: 'Masala Chai (Tea) with a Bun Maska.',
        price: 150,
        category: 'Combos',
        image: 'https://loremflickr.com/500/500/tea,biscuit?random=40',
        stock: 40,
        isBestSeller: true,
        averageRating: 4.8,
        numReviews: 20
    },

    // --- GIFT PACKS (10 items) ---
    {
        name: 'Coffee Connoisseur Kit',
        description: 'Selection of 3 premium coffee bean packs from around the world.',
        price: 1500,
        category: 'Gift Packs',
        image: 'https://loremflickr.com/500/500/coffee,beans?random=41',
        stock: 10,
        isBestSeller: true,
        averageRating: 4.9,
        numReviews: 5
    },
    {
        name: 'Sweet Tooth Hamper',
        description: 'Assorted cookies, chocolates, and brownies in a gift box.',
        price: 1200,
        category: 'Gift Packs',
        image: 'https://loremflickr.com/500/500/chocolates,box?random=42',
        stock: 15,
        isBestSeller: true,
        averageRating: 4.8,
        numReviews: 8
    },
    {
        name: 'Morning Brew Set',
        description: 'A ceramic mug and a pack of signature ground coffee.',
        price: 800,
        category: 'Gift Packs',
        image: 'https://loremflickr.com/500/500/coffee,mug?random=43',
        stock: 20,
        isBestSeller: false,
        averageRating: 4.5,
        numReviews: 6
    },
    {
        name: 'Premium Beans Collection',
        description: '5 samples of our finest roasts.',
        price: 1800,
        category: 'Gift Packs',
        image: 'https://loremflickr.com/500/500/roasted,coffee?random=44',
        stock: 8,
        isBestSeller: false,
        averageRating: 4.7,
        numReviews: 4
    },
    {
        name: 'Mug & Mocha Box',
        description: 'Instant mocha mix with a travel mug.',
        price: 750,
        category: 'Gift Packs',
        image: 'https://loremflickr.com/500/500/thermos,coffee?random=45',
        stock: 25,
        isBestSeller: false,
        averageRating: 4.3,
        numReviews: 10
    },
    {
        name: 'Assorted Snacks Basket',
        description: 'A big basket with chips, cookies, and nuts.',
        price: 2000,
        category: 'Gift Packs',
        image: 'https://loremflickr.com/500/500/snack,basket?random=46',
        stock: 5,
        isBestSeller: true,
        averageRating: 5.0,
        numReviews: 3
    },
    {
        name: 'Coffee & Cookies Tin',
        description: 'Classic pairing in a reusable tin box.',
        price: 950,
        category: 'Gift Packs',
        image: 'https://loremflickr.com/500/500/cookies,tin?random=47',
        stock: 30,
        isBestSeller: false,
        averageRating: 4.6,
        numReviews: 7
    },
    {
        name: 'The Barista Box',
        description: 'Includes a french press and a bag of coarse grind coffee.',
        price: 2500,
        category: 'Gift Packs',
        image: 'https://loremflickr.com/500/500/frenchpress,coffee?random=48',
        stock: 10,
        isBestSeller: true,
        averageRating: 4.9,
        numReviews: 9
    },
    {
        name: 'Festival Special Hamper',
        description: 'Festive treats and coffee for the holiday season.',
        price: 3000,
        category: 'Gift Packs',
        image: 'https://loremflickr.com/500/500/christmas,cookies?random=49',
        stock: 5,
        isBestSeller: false,
        averageRating: 4.8,
        numReviews: 12
    },
    {
        name: 'Office Essentials Pack',
        description: 'Bulk instant coffee and stirrers for the workplace.',
        price: 5000,
        category: 'Gift Packs',
        image: 'https://loremflickr.com/500/500/coffee,jars?random=50',
        stock: 10,
        isBestSeller: false,
        averageRating: 4.2,
        numReviews: 2
    }
];

const importData = async () => {
    try {
        await Product.deleteMany(); // Clear existing products

        await Product.insertMany(products);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Product.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
