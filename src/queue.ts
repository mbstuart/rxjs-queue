import { NEVER, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { bufferTime, concatMap, delayWhen, mergeMap, tap } from 'rxjs/operators';

export class Queue<T> {

    private list: Subject<T> = new Subject();
  
    private despatchList: ReplaySubject<T[]> = new ReplaySubject(1);

    /**
     * Creates an instance of Queue.
     * @param {(items: T[]) => Observable<any>} action --- action to perform on each chunk of items in the Queue.
     * @param {Observable<boolean>} actionEnabled -- observable for determining whether or not the action should be performed
     * @param {number} bufferAmount -- max size of each array passed to the action. Set to 1 if you want to process items one by one.
     * @param {number} interval -- Interval for which items are sent to be processed by the list. Defaults to 3 seconds.
     * @memberof Queue
     */
    constructor(
        private bufferAmount: number,
        private action: (items: T[]) => Observable<any>,
        private actionEnabled: Observable<boolean>,
        private interval: number = 3000
    ) {
      this.initialiseQueueChecking().subscribe();
  
      this.despatchList
      .pipe(delayWhen((queued) => this.actionEnabled.pipe(mergeMap(enabled => enabled ? of(queued) : NEVER))))
      .pipe(concatMap(this.action)).subscribe();
    }


    /**
     * Add an item (or number of items) to the queue
     *
     * @param {...T[]} items
     * @memberof Queue
     */
    public add(...items: T[]) {
        this.list.next(...items);
      }
  
    private initialiseQueueChecking() {
  
      return this.list.pipe(bufferTime(this.interval, null, this.bufferAmount))
        .pipe(tap((toUse) => {
          if (toUse.length) {
            this.despatchList.next(toUse);
          }
        }));
    }
  
  
  }