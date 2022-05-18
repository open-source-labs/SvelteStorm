<!-- <div id="parent_div">
    <div id="div_moving">Moving Div ..</div>
    Content in parent ...
  </div>
  
  <script>
  // Here get the Div that you want to follow the mouse
  var div_moving = document.getElementById('docs');
  
  // Here add the ID of the parent element
  var parent_div = 'parent_div';
  
  // object to make a HTML element to follow mouse cursor ( https://coursesweb.net/ )
  var movingDiv = {
    mouseXY: {},  // will contain the X, Y mouse coords inside its parent
  
    // Get X and Y position of the elm (from: vishalsays.wordpress.com/ )
    getXYpos: function(elm) {
      x = elm.offsetLeft;        // set x to elm’s offsetLeft
      y = elm.offsetTop;         // set y to elm’s offsetTop
  
      elm = elm.offsetParent;    // set elm to its offsetParent
  
      //use while loop to check if elm is null
      // if not then add current elm’s offsetLeft to x, offsetTop to y and set elm to its offsetParent
      while(elm != null) {
        x = parseInt(x) + parseInt(elm.offsetLeft);
        y = parseInt(y) + parseInt(elm.offsetTop);
        elm = elm.offsetParent;
      }
  
      // returns an object with "xp" (Left), "=yp" (Top) position
      return {'xp':x, 'yp':y};
    },
  
    // Returns object with X, Y coords inside its parent
    getCoords: function(e) {
      var xy_pos = this.getXYpos(e.target);
  
      // if IE
      if(navigator.appVersion.indexOf("MSIE") != -1) {
        var standardBody = (document.compatMode == 'CSS1Compat') ? document.documentElement : document.body;
  
        x = event.clientX + standardBody.scrollLeft;
        y = event.clientY + standardBody.scrollTop;
      }
      else {
        x = e.pageX;
        y = e.pageY;
      }
  
      x = x - xy_pos['xp'];
      y = y - xy_pos['yp'];
  
      return {'xp':x, 'yp':y};
    }
  };
  
  
  // registers 'mousemove' event to parent_div
  document.getElementById(parent_div).addEventListener('mousemove', function(e){
    mouseXY = movingDiv.getCoords(e);
    div_moving.style.left = mouseXY.xp + 8 +'px';
    div_moving.style.top = mouseXY.yp - 8 +'px';
  }); -->
