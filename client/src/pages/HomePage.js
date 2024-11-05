import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';
import './HomePage.css'; // Import CSS file for skeleton styling

const HomePage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    // Get all products
    const getAllProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`https://zorox-intern-project.onrender.com/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts(data.products);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    // Get total count
    const getTotal = async () => {
        try {
            const { data } = await axios.get('https://zorox-intern-project.onrender.com/api/v1/product/product-count');
            setTotal(data?.total);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllProducts();
        getTotal();
    }, []);

    useEffect(() => {
        if (page === 1) return;
        LoadMore();
    }, [page]);

    // Load more
    const LoadMore = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`https://zorox-intern-project.onrender.com/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts([...products, ...data?.products]);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    return (
        <Layout title={"Sagar's Ecom App-Shop Now....."}>
            <div className="container-fluid row mx-auto">
                <div className="col-md-12 col-sm-12">
                    <h1 className="text-center mt-4">All Products</h1>
                    <div className="d-flex flex-wrap justify-content-center">
                        {loading ? (
                            // Display skeleton loaders when loading is true
                            Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="skeleton-card m-3"></div>
                            ))
                        ) : (
                            // Render products once loading is complete
                            products?.map((p) => (
                                <div key={p._id} className="card m-3" style={{ width: "20rem" }}>
                                    <img
                                        src={`https://zorox-intern-project.onrender.com/api/v1/product/product-photo/${p._id}`}
                                        className="card-img-top"
                                        alt={p.name}
                                        style={{ width: '100%', height: '300px', objectFit: 'cover', padding: '1px', borderRadius: "4px" }}
                                        onMouseOver={(e) => e.target.style.transform = 'scale(0.985)'}
                                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                    />
                                    <hr style={{ margin: '0px', color: "gray" }} />
                                    <div className="card-body" style={{ backgroundColor: 'orange', borderRadius: "0 0 3px 3px" }}>
                                        <h5 className="card-title">{p.name}</h5>
                                        <p className="card-text">
                                            {p.description.substring(0, 50)}...
                                        </p>
                                        <h5 className="card-text" style={{ fontWeight: 'bold', color: 'black' }}>₹{p.price}</h5>
                                        <div className='d-flex justify-content-between'>
                                            <button className="btn btn-primary ms-1 mb-2" onClick={() => navigate(`/product/${p.slug}`)}>MORE DETAILS</button>
                                            <button className="btn btn-success ms-3 mb-2" onClick={() => {
                                                setCart([...cart, p]);
                                                localStorage.setItem("cart", JSON.stringify([...cart, p]));
                                                toast.success('Item Added to Cart');
                                            }}>ADD TO CART</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div>
                        {products && products.length < total && (
                            <div className="card m-2" style={{ width: "14rem", backgroundColor: 'transparent', border: 'none' }}>
                                <button className='deshome btn btn-dark mb-5 mt-3 mx-auto' onClick={(e) => {
                                    e.preventDefault();
                                    setPage(page + 1);
                                }}>
                                    {loading ? "Loading..." : "Load More"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
