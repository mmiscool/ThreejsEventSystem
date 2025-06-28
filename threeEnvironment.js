
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { PointerLockedTrackballControls } from './PointerLockedTrackballControls.js';
import { ArcballControls } from 'three/examples/jsm/Addons.js';

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
            this.scene.background = new THREE.Color("black"); // Set background color to black
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
            this.controls = new ArcballControls(this.camera, this.renderer.domElement);
            this.controls.cursorZoom = true; // Enable cursor zoom

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
                    if (event.button === 2) return;
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
                            //this.controls.handleResize();
                            console.log(this.controls);
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


                this.scene.traverse(obj => {
                    if (obj.userData.object3d instanceof point_3d) {
                        //console.log('Updating screen scale for point_3d:', obj.userData.object3d);
                        obj.userData.object3d.updateScreenScale();
                    }
                });


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
        const controls = new TransformControls(this.threeEnv.camera, this.threeEnv.renderer.domElement);
        controls.attach(this);
        controls.visible = false;

        this.threeEnv.scene.add(controls.getHelper());
        this.transformControls = controls;

        controls.addEventListener('dragging-changed', event => {
            this.threeEnv.controls.enabled = !event.value;

            if (event.value) {
                this.callEvent('dragstart');
            } else {
                this.callEvent('dragend');
            }
        });

        controls.addEventListener('change', () => {
            this.callEvent('transform');
        });

        // ❌ DO NOT override drag event handlers here — let callEvent do its job globally
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

        const radius = 1;
        const geometry = new THREE.SphereGeometry(radius, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ffff
        });

        this.sphereMesh = new THREE.Mesh(geometry, material);
        this.sphereMesh.userData.object3d = this;

        this.add(this.sphereMesh);
        this.scene.add(this);

        // raycast through mesh
        this.raycast = this.sphereMesh.raycast.bind(this.sphereMesh);

        this._setupDragPlaneLogic();
        this._setupDummyTransformControls();
    }

    updateScreenScale() {
        const camera = this.threeEnv.camera;
        const canvas = this.threeEnv.renderer.domElement;

        const screenHeight = canvas.clientHeight;
        const baseWorldHeight = camera.top - camera.bottom;

        // Adjust for zoom (orthographic zoom affects world units)
        const worldHeight = baseWorldHeight / camera.zoom;

        // Compute world units per screen pixel
        const pixelSize = worldHeight / screenHeight;

        const targetPixelSize = 10; // desired size in screen pixels
        const worldSize = pixelSize * targetPixelSize;

        this.scale.setScalar(worldSize);
    }

    _setupDragPlaneLogic() {
        this.addEventListener('dragstart', () => {
            const parent = this.parent;
            if (!parent) return;

            parent.updateMatrixWorld(true);

            // Define sketch plane: normal is Z-axis in local sketch space, transformed to world
            const localZ = new THREE.Vector3(0, 0, 1);
            const worldNormal = localZ.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(parent.matrixWorld)).normalize();
            const worldOrigin = parent.getWorldPosition(new THREE.Vector3());

            const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(worldNormal, worldOrigin);

            // Project current world position onto the plane to define exact offset
            const worldPos = this.getWorldPosition(new THREE.Vector3());
            plane.constant = -plane.normal.dot(worldPos);

            this.dragPlane = plane;
        });

        this.addEventListener('drag', () => {
            if (!this.dragPlane) return;

            const ray = this.threeEnv.raycaster.ray;
            const worldIntersection = new THREE.Vector3();

            if (ray.intersectPlane(this.dragPlane, worldIntersection)) {
                const localIntersection = this.parent.worldToLocal(worldIntersection.clone());
                this.position.copy(localIntersection);

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


}




export class sketch_3d {
    constructor(sketchData = { points: [], transform: null }, threeEnv) {
        if (!threeEnv) throw new Error('threeEnv is required');
        this.threeEnv = threeEnv;

        this.points = [];
        this.pointObjects = [];
        this.transform = sketchData.transform || new THREE.Object3D();

        const up = new THREE.Vector3(0, 0, 1);
        const normalMatrix = new THREE.Matrix3().getNormalMatrix(this.transform.matrixWorld);
        const normal = up.clone().applyMatrix3(normalMatrix).normalize();
        const origin = this.transform.getWorldPosition(new THREE.Vector3());
        const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(normal, origin);
        this.transform.userData.sketchPlane = plane;
        this.transform.updateMatrixWorld(true);

        this.threeEnv.scene.add(this.transform); // optional: expose transform



        // === Visual Plane Setup ===
        this._visualPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            new THREE.MeshBasicMaterial({
                color: "blue",
                opacity: 0.1,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: true
            })
        );
        this._visualPlane.raycast = () => null; // Prevent raycast interaction
        this._visualPlane.renderOrder = -1; // Always render behind other objects
        this.transform.add(this._visualPlane);
        this._updateVisualPlane();


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
    _updateVisualPlane() {
        const size = 50; // or whatever fixed size you prefer
        this._visualPlane.geometry.dispose();
        this._visualPlane.geometry = new THREE.PlaneGeometry(size, size);
        this._visualPlane.position.set(0, 0, 0);
        this._visualPlane.rotation.set(0, 0, 0); // assumes transform handles orientation
    }


    addPoint(point = { x: 0, y: 0, id: null }) {
        if (!point.id) {
            point.id = this.generateID();
        }

        // ✅ Directly use local position (Z = 0), no matrix transformation
        const localPos = new THREE.Vector3(point.x, point.y, 0);
        const point3D = new point_3d(localPos, this.threeEnv);
        point3D.controls = false;

        point3D.userData.source2DPoint = point;
        point._point3D = point3D;

        this.points.push(point);
        this.pointObjects.push(point3D);
        this.transform.add(point3D); // ✅ Add as child to keep transform local
        //this._updateVisualPlane();
        point3D.addEventListener('drag', () => this._updateVisualPlane());
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
    sketchTransform.position.set(10, 20, 30);
    sketchTransform.rotation.set(THREE.MathUtils.degToRad(45), THREE.MathUtils.degToRad(45), THREE.MathUtils.degToRad(0));

    // Create the sketch
    const sketch = new sketch_3d({ points: sketchPoints, transform: sketchTransform }, env);



    makeBox()
    // Show all point_3d objects
    sketch.showPoints();
});


function makeBox() {
    //   --- Box ---
    const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
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





    // const torus = env.addObject(new THREE.TorusGeometry(10, 4, 16, 100));
    // torus.position.set(20, 0, 0);
    // torus.setColor('magenta');

    // torus.addEventListener('wheel', () => {
    //     torus.scale.multiplyScalar(1.1);
    //     console.log('Torus: wheel');
    // });
    // torus.addEventListener('dblclick', () => {
    //     torus.scale.set(1, 1, 1);
    //     console.log('Torus: dblclick reset scale');
    // });


    // torus.addEventListener('pointerenter', () => {
    //     torus.setColor('yellow');
    //     console.log('Point: pointerenter');
    // });
    // torus.addEventListener('pointerout', () => {
    //     torus.setColor('red');
    //     console.log('Point: pointerout');
    // });


}