
$(document).ready(function(){

console.log('ready');

      var result_array = [];
            $.ajax({
                url:"pick_data.php",
                type: "POST",
                dataType: "json",
                data: {
                    employee_id: 415748
                },
                success:function(results){

                    var size = results.length;

                for (var i = 0; i < size; i++) {
                    alert(results[i]);
                }
                },
                error: function(xhr, status, error){
                    // alert("Fail to connect to the server when trying to retrieve report types");
                     alert(status);
                },
                async:false
            });




});


