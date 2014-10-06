Ink.requireModules(['Ink.UI.Drawer_1', 'Ink.Dom.Css_1', 'Ink.Dom.Event_1', 'Ink.Dom.Element_1'], function (Drawer, Css, InkEvent, InkElement) {

    var leftTrigger = document.body.appendChild(InkElement.create('div', {
        className: 'left-drawer-trigger'
    }))
    var rightTrigger = document.body.appendChild(InkElement.create('div', {
        className: 'right-drawer-trigger'
    }))

    var contentDrawer = document.body.appendChild(InkElement.create('div', {
        className: 'content-drawer'
    }))

    var leftDrawer = contentDrawer.appendChild(InkElement.create('div', {
        className: 'left-drawer'
    }))
    var rightDrawer = contentDrawer.appendChild(InkElement.create('div', {
        className: 'right-drawer'
    }))


    var drawer = new Drawer(document.body)

    test('Clicking the drawer buttons results in a call to Drawer\'s _onTriggerClicked(ev, side)', function () {
        var triggerClicked = sinon.stub(drawer, '_onTriggerClicked')
        stop(2)
        Syn.click(leftTrigger, function () {
            start()
            ok(triggerClicked.calledOnce)
            strictEqual(triggerClicked.lastCall.args[1], 'left')

            Syn.click(rightTrigger, function () {
                start()
                ok(triggerClicked.calledTwice)
                triggerClicked.restore()
                strictEqual(triggerClicked.lastCall.args[1], 'right')
            })
        })
    })

    test('Clicking the content drawer when the drawer is open leads to a close() call', function () {
        drawer.open('left')
        sinon.spy(drawer, 'close')
        stop()
        Syn.click(contentDrawer, function () {
            ok(drawer.close.calledOnce)
            drawer.close.restore()
            start()
        })
    })

    test('_onTriggerClicked', sinon.test(function () {
        this.stub(drawer, 'open')
        this.stub(drawer, 'close')
        var fakeEvent = {
            preventDefault: this.spy()
        }

        drawer._onTriggerClicked(fakeEvent, 'the side')

        ok(drawer.open.calledOnce, 'open() was called')
        ok(drawer.open.calledWith('the side'))

        drawer._isOpen = true;

        drawer._onTriggerClicked(fakeEvent)

        ok(drawer.close.calledOnce, 'close() was called')

        ok(fakeEvent.preventDefault.calledTwice, 'preventDefault was called once each call')

        drawer._isOpen = false;
    }))

    test('open() and close()', function () {
        var clock = sinon.useFakeTimers()

        drawer.open('left')
        clock.tick(drawer._delay + 1) // there's a setTimeout in there, not sure what it's for, but fire it.

        clock.restore()

        ok(Css.hasClassName(document.body, ['push', 'left']));
        ok(Css.hasClassName(leftDrawer, 'show'));

        drawer.close()
        ok(!Css.hasClassName(document.body, 'push'));
        ok(!Css.hasClassName(document.body, 'left'));

        if (!Drawer.transitionSupport) {
            return ok(!Css.hasClassName(leftDrawer, 'show'));
        }

        ok(Css.hasClassName(leftDrawer, 'show'));
        InkEvent.fire(leftDrawer, 'transitionend');
        ok(!Css.hasClassName(leftDrawer, 'show'));
    })
})
