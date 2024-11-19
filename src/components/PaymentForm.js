import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from "axios";

const CARD_OPTIONS = {
    iconStyle: "solid",
    style: {
        base: {
            iconColor: "#c4f0ff",
            color: "#fff",
            fontWeight: 500,
            fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
            fontSize: "16px",
            fontSmoothing: "antialiased",
            ":-webkit-autofill": { color: "#fce883" },
            "::placeholder": { color: "#87bbfd" }
        },
        invalid: {
            iconColor: "#ffc7ee",
            color: "#ffc7ee"
        }
    }
};

export default function PaymentForm() {
    const [success, setSuccess] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        });

        if (!error) {
            try {
                const { id } = paymentMethod;
                const response = await axios.post("http://localhost:5173/payment", {
                    amount: 1000,
                    id
                });

                if (response.data.success) {
                    console.log("Successful payment");
                    setSuccess(true);
                }

            } catch (error) {
                console.log("Error", error);
            }
        } else {
            console.log(error.message);
        }
    };

    return React.createElement(
        React.Fragment,
        null,
        !success ? React.createElement(
            'form',
            { onSubmit: handleSubmit },
            React.createElement(
                'fieldset',
                { className: "FormGroup" },
                React.createElement(
                    'div',
                    { className: "FormRow" },
                    React.createElement(CardElement, { options: CARD_OPTIONS })
                )
            ),
            React.createElement('button', null, 'Pay')
        ) :
        React.createElement(
            'div',
            null,
            React.createElement('h2', null, "You just bought a sweet spatula congrats this is the best decision of your life")
        )
    );
}
