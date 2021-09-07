import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { isAutheticated } from '../auth/helper';
import { loadCart,cartEmpty } from './helper/CartHelper';
import { getMeToken, processPament } from './helper/PaymentBHelper';
import {createOrder} from "./helper/OrderHelper"
import DropIn from 'braintree-web-drop-in-react';
import { getProducts } from './helper/coreapicalls';

export default function PaymentB() {
    const userId = isAutheticated() && isAutheticated().user._id
    const token = isAutheticated() && isAutheticated().token
    const [info, setInfo] = useState({
        loading:false,
        success:false,
        clientToken:null,
        error:"",
        instance:{}
    })
    const getToken = (userId,token)=>{
        getMeToken(userId,token).then(info=>{
            console.log("info",info);
            if(info.error){
                setInfo({...info,error:info.error})
            }else{
                const clienttoken = info.clienttoken
                setInfo({clienttoken})
            }
        })
    }
   const showDropIn = ()=>{
       return(

       <div>
           {info.clienttoken !== null && getProducts.length>0?(
            <div>
            <DropIn 
                options={{authorization:info.clienttoken}}
                onInstance={instance=>(info.instance=instance)}
                />
                <button onClick={()=>{}}>Buy</button>
            </div>
                    ):(<h3>Please Login or Add products to your Cart</h3>)
            }
      
       </div>
       )

  
   }
    useEffect(() => {
        getToken(userId,token)
      
    }, [])
    return (
        <div>
            <h3>Test bt</h3>
            {showDropIn()}
        </div>
    )
}
