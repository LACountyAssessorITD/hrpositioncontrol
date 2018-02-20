function createUI(datasource) {
    // var datasource = {
    //   'name': 'Lao Lao',
    //   'title': 'general manager',
    //   'position': 'position1',
    //   'children': [
    //     { 'name': '', 'title': '', 'position': 'position2' },
    //     { 'name': 'Su Miao', 'title': 'department manager', 'position': 'position3',
    //       'children': [
    //         { 'name': 'Tie Hua', 'title': 'senior engineer', 'EmployeeId':'900','position': 'position4' },
    //         { 'name': 'Hei Hei', 'title': 'senior engineer', 'position': 'position5' }
    //       ]
    //     },
    //     { 'name': 'Yu Jie', 'title': 'department manager', 'position': 'position4' },
    //     { 'name': 'Yu Li', 'title': 'department manager', 'position': 'position4' },
    //     { 'name': 'Hong Miao', 'title': 'department manager', 'position': 'position4' },
    //     { 'name': 'Yu Wei', 'title': 'department manager', 'position': 'position4' },
    //     { 'name': 'Chun Miao', 'title': 'department manager', 'position': 'position4' },
    //     { 'name': 'Yu Tie', 'title': 'department manager', 'position': 'position4' }
    //   ]
    // };

    var getId = function() {
      return (new Date().getTime()) * 1000 + Math.floor(Math.random() * 1001);
    };

    var nodeTemplate = function(data) {
      return '<div class="position">' + data.position +
          '<div class="employee" draggable="true"> <!--referenced as innerNode in .js file-->' +
            '<div class="title">' + data.title + '</div>' +
            '<div class="content">' + data.name + '</div>' +
            '<div class="tooltiptext">' +
             'Home Unit Code:  <span class="unit_code">' + data.unit_cd + '</span> <br>' +
              'Hire Department: <span class="hire">' +  data.hire + '</span> <br>' +
              'Pay Location: <span class="pay_lctn">' + data.pay_lctn + '</span> <br>' +
            '</span>' +
          '</div>' +
        '</div>';
    };

    var oc = $('#chart-container').orgchart({
      'data' : datasource,
      'nodeContent': 'title',
      'nodeTemplate': nodeTemplate,
      'draggable': true,
      'parentNodeSymbol': 'fa-th-large',
      'chartClass': 'edit-state',
      'createNode': function($node, data) {
        $node[0].id = getId();
        var secondMenuIcon = $('<i>', {
          'class': 'fa fa-info-circle second-menu-icon',
          click: function() {
            $(this).siblings('.second-menu').toggle();
          }
        });
        var secondMenu = '<div class="second-menu"> Salary: ' + data.salary + '<br>Sub Title: '+data.sub_title_cd+'</div>';
        $node.append(secondMenuIcon).append(secondMenu);
      }
    });

    // Shows whether employee or position desired is found in database
    var getEmployeeSuccess = false;
    var getPositionSuccess = false;

    // If |getEmployeeSuccess| is true, this is the retrieved employee
    var retrievedEmployee;
    // If |getPositionSuccess| is true, this is the retrieved position
    var retrievedPosition;

    //edit chart script
    oc.$chartContainer.on('click', '.node', function() {
      var $this = $(this);
      $('#selected-node').val($this.find('.title').text()).data('node', $this);
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
      var $chartContainer = $('#chart-container');
      var nodeVals = [];
      $('#new-nodelist').find('.new-node').each(function(index, item) {
        var validVal = item.value.trim();
        if (validVal.length) {
          nodeVals.push(validVal);
        }
      });
      var $node = $('#selected-node').data('node');
      if (!nodeVals.length) {
        alert('Please input value for new node');
        return;
      }
      var nodeType = $('input[name="node-type"]:checked');
      if (!nodeType.length) {
        alert('Please select a node type');
        return;
      }
      if (nodeType.val() !== 'parent' && !$('.orgchart').length) {
        alert('Please creat the root node firstly when you want to build up the orgchart from the scratch');
        return;
      }
      if (nodeType.val() !== 'parent' && !$node) {
        alert('Please select one node in orgchart');
        return;
      }
      if (nodeType.val() === 'parent') {
        if (!$chartContainer.children('.orgchart').length) {// if the original chart has been deleted
          oc = $chartContainer.orgchart({
            'data' : { 'name': nodeVals[0] },
            'exportButton': true,
            'exportFilename': 'SportsChart',
            'parentNodeSymbol': 'fa-th-large',
            'createNode': function($node, data) {
              $node[0].id = getId();
            }
          });
          oc.$chart.addClass('view-state');
        } else {
          oc.addParent($chartContainer.find('.node:first'), { 'name': nodeVals[0], 'id': getId() });
        }
      } else if (nodeType.val() === 'siblings') {
        if ($node[0].id === oc.$chart.find('.node:first')[0].id) {
          alert('You are not allowed to directly add sibling nodes to root node');
          return;
        }
        oc.addSiblings($node, nodeVals.map(function (item) {
            return { 'name': item, 'relationship': '110', 'id': getId() };
          }));
      } else {
        var hasChild = $node.parent().attr('colspan') > 0 ? true : false;
        if (!hasChild) {
          var rel = nodeVals.length > 1 ? '110' : '100';
          oc.addChildren($node, nodeVals.map(function (item) {
              return { 'name': item, 'relationship': rel, 'id': getId() };
            }));
        } else {
          oc.addSiblings($node.closest('tr').siblings('.nodes').find('.node:first'), nodeVals.map(function (item) {
              return { 'name': item, 'relationship': '110', 'id': getId() };
            }));
        }
      }
    });

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
      oc.removeNodes($node);
      $('#selected-node').val('').data('node', null);
    });

    $('#btn-reset').on('click', function() {
      $('.orgchart').find('.focused').removeClass('focused');
      $('#selected-node').val('');
      $('#new-nodelist').find('input:first').val('').parent().siblings().remove();
      $('#node-type-panel').find('input').prop('checked', false);
    });

    //console output for drag and drop
    oc.$chart.on('nodedrop.orgchart', function(event, extraParams) {
      console.log('draggedNode:' + extraParams.draggedNode.children().children().children('.title').text()
        + ', dragZone:' + extraParams.dragZone.children().children().children('.title').text()
        + ', dropZone:' + extraParams.dropZone.children().children().children('.title').text()
        );
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
    function getEmployeeAndSetFlags(employeeId) {
      var employee = getEmployee(employeeId);
      if (employee != null) {
        retrievedEmployee = employee;
      }
    }

    $('#btn-get-employee').on('click', function() {
      getEmployeeAndSetFlags($('#get-employee-input').val());
    });

    $('#get-employee-input').on('keyup', function(event) {
      if (event.which === 13) {
        getEmployeeAndSetFlags(this.value);
      }
    });

    // Button for getting (retrieving) position from database
    function getPositionAndSetFlags(positionId) {
      var position = getPosition(positionId);
      if (position != null) {
        retrievedPosition = position;
      }
    }

    $('#btn-get-position').on('click', function() {
      getPositionAndSetFlags($('#get-position-input').val());
    });

    $('#get-position-input').on('keyup', function(event) {
      if (event.which === 13) {
        getPositionAndSetFlags(this.value);
      }
    });
};
