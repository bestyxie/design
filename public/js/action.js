$(function(){

  // 加入购物车
  function addtocart(productId){
    var qty = $('.quantity').val();
    var price = $('.price').html();
    var userId = $('.user').data('userid');
    var product = {
      userId: userId,
      productId: productId,
      qty: qty,
      price: price
    }

    $.ajax({
      url: '/product/addtocart',
      method: 'POST',
      type: 'json',
      data: product,
      success: function(data){
        if(data.success === 1){
          alert('加入购物车成功!');
        }
        else{
          alert('失败，请重新加入');
        }
      }
    });
  }
  $('.js-addCart').on('click',function(){
    var product_id = $(this).data('productid');
    addtocart(product_id);
  });

  // 删除购物车的商品
  $('.js-deleteCart').on('click',deleteCart);
  function deleteCart(tg){
    var data = {
      userId: $('.user').data('userid'),
      productId: $(this).data('productid')
    }

    $.ajax({
      url: '/cart/delete',
      method: 'POST',
      type: 'json',
      data: data,
      success: function(result){
        if(result.success){
          $('.row[data-productid="'+data.productId+'"').remove();
        }
        else{
          alert('删除失败，请重新删除!');
        }
      }
    })
  }
})