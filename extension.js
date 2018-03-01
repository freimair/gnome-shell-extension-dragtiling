
const St = imports.gi.St;
const Main = imports.ui.main;
const Meta = imports.gi.Meta;
const Tweener = imports.ui.tweener;

let text;

function _hideHello() {
    Main.uiGroup.remove_actor(text);
    text = null;
}

function _showHello(label) {
    if (!text) {
        text = new St.Label({ style_class: 'helloworld-label', text: label });
        Main.uiGroup.add_actor(text);
    }

    text.opacity = 255;

    let monitor = Main.layoutManager.primaryMonitor;

    text.set_position(monitor.x + Math.floor(monitor.width / 3 - text.width / 2),
                      monitor.y + Math.floor(monitor.height / 3 - text.height / 2));

    Tweener.addTween(text,
                     { opacity: 0,
                       time: 2,
                       transition: 'easeOutQuad',
                       onComplete: _hideHello });
}

function init() {

}

function enable() {
  _handle_display = global.display.connect('grab-op-end', (display, screen, window, operation) => {
	if (operation !== Meta.GrabOp.MOVING)
		return;

	let dropLocation = window.get_frame_rect();

	let targetMonitor = null;
	for(let currentMonitorId in Main.layoutManager.monitors) {
		let currentMonitor = Main.layoutManager.monitors[currentMonitorId];
		if(currentMonitor.x < dropLocation.x && dropLocation.x < currentMonitor.x + currentMonitor.width) {
			if(currentMonitor.y < dropLocation.y && dropLocation.y < currentMonitor.y + currentMonitor.height) {
				targetMonitor = currentMonitor;
				break;
			}
		}
	}

	let columns = 2;
	if(2500 < targetMonitor.width)
		columns = 4;

	let position = Math.floor((dropLocation.x - targetMonitor.x) / (targetMonitor.width / columns));

	window.move_resize_frame(true, targetMonitor.x + position * targetMonitor.width / columns, targetMonitor.y, targetMonitor.width/columns, targetMonitor.height);
  });
}

function disable() {
  global.display.disconnect(_handle_display);
}
