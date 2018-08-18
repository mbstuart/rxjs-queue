import { Observable } from 'rxjs';
export declare class Queue<T> {
    private bufferAmount;
    private action;
    private actionEnabled;
    private interval;
    private list;
    private despatchList;
    /**
     * Creates an instance of Queue.
     * @param {(items: T[]) => Observable<any>} action --- action to perform on each chunk of items in the Queue.
     * @param {Observable<boolean>} actionEnabled -- observable for determining whether or not the action should be performed
     * @param {number} bufferAmount -- max size of each array passed to the action. Set to 1 if you want to process items one by one.
     * @param {number} interval -- Interval for which items are sent to be processed by the list. Defaults to 3 seconds.
     * @memberof Queue
     */
    constructor(bufferAmount: number, action: (items: T[]) => Observable<any>, actionEnabled: Observable<boolean>, interval?: number);
    /**
     * Add an item (or number of items) to the queue
     *
     * @param {...T[]} items
     * @memberof Queue
     */
    add(...items: T[]): void;
    private initialiseQueueChecking;
}
