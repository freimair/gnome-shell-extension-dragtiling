
const St = imports.gi.St;
const Main = imports.ui.main;
const Meta = imports.gi.Meta;

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

	let columns = Math.ceil(targetMonitor.width /  1200);

	let position = Math.floor((dropLocation.x - targetMonitor.x) / (targetMonitor.width / columns));

	window.move_resize_frame(true, targetMonitor.x + position * targetMonitor.width / columns, targetMonitor.y, targetMonitor.width/columns, targetMonitor.height);
  });
}

function disable() {
  global.display.disconnect(_handle_display);
}
