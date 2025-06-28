
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { object_3d } from './threeEnvironment.js';
// global variable for the scene
let scene = null;
export class threeEnvironment {
    constructor(targetElement) {
        this.init(targetElement);
    }
    init(targetElement) {
        try {
            if (!(targetElement instanceof HTMLElement)) {
                throw new Error('Target element must be an HTMLElement');
            }
            this.scene = new THREE.Scene();
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            const width = targetElement.clientWidth;
            const height = targetElement.clientHeight;
            const aspect = width / height;
            const viewSize = 100;
            this.camera = new THREE.OrthographicCamera(
                -viewSize * aspect,
                viewSize * aspect,
                viewSize,
                -viewSize,
                -1e10, // near
                1e10   // far
            );
            this.camera.position.set(0, 0, 100);
            this.camera.lookAt(0, 0, 0);
            this.renderer.setSize(width, height);
            targetElement.appendChild(this.renderer.domElement);
            this.controls = new TrackballControls(this.camera, this.renderer.domElement);
            this.controls.rotateSpeed = 2;
            this.controls.zoomSpeed = 1.2;
            this.controls.panSpeed = 4;
            // Initialize raycaster and pointer vector
            this.raycaster = new THREE.Raycaster();
            this.pointer = new THREE.Vector2();
            this.hoveredObject = null;
            this.enteredObject = null;
            // Track object for pointerenter
            this.activePointerId = null;
            this.draggingObject = null;
            // Handle pointer events
            const updatePointer = event => {
                this.pointer.x = event.clientX / window.innerWidth * 2 - 1;
                this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
                this.raycaster.setFromCamera(this.pointer, this.camera);

                const intersects = this.raycaster.intersectObjects(this.scene.children, true);
                // Filter out objects that do not have userData.object3d
                return intersects.filter(intersect => intersect.object.userData.object3d);

            };
            targetElement.addEventListener('pointermove', event => {
                try {
                    const intersects = updatePointer(event);
                    const intersectedObject = intersects.length > 0 ? intersects[0].object.userData.object3d : null;

                    // pointerenter
                    if (intersectedObject !== this.enteredObject) {
                        if (intersectedObject) {
                            intersectedObject.callEvent('pointerenter');
                        }
                        this.enteredObject = intersectedObject;
                    }

                    // pointerover and pointerout
                    if (intersectedObject !== this.hoveredObject) {
                        if (this.hoveredObject) {
                            this.hoveredObject.callEvent('pointerout');
                        }
                        if (intersectedObject) {
                            intersectedObject.callEvent('pointerover');
                        }
                        this.hoveredObject = intersectedObject;
                    }

                    // pointermove
                    if (intersectedObject) {
                        intersectedObject.callEvent('pointermove');
                    }

                    // drag
                    if (this.draggingObject) {
                        this.draggingObject.callEvent('drag');
                    }
                } catch (error) {
                    console.log('Error in pointermove handler:', error);
                }
            });

            targetElement.addEventListener('pointerdown', event => {
                try {
                    const intersects = updatePointer(event);
                    if (intersects.length > 0) {
                        const targetObject = intersects[0].object.userData.object3d;
                        this.activePointerId = event.pointerId;
                        event.target.setPointerCapture(event.pointerId); // ensure consistent pointer tracking
                        this.controls.enabled = false; // disable camera control immediately


                        targetObject.callEvent('pointerdown');

                        // dragstart
                        this.draggingObject = targetObject;
                        this.draggingObject.callEvent('dragstart');
                    }
                } catch (error) {
                    console.log('Error in pointerdown handler:', error);
                }
            });

            targetElement.addEventListener('pointerup', event => {
                try {
                    event.target.releasePointerCapture(event.pointerId);

                    const intersects = updatePointer(event);
                    if (intersects.length > 0 && event.pointerId === this.activePointerId) {
                        const targetObject = intersects[0].object.userData.object3d;
                        targetObject.callEvent('pointerup');
                    }

                    if (this.draggingObject && event.pointerId === this.activePointerId) {
                        this.draggingObject.callEvent('dragend');
                        this.draggingObject = null;

                        // Delay re-enabling camera control to avoid jump
                        setTimeout(() => {
                            this.controls.handleResize();
                            this.controls.state = -1; // reset state
                            //this.controls._onPointerCancel();
                            this.controls.enabled = true; // re-enable rotation

                            console.log(this.controls);

                        }, 50);
                    }

                    this.activePointerId = null;
                } catch (error) {
                    console.log('Error in pointerup handler:', error);
                }
            });

            targetElement.addEventListener('dblclick', event => {
                try {
                    const intersects = updatePointer(event);
                    if (intersects.length > 0) {
                        const targetObject = intersects[0].object.userData.object3d;
                        targetObject.callEvent('dblclick');
                    }
                } catch (error) {
                    console.log('Error in dblclick handler:', error);
                }
            });

            targetElement.addEventListener('contextmenu', event => {
                try {
                    event.preventDefault();
                    const intersects = updatePointer(event);
                    if (intersects.length > 0) {
                        const targetObject = intersects[0].object.userData.object3d;
                        targetObject.callEvent('contextmenu');
                    }
                } catch (error) {
                    console.log('Error in contextmenu handler:', error);
                }
            });

            targetElement.addEventListener('wheel', event => {
                try {
                    const intersects = updatePointer(event);
                    if (intersects.length > 0) {
                        const targetObject = intersects[0].object.userData.object3d;
                        targetObject.callEvent('wheel');
                    }
                } catch (error) {
                    console.log('Error in wheel handler:', error);
                }
            });

            const animate = () => {
                requestAnimationFrame(animate);
                this.controls.update();
                this.renderer.render(this.scene, this.camera);
            };
            animate();
            window.addEventListener('resize', () => {
                const newWidth = targetElement.clientWidth;
                const newHeight = targetElement.clientHeight;
                const newAspect = newWidth / newHeight;
                this.camera.left = -viewSize * newAspect;
                this.camera.right = viewSize * newAspect;
                this.camera.top = viewSize;
                this.camera.bottom = -viewSize;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(newWidth, newHeight);
            });
        } catch (error) {
            console.log('Failed to initialize Three.js environment:', error);
        }
    }

