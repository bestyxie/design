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
    var tr = $('span[data-role='+user_id+']');
    if(tr.css('display') === "inline"){
      tr.fadeOut('slow');
    }else{
      tr.fadeIn('slow');
    }
  }
  $('#edit').on('click',function(){
    var id = $(this).data('user');
    showEditpannel(id);
  });
  // 修改用户角色
  function changeRole(){};
})(jQuery)