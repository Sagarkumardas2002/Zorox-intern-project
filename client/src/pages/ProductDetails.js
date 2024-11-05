


import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/cart';

const ProductDetails = () => {
    const params = useParams();
    const [cart, setCart] = useCart();
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedproducts] = useState([]);

    // Initial details
    useEffect(() => {
        if (params?.slug)
            getProduct();
    }, [params?.slug]);

    // Get product details
    const getProduct = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
            setProduct(data?.product);
            getSimilarProduct(data?.product._id, data?.product.category._id);
        } catch (error) {
            console.log(error);
        }
    };

    // Get similar products
    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(`/api/v1/product/related-product/${pid}/${cid}`);
            setRelatedproducts(data?.products);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <div className="container mt-2">
                <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-8 mx-auto">
                        <div className="mt-5 mb-3 mb-sm-3 p-1" style={{ border: "2px solid #ddd", borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                            <img
                                src={`/api/v1/product/product-photo/${product._id}`}
                                className='card-img-top img-fluid'
                                alt={product.name}
                                width="100%"
                                style={{ transition: "transform 0.3s", objectFit: "cover" }}
                                onMouseOver={(e) => e.target.style.transform = "scale(1.07)"}
                                onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                            />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-8 col-sm-10 mx-auto  mt-3 " >

                        <div className="mt-3 " >
                            <h5 className="text-center mb-2 fs-1">About Product</h5>
                            <hr style={{ height: '1px', backgroundColor: '#000' }} />
                            <div className="mt-4 mx-3" >
                                <h6>Name: {product.name}</h6>
                                <h6>Description: {product.description}</h6>
                                <h6>Category: {product.category?.name}</h6>
                                <h6>Price: ₹{product.price}</h6>
                            </div>

                            <button
                                className="btn btn-dark mt-3 text-center mx-4"
                                onClick={() => {
                                    setCart([...cart, product]);
                                    localStorage.setItem("cart", JSON.stringify([...cart, product]));
                                    toast.success('Item Added to Cart');
                                }}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

            </div >



        </Layout >
    );
};

export default ProductDetails;

