const paystack = (request) => {
  const MySecretKey = 'Bearer sk_test_c21d8df915038046b3f9bf9a1f7f593f673b3500';
  // sk_test_xxxx to be replaced by your own secret key
  const initializePayment = (form, mycallback) => {};
  const verifyPayment = (ref, mycallback) => {};
  return { initializePayment, verifyPayment };
};