    addObject(geometryOrVector) {
        console.log('Adding object:', geometryOrVector);

        if (geometryOrVector instanceof THREE.Vector3) {
            return new point_3d(geometryOrVector, this);
        }

        const object = new object_3d(geometryOrVector, this);
        return object;
    }
    removeObject(object) {
        try {
            if (!(object instanceof object_3d)) {
                throw new Error('Object must be an instance of object_3d');
            }
            this.scene.remove(object.mesh);
            object.mesh.geometry.dispose();
            object.mesh.material.dispose();
            object.mesh = null;
        } catch (error) {
            console.log('Failed to remove object:', error);
        }
    }
    listObjects() {
        try {
            const objects = [];
            this.scene.traverse(object => {
                if (object.userData.object3d) {
                    objects.push(object.userData.object3d);
                }
            });
            return objects;
        } catch (error) {
            console.log('Failed to list objects:', error);
        }
    }
}

import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

export class object_3d extends THREE.Mesh {
    constructor(geometry, threeEnv) {
        if (!geometry.isBufferGeometry && !geometry.isGeometry) {
            throw new Error('Invalid geometry type');
        }

        const material = new THREE.MeshBasicMaterial({ color: 'red' });

        super(geometry, material);
        this.material = material;
        this.threeEnv = threeEnv;
        this.scene = threeEnv.scene;
        this.userData.object3d = this;
        this.eventListeners = new Map();

        if (this.scene) {
            this.scene.add(this);
        }

        this._addTransformControls();
    }
    _addTransformControls() {
        // We override drag behavior instead of using transform gizmo
        const plane = new THREE.Plane();
        const dragPlaneNormal = new THREE.Vector3();

        this.addEventListener('dragstart', () => {
            // Get normal from parent sketch's transform (assumed Z axis)
            const up = new THREE.Vector3(0, 0, 1);
            this.dragReference = this.position.clone();

            // Sketch should store plane in .transform
            if (this.parent && this.parent.userData.sketchPlane) {
                this.sketchPlane = this.parent.userData.sketchPlane;
            } else {
                // fallback: world Z
                this.updateMatrixWorld(true);
                const worldMatrix = this.matrixWorld; // ✅ Correct way to get world transform matrix

                dragPlaneNormal.copy(up).applyMatrix4(worldMatrix).normalize();
                plane.setFromNormalAndCoplanarPoint(dragPlaneNormal, this.position);
            }

            // Store the current sketch plane
            this.dragPlane = plane;
        });

        this.addEventListener('drag', () => {
            if (!this.dragPlane) return;

            // Calculate intersection of current pointer ray with the plane
            const ray = this.threeEnv.raycaster.ray;
            const target = new THREE.Vector3();
            ray.intersectPlane(this.dragPlane, target);

            if (target) {
                this.position.copy(target);
            }
        });

        this.addEventListener('dragend', () => {
            this.dragPlane = null;
        });

        // Disable transform controls completely
        this.transformControls = { visible: false, attach: () => { }, detach: () => { } };
    }


