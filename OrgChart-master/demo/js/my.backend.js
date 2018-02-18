$(document).ready(function(){
     var myData= {
          'employee_id': '415748'
        };

     var datasource;

    $.ajax({
      url: "php/pick_position_data.php",
      data: myData,
      type: 'POST',
      dataType: "json",
      success: function(output) {
        alert ('success: output=' + output);
        runindex2(output);
      },
      error: function(xhr, status, error){
        alert ('error: error=' + error + '; status=' + status);
      },
      async:false
    });

  function runindex2(position_data) {
    console.log('runindex2');
    $.ajax({
     url: 'php/pick_data.php',
     data: myData,
     type: 'POST',
     dataType: "json",
     success: function(output) {
        alert ('success: output=' + output);
       runindex3(position_data,output);
     },
     error: function(xhr, status, error){
      alert (error);
      alert('status: ' + status);
    },
    async:false
  });
  }

  function runindex3(position_data,employee_data) {
    console.log('runindex3');
    $.ajax({
     url: 'php/pick_relation.php',
     data: myData,
     type: 'POST',
     dataType: "json",
     success: function(output) {

      datasource=get_data(position_data,employee_data,output);
      // console.log(datasource);

    },
    error: function(xhr, status, error){
      alert (error);
      alert('status: ' + status);
    },
    async:false
  });
  }

  function get_data(position,employee, relation){
     var head_id=myData['employee_id'];

     var position_head_id=get_position(head_id, relation);
     var head_unit_cd=get_home_unit_cd(head_id, employee);
      var head_employee={'name':head_id, 'title': head_unit_cd,'position':position_head_id , 'children':[]};
      var head_child=get_children(head_id, employee);
      for (var i=0;i<head_child.length; i++){
        var single_child=get_data_helper(head_child[i],position,employee, relation);
          head_employee.children.push(single_child);
      }
      return head_employee;
  }

  function get_data_helper(employee_id,position,employee, relation){

     var position_current_id=get_position(employee_id, relation);
     var current_unit_cd=get_home_unit_cd(employee_id, employee);
      var current_employee={'name':employee_id, 'title': current_unit_cd,'position':position_current_id };
      var current_child=get_children(employee_id, employee);
      if(current_child.length==0){
        // console.log("00000");
          return current_employee;
      }else{
        current_employee.children=[]
      for (var i=0;i<current_child.length; i++){
        var single_current_child=get_data_helper(current_child[i],position,employee, relation);
        current_employee.children.push(single_current_child);
      }
      return current_employee;
    }

  }

  function get_position(employee_id, relation){

       for (var i=0; i<relation.length;i++){

          if( relation[i]['employee_id'].toString().trim()==employee_id.toString().trim()){

              return relation[i]['position_id'].toString().trim();
      }
    }
  }

  function get_home_unit_cd(employee_id, employee){
       for (var i=0; i<employee.length;i++){

          if(employee[i]['employee_id'].toString().trim()==employee_id.toString().trim()){
              return employee[i]['home_unit_cd'].toString().trim();
      }
    }
  }

  function get_children(employee_id, employee){
    var children=[];
    // console.log("hhhh");
    // console.log(employee_id);
    for (var i=0; i<employee.length;i++){
            if(employee[i]['supervisor_id'].toString().trim()==employee_id.toString().trim()){
              if(employee[i]['employee_id'].toString().trim()!=415748){
                children.push(employee[i]['employee_id'].toString().trim());
                // console.log(employee[i]['employee_id'].toString().trim());
              }

        }
      }
      // console.log("kkkk");
      return children;
  }
  myOrgchart(datasource);
});
