
import * as THREE from 'three';
import {
    threeEnvironment,
    object_3d
} from './threeEnvironment.js';
const container = document.getElementById('container');
const env = new threeEnvironment(container);
// Add container reference to DOM element for scene access
container.threeEnvironment = env;
export class TestObjectGenerator {
    constructor(environment) {
        if (!environment || !environment.scene) {
            throw new Error('A valid threeEnvironment instance is required');
        }
        this.environment = environment;
        this.objects = [];
        this.initObjects();
    }
    initObjects() {
        try {
            this.createCube();
            this.createSphere();
            this.createCylinder();
        } catch (error) {
            console.error('Failed to initialize objects:', error);
        }
    }
    getObjects() {
        return this.objects;
    }
    createCube() {
        try {
            const cubeGeometry = new THREE.BoxGeometry(20, 20, 20);
            const cubeMaterial = new THREE.MeshBasicMaterial({ color: 16711680 });
            const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cubeMesh.position.set(-40, 0, 0);
            const cube = new object_3d(cubeMesh);
            this.environment.scene.add(cubeMesh);
            this.objects.push(cube);
            let dragOffset = null;
            const originalColor = 16711680;
            cube.addEventListener('pointerenter', () => {
                console.log(`pointerenter triggered on cube at position: ${cube.mesh.position.x}, ${cube.mesh.position.y}, ${cube.mesh.position.z}`);
                cube.setColor(16776960);
            });
            // Yellow on enter
            cube.addEventListener('pointerover', () => {
                console.log(`pointerover triggered on cube at position: ${cube.mesh.position.x}, ${cube.mesh.position.y}, ${cube.mesh.position.z}`);
                cube.mesh.scale.set(1.1, 1.1, 1.1);
            });
            // Slightly enlarge
            cube.addEventListener('pointerout', () => {
                console.log(`pointerout triggered on cube at position: ${cube.mesh.position.x}, ${cube.mesh.position.y}, ${cube.mesh.position.z}`);
                cube.setColor(originalColor);
                // Reset color
                cube.mesh.scale.set(1, 1, 1);
            });
            // Reset scale
            cube.addEventListener('pointermove', () => {
                console.log(`pointermove triggered on cube at position: ${cube.mesh.position.x}, ${cube.mesh.position.y}, ${cube.mesh.position.z}`);
                cube.mesh.rotation.y += 0.05;
            });
            // Rotate on move
            cube.addEventListener('pointerdown', () => {
                console.log(`pointerdown triggered on cube at position: ${cube.mesh.position.x}, ${cube.mesh.position.y}, ${cube.mesh.position.z}`);
                cube.setColor(16711935);
            });
            // Magenta on press
            cube.addEventListener('pointerup', () => {
                console.log(`pointerup triggered on cube at position: ${cube.mesh.position.x}, ${cube.mesh.position.y}, ${cube.mesh.position.z}`);
                cube.setColor(originalColor);
            });
            // Reset color on release
            cube.addEventListener('dblclick', () => {
                console.log(`dblclick triggered on cube at position: ${cube.mesh.position.x}, ${cube.mesh.position.y}, ${cube.mesh.position.z}`);
                cube.hide();
                // Hide on double-click
                setTimeout(() => cube.show(), 1000);
            });
            // Show after 1s
            cube.addEventListener('contextmenu', () => {
                console.log(`contextmenu triggered on cube at position: ${cube.mesh.position.x}, ${cube.mesh.position.y}, ${cube.mesh.position.z}`);
                cube.mesh.rotation.x += Math.PI / 2;
            });
            // Rotate 90 degrees
            cube.addEventListener('wheel', event => {
                console.log(`wheel triggered on cube at position: ${cube.mesh.position.x}, ${cube.mesh.position.y}, ${cube.mesh.position.z}`);
                const delta = event.deltaY > 0 ? -1 : 1;
                cube.mesh.position.z += delta * 5;
            });
            // Move along z-axis
            cube.addEventListener('dragstart', () => {
                console.log(`dragstart triggered on cube at position: ${cube.mesh.position.x}, ${cube.mesh.position.y}, ${cube.mesh.position.z}`);
                const intersects = this.environment.raycaster.intersectObjects(this.environment.scene.children, true);
                if (intersects.length > 0) {
                    const point = intersects[0].point;
                    dragOffset = point.sub(cube.mesh.position);
                }
            });
            cube.addEventListener('drag', () => {
                console.log(`drag triggered on cube at position: ${cube.mesh.position.x}, ${cube.mesh.position.y}, ${cube.mesh.position.z}`);
                const intersects = this.environment.raycaster.intersectObjects(this.environment.scene.children, true);
                if (intersects.length > 0 && dragOffset) {
                    const point = intersects[0].point;
                    cube.mesh.position.copy(point.sub(dragOffset));
                }
            });
            cube.addEventListener('dragend', () => {
                console.log(`dragend triggered on cube at position: ${cube.mesh.position.x}, ${cube.mesh.position.y}, ${cube.mesh.position.z}`);
                dragOffset = null;
            });
            // Reset drag offset
            return cube;
        } catch (error) {
            console.error('Failed to create cube:', error);
        }
    }
    createSphere() {
        try {
            const sphereGeometry = new THREE.SphereGeometry(15, 32, 32);
            const sphereMaterial = new THREE.MeshBasicMaterial({ color: 65280 });
            const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphereMesh.position.set(0, 0, 0);
            const sphere = new object_3d(sphereMesh);
            this.environment.scene.add(sphereMesh);
            this.objects.push(sphere);
            let dragOffset = null;
            const originalColor = 65280;
            sphere.addEventListener('pointerenter', () => {
                console.log(`pointerenter triggered on sphere at position: ${sphere.mesh.position.x}, ${sphere.mesh.position.y}, ${sphere.mesh.position.z}`);
                sphere.setColor(16776960);
            });
            // Yellow on enter
            sphere.addEventListener('pointerover', () => {
                console.log(`pointerover triggered on sphere at position: ${sphere.mesh.position.x}, ${sphere.mesh.position.y}, ${sphere.mesh.position.z}`);
                sphere.mesh.scale.set(1.1, 1.1, 1.1);
            });
            // Slightly enlarge
            sphere.addEventListener('pointerout', () => {
                console.log(`pointerout triggered on sphere at position: ${sphere.mesh.position.x}, ${sphere.mesh.position.y}, ${sphere.mesh.position.z}`);
                sphere.setColor(originalColor);
                // Reset color
                sphere.mesh.scale.set(1, 1, 1);
            });
            // Reset scale
            sphere.addEventListener('pointermove', () => {
                console.log(`pointermove triggered on sphere at position: ${sphere.mesh.position.x}, ${sphere.mesh.position.y}, ${sphere.mesh.position.z}`);
                sphere.mesh.rotation.y += 0.05;
            });
            // Rotate on move
            sphere.addEventListener('pointerdown', () => {
                console.log(`pointerdown triggered on sphere at position: ${sphere.mesh.position.x}, ${sphere.mesh.position.y}, ${sphere.mesh.position.z}`);
                sphere.setColor(16711935);
            });
            // Magenta on press
            sphere.addEventListener('pointerup', () => {
                console.log(`pointerup triggered on sphere at position: ${sphere.mesh.position.x}, ${sphere.mesh.position.y}, ${sphere.mesh.position.z}`);
                sphere.setColor(originalColor);
            });
            // Reset color on release
            sphere.addEventListener('dblclick', () => {
                console.log(`dblclick triggered on sphere at position: ${sphere.mesh.position.x}, ${sphere.mesh.position.y}, ${sphere.mesh.position.z}`);
                sphere.hide();
                // Hide on double-click
                setTimeout(() => sphere.show(), 1000);
            });
            // Show after 1s
            sphere.addEventListener('contextmenu', () => {
                console.log(`contextmenu triggered on sphere at position: ${sphere.mesh.position.x}, ${sphere.mesh.position.y}, ${sphere.mesh.position.z}`);
                sphere.mesh.rotation.x += Math.PI / 2;
            });
            // Rotate 90 degrees
            sphere.addEventListener('wheel', event => {
                console.log(`wheel triggered on sphere at position: ${sphere.mesh.position.x}, ${sphere.mesh.position.y}, ${sphere.mesh.position.z}`);
                const delta = event.deltaY > 0 ? -1 : 1;
                sphere.mesh.position.z += delta * 5;
            });
            // Move along z-axis
            sphere.addEventListener('dragstart', () => {
                console.log(`dragstart triggered on sphere at position: ${sphere.mesh.position.x}, ${sphere.mesh.position.y}, ${sphere.mesh.position.z}`);
                const intersects = this.environment.raycaster.intersectObjects(this.environment.scene.children, true);
                if (intersects.length > 0) {
                    const point = intersects[0].point;
                    dragOffset = point.sub(sphere.mesh.position);
                }
            });
            sphere.addEventListener('drag', () => {
                console.log(`drag triggered on sphere at position: ${sphere.mesh.position.x}, ${sphere.mesh.position.y}, ${sphere.mesh.position.z}`);
                const intersects = this.environment.raycaster.intersectObjects(this.environment.scene.children, true);
                if (intersects.length > 0 && dragOffset) {
                    const point = intersects[0].point;
                    sphere.mesh.position.copy(point.sub(dragOffset));
                }
            });
            sphere.addEventListener('dragend', () => {
                console.log(`dragend triggered on sphere at position: ${sphere.mesh.position.x}, ${sphere.mesh.position.y}, ${sphere.mesh.position.z}`);
                dragOffset = null;
            });
            // Reset drag offset
            return sphere;
        } catch (error) {
            console.error('Failed to create sphere:', error);
        }
    }
    createCylinder() {
        try {
            const cylinderGeometry = new THREE.CylinderGeometry(10, 10, 30, 32);
            const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 255 });
            const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
            cylinderMesh.position.set(40, 0, 0);
            const cylinder = new object_3d(cylinderMesh);
            this.environment.scene.add(cylinderMesh);
            this.objects.push(cylinder);
            let dragOffset = null;
            const originalColor = 255;
            cylinder.addEventListener('pointerenter', () => {
                console.log(`pointerenter triggered on cylinder at position: ${cylinder.mesh.position.x}, ${cylinder.mesh.position.y}, ${cylinder.mesh.position.z}`);
                cylinder.setColor(16776960);
            });
            // Yellow on enter
            cylinder.addEventListener('pointerover', () => {
                console.log(`pointerover triggered on cylinder at position: ${cylinder.mesh.position.x}, ${cylinder.mesh.position.y}, ${cylinder.mesh.position.z}`);
                cylinder.mesh.scale.set(1.1, 1.1, 1.1);
            });
            // Slightly enlarge
            cylinder.addEventListener('pointerout', () => {
                console.log(`pointerout triggered on cylinder at position: ${cylinder.mesh.position.x}, ${cylinder.mesh.position.y}, ${cylinder.mesh.position.z}`);
                cylinder.setColor(originalColor);
                // Reset color
                cylinder.mesh.scale.set(1, 1, 1);
            });
            // Reset scale
            cylinder.addEventListener('pointermove', () => {
                console.log(`pointermove triggered on cylinder at position: ${cylinder.mesh.position.x}, ${cylinder.mesh.position.y}, ${cylinder.mesh.position.z}`);
                cylinder.mesh.rotation.y += 0.05;
            });
            // Rotate on move
            cylinder.addEventListener('pointerdown', () => {
                console.log(`pointerdown triggered on cylinder at position: ${cylinder.mesh.position.x}, ${cylinder.mesh.position.y}, ${cylinder.mesh.position.z}`);
                cylinder.setColor(16711935);
            });
            // Magenta on press
            cylinder.addEventListener('pointerup', () => {
                console.log(`pointerup triggered on cylinder at position: ${cylinder.mesh.position.x}, ${cylinder.mesh.position.y}, ${cylinder.mesh.position.z}`);
                cylinder.setColor(originalColor);
            });
            // Reset color on release
            cylinder.addEventListener('dblclick', () => {
                console.log(`dblclick triggered on cylinder at position: ${cylinder.mesh.position.x}, ${cylinder.mesh.position.y}, ${cylinder.mesh.position.z}`);
                cylinder.hide();
                // Hide on double-click
                setTimeout(() => cylinder.show(), 1000);
            });
            // Show after 1s
            cylinder.addEventListener('contextmenu', () => {
                console.log(`contextmenu triggered on cylinder at position: ${cylinder.mesh.position.x}, ${cylinder.mesh.position.y}, ${cylinder.mesh.position.z}`);
                cylinder.mesh.rotation.x += Math.PI / 2;
            });
            // Rotate 90 degrees
            cylinder.addEventListener('wheel', event => {
                console.log(`wheel triggered on cylinder at position: ${cylinder.mesh.position.x}, ${cylinder.mesh.position.y}, ${cylinder.mesh.position.z}`);
                const delta = event.deltaY > 0 ? -1 : 1;
                cylinder.mesh.position.z += delta * 5;
            });
            // Move along z-axis
            cylinder.addEventListener('dragstart', () => {
                console.log(`dragstart triggered on cylinder at position: ${cylinder.mesh.position.x}, ${cylinder.mesh.position.y}, ${cylinder.mesh.position.z}`);
                const intersects = this.environment.raycaster.intersectObjects(this.environment.scene.children, true);
                if (intersects.length > 0) {
                    const point = intersects[0].point;
                    dragOffset = point.sub(cylinder.mesh.position);
                }
            });
            cylinder.addEventListener('drag', () => {
                console.log(`drag triggered on cylinder at position: ${cylinder.mesh.position.x}, ${cylinder.mesh.position.y}, ${cylinder.mesh.position.z}`);
                const intersects = this.environment.raycaster.intersectObjects(this.environment.scene.children, true);
                if (intersects.length > 0 && dragOffset) {
                    const point = intersects[0].point;
                    cylinder.mesh.position.copy(point.sub(dragOffset));
                }
            });
            cylinder.addEventListener('dragend', () => {
                console.log(`dragend triggered on cylinder at position: ${cylinder.mesh.position.x}, ${cylinder.mesh.position.y}, ${cylinder.mesh.position.z}`);
                dragOffset = null;
            });
            // Reset drag offset
            return cylinder;
        } catch (error) {
            console.error('Failed to create cylinder:', error);
        }
    }
}
const testObjects = new TestObjectGenerator(env);