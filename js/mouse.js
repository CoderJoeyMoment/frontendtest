(function() {
    var initialX = 0;
    var initialY = 0;

    function onMouseMove(ev) {
        var x = ev.screenX - initialX;
        var y = ev.screenY - initialY;
        window.pywebview._bridge.call('moveWindow', [x, y], 'move');
    }

    function onMouseUp() {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    }

    function onMouseDown(ev) {
        initialX = ev.clientX;
        initialY = ev.clientY;
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', onMouseMove);
    }

    document.getElementsByClassName('top-container')[0].addEventListener('mousedown', onMouseDown);

})();