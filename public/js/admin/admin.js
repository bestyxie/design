$(function(){
  
  function validate(){
    var isAllow = Array.prototype.slice.call($('#newproduct .required')).every(function(input){
      if($(input).val().length>0){
        $(input).removeClass('err');
      }
      return $(input).val().length > 0;
    });
    console.log(isAllow);
    if(isAllow){
      $('.modal-footer .next').removeClass('disabled');
    }
  }

  //- new input
  (function(){
    function newInput(name,target,$this){
      var newInput = $($('#newInput').html());
      newInput.find('input').attr('name','product['+name+']');
      $($this).parents(target).append(newInput);
    }

    function removeInput(){
      $(this).parents('.j-form-group').remove();
    }

    $('.j-newInput').on('click',function(){
      var name = $(this).data('name');
      var target = '.j-form-box';
      newInput(name,target,$(this));
    });

    $('.form-box').on('click','.j-delete',removeInput);
  })();

  // 购物车
  (function(){
    //- validate
    $('#newproduct').on('input','.required',validate);
    
    //- delete product
    function deleteProduct(){
      var _id = $(this).parent().data('product_id');
      var $this = $(this);

      $.ajax({
        url: 'product/delete',
        type: 'POST',
        dataType: 'json',
        data: {_id: _id},
        success: function(data){
          if(data.success){
            $this.parents('.j-productItem').remove();
          }
        }
      })
    }
    $('.j-product-list').on('click','.j-delete',deleteProduct);
  })


})