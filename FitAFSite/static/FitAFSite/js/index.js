axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.dropdown-trigger');
    var drop_instances = M.Dropdown.init(elems);
    var elem = document.querySelectorAll('.modal');
    var modal_instance = M.Modal.init(elem);
    var nav_elems = document.querySelectorAll('.sidenav');
    var nav_instances = M.Sidenav.init(nav_elems);
  });