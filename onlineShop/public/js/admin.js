const deleteProduct = (data) => {
  console.log(data);
  console.log(data.closest('article'));
  console.log(data.parentNode);
  console.log(data.parentNode.querySelector('[name="productId"]'));
  console.log(data.parentNode.querySelector('[name="productId"]').value);
  console.log(data.parentNode.querySelector('[name="_csrf"]').value);


  const prodId = data.parentNode.querySelector('[name="productId"]').value;
  const csfr = data.parentNode.querySelector('[name="_csrf"]').value;
  const productElement = data.closest('article')

  fetch('/admin/product/' + prodId, {
    method: 'DELETE',
    headers: {
      'csrf-token': csfr,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then(data => {
     productElement.parentNode.removeChild(productElement)
    })
    .catch((err) => {
      console.log(err);
    });
};
