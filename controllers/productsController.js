const Product = require('../model/product');
const Category = require('../model/category');

const getAllProducts = async (req, res) => {
    try {
        const productsList = await Product.findAll();
        console.log(productsList);
        return res.json(productsList);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const storeNewProduct = async (req, res) => {
    console.log(req.body);
    const {name, price, categoryId} = req.body;
    console.log("CATEGORYID: ", categoryId );
    const category = await Category.findByPk(categoryId);
    if (!category) return res.status(400).json({message: 'Category not found'});

    try {
        const newProduct = await Product.create(
            {
                product_name: name,
                product_price: price,
                category_id: categoryId
            });
        res.status(201).json({newProduct});
    } catch (error) {
        console.log("ERROR AQUI:",error.message);
        res.status(500).json({error: error.message});
    }
};

const getProductById = async (req, res) => {
    const {index} = req.params;

    try {
        const product = await Product.findAll({
            where: {product_id: index}
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({error: error.message});
    } 
};

const editProduct = async (req, res) => {
    const {index} = req.params;
    const {name, price} = req.body;

    try {
        const updatedProduct = await Product.update(
            {
                product_name: name,
                product_price: price
            },
            {where: {product_id: index}}
        );
        return res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const deleteProduct = async (req, res) => {
    const {index} = req.params;

    try {
        const product = await Product.findByPk(index);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await Product.destroy({
            where: {product_id: index}
        });
        res.json({message: 'Product deleted sucessfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const getProductsByCategory = async(req, res) => {
    const categoryId = req.params.category_id;
    try {
        const category = await Category.findByPk(categoryId, {
            include: Product,
        });
        console.log(category);
        if (!category) {
            return res.status(404).json({message: 'Category not found'});
        }

        res.json(category.products);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = {getAllProducts, getProductById, editProduct, storeNewProduct, deleteProduct, getProductsByCategory};