    set controls(visible = true) {
        this.transformControls.visible = visible;
        if (visible) {
            this.transformControls.attach(this);
            console.log('Transform controls attached to object:', this.name || 'Unnamed Object');
        } else {
            this.transformControls.detach();
            console.log('Transform controls detached from object:', this.name || 'Unnamed Object');
        }
    }

    get controls() {
        return this.transformControls.visible;
    }

    show() {
        this.visible = true;
        //this.transformControls.attach(this);
    }

    hide() {
        this.visible = false;
        //this.transformControls.detach();
    }

    addEventListener(event, callback) {
        if (typeof event !== 'string' || typeof callback !== 'function') {
            throw new Error('Invalid event or callback');
        }
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event).add(callback);
    }

    removeEventListener(event) {
        if (typeof event !== 'string') {
            throw new Error('Invalid event type');
        }
        this.eventListeners.delete(event);
    }

    callEvent(event) {
        if (typeof event !== 'string') {
            throw new Error('Invalid event type');
        }
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback.call(this);
                    console.log(`Event ${event} called on`, this.name || 'Unnamed Object');
                } catch (callbackError) {
                    console.log(`Error in ${event} callback:`, callbackError);
                }
            });
        }
    }

    setColor(color) {
        try {
            if (!this.material) {
                throw new Error('Mesh has no material to color');
            }
            this.material.color.set(color);
        } catch (error) {
            console.log('Failed to set color:', error);
        }
    }
}




