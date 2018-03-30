var oc = null;

function createUI(datasource) {

    var getId = function() {
      return (new Date().getTime()) * 1000 + Math.floor(Math.random() * 1001);
    };

    var nodeTemplate = function(data) {
      var newline = (data.ordinance == 1 || data.budgeted_fte > 0) ? '<br>' : '';
      var ordinance = (data.ordinance == 1) ? 'ORD ' : '';
      var budgeted_fte = (data.budgeted_fte > 0) ? 'BGT' : '';
      return '<div class="position"><span class="position_id">' + data.position_id + '</span><br>' +
          '<span class="position_title">' + data.position_title + '</span>' +
          newline + ordinance + budgeted_fte +
          '<div class="employee" draggable="true">' +
            '<div class="title">' + data.title + '</div>' +
            '<div class="content"><span class="employee_id">' + data.employee_id + '</span><br>' +
              '<span class="employee_name">' + data.employee_name + '</span>' +
            '</div>' +
            '<div class="tooltiptext">' +
             'Home Unit Code:  <span class="unit_code">' + data.unit_cd + '</span> <br>' +
              'Hire Date: <span class="hire">' +  FormatDate(data.hire) + '</span> <br>' +
              'Pay Location: <span class="pay_lctn">' + data.pay_lctn + '</span> <br>' +
            '</div>' +
          '</div>' +
        '</div>';
    };

    oc = $('#chart-container').orgchart({
      'data' : datasource,
      'nodeContent': 'title',
      'nodeTemplate': nodeTemplate,
      'draggable': true,
      'parentNodeSymbol': 'fa-th-large',
      'chartClass': 'edit-state',
      'verticalLevel': maxDepth + 1,

      //only work in chrome
      'exportButton': true,
      'exportFilename': 'MyOrgChart',
      'exportFileextension': 'pdf',
      'createNode': function($node, data) {
        $node[0].id = getId();
        var secondMenuIcon = $('<i>', {
          'class': 'fa fa-info-circle second-menu-icon',
          click: function() {
            $(this).siblings('.second-menu').toggle();
          }
        });

        var secondMenu = '<div class="second-menu">' +
          'Salary: ' + data.salary +
          '</div>';
        $node.append(secondMenuIcon).append(secondMenu);
      }
    });

    //console output for drag and drop
    oc.$chart.on('nodedrop.orgchart', function(event, extraParams) {
      console.log('draggedNode:' + extraParams.draggedNode.children().children().children('.title').text()
        + ', dragZone:' + extraParams.dragZone.children().children().children('.title').text()
        + ', dropZone:' + extraParams.dropZone.children().children().children('.title').text()
        );
    });


    //resize zoom
    //2nd time horizontal only work on chrome
    $('#btn_fith').on('click', function () {
      oc.$chart.css('transform','none');
      var $container = oc.$chartContainer;
      var $chart = oc.$chart;
      var scale = $container.width()/$chart.outerWidth(true);
      var x = ($container.width() - $chart.outerWidth(true))/2*(1/scale);
      var y = ($container.height() - $chart.outerHeight(true))/2*(1+scale);
      oc.setChartScale($chart, scale);
      var val = $chart.css('transform');
      $chart.css('transform', val + ' translate(' + x + 'px,' + y + 'px)');
      $(this).attr('disabled','disabled');
    });

    $('#btn_fitv').on('click', function () {
      oc.$chart.css('transform','none');
      var $container = oc.$chartContainer;
      var $chart = oc.$chart;
      var scale = $container.height()/$chart.outerHeight(true);
      var x = ($container.width() - $chart.outerWidth(true))/2*(1+scale);
      var y = ($container.height() - $chart.outerHeight(true))/2*(1/scale);
      oc.setChartScale($chart, scale);
      var val = $chart.css('transform');
      $chart.css('transform', val + ' translate(' + x + 'px,' + y + 'px)');
      $(this).attr('disabled','disabled');
    });

    $('#btn_reset').on('click', function () {
      oc.$chart.css('transform','none');
      oc.$chartContainer.css('overflow', 'auto');
      document.getElementById("btn_fitv").disabled =false;
      document.getElementById("btn_fith").disabled =false;
    });

    $('#rd-layout-drag-drop').on('click', function() {
      updateLayout();
    });

    $('#rd-layout-print').on('click', function() {
      updateLayout();
    });

    // store the changes. reset when save button is clicked and data sent to SQL.
    var temp_position = null;
    var temp_relation = null;
    var temp_employee = null;
    $('#btn-save').on('click', function() {
      saveToDatabase();
    });

    function saveToDatabase() {
      // TODO
    }

    // Shows whether employee or position desired is found in database
    var getEmployeeSuccess = false;
    var getPositionSuccess = false;

    // If |getEmployeeSuccess| is true, this is the retrieved employee
    var retrievedEmployee;
    // If |getPositionSuccess| is true, this is the retrieved position
    var retrievedPosition;
    // This is the user-created position
    var createdPosition;

    //edit chart script
    oc.$chartContainer.on('click', '.node', function() {
      var $this = $(this);
      $('#selected-node').val($this.find('.position_id').text()).data('node', $this);
    });

    oc.$chartContainer.on('click', '.orgchart', function(event) {
      if (!$(event.target).closest('.node').length) {
        $('#selected-node').val('');
      }
    });


    $('input[name="node-type"]').on('click', function() {
      var $this = $(this);
      if ($this.val() === 'parent') {
        $('#edit-panel').addClass('edit-parent-node');
        $('#new-nodelist').children(':gt(0)').remove();
      } else {
        $('#edit-panel').removeClass('edit-parent-node');
      }
    });

    $('#btn-add-input').on('click', function() {
      $('#new-nodelist').append('<li><input type="text" class="new-node"></li>');
    });

    $('#btn-remove-input').on('click', function() {
      var inputs = $('#new-nodelist').children('li');
      if (inputs.length > 1) {
        inputs.last().remove();
      }
    });

    $('#btn-add-position').on('click', function() {
      // check if position exists
      getPositionAndSetFlag($('#get-position-input').val().trim());
      if (!getPositionSuccess) {
        // alert('Please search for a valid position.');
        return;
      }

      // reset position flag
      getPositionSuccess = false;

      AddPosition(retrievedPosition);
    });

    $('#btn-create-position').on('click', function() {
      verifyAndCreatePosition($('#get-new-position-id-input').val().trim(), $('#get-new-position-title-input').val().trim());

      AddPosition(createdPosition);
    });

    function AddPosition(position_to_add) {

      var $chartContainer = $('#chart-container');

      var nodeVals = [];
      nodeVals.push(position_to_add);

      var $node = $('#selected-node').data('node');
      if (!nodeVals.length) {
        alert('Please input value for new node');
        return;
      }
      if (!$node) {
        alert('Please select one node in orgchart');
        return;
      }

      var hasChild = $node.parent().attr('colspan') > 0 ? true : false;
      if (!hasChild) {
        var rel = nodeVals.length > 1 ? '110' : '100';
        oc.addChildren($node, nodeVals.map(function (item) {
          return MakeNodeToAdd(item, rel);
        }));
      } else {
        oc.addSiblings($node.closest('tr').siblings('.nodes').find('.node:first'), nodeVals.map(function (item) {
          return MakeNodeToAdd(item, '110');
        }));
      }

      function MakeNodeToAdd(item, rel) {
        var position_title = item.title_cd.trim() + item.sub_title_cd.trim() + ' ' + item.titl_short_dd;
        item.position_id = item.position_id.trim();
        var nodeToAdd = {
          'employee_id':'',
          'employee_name': '',
          'relationship': rel,
          'id': getId(),
          'title': '',
          'unit_cd': '',
          'hire': '',
          'pay_lctn': '',
          'position_id': item.position_id,
          'position_title': position_title,
          'salary': item.salary_maximum_am,
          'ordinance': item.ordinance,
          'budgeted_fte': item.budgeted_fte,
        };
        return nodeToAdd;
      }

      // Send transactions to backend for tracking
      var src_pos_id = retrievedPosition['position_id'].trim();
      var dest_supervisor_id = $node.find('.position_id').text();
      addTransaction(null, src_pos_id, src_pos_id, null , dest_supervisor_id);
      console.log("Add Position TRANSACTION: " + src_pos_id + ", " + dest_supervisor_id);
    }

    $('#btn-delete-position').on('click', function() {
      var $node = $('#selected-node').data('node');
      if (!$node) {
        alert('Please select one node in orgchart');
        return;
      } else if ($node[0] === $('.orgchart').find('.node:first')[0]) {
        if (!window.confirm('Are you sure you want to delete the whole chart?')) {
          return;
        }
      }

      // add transaction before removing nodes because we need data('node')
      var employee_id = $node.find('.employee_id').text();
      var src_pos_id = $node.find('.position_id').text();
      var src_supervisor_id = $node.closest('.nodes').siblings().eq(0).children().find('.position_id').text();
      addTransaction(employee_id, src_pos_id, null, src_supervisor_id, null);
      addTransaction(null, src_pos_id, null, src_supervisor_id, null);
      console.log("Delete Position TRANSACTION: " + employee_id + ", " + src_pos_id + ", " + src_supervisor_id);

      // remove nodes and set data('node') to null
      oc.removeNodes($node);
      $('#selected-node').val('').data('node', null);
    });

    $('#btn-clear-position').on('click', function() {
      var $node = $('#selected-node').data('node');
      if (!$node) {
        alert('Please select one node in orgchart');
        return;
      } else if ($node[0] === $('.orgchart').find('.node:first')[0]) {
        if (!window.confirm('Are you sure you want to clear the whole chart?')) {
          return;
        }
      }

      // add transaction before removing employee because we need the data
      var employee_id =$node.find('.employee_id').text();
      var src_pos_id = $node.find('.position_id').text();
      var src_supervisor_id = $node.closest('.nodes').siblings().eq(0).children().find('.position_id').text();
      addTransaction(employee_id, src_pos_id, null, src_supervisor_id, null);
      console.log("Clear Position TRANSACTION: " + employee_id + ", " + src_pos_id + ", " + src_supervisor_id);

      $node.find('.title').text('');
      $node.find('.employee_id').text('');
      $node.find('.employee_name').text('');
      $node.find('.unit_code').text('');
      $node.find('.hire').text('');
      $node.find('.pay_lctn').text('');
    });

    // $('#btn-reset').on('click', function() {
    //   $('.orgchart').find('.focused').removeClass('focused');
    //   $('#selected-node').val('');
    //   $('#new-nodelist').find('input:first').val('').parent().siblings().remove();
    //   $('#node-type-panel').find('input').prop('checked', false);
    // });

    $('#btn-add-employee').on('click', function() {
      // check if employee exists
      getEmployeeAndSetFlag($('#get-employee-input').val().split(' ')[0].trim());

      if (!getEmployeeSuccess) {
        alert('Please search for a valid employee.');
        return;
      }

      // reset flag
      getEmployeeSuccess = false;

      var $chartContainer = $('#chart-container');

      var nodeVals = [];
      nodeVals.push(retrievedEmployee);

      var $node = $('#selected-node').data('node');
      if (!nodeVals.length) {
        alert('Please input value for new node');
        return;
      }

      if ($node.find('.title').text() !== ''){
        alert('cannot add employee to filled position');
        return;
      }

      $node.find('.title').text(nodeVals[0].title_cd.trim() + nodeVals[0].sub_title_cd.trim() + ' ' + nodeVals[0].titl_short_dd);
      $node.find('.employee_id').text(nodeVals[0].employee_id.trim());
      $node.find('.employee_name').text(nodeVals[0].first_name + nodeVals[0].last_name);
      $node.find('.unit_code').text(nodeVals[0].home_unit_cd);
      $node.find('.hire').text(FormatDate(nodeVals[0].orig_hire_dt));
      $node.find('.pay_lctn').text(nodeVals[0].pay_lctn_cd);

      // transaction for add employee
      var employee_id = $node.find('.employee_id').text();
      var dest_pos_id = $node.find('.position_id').text().trim();
      var dest_supervisor_id = $node.closest('.nodes').siblings().eq(0).children().find('.position_id').text();
      addTransaction(employee_id, null, dest_pos_id, null, dest_supervisor_id);
      console.log("Add Employee TRANSACTION: " + employee_id + ", " + dest_pos_id + ", " + dest_supervisor_id);
    });

    // Search for an employee by employee ID
    function searchEmployee(keyWord) {
      if(!keyWord.length) {
        window.alert('Please type key word firstly.');
        return;
      } else {
        var $chart = $('.orgchart');
        // disable the expand/collapse feture
        $chart.addClass('noncollapsable');
        // distinguish the matched nodes and the unmatched nodes according to the given key word
        $chart.find('.node').filter(function(index, node) {
          return $(node).text().toLowerCase().indexOf(keyWord) > -1;
        }).addClass('matched')
        .closest('table').parents('table').find('tr:first').find('.node').addClass('retained');
        // hide the unmatched nodes
        $chart.find('.matched,.retained').each(function(index, node) {
          $(node).removeClass('slide-up')
          .closest('.nodes').removeClass('hidden')
          .siblings('.lines').removeClass('hidden');
          var $unmatched = $(node).closest('table').parent().siblings().find('.node:first:not(.matched,.retained)')
          .closest('table').parent().addClass('hidden');
          $unmatched.parent().prev().children().slice(1, $unmatched.length * 2 + 1).addClass('hidden');
        });
        // hide the redundant descendant nodes of the matched nodes
        $chart.find('.matched').each(function(index, node) {
          if (!$(node).closest('tr').siblings(':last').find('.matched').length) {
            $(node).closest('tr').siblings().addClass('hidden');
          }
        });
      }
    };

    function clearSearchResult() {
      $('.orgchart').removeClass('noncollapsable')
      .find('.node').removeClass('matched retained')
      .end().find('.hidden').removeClass('hidden')
      .end().find('.slide-up, .slide-left, .slide-right').removeClass('slide-up slide-right slide-left');
    }

    // Buttons and input for searching within the UI
    $('#btn-search-node').on('click', function() {
      console.log("Search: " + $('#search-key-word').val());
      searchEmployee($('#search-key-word').val());
    });

    $('#btn-cancel').on('click', function() {
      clearSearchResult();
    });

    $('#search-key-word').on('keyup', function(event) {
      if (event.which === 13) {
        searchEmployee(this.value);
      } else if (event.which === 8 && this.value.length === 0) {
        clearSearchResult();
      }
    });

    // Button for getting (retrieving) employee from database
    function getEmployeeAndSetFlag(employeeId) {
      var employee = getEmployee(employeeId);
      if (employee.employee_id) {
        getEmployeeSuccess = true;
        retrievedEmployee = employee;
      } else {
        alert('The employee ID is not found.');
      }
    }

    $('#get-employee-input').on('keyup', function(event) {
      if (event.which === 13) {
        getEmployeeAndSetFlag(this.value.split(' ')[0].trim());
      }
    });

    // Button for getting (retrieving) position from database
    function getPositionAndSetFlag(positionId) {
      // check if position exists
      var existPosition = checkPositionExists(positionId);

      if (!existPosition.position_id) {
        getPositionSuccess = false;
        alert('The position ID does not exist.');
        return;
      }

      // check if position is filled
      var position = getVacantPosition(positionId);

      if (position.position_id) {
        getPositionSuccess = true;
        retrievedPosition = position;
      }
      else {
        getPositionSuccess = false;
        alert('Cannot add filled position.');
      }
    }

    $('#get-position-input').on('keyup', function(event) {
      if (event.which === 13) {
        getPositionAndSetFlag(this.value);
      }
    });

    // Create new position to enter into database
    function verifyAndCreatePosition(positionId, positionTitle) {
      // If positionId is not a number, alert and return
      if (isNaN(positionId)) {
        alert('Please enter a numeric position ID.');
        return;
      }

      // Check positionTitle is not empty
      if (!positionTitle) {
        alert('Please enter a position title.');
        return;
      }

      // Check that positionId doesn't exist already
      var existPosition = checkPositionExists(positionId);
      if (existPosition.position_id) {
        alert('The position ID ' + positionId + ' exists already.');
        return;
      }

      createdPosition = {
        "position_id" : positionId,
        "title" : positionTitle
      };

      createPosition(positionId, positionTitle);
    }

    $('#get-new-position-title-input').on('keyup', function(event) {
      // Verify that user has entered position ID
      if (event.which === 13) {
        verifyAndCreatePosition($('#get-new-position-id-input').val().trim(), this.value);
      }
    });

    // Verifies that newOrgHeadId is valid and replaces the original org head with the new.
    function verifyAndReplaceOrgHead(oldOrgHeadId, newOrgHeadId) {
      // Check that an org head is selected
      if (!oldOrgHeadId) {
        alert("An organization head must be selected.");
        return;
      }

      // Verify that newOrgHeadId is numeric and a valid ID
      if(isNaN(positionId)) {
        alert("Please enter a numeric organization head ID.");
        return;
      }
      var newOrgHead = getEmployee(newOrgHeadId);
      if (!newOrgHead.employee_id) {
        alert('The new orgnization head ID is invalid.');
        return;
      }

      var oldOrgHead = getEmployee(oldOrgHeadId);
      replaceOrgHead(oldOrgHead, newOrgHead);

      // Reload head list
      setupHeadList();
    }

    $('#btn-update-org-head').on('click', function() {      
      var selectedHead = $('#select-head').val().trim().split(" ");
      verifyAndReplaceOrgHead(selectedHead[0], this.value);
    });

    $('#edited-org-head-id-input').on('keyup', function(event) {
      if (event.which === 13) {
        var selectedHead = $('#select-head').val().split(" ");
        verifyAndReplaceOrgHead(selectedHead[0], this.value);
      }
    });

    // show all the pay location under the head
    function setupPayLocationList(selected_head_id) {
      var paylocations = getPayLocation(selected_head_id);
      if (!paylocations) {
        alert ('list of pay locations is empty');
        return;
      }

      var $dropdown = $('#select-pay-lctn');
      for (var i = 0; i < paylocations.length; i++) {
        var item = paylocations[i]['pay_lctn_cd'].toString().trim();
        var option = '<option value="' + item + '">' + item + '</option>';
        $dropdown.append(option);
      }

      $('#select-pay-lctn').on('change', function() {
        // updateOrgchart($('#select-head').val());
      });
    }

    function updateLayout() {
      var opts = oc.opts;
      var nodeType = $('input[name="layout-type"]:checked');
      if (nodeType.val() === 'print') {
        opts.verticalLevel = maxDepth;
        opts.draggable = false;
      }
      else {
        opts.verticalLevel = maxDepth + 1;
        opts.draggable = true;
      }
      oc.init(opts);
    }

  };

