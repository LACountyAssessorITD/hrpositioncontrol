var maxDepth = 0; // Max number of levels in the org chart
var paycd_employee; //pay location list from one head

function connectDatabase(orgchart_head_id){
 var myData= {
  // 'employee_id': '415748'
  'employee_id': orgchart_head_id
  };




$.ajax({
  url: "php/pick_position_data.php",
  data: myData,
  type: 'POST',
  dataType: "json",
  success: function(output) {
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
    datasource=get_data(position_data,employee_data,output);
    paycd_employee=get_pay_location(employee_data);
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
    url: "php/pick_single_position.php",
    data: myData,
    type: 'POST',
    dataType: "json",
    success: function(output) {
        position = output;
      },
      error: function(xhr, status, error){
        alert ('error: pick_position_vacant.php=' + error + '; status=' + status);
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
        alert ('checkPositionExists error: =' + error + '; status=' + status);
      },
      async:false
    });

  return position;
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
        heads = output;
      },
      error: function(xhr, status, error){
        alert ('error: error=' + error + '; status=' + status);
      },
      async:false
    });

    return heads;
}

function getNewHead(newOrgHeadId, cur_datasource){

	var current_array=[];
	current_array.push(cur_datasource);
	var found=false;
    while(!found & current_array.length>0){
		for (var i = 0; i < current_array.length; i++) {
			if(newOrgHeadId.trim()==current_array[i].employee_id.trim()){
				found=true;
				break;
			}
		}
		if(!found){
			var next_array=[];
			for (var i = 0; i < current_array.length; i++) {
				if (typeof(current_array[i].children) !== 'undefined'){

					if(current_array[i].children.length>0){
						for (var j = 0; j < current_array[i].children.length; j++){
							next_array.push(current_array[i].children[j]);
						}
					}
				}
			}
			current_array=next_array;

		}

	}

	if(!found){
		var myData= {
		  'employee_id': newOrgHeadId
		};

		var employee = null;

		$.ajax({
		  url: "php/pick_single_employee.php",
		  data: myData,
		  type: 'POST',
		  dataType: "json",
		  success: function(output) {
        console.log(output);
				employee = output;
			  },
			  error: function(xhr, status, error){
				alert ('error: error=' + error + '; status=' + status);
			  },
			  async:false
			});

		return employee;
	}else{

		return "in current chart";

	}

}
function updateOrgHead(old_id, new_id, username) {

	console.log(old_id + "  "+ new_id+ "  "+ username);

  var currentdate = new Date();
  var datetime = currentdate.getFullYear() + '-'
                + (currentdate.getMonth()+1) + '-'
                + currentdate.getDate() + ' '
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
  var myData = {
    'old_id': old_id,
    'new_id': new_id,
    'user' : username,
    'time' : datetime
  };
  $.ajax({
    url: "php/update_org_head.php",
    data: myData,
    type: 'POST',
    dataType: 'text',
    success: function(output) {
      console.log('updateOrgHead output=' + output);
    },
    error: function(xhr, status, error){
      alert ('updateOrgHead error=' + error + '; status=' + status);
    },
    async: false
  });
}

function saveAsNewVersion(json_string, username, version_name) {
  var currentdate = new Date();
  var datetime =(currentdate.getMonth()+1) + "/"
                + (currentdate.getDate())  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
  var myData = {
    'content': json_string,
    'user' : username,
    'version_name' : version_name,
    'time' : datetime
  };
  var current_version_id;
  $.ajax({
    url: "php/save_as_version.php",
    data: myData,
    type: 'POST',
    dataType: 'json',
    success: function(output) {
      current_version_id = output.version_id;
      alert ('Saved as version ' + output.version_id + ':' + version_name + ' ' +username);
    },
    error: function(xhr, status, error){
      alert ('error=' + error + '; status=' + status);
    },
    async: false
  });
  return current_version_id;
}

function saveVersion(json_string,version_id, username) {
  var currentdate = new Date();
  var datetime =(currentdate.getMonth()+1) + "/"
                + (currentdate.getDate())  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
  var myData = {
    'content': json_string,
    'time' : datetime,
    'version_id' : version_id,
	'user' : username
  };
  $.ajax({
    url: "php/save_version.php",
    data: myData,
    type: 'POST',
    dataType: 'text',
    success: function(output) {
      alert (output);
    },
    error: function(xhr, status, error){
      alert ('error=' + error + '; status=' + status);
    },
    async: false
  });
}


function getVersion(version_id) {
  var myData = {
    'version_id': version_id
  };
  var obj;
  $.ajax({
    url: "php/open_version.php",
    data: myData,
    type: 'POST',
    dataType: 'json',
    success: function(output) {
      obj = output;
    },
    error: function(xhr, status, error){
      alert ('error=' + error + '; status=' + status);
    },
    async: false
  });
  return obj;
}
