import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import PaymentForm from "./PaymentForm";

// UNUSED

const PUBLIC_KEY = "pk_test_51Q7r4vB4uviJdBqEtvNMagj2e41suaUkLk28sQaPKmrt6mxdDyOyAG4DuO998Umfc2qf3pH38JYlUmHwuqS6hGu800lqgAjRu7";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

export default function StripeContainer() {
    return React.createElement(
        Elements,
        { stripe: stripeTestPromise },
        React.createElement(PaymentForm)
    );
}
