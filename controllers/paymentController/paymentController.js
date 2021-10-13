exports.makePayment = (req, res) => {
  const form = [req.body, ['amount', 'email', 'full_name']];
  form.metadata = {
    full_name: form.full_name,
  };
  form.amount *= 100;
  initializePayment(form, (error, body) => {
    if (error) {
      //handle errors
      console.log(error);
      return;
    }
    response = JSON.parse(body);
    res.redirect(response.data.authorization_url);
  });
};

exports.verifyPayment = (req, res) => {
  const ref = req.query.reference;
  verifyPayment(ref, (error, body) => {
    if (error) {
      //handle errors appropriately
      console.log(error);
      return res.redirect('/error');
    }
    response = JSON.parse(body);
    const data = _.at(response.data, [
      'reference',
      'amount',
      'customer.email',
      'metadata.full_name',
    ]);
    [reference, amount, email, full_name] = data;
    newDonor = { reference, amount, email, full_name };
    const donor = new Donor(newDonor);
    donor
      .save()
      .then((donor) => {
        if (donor) {
          res.redirect('/receipt/' + donor._id);
        }
      })
      .catch((e) => {
        res.redirect('/error');
      });
  });
};
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
};
