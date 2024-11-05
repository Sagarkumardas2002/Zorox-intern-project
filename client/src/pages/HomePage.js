import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const getAllProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`https://zorox-intern-project.onrender.com/api/v1/product/product-list/${page}`);
            setProducts(data.products);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const getTotal = async () => {
        try {
            const { data } = await axios.get('https://zorox-intern-project.onrender.com/api/v1/product/product-count');
            setTotal(data?.total);
        } catch (error) {
            console.log(error);
        }
    };

    const LoadMore = async () => {
        if (loading) return;
        try {
            setLoading(true);
            const { data } = await axios.get(`https://zorox-intern-project.onrender.com/api/v1/product/product-list/${page}`);
            setProducts((prevProducts) => [...prevProducts, ...data?.products]);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
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

    return (
        <Layout title={"Sagar's Ecom App - Shop Now"}>
            <div className="container-fluid row mx-auto">
                <div className="col-md-12 col-sm-12">
                    <h1 className="text-center mt-4">All Products</h1>
                    <div className="d-flex flex-wrap justify-content-center">
                        {loading && page === 1
                            ? Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="skeleton-card m-3"></div>
                              ))
                            : products?.map((p) => (
                                <div 
                                    key={p._id} 
                                    className="card m-3" 
                                    style={{
                                        width: "18rem", 
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", 
                                        transition: "transform 0.2s, box-shadow 0.2s"
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <div style={{ padding: '10px' }}> {/* Adjusting padding for better image containment */}
                                        <img
                                            src={`https://zorox-intern-project.onrender.com/api/v1/product/product-photo/${p._id}`}
                                            alt={p.name}
                                            style={{
                                                width: '100%',
                                                height: '220px', // Slightly smaller height for better fit
                                                objectFit: 'contain', // 'contain' to avoid cropping any part of the image
                                                borderRadius: "6px",
                                            }}
                                        />
                                    </div>
                                    <div className="card-body" style={{ 
                                        backgroundColor: '#f9f9f9', 
                                        padding: '1rem', 
                                        borderRadius: "0 0 8px 8px" 
                                    }}>
                                        <h5 className="card-title" style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>{p.name}</h5>
                                        <p className="card-text" style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                                            {p.description.substring(0, 50)}...
                                        </p>
                                        <h5 className="card-text price" style={{ fontWeight: 'bold', color: '#2d3436' }}>₹{p.price}</h5>
                                        <div className='d-flex justify-content-between'>
                                            <button 
                                                className="btn btn-primary ms-1 mb-2" 
                                                onClick={() => navigate(`/product/${p.slug}`)}
                                                style={{
                                                    fontSize: '0.85rem',
                                                    fontWeight: '500',
                                                    backgroundColor: '#0056b3',
                                                    borderColor: '#0056b3',
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#004494'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#0056b3'}
                                            >
                                                MORE DETAILS
                                            </button>
                                            <button 
                                                className="btn btn-success ms-3 mb-2" 
                                                onClick={() => {
                                                    setCart([...cart, p]);
                                                    localStorage.setItem("cart", JSON.stringify([...cart, p]));
                                                    toast.success('Item Added to Cart');
                                                }}
                                                style={{
                                                    fontSize: '0.85rem',
                                                    fontWeight: '500',
                                                    backgroundColor: '#28a745',
                                                    borderColor: '#28a745',
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                                            >
                                                ADD TO CART
                                            </button>
                                        </div>
                                    </div>
                                </div>
                              ))
                        }
                    </div>
                    <div>
                        {products && products.length < total && (
                            <div className="card m-2" style={{ width: "14rem", backgroundColor: 'transparent', border: 'none' }}>
                                <button 
                                    className='deshome btn btn-dark mb-5 mt-3 mx-auto' 
                                    onClick={() => setPage((prevPage) => prevPage + 1)}
                                    style={{
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: '#333',
                                        color: '#fff',
                                        border: 'none',
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#444'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#333'}
                                >
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
