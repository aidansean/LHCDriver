var pi = Math.PI ;
var lumi  = 0 ;
var lumiSigma2 = 0.1 ;
var nPlayers = 1 ;

// Parameters to control the game
var delay = 100 ;
var kill  = true  ;
var pause = false ;

// Kicker parameters
// They have range [-1,+1] rescaled by a factor vScale
var vx = [0,0] ;
var vy = [0,0] ;
var dv = 0.02 ;
var vMin = -1 ;
var vMax =  1 ;
var vScale = 0.1 ;

// Have beam bounded to a 2x2 box
var rScale = 0.1 ; // By how much we should kick beams
var Xmin = -1 ; var Xmax =  1 ;
var Ymin = -1 ; var Ymax =  1 ;

// Objects we need to update
var beams     = [null,null] ;
var sliderX   = [null,null] ;
var sliderY   = [null,null] ;
var beam_plane = null ;
var beam_r = [20,25]

var colors = [ 'rgb(255,255,  0)' , 'rgb(  0,255,255)' ] ;

// Canvas and dimensions
var canvas  = null ;
var context = null ;
var cw = 750 ;
var ch = 600 ;

// Distances for sliders
var slider_margin_long  = 0.1 ;
var slider_margin_short = 0.4 ;
var nSlider_ticks = 10 ;

var spacing_x = 10 ;
var spacing_y = 10 ;

var slider_width  =  50 ;
var slider_length = 300 ;
var slider_button_width  = 0.75 ;
var slider_button_length = 0.05 ;

function beam_object(index){
  this.index = index ;
  this.X  = 0 ;
  this.Y  = 0 ;
  this.rX = beam_r[index] ;
  this.rY = beam_r[index] ;
  this.kick = function(){
    if(kill) return ;
    this.X += vScale*vx[this.index] ;
    this.Y -= vScale*vy[this.index] ;
  }
  this.deviate = function(is_other_beam){
    if(kill) return ;
    var r  = rScale*2*(Math.random()-0.5) ;
    var p  = 2*pi*Math.random() ;
    var dX = r*cos(p) ;
    var dY = r*sin(p) ;
    
    this.X += dX ;
    this.Y += dY ;
    
    if(this.index==1 && nPlayers==1){
      if(this.X<Xmin) this.X -= dX ;
      if(this.X>Xmax) this.X -= dX ;
      if(this.Y<Ymin) this.Y -= dY ;
      if(this.Y<Ymax) this.Y -= dY ;
    }
    
    if(this.X<Xmin || this.X>Xmax) kill = true ;
    if(this.Y<Ymin || this.Y>Ymax) kill = true ;
  }
  this.draw = function(context, bounds){
    var cx = bounds.x1 + bounds.w*(this.X-Xmin)/(Xmax-Xmin) ;
    var cy = bounds.y1 + bounds.h*(this.Y-Ymin)/(Ymax-Ymin) ;
    if(bounds.contains([cx,cy])==false) return ;
    
    context.save() ;
    context.translate(cx, cy) ;
    context.scale(1,this.rY/this.rX) ;
    context.beginPath() ;
    context.fillStyle = colors[this.index] ;
    context.arc(0, 0, this.rX, 0, 2*pi, true) ;
    context.fill() ;
    
    if(this.index==1){
      context.beginPath() ;
      context.fillStyle = 'rgb(0,0,0)' ;
      context.arc(0, 0, 2, 0, 2*pi, true) ;
      context.fill() ;
    }
    context.restore() ;
  }
}

function clear_canvas(){
  context.fillStyle = 'rgb(255,255,255)' ;
  context.fillRect(0,0,cw,ch) ;
}

function draw_all(){
  clear_canvas() ;
  beam_plane.draw(context) ;
  for(var i=0 ; i<nPlayers ; i++){
    sliderX[i].draw(context) ;
    sliderY[i].draw(context) ;
  }
  for(var i=0 ; i<2 ; i++){
    beams[1-i].draw(context, beam_plane.bounds) ;
  }
}

