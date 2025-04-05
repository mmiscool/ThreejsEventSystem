# `threeEnvironment.js`

## Overview

`threeEnvironment.js` defines a self-contained 3D rendering and interaction system using [THREE.js](https://threejs.org/). It wraps common scene management tasks into a `threeEnvironment` class and defines an `object_3d` class that supports color changes, visibility toggling, and custom pointer event handling.

---

## `threeEnvironment` Class

### Constructor

```js
const env = new threeEnvironment(targetElement)
```

Initializes a Three.js orthographic camera, scene, renderer, and interaction controls.

- `targetElement`: The DOM element in which to render the scene.

---

### Methods

#### `addObject(geometry)`

Creates a new interactive 3D object and adds it to the scene.

```js
const object = env.addObject(new THREE.SphereGeometry(10));
```

- **geometry**: A valid instance of `THREE.BufferGeometry` or `THREE.Geometry`.
- **returns**: An `object_3d` instance with built-in mesh and interaction support.

#### `removeObject(object)`

Removes a previously added `object_3d` instance from the scene.

```js
env.removeObject(myObject);
```

- **object**: Must be an instance of `object_3d`.
- Disposes of the mesh, geometry, and material to free memory.

#### `listObjects()`

Returns an array of all `object_3d` instances currently in the scene.

```js
const objects = env.listObjects();
```

- **returns**: `Array<object_3d>`

---

## `object_3d` Class

A wrapper for a THREE.js mesh with extended interactivity via event listeners.

### Constructor

```js
new object_3d(geometry, scene)
```

Used internally by `threeEnvironment`. Creates a mesh, assigns it a basic material, and stores a reference in `userData.object3d`.

---

### Methods

#### `addEventListener(event, callback)`

Registers an interaction handler on this object.

```js
object.addEventListener('pointerdown', () => console.log('Clicked!'));
```

#### `removeEventListener(event)`

Removes all handlers associated with the event type.

#### `callEvent(event)`

Calls all listeners for the given event name. Typically called by `threeEnvironment`.

#### `show()`

Makes the object visible in the scene.

#### `hide()`

Hides the object from view.

#### `setColor(color)`

Sets the color of the object's material.

```js
object.setColor('blue');
```

---

## Supported Event Types

The `threeEnvironment` handles and dispatches the following event types for `object_3d` instances:

| Event         | Description                                                                 |
|---------------|-----------------------------------------------------------------------------|
| `pointerenter`| Triggered when the pointer enters the object for the first time.            |
| `pointerover` | Triggered continuously while the pointer stays over the object.             |
| `pointermove` | Triggered whenever the pointer moves while over the object.                 |
| `pointerout`  | Triggered when the pointer exits the object.                                |
| `pointerdown` | Triggered when a pointer press occurs on the object.                        |
| `pointerup`   | Triggered when a pointer press is released on the object.                   |
| `dblclick`    | Triggered when a double click occurs on the object.                         |
| `contextmenu` | Triggered when the right-click context menu is requested.                   |
| `wheel`       | Triggered when the mouse wheel is scrolled over the object.                 |
| `dragstart`   | Triggered when the object is first dragged (pointer down + move).           |
| `drag`        | Continuously triggered as the object is dragged.                            |
| `dragend`     | Triggered when the drag operation ends.                                     |

These events are automatically handled through raycasting and pointer tracking in the `threeEnvironment` system.

---

## Example Usage

```js
const env = new threeEnvironment(document.getElementById('container'));

const cube = env.addObject(new THREE.BoxGeometry(10, 10, 10));
cube.setColor('red');

cube.addEventListener('pointerenter', () => {
    cube.setColor('yellow');
});

cube.addEventListener('drag', () => {
    cube.mesh.rotation.y += 0.05;
});
```