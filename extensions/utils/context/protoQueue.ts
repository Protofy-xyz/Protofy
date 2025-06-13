const EventEmitter = require('events');

class Task {
    data
    options
    constructor(data, options) {
        this.data = data;
        this.options = options;
    }
}

export class protoQueue extends EventEmitter {
    constructor(type) {
        super();
        this.items = [];
        this.type = type;
    }

    enqueue(data, options) {
        const item = new Task(data, options);
        switch (this.type) {
            case 'fifo':
                this.items.push(item);
                this.emit('itemEnqueued', item);
                break;
            case 'lifo':
                this.items.unshift(item);
                this.emit('itemEnqueued', item);
                break;
            case 'priority':
                this._insertByPriority(item);
                this.emit('itemEnqueued', item);
                break;
            case 'delayed':
                setTimeout(() => {
                    this.items.push(item);
                    this.emit('itemEnqueued', item);
                }, options.delay * 1000);
                return;
            default:
                throw new Error('Unsupported queue type');
        }
    }

    _insertByPriority(item) {
        let added = false;
        for (let i = 0; i < this.items.length; i++) {
            if (item.options.priority < this.items[i].options.priority) {
                this.items.splice(i, 0, item);
                added = true;
                break;
            }
        }
        if (!added) {
            this.items.push(item);
        }
    }

    async dequeue() {
        const item = await this.items.shift();
        if(item) await this.emit('itemDequeued', item);
        if (this.isEmpty()) {
            await this.emit('queueEmpty');
        }
        return item;
    }

    isEmpty() {
        return this.items.length === 0;
    }

    async dequeAll() {
        while (!this.isEmpty()) {
            await this.dequeue();
        }
    }
}