function getPayLocation(selected_head_id) {
  }

    // show all the pay location under the head
function setupPayLocationList(selected_head_id) {
      var datasource = connectDatabase(selected_head_id);
      if (!paycd_employee) {
        alert ('list of pay locations is empty');
        return;
      }

      var $dropdown = $('#select-pay-lctn');
      for (var key in paycd_employee) {
        var item = key.toString().trim();
        var option = '<option value="' + item + '">' + item + '</option>';
        $dropdown.append(option);
      }

      $('#select-pay-lctn').on('change', function() {
        updateOrgchart(oc, $('#select-head').val());
        console.log("Selected Pay Location: '" + $('#select-pay-lctn').val() + "'");
        highlightNodesWithPayLocation($('#select-pay-lctn').val());
      });
  }

function highlightNodesWithPayLocation(pay_location) {
  if(!pay_location.length) {
    window.alert('Please select a pay location.');
    return;
  }

  // Remove highlight from previously highlighted nodes
  var $chart = $('.orgchart');
  $chart.find('.node.highlight').removeClass('highlight');

  // distinguish the matched nodes and the unmatched nodes according to the given key word
  $chart.find('.node').filter(function(index, node) {
    var location = $(node).find('.pay_lctn').text();
    // return $(node).text().toLowerCase().indexOf(keyWord) > -1;
    return location.toLowerCase().indexOf(pay_location) > -1;
  }).addClass('highlight')
  .closest('table').parents('table').find('tr:first').find('.node').addClass('retained');
}

