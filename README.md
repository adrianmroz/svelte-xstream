# svelte-xstream

Utilities for working with `xstream` streams inside `svelte`. Contains few functions that makes interoparibilty between streams and stores. 

## Project status

Project is in heavy development phase. Goal is set and you should not expect much new features but you should expect some API breaks down the line.

## Why

Functional Reactive Programming as stated by Connal Elliot [1] defines two primitives: Behaviours and Events. 

Behaviours are values that can change in time. What is important, they always have a defined value. Svelte has great primitive for it - stores. 

What is missing in Svelte is equivalent for Events. Common way is to represent them as stream of values, just like common reactive javascript libraries. This project uses Streams from `xstream` library. 

In contrast to `Store`, `Stream` does not always have a value. For example mouse position could be represented as `Store`, because mouse always have some position, but mouse clicks should be represented as `Stream`. Between clicks there is no real value to have.

Svelte, like most of modern frameworks have pull based reactivity. Svelte decides in what moment view should be rendered and pulls "current" values from our model. (In contrast to cycle.js, where you push values to view, and view uses supplied values to render). That is why we should use stores to represent reactive values (In cases where local values is not enough) and `svelte` uses them internally for example for `spring` and `tween` values. 

One could be tempted to use `observable`s for the same purpose, because svelte supports auto subsrciptions to ReactiveExtension. But that leads to many problems. First, semantics, `observable` not always have a value so we need to jump through some hoops to enforce that. Probably with using `BehaviorSubject`. That could lead to second problem - performance. In ReactiveExtensions, with long stream transformation, subscription is costly process. We shouldn't subscribe to `observable` to just get it value. And if we add some "cold" observables inside and/or `share` operator semantics starts again to be tricky.

On the other hand, `stores` are not good for representing events. Store need to always have a value and is expected to always synchronously respond with value if subscribed. If we leave out that requirement we can do much more with streams than stores. For example filtering streams is trivial - just don't emit events that don't fulfill predicate. If we would like to filter store, we would have stale values or some nil values in result store. 

Because that we can use more operators for events and express more complex flows. This library assumes that you would use streams for strictly event processing but in the end, view part of your application would use stores to represent model. All operators in this library that return store also ensures that this store would have always meaningful value.

### Why `xstream`

This project uses `xstream` because it is quite minimal reactive library with good semantics and performance. I believe strong case could be made for using `ReactiveExtensions` or `most` or others libraries that I don't know. 

## Subscription management

Most of this library operators manages subscriptions for you. But there are some more complicated cases and library gives you options how to handle subscription lifecycle.   

Let's have a look at `accum` function. It should create `Store` that keeps last emitted value from input `Stream`. We have two choices how to implement this function. 

We can subscribe to `Stream` when function is called and copy value from `Stream` to `Store`. That is correct but have a problem that we can't unsubscribe from `Stream`. We should do this when returned `Store` is destroyed, but javascript does not have mechanism for this.

On the other hand we can mirror `Store` behavior and subscribe to `Stream` whenever someone subscribes to `Store` and unsubscribe when `Store` listener count drops to zero. That would manage subscription but could result in incorrect behavior. If `Stream` emits event before someone subscribes to `Store`, we will lose that event. That could happen if user uses `get` method on stores instead of `$` operator. And even with `$` operator - that's implementation detail. 

Because of that, this library provides three versions of operators that produces `Store` from source `Stream`. That is why we have `accumRC`, `accumManual` and `accumAuto`. 

`accumRC` uses reference counting just like svelte does with `Store`s subscription management in components. Source `Stream` is subscribed when `Store` gets its first subscriber and unsubscribes when `Store` loses its last subscriber. That is correct function if we are sure that `Store` subscription is managed by svelte. It is very minimal and elegant solution but sometimes can result in subtle bugs. For example when we create `Store` but we don't subscribe to it in component but pass it to it's children or use `get` function.

`accumManual` subscribes to `Stream` right away and returns `Store` with additional `destroy` method. When called, subscription to `Stream` will be cancelled. This function is correct but shifts subscription management to developer. It is useful for `Stores` created in libraries.

`accumAuto` also subscribes to `Stream` right away but uses svelte `onDestroy` to unsubscribe from the `Stream`. This function is correct and manages subscription. Its only downside is that can be used only in components.