export class point_3d extends THREE.Object3D {
    constructor(position, threeEnv) {
        super();

        this.threeEnv = threeEnv;
        this.scene = threeEnv.scene;
        this.userData.object3d = this;
        this.eventListeners = new Map();

        this.position.copy(position);

        const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0)]);

        const size = 64;
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        const texture = new THREE.CanvasTexture(canvas);

        this.material = new THREE.PointsMaterial({
            color: 0x00ffff,
            size: 10,
            sizeAttenuation: false,
            map: texture,
            alphaTest: 0.5,
            transparent: true,
            depthTest: false
        });

        this.pointMesh = new THREE.Points(geometry, this.material);
        this.pointMesh.userData.object3d = this;

        this.add(this.pointMesh);
        this.scene.add(this);

        // 👇 this makes the wrapper object raycastable
        this.raycast = this.pointMesh.raycast.bind(this.pointMesh);

        this._setupDragPlaneLogic();
        this._setupDummyTransformControls();
    }

    _setupDragPlaneLogic() {
        this.addEventListener('dragstart', () => {
            const up = new THREE.Vector3(0, 0, 1);
            this.dragReference = this.position.clone();

            let planeNormal;

            if (this.parent && this.parent.userData.sketchPlane) {
                this.dragPlane = this.parent.userData.sketchPlane;
            } else {
                if (this.parent && this.parent.userData.sketchPlane) {
                    this.dragPlane = this.parent.userData.sketchPlane.clone();
                    this.dragPlane.constant = -this.dragPlane.normal.dot(this.position);
                } else {
                    const up = new THREE.Vector3(0, 0, 1);
                    const normalMatrix = new THREE.Matrix3().getNormalMatrix(this.parent.matrixWorld);
                    planeNormal = up.clone().applyMatrix3(normalMatrix).normalize();
                    this.dragPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(planeNormal, this.position);
                }
            }
        });

        this.addEventListener('drag', () => {
            if (!this.dragPlane) return;

            const ray = this.threeEnv.raycaster.ray;
            const worldIntersection = new THREE.Vector3();

            if (ray.intersectPlane(this.dragPlane, worldIntersection)) {
                // Convert world point to local space of the parent (e.g., sketch transform)
                const localIntersection = this.parent.worldToLocal(worldIntersection.clone());
                this.position.copy(localIntersection);

                // Update linked 2D point if present
                if (this.userData.source2DPoint) {
                    this.userData.source2DPoint.x = localIntersection.x;
                    this.userData.source2DPoint.y = localIntersection.y;
                }
            }
        });

        this.addEventListener('dragend', () => {
            this.dragPlane = null;
        });
    }

    _setupDummyTransformControls() {
        this.transformControls = {
            visible: false,
            attach: () => { },
            detach: () => { }
        };
    }

    set controls(visible = true) {
        // no-op: transform controls disabled
    }

    get controls() {
        return false;
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    addEventListener(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event).add(callback);
    }

    removeEventListener(event) {
        this.eventListeners.delete(event);
    }

    callEvent(event) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback.call(this);
                } catch (err) {
                    console.error(`Error in ${event} callback:`, err);
                }
            });
        }
    }

    setColor(color) {
        this.pointMesh.material.color.set(color);
    }
}




export class sketch_3d {
    constructor(sketchData = { points: [], transform: null }, threeEnv) {
        if (!threeEnv) throw new Error('threeEnv is required');
        this.threeEnv = threeEnv;

        this.points = [];
        this.pointObjects = [];
        this.transform = sketchData.transform || new THREE.Object3D();

        this.transform.userData.sketchPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        this.transform.updateMatrixWorld(true);

        this.threeEnv.scene.add(this.transform); // optional: expose transform

        if (Array.isArray(sketchData.points)) {
            sketchData.points.forEach(point => {
                if (point && 'x' in point && 'y' in point) {
                    this.addPoint(point);
                } else {
                    throw new Error('Point must be { x, y }');
                }
            });
        }
    }

    addPoint(point = { x: 0, y: 0, id: null }) {
        if (!point.id) {
            point.id = this.generateID();
        }

        const pos3D = new THREE.Vector3(point.x, point.y, 0).applyMatrix4(this.transform.matrixWorld);
        const point3D = new point_3d(pos3D, this.threeEnv);
        point3D.controls = false;

        // 🔁 for bidirectional sync if needed
        point3D.userData.source2DPoint = point;
        point3D.userData.sourceSketchMatrixWorld = this.transform.matrixWorld;
        point._point3D = point3D;

        this.points.push(point);
        this.pointObjects.push(point3D);
        this.transform.attach(point3D); // optional: make point part of transform
    }

    get points3D() {
        return this.points.map(pt =>
            new THREE.Vector3(pt.x, pt.y, 0).applyMatrix4(this.transform.matrixWorld)
        );
    }

    showPoints() {
        this.pointObjects.forEach(p => p.show());
    }

    hidePoints() {
        this.pointObjects.forEach(p => p.hide());
    }

    generateID() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2);
    }

    setTransform(matrixOrObject3D) {
        if (matrixOrObject3D instanceof THREE.Object3D) {
            this.transform = matrixOrObject3D;
        } else if (matrixOrObject3D instanceof THREE.Matrix4) {
            this.transform = new THREE.Object3D();
            this.transform.applyMatrix4(matrixOrObject3D);
        } else {
            throw new Error('Invalid transform');
        }
        this._update3DPositions();
    }

    _update3DPositions() {
        this.points.forEach((pt, i) => {
            const pos = new THREE.Vector3(pt.x, pt.y, 0).applyMatrix4(this.transform.matrixWorld);
            pt._point3D.position.copy(pos);
        });
    }
}













