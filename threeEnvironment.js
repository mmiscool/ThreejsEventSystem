
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
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
                return this.raycaster.intersectObjects(this.scene.children, true);
            };
            targetElement.addEventListener('pointermove', event => {
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
            });
            targetElement.addEventListener('pointerdown', event => {
                const intersects = updatePointer(event);
                if (intersects.length > 0) {
                    const targetObject = intersects[0].object.userData.object3d;
                    this.activePointerId = event.pointerId;
                    targetObject.callEvent('pointerdown');
                    // dragstart
                    this.draggingObject = targetObject;
                    this.draggingObject.callEvent('dragstart');
                }
            });
            targetElement.addEventListener('pointerup', event => {
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
            });
            targetElement.addEventListener('dblclick', event => {
                const intersects = updatePointer(event);
                if (intersects.length > 0) {
                    const targetObject = intersects[0].object.userData.object3d;
                    targetObject.callEvent('dblclick');
                }
            });
            targetElement.addEventListener('contextmenu', event => {
                const intersects = updatePointer(event);
                if (intersects.length > 0) {
                    const targetObject = intersects[0].object.userData.object3d;
                    targetObject.callEvent('contextmenu');
                }
            });
            targetElement.addEventListener('wheel', event => {
                const intersects = updatePointer(event);
                if (intersects.length > 0) {
                    const targetObject = intersects[0].object.userData.object3d;
                    targetObject.callEvent('wheel');
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
            console.error('Failed to initialize Three.js environment:', error);
        }
    }

    addObject(geometry) {
        console.log('Adding object:', geometry);

        const object = new object_3d(geometry, this.scene);
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
            console.error('Failed to remove object:', error);
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
            console.error('Failed to list objects:', error);
        }
    }
}
export class object_3d {
    constructor(geometry, scene) {
        console.log(scene);
        console.log(geometry);
        try {
            // teast if geometry is a valid THREE.Geometry or THREE.BufferGeometry
            if (!geometry.isBufferGeometry && !geometry.isGeometry) {
                throw new Error('Invalid geometry type');
            }
            this.mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: "red" }));
            this.mesh.userData.object3d = this;
            this.eventListeners = new Map();
            
            this.scene = scene;
            if (this.scene) {
                this.scene.add(this.mesh);
            }
        } catch (error) {
            console.error('Failed to create object_3d:', error);
        }
    }
    show() {
        this.mesh.visible = true;
    }
    hide() {
        this.mesh.visible = false;
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
                    console.error(`Error in ${event} callback:`, callbackError);
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
            console.error('Failed to set color:', error);
        }
    }
}