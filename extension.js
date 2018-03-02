
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

	targetMonitor = Main.layoutManager.getWorkAreaForMonitor(targetMonitor.index);

	let columns = Math.ceil(targetMonitor.width /  1200);
	let slotwidth = targetMonitor.width / columns;

	let position = Math.floor((dropLocation.x - targetMonitor.x) / slotwidth);

	if(dropLocation.x - targetMonitor.x < position * slotwidth + 0.5 * slotwidth && dropLocation.y - targetMonitor.y < 0.1 * targetMonitor.height)
		window.move_resize_frame(true, targetMonitor.x + position * slotwidth, targetMonitor.y, slotwidth, targetMonitor.height);
  });
}

function disable() {
  global.display.disconnect(_handle_display);
}
