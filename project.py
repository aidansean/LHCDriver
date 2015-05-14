from project_module import project_object, image_object, link_object, challenge_object

p = project_object('LHCDriver', 'LHCDriver')
p.domain = 'http://www.aidansean.com/'
p.path = 'LHCDriver'
p.preview_image_ = image_object('http://placekitten.com.s3.amazonaws.com/homepage-samples/408/287.jpg', 408, 287)
p.folder_name = 'LHCGames'
p.github_repo_name = 'LHCDriver'
p.mathjax = True
p.links.append(link_object(p.domain, 'LHCDriver/', 'Live page'))

p.introduction = 'I wanted to make a "steady hand" game and realised I could make one based on the beams of the LHC.  In this game the player(s) have to control magnets in the \(x\) and \(y\) directions to keep the beams on target.  This eventually lead on to the Science Shift Simulator games.'
p.overview = '''Both beams have a random walk that moves them around the canvas.  The player(s) can affect the forces that act on the beam(s) in the \(x\) and \(y\) directions and have to keep the beams within the valid range of the canvas.  If the beams are close to each other then the instantaneous luminosity increases, and the integrated luminosity is a measure of the score.  When the beams get dumped there is the customary toilet flush!'''

p.challenges.append(challenge_object('I had to make sliders to control the forces.', 'This is the first time I made some sliders (that I would later reuse in the <a href="http://aidansean.com/projects/?p=355">Mandelbrot</a> project) and it was trickier than I thought it would be.  The event listeners need to keep track of all mouse and keyboard actions to use the slides properly and intuitively.', 'Resolved.'))

p.challenges.append(challenge_object('This was the first two player game I made.', 'Making a game that two players can play is a bit tricky, since their controls cannot be allowed to interfere with each other.  This was achieved by moving both with the keyboard.', 'Resolved.'))
