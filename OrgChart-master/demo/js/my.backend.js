function connectDatabase(orgchart_head_id){
 var myData= {
  // 'employee_id': '415748'
  'employee_id': orgchart_head_id
};

var datasource;

$.ajax({
  url: "php/pick_position_data.php",
  data: myData,
  type: 'POST',
  dataType: "json",
  success: function(output) {
    console.log ('success: output=' + output);
    runindex2(output);
  },
  error: function(xhr, status, error){
    alert ('error: error=' + error + '; status=' + status);
  },
  async:false
});

function runindex2(position_data) {
  $.ajax({
   url: 'php/pick_data.php',
   data: myData,
   type: 'POST',
   dataType: "json",
   success: function(output) {
    console.log ('runindex2 success: output=' + output);
    runindex3(position_data,output);
  },
  error: function(xhr, status, error){
    alert (error);
    alert('status: ' + status);
  },
  async:false
});
}

// Updates /datasource/
function runindex3(position_data,employee_data) {
  $.ajax({
   url: 'php/pick_relation.php',
   data: myData,
   type: 'POST',
   dataType: "json",
   success: function(output) {
    console.log ('runindex3 success: output=' + output);
    datasource=get_data(position_data,employee_data,output);
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
 var head_orig_hire_dt=get_orig_hire_dt(head_id,employee);
 var head_pay_lctn_cd=get_pay_lctn_cd(head_id, employee);
 var head_title_cd=get_title_cd(head_id, employee);
 var head_salary_maximum_am =get_salary_maximum_am(position_head_id,position);
 var head_sub_title_cd =get_sub_title_cd(position_head_id,position);
 var head_first_name =get_first(head_id, employee);

 var head_last_name =get_last(head_id,employee);
 var head_name=head_id+' '+head_first_name+' '+head_last_name;
 var head_employee={'name':head_name , 'title':head_title_cd,'unit_cd': head_unit_cd,'hire':head_orig_hire_dt,
 'pay_lctn':head_pay_lctn_cd,'position':position_head_id, 'salary':head_salary_maximum_am, 'sub_title_cd': head_sub_title_cd,'children':[]};
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
 var current_orig_hire_dt=get_orig_hire_dt(employee_id,employee);
 var current_pay_lctn_cd=get_pay_lctn_cd(employee_id, employee);
 var current_title_cd =get_title_cd(employee_id, employee);
 var current_salary_maximum_am =get_salary_maximum_am(position_current_id,position);
 var current_sub_title_cd =get_sub_title_cd(position_current_id,position);
 var current_pay_lctn_cd=get_pay_lctn_cd(employee_id, employee);
 var current_first_name =get_first(employee_id, employee);
 var current_last_name =get_last(employee_id, employee);
 var current_name=employee_id+" "+current_first_name+" "+current_last_name;
 var current_employee={'name':current_name,'title':current_title_cd,'unit_cd': current_unit_cd,'hire':current_orig_hire_dt,
 'pay_lctn':current_pay_lctn_cd,'position':position_current_id,'salary':current_salary_maximum_am,'sub_title_cd': current_sub_title_cd, };
 var current_child=get_children(employee_id, employee);
 if(current_child.length==0){
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

  function get_sub_title_cd(position_id, position){

   for (var i=0; i<position.length;i++){

    if( position[i]['position_id'].toString().trim()==position_id.toString().trim()){

      return position[i]['sub_title_cd'].toString().trim();
    }
  }
}

   function get_first(employee_id, employee){
      for (var i=0; i<employee.length;i++){

        if( employee[i]['employee_id'].toString().trim()==employee_id.toString().trim()){

          return employee[i]['first_name'].toString().trim();
        }
      }
   }

    function get_last(employee_id, employee){
      for (var i=0; i<employee.length;i++){

        if( employee[i]['employee_id'].toString().trim()==employee_id.toString().trim()){

          return employee[i]['last_name'].toString().trim();
        }
      }
   }

function get_salary_maximum_am(position_id, position){

 for (var i=0; i<position.length;i++){

  if( position[i]['position_id'].toString().trim()==position_id.toString().trim()){

    return position[i]['salary_maximum_am'].toString().trim();
  }
}
}

function get_orig_hire_dt(employee_id, employee){
 for (var i=0; i<employee.length;i++){

  if(employee[i]['employee_id'].toString().trim()==employee_id.toString().trim()){
    return employee[i]['orig_hire_dt'].toString().trim();
  }
}
}

function get_pay_lctn_cd(employee_id, employee){
 for (var i=0; i<employee.length;i++){

  if(employee[i]['employee_id'].toString().trim()==employee_id.toString().trim()){
    return employee[i]['pay_lctn_cd'].toString().trim();
  }
}
}

function get_title_cd(employee_id, employee){
 for (var i=0; i<employee.length;i++){

  if(employee[i]['employee_id'].toString().trim()==employee_id.toString().trim()){
    return employee[i]['title_cd'].toString().trim();
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
    for (var i=0; i<employee.length;i++){
      if(employee[i]['supervisor_id'].toString().trim()==employee_id.toString().trim()){
        if(employee[i]['employee_id'].toString().trim()!=415748){
          children.push(employee[i]['employee_id'].toString().trim());
              }
            }
          }
      return children;
    }
    return datasource;
  } // end of connectDatabase function

// Gets employee with |employee_id|
function getEmployee(employee_id) {
 var myData= {
  'employee_id': employee_id
};

var employee = null;

$.ajax({
  url: "php/pick_single_employee.php",
  data: myData,
  type: 'POST',
  dataType: "json",
  success: function(output) {
        employee = output;
      },
      error: function(xhr, status, error){
        alert ('error: error=' + error + '; status=' + status);
      },
      async:false
    });
return employee;
};

// Gets position with |position_id|
function getVacantPosition(position_id) {
  var myData= {
    'position_id': position_id
  };

  var position = null;

  $.ajax({
    url: "php/pick_position_vacant.php",
    data: myData,
    type: 'POST',
    dataType: "json",
    success: function(output) {
        position = output;
      },
      error: function(xhr, status, error){
        alert ('error: error=' + error + '; status=' + status);
      },
      async:false
    });

  return position;
};

// check if position exists in POSITION
function checkPositionExists(position_id) {
  var myData= {
    'position_id': position_id
  };

  var position = null;

  $.ajax({
    url: "php/pick_single_position.php",
    data: myData,
    type: 'POST',
    dataType: "json",
    success: function(output) {
        position = output;
      },
      error: function(xhr, status, error){
        alert ('error: error=' + error + '; status=' + status);
      },
      async:false
    });

  return position;
};

// Gets head info
function getOrgHead() {

  var heads;

  $.ajax({
    url: "php/pick_org_head.php",
    data: null,
    type: 'POST',
    dataType: "json",
    success: function(output) {
        // alert ('getOrgHead output:' + output);
        heads = output;
      },
      error: function(xhr, status, error){
        alert ('error: error=' + error + '; status=' + status);
      },
      async:false
    });

    return heads;

}

function addTransaction(employee_id, src_pos_id, dest_pos_id, src_supervisor_id, dest_supervisor_id) {
     var currentdate = new Date();
     var datetime =currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
     var myData= {
       'employee_id': employee_id,
       'src_pos_id': src_pos_id,
       'dest_pos_id': dest_pos_id,
       'src_supervisor_id': src_supervisor_id,
       'dest_supervisor_id': dest_supervisor_id,
       'time':datetime
     };

     // get the id part but not the names part
     if (myData.employee_id) {
      myData.employee_id = myData.employee_id.split(' ')[0];
    }
     if (myData.src_supervisor_id) {
      myData.src_supervisor_id = myData.src_supervisor_id.split(' ')[0];
    }
     if (myData.dest_supervisor_id) {
      myData.dest_supervisor_id = myData.dest_supervisor_id.split(' ')[0];
    }
  console.log('addTransaction('+myData.employee_id+','+src_pos_id+','+dest_pos_id+','+myData.src_supervisor_id+','+myData.dest_supervisor_id+')');

    $.ajax({
    url: "php/insert_transaction.php",
    data: myData,
    type: 'POST',
    dataType: "text",
    success: function(output) {
         console.log ('gettransaction output:' + output);

      },
      error: function(xhr, status, error){
        alert ('error: error=' + error + '; status=' + status);
      },
      async:false
    });



}
