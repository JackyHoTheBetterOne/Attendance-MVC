(function(){
  var num_of_days = 12;

  var Model = (function(){
    var
      student_name_array = ["Jerry", "Carrie", "Darry", "Dicky", "Micky"],
      student_array = [];

    function Student (name) {
      this.name = name;
      this.absence_array = [];

      for(var i = 0; i < num_of_days; i++) {
        this.absence_array.push(false)
      }
    }

//////////////////////////////////// Change window.student_array to window.localStorage

    return {
      init: function () {
        if (typeof window.student_array === "undefined") {
          for (var i = 0; i < student_name_array.length; i++) {
            var name = student_name_array[i];
            student_array.push(new Student(name));
          }
          window.student_array = student_array;
        } else {
          student_array = window.student_array;
        }

        return student_array;
      },

      toggle_day_absence: function (student_index, day_index) {
        var
          student = student_array[student_index],
          day_attendece = student.absence_array[day_index];

        student.absence_array[day_index] = !day_attendece;
      },

      get_absence_count: function (student_index) {
        var
          count = 0,
          arr = student_array[student_index].absence_array;

        for(var i = 0; i < arr.length; i++) {
          count += arr[i] ? 1 : 0;
        }

        return count;
      },

      get_count_array: function () {
        var arr = [];

        for (var i = 0; i < student_array.length; i++) {
          arr.push(
            Model.get_absence_count(i)
          )
        }
        return arr;
      }
    }
  })();

  var Octopus = (function(){
    return {
      init: function () {
        var
          student_arr = Model.init(),
          count_arr = Model.get_count_array();
        View.init(student_arr, count_arr);
      },

      check_event: function (student_index, day_index) {
        Model.toggle_day_absence(student_index, day_index);
        View.update_count(Model.get_absence_count(student_index), student_index);
      }
    }
  })();

  var View = (function(){
    var
      first_row = document.getElementById('first-row'),
      student_list = document.getElementById("student-list"),
      check_class = "attend-col",
      count_class_1 = "missed-col"
      count_class_2 = "count-num"

    function makeFirstRow () {
      for(var i = 0; i < num_of_days; i++) {
        var th = document.createElement("th");
        th.innerHTML = i+1;
        first_row.appendChild(th);
      }

      var extra_th = document.createElement("th");
      extra_th.setAttribute("class", count_class_1);
      extra_th.innerHTML = "Days Missed-co";
      first_row.appendChild(extra_th);
    }

    function makeStudentRow (student, count) {
      var
        row = document.createElement("tr"),
        name_td = document.createElement("td"),
        last_td = document.createElement("td"),
        name = student.name,
        check_arr = student.absence_array;
      row.setAttribute("class", "student");
      name_td.setAttribute("class", "name-col");
      name_td.innerHTML = name;
      last_td.setAttribute("class", count_class_1 + " " + count_class_2)
      last_td.innerHTML = count;
      row.appendChild(name_td);

      for(var i = 0; i < check_arr.length; i++ ) {
        var
          value = check_arr[i],
          td = document.createElement("td"),
          input = document.createElement("input");

        td.setAttribute("class", "attend-col");
        input.setAttribute("type", "checkbox");
        input.checked = value;

        td.appendChild(input);
        row.appendChild(td);
      }

      row.appendChild(last_td);
      student_list.appendChild(row);
    }

    return {
      init: function (arr, counts) {
        makeFirstRow();
        for(var i = 0; i < arr.length; i++) {
          var
            student = arr[i],
            count = counts[i];
          makeStudentRow(student, count);
        }

        var student_lists = document.getElementsByClassName("student");
        for(var index = 0; index < student_lists.length; index++) {
          var
            student = student_lists[index],
            checkboxes = (function () {
              var
                childnodes = student.childNodes,
                arr = []
              for(var i = 0; i<childnodes.length; i++) {
                var element = childnodes[i];
                if(childnodes[i].getAttribute("class") === check_class) {
                  arr.push(element);
                }
              }
              return arr;
            })();
          for(var i = 0; i < checkboxes.length; i++) {
            var checkbox = checkboxes[i];
            checkbox.addEventListener("click", Octopus.check_event.bind(null, index, i));
          }
        }
      },

      update_count: function (count, index) {
        document.getElementsByClassName(count_class_2)[index].innerHTML = count;
      }
    }
  })();

  Octopus.init();

})()
