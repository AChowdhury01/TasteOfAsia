import styles from "../../styles/Product.module.css";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/cartSlice";


const Product = ({pizza}) => {
  const [price, setPrice] = useState(pizza.prices[0]);
  const [size, setSize] = useState(0);
  //lets create quantity of pizza
  const [quantity, setQuantity] = useState(1);
  const [extras, setExtras] = useState([]);

  const dispatch = useDispatch();

  const changePrice = (number) => {
    setPrice(price + number);
  };

  //this is when i click any button i am gonna calculate how much it will cost. 
  const handleSize = (sizeIndex) => {
    const difference = pizza.prices[sizeIndex] - pizza.prices[size];
    setSize(sizeIndex);
    changePrice(difference);
  };
 
const handleChange = (e,option) => {
  //first let's check whether we check the extra sauce options or not
  const checked = e.target.checked;

  if(checked){
    changePrice(option.price);
    //if it's checked we take prev item in array and add them and we gonna add our option
    setExtras((prev)=>[...prev,option]);

  }else{
    changePrice(-option.price);
    setExtras(extras.filter((extra)=>extra._id !== option._id));
  }
};

const handleClick = () => {
  dispatch(addProduct({...pizza, extras, price, quantity}));
};

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.imgContainer}>
          <Image src={pizza.img} objectFit="contain" layout="fill" alt="" />
        </div>
      </div>
      <div className={styles.right}>
        <h1 className={styles.title}>{pizza.title}</h1>
        <span className={styles.price}>${price}</span>
        <p className={styles.desc}>{pizza.desc}</p>
        <h3 className={styles.choose}>Choose the size</h3>
        <div className={styles.sizes}>
          <div className={styles.size} onClick={() => handleSize(0)}>
            <Image src="/img/size.png" layout="fill" alt="" />
            <span className={styles.number}>Small</span>
          </div>
          <div className={styles.size} onClick={() => handleSize(1)}>
            <Image src="/img/size.png" layout="fill" alt="" />
            <span className={styles.number}>Medium</span>
          </div>
          <div className={styles.size} onClick={() => handleSize(2)}>
            <Image src="/img/size.png" layout="fill" alt="" />
            <span className={styles.number}>Large</span>
          </div>
        </div>
        <h3 className={styles.choose}>Choose additional ingredients</h3>
        <div className={styles.ingredients}>
          {pizza.extraOptions.map(option =>(
            <div className={styles.option} key={option._id}>
              <input
                type="checkbox"
                id={option.text}
                name={option.text}
                className={styles.checkbox}
                onChange = {(e)=>handleChange(e,option)}
              />
              <label htmlFor="double">{option.text}</label>
            </div>
          ))}

        </div>
        <div className={styles.add}>
            <input
            onCahange= {(e) => setQuantity(e.target.value)}
            type="number" 
            defaultValue={1} 
            className={styles.quantity}
            />
            <button className={styles.button} onClick = {handleClick}>
              Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

//params means the product id. after product
export const getServerSideProps = async ({ params }) => {
  const res = await axios.get(
    `http://localhost:3000/api/products/${params.id}`
  );
  return {
    props: {
      pizza: res.data,
    },
  };
};


export default Product;
