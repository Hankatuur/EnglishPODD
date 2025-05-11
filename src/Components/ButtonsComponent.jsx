// ButtonsComponent.jsx
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
  } from "@paypal/react-paypal-js";
  import { Spinner } from "@chakra-ui/react";
  
  const style = { layout: "vertical" };
  
  const createOrder = () => {
    return fetch("YOUR_SERVER_URL/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart: [{ sku: "your-product-sku", quantity: 1 }]
      }),
    })
    .then((response) => response.json())
    .then((order) => order.id);
  };
  
  const onApprove = (data) => {
    return fetch("YOUR_SERVER_URL/api/capture-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderID: data.orderID
      }),
    })
    .then((response) => response.json());
  };
  
  const ButtonWrapper = ({ showSpinner }) => {
    const [{ isPending }] = usePayPalScriptReducer();
  
    return (
      <>
        {showSpinner && isPending && (
          <Spinner thickness="4px" speed="0.65s" size="xl" color="blue.500" />
        )}
        <PayPalButtons
          style={style}
          createOrder={createOrder}
          onApprove={onApprove}
        />
      </>
    );
  };
  
  export default function ButtonsComponent() {
    return (
      <PayPalScriptProvider
        options={{
          "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
          currency: "USD",
          components: "buttons",
        }}
      >
        <ButtonWrapper showSpinner={true} />
      </PayPalScriptProvider>
    );
  }