Which version you should choose?

* If you create `Store` in component, use `accumAuto`
* If you create `Store` outside of component, use `accumManual` and remember calling `destroy`
* If you are sure, that reference counting version would be correct in your case, use `accumRC` 

## API


### `accum`

Holds last emitted value from stream. Store is initialized with init argument, so Store has value event before first Stream event.

`accum<T>(stream: Stream<T>, init: T): Store<T>`

Has three variants: `accumRC`, `accumManual`, `accumAuto`

### `foldp`

"Fold past", "Reduce for stream". Subscribes to source stream and uses reducer function to calculate new value based on accumulated value and new value emmited by stream.

`fold<S, T>(stream: Stream<S>, reducer: (acc: T, next: S) => T, init: T): Store<T>`

Has three variants: `foldpRC`, `foldpManual`, `foldpAuto`

### `switchHold`

Switches between Stores inside Stream. Whenever Stream emits new Store, its values are copied to output Stream. Needs an init value.

`switchHold<T>(streamOfStores: Stream<Store<T>>, init: T): Store<T>`

Has three variants: `switchHoldRC`, `switchHoldManual`, `switchHoldAuto`

### `switchMap`

For every value in input Store, calls function that produces Stream. Values from this stream are copied to output store. If input Store emits value before Stream for previous value end, old Stream is unsubscribed and values from it are discarded "switching" to new Stream.

`switchMap<S, T>(store: Store<T>, f: (x: T) => Stream<S>, init: S): Store<S>`

### `switchB`

Switches to inner Stream from Store. When Store changes value to new Stream, old Stream is unsubscribed and output values are taken from new Stream.

`switchE<T>(store: Store<Stream<T>>): Stream<T>`

### `switchE`

Switches to inner Stream from Store. When Store changes value to new Stream, old Stream is unsubscribed and output values are taken from new Stream. Because output is a Store, we need initial value.


`switchB<T>(store: Store<Stream<T>>, init: T): Store<T>`

### `gate`

Creates Stream that emits value from input Stream only if boolean Store has `true` value.

`gate<T>(store: Store<boolean>, stream: Stream<T>): Stream<T>`

### `apply`

Apply function from Store to every value of input Stream.

`apply<S, T>(store: Store<(a: S) => T>, stream: Stream<S>): Stream<T>`

### `filterApply`

Creates Stream that emits value from input Stream only if value passes condition from Store value.

`filterApply<T>(store: Store<(a: T) => boolean>, stream: Stream<T>): Stream<T>`

### `tag`

Creates Stream that emits current values from Store whenever input Stream emits.

`tag<S, T>(store: Store<S>, stream: Stream<T>): Stream<S>

### `attach`

Creates Stream that emits pairs - value from input source with current value from the Store.

`attach<S, T>(store: Store<S>, stream: Stream<T>): Stream<[S, T]>`

### `toStream`

Converts Store to Stream for interop with `xstream`.

`toStream<T>(store: Store<T>): Stream<T>`

### Store utilities

Utility functions for working with Svelte Stores.

#### `flatMap`

For each value in Store calls function that produces Store and flattens result.

`flatMap<S, T>(store: Store<S>, f: (a: S) => Store<T>): Store<T>`

#### `flatten`

Flattens Store of Stores.

`flatten<T>(store: Store<Store<T>>): Store<T>`


#### `map`

Maps function over each store value.

`map<S, T>(store: Store<S>, f: (a: S) => T): Store<T>`

#### `of`

Create store with value inside.

`of<T>(value: T): Store<T>`

#### `zip`

Combines two stores with function. New value is calculated with current values of stores, whenever one of them emits.

`zip<S, T, U>(storeA: Store<S>, storeB: Store<T>, f: (a: S, b: T) => U): Store<U>`

### `runEffect`

Runs a function for each value emmited in Stream. Accepts optional finalizer, which will be called when Stream ends.

`runEffect<T>(stream: Stream<T>, effect: (a: T) => void, finalize?: Funciton): void`

### `tracker`

Offers a way to create Stream of DOM events in Svelte idiomatic way. Function returns a pair - a Stream where events will be emitted and Svelte action. When action is used it will attach to node, subscribe to events and emit them at output Stream.