function heartbeat(){
  if(pause==false){
    for(var i=0 ; i<2 ; i++){
      beams[i].deviate() ;
    }
    for(var i=0 ; i<nPlayers ; i++){
      beams[i].kick() ;
    }
    draw_all() ;
    
    var dX = beams[1].X-beams[0].X ;
    var dY = beams[1].Y-beams[0].Y ;
    lumi += Math.exp(-(dX*dX+dY*dY)/lumiSigma2) ;
    Get('span_lumi').innerHTML = lumi.toFixed(3) ;
    if(lumi>1000){
      Get('span_lumi_unit').innerHTML = 'fb'
      var lumi_tmp = 1e-3*lumi ;
      Get('span_lumi').innerHTML = lumi_tmp.toFixed(3) ;
    }
  }
  if(kill){
    Get('p_current_status').className = 'beamDump' ;
    Get('p_current_status').innerHTML = 'Beam dumped!' ;
    Get('audio_dump').play() ;
    lumi = 0 ;
    return ;
  }
  window.setTimeout(heartbeat, delay) ;
}

function players1(){
  nPlayers = 1 ;
  Get('submit_1player').className = 'playerButton nPlayersSelected' ;
  Get('submit_2player').className = 'playerButton nPlayersNotSelected' ;
}
function players2(){
  nPlayers = 2 ;
  Get('submit_2player').className = 'playerButton nPlayersSelected' ;
  Get('submit_1player').className = 'playerButton nPlayersNotSelected' ;
}

function start(){
  canvas  = Get('canvas_beam') ;
  context = canvas.getContext('2d') ;
  cw = canvas.width  ;
  ch = canvas.height ;
  
  document.addEventListener('keydown', keydown  ) ;
  canvas.addEventListener('mousedown', mousedown) ;
  canvas.addEventListener('mousemove', mousemove) ;
  canvas.addEventListener('mouseup'  , mouseup  ) ;
  canvas.addEventListener('mouseout' , mouseout ) ;
  
  Get('submit_1player').addEventListener('click', players1) ;
  Get('submit_2player').addEventListener('click', players2) ;
  
  var dx = spacing_x ;
  var dy = spacing_y ;
  
  var sw =  slider_width  ;
  var sl =  slider_length ;
  
  var x1 =  dx ;
  var y1 =  dy ;
  
  var x2 = x1 + sw + dx ;
  var y2 = y1 + sw + dy ;
  
  var x3 = x2 + sl + dx ;
  var y3 = y2 + sl + dy ;
  
  var bounds_sliderX = [null,null] ;
  var bounds_sliderY = [null,null] ;
  bounds_sliderX[0] = new bounding_box(x2, y1, x2+sl, y1+sw) ;
  bounds_sliderY[0] = new bounding_box(x3, y2, x3+sw, y2+sl) ;
  bounds_sliderX[1] = new bounding_box(x2, y3, x2+sl, y3+sw) ;
  bounds_sliderY[1] = new bounding_box(x1, y2, x1+sw, y2+sl) ;
  var bounds_beam_plane = new bounding_box(x2, y2, x2+sl, y2+sl) ;
  
  for(var i=0 ; i<2 ; i++){
    sliderX[i] = new horizontal_slider_object(bounds_sliderX[i], i) ;
    sliderY[i] = new   vertical_slider_object(bounds_sliderY[i], i) ;
    beams[i]   = new beam_object(i) ;
  }
  
  beam_plane = new beam_plane_xy(bounds_beam_plane) ;
  
  draw_all() ;
  Get('p_current_status').className = 'ready' ;
  Get('p_current_status').innerHTML = 'Ready (Paused)' ;
}

function begin_game(){
  Get('p_current_status').className = 'stableBeams' ;
  Get('p_current_status').innerHTML = 'Stable beams' ;
  
  lumi = 0 ;
  Get('span_lumi_unit').innerHTML = 'pb' ;
  
  for(var i=0 ; i<2 ; i++){
    beams[i].X = 0 ;
    beams[i].Y = 0 ;
    vx[i] = 0 ;
    vy[i] = 0 ;
    sliderX[i].button.value = vx[i] ;
    sliderY[i].button.value = vy[i] ;
  }
  heartbeat() ;
}

