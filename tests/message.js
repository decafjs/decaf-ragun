/**
 * Created by mschwartz on 5/1/15.
 */

suite('message', function() {
    test('message', function() {
        try {
            throw new Error('test message');
        }
        catch (e) {
            console.dir(e.stack);
            console.dir(raygun.formatMessage(e));
        }
    });
    test('send', function() {
        try {
            throw new Error('test error');
        }
        catch (e) {
            console.dir({ sent: raygun.sendError(e) });
        }
    });
});
