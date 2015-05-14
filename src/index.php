<?php $title = 'LHC driver' ;
$stylesheets = array('style.css') ;
$js_scripts  = array() ;
$js_scripts[] = 'xml.js' ;
$js_scripts[] = 'controls.js' ;
$js_scripts[] = 'functions.js' ;
include($_SERVER['FILE_PREFIX'] . '/_core/preamble.php') ;
?>
  <div class="right">
    <h3>Instructions</h3>
    <div class="blurb">
      <ol>
        <li>Use the sliders to keep your beam (the yellow dot) on target to get the highest luminosity you can.</li>
        <li>The target is the other beam (the blue dot).</li>
        <li>The more the beams overlap the more luminosity you'll get.</li>
        <li>If your beam goes out of control (leaves the black area) you'll lose!</li>
        <li>Press space to begin/pause.</li>
        <li>Good luck!</li>
      </ol>
    </div>
    
    <h3>Play!</h3>
    <div class="blurb">
      <div class="tab">
        <div class="tab_row">
          <div id="div_tab_cell_beam" class="tab_cell">
            <canvas id="canvas_beam" width="480" height="480" style="width:480px; height:480px"></canvas>
          </div>
          <div id="div_tab_cell_stats" class="tab_cell">
            <h2>Current state:</h2>
            <p id="p_current_status" class="ready">Ready</p>
            
            <h2>Luminosity:</h2>
            <p id="p_lumi"><span id="span_lumi">0</span> <span id="span_lumi_unit">pb<sup>-1</sup></span></p>
            
            <h2>Players:</h2>
            <input type="submit" id="submit_1player" class="playerButton nPlayersSelected" value="1"/>
            <input type="submit" id="submit_2player" class="playerButton nPlayersNotSelected" value="2"/>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <img src="screenshot.png" style="display:none"/>
  <audio id="audio_dump">
    <source src="flush.wav" type="audio/mpeg">
    <embed height="50" width="100" src="flush.wav">
  </audio>

<?php foot() ; ?>
