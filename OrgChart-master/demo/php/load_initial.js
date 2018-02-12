<script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
<script type="text/javascript">
$("document").ready(function(){
  $(".js-ajax-php-json").submit(function(){
    var data = {
      "employee_id": "415748"

    };

    $.ajax({
      type: "POST",
      dataType: "json",
      url: "pick_data.php", //Relative or absolute path to response.php file
      data: data,
      success: function(results) {

      }
    });
    return false;
  });
});
</script>