function bounding_box(x1,y1,x2,y2){
  this.x1 = x1 ;
  this.y1 = y1 ;
  this.x2 = x2 ;
  this.y2 = y2 ;
  this.w  = this.x2 - this.x1 ;
  this.h  = this.y2 - this.y1 ;
  
  this.contains = function(xy){
    if(xy[0]<this.x1 || xy[0]>this.x2) return false ;
    if(xy[1]<this.y1 || xy[1]>this.y2) return false ;
    return true ;
  }
}

function slider_button_object(min, max, value, color){
  this.min = min ;
  this.max = max ;
  this.value  = value ;
  this.color  = color ;
  this.width  = slider_button_width  ;
  this.length = slider_button_length ;
  
  this.ratio = function(){
    return (this.value-this.min)/(this.max-this.min) ;
  }
}

function vertical_slider_object(bounds, index){
  this.index = index ;
  this.color = colors[index] ;
  this.bounds = bounds ;
  this.marginL = slider_margin_short ;
  this.marginR = slider_margin_short ;
  this.marginT = slider_margin_long  ;
  this.marginB = slider_margin_long  ;
  
  this.slider_ymin = this.bounds.y1 + this.bounds.h*this.marginT ;
  this.slider_ymax = this.bounds.y1 + this.bounds.h*(1-this.marginB) ;
  
  this.button = new slider_button_object(-1.0, 1.0, 0.0, this.color) ;
  
  this.draw = function(context){
    var x  = this.bounds.x1 ; 
    var y  = this.bounds.y1 ;
    var w  = this.bounds.w  ;
    var h  = this.bounds.h  ;
    var mL = this.marginL ;
    var mR = this.marginR ;
    var mT = this.marginT ;
    var mB = this.marginB ;
    
    // Draw outer rectangle
    context.fillStyle = 'rgb(150,150,150)' ;
    context.fillRect(x, y, w, h) ;
    
    // Draw markers
    var x1 = x +     0.75*mL*w ;
    var x2 = x + w - 0.75*mR*w ;
    var x3 = x +     0.40*mL*w ;
    var x4 = x + w - 0.40*mR*w ;
    var nTicks = nSlider_ticks ;
    context.strokeStyle = 'rgb(255,255,255)' ;
    for(var i=0 ; i<=nTicks ; i++){
      var y1 = this.slider_ymin + (this.slider_ymax-this.slider_ymin)*i/nTicks ;
      context.beginPath() ;
      if(i==0 || i==nTicks || i==nTicks/2){
        context.moveTo(x3,y1) ;
        context.lineTo(x4,y1) ;
      }
      else{
        context.moveTo(x1,y1) ;
        context.lineTo(x2,y1) ;
      }
      context.stroke() ;
    }
    
    // Draw sliding aperture
    x += w*mL ;
    y  = this.slider_ymin ;
    w  = w*(1-mL-mR) ;
    h  = this.slider_ymax - this.slider_ymin ;
    context.fillStyle = 'rgb(255,255,255)' ;
    context.fillRect(x, y, w, h) ;
    
    // Now draw button
    var ratio = this.button.ratio() ;
    mL = 0.5*this.bounds.w*(1-this.button.width) ;
    x = this.bounds.x1 + mL ;
    y = this.bounds.y1 + this.bounds.h - mT*this.bounds.h - ratio*this.bounds.h*(1-mT-mB) - 0.5*this.button.length*this.bounds.h ;
    w = this.button.width *this.bounds.w ;
    h = this.button.length*this.bounds.h ;
    context.fillStyle = this.button.color ;
    context.fillRect(x, y, w, h) ;
  }
  this.button_value_from_y = function(y){
    if(y<this.slider_ymin) return this.button.max ;
    if(y>this.slider_ymax) return this.button.min ;
    var r = (y-this.slider_ymin)/(this.slider_ymax-this.slider_ymin) ;
    return this.button.max-(this.button.max-this.button.min)*r ;
  }
  this.set_button_from_y = function(y){
    var value = this.button_value_from_y(y) ;
    this.button.value = value ;
    vy[this.index] = value ;
  }
}

