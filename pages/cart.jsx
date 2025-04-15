import styles from "../styles/Cart.module.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
//import { useEffect, useState } from "react";
//the code from here 
import { useEffect, useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
//to here to implement paypal js libary
import axios from "axios";
import {useRouter} from "next/router";
import { reset } from "../redux/cartSlice";
import OrderDetail from "../components/OrderDetail";

const Cart = () => {
  const cart = useSelector((state)=>state.cart);
  const [open , setOpen] = useState(false); //doing this bc i want the cart to show paypal payment option
  //only after you clicl on "checkout now"
    // This values are the props in the UI
  const [cash, setCash] = useState(false);
  const amount = cart.total; //in paypal it will show price of total cart amount
  const currency = "USD";
  const style = {layout:"vertical"};

  const dispatch = useDispatch();
  const router = useRouter();

  const createOrder = async (data) => {
    try {
      const res = await axios.post("http://localhost:3000/api/orders", data);
      if (res.status === 201) {
        dispatch(reset());
        router.push(`/orders/${res.data._id}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

//the function below is to show the paypal button and when you click on it, it redirects you to paypal

  const ButtonWrapper = ({ currency, showSpinner }) => {
    // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
    // This is the main reason to wrap the PayPalButtons in a new component
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
      dispatch({
        type: "resetOptions",
        value: {
          ...options,
          currency: currency,
        },
      });
    }, [currency, showSpinner]);

    return (
      <>
        {showSpinner && isPending && <div className="spinner" />}
        <PayPalButtons
          style={style}
          disabled={false}
          forceReRender={[amount, currency, style]}
          fundingSource={undefined}
          createOrder={(data, actions) => {
            return actions.order
              .create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: currency,
                      value: amount,
                    },
                  },
                ],
              })
              .then((orderId) => {
                // Your code here after create the order
                return orderId;
              });
          }}
          onApprove={function (data, actions) {
            return actions.order.capture().then(function (details) {
              //code here after capture the order
              const shipping = details.purchase_units[0].shipping;
              //data for order
              createOrder({
                customer: shipping.name.full_name,
                address: shipping.address.address_line_1,
                total: cart.total,
                method: 1, //payment method
               });
            });
          }}
        />
     </>
  );
};
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <table className={styles.table}>
          <tbody>
          <tr className={styles.trTitle}>
            <th>Product</th>
            <th>Name</th>
            <th>Extras</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
          </tbody>

          <tbody>  
          {cart.products.map((product)=>(
            <tr className={styles.tr} key={product._id}>
              <td>
                <div className={styles.imgContainer}>
                  <Image
                    src={product.img}
                    layout="fill"
                    objectFit="cover"
                    alt=""
                  />
                </div>
              </td>
              <td> 
                <span className={styles.name}>{product.title}</span> {/*title of pizza in the cart */}
              </td>
              <td> 
                <span className={styles.extras}>
                  {product.extras.map(extra =>(
                    <span key = {extra._id} >{extra.text}, </span>
                  ))}
                </span>
              </td>
              <td>
                <span className={styles.price}>${product.price}</span> {/*price of pizza in the cart */}
              </td>
              <td>
                <span className={styles.quantity}>{product.quantity}</span> 
              </td>
              <td>
                <span className={styles.total}>
                  ${product.price * product.quantity}
                  </span> {/* when multiple items are added in the cart this will do the calculation in the cart */}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      <div className={styles.right}>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>CART TOTAL</h2>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Subtotal:</b>{cart.total}
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Discount:</b>$0.00
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Total:</b>{cart.total}
          </div>
          {/*if open show me paypal button, if not then show me just checkout button*/}
          {open ? (
            <div className={styles.paymentMethods}>
              <button 
              className = {styles.payButton} 
              onClick={()=>setCash(true)}
              >
                  CASH ON DELIVERY
              </button>
              <PayPalScriptProvider
                options={{
                  /*to get paypal account we have to give client id here */
                  "client-id": 
                  "ARK77-89QdSMdoqX4IZaWb68vg7IJB8RQo2CJx2t4_lUFPzU4_K2F7kNCKrDpzQ5lM8hwwICQcLXQc9e",
                  components: "buttons",
                  currency: "USD",
                  "disable-funding" : "credit,card,p24",
                }}
                >
                <ButtonWrapper
                  currency={currency}
                  showSpinner={false}
                />
                </PayPalScriptProvider>
                </div>
          ) : (      
            <button onClick={() => setOpen(true)} className={styles.button}>
              CHECKOUT NOW!
            </button>
            )}
        </div>
      </div>
      {cash && <OrderDetail total = {cart.total} createOrder = {createOrder} />}
      
    </div>
  );
};

export default Cart;