// set up org head dropdown-list
function setupHeadList() {
    var heads = getOrgHead();
    if (!heads) {
      alert ('list of org heads is empty');
      return;
    }

    var $dropdown = $('#select-head');
    for (var i=0;i<heads.length; i++){
      // console.log(heads[i]['employee_id'] + ' first name:' + heads[i]['first_name'] + ' last name: ' + heads[i]['last_name']);
      var employee_id = heads[i]['employee_id'].toString().trim();
      var first_name = heads[i]['first_name'].toString().trim();
      var last_name = heads[i]['last_name'].toString().trim();
      var option = '<option value="' + employee_id + '">'
      + heads[i]['employee_id'] + ' ' + first_name + ' ' + last_name
      + '</option>';
      $dropdown.append(option);
    }

    // change listener for select head drop-down list
    $('#select-head').on('change', function() {
      //updateOrgchart(oc, $('#select-head').val());
       var e = document.getElementById("select-head");
       setupPayLocationList(e.value);
       alert("Please select a Pay Location.");

       // Update label for selected org head
      var selectedHead = $('#select-head').val().split(" ");
      $('#selected-org-head-label').val(selectedHead[0]);
      console.log("Selected head id '" + selectedHead[0] + "'");
    });

    // $('#btn-display-new-head').on('click', function() {
    //   updateOrgchart($('#select-head').val());
    // });
}

// updates orgchart with new datasource
function updateOrgchart(oc, selected_head_id){
  if (!oc) { // first time loading orgchart
    var datasource = connectDatabase(selected_head_id);
    if (datasource) {
      createUI(datasource);
    }
    else {
      alert('Error connecting database');
    }
  }
  else {
    maxDepth = 0; // Reset max depth of chart
    if (selected_head_id) {
      var updated_datasource = connectDatabase(selected_head_id);
      var opts = oc.opts;
      opts.data = updated_datasource;
      var nodeType = $('input[name="layout-type"]:checked');
      if (nodeType.val() === 'print') {
        opts.verticalLevel = maxDepth;
        opts.draggable = false;
      }
      else {
        opts.verticalLevel = maxDepth + 1;
        opts.draggable = true;
      }
      oc.init(opts);
    }
  }
}

function FormatDate(datestring) {
  if (datestring) {
    var day = datestring.substring(0, 2);
    var month = datestring.substring(2, 4);
    var year = datestring.substring(4);
    var date = day + '/' + month + '/' + year;
    return date;
  }
  else {
    return '';
  }
}