function horizontal_slider_object(bounds, index){
  this.index = index ;
  this.color = colors[index] ;
  this.bounds = bounds ;
  this.marginL = slider_margin_long  ;
  this.marginR = slider_margin_long  ;
  this.marginT = slider_margin_short ;
  this.marginB = slider_margin_short ;
  
  this.slider_xmin = this.bounds.x1 + this.bounds.w*this.marginL ;
  this.slider_xmax = this.bounds.x1 + this.bounds.w*(1-this.marginR) ;
  
  this.button = new slider_button_object(-1.0, 1.0, 0.0, this.color) ;
  
  this.draw = function(context){
    var x  = this.bounds.x1 ; 
    var y  = this.bounds.y1 ;
    var w  = this.bounds.w  ;
    var h  = this.bounds.h  ;
    var mL = this.marginL ;
    var mR = this.marginR ;
    var mT = this.marginT ;
    var mB = this.marginB ;
    
    // Draw outer rectangle
    context.fillStyle = 'rgb(150,150,150)' ;
    context.fillRect(x, y, w, h) ;
    
    // Draw markers
    var y1 = y +     0.75*mT*h ;
    var y2 = y + h - 0.75*mB*h ;
    var y3 = y +     0.40*mT*h ;
    var y4 = y + h - 0.40*mB*h ;
    var nTicks = nSlider_ticks ;
    context.strokeStyle = 'rgb(255,255,255)' ;
    for(var i=0 ; i<=nTicks ; i++){
      var x1 = this.slider_xmin + (this.slider_xmax-this.slider_xmin)*i/nTicks ;
      context.beginPath() ;
      if(i==0 || i==nTicks || i==nTicks/2){
        context.moveTo(x1,y3) ;
        context.lineTo(x1,y4) ;
      }
      else{
        context.moveTo(x1,y1) ;
        context.lineTo(x1,y2) ;
      }
      context.stroke() ;
    }
    
    // Draw sliding aperture
    x  = this.slider_xmin ;
    y += h*mT ;
    w  = this.slider_xmax - this.slider_xmin ;
    h  = h*(1-mT-mB) ;
    context.fillStyle = 'rgb(255,255,255)' ;
    context.fillRect(x, y, w, h) ;
    
    // Now draw button
    var ratio = this.button.ratio() ;
    mT = 0.5*(this.bounds.h-this.button.width*this.bounds.h) ;
    x = this.bounds.x1 + mL*this.bounds.w + ratio*this.bounds.w*(1-mL-mR) - 0.5*this.button.length*this.bounds.w ;
    y = this.bounds.y1 + mT ;
    w = this.button.length*this.bounds.w ;
    h = this.button.width *this.bounds.h ;
    context.fillStyle = this.button.color ;
    context.fillRect(x, y, w, h) ;
  }
  this.button_value_from_x = function(x){
    if(x<this.slider_xmin) return this.button.min ;
    if(x>this.slider_xmax) return this.button.max ;
    var r = (x-this.slider_xmin)/(this.slider_xmax-this.slider_xmin) ;
    return this.button.min+(this.button.max-this.button.min)*r ;
  }
  this.set_button_from_x = function(x){
    var value = this.button_value_from_x(x) ;
    this.button.value = value ;
    vx[this.index] = value ;
  }
}

function beam_plane_xy(bounds){
  this.bounds = bounds ;
  this.draw = function(context){
    context.fillStyle = 'rgb(0,0,0)' ;
    var b = this.bounds ;
    context.fillRect(b.x1, b.y1, b.w, b.h) ;
  }
}


function sqrt(x){ return Math.sqrt(x) ; }
function  sin(x){ return Math.sin(x)  ; }
function  cos(x){ return Math.cos(x)  ; }
function  abs(x){ return Math.abs(x)  ; }
function Get(id){ return document.getElementById(id) ; }

