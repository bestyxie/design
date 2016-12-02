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
  
  // dropdown
  (function(){
    function hide_dropdown(){
      $(this).parents('.j-label-group').hide();
      
    }
    $('.dropdown-toggle').on('click',function(e){
      $(this).siblings('.dropdown-menu').show();
    });
    $('.dropdown-menu .j-cancle').on('click',hide_dropdown);
    $('.dropdown-menu .j-ok').on('click',hide_dropdown);
  })();
  
  // 图片上传
  (function(){
    //- 图片上传预览
    function uploadPic(){
      function checkType(picPath){
        var type = picPath.substring(picPath.lastIndexOf('.')+1,picPath.length).toLowerCase();
        if( type != 'jpg' && type != 'bmp' && type != 'gif' && type != 'png'){
         return false;
        }
        return true;
      }
      function previewPic(picURL,$this){
        var type = checkType(picURL);
        var prevDiv = $('.pic-wrap');
        if(type){
          if( $this.context.files && ($this.context.files)[0] ){
            var reader = new FileReader();
            reader.onload = function(evt){
              var newImg = $('<div class="imgbox"><img src="'+evt.target.result+'" /><i class="icon">&times;</i></div>');
              prevDiv.append(newImg);
            }
            reader.readAsDataURL(($this.context.files)[0]);
          }else{
            prevDiv.append('<div class="img" style="filter:progid:DXImagesTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\''+file.value+'\'"></div>');
          }
        }
      }
      $('.newpic').on('click',function(){
        var file = $('input[type="file"]');
        if(file.length == 1){
          file.trigger('click');
        }else{
          $(file[1]).trigger('click');
        }
      });
      $(document).on('change','input[type="file"]',function(){
        var self = $(this);
        previewPic(self.val(),self);
        var newpic = $('<input type="file" name="picture" accept="image/*" class="hide" />')
        self.parent().append(newpic);
        validate();
      });
      $(document).on('click','.imgbox .icon',function(){
        var self = $(this),i=0;
        var imgboxes = $(this).parent().siblings();
        for(i,len=imgboxes.length;i<len;i++){
          if($(imgboxes[i]).has(self)){
            break;
          }
        }
        $($('input[type="file"]')[i]).remove();
        $(this).parent().remove();
      })
    }
    uploadPic();
  })();

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

  // 商品管理
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
  })();

  // 编辑商品
  (function(){
    $('.j-label-group').on('click','.j-labels',function(){
      $(this).toggleClass('selected');
      if($(this).hasClass('selected')){
        $('input[name="labels"]').val($('input[name="labels"]').val()+" "+$(this).html());
      }else{
        var oldval = $('input[name="labels"]').val().split(' ');
        var delVal = $(this).html();
        for(var i = 0;i<oldval.length;i++){
          if(oldval[i] == delVal){
            oldval.splice(i,1);
          }
        }
        $('input[name="labels"]').val(oldval);
      }
    });

    $('.dropdown-menu .j-ok').on('click',hide_dropdown);
  })();


})