//---------------------------------------test code---------------------------------------
// Mount into an HTML container
const container = document.getElementById('container');
const env = new threeEnvironment(container);



window.addEventListener('DOMContentLoaded', () => {
    window.env = env; // Expose env to the global scope for debugging

    // Define points in 2D sketch plane (XY)
    const sketchPoints = [
        { x: -20, y: -10 },
        { x: 20, y: -10 },
        { x: 20, y: 10 },
        { x: -20, y: 10 }
    ];

    // Create a transform to position the sketch plane in 3D
    const sketchTransform = new THREE.Object3D();
    sketchTransform.position.set(0, 0, 0);
    sketchTransform.rotation.set(THREE.MathUtils.degToRad(45), THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(90));

    // Create the sketch
    const sketch = new sketch_3d({ points: sketchPoints, transform: sketchTransform }, env);

    // Add transform controls for the whole sketch (optional)
    env.scene.add(sketch.transform);
    const sketchPlaneHelper = new THREE.AxesHelper(30);
    sketch.transform.add(sketchPlaneHelper);

    makeBox()
    // Show all point_3d objects
    sketch.showPoints();
});


function makeBox() {
    //   --- Box ---
    const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
    console.log('BoxGeometry:', boxGeometry);
    const box = env.addObject(boxGeometry);
    box.name = "myBox"; // Set a name for the box object
    box.controls = false; // Disable controls for this object
    console.log('Box:', box);
    box.position.set(0, 0, 0);
    box.setColor('orange');

    box.addEventListener('pointerenter', () => {
        box.setColor('yellow');
        console.log('Box: pointerenter');
    });
    box.addEventListener('transform', () => {
        box.setColor('yellow');
        console.log('Box: transform');
    });
    box.addEventListener('pointerover', () => {
        console.log('Box: pointerover');
    });
    box.addEventListener('pointermove', () => {
        box.scale.set(1.2, 1.2, 1.2);
        console.log('Box: pointermove');
    });
    box.addEventListener('pointerout', () => {
        box.setColor('orange');
        box.scale.set(1, 1, 1);
        console.log('Box: pointerout');
    });
    box.addEventListener('pointerdown', () => {
        console.log('Box: pointerdown');
    });
    box.addEventListener('contextmenu', () => {
        console.log('Box: pointerup');
        box.transformControls.mode = box.transformControls.mode === 'translate' ? 'rotate' : 'translate';
    });
    box.addEventListener('dblclick', () => {
        box.setColor('red');
        console.log('Box: dblclick');
        //alert(`box name: ${box.name}`); // Show box name in an alert
        //alert(`box controls: ${box.controls}`); // Show controls state in an alert
        box.controls = !box.controls; // Toggle controls on double click

    });
    box.addEventListener('contextmenu', () => {
        box.setColor('blue');
        console.log('Box: contextmenu');
    });
    box.addEventListener('wheel', () => {
        box.setColor('green');
        console.log('Box: wheel');
    });
    box.addEventListener('dragstart', () => {
        console.log('Box: dragstart');
    });
    box.addEventListener('drag', () => {
        box.rotation.y += 0.05;
        console.log('Box: drag');
    });
    box.addEventListener('dragend', () => {
        console.log('Box: dragend');
    });





    const torus = env.addObject(new THREE.TorusGeometry(10, 4, 16, 100));
    torus.position.set(20, 0, 0);
    torus.setColor('magenta');

    torus.addEventListener('wheel', () => {
        torus.scale.multiplyScalar(1.1);
        console.log('Torus: wheel');
    });
    torus.addEventListener('dblclick', () => {
        torus.scale.set(1, 1, 1);
        console.log('Torus: dblclick reset scale');
    });


    torus.addEventListener('pointerenter', () => {
        torus.setColor('yellow');
        console.log('Point: pointerenter');
    });
    torus.addEventListener('pointerout', () => {
        torus.setColor('red');
        console.log('Point: pointerout');
    });


}