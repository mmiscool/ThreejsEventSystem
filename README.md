# ThreeJSeventSystem
A DOM style event system for threeJS

## Table of Contents
- [Installation](#installation)
- [Initializing the Environment](#initializing-the-environment)
- [Creating object_3d Items](#creating-object_3d-items)
- [Supported Events](#supported-events)
  - [pointerenter](#pointerenter)
  - [pointerover](#pointerover)
  - [pointerout](#pointerout)
  - [pointermove](#pointermove)
  - [pointerdown](#pointerdown)
  - [pointerup](#pointerup)
  - [dblclick](#dblclick)
  - [contextmenu](#contextmenu)
  - [wheel](#wheel)
  - [dragstart](#dragstart)
  - [drag](#drag)
  - [dragend](#dragend)
- [Full Example](#full-example)

## Installation

Ensure you have Three.js installed in your project:

```bash
npm install
```
## Run the example 
```
npx parcel ./index.html 
```


The `threeEnvironment.js` file depends on `three` and `TrackballControls` from `three/examples/jsm/controls/TrackballControls.js`. Make sure your project structure includes these dependencies.

## Initializing the Environment

The `threeEnvironment` class sets up a Three.js scene with an orthographic camera, WebGL renderer, and TrackballControls for interaction.

### Example
```javascript
import * as THREE from 'three';
import { threeEnvironment } from './threeEnvironment.js';

// Get a DOM element to attach the renderer to
const container = document.getElementById('container');

// Initialize the environment
const env = new threeEnvironment(container);

// Attach the environment to the container for scene access
container.threeEnvironment = env;
```

### HTML Setup
```html
<div id="container" style="width: 800px; height: 600px;"></div>
```

- The `targetElement` must be an `HTMLElement` (e.g., a `<div>`).
- The renderer’s canvas is appended to this element, and the scene adjusts to its size.

## Creating object_3d Items

The `object_3d` class wraps a Three.js `Mesh` and provides methods for visibility, color changes, and event handling.

### Example
```javascript
import * as THREE from 'three';
import { object_3d } from './threeEnvironment.js';

// Create a mesh
const geometry = new THREE.BoxGeometry(20, 20, 20);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, 0);

// Create an object_3d instance
const obj = new object_3d(mesh);
```

- The `mesh` must be a `THREE.Mesh` instance.
- The constructor attempts to add the mesh to the scene via a DOM query (`document.querySelector('canvas')?.parentElement?.threeEnvironment?.scene`). For reliability, explicitly add it to the scene using `env.scene.add(mesh)`.





Below is a Markdown README section specifically documenting the `object_3d` class from the `threeEnvironment.js` file. It includes an overview, constructor details, method descriptions, and examples of usage, focusing on its role in creating interactive 3D objects with event handling capabilities.


# object_3d Class
- [Overview](#overview)
- [Constructor](#constructor)
- [Methods](#methods)
  - [show](#show)
  - [hide](#hide)
  - [addEventListener](#addeventlistener)
  - [removeEventListener](#removeeventlistener)
  - [callEvent](#callevent)
  - [setColor](#setcolor)
- [Properties](#properties)
- [Usage Example](#usage-example)

## Overview

The `object_3d` class encapsulates a Three.js `Mesh` and adds functionality for:
- Toggling visibility (`show`/`hide`).
- Changing the material color (`setColor`).
- Managing custom events (e.g., `pointerenter`, `pointerover`, etc.) via an event listener system.


## Constructor

### `object_3d(mesh)`
Creates a new `object_3d` instance.

- **Parameters**:
  - `mesh` (`THREE.Mesh`): The Three.js mesh to wrap. Must be an instance of `THREE.Mesh`.
- **Throws**:
  - `Error`: If `mesh` is not a `THREE.Mesh` instance.
- **Behavior**:
  - Sets `mesh.userData.object3d` to reference this instance.
  - Initializes an event listener map.
  - Attempts to add the mesh to the scene via `document.querySelector('canvas')?.parentElement?.threeEnvironment?.scene`.

#### Example
```javascript
import * as THREE from 'three';
import { object_3d } from './threeEnvironment.js';

const geometry = new THREE.BoxGeometry(20, 20, 20);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
const obj = new object_3d(mesh);
```

## Methods

### `show()`
Makes the mesh visible.

- **Returns**: `void`
- **Example**:
  ```javascript
  obj.show();
  ```

### `hide()`
Hides the mesh.

- **Returns**: `void`
- **Example**:
  ```javascript
  obj.hide();
  ```

### `addEventListener(event, callback)`
Adds an event listener for a specified event type.

- **Parameters**:
  - `event` (`string`): The event name (e.g., `'pointerenter'`, `'dragstart'`).
  - `callback` (`function`): The function to call when the event is triggered.
- **Throws**:
  - `Error`: If `event` is not a string or `callback` is not a function.
- **Example**:
  ```javascript
  obj.addEventListener('pointerenter', () => {
      console.log('Pointer entered');
      obj.setColor(0xffff00);
  });
  ```

### `removeEventListener(event)`
Removes all listeners for a specified event type.

- **Parameters**:
  - `event` (`string`): The event name to remove listeners for.
- **Throws**:
  - `Error`: If `event` is not a string.
- **Example**:
  ```javascript
  obj.removeEventListener('pointerenter');
  ```

### `callEvent(event)`
Triggers all listeners for a specified event type. Typically called internally by `threeEnvironment`.

- **Parameters**:
  - `event` (`string`): The event name to trigger.
- **Throws**:
  - `Error`: If `event` is not a string.
- **Example**:
  ```javascript
  obj.callEvent('pointerenter'); // Manually trigger pointerenter event
  ```

### `setColor(color)`
Sets the material color of the mesh.

- **Parameters**:
  - `color` (`number` | `string` | `THREE.Color`): The color value (e.g., `0xff0000`, `'#ff0000'`, or a `THREE.Color` instance).
- **Throws**:
  - `Error`: If the mesh has no material.
- **Example**:
  ```javascript
  obj.setColor(0x00ff00); // Change to green
  ```

## Properties

- **`mesh`** (`THREE.Mesh`): The underlying Three.js mesh object.
- **`eventListeners`** (`Map`): A map storing event types and their associated callback sets.
- **`scene`** (`THREE.Scene` | `null`): The scene the mesh is added to, determined via DOM query during construction.

## Usage Example

Here’s a complete example of creating an `object_3d` instance and attaching event listeners:

```javascript
import * as THREE from 'three';
import { threeEnvironment, object_3d } from './threeEnvironment.js';

// Initialize environment
const container = document.getElementById('container');
const env = new threeEnvironment(container);
container.threeEnvironment = env;

// Create a cube
const geometry = new THREE.BoxGeometry(20, 20, 20);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, 0);
const cube = new object_3d(mesh);
env.scene.add(mesh); // Explicitly add to scene

// Attach event listeners
cube.addEventListener('pointerenter', () => {
    console.log('Pointer entered cube');
    cube.setColor(0xffff00); // Yellow
});

cube.addEventListener('pointerover', () => {
    console.log('Pointer over cube');
    cube.mesh.scale.set(1.1, 1.1, 1.1); // Enlarge
});

cube.addEventListener('pointerout', () => {
    console.log('Pointer left cube');
    cube.setColor(0xff0000); // Red
    cube.mesh.scale.set(1, 1, 1); // Reset scale
});

cube.addEventListener('pointermove', () => {
    console.log('Pointer moving over cube');
    cube.mesh.rotation.y += 0.05; // Rotate
});

cube.addEventListener('pointerdown', () => {
    console.log('Pointer down on cube');
    cube.setColor(0xff00ff); // Magenta
});

cube.addEventListener('pointerup', () => {
    console.log('Pointer up on cube');
    cube.setColor(0xff0000); // Red
});

cube.addEventListener('dblclick', () => {
    console.log('Cube double-clicked');
    cube.hide();
    setTimeout(() => cube.show(), 1000); // Show after 1s
});

cube.addEventListener('contextmenu', () => {
    console.log('Context menu on cube');
    cube.mesh.rotation.x += Math.PI / 2; // Rotate 90 degrees
});

cube.addEventListener('wheel', (event) => {
    console.log('Wheel on cube');
    const delta = event.deltaY > 0 ? -1 : 1;
    cube.mesh.position.z += delta * 5; // Move z-axis
});

cube.addEventListener('dragstart', () => {
    console.log('Drag started on cube');
    const intersects = env.raycaster.intersectObjects(env.scene.children, true);
    if (intersects.length > 0) {
        cube.dragOffset = intersects[0].point.sub(cube.mesh.position);
    }
});

cube.addEventListener('drag', () => {
    console.log('Dragging cube');
    const intersects = env.raycaster.intersectObjects(env.scene.children, true);
    if (intersects.length > 0 && cube.dragOffset) {
        cube.mesh.position.copy(intersects[0].point.sub(cube.dragOffset));
    }
});

cube.addEventListener('dragend', () => {
    console.log('Drag ended on cube');
    cube.dragOffset = null;
});
```












## Supported Events

The `object_3d` class supports a variety of pointer-based events, which can be attached using `addEventListener`. Below are examples for each event type.

### pointerenter
Fires once when the pointer enters the object’s bounds.

```javascript
obj.addEventListener('pointerenter', () => {
    console.log('Pointer entered the object');
    obj.setColor(0xffff00); // Change to yellow
});
```

### pointerover
Fires when the pointer moves over the object (can fire repeatedly).

```javascript
obj.addEventListener('pointerover', () => {
    console.log('Pointer is over the object');
    obj.mesh.scale.set(1.1, 1.1, 1.1); // Enlarge slightly
});
```

### pointerout
Fires when the pointer leaves the object’s bounds.

```javascript
obj.addEventListener('pointerout', () => {
    console.log('Pointer left the object');
    obj.setColor(0xff0000); // Reset to red
    obj.mesh.scale.set(1, 1, 1); // Reset scale
});
```

### pointermove
Fires continuously as the pointer moves over the object.

```javascript
obj.addEventListener('pointermove', () => {
    console.log('Pointer moving over the object');
    obj.mesh.rotation.y += 0.05; // Rotate on y-axis
});
```

### pointerdown
Fires when a pointer button is pressed on the object.

```javascript
obj.addEventListener('pointerdown', () => {
    console.log('Pointer pressed on the object');
    obj.setColor(0xff00ff); // Change to magenta
});
```

### pointerup
Fires when a pointer button is released over the object.

```javascript
obj.addEventListener('pointerup', () => {
    console.log('Pointer released on the object');
    obj.setColor(0xff0000); // Reset to red
});
```

### dblclick
Fires when the object is double-clicked.

```javascript
obj.addEventListener('dblclick', () => {
    console.log('Object double-clicked');
    obj.hide(); // Hide the object
    setTimeout(() => obj.show(), 1000); // Show after 1 second
});
```

### contextmenu
Fires when the right mouse button is clicked on the object.

```javascript
obj.addEventListener('contextmenu', () => {
    console.log('Context menu opened on the object');
    obj.mesh.rotation.x += Math.PI / 2; // Rotate 90 degrees on x-axis
});
```

### wheel
Fires when the mouse wheel is scrolled over the object.

```javascript
obj.addEventListener('wheel', (event) => {
    console.log('Wheel scrolled on the object');
    const delta = event.deltaY > 0 ? -1 : 1;
    obj.mesh.position.z += delta * 5; // Move along z-axis
});
```

### dragstart
Fires when dragging begins on the object.

```javascript
obj.addEventListener('dragstart', () => {
    console.log('Drag started on the object');
    const intersects = env.raycaster.intersectObjects(env.scene.children, true);
    if (intersects.length > 0) {
        const point = intersects[0].point;
        obj.dragOffset = point.sub(obj.mesh.position); // Store offset
    }
});
```

### drag
Fires continuously while dragging the object.

```javascript
obj.addEventListener('drag', () => {
    console.log('Dragging the object');
    const intersects = env.raycaster.intersectObjects(env.scene.children, true);
    if (intersects.length > 0 && obj.dragOffset) {
        const point = intersects[0].point;
        obj.mesh.position.copy(point.sub(obj.dragOffset)); // Update position
    }
});
```

### dragend
Fires when dragging ends on the object.

```javascript
obj.addEventListener('dragend', () => {
    console.log('Drag ended on the object');
    obj.dragOffset = null; // Clear offset
});
```

**Note**: For dragging to work, you need to store `dragOffset` on the `object_3d` instance (e.g., as a property added dynamically).

## Full Example

Here’s a complete example combining environment setup and object creation with event handling:

```javascript
import * as THREE from 'three';
import { threeEnvironment, object_3d } from './threeEnvironment.js';

// Initialize environment
const container = document.getElementById('container');
const env = new threeEnvironment(container);
container.threeEnvironment = env;

// Create a cube
const geometry = new THREE.BoxGeometry(20, 20, 20);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, 0);
const cube = new object_3d(mesh);
env.scene.add(mesh);

// Add event listeners
cube.addEventListener('pointerenter', () => {
    console.log('Pointer entered cube');
    cube.setColor(0xffff00);
});

cube.addEventListener('pointerover', () => {
    console.log('Pointer over cube');
    cube.mesh.scale.set(1.1, 1.1, 1.1);
});

cube.addEventListener('pointerout', () => {
    console.log('Pointer left cube');
    cube.setColor(0xff0000);
    cube.mesh.scale.set(1, 1, 1);
});

cube.addEventListener('pointermove', () => {
    console.log('Pointer moving over cube');
    cube.mesh.rotation.y += 0.05;
});

cube.addEventListener('pointerdown', () => {
    console.log('Pointer down on cube');
    cube.setColor(0xff00ff);
});

cube.addEventListener('pointerup', () => {
    console.log('Pointer up on cube');
    cube.setColor(0xff0000);
});

cube.addEventListener('dblclick', () => {
    console.log('Cube double-clicked');
    cube.hide();
    setTimeout(() => cube.show(), 1000);
});

cube.addEventListener('contextmenu', () => {
    console.log('Context menu on cube');
    cube.mesh.rotation.x += Math.PI / 2;
});

cube.addEventListener('wheel', (event) => {
    console.log('Wheel on cube');
    const delta = event.deltaY > 0 ? -1 : 1;
    cube.mesh.position.z += delta * 5;
});

cube.addEventListener('dragstart', () => {
    console.log('Drag started on cube');
    const intersects = env.raycaster.intersectObjects(env.scene.children, true);
    if (intersects.length > 0) {
        cube.dragOffset = intersects[0].point.sub(cube.mesh.position);
    }
});

cube.addEventListener('drag', () => {
    console.log('Dragging cube');
    const intersects = env.raycaster.intersectObjects(env.scene.children, true);
    if (intersects.length > 0 && cube.dragOffset) {
        cube.mesh.position.copy(intersects[0].point.sub(cube.dragOffset));
    }
});

cube.addEventListener('dragend', () => {
    console.log('Drag ended on cube');
    cube.dragOffset = null;
});
```

### HTML
```html
<!DOCTYPE html>
<html>
<head>
    <title>Three.js Example</title>
</head>
<body>
    <div id="container" style="width: 800px; height: 600px;"></div>
    <script type="module" src="your-script.js"></script>
</body>
</html>
```

This README provides a comprehensive guide to using `threeEnvironment.js` and `object_3d`, with examples for all supported functionality.
```