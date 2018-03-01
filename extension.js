
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

	let targetMonitor = Main.layoutManager.monitors[window.get_monitor()];

	_showHello("sepp " + targetMonitor.width);

  });
}

function disable() {
  global.display.disconnect(_handle_display);
}
