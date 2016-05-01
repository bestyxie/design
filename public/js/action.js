(function($){
  // 删除用户
  function deleteUser(user_id){
    var tr = $('.item-id-'+user_id);
    $.ajax({
      type: 'POST',
      url: '/user/delete',
      data: {id:user_id},
      dataType: 'json',
      global: false,
      success: function(data){
        if(data.success === 1 && tr.length>0){
          tr.remove();
        }
      }
    });
  }
  var delect = $('.deleteUser');
  delect.on('click',function(e){
    e.preventDefault();
    console.log('click!');
    deleteUser($(this).data('user'));
  });

  // show edit role pannel
  function showEditpannel(user_id){
    var tr = $('span[data-user="'+user_id+'"]');
    if(tr.css('display') === "none"){
      tr.fadeIn('fast');
    }else{
      tr.fadeOut('fast');
    }
  }
  $('.edit').on('click',function(){
    var id = $(this).data('user');
    console.log(id);
    showEditpannel(id);
  });
  // 修改用户角色
  function changeRole(id){
    var role = parseInt($('span[data-user="'+id+'"] .user_id').val());
    $.ajax({
      method: "POST",
      url: "/user/changerole",
      data: {id: id,role: role},
      type: 'json',
      success: function(data){
        if(data.success === 1){
          $('.item-id-'+ id+ ' .role').html(data.role);
          $('.js-form-wrapper[data-user="'+id+'"]').fadeOut('fast');
        }
      }
    });
  };
  $('.js-form-wrapper button').on('click',function(){
    var id = $(this).data('user');
    changeRole(id);
  });
})(jQuery)