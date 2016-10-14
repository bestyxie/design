/**
 * @param  {number} width  [图片裁剪的宽度]
 * @param  {number} height [图片裁剪的高度]
 * @param  {boolean} isClip [是否裁剪]
 * @param  {array} typeList [允许图片类型]
 * @param  {DOMObject} target [图片预览目标img标签]
 * @param  {Object} form [需要和图片一起发送的数据]
 * @param  {string} formData 数据发送路由
 * @param  {Object} submitbtn 表单提交按钮
 * @param  {String} form form表单选择器
 */
$.fn.upload_pic = function(param){
  var defaults = {
    width: 680,
    height: 1136,
    isClip: false,
    dragable: false,
    dropArea: $('.j-newpic'),
    typeList: ['jpg','bmp','gif','png'],
    target: $('#target'),
    picName: 'advertisement[content]',
    form: ".j-form",
    url: '',
    type: 'POST',
    afterClip: function(canvas){},
    beforeSend: function(thisInput){},
    afterDelete: function(){},
    afterDrop: function(){},
    afterPreview: function(){},
    submit_fail: function(){}
  };
  this.param = $.extend(defaults,param);
  var canvas, pic_type, thisInput = this,formData;

  var _init = function(){

    if(thisInput.param.dragable){
      $(thisInput.param.dropArea).on({
        dragleave:function(e){//拖离
          e.preventDefault();
        },
        drop:function(e){//拖后放
          e.preventDefault();
          e.dataTransfer = e.originalEvent.dataTransfer;
          var fileList = e.dataTransfer.files; //获取文件对象
          if(fileList.length == 0){
              return false;
          }
          if(fileList[0].type.indexOf('image') === -1){ //检测文件是不是图片
              return false;
          }

          var imgURL = window.URL.createObjectURL(fileList[0]);
          $(thisInput.param.target).attr("src",imgURL);
          $(".j-preview").removeClass("hide");
          $(".upload-cover").addClass("hide");

          thisInput.param.afterDrop();
          _init_clip();
        },
        dragenter:function(e){//拖进
          e.preventDefault();
        },
        dragover:function(e){//拖来拖去
          e.preventDefault();
        }
      });
    }

    $(thisInput).on('change',function(){
      $('#loading').removeClass('hide');
      $('.j-img-box').addClass('hide');
      _previewPic();
    });

    $('.j-preview .j-delete').on('click',function(){
      thisInput.val('');
      canvas = '';
      $(thisInput.param.target).attr('src','');

      if(thisInput.param.isClip){
        _reset_Jcrop();
      }

      thisInput.param.afterDelete();
    });

    // 需要裁剪的时候才用异步提交
    if(thisInput.param.isClip){
      $(thisInput.param.form).on('submit',function(e){
        e.preventDefault();
        _commit_formData();
      });
    }
  }

  var _checkType = function(pic_type){
    if(thisInput.param.typeList.indexOf(pic_type)>-1){
      return true;
    }
    return false;
  }

  var _previewPic = function(){
    var picPath = $(thisInput).val();
    var pic_type = picPath.substring(picPath.lastIndexOf('.')+1,picPath.length).toLowerCase();
    var is_legal_type = _checkType(pic_type);

    if(is_legal_type){
      // 注意！！！这里的thisInput[0].files,有时可能会获取不到，要尝试着
      // 用thisInput.context.files或者thisInput.files，可以通过打印thisInput来查看
      // console.log(thisInput)
      if(thisInput[0].files && (thisInput[0].files)[0]){
        var reader = new FileReader();
        reader.onload = function(evt){
          thisInput.param.target.attr('src',evt.target.result);

          $('#loading').addClass('hide');
          $('.j-img-box').removeClass('hide');

          if(param.isClip){
            _init_clip();
          }
        }
        reader.readAsDataURL($(thisInput)[0].files[0]);
      }else{
        var file = this[0];
        file.select();
        file.blur();
        var ieURL = document.selection.createRange().text;
        thisInput.param.target.css({
          filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\''+ieURL+'\''
        });

        $('#loading').addClass('hide');
        $('.j-img-box').removeClass('hide');

        if(thisInput.param.isClip){
          _init_clip();
        }
      }
      // 可以在afterPreview方法中增加一些交互
      thisInput.param.afterPreview();
    }
  }

  var _init_clip = function(){
    thisInput.param.target.Jcrop({
      onSelect: _clipImg,
      aspectRatio: thisInput.param.width / thisInput.param.height
    },function(){
      clicp = this;

      // 初始化选框
      var selectH = $(".j-img-box img")[1].scrollHeight;
      var selectW = (selectH/1136 * 640) >> 0;
      clicp.setSelect([0,0,selectW,selectH]);
    });

  }

  var _reset_Jcrop = function(){
    thisInput.param.target.width('');
    if(clicp){
      clicp.destroy();
    }
  }

  var _clipImg = function(){
    var select = this.tellSelect();
    canvas = $('<canvas width="'+thisInput.param.width+'" height="'+thisInput.param.height+'"></canvas>')[0],
        ctx = canvas.getContext('2d');
    var img = new Image();
    img.src = thisInput.param.target.attr('src');
    var range = img.naturalHeight/thisInput.param.target.height();
    ctx.drawImage(img,select.x*range,select.y*range,select.w*range,select.h*range,0,0,thisInput.param.width,thisInput.param.height);

    thisInput.param.afterClip(canvas,img,range,select);
  }

  // 将canvas的img转换为可以上传的表单信息
  var _canvas_formdata = function(){
    if(canvas){
      var data = canvas.toDataURL();
      data = data.split(',')[1];
      data = window.atob(data);
      var ia = new Uint8Array(data.length);
      for(var i = 0; i<data.length;i++){
        ia[i] = data.charCodeAt(i);
      }
      var  blob = new Blob([ia],{type: 'image/png'});

      formData.append(thisInput.param.picName, blob);
    }
  }

  var _commit_formData = function(){
    if(!$(thisInput.param.submitbtn).hasClass('disable')){
      $(thisInput.param.submitbtn).html($('.loading').clone().removeClass('hide'));
      $(thisInput.param.submitbtn).addClass('disable');
    }
    formData = new FormData($(thisInput.param.form)[0]);
    console.log(formData);
    _canvas_formdata();
    // var type = thisInput.param.type,
    //     url = thisInput.param.url;
    // 在数据发送之前可以更改相关数据，路由，方法
    thisInput.param.beforeSend(thisInput);

    // 如果每个上传的异步参数有很大的差异，可以考虑将将ajax的参数自定义
    // 然后这里需要做相应的更改
    $.ajax({
      url: thisInput.param.url,
      type: thisInput.param.type,
      dataType: 'json',
      cache: false,
      data: formData,
      processData: false,
      contentType: false
    }).done(function(res){
      window.location.reload();
    }).fail(function(res){
      thisInput.param.submit_fail(res);
    });
  }

  this.delete_img = function(){
    this.canvas = '';
  }

  _init();

  return this;
}