const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Coffee', 'Cold Coffee', 'Snacks', 'Combos', 'Gift Packs']
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500'
    },
    stock: {
        type: Number,
        default: 0
    },
    isBestSeller: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', ProductSchema);
