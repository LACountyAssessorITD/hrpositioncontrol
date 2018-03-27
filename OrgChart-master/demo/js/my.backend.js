var maxDepth = 0; // Max number of levels in the org chart

function connectDatabase(orgchart_head_id){
 var myData= {
  // 'employee_id': '415748'
  'employee_id': orgchart_head_id
};

var datasource;
var paycd_employee;

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
    alert ('error: \nerror=' + error + ' \nstatus=' + status);
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
    paycd_employee=get_pay_location(employee_data);
    for (var key in paycd_employee) {
      console.log (key);
      console.log (paycd_employee[key].length);
    }
    },
    error: function(xhr, status, error){
      alert (error);
      alert('status: ' + status);
    },
    async:false
  });
}
function get_pay_location(employee){
   var pay_employee={};
   for (var i=0; i<employee.length;i++){
      var current_pay=employee[i]['pay_location_code'].toString().trim();
      
      if(!(current_pay in pay_employee) ){
          
          pay_employee[current_pay]=[];
          pay_employee[current_pay].push(employee[i]);
      }else{
          
          pay_employee[current_pay].push(employee[i]);
      }

   }
   return pay_employee;
}
function get_data(position,employee, relation){
 var head_id=myData['employee_id'];

  var head_obj = get_employee_object(head_id, employee);
 var position_head_id=get_position(head_id, relation).trim();
 var position_obj=get_position_object(position_head_id, position);

 var head_name=head_obj.first_name+' '+head_obj.last_name;

 var head_title=head_obj.title_cd.trim() + head_obj.sub_title_cd + ' ' + head_obj.titl_short_dd;

 var position_title_cd=position_obj.title_cd.trim();
 var position_sub_title_cd=position_obj.sub_title_cd.trim();
 var position_title_name=position_obj.titl_short_dd;
 var position_title=position_title_cd + position_sub_title_cd + ' ' + position_title_name;

 var head_employee={
  'employee_id':head_id,
  'employee_name':head_name ,
  'title':head_title,
  'unit_cd': head_obj.home_unit_cd,
  'hire':head_obj.orig_hire_dt,
  'pay_lctn':head_obj.pay_lctn_cd,
  'position_id':position_head_id,
  'position_title': position_title,
  'salary':position_obj.salary_maximum_am,
  'ordinance': position_obj.ordinance,
  'budgeted_fte': position_obj.budgeted_fte,
  'children':[],
  'depth': 1
};
 var head_child=get_children(head_id, employee);
 for (var i=0;i<head_child.length; i++){
  var single_child=get_data_helper(head_child[i],position,employee, relation, head_employee.depth + 1);
  head_employee.children.push(single_child);
}
  console.log("Backend: levels " + maxDepth);

return head_employee;
}

function get_data_helper(employee_id,position,employee, relation, depth){

 var employee_obj = get_employee_object(employee_id, employee);
 var position_current_id=get_position(employee_id, relation).trim();
 var position_obj=get_position_object(position_current_id, position);

 var current_name=employee_obj.first_name+" "+employee_obj.last_name;

 var current_title = employee_obj.title_cd.trim() + employee_obj.sub_title_cd + ' ' + employee_obj.titl_short_dd;

 var position_title_cd=position_obj.title_cd.toString().trim();
 var position_sub_title_cd=position_obj.sub_title_cd.toString().trim();
 var position_title_name=position_obj.titl_short_dd;
 var position_title=position_title_cd + position_sub_title_cd + ' ' + position_title_name;

  var current_employee={
    'employee_id':employee_id,
    'employee_name':current_name,
    'title':current_title,
    'unit_cd': employee_obj.home_unit_cd,
    'hire': employee_obj.orig_hire_dt,
    'pay_lctn': employee_obj.pay_lctn_cd,
    'position_id':position_current_id,
    'position_title':position_title,
    'salary':position_obj.salary_maximum_am,
    'ordinance': position_obj.ordinance,
    'budgeted_fte': position_obj.budgeted_fte,
    'depth':depth
  };

 var current_child=get_children(employee_id, employee);
 if(current_child.length==0){
    // leaf node
    if (current_employee.depth > maxDepth) maxDepth = current_employee.depth;
    return current_employee;
  }else{
    current_employee.children=[]
    for (var i=0;i<current_child.length; i++){
      var single_current_child=get_data_helper(current_child[i],position,employee, relation,  depth + 1);
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

function get_position_object(position_id, position){

   for (var i=0; i<position.length;i++){

    if( position[i]['position_id'].toString().trim()==position_id.toString().trim()){

      return position[i];
    }
  }
}

function get_employee_object(employee_id, employee){

   for (var i=0; i<employee.length;i++){

    if( employee[i]['employee_id'].toString().trim()==employee_id.toString().trim()){

      return employee[i];
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
} // end of createUI function

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
}

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
}

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
}

// Creates new position
function createPosition(position_id, position_title) {
  // TODO
}

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

// Replaces the old org head with the new
function replaceOrgHead(oldOrgHead, newOrgHead) {
  // TODO
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
       'time':datetime,
       'finalize_flag': 'DRAFT',
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
