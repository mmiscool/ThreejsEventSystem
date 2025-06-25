
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
            this.camera = new THREE.OrthographicCamera(-viewSize * aspect, viewSize * aspect, viewSize, -viewSize, 0.1, 1000);
            this.camera.position.set(0, 0, 100);
            this.camera.lookAt(0, 0, 0);
            this.renderer.setSize(width, height);
            targetElement.appendChild(this.renderer.domElement);
            this.controls = new TrackballControls(this.camera, this.renderer.domElement);
            this.controls.rotateSpeed = 2;
            this.controls.zoomSpeed = 1.2;
            this.controls.panSpeed = 0.8;
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
                    const intersects = updatePointer(event);
                    if (intersects.length > 0 && event.pointerId === this.activePointerId) {
                        const targetObject = intersects[0].object.userData.object3d;
                        targetObject.callEvent('pointerup');
                    }

                    // dragend
                    if (this.draggingObject && event.pointerId === this.activePointerId) {
                        this.draggingObject.callEvent('dragend');
                        this.draggingObject = null;
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

    addObject(geometry) {
        console.log('Adding object:', geometry);

        const object = new object_3d(geometry, this);
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
export class object_3d {
    constructor(geometry, threeEnv) {
        this.threeEnv = threeEnv;

        // teast if geometry is a valid THREE.Geometry or THREE.BufferGeometry
        if (!geometry.isBufferGeometry && !geometry.isGeometry) {
            throw new Error('Invalid geometry type');
        }
        this.mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: "red" }));
        this.mesh.userData.object3d = this;
        this.eventListeners = new Map();

        this.scene = threeEnv.scene;
        if (this.scene) {
            this.scene.add(this.mesh);
        }


        try {




        } catch (error) {
            console.log('Failed to create object_3d:', error);
        }
        this._addTransformControls();
    }
   _addTransformControls() {
        if (!this.scene) {
            throw new Error('Scene is not initialized');
        }
        this.transformControls = new TransformControls(this.threeEnv.camera, this.threeEnv.renderer.domElement);
        console.log('TransformControls initialized:', this.transformControls);

        this.scene.add(this.transformControls.getHelper());


        // add a custom raycaster to the transform controls that only allows the first objects transformControls to be interacted with


        this.transformControls.addEventListener('dragging-changed', event => {
            console.log('Dragging changed:', event.value);
            if (event.value) {
                this.threeEnv.controls.enabled = false; // Disable trackball controls while dragging
                this.transformControls.enabled = true; // Enable transform controls
                // disable transform controls for all other objects
                this.threeEnv.scene.traverse(object => {
                    if (object.userData.object3d && object.userData.object3d !== this) {
                        object.userData.object3d.transformControls.enabled = false;
                    }
                });
            } else {
                this.threeEnv.controls.enabled = true; // Re-enable trackball controls after dragging
                                this.threeEnv.scene.traverse(object => {
                    if (object.userData.object3d && object.userData.object3d !== this) {
                        object.userData.object3d.transformControls.enabled = true; // Re-enable transform controls for other objects
                    }
                });
            }
        });

        this.transformControls.attach(this.mesh);
        this.transformControls.visible = false;
    }





    show() {
        this.mesh.visible = true;
        this.transformControls.attach(this.mesh);
    }
    hide() {
        this.mesh.visible = false;
        this.transformControls.detach();
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
                } catch (callbackError) {
                    console.log(`Error in ${event} callback:`, callbackError);
                }
            });
        }
    }
    setColor(color) {
        try {
            if (!this.mesh.material) {
                throw new Error('Mesh has no material to color');
            }
            this.mesh.material.color.set(color);
        } catch (error) {
            console.log('Failed to set color:', error);
        }
    }
}