import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
const UpdateProduct=()=>{
    const [name,setName]=useState('');
    const [price,setPrice]=useState('');
    const [category,setCategory]=useState('');
    const [company,setCompany]=useState('');
    const [error,setError]=useState(false);
    const params=useParams();
    const navigate=useNavigate();
    useEffect(()=>{
       getProuctDetails();
    },[])
    
    const getProuctDetails=async()=>{
        console.warn(params)
        let result= await fetch(`http://localhost:5000/product/${params.id}`,{
          headers:{authorization: `${JSON.parse(localStorage.getItem('token'))}`}
        });
        result = await result.json();
        setName(result.name)
        setPrice(result.price)
        setCategory(result.category)
        setCompany(result.company)
    }

    const UpdateProduct=async()=>{
        let result= await fetch(`http://localhost:5000/product/${params.id}`,{
            method: 'put',
            body: JSON.stringify({name,price,category,company}),
            headers:{
              'Content-Type': 'application/json',
              authorization: `${JSON.parse(localStorage.getItem('token'))}`
            },
          });
          result= await result.json()
          console.warn(result)
          navigate('/')
    }

    /*const addProduct=async()=>{
        console.warn(name,price,category,company);
        if(!name || !category || !company || !price){
            setError(true)
            return false;
        }
        const userId=JSON.parse(localStorage.getItem('user'))._id;
        console.warn(userId);
        let result= await fetch('http://localhost:5000/add-product',{
          method: 'post',
          body: JSON.stringify({name,price,category,company,userId}),
          headers:{
            'Content-Type': 'application/json'
          },
        });
        result= await result.json()
        console.warn(result)
    }*/
    return (
        <div className="product">
            <h1>Add Product</h1>
            <input className="inputBox" type="text" placeholder="Enter product name"
            value={name} onChange={(e)=>{setName(e.target.value)}}
            />
            {error && !name &&<span className="invalid-input">Enter valid name</span>}
            <input className="inputBox" type="text" placeholder="Enter product price"
            value={price} onChange={(e)=>{setPrice(e.target.value)}}
            />
            {error && !price &&<span className="invalid-input">Enter valid price</span>}
            <input className="inputBox" type="text" placeholder="Enter product category"
            value={category} onChange={(e)=>{setCategory(e.target.value)}}
            />
            {error && !category &&<span className="invalid-input">Enter valid category</span>}
            <input className="inputBox" type="text" placeholder="Enter product company"
            value={company} onChange={(e)=>{setCompany(e.target.value)}}
            />
            {error && !company &&<span className="invalid-input">Enter valid company</span>}
            <button onClick={UpdateProduct} className="appButton">Update Product</button>
        </div>
    )
}

export default UpdateProduct