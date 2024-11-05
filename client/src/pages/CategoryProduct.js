import Layout from '../components/Layout/Layout';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/cart';

const CategoryProduct = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [cart, setCart] = useCart();

    useEffect(() => {
        if (params?.slug) getProductsByCat();
    }, [params?.slug]);

    const getProductsByCat = async () => {
        try {
            const { data } = await axios.get(`https://zorox-intern-project.onrender.com/api/v1/product/product-category/${params.slug}`);
            setProducts(data?.products);
            setCategory(data?.category);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout title={`Ecom App Zorex Product-category: ${category?.name}`}>
            <div className="container mt-3">
                <h4 className="text-center">Category - {category?.name}</h4>
                <h6 className="text-center">{products?.length} results</h6>
                <div className="row">
                    <div className="d-flex flex-wrap justify-content-center">
                        {products?.map((p) => (
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
                                <div style={{ padding: '10px' }}>
                                    <img
                                        src={`https://zorox-intern-project.onrender.com/api/v1/product/product-photo/${p._id}`}
                                        className="card-img-top"
                                        alt={p.name}
                                        style={{
                                            width: "100%",
                                            height: '220px',
                                            objectFit: 'contain',
                                            borderRadius: "6px",
                                            transition: "transform 0.3s"
                                        }}
                                        onMouseOver={(e) => e.target.style.transform = "scale(0.983)"}
                                        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                                    />
                                </div>
                                <div className="card-body" style={{ 
                                    backgroundColor: '#f9f9f9', 
                                    padding: '1rem', 
                                    borderRadius: "0 0 8px 8px" 
                                }}>
                                    <h5 className="card-title" style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>{p.name}</h5>
                                    <p className="card-text" style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                                        {p.description.substring(0, 30)}...
                                    </p>
                                    <h5 className="card-text" style={{ fontWeight: 'bold', color: '#2d3436' }}>₹{p.price}</h5>
                                    <div className="d-flex justify-content-between">
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
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CategoryProduct;
