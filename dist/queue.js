import { NEVER, of, ReplaySubject, Subject } from 'rxjs';
import { bufferTime, concatMap, delayWhen, mergeMap, tap } from 'rxjs/operators';
var Queue = /** @class */ (function () {
    /**
     * Creates an instance of Queue.
     * @param {(items: T[]) => Observable<any>} action --- action to perform on each chunk of items in the Queue.
     * @param {Observable<boolean>} actionEnabled -- observable for determining whether or not the action should be performed
     * @param {number} bufferAmount -- max size of each array passed to the action. Set to 1 if you want to process items one by one.
     * @param {number} interval -- Interval for which items are sent to be processed by the list. Defaults to 3 seconds.
     * @memberof Queue
     */
    function Queue(bufferAmount, action, actionEnabled, interval) {
        if (interval === void 0) { interval = 3000; }
        var _this = this;
        this.bufferAmount = bufferAmount;
        this.action = action;
        this.actionEnabled = actionEnabled;
        this.interval = interval;
        this.list = new Subject();
        this.despatchList = new ReplaySubject(1);
        this.initialiseQueueChecking().subscribe();
        this.despatchList
            .pipe(tap(function (queued) {
            // tslint:disable-next-line:no-console
            console.info(queued + " queued");
        }))
            .pipe(delayWhen(function (queued) { return _this.actionEnabled.pipe(mergeMap(function (enabled) { return enabled ? of(queued) : NEVER; })); }))
            .pipe(tap(function (queued) {
            // tslint:disable-next-line:no-console
            console.info(queued + " enabled");
        }))
            .pipe(concatMap(this.action)).subscribe();
    }
    /**
     * Add an item (or number of items) to the queue
     *
     * @param {...T[]} items
     * @memberof Queue
     */
    Queue.prototype.add = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var _a;
        (_a = this.list).next.apply(_a, items);
    };
    Queue.prototype.initialiseQueueChecking = function () {
        var _this = this;
        return this.list.pipe(bufferTime(this.interval, null, this.bufferAmount))
            .pipe(tap(function (toUse) {
            if (toUse.length) {
                _this.despatchList.next(toUse);
            }
        }));
    };
    return Queue;
}());
export { Queue };
//# sourceMappingURL=queue.js.map