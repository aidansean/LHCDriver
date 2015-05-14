var current_active_element = null ;

function keydown(evt){
  var keyDownID = window.event ? event.keyCode : (evt.keyCode != 0 ? evt.keyCode : evt.which) ;
  
  var index = 0 ;
  switch(keyDownID){
    case 37:
    case 38:
    case 39:
    case 40:
      index = 0 ;
      break ;
    case 65:
    case 68:
    case 83:
    case 87:
      if(nPlayers==1) return ;
      index = 1 ;
      break ;
  }
  
  switch(keyDownID){
    case 37: // left
    case 65: 
      evt.preventDefault() ;
      vx[index] = Math.max(vx[index]-dv,vMin) ;
      sliderX[index].button.value = vx[index] ;
      break ;
    case 38: // up
    case 87:
      evt.preventDefault() ;
      vy[index] = Math.min(vy[index]+dv,vMax) ;
      sliderY[index].button.value = vy[index] ;
      break ;
    case 39: // right
    case 68:
      evt.preventDefault() ;
      vx[index] = Math.min(vx[index]+dv,vMax) ;
      sliderX[index].button.value = vx[index] ;
      break ;
    case 40: // down
    case 83:
      evt.preventDefault() ;
      vy[index] = Math.max(vy[index]-dv,vMin) ;
      sliderY[index].button.value = vy[index] ;
      break ;
    
    case 32: // space
      evt.preventDefault() ;
      
      if(kill){
        kill = false ;
        pause = false ;
        
        begin_game() ;
      }
      else{
        if(pause){
          Get('p_current_status').className = 'stableBeams' ;
          Get('p_current_status').innerHTML = 'Stable beams' ;
          pause = false ;
        }
        else{
          Get('p_current_status').className = 'ready' ;
          Get('p_current_status').innerHTML = 'Ready (paused)' ;
          pause = true ;
        }
      }
      break ;
  }
}

var snap_mode = 'none' ;
var snap_dx = 10 ;
var snap_dy = 10 ;

var x_down = -1 ;
var y_down = -1 ;
var x_move = -1 ;
var y_move = -1 ;
var x_up   = -1 ;
var y_up   = -1 ;

function is_right_click(evt){
  // Is it a right click?
  var rightclick ;
  if(!evt) var evt = window.event ;
  if     (evt.which ) rightclick = (evt.which ==3) ;
  else if(evt.button) rightclick = (evt.button==2) ;
  return rightclick ;
}

function get_mouse_xy(evt){
  var rc = is_right_click(evt) ;
  var x = evt.pageX - Get('canvas_beam').offsetLeft ;
  var y = evt.pageY - Get('canvas_beam').offsetTop  ;
  if(rc) return [x,y] ;
  if(snap_mode=='grid'){
    x = snap_dx*Math.round(x/snap_dx) ;
    y = snap_dy*Math.round(y/snap_dy) ;
  }
  return [x,y] ;
}

function mousedown(evt){
  var rc = is_right_click(evt) ;
  var xy = get_mouse_xy(evt) ;
  x_down = xy[0] ;
  y_down = xy[1] ;
  x_move = -1 ;
  y_move = -1 ;
  x_up   = -1 ;
  y_up   = -1 ;
  
  for(var i=0 ; i<nPlayers ; i++){
    if     (sliderX[i].bounds.contains(xy)){
      current_active_element = sliderX[i] ;
    }
    else if(sliderY[i].bounds.contains(xy)){
      current_active_element = sliderY[i] ;
    }
  }
}
function mousemove(evt){
  if(x_down<0 || y_down<0){
    x_down = -1 ;
    y_down = -1 ;
    current_active_element = null ;
    return ;
  }
  var rc = is_right_click(evt) ;
  var xy = get_mouse_xy(evt) ;
  if(current_active_element){
    for(var i=0 ; i<nPlayers ; i++){
      if     (sliderX[i]==current_active_element){
        sliderX[i].set_button_from_x(xy[0]) ;
      }
      else if(sliderY[i]==current_active_element){
        sliderY[i].set_button_from_y(xy[1]) ;
      }
    }
  }
  draw_all() ;
}
function mouseup(evt){
  if(x_down<0 || y_down<0){
    x_down = -1 ;
    y_down = -1 ;
    current_active_element = null ;
    return ;
  }
  var rc = is_right_click(evt) ;
  var xy = get_mouse_xy(evt) ;
  
  if(current_active_element){
    for(var i=0 ; i<nPlayers ; i++){
      if     (sliderX[i]==current_active_element){
        sliderX[i].set_button_from_x(xy[0]) ;
      }
      else if(sliderY[i]==current_active_element){
        sliderY[i].set_button_from_y(xy[1]) ;
      }
    }
  }
  
  current_active_element = null ;
  draw_all() ;
}
function mouseout(evt){
  x_down = -1 ;
  y_down = -1 ;
  var rc = is_right_click(evt) ;
  var xy = get_mouse_xy(evt) ;
  current_active_element = null ;
}
