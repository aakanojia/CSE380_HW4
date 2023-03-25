type Comparator<T> = (a: T, b: T) => number;

export default class PQueue<T> {
    private items: T[];
    private comparator: Comparator<T>;

    constructor(comparator: Comparator<T>) {
        this.items = [];
        this.comparator = comparator;
    }

    public isEmpty(): boolean {
        return this.items.length === 0;
    }

    public enqueue(item: T): void {
        this.items.push(item);
        this.items.sort(this.comparator);
    }

    public dequeue(): T {
        if (this.isEmpty()) {
            throw new Error("Queue is empty");
        }

        return this.items.shift();
    }

    public contains(itemIndex: number): boolean {
        return this.items.some((item: any) => item.index === itemIndex)
    }

    public size(): number {
        return this.items.length;
    }
}