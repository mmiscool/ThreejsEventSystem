import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import * as THREE from 'three';

export class PointerLockedTrackballControls extends TrackballControls {
    constructor(camera, domElement) {
        super(camera, domElement);

        this.noPan = true; // Disable built-in pan
        this._camera = camera;
        this._domElement = domElement;
        this._isPanning = false;
        this._initialWorldPoint = new THREE.Vector3();
        this._plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Default XY plane

        // Bindings
        this._onPointerDown = this._onPointerDown.bind(this);
        this._onPointerMove = this._onPointerMove.bind(this);
        this._onPointerUp = this._onPointerUp.bind(this);
        this._onContextMenu = e => e.preventDefault();

        // Listeners
        domElement.addEventListener('contextmenu', this._onContextMenu);
        domElement.addEventListener('pointerdown', this._onPointerDown);
        domElement.addEventListener('pointermove', this._onPointerMove);
        domElement.addEventListener('pointerup', this._onPointerUp);
    }

    dispose() {
        super.dispose();
        this._domElement.removeEventListener('contextmenu', this._onContextMenu);
        this._domElement.removeEventListener('pointerdown', this._onPointerDown);
        this._domElement.removeEventListener('pointermove', this._onPointerMove);
        this._domElement.removeEventListener('pointerup', this._onPointerUp);
    }

    _getPointerRay(clientX, clientY) {
        const rect = this._domElement.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((clientY - rect.top) / rect.height) * 2 + 1;
        const pointer = new THREE.Vector2(x, y);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(pointer, this._camera);
        return raycaster.ray;
    }

    _onPointerDown(e) {
        console.log('PointerLockedTrackballControls: Pointer down', e);
        if (e.button !== 2) return; // right-click only
        e.preventDefault();
        this._isPanning = true;

        this._startMouse = new THREE.Vector2(e.clientX, e.clientY);
        this._startCamPos = this._camera.position.clone();
        this._startTarget = this.target.clone();
    }

    _onPointerMove(e) {
        if (!this._isPanning) return;
        e.preventDefault();

        const dx = e.clientX - this._startMouse.x;
        const dy = e.clientY - this._startMouse.y;

        const element = this._domElement;
        const width = element.clientWidth;
        const height = element.clientHeight;

        const cam = this._camera;
        const left = cam.left;
        const right = cam.right;
        const top = cam.top;
        const bottom = cam.bottom;

        // compute world movement per pixel
        const worldDX = (right - left) / width;
        const worldDY = (top - bottom) / height;

        // pan in world space
        const delta = new THREE.Vector3(-dx * worldDX, dy * worldDY, 0);

        cam.position.copy(this._startCamPos.clone().add(delta));
        this.target.copy(this._startTarget.clone().add(delta));

        this.dispatchEvent({ type: 'change' });
    }

    _onPointerUp(e) {
        if (e.button === 2) {
            this._isPanning = false;
            this.dispatchEvent({ type: 'end' });
        }
    }


    /**
     * Optional: set custom pan plane (e.g. sketch plane)
     * @param {THREE.Plane} plane 
     */
    setPanPlane(plane) {
        this._plane = plane;
    }